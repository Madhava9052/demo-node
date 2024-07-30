import React from 'react';

import Confetti from 'react-confetti';

export default function PaymentConfetti() {
  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={300}
    />
  );
}
