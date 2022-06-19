const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const Form = require('../models/formModel');
const Response = require('../models/responseModel');
const User = require('../models/userModel');

exports.getAll = factory.getAll(Response, { path: 'form' });
exports.getOne = factory.getOne(Response);
exports.deleteOne = factory.deleteOne(Response);

// MIDDLEWARE
/**
 * @middleware  setFormAndUserId
 * @description Set form and user property on request body
 **/
 exports.setFormAndUserId = (req, res, next) => {
  if (!req.body.form) req.body.form = req.body.params.formId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * @middleware  validateFormId
 * @description Validate form id
 **/
 exports.validateFormId = catchAsync(async (req, res, next) => {
  const form = await Form.findById(req.body.params.formId);
  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }
  next();
});

exports.createOne = catchAsync(async (req, res, next) => {
  let doc = await Response.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc
    },
  });
});

/**
 * @function  getResponsesByUser
 * @description Find all responses created by user given by userID
 **/
exports.getResponsesByUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  let responses = await Response.find(
    { user: { $eq: req.params.userId }}
  );

  const responsesPaginate = new APIFeatures(
    Response.find(
        { user: { $eq: req.params.userId } },
    ),
    req.query
  )
    .sort()
    .paginate();

  let doc = await responsesPaginate.query;

  res.status(200).json({
    status: 'success',
    total: responses.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});