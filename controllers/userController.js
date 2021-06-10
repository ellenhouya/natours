const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');
const Tour = require('../models/tourModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  console.log(req.file.filename);

  await sharp(req.file.buffer)
    .resize(500, 500)

    .toFormat('jpeg')
    .jpeg({ quality: 90 })

    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) filteredBody.photo = req.file.filename;

  const updateUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.updateMyFavoriteTours = catchAsync(async (req, res, next) => {
  const tourName = req.params.tourName;

  const favoriteTour = await Tour.findOne({
    name: tourName,
  });

  const user = await User.findById(req.user.id);

  if (!user.favoriteTours.includes(favoriteTour.id)) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { favoriteTours: favoriteTour.id },
    });
  } else {
    const arr = user.favoriteTours;
    arr.splice(arr.indexOf(favoriteTour.id), 1);

    await User.findByIdAndUpdate(req.user.id, { favoriteTours: arr });
  }

  res.status(200).json({
    status: 'success',
    data: {
      favoriteTour,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined! Please use /signup indtead',
  });
};

exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
