import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { signup } from './signup';
import { bookTour } from './stripe';
import { addTour, deleteTour, updateTour } from './manageTours';
import { deleteUser, updateUser } from './manageUsers';
import { submitReview } from './submitReview';
import { updateReview } from './updateReview';
import { showAlert } from './alerts';
import {
  manageFavoriteTours,
  removeTourFromFavoriteList,
} from './manageFavoriteTours';
import { updateBooking, removeBooking } from './manageBookings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const signupForm = document.querySelector('.form--signup');
const toursUpdateForm = document.querySelectorAll('.tours-form');
const deleteTourBtns = document.querySelectorAll('.delete-tour-button');

const forgotPasswordForm = document.querySelector('.form--forgotPassword');

const passwordResetForm = document.querySelector('.form--passwordReset');

const addTourForm = document.querySelector('.tours-form-add');

const submitReviewBtn = document.querySelector('.submit-review-btn');

const allStars = document.querySelectorAll('.fa-star');

const allThumbsUp = document.querySelectorAll('.thumbs-up-icon');

const allTrashIcons = document.querySelectorAll('.fa-trash-alt');
const reviewsCon = document.querySelector('.all-reviews-con');

const allReviewUpdateIcons = document.querySelectorAll('.check-square-review');

const removeIcons = document.querySelectorAll('.remove-icon');
const allUsersCon = document.querySelector('.all-users-con');

const sectionMap = document.querySelector('.section-map');

if (mapBox && sectionMap) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');

    location.reload();
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name--signup').value;
    const email = document.getElementById('email--signup').value;
    const password = document.getElementById('password--signup').value;
    const passwordConfirm = document.getElementById('passwordConfirm--signup')
      .value;

    signup({ name, email, password, passwordConfirm });
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    const quantity = document.querySelector('.tour-quantity').value;
    const selectEle = document.getElementById('selectDate');
    const date = selectEle.options[selectEle.selectedIndex].value;

    if (quantity <= 0) return showAlert('error', 'Quantity must be above 1');

    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset;

    bookTour(tourId, quantity, date);
  });
}

if (toursUpdateForm) {
  toursUpdateForm.forEach((tourForm) => {
    tourForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      console.log(e.target);

      const uploadCon =
        e.target.firstElementChild.children[4].firstElementChild
          .firstElementChild;

      const cardDetails = e.target.firstElementChild.children[5];

      const imageCoverFile = document.getElementById(
        `${uploadCon.children[1].getAttribute('id')}`
      ).files[0];

      const image1 = document.querySelector(
        `.${uploadCon.children[3].getAttribute('class')}`
      ).files[0];

      const image2 = document.querySelector(
        `.${uploadCon.children[5].getAttribute('class')}`
      ).files[0];

      const image3 = document.querySelector(
        `.${uploadCon.children[7].getAttribute('class')}`
      ).files[0];

      const name = document.getElementById(
        `${e.target.firstElementChild.children[4].children[1].firstElementChild.getAttribute(
          'id'
        )}`
      );

      const difficulty = document.getElementById(
        `${cardDetails.firstElementChild.firstElementChild.getAttribute('id')}`
      );

      const duration = document.getElementById(
        `${cardDetails.firstElementChild.children[1].getAttribute('id')}`
      );

      const summary = document.getElementById(
        `${cardDetails.children[2].getAttribute('id')}`
      );

      const description = document.getElementById(
        `${cardDetails.children[4].children[1].getAttribute('id')}`
      );

      const startDate = document.getElementById(
        `${cardDetails.children[6].children[1].getAttribute('id')}`
      );

      const maxGroupSize = document.getElementById(
        `${cardDetails.children[10].children[1].getAttribute('id')}`
      );

      const price = document.getElementById(
        `${e.target.firstElementChild.children[6].firstElementChild.firstElementChild.firstElementChild.getAttribute(
          'id'
        )}`
      );

      const form = new FormData();

      if (imageCoverFile) form.append('imageCover', imageCoverFile);

      if (image1) form.append('images', image1);

      if (image2) form.append('images', image2);

      if (image3) form.append('images', image3);

      if (name.value) form.append('name', name.value);

      if (price.value) form.append('price', price.value);

      if (difficulty.value) form.append('difficulty', difficulty.value);

      if (duration.value) form.append('duration', duration.value);

      if (summary.value) form.append('summary', summary.value);

      if (description.value)
        form.append('startLocation.description', description.value);

      if (startDate.value) form.append('startDates[0]', startDate.value);

      if (maxGroupSize.value) form.append('maxGroupSize', maxGroupSize.value);

      const tourId = e.target.getAttribute('id');

      updateTour(tourId, form);
    });
  });

  deleteTourBtns.forEach((deletBtn) => {
    deletBtn.addEventListener('click', (e) => {
      const tourId = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
        'id'
      );

      const isConfirmed = confirm('Are you sure you want to delete the tour?');

      if (isConfirmed) deleteTour(tourId);
    });
  });
}

