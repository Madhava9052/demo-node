'use client';
import ArrowButton from '../../common/arrowButton';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

export default function AboutFiveStar({
  aboutFiveStarServices,
  aboutFiveStarData,
}) {
  return (
    <section className="mt-8 lg:my-12">
      <h3 className="text-black text-center font-semibold text-[20px] lg:text-[32px]">
        About {aboutFiveStarData.title}
      </h3>
      <p className="max-w-[980px] px-2 lg:px-0 mx-auto text-black text-center font-montserrat text-base font-normal mt-4 lg:mt-5">
        {aboutFiveStarData.description}
      </p>
      <div className="container px-4 lg:px-0 mx-auto">
        <div className="relative">
          <ArrowButton
            direction="left"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={aboutFiveStarServices.length > 3}
            className="hidden lg:flex arrow-right-fivestar lg:left-[5px] xl:-left-[50px]"
          />
          <ArrowButton
            direction="right"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            show={aboutFiveStarServices.length > 3}
            className="hidden lg:flex arrow-left-fivestar lg:right-[5px] xl:-right-[50px]"
          />

          <div
            className="flex gap-[22px] mt-8 lg:mt-10 overflow-hidden no-scrollbar container mx-auto lg:px-[50px] xl:px-0"
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
              modules={[Autoplay, Navigation]}
              pauseonhover={"true"}
              navigation={{
                nextEl: '.arrow-left-fivestar',
                prevEl: '.arrow-right-fivestar',
              }}
              breakpoints={{
                500: {
                  slidesPerView: 1,
                  spaceBetween: 1,
                },
                750: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 5,
                },
                1440: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
              }}
              className="aboutFiveStarSwiper"
            >
              {aboutFiveStarServices.map((eachFiveStarProduct, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative lg:min-w-full cursor-pointer sm:h-[435px] pt-14 lg:pt-0 pl-[30px] flex flex-col justify-end items-start"
                  >
                    <Image
                      src={eachFiveStarProduct.image_url}
                      alt={eachFiveStarProduct.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        zIndex: -1,
                      }}
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                      // loader={({ src }) => src}
                    />
                    <span className="text-[#FFCD00] text-sm mb-2.5">
                      Customized
                    </span>
                    <h4 className="text-white font-montserrat text-[26px] z-20 font-semibold">
                      {' '}
                      {eachFiveStarProduct.title}
                    </h4>
                    {eachFiveStarProduct.is_redirection_available && (
                      <Link
                        target="_blank"
                        href={`${eachFiveStarProduct.redirect_link}`}
                        className="cursor-pointer px-[28px] py-[14px] my-10 bg-[#8A1E41] text-white font-semibold text-sm"
                      >
                        Read more
                      </Link>
                    )}
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