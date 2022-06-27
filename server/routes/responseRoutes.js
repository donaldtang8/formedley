const express = require('express');
const authController = require('./../controllers/authController');
const responseController = require('./../controllers/responseController');
const Response = require('../models/responseModel');

// router middleware
const router = express.Router();

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

// from form route
router
    .route('/')
    .get(responseController.validateFormId, responseController.setFormAndUserId, responseController.getFormResponses)
    .post(responseController.validateFormId, responseController.setFormAndUserId, responseController.createOne);

router
    .route('/new')
    .get(responseController.validateFormId, responseController.setFormAndUserId, responseController.getNewResponses);

router
    .route('/:id/view')
    .patch(
        responseController.setFormAndUserId,
        responseController.viewResponseById
    );

router
    .route('/:id')
    .get(
        responseController.validateFormId,
        responseController.setFormAndUserId,
        responseController.getOne
    )
    .delete(
        authController.restrictToMe(Response),
        responseController.validateFormId,
        responseController.setFormAndUserId,
        responseController.validateResponseId,
        responseController.deleteOne
    );

// response route
router
    .route('/user/me')
    .get(responseController.getMyResponses);

router.use(authController.restrictTo('admin'));

router
    .route('/user/:userId')
    .get(responseController.getResponsesByUser);


module.exports = router;
