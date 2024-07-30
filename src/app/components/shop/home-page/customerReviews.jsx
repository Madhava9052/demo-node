'use client';
import { useRef, useEffect } from 'react';
import StarRating from '../../common/starRating';
import ArrowButton from '../../common/arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import Popover from '../../common/popOver';

export default function CustomerReviews({ reviews = [] }) {
  return (
    <section className='relative my-12'>
      <div
        className="absolute w-full h-[170%] xl:h-[150%] bg-no-repeat border border-transparent"
        style={{
          backgroundImage: `url(https://welovebrandings.spreadagency.co.nz/assets/images/customer-bg.png)`,
          backgroundPosition: 'top -80% left 50%',
        }}
      >
      </div>
      <div className=" relative container mx-auto flex justify-center">
        <ArrowButton
          direction="left"
          style={{
            position: 'absolute',
            transform: 'translate(0%, -50%)',
          }}
          show={reviews.length > 2}
          className="hidden lg:flex arrow-right lg:left-[5px] xl:-left-[50px] lg:top-[60%] xl:top-[65%]"
          color="#8A1E41"
        />
        <ArrowButton
          direction="right"
          style={{
            position: 'absolute',
            transform: 'translate(0%, -50%)',
          }}
          show={reviews.length > 2}
          // clickHandler={scrollRight}
          className="hidden lg:flex arrow-left lg:right-[5px] xl:-right-[50px] lg:top-[60%] xl:top-[65%]"
          color="#8A1E41"
        />
        <div className="w-full h-fit">
          <h3 className="text-white text-center font-semibold text-[20px] lg:text-[32px] pt-10">
            Customer Reviews
          </h3>
          <div
            className="flex items-center mt-4 gap-10 overflow-hidden no-scrollbar px-4 container mx-auto lg:px-[50px] xl:px-0"
            style={{ scrollbarWidth: 'none' }}
          >
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={10}
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
                  spaceBetween: 2,
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
              className="reviewSwiper"
            >
              {reviews.map((eachReview, index) => (
                <SwiperSlide key={index}>
                  <div className="container bg-white border border-gray-200 cursor-pointer rounded-lg mt-6">
                    <div className="flex flex-col items-center pb-10 pt-5">
                      <img
                        className="w-24 h-24 mb-3 border border-red-300 rounded-md"
                        src={eachReview.product_image}
                        alt="Bonnie image"
                      />
                      <div className='flex gap-1 flex-col justify-center items-center'>
                        {eachReview.product_name.split(" ").length > 3 ? (
                          <Popover title="Product Name" content={eachReview.product_name}>
                            <h5 className="line-clamp-1 px-3 text-sm text-center lg:min-h-[20px] xl:h-auto lg:text-xl font-medium text-gray-900">
                              {eachReview.product_name}
                            </h5>
                          </Popover>
                        ) : (
                          <h5 className="line-clamp-1 px-3 text-sm text-center lg:min-h-[20px] xl:h-auto lg:text-xl font-medium text-gray-900">
                            {eachReview.product_name}
                          </h5>
                        )}
                        <Link href={`/product/${eachReview.product_id}`} className='text-base mb-1 text-[#8A1E41] hover:text-yellow-400'>
                          <span >Buy</span>
                        </Link>
                      </div>
                      <StarRating rating={eachReview.rating} />
                      <p title={eachReview.review.split(" ").length > 10 ? eachReview.review : ""} className="font-bold line-clamp-1 sm:line-clamp-3 text-sm text-center px-8 mt-4 leading-6 min-h-[50px] sm:min-h-[72px]">
                        {eachReview.review}
                      </p>
                      <div className="flex items-center mt-4 gap-5">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={
                            eachReview.commented_by_profile_picture
                              ? eachReview.commented_by_profile_picture
                              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                          }
                          alt="Rounded avatar"
                        />
                        <div>
                          <h6 className="font-bold">
                            {eachReview.commented_by}
                          </h6>
                          <p className='font-medium text-lg text-gray-500'>{`${new Date(
                            eachReview.commented_date
                          )
                            .getUTCDate()
                            .toString()
                            .padStart(2, '0')}/${(
                              new Date(eachReview.commented_date).getUTCMonth() +
                              1
                            )
                              .toString()
                              .padStart(2, '0')}/${new Date(
                                eachReview.commented_date
                              ).getUTCFullYear()}`}</p>
                        </div>
                      </div>
                    </div>
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
