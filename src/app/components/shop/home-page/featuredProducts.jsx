'use client';
import ItemCard from '@/app/components/common/itemCard';
import ArrowButton from '../../common/arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function FeaturedProducts({ featuredProducts }) {
  return (
    <section className="mt-8 lg:my-12">
      <h3 className="text-black text-center font-semibold text-[20px] sm:text-xl lg:text-[32px]">
        Featured Collection
      </h3>
      <div className="container mx-auto">
        <div className="relative">
          <ArrowButton
            direction="left"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={featuredProducts.length > 3}
            className="hidden lg:flex arrow-right-featured lg:left-[5px] xl:-left-[50px] h"
          />
          <ArrowButton
            direction="right"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={featuredProducts.length > 3}
            className="hidden lg:flex arrow-left-featured lg:right-[5px] xl:-right-[50px] h"
          />

          <div
            className="flex gap-[22px] px-4 mt-4 lg:mt-8 overflow-scroll no-scrollbar lg:px-[50px] xl:px-0"
          >
            <Swiper
              slidesPerView={'auto'}
              grabCursor
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              loop
              pauseonhover={"true"}
              navigation={{ nextEl: '.arrow-left-featured', prevEl: '.arrow-right-featured' }}
              pagination={{
                clickable: true,
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
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                1440: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
              }}
              className="mySwiper"
            >
            {featuredProducts.map((eachFeaturedProduct) => (
              <SwiperSlide key={eachFeaturedProduct.id} className='!transform-none'>
              <ItemCard
                categoryPath={`featured/`}
                product={eachFeaturedProduct}
              />
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
