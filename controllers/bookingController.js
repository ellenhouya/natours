const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-bookings?alert=booking`,
    // success_url: `${req.protocol}://${req.get('host')}/my-bookings`,

    metadata: {
      startDate: req.params.startDate,
      quantity: req.params.quantity,
      price: tour.price,
    },

    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}&quantity=${
    //   req.params.quantity
    // }&startDate=${req.params.startDate}`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,

    client_reference_id: req.params.tourId,

    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        // images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: req.params.quantity * 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = async (session) => {
  // make sure that the properties are consistent with the ones on stripe response

  const tour = session.client_reference_id;

  const user = (await User.findOne({ email: session.customer_email })).id;

  const { startDate, quantity, price } = session.metadata;

  const tourDB = await Tour.findById(tour);

  const soldOutObj = tourDB.datesAndSoldOut.find(
    (obj) => obj.date.toLocaleString() === new Date(startDate).toLocaleString()
  );

  if (soldOutObj.participants + quantity * 1 > tourDB.maxGroupSize) {
    return next(
      new AppError(
        `Max group size reached. Only ${
          tourDB.maxGroupSize - soldOutObj.participants
        } spot(s) left`,
        400
      )
    );
  }

  await Tour.findOneAndUpdate(
    {
      _id: tour,
      datesAndSoldOut: {
        $elemMatch: {
          date: startDate,
        },
      },
    },
    {
      $inc: { 'datesAndSoldOut.$.participants': quantity },
      $set: {
        'datesAndSoldOut.$.soldOut':
          soldOutObj.participants + quantity * 1 === tourDB.maxGroupSize
            ? true
            : false,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await Booking.create({
    tour,
    user,
    price,
    quantity,
    startDateSelected: startDate,
  });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createBooking = createOne(Booking);
exports.getBooking = getOne(Booking);
exports.getAllBookings = getAll(Booking);
exports.updateBooking = updateOne(Booking);
exports.deleteBooking = deleteOne(Booking);
