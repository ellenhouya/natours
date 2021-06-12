const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Bookings = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res
    .status(200)

    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('overview', {
      title: 'All Tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  const bookings = await Booking.find({
    user: req.user._id,
  });

  const wasPurchased = bookings.some((booking) => {
    return booking.tour._id.toString() === tour._id.toString();
  });

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
      wasPurchased,
    });
});

exports.getHomepage = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res
    .status(200)

    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('homepage', {
      tours,
      title: 'Homepage',
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
  res
    .status(200)

    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('account', {
      title: 'Your account',
    });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Bookings.find({ user: req.user._id });

  const tours = await Promise.all(
    bookings.map(async (booking) => await Tour.findById(booking.tour._id))
  );

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('overview', {
      title: 'My Tours',
      tours,
      bookings,
    });
});

exports.getMyFavoriteTours = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('favoriteTours');

  const tours = user.favoriteTours;

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('overview', {
      title: 'My Favorite Tours',
      tours,
    });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    user: req.user._id,
  });

  const toursIDs = reviews.map((review) => review.tour);

  const tours = await Promise.all(
    toursIDs.map(async (id) => await Tour.findById(id))
  );

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('myReviews', {
      reviews,
      tours,
      title: 'My Reviews',
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('account', {
      title: 'Your account',
      user: updatedUser,
    });
});

exports.signupForm = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('signup', {
      title: 'Create your acount',
    });
};

exports.manageToursForm = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res
    .status(200)

    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('manageTour', {
      title: 'Manage Tours',
      tours,
    });
});

exports.getReviewForm = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('reviewForm', {
      title: 'Review Form',
      tour,
    });
});

exports.getReviewUpdateForm = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    user: req.user._id,
  });

  const toursIDs = reviews.map((review) => review.tour);

  const tours = await Promise.all(
    toursIDs.map(async (id) => await Tour.findById(id))
  );

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('myReviews', {
      reviews,
      tours,
      title: 'Update My Reviews',
    });
});

exports.getReviewUpdateForm_admin = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  const user_nonAdmin = await User.findById(req.params.userId);

  const tour = await Tour.findById(req.params.tourId);

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('reviewUpdateForm_admin', {
      review,
      user_nonAdmin,
      tour,
      title: 'Update User Reviews',
    });
});

exports.getAllUsersForm = catchAsync(async (req, res) => {
  const users = await User.find().populate({
    path: 'favoriteTours',
  });

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('allUsers', {
      users,
      title: 'All Users',
    });
});

exports.getAllReviewsForm = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  const toursIDs = reviews.map((review) => review.tour);

  const tours = await Promise.all(
    toursIDs.map(async (id) => await Tour.findById(id))
  );

  const users = await reviews.map((review) => review.user);

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('myReviews', {
      reviews,
      tours,
      users,
      title: 'All Reviews',
    });
});

exports.userUpdateForm = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate({
    path: 'favoriteTours',
  });

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('allUsers', {
      user_nonAdmin: user,
      title: 'Update User',
    });
});

exports.getAllBookingsForm = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('bookings', {
      bookings,
      title: 'All Bookings',
    });
});

exports.getBookingsUpdateForm = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('bookingsUpdateForm', {
      booking,
      title: 'Update Booking',
    });
});

exports.highestRating = (req, res, next) => {
  req.query.sort = '-rating -createAt';

  next();
};

exports.lowestRating = (req, res, next) => {
  req.query.sort = 'rating -createAt';

  next();
};

exports.sortBycreateAt = (req, res, next) => {
  req.query.sort = '-createAt -rating';

  next();
};

exports.sortByEmail = (req, res, next) => {
  req.query.sort = 'email';

  next();
};

exports.sortByName = (req, res, next) => {
  req.query.sort = 'name';

  next();
};

exports.forgotePasswordForm = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('forgotPassword', {
      title: 'Forgot Password',
    });
};

exports.passwordResetForm = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "img-src 'self' data:")
    .render('passwordReset', {
      title: 'Password Reset',
    });
};

