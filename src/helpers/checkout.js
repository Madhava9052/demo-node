import { loadStripe } from '@stripe/stripe-js';

import React from 'react';

export async function checkout({ stripePublicKey, sessionId }) {
  let stripePromise = null;
  const getstripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(stripePublicKey);
    }
    return stripePromise;
  };
  const stripe = await getstripe();
  await stripe.redirectToCheckout({
    sessionId,
  });
}
