'use client';

import { useState } from 'react';

export default function ProductDescription({ description }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="flex flex-col">
      <p
        className={`lg:max-w-[410px] ${showAll ? '' : 'h-[90px] overflow-hidden'
          }  mt-3 lg:mt-[14px] text-black  text-base font-normal`}
      >
        {description}
      </p>

      {!showAll && (
        <p
          className="ml-auto -mt-[17px] cursor-pointer bg-[#F7F7F7] font-semibold underline"
          onClick={() => setShowAll(!showAll)}
        >
          More
        </p>
      )}

      {showAll && (
        <p
          className="ml-auto -mt-[25px] cursor-pointer bg-[#F7F7F7] font-semibold underline"
          onClick={() => setShowAll(!showAll)}
        >
          Less
        </p>
      )}
    </div>
  );
}

