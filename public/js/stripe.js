import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, quantity, date) => {
  try {
    const stripe = Stripe(
      'pk_test_51IwTLuAN569NyJV7kFuQqUkN7BszjMa9yhc9NzoYRMBl9XN9KkWaGOp5rG9vkXYUMmhEJWZI2Zuh3AP8ORjcce3y00DugW4WvO'
    );
    const session = await axios(
      `http://localhost:3001/api/v1/bookings/checkout-session/${tourId}/${quantity}/${date}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
