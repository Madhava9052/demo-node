'use client';

import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

export default function FeaturedBanners({ featuredBanners = [] }) {
  return (
    <div className="relative">
      <section className="flex gap-3 overflow-x-scroll no-scrollbar">
        <Swiper
          slidesPerView={1}
          spaceBetween={5}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay]}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
            1340: {
              slidesPerView: 3,
            },
            1550: {
              slidesPerView: 4,
            },
          }}
          className="mySwiper"
        >
          {featuredBanners.map((eachBanner, index) =>
            eachBanner.is_redirection_available ? (
              <Link
                key={index}
                target={
                  eachBanner.redirect_type === 'COLLECTION' ? '' : '_blank'
                }
                href={
                  eachBanner.redirect_type === 'COLLECTION'
                    ? `/category/collections/${eachBanner.collection_id}`
                    : eachBanner.redirect_link
                }
              >
                <SwiperSlide key={index}>
                  <div className="min-h-[180px] min-w-[320px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="hover:scale-105 mx-auto transition duration-300 cursor-pointer"
                      src={eachBanner.image_url}
                      alt=""
                    />
                  </div>
                </SwiperSlide>
              </Link>
            ) : (
              <SwiperSlide key={index}>
                <div className="min-h-[180px] min-w-[380px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="hover:scale-105 mx-auto transition duration-300 cursor-pointer"
                    src={eachBanner.image_url}
                    alt=""
                  />
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </section>
    </div>
  );
}
