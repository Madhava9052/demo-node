import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ArrowButton from './arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ImageModal = ({ activeImage, images, handleIsOpenImageModal, isOpenImageModal }) => {
  const [activeImageUrl, setActiveImageUrl] = useState(activeImage);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiper = useRef(null);

  const handleKeyDown = (e) => {
    if (!isOpenImageModal) return;
  
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      setActiveImageUrl(images[newIndex].url);
      swiper.current.slideTo(newIndex);
    } else if (e.key === 'ArrowRight' && activeIndex < images.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      setActiveImageUrl(images[newIndex].url);
      swiper.current.slideTo(newIndex);
    }
  };
  

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpenImageModal, activeIndex]);

  if (!isOpenImageModal) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed top-0 z-30 left-0 bg-black bg-opacity-75 w-full h-full flex justify-center items-center">
      <div className="relative flex-col flex justify-center items-center w-full lg:max-w-lg">
        <span className="relative flex items-center justify-center w-fit mx-auto">
          <img
            src={activeImageUrl}
            alt=""
            className="mx-auto h-[500px]"
          />
          <ArrowButton
            direction="left"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={images.length > 1}
            clickHandler={(e) => {
              e.stopPropagation();

              if (activeIndex > 0) {
                setActiveIndex(activeIndex - 1);
                setActiveImageUrl(images[activeIndex - 1].url);
                swiper.current.slideTo(activeIndex - 1); // Move Swiper to the previous slide
              }
            }}
            color={'white'}
          />
          <ArrowButton
            direction="right"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={images.length > 1}
            clickHandler={(e) => {
              e.stopPropagation();
              if (activeIndex < images.length - 1) {
                setActiveIndex(activeIndex + 1);
                setActiveImageUrl(images[activeIndex + 1].url);
                swiper.current.slideTo(activeIndex + 1); // Move Swiper to the next slide
              }
            }}
            color={'white'}
          />
          <button
            onClick={handleIsOpenImageModal}
            type="button"
            className="absolute top-0 right-0 sm:-top-4 sm:-right-4 text-black bg-[#FFCD00] hover:text-gray-900 text-sm w-10 h-10 ml-auto flex justify-center items-center z-40"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </span>
        <Swiper
          spaceBetween={5}
          slidesPerView={4.7}
          initialSlide={activeIndex}
          onSwiper={(swiperInstance) => (swiper.current = swiperInstance)}
          className="w-full sm:max-w-lg my-5 !hidden sm:!block mx-auto"
        >
          {images.map((eachImage, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center shadow">
                <div className="w-24">
                  <img
                    className={`cursor-pointer ${eachImage.url === activeImageUrl ? 'border-[3px] border-[#FFCD00]' : ''
                      }`}
                    src={eachImage.url}
                    alt=""
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageUrl(eachImage.url);
                      setActiveIndex(index);
                      swiper.current.slideTo(index); // Move Swiper to the clicked slide
                    }}
                  />
                  <span className="text-sm text-white">{eachImage.caption}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageModal;
