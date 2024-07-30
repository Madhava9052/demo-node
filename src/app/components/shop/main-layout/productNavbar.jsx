"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductNavbar({ categoriesData }) {
  const [activeProductNavbarItem, setActiveProductNavbarItem] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const filterItem = categoriesData?.find(
    (eachItem) => eachItem.name === activeProductNavbarItem
  );

  return (
    <>
      <nav className="bg-[#000] text-white overflow-auto hidden xl:flex justify-start h-10">
        <Swiper
          grabCursor
          slidesPerView="auto"
          spaceBetween={0}
          className="flex items-center justify-start lg:mx-[50px] overflow-scroll no-scrollbar text-base font-medium whitespace-nowrap container xl:mx-auto"
        >
          {categoriesData.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => item.sub_categories.length && (
            <SwiperSlide key={index} className={`cursor-pointer hover:bg-[#8A1E41] transition !w-fit !h-fit duration-300 ${index === 0 ? 'py-2 pr-4 hover:pl-4' : 'p-2 px-4'} relative`} onMouseEnter={() => { setActiveProductNavbarItem(item.name); setShowDropDown(true); }} onMouseLeave={() => { setActiveProductNavbarItem(''); setShowDropDown(false); }}>
              <Link href={`/category/${item.slug}/${item.id}`}>{item.name}</Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </nav>

      <div
        onMouseEnter={() => setActiveProductNavbarItem(activeProductNavbarItem)}
        onMouseLeave={() => setActiveProductNavbarItem('')}
        className={`bg-[#8A1E41] top-full z-20 overflow-hidden transition-all duration-300 absolute left-1/2 transform -translate-x-1/2 lg:mr-[80px] ml-auto flex container mx-auto flex-wrap items-start ${showDropDown || activeProductNavbarItem ? 'h-fit p-5' : 'max-h-0'
          }`}
      >
        <ul className="flex flex-wrap lg:w-1/2 text-white">
          {filterItem?.sub_categories.sort((a, b) => a.name.localeCompare(b.name)).map((subCategories, index) => (
            <li
              key={index}
              className="w-1/3 lg:w-1/2 xl:w-1/3 2xl-w-1/4 p-2 cursor-pointer"
            >
              <Link
                onClick={() => setActiveProductNavbarItem('')}
                href={`/category/${subCategories.slug}/${subCategories.id}`}
              >
                <span className="hover:bg-[#000] cursor-pointer p-2">
                  {subCategories.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {filterItem?.product_highlight.map((eachProduct, index) => (
          <div key={index} className="flex flex-col gap-2 w-4/3 mx-4 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={250}
              height={350}
              src={eachProduct.product.images[0].url}
              className="middle-area-logo"
              alt=""
            />
            <p>{eachProduct.product.name}</p>
            <Link
              className="text-sm hover:text-yellow-200 w-fit"
              href={`/product/top-products/${eachProduct.product.id}`}
            >
              {' '}
              Shop now
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}