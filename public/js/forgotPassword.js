import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3001/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success')
      showAlert('success', 'Please check your email to reset password');
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
