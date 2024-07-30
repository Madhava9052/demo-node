'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

function Slider({ slides = [] }) {
  const [swiper, setSwiper] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.activeIndex);
  };


  return (
    <section className="hidden lg:block relative my-12">
      <Swiper
        className="overflow-hidden"
        spaceBetween={0}
        slidesPerView={'auto'}
        grabCursor
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pauseonhover={"true"}
        modules={[Autoplay, Pagination, Navigation, Scrollbar]}
        onInit={(swiper) => setSwiper(swiper)}
        onSlideChange={(swiper) => { handleSlideChange(swiper) }}
      >
        {slides.map((eachSlider, index) =>
          eachSlider.is_redirection_available ? (
            <SwiperSlide key={index}>
              <Link
                target={eachSlider.redirect_type === 'COLLECTION' ? '' : '_blank'}
                href={
                  eachSlider.redirect_type === 'COLLECTION'
                    ? `/category/collections/${eachSlider.collection_id}`
                    : eachSlider.redirect_link
                }
                className="flex items-center h-[450px]"
                style={{
                  backgroundImage: `url(${eachSlider.image_url})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                }}
              >
                <div className="container mx-auto lg:px-[50px] xl:px-0">
                  <div className="bg-white max-w-[520px] min-h-[300px] grow flex flex-col justify-center items-start ml-[20px] sm:ml-0 pl-[20px] lg:pl-[40px]">
                    <h3 className="text-black font-montserrat text-2xl font-semibold">
                      {eachSlider.title}
                    </h3>
                    <p className="text-black font-montserrat text-[16px] max-w-[500px] font-normal font-weight-400 leading-normal tracking-0.24">
                      {eachSlider.description}
                    </p>
                    <button className="bg-[#8A1E41] py-[14px] px-[28px] text-white mt-[20px]">
                      Shop now
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ) : (
            <SwiperSlide
              key={index}
                className="flex lg:!h-[450px] !h-[230px]"
              style={{
                backgroundImage: `url(${eachSlider.image_url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}
            >
                <div className="hidden lg:flex container items-center h-full mx-auto lg:px-[50px] xl:px-0">
                <div className="bg-white max-w-[520px] min-h-[300px] grow flex flex-col justify-center items-start ml-[20px] sm:ml-0 pl-[20px] lg:pl-[40px]">
                  <h3 className="text-black font-montserrat text-2xl font-semibold">
                    {eachSlider.title}
                  </h3>
                  <p className="text-black font-montserrat text-[16px] max-w-[500px] font-normal font-weight-400 leading-normal tracking-0.24">
                    {eachSlider.description}
                  </p>
                  <button className="bg-[#8A1E41] py-[14px] px-[28px] text-white mt-[20px]">
                    Shop now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
      <div className="absolute inset-x-0 z-20 bottom-4 flex justify-center">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`w-16 h-2 rounded-full bg-white ${index === activeSlideIndex ? 'opacity-100' : 'opacity-50'
              } mx-2 cursor-pointer`}
            onClick={() => {
              if (swiper) {
                swiper.slideTo(index);
              }
            }}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Slider;