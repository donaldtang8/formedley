const express = require('express');
const authController = require('../controllers/authController');
const formController = require('../controllers/formController');
const userController = require('../controllers/userController');
const Form = require('../models/formModel');

// router middleware
const router = express.Router();
const responseRouter = require('./responseRoutes');

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.use('/:formId/responses', formController.setParams, responseRouter);

router
    .route('/')
    .get(formController.getAll)
    .post(userController.setMe, formController.createOne);

router
    .route('/user/:userId')
    .get(formController.getFormsByUser);

router
    .route('/id/:id')
    .get(formController.getOne)
    .delete(
      authController.restrictToMe(Form),
      formController.deleteOne
    );

router
    .route('/like/:id')
    .patch(formController.likeFormById);

router
    .route('/unlike/:id')
    .patch(formController.unlikeFormById);

router
    .route('/view/:id')
    .patch(formController.viewFormById);

module.exports = router;
