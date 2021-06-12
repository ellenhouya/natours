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

    success_url: `${req.protocol}://${req.get('host')}/my-bookings`,

    metadata: {
      startDate: `${req.params.startDate}`,
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

    // line_items: [
    //   {
    //     quantity: req.params.quantity * 1,
    //     price_data: {
    //       currency: 'usd',
    //       unit_amount: tour.price * 100,
    //       product_data: {
    //         name: `${tour.name} Tour`,
    //         description: tour.summary,
    //         images: [
    //           `${req.protocol}://${req.get('host')}/img/tours/${
    //             tour.imageCover
    //           }`,
    //         ],
    //       },
    //     },
    //   },
    // ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

//

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // const { tour, quantity, startDate } = req.query;
//   const { tour, user, price, quantity, startDate } = req.query;

//   if (!tour || !user || !price || !quantity || !startDate) return next();

//   const tourDB = await Tour.findById(tour);
//   const soldOutObj = tourDB.datesAndSoldOut.find(
//     (obj) => obj.date.toLocaleString() === new Date(startDate).toLocaleString()
//   );

//   if (soldOutObj.participants + quantity * 1 > tourDB.maxGroupSize) {
//     return next(
//       new AppError(
//         `Max group size reached. Only ${
//           tourDB.maxGroupSize - soldOutObj.participants
//         } spot(s) left`,
//         400
//       )
//     );
//   }

//   await Tour.findOneAndUpdate(
//     {
//       _id: tour,
//       datesAndSoldOut: {
//         $elemMatch: {
//           date: startDate,
//         },
//       },
//     },
//     {
//       $inc: { 'datesAndSoldOut.$.participants': quantity },
//       $set: {
//         'datesAndSoldOut.$.soldOut':
//           soldOutObj.participants + quantity * 1 === tourDB.maxGroupSize
//             ? true
//             : false,
//       },
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   await Booking.create({ tour, user, price, quantity });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
  console.log(session);

  const tour = session.client_reference_id;

  const user = (await User.findOne({ email: session.customer_email })).id;

  // const { price } = await Tour.findById(tour);
  // const price = session.amount_total / 100;
  const price = session.line_items[0].amount / 100;

  const { startDate } = session.metadata;

  const quantity = session.line_items[0].quantity;

  const tourDB = await Tour.findById(tour);

  console.log(tour, user, price, startDate, quantity);

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

  await Booking.create({ tour, user, price, quantity });
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

  console.log(event);

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
