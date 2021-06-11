import axios from 'axios';
import { showAlert } from './alerts';

export const submitReview = async (rating, review, tourId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        rating,
        review,
        tour: tourId,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your review has been submitted');

      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
