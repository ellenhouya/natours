const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMyFavoriteTours,
} = require('./../controllers/userController');

const {
  singup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = require('./../controllers/authController');

const { passwordResetForm } = require('./../controllers/viewsController');

const router = express.Router();

router.post('/signup', singup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);

router
  .route('/resetPassword/:token')
  .get(passwordResetForm)
  .patch(resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

router.patch('/updateMyFavoriteTours/:tourName', updateMyFavoriteTours);

router.delete('/deleteMe', deleteMe);

router.get('/me', getMe, getUser);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(uploadUserPhoto, resizeUserPhoto, updateUser)
  .delete(deleteUser);

module.exports = router;