document.querySelectorAll('.upload-con').forEach((uploadCon) => {
  uploadCon.addEventListener('change', (e) => {
    e.preventDefault();

    e.target.previousElementSibling.style.cssText =
      'background: rgba(29, 53, 87, 0.5) ; color:#fff';

    e.target.previousElementSibling.textContent = e.srcElement.files[0].name;
  });
});

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    forgotPassword(email);
  });
}

if (passwordResetForm) {
  passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;

    const passwordConfirm = document.getElementById('password-confirmation')
      .value;

    const token = location.pathname.split('/')[5];

    resetPassword(password, passwordConfirm, token);
  });
}

if (addTourForm) {
  addTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('.tour-name-add').value;

    const imageCover = document.getElementById('tourImageCover-add').files[0];

    const image1 = document.getElementById('tourImages--add1').files[0];
    const image2 = document.getElementById('tourImages--add2').files[0];
    const image3 = document.getElementById('tourImages--add3').files[0];

    const duration = document.getElementById('duration-add').value;

    const difficulty = document.getElementById('difficulty-add').value;

    const summary = document.getElementById('summary-add').value;

    const description = document.getElementById('description-add').value;

    const startDates = document.getElementById('startDate-add').value;

    const startDatesArr = startDates
      .split(',')
      .map((date) => date.trim() + 'T09:00:00.000Z');

    const maxGroupSize = document.getElementById('maxGroupSize-add').value;

    const price = document.getElementById('price-add').value;

    const guides = document.getElementById('guides-add').value;

    const guidesIds = guides.split(',').map((id) => id.trim());

    const form = new FormData();
    form.append('name', name);
    form.append('imageCover', imageCover);
    form.append('images', image1);
    form.append('images', image2);
    form.append('images', image3);
    form.append('duration', duration);
    form.append('difficulty', difficulty);
    form.append('summary', summary);
    form.append('maxGroupSize', maxGroupSize);
    form.append('price', price);
    form.append('description', description);

    guidesIds.forEach((id) => {
      form.append('guides[]', id);
    });

    startDatesArr.forEach((date) => {
      form.append('startDates[]', date);
    });

    const locations = [
      {
        description: 'Lummus Park Beach',
        type: 'Point',
        coordinates: [-80.128473, 25.781842],
        day: 1,
      },
      {
        description: 'Islamorada',
        type: 'Point',
        coordinates: [-80.647885, 24.909047],
        day: 2,
      },
      {
        description: 'Sombrero Beach',
        type: 'Point',
        coordinates: [-81.0784, 24.707496],
        day: 3,
      },
      {
        description: 'West Key',
        type: 'Point',
        coordinates: [-81.768719, 24.552242],
        day: 5,
      },
    ];

    createFormData(form, 'locations', locations);

    const startLocation = {
      description: 'Miami, USA',
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '301 Biscayne Blvd, Miami, FL 33132, USA',
    };
    createFormData(form, 'startLocation', startLocation);

    addTour(form);
  });
}

function createFormData(form, key, data) {
  if (typeof data === 'object') {
    for (let prop in data) {
      createFormData(form, `${key}[${prop}]`, data[prop]);
    }
  } else {
    form.append(key, data);
  }
}

