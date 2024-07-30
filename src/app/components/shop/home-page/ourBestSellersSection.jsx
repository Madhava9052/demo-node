'use client';

import ItemCard from '@/app/components/common/itemCard';
import { sendRequest } from '@/helpers/utils';
import { useEffect, useState } from 'react';
import ArrowButton from '../../common/arrowButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

export default function OurBestSellersSection({ bestSellersCategories = [] }) {
  const [bestSellersData, setBestSellersData] = useState();
  const [activeSellersTab, setActiveSellersTab] = useState(
    bestSellersCategories[1]?.category_id
  );

  useEffect(() => {
    const bestSellersProducts = {};
    async function getProducts(categoryId) {
      const { data: products } = await sendRequest(
        `/api/products/category/best_sellers/${categoryId}`
      );
      bestSellersProducts[categoryId] = products;
    }
    bestSellersCategories.forEach(
      async (category) => await getProducts(category.category_id)
    );
    setTimeout(() => {
      setBestSellersData(bestSellersProducts);
    }, 3000);
  }, []);

  if (!bestSellersData) {
    return <></>;
  }

  return (
    <>
      <section className="py-6 sm:py-8 lg:py-12 bg-[#F7F7F7]">
        <div className=" container mx-auto">
          <h3 className="text-black text-center font-semibold text-[20px] sm:text-xl lg:text-[32px]">
            Our Best Sellers
          </h3>

          <div className="flex justify-center mt-4 lg:mt-[45px]">
            <div className="text-xs lg:text-sm font-medium text-center">
              <ul className="flex flex-wrap">
                {bestSellersCategories.map((eachCategory, index) => (
                  <div key={index} className={`border-b-[3px] ${activeSellersTab === eachCategory.category_id
                    ? 'text-[#8A1E41] border-[#8A1E41]'
                    : 'text-gray-500 border-gray-400'
                    }`}>
                    <li

                      className={`uppercase font-medium text-base cursor-pointer transition duration-300 inline-block mx-[5px] sm:mx-[20px] lg:mx-[40px] pb-[16px] rounded-t-lg hover:text-[#8A1E41]`}
                      onClick={() =>
                        setActiveSellersTab(eachCategory.category_id)
                      }
                    >
                      {eachCategory.category_name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative container mx-auto px-4 lg:px-0">
            <ArrowButton
              direction="left"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0%, -50%)',
              }}
              show={bestSellersData[activeSellersTab]?.length > 3}
              className="hidden lg:flex arrow-right-best-sellers lg:left-[5px] xl:-left-[50px]"
            />
            <ArrowButton
              direction="right"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0%, -50%)',
              }}
              show={bestSellersData[activeSellersTab]?.length > 3}
              className="hidden lg:flex arrow-left-best-sellers lg:right-[5px] xl:-right-[50px]"
            />

            <div
              className="flex gap-[22px] mt-[40px] no-scrollbar lg:px-[50px] xl:px-0 "
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
                navigation={{ nextEl: '.arrow-left-best-sellers', prevEl: '.arrow-right-best-sellers' }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Navigation, Scrollbar]}
                scrollbar={{
                  draggable: true,
                  hide: false, el: '.swiper-scrollbar', dragEl: '.swiper-scrollbar-drag',
                }}
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
                {bestSellersData[activeSellersTab]?.map((eachBestProduct) => (
                  <SwiperSlide key={eachBestProduct.id} className='!transform-none pb-16'>
                    <ItemCard
                      categoryPath={`our-best-sellers/`}
                      product={eachBestProduct}
                    />
                  </SwiperSlide>
                ))}
                <div
                  className="swiper-scrollbar"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    cursor: "pointer",
                    backgroundColor: "#DFDFDF",
                    width: "800px",
                    height: "4px",
                    borderRadius: "4px",
                  }}
                ></div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
