'use client';
import Link from 'next/link';
import styles from './banner.module.css';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Banner({ from, bannerDetails, sliders = [] }) {
  const [swiper, setSwiper] = useState(null);
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveSliderIndex(swiper.activeIndex);
  };

  if (!sliders.length && from === 'listingPage') {
    return (
      // if you wanna add the banner for the collection section just add "lg:block " after "hidden" to display the collection banner
      <section className={`hidden ${styles['bg-custom-image']}  ${from === 'listingPage' ? styles['from-category-page'] : ''}`}
      >
        <div
          className={`container mx-auto h-[350px] lg:px-[50px] xl:px-0`}
        >
          <div className="flex flex-col items-start justify-center h-full lg:w-1/2 text-white">
            <>
              <h3 className="text-2xl sm:text-4xl capitalize font-semibold leading-[53px]">
                {decodeURIComponent(bannerDetails.tittle).split("-").join(" ")}
              </h3>

              <p className="sm:mt-[20px] sm:text-base max-w-[500px]">
                {bannerDetails.description}
              </p>
            </>
          </div>
        </div>
      </section>
    );
  }
  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      }}
      grabCursor
      pauseonhover={"true"}
      onInit={(swiper) => setSwiper(swiper)} //initialise swiper object 
      onSlideChange={(swiper) => { handleSlideChange(swiper)}}
    >
      {sliders.map((eachSlider, index) => (
        <SwiperSlide key={index}>
          <section
            style={{
              backgroundImage: `url(${eachSlider.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            className='min-h-[350px] lg:min-h-[500px]'
          >
            <div className="container mx-auto relative">
              <div
                className={`transition-opacity min-h-3/4 lg:h-[500px] duration-1000 ease-in-out`}
              >
                <div className="flex flex-col items-start justify-center lg:h-[500px] px-4 lg:px-[50px] xl:px-0 lg:w-11/12 text-white">
                  <p className="text-2xl my-8">Welcome to a new world</p>
                  <p className="text-md sm:text-xl lg:text-5xl font-bold">
                    {eachSlider.title}
                  </p>
                  <h3 className="text-xl mt-[20px] lg:text-5xl font-bold">
                    {eachSlider.sub_title}
                  </h3>
                  {eachSlider.is_redirection_available && (
                    <Link
                      target={eachSlider.redirect_type === 'COLLECTION' ? '' : '_blank'}
                      href={
                        eachSlider.redirect_type === 'COLLECTION'
                          ? `/products/collection/${eachSlider.collection_id}`
                          : eachSlider.redirect_link
                      }
                    >
                      <button className="mt-[60px] py-[14px] text-base font-semibold px-[28px] bg-[#8A1E41]">
                        LEARN MORE
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
      <div className="absolute z-10 inset-x-0 bottom-4 h-4 flex justify-center">
        {sliders.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 lg:w-16 lg:h-2 cursor-pointer rounded-full bg-white ${index === activeSliderIndex ? 'opacity-100' : 'opacity-50'
              } mx-2 cursor-pointer`}
            onClick={() => {
              if (swiper) {
                swiper.slideTo(index);
              }
            }}
          ></span>
        ))}
      </div>
    </Swiper>
  );
}