if (submitReviewBtn || allReviewUpdateIcons) {
  let rating;

  allStars.forEach((star) => {
    star.addEventListener('click', (e) => {
      const starId = e.target.dataset.starId * 1;

      for (
        let i = starId % 5 === 0 ? starId - 4 : Math.floor(starId / 5) * 5 + 1;
        i <= starId;
        i++
      ) {
        document.querySelector(`.star-${i}`).style.color = '#ffc300';

        for (let j = starId + 1; j <= Math.floor(starId / 5 + 1) * 5; j++) {
          const jEle = document.querySelector(`.star-${j}`);
          if (jEle) {
            jEle.style.color = 'rgb(172, 169, 169)';
          }
        }
      }

      let offset =
        Math.floor(starId % 5) === 0
          ? (starId / 5 - 1) * 5
          : Math.floor(starId / 5) * 5;
      rating = starId - offset;
    });
  });

  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', (e) => {
      const review = document.querySelector('.review-detail').value;

      const tourId = location.pathname.split('/')[2];

      submitReview(rating, review, tourId);
    });
  }

  if (allReviewUpdateIcons) {
    allReviewUpdateIcons.forEach((updateIcon) => {
      updateIcon.addEventListener('click', async (e) => {
        const review =
          e.target.nextElementSibling.nextElementSibling.children[1].value;

        const reviewId = e.target.dataset.updateReviewId;

        await updateReview(reviewId, rating, review);

        if (location.pathname === '/reviewUpdateForm') {
          location.assign('/my-reviews');
        } else {
          location.assign('/manage-reviews');
        }
      });
    });
  }
}

if (allThumbsUp) {
  allThumbsUp.forEach((thumbsUp) => {
    thumbsUp.addEventListener('click', (e) => {
      const tourName = thumbsUp.dataset.tourName;

      manageFavoriteTours(tourName);
    });
  });
}

if (reviewsCon) {
  allTrashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener('click', (e) => {
      const reviewId = e.target.dataset.reviewId;

      const isConfirmed = confirm(
        'Are you sure you want to delete the review?'
      );
      if (isConfirmed) {
        removeTourFromFavoriteList(reviewId);
      }
    });
  });
}

if (allUsersCon) {
  removeIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      const userId = e.target.parentElement.previousElementSibling.children[0].textContent.replace(
        'ID: ',
        ''
      );

      const isConfirmed = confirm('Are you sure you want to delete the user?');

      if (isConfirmed) deleteUser(userId);
    });
  });
}

const updateUserForm = document.querySelector('.img-box-update-form');
if (updateUserForm) {
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = location.pathname.split('/')[2];

    const name = document.querySelector('.name-update-field').value.trim();
    const email = document.querySelector('.email-update-field').value.trim();
    const role = document.querySelector('.role-update-field').value.trim();
    const photo = document.getElementById('photo').files[0];

    const form = new FormData();
    if (name) form.append('name', name);
    if (email) form.append('email', email);
    if (role) form.append('role', role);
    if (photo) form.append('photo', photo);

    await updateUser(userId, form);

    location.assign('/manage-users');
  });

  document.querySelector('.img-box-update').addEventListener('change', (e) => {
    e.preventDefault();

    e.target.previousElementSibling.style.cssText =
      'background: rgba(29, 53, 87, 0.5) ; color:#fff';

    e.target.previousElementSibling.textContent = e.srcElement.files[0].name;
  });
}

const updatebookingBtn = document.querySelector('.fa-edit-booking');
const updateBookingCon = document.querySelector('.update-booking-con');

if (updateBookingCon) {
  updatebookingBtn.addEventListener('click', async (e) => {
    function getDefaultValue(ele) {
      return ele.getAttribute('placeholder');
    }

    const bookingId = location.pathname.split('/')[2];

    const createAt = document.querySelector('.booking-input-createdAt');
    const price = document.querySelector('.booking-input-price');
    const paid = document.querySelector('.booking-input-paid');

    if (!createAt && !price && !paid) return;

    await updateBooking(bookingId, {
      createAt: createAt.value
        ? new Date(createAt.value)
        : getDefaultValue(createAt).slice(0, -2),

      price: price.value || getDefaultValue(price),
      paid: paid.value || getDefaultValue(paid),
    });

    location.assign('/manage-bookings');
  });
}

