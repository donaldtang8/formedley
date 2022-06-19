const express = require('express');
const authController = require('./../controllers/authController');
const formController = require('../controllers/formController');
const responseController = require('./../controllers/responseController');

// router middleware
const router = express.Router();

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router
    .route('/')
    .get(responseController.validateFormId, responseController.getAll)
    .post(responseController.validateFormId, responseController.setFormAndUserId, responseController.createOne);

router
    .route('/:id')
    .get(responseController.getOne)
    .delete(responseController.deleteOne);

module.exports = router;
