'use client';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ArrowButton from '../../common/arrowButton';

export default function Partners({ partners = [] }) {
  const swiperRef = useRef(null);
  const imageCount = partners.length;

  // Function to handle auto-scrolling
  const autoScroll = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="mt-8 lg:my-12 mb-8 px-2 sm:px-0 container mx-auto">
      <h3 className="text-black text-center font-semibold text-20px sm:text-xl lg:text-[32px] tracking-[0.32px]">
        As Seen On
      </h3>
      <div className="relative mx-auto mt-8">
        <ArrowButton
          direction="left"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={partners.length > 3}
          className="hidden lg:flex arrow-right lg:left-[5px] xl:-left-[50px]"
        />
        <ArrowButton
          direction="right"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={partners.length > 3}
          className="hidden lg:flex arrow-left lg:right-[5px] xl:-right-[50px]"
        />
        <div
          className="flex gap-5 items-center justify-center overflow-hidden no-scrollbar mx-auto lg:px-[50px] xl:px-0"
          style={{ scrollbarWidth: 'none' }}
        >
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={20}
            grabCursor
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            pauseonhover={"true"}
            navigation={{
              nextEl: '.arrow-left',
              prevEl: '.arrow-right',
            }}
            modules={[Autoplay, Navigation]}
            breakpoints={{
              100: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              750: {
                slidesPerView: 4,
                spaceBetween: 5,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              1440: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }}
            className="partners-swiper"
            ref={swiperRef}
          >
            {partners.map((eachPartner, index) => (
              <SwiperSlide key={index}>
                {eachPartner.is_redirection_available ? (
                  <Link
                    target="_blank"
                    href={eachPartner.redirect_link.toLowerCase()}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="hover:scale-105 min-w-[190px] mx-auto rounded-xl transition duration-300 cursor-pointer"
                      src={eachPartner.image_url}
                      alt={`Brand ${index}`}
                    />
                  </Link>
                ) : (
                  <img
                    className="hover:scale-105 min-w-[190px] rounded-xl transition duration-300 cursor-pointer"
                    src={eachPartner.image_url}
                    alt={`Brand ${index}`}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
