const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const Form = require('../models/formModel');
const User = require('../models/userModel');

exports.getAll = factory.getAll(Form, { path: 'responses' });
exports.deleteOne = factory.deleteOne(Form);

// MIDDLEWARE
/**
 * @middleware  setParams
 * @description Set parameters from request to body
 **/
 exports.setParams = catchAsync(async (req, res, next) => {
  req.body.params = req.params;
  next();
});

exports.createOne = catchAsync(async (req, res, next) => {
  let doc = await Form.create(req.body);
  
  let popDoc = await Form.findById(doc._id)
    .populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    })
    .populate('responses');

  req.body.doc = popDoc;

  res.status(201).json({
    status: 'success',
    data: {
      doc: popDoc,
    },
  });
});

/**
 * @function  getOne
 * @description Find and return
 **/
exports.getOne = catchAsync(async (req, res, next) => {
  const doc = await Form.findById(req.params.id)
    .populate('user')
    .populate('responses');

  if (!doc) {
    return next(new AppError('No document found with that ID', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

/**
 * @function  getFormsByUser
 * @description Find all forms created by user given by userID
 **/
exports.getFormsByUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('User does not exist', 404));
  }

  let forms = await Form.find(
    { user: { $eq: req.params.userId }}
  );

  const formsPaginate = new APIFeatures(
    Form.find(
        { user: { $eq: req.params.userId } },
    ),
    req.query
  )
    .sort()
    .paginate();

  let doc = await formsPaginate.query;

  res.status(200).json({
    status: 'success',
    total: forms.length,
    results: doc.length,
    data: {
      doc,
    },
  });
});

/**
 * @function  likeFormById
 * @description Like form given form id
 **/
exports.likeFormById = catchAsync(async(req, res, next) => {
  const form = await Form.findById(req.params.id);

  if (!form) {
    return next(new AppError('Doc does not exist', 400));
  }

  if (form.likedForm(req.user.id)) {
    return next(new AppError('Already liked form', 400));
  }

  const newForm = await Form.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { likeCount: 1 },
      $push: { likes: req.user.id },
    },
    { new: true }
  )

  res.status(200).json({
    status: 'success',
    data: {
      doc: newForm.likes
    }
  });
})

/**
 * @function  unlikeFormById
 * @description Like form given form id
 **/
 exports.unlikeFormById = catchAsync(async(req, res, next) => {
  const form = await Form.findById(req.params.id);

  if (!form) {
    return next(new AppError('Doc does not exist', 400));
  }

  if (!form.likedForm(req.user.id)) {
    return next(new AppError('Form has not been liked', 400));
  }

  const newForm = await Form.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { likeCount: -1 } ,
      $pull: { likes: req.user.id },
    },
    { new: true }
  )

  res.status(200).json({
    status: 'success',
    data: {
      doc: newForm.likes
    }
  });
})

/**
 * @function  viewFormById
 * @description View form given form id
 **/
 exports.viewFormById = catchAsync(async(req, res, next) => {
  const form = await Form.findById(req.params.id);

  if (!form) {
    return next(new AppError('Doc does not exist', 400));
  }

  if (form.viewedForm(req.user.id)) {
    return next(new AppError('Form has been viewed', 400));
  }

  const newForm = await Form.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { viewCount: 1 },
      $push: { views: req.user.id }
    },
    { new: true }
  )

  res.status(200).json({
    status: 'success',
    data: {
      doc: newForm.views
    }
  });
})