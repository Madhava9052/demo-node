'use client';
import { useState } from 'react';

export default function PromotionalProducts({ whatwedos = [] }) {
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <>
      <section className="mt-8 lg:my-12 container mx-auto">
        <h3 className="hidden lg:block text-black text-center font-semibold text-lg sm:text-xl lg:text-[32px] tracking-[0.32px]">
          Promotional Products NZ
        </h3>
        <div className="mt-8 flex flex-wrap xl:flex-nowrap items-start gap-4 justify-center m-auto">
          <div className="hidden lg:block m-5 sm:m-0 xl:ml-0 flex-grow">
            <div
              onClick={() => setOpenVideo(true)}
              className="cursor-pointer flex-grow relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-auto object-cover" src={whatwedos[0].top_image_url} alt="" />
            </div>
            <div className="flex justify-around mt-4 gap-4">
              <div className="flex-grow w-full max-h-[361px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="object-cover w-full h-full" src={whatwedos[0].bottom_image_one_url} alt="" />
              </div>
              <div className="flex-grow w-full max-h-[361px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="object-cover w-full h-full" src={whatwedos[0].bottom_image_two_url} alt="" />
              </div>
            </div>
          </div>
          <div className='relative h-full custom-md:h-[636.63px] overflow-hidden'>
            <div className="bg-gradient-to-r from-pink-800 via-pink-600 to-pink-500 text-white p-4 lg:p-12 mx-4 sm:m-0 lg:mr-1 grid">
              <div className="grid-row">
                <h2 className="custom-md:mb-[30px] mb-8 lg:mb-16 font-montserrat text-lg lg:text-2xl font-semibold lg:max-w-[200px] mx-auto text-center">
                  {whatwedos[0].right_image_title}
                </h2>
                <div className="flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="" src={whatwedos[0].company_logo} alt="" />
                  <div>
                    <h3 className="mb-2 text-lg lg:text-[18px] font-semibold">
                      {whatwedos[0].company_title}
                    </h3>
                    <p className="lg:text-[16px] font-light max-w-[350px]">
                      {whatwedos[0].company_description}
                    </p>
                  </div>
                </div>

                <hr className="custom-md:my-7 w-full my-4 lg:my-10 bottom-1 border-white" />

                <div className="flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="" src={whatwedos[0].shipping_logo} alt="" />
                  <div>
                    <h3 className="mb-2 text-[18px] font-semibold">
                      {whatwedos[0].shopping_title}
                    </h3>
                    <p className=" text-[16px] font-light max-w-[350px]">
                      {whatwedos[0].shopping_description}
                    </p>
                  </div>
                </div>

                <hr className="custom-md:my-7 w-full my-4 lg:my-10 bottom-1 border-white" />

                <div className="flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="" src={whatwedos[0].shipping_logo} alt="" />
                  <div>
                    <h3 className="mb-2 text-[18px] font-semibold">
                      {whatwedos[0].shipping_title}
                    </h3>
                    <p className=" text-[16px] font-light max-w-[350px]">
                      {whatwedos[0].shipping_description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid-row">
                <div className="flex flex-col items-center mt-10 custom-md:mt-12 lg:mt-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="" src={whatwedos[0].payment_method_logo} alt="" />
                  <h3>{whatwedos[0].payment_method_description}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {openVideo && (
          <div
            onClick={() => setOpenVideo(false)}
            className="video-responsive fixed top-0 left-0 z-10 bg-[#00000099] w-[100vw] h-[100vh] flex justify-center items-center"
          >
            <iframe
              className="w-[calc(100vw-100px)] h-[calc(100vh-100px)]"
              src={whatwedos[0].video_url}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
            <button
              onClick={() => setOpenVideo(false)}
              title="Close (Esc)"
              type="button"
              className="w-11 h-11 flex items-center justify-center absolute top-[50px] right-[50px] text-center opacity-65 hover:opacity-100 text-white text-3xl"
            >
              ×
            </button>
          </div>
        )}
      </section>
    </>
  );
}
