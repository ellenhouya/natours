import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3001/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success')
      showAlert('success', 'Password reset successfully');

    location.assign('/');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Failed to reset password. Please try again');
  }
};
