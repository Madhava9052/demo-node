'use client';
import Link from 'next/link';
import ArrowButton from '../../common/arrowButton';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function CatalogueImages({ catalogues = [] }) {
  return (
    <section className="mt-4 lg:my-12 container mx-auto">
      <h3 className="text-black text-center font-semibold text-[20px] sm:text-xl lg:text-[32px]">
        Catalogue
      </h3>
      <div className="relative px-4 lg:px-0">
        <ArrowButton
          direction="left"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={catalogues.length > 3}
          className="hidden lg:left-[5px] xl:-left-[50px] lg:flex arrow-right-catalogue"
        />
        <ArrowButton
          direction="right"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(0%, -50%)',
          }}
          show={catalogues.length > 3}
          className="hidden lg:flex lg:right-[5px] xl:-right-[50px] arrow-left-catalogue"
        />

        <div
          className="mt-4 lg:mt-[32px] container lg:px-[50px] xl:px-0 mx-auto"
          // className="flex items-center m-auto overflow-x-scroll no-scrollbar gap-3 pb-5 w-full"
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
            loop
            pauseonhover={"true"}
            navigation={{ nextEl: '.arrow-left-catalogue', prevEl: '.arrow-right-catalogue' }}
            pagination={{
              clickable: true,
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
            className="mySwiper"
          >
            {catalogues.map((eachCatalogue, index) =>
              eachCatalogue.is_redirection_available ? (
                <SwiperSlide key={index}>
                  <Link
                    className=""
                    target={
                      eachCatalogue.redirect_type === 'COLLECTION'
                        ? ''
                        : '_blank'
                    }
                    href={
                      eachCatalogue.redirect_type === 'COLLECTION'
                        ? `/category/collections/${eachCatalogue.collection_id}`
                        : eachCatalogue.redirect_link
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eachCatalogue.image_url}
                      alt=""
                      className="max-w-full lg:w-auto mx-auto"
                    />
                  </Link>
                </SwiperSlide>
              ) : (
                <SwiperSlide key={index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={eachCatalogue.image_url} alt="" />
                  {/* <img src="https://welovebrandings.spreadagency.co.nz/public/assets/images/banners/1648005404img-03.png" alt="" /> */}
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
