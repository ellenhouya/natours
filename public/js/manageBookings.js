import axios from 'axios';
import { showAlert } from './alerts';

export const updateBooking = async (bookingId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/bookings/${bookingId}`,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', 'The review has been updated');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Unable to update the review. Please try again.');
  }
};
export const removeBooking = async (bookingId, data) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/bookings/${bookingId}`,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', 'The review has been removed');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Unable to remove the review. Please try again.');
  }
};
