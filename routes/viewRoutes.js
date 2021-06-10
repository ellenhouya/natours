const express = require('express');
const {
  getOverview,
  getTour,
  getHomepage,
  getLoginForm,
  getAccount,
  updateUserData,
  signupForm,
  manageToursForm,
  forgotePasswordForm,
  getMyBookings,
  getMyReviews,
  getReviewForm,
  getMyFavoriteTours,
  getReviewUpdateForm,
  getAllUsersForm,
  userUpdateForm,
  getAllReviewsForm,
  getReviewUpdateForm_admin,
  getAllBookingsForm,
  getBookingsUpdateForm,
  highestRating,
  lowestRating,
  sortBycreateAt,
  renderAll,
  sortByEmail,
  sortByName,
  renderTop5,
} = require('../controllers/viewsController');

const { createBookingCheckout } = require('../controllers/bookingController');

const {
  aliasTopTours,
  heighestPrice,
  lowestPrice,
} = require('../controllers/tourController');

const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

const {
  isLoggedIn,
  protect,
  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, renderAll(Tour, 'overview'));

router.get(
  '/top-5-cheap',
  isLoggedIn,
  aliasTopTours,
  renderTop5(Tour, 'overview')
);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/homepage', isLoggedIn, getHomepage);
router.get('/manageTour', manageToursForm);

router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);

router.get('/my-bookings', protect, getMyBookings);
router.get('/my-reviews', protect, getMyReviews);
router.get('/write-a-review/:tourId', protect, getReviewForm);
router.get('/my-favorite-tours', protect, getMyFavoriteTours);
router.get('/reviewUpdateForm', protect, getReviewUpdateForm);
router.get(
  '/review-update-form-admin/:reviewId/:userId/:tourId',
  protect,
  getReviewUpdateForm_admin
);

router.get(
  '/manage-reviews',
  protect,
  restrictTo('admin'),
  renderAll(Review, 'myReviews')
);

router.get(
  '/manage-users',
  protect,
  restrictTo('admin'),
  renderAll(User, 'allUsers')
);

router.get(
  '/manage-bookings',
  protect,
  restrictTo('admin'),
  getAllBookingsForm
);
router.get(
  '/bookings-update-form/:bookingId',
  protect,
  restrictTo('admin'),
  getBookingsUpdateForm
);

router.get(
  '/user-update-form/:userId',
  protect,
  restrictTo('admin'),
  userUpdateForm
);

router.post('/submit-user-data', protect, updateUserData);

router.route('/signup').get(signupForm);

router.route('/forgot-password').get(forgotePasswordForm);

module.exports = router;
