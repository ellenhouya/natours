const express = require('express');

const {
  getCheckoutSession,
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, restrictTo } = require('../controllers/authController');
const Booking = require('../models/bookingModel');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get(
  '/checkout-session/:tourId/:quantity/:startDate',
  getCheckoutSession
);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;