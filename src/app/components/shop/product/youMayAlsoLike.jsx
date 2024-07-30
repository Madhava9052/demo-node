'use client';
import ItemCard from '@/app/components/common/itemCard';
import ArrowButton from '../../common/arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function YouMayAlsoLike({ topProducts, title }) {

  return (
    <section className="py-[60px] bg-white">
      <div className="lg:container mx-auto px-2 lg:px-[50px] xl:px-0">
        <div className="relative">
          <ArrowButton
            direction="left"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={true}
            className="hidden lg:flex arrow-right-recommended left-0 sm:left-[-50px] z-20"
          />
          <ArrowButton
            direction="right"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={true}
            className="hidden lg:flex arrow-left-recommended right-0 sm:right-[-50px] z-20"
          />
          <h3 className="text-black text-center font-semibold text-2xl lg:text-[32px] tracking-[0.32px]">
            {title}
          </h3>
          <div
            className="flex gap-[22px] mt-12 overflow-hidden no-scrollbar container mx-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <Swiper
              slidesPerView={'auto'}
              grabCursor
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              pauseonhover={"true"}
              navigation={{
                nextEl: '.arrow-left-recommended',
                prevEl: '.arrow-right-recommended',
              }}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                100: {
                  slidesPerView: 2,
                  spaceBetween: 10,
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
              className="mySwiper px-2 lg:px-0"
            >
              {topProducts.map((eachFeaturedProduct, index) => (
                <SwiperSlide key={index}>
                  <div className='mx-auto'>
                  <ItemCard
                    categoryPath={`featured/`}
                    product={eachFeaturedProduct}
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
