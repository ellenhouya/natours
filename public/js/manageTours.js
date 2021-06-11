import axios from 'axios';

import { showAlert } from './alerts';

export const addTour = async (form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data: form,
    });

    if (res.data.status === 'success')
      showAlert('success', 'The tour has been created');

    location.reload();
  } catch (err) {
    console.log(err.response);
    showAlert(
      'error',
      'Unable to create the tour. Please fill out all required fields.'
    );
  }
};

export const updateTour = async (tourId, form) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}`,
      data: form,
    });

    if (res.data.status === 'success') {
      showAlert('success', `data updated successfully`);
    }

    location.reload();
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteTour = async (tourId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'data deleted successfully');
    }

    location.reload();
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
