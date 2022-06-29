const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const User = require('./../models/userModel');

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

/**
 * @helper  filterObj
 * @param obj The object that we will filter
 * @param allowedFields A list of fields that will be allowed in object
 * @description Utility function used to filter out req.body object and only keep fields we allow
 **/
const filterObj = (obj, ...allowedFields) => {
  // new object will contain the new object with all the allowed fields
  const newObj = {};
  // loop through each key in object and check if they are allowed
  Object.keys(obj).forEach((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem];
  });
  // return new object
  return newObj;
};

/**
 * @middleware  getMe
 * @description Get own user's user document
 **/
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 * @middleware  setMe
 * @description Set user property on request body to user's id
 **/
exports.setMe = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

/**
 * @function  getUserById
 * @description Retrieve user document given ID
 **/
exports.getUserById = catchAsync(async (req, res, next) => {
  let doc = await User.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No account found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

/**
 * @function  updateMe
 * @description Update own user's user document
 **/
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Please use update password route for any changes to password',
        400
      )
    );
  }

  let convertBody = {};
  if (req.body.firstName) convertBody.fName = req.body.firstName;
  if (req.body.lastName) convertBody.lName = req.body.lastName;

  const filteredBody = filterObj(
    convertBody,
    'fName',
    'lName',
    'email',
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      doc: updatedUser,
    },
  });
});