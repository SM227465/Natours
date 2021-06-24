const express = require('express');
const viewController = require('../controllers/view');
const authController = require('../controllers/auth');
const bookingController = require('../controllers/booking');

const router = express.Router();

router.use(viewController.alerts);

router.get(
  '/signup',
  authController.isLoggedIn,
  viewController.getSignupForm,
  authController.signup
);
router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
