import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3001/api/v1/users/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully');
    }

    window.setTimeout(() => {
      location.assign('/');
    }, 1000);
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
