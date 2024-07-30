'use client';

import { checkout } from '@/helpers/checkout';
import Cookies from 'js-cookie';

export default function StripeButton({ checkoutData }) {
  const paynow = () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/check_out/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(checkoutData),
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        checkout({
          stripePublicKey: data.stripe_public_key,
          sessionId: data.session_id,
        });
      });
  };
  return (
    <>
      <button
        onClick={() => paynow()}
        className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
      >
        Pay now
      </button>
    </>
  );
}
