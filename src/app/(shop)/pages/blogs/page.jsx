'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { blogs_data } from './dummyBlogs';
import { IoIosArrowRoundForward } from 'react-icons/io';
import BlogsSkeleton from './blogsSkeleton';
import FaqsSkeleton from '../faqs/FaqsSkeleton';
import ContactSkeleton from '../contact/ContactSkeleton';

function Blogs() {
  const [isSkeleton, setIsSkeleton] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsSkeleton(true);
    }, 3000);
  });
  return (
    <div>
      {!isSkeleton ? (
        <BlogsSkeleton />
      ) : (
        <>
          <div
            className="relative w-full h-[120px] sm:h-[190px] md:h-[228px] lg:h-[304px] xl:h-[450px]"
            style={{
              backgroundImage:
                "url('https://fivestarprint.co.nz/wp-content/uploads/2022/12/MicrosoftTeams-image.png')",
              backgroundSize: 'cover',
            }}
          >
            <div className="container pt-4 mx-auto pl-6 lg:pl-12 xl:pl-0">
              <div className="absolute bottom-[120px] pt-2 md:pt-4 lg:pt-6 ">
                <span className="text-4xl sm:text-5xl lg:text-5xl text-[#fff] font-bold">
                  Blog
                </span>
              </div>
            </div>
          </div>
          <div className="container mx-auto">
            <nav className="text-xs sm:text-sm lg:text-base pt-14">
              <ol className="list-none p-0 inline-flex">
                <li className="flex">
                  <Link
                    href="/"
                    className="hover:text-[#FFCD00] flex items-center hover:cursor-pointer"
                  >
                    Home
                  </Link>
                  <span className="mx-1">/</span>
                </li>
                <li className="flex items-center">
                  <span className="hover:cursor-default text-[#FFCD00] font-semibold">
                    {' '}
                    Blogs
                  </span>
                </li>
              </ol>
            </nav>
            <div className="py-8 flex flex-row flex-wrap justify-between items-start">
              {blogs_data.map((card) => (
                <Link key={card.id} href={`blogs/blogview?blogId=${card.id}`}>
                  <div
                    key={card.id}
                    className="w-[430px] sm:w-[300px] md:w-[380px] lg:w-[340px] xl:w-[410px] 2xl:w-[450px]  mt-10"
                  >
                    <div className="relative w-full h-[340px] overflow-hidden">
                      <div
                        className="w-full h-full hover:scale-105 transition duration-700 ease-in-out cursor-pointer"
                        style={{
                          backgroundImage: `url(${card.img})`,
                          backgroundSize: 'cover',
                        }}
                      ></div>
                      <div className="absolute bottom-0 bg-[#8A1E41] w-[76px] h-[76px] py-1 flex items-center justify-center text-center">
                        <span className="text-sm text-[#fff]">{card.date}</span>
                      </div>
                    </div>

                    <div className="h-[265px] flex flex-col pt-10 pb-12 px-6 bg-[#fafafa]">
                      <div className="flex items-center gap-4 mb-2">
                        <hr className="w-[40px] h-[2px] bg-[#8A1E41] border-0" />
                        <span className="text-[14px] text-[#000000] hover:text-[#FFCD00] transition duration-700 font-semibold cursor-pointer">
                          We Love Branding
                        </span>
                      </div>
                      <p className="h-[115px] overflow-hidden text-[25px] text-[#110729] font-bold cursor-pointer">
                        {card.desc}
                      </p>
                      <div className="flex items-center gap-3 pt-4 cursor-pointer">
                        <span className="text-[12px] text-[#110729] font-bold ">
                          READ MORE
                        </span>
                        <IoIosArrowRoundForward className="" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Blogs;
