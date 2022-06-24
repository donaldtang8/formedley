const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const Form = require('../models/formModel');
const Response = require('../models/responseModel');
const User = require('../models/userModel');

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

/**
 * @function  getOne
 * @description Get response given id
 **/
exports.getOne = catchAsync(async(req, res, next) => {
  const form = await Form.findById(req.body.form);

  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }

  const response = await Response.findById(req.params.id);

  if (!response) {
    return next(new AppError('No response found by that id', 400));
  }

  if (form.user._id.toString() !== req.user.id && response.user._id.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to do this', 401));
  }

  const doc = await Response.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No doc found by that id', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  })
})

/**
 * @function  getFormResponses
 * @description Get all responses of form
 **/
exports.getFormResponses = catchAsync(async(req, res, next) => {
  const form = await Form.findById(req.body.form);

  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }

  if (form.user._id.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to do this', 401));
  }

  const formDoc = new APIFeatures(
    Form.findById(req.body.form)
      .populate('responses'),
    req.query
  );

  let doc = await formDoc.query;

  res.status(200).json({
    status: 'success',
    data: {
      doc: doc.responses
    },
  });
})

/**
 * @function  createOne
 * @description Create a new response
 **/
exports.createOne = catchAsync(async (req, res, next) => {
  let doc = await Response.create(req.body);

  let form = await Form.findById(req.body.form);

  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }

  form.responses.push(doc.id);
  await form.save({
    validateBeforeSave: false
  });

  res.status(201).json({
    status: 'success',
    data: {
      doc
    },
  });
});

/**
 * @function  getNewResponses
 * @description Get new (unread) responses given a form id
 **/
 exports.getNewResponses = catchAsync(async (req, res, next) => {
  let form = await Form.findById(req.body.form);

  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }

  let responses = await Response.find({
    $and: [
      { form: { $eq: req.body.form } },
      { viewed: { $eq: false } }
    ]
  })

  let responseDocQuery = new APIFeatures(
    Response.find({
      $and: [
        { form: { $eq: req.body.form } },
        { viewed: { $eq: false } }
      ]
    }), req.query)
      .paginate();
  
  let responseDoc = await responseDocQuery.query;

  res.status(201).json({
    status: 'success',
    total: responses.length,
    results: responseDocQuery.length,
    data: {
      doc: responseDoc
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

  if (req.user.id !== req.params.userId) {
    return next(new AppError('You do not have permission to do this', 401));
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

/**
 * @function  viewResponseById
 * @description Set response to viewed given response id
 **/
 exports.viewResponseById = catchAsync(async (req, res, next) => {
  const form = await Form.findById(req.body.form);

  if (!form) {
    return next(new AppError('No form found by that id', 400));
  }

  const response = await Response.findById(req.params.id);

  if (!response) {
    return next(new AppError('Doc does not exist', 404));
  }

  if (form.user._id.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to do this', 401));
  }
  
  if(response.viewedResponse()) {
    return next(new AppError('Doc has been viewed', 400));
  }

  await Response.findByIdAndUpdate(
    req.params.id,
    {
      viewed: true
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
  });
});