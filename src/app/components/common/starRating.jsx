import { useEffect, useState } from 'react';

export default function StarRating({ rating }) {
  const [ratingState, setRatingState] = useState();
  useEffect(() => {
    setRatingState(rating);
  }, [rating]);
  // Render stars based on the rating value
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.9583 6.13797C15.8536 5.81398 15.5662 5.58387 15.2262 5.55323L10.6082 5.13391L8.78208 0.859754C8.64744 0.546514 8.34079 0.34375 8.00008 0.34375C7.65937 0.34375 7.35273 0.546514 7.21808 0.860487L5.39198 5.13391L0.773211 5.55323C0.433847 5.58461 0.147219 5.81398 0.0418692 6.13797C-0.0634802 6.46195 0.0338123 6.8173 0.290533 7.04131L3.78122 10.1027L2.7519 14.6368C2.67658 14.9702 2.80598 15.3148 3.0826 15.5148C3.23128 15.6222 3.40524 15.6769 3.58066 15.6769C3.7319 15.6769 3.88193 15.6361 4.01658 15.5556L8.00008 13.1748L11.9821 15.5556C12.2735 15.7309 12.6408 15.7149 12.9168 15.5148C13.1936 15.3142 13.3228 14.9695 13.2475 14.6368L12.2182 10.1027L15.7089 7.04192C15.9656 6.8173 16.0636 6.46256 15.9583 6.13797Z"
            fill={i < ratingState ? '#FFC107' : '#E0E0E0'}
          />
        </svg>
      );
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
