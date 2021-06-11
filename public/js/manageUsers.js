import axios from 'axios';
import { showAlert } from './alerts';

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });

    if (res.status === 204) showAlert('success', 'The user has been deleted');

    location.reload();
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', 'The user data has been updated');
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
