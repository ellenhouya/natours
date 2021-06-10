import axios from 'axios';
import { showAlert } from './alerts';

export const manageFavoriteTours = async (tourName) => {
  try {
    await axios({
      method: 'PATCH',
      url: `http://localhost:3001/api/v1/users/updateMyFavoriteTours/${tourName}`,
    });

    location.reload();
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const removeTourFromFavoriteList = async (reviewId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `http://localhost:3001/api/v1/reviews/${reviewId}`,
    });

    location.reload();
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