const removeBookingIcons = document.querySelectorAll('.remove-icon-booking');

if (removeBookingIcons) {
  removeBookingIcons.forEach((icon) => {
    icon.addEventListener('click', async (e) => {
      const reviewId = e.target.dataset.reviewId;

      const isConfirmed = confirm(
        'Are you sure you want to remove the booking?'
      );

      if (isConfirmed) await removeBooking(reviewId);
      else return;

      location.assign('/manage-bookings');
    });
  });
}

const sortEle = document.getElementById('sort-by');
const filterEle = document.getElementById('filter-by');

if (sortEle) {
  sortEle.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    const filterKey = filterEle.options[filterEle.selectedIndex].value;
    const inputValue = document.querySelector('.filter-input').value;

    if (location.pathname === '/manage-users') {
      if (inputValue)
        return assignLocation_filter('users', filterKey, inputValue, sortValue);

      return assignLocation_sort('users', sortValue);
    }

    if (location.pathname === '/manage-reviews') {
      if (inputValue)
        return assignLocation_filter(
          'reviews',
          filterKey,
          inputValue,
          sortValue
        );

      return assignLocation_sort('reviews', sortValue);
    }

    if (inputValue) {
      if (sortValue === 'top-5-cheap')
        return location.assign(
          `${sortValue}?sort=${sortValue}&${filterKey}=${inputValue}`
        );

      return location.assign(
        `/?sort=${sortValue}&${filterKey}=${inputValue.split(' ').join('-')}`
      );
    } else {
      if (sortValue === 'top-5-cheap') return location.assign(sortValue);

      location.assign(
        `/${sortValue === 'default' ? '' : `?sort=${sortValue}`}`
      );
    }
  });
}

if (filterEle) {
  filterEle.addEventListener('change', (e) => {
    const value = e.target.value;

    if (value === 'tour' || value === 'user') {
      filterEle.nextElementSibling.setAttribute('placeholder', 'Object Id');
    } else if (value.startsWith('rating')) {
      filterEle.nextElementSibling.setAttribute('placeholder', 'Number');
    }
  });
}

const filterBtn = document.querySelector('.filter-btn');
if (filterBtn) {
  filterBtn.addEventListener('click', (e) => {
    const sortValue = sortEle.options[sortEle.selectedIndex].value;
    const filterKey = filterEle.options[filterEle.selectedIndex].value;
    const filetrValue = document.querySelector('.filter-input').value;

    if (!filetrValue) return showAlert('error', 'Invalid input');

    if (location.pathname === '/manage-users') {
      return assignLocation_filter(
        'users',
        filterKey,
        filetrValue.split(' ').join('-'),
        sortValue
      );
    }

    if (location.pathname === '/manage-reviews') {
      return assignLocation_filter(
        'reviews',
        filterKey,
        filetrValue.split(' ').join('-'),
        sortValue
      );
    }

    if (sortValue === 'top-5-cheap')
      return location.assign(
        `${sortValue}?sort=${sortValue}&${filterKey}=${filetrValue}`
      );

    return location.assign(
      `/?sort=${sortValue}&${filterKey}=${filetrValue.split(' ').join('-')}`
    );
  });
}

function assignLocation_filter(collection, filterKey, filterValue, sortValue) {
  return location.assign(
    `/manage-${collection}?sort=${sortValue}&${filterKey}=${filterValue
      .split(' ')
      .join('-')}`
  );
}

function assignLocation_sort(collection, sortValue) {
  location.assign(
    `/manage-${collection}${
      sortValue === 'default' ? '' : `?sort=${sortValue}`
    }`
  );
}

addEventListener('DOMContentLoaded', (e) => {
  window.scrollTo(0, 0);
});
