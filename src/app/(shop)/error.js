'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section>
      <div className="container mx-auto flex flex-col items-center justify-center my-[50px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api-dev.wlb.spreadagency.co.nz/static/images/error//1534891_219218-p0yk75-263_1.png"
          alt=""
        />
      </div>
    </section>
  );
}
