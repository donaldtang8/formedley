const express = require('express');
const authController = require('./../controllers/authController');
const responseController = require('./../controllers/responseController');

// router middleware
const router = express.Router();

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router
    .route('/')
    .get(responseController.validateFormId, responseController.setFormAndUserId, responseController.getFormResponses)
    .post(responseController.validateFormId, responseController.setFormAndUserId, responseController.createOne);

router
    .route('/new')
    .get(responseController.validateFormId, responseController.setFormAndUserId, responseController.getNewResponses);

router
    .route('/:id/view')
    .patch(responseController.validateFormId, responseController.setFormAndUserId, responseController.viewResponseById);

router
    .route('/:id')
    .get(responseController.validateFormId, responseController.setFormAndUserId, responseController.getOne);

module.exports = router;
