const jwt = require('jsonwebtoken');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const User = require('../models/userModel');

/**
 * @middleware  protect
 * @description Checks that request is being made from authenticated user
 **/
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not authorized to access this page', 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  req.user = user;
  next();
});

/**
 * @middleware  restrictTo
 * @description Restricts route to certain roles
 **/
exports.restrictTo = (...roles) => {
  // '...roles' is an array of roles that will define what roles can access the route - ex. ['admin', 'lead-guide']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

/**
 * @middleware  restrictToMe
 * @description Restricts route to owner of document
 **/
exports.restrictToMe = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (req.user.id !== doc.user._id.toString()) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    } else {
      next();
    }
  });

/**
 * @helper  signToken
 * @description Signs JWT token with expires options
 * @param id  Accepts userId as parameter
 * @return  Returns signed JWT token
 **/
const signToken = (id) => {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * @helper  createSendToken
 * @description Creates and sends JWT token
 * @param user  User object of the owner of token
 * @param statusCode Response status code
 * @param res Response object
 **/
const createSendToken = (user, statusCode, res) => {
  // sign token with user id
  const token = signToken(user._id);
  // define cookie options with expires time and httpOnly option
  let days = 7;
  let expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const cookieOptions = {
    expires: expirationDate,
    httpOnly: true,
  };
  // in development mode, http is used, so we do not use the secure option in development mode, only in production mode
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // return jwt in cookie
  res.cookie('jwt', token, cookieOptions);
  // remove password from output
  user.pass = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: user,
      token: token,
      expiresIn: expirationDate,
    },
  });
};

/**
 * @function  signup
 * @description Signup user
 **/
exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: 'user',
    pass: req.body.password,
    passConfirm: req.body.passwordConfirm,
  });
  // const URL = `${req.protocol}://${req.headers['x-forwarded-host']}/account`;
  // await new Email(newUser, URL).sendWelcome();
  createSendToken(newUser, 201, res);
});

/**
 * @function  login
 * @description Login user
 **/
exports.login = catchAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  const user = await User.findOne({
    email: email
  }).select('+pass');
  if (!user) return next(new AppError('Incorrect email or password', 401));
  if (user.banExpires)
    return next(
      new AppError(
        'This account has been suspended until ' +
        user.banExpires.toLocaleDateString(),
        401
      )
    );
  // call the instance method "correctPassword" to check if password is correct
  const correct = await user.correctPassword(password, user.pass);
  if (!correct) return next(new AppError('Incorrect email or password', 401));

  createSendToken(user, 200, res);
});

/**
 * @function  logout
 * @description Logout user
 **/
exports.logout = (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success'
  });
};

/**
 * @function  updatePassword
 * @description Updates user's password
 **/
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+pass');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.pass))) {
    return next(new AppError('Your current password is incorrect', 400));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Both password fields must match!', 400));
  }

  if (await user.correctPassword(req.body.password, user.pass)) {
    return next(new AppError('Please use a different password', 400));
  }
  user.pass = req.body.password;
  user.passConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});