const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const User = require('./../models/userModel');

// router middleware
const router = express.Router();

/* NON AUTHENTICATED ROUTES */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

/* AUTHENTICATED ROUTES */
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUserById);
router.patch('/updateMe', userController.updateMe);
router.patch('/updatePassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));

router
  .route('/id/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser);

router
  .route('/')
  .get(userController.getAllUsers);

module.exports = router;