exports.renderAll = (Model, htmlTemplate) =>
  catchAsync(async (req, res, next) => {
    let title;
    let defaultOption;
    let defaultFilter;
    let defaultNum;
    let url = req.originalUrl;

    let filter = {};

    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (htmlTemplate === 'allUsers') {
      title = 'All Users';

      if (req.query.sort) {
        defaultOption = req.query.sort;
      }

      if (Object.keys(req.query).length === 2) {
        const arr_filter = url.split('&')[1].split('=');
        defaultNum = arr_filter[1];
      }

      features.query.populate({
        path: 'favoriteTours',
        select: '_id name price startDates',
      });
    }

    let doc = await features.query;

    let toursIDs;
    let toursForReviews;
    let usersForReviews;

    if (htmlTemplate === 'myReviews') {
      title = 'All Reviews';

      if (req.query.sort) {
        defaultOption = req.query.sort;
      }

      toursIDs = doc.map((review) => review.tour);

      toursForReviews = await Promise.all(
        toursIDs.map(async (id) => await Tour.findById(id))
      );

      usersForReviews = await doc.map((review) => review.user);

      if (Object.keys(req.query).length === 2) {
        const arr_filter = url.split('&')[1].split('=');
        defaultFilter = arr_filter[0];
        defaultNum = arr_filter[1];
      }
    }

    if (htmlTemplate === 'overview') {
      title = 'All Tours';

      if (req.query.sort) {
        defaultOption = req.query.sort;
      }

      if (Object.keys(req.query).length >= 2) {
        const arr_filter = url.split('?')[1].split('&')[1].split('=');
        defaultFilter = arr_filter[0];
        defaultNum = arr_filter[1];
      }
    }

    const renderData = {
      title: title,
      defaultOption,
      defaultFilter,
      defaultNum,
      reviews: doc,
      tours: toursForReviews ? toursForReviews : doc,
      users: usersForReviews ? usersForReviews : doc,
    };

    res
      .status(200)
      .set('Content-Security-Policy', "img-src 'self' data:")
      .render(htmlTemplate, { ...renderData });
  });

exports.renderTop5 = () =>
  catchAsync(async (req, res, next) => {
    let defaultOption;
    let defaultFilter;
    let defaultNum;
    let url = req.originalUrl;

    let filter = {};

    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Tour.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let doc = await features.query;

    if (url === '/top-5-cheap') {
      await Promise.all(
        doc.map(async (tour) => {
          tour.top5 = true;
          await tour.save();
        })
      );
    }

    function getTop5Tours() {
      return Tour.find({
        top5: true,
      });
    }

    if (url === '/top-5-cheap') {
      defaultOption = url.split('/')[1];
    }

    if (url.includes('?')) {
      defaultOption = 'top-5-cheap';
      const arr_filter = url.split('&')[1].split('=');
      defaultFilter = arr_filter[0];
      defaultNum = arr_filter[1];

      if (url.includes('price')) {
        doc = await getTop5Tours().find({
          price: url.includes('[lt]')
            ? { $lt: defaultNum }
            : { $gt: defaultNum },
        });
      }

      if (url.includes('ratingsAverage')) {
        doc = await getTop5Tours().find({
          ratingsAverage: { $gt: defaultNum },
        });
      }

      if (url.includes('duration')) {
        doc = await getTop5Tours().find({
          duration: defaultNum,
        });
      }
      if (url.includes('maxGroupSize')) {
        doc = await getTop5Tours().find({
          maxGroupSize: url.includes('[lt]')
            ? { $lt: defaultNum }
            : { $gt: defaultNum },
        });
      }
    }

    const renderData = {
      title: 'Top 5 Tours',
      defaultOption,
      defaultFilter,
      defaultNum,
      tours: doc,
    };

    res
      .status(200)
      .set('Content-Security-Policy', "img-src 'self' data:")
      .render('overview', { ...renderData });
  });
