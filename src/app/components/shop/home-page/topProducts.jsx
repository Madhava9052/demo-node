'use client';

import ItemCard from '../../common/itemCard';
import ArrowButton from '../../common/arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function TopProducts({ topProducts = [] }) {
  return (
    <section className="mt-8 lg:my-12 container mx-auto">
      <h3 className="text-black text-center font-montserrat font-semibold text-[20px] lg:text-[32px] leading-normal">
        Top Products
      </h3>
      <div className="relative">
        <ArrowButton
          direction="left"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={topProducts.length > 3}
          className="hidden lg:flex arrow-right-topProducts lg:left-[5px] xl:-left-[50px]"
        />
        <ArrowButton
          direction="right"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={topProducts.length > 3}
          className="hidden lg:flex arrow-left-topProducts lg:right-[5px] xl:-right-[50px]"
        />

        <div
          className="flex items-center mt-8 gap-5 overflow-scroll no-scrollbar container	mx-auto lg:px-[50px] xl:px-0"
          style={{ scrollbarWidth: 'none' }}
        >
          <img
            className="hidden lg:flex lg:w-[183px] xl:w-[190px] 2xl:w-[184px]"
            src="/images/top-products.jpeg"
            alt=""
            style={{ height: "auto", objectFit: "cover" }}
          />
          <div
            className="flex gap-5 px-4 lg:px-0 overflow-hidden no-scrollbar container mx-auto"
            style={{ scrollbarWidth: 'none' }}

          >
            <Swiper
              slidesPerView={'auto'}
              grabCursor
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              pauseonhover={"true"}
              navigation={{
                nextEl: '.arrow-left-topProducts',
                prevEl: '.arrow-right-topProducts',
              }}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                100: {
                  slidesPerView: 2,
                  spaceBetween: 1,
                },
                750: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1300: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                1440: {
                  slidesPerView: 5.5,
                  spaceBetween: 10,
                },
              }}
              className="mySwiper"
            >
              {topProducts.map((topProduct, index) => (
                <SwiperSlide key={index}>
                  <div className=''>
                    <ItemCard
                      categoryPath={`top-products/`}
                      product={topProduct}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
