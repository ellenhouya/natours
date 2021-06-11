import axios from 'axios';
import { showAlert } from './alerts';

export const updateReview = async (reviewId, rating, review) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        rating,
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review was updated');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
