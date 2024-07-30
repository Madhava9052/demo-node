'use client';
import Link from 'next/link';
import ArrowButton from '../../common/arrowButton';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ShopByBrand({ brandCategories = [] }) {
  return (
    <section className="mt-4 sm:mt-8 lg:my-12 container mx-auto">
      <h3 className="text-black text-center font-semibold text-lg sm:text-xl lg:text-[32px] tracking-[0.32px]">
        Shop By Brand
      </h3>
      <div className="relative">
        <ArrowButton
          direction="left"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={brandCategories.length > 3}
          className="hidden lg:flex arrow-right-Shop-by-brand lg:left-[5px] xl:-left-[50px]"
        />
        <ArrowButton
          direction="right"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={brandCategories.length > 3}
          className="hidden lg:flex arrow-left-Shop-by-brand lg:right-[5px] xl:-right-[50px]"
        />

        <div
          className="flex gap-5 items-center mt-4 lg:mt-8 justify-center lg:px-[50px] xl:px-0 overflow-hidden no-scrollbar w-full mx-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={5}
            grabCursor
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            pauseonhover={"true"}
            navigation={{
              nextEl: '.arrow-left-Shop-by-brand',
              prevEl: '.arrow-right-Shop-by-brand',
            }}
            loop
            modules={[Autoplay, Navigation]}
            breakpoints={{
              100: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              750: {
                slidesPerView: 4,
                spaceBetween: 10,
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
          >
            {brandCategories.map((eachCategory, index) => (
              <SwiperSlide key={index}>
                <Link
                  className=""
                  href={`/category/${eachCategory.slug.toLowerCase()}/${eachCategory.id
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="hover:scale-105 xl:min-w-min rounded-xl h-[100px] mx-auto  transition duration-300 cursor-pointer"
                    src={eachCategory.avatar}
                    alt={`Brand ${index}`}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
