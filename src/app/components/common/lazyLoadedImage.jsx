import React, { useEffect, useRef, useState } from 'react';

function LazyLoadedImage({ src, alt, blur = false, height, width }) {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      src={isVisible ? src : ''}
      alt={alt}
      // className='sm:min-w-[180px] sm:min-h-[180px]'
      height={height}
      width={width}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s',
        filter: blur && !isVisible ? 'blur(8px)' : 'none', // Apply blur effect if blur prop is true and image is not yet loaded
      }}
    />
  );
}

export default LazyLoadedImage;
