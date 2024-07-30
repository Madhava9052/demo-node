import Link from 'next/link';
import { Fragment } from 'react';

export default function BannerStrip({ services = [] }) {
  return (
    <section className="bg-[#8A1E41]">
      <div className="min-h-[70px] p-[5px] flex items-center container  mx-auto ">
        <ul className="container sm:flex lg:px-[50px] xl:px-0 items-center flex-wrap text-white flex-col sm:flex-row lg:justify-center w-full m-auto">
          {services.map((eachService, index) =>
            eachService.is_redirection_available ? (
              <Link key={index} href={eachService.redirect_link}>
                <li className="flex items-center text-white text-center font-montserrat font-semibold text-md md:text-lg lg:text-[18px] leading-normal tracking-[0.22px] cursor-pointer hover:scale-105 transition duration-300 m-2 sm:m-5 lg:my-0 ">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={eachService.image_url} alt="" />
                  <span className="ml-[12px]">{eachService.title}</span>
                </li>
                {services.length !== index + 1 && (
                  <div className="h-[50px] mx-7 w-[1px] bg-white hidden lg:inline-block"></div>
                )}
              </Link>
            ) : (
              <Fragment key={index}>
                <li className="flex items-center text-white justify-center sm:justify-start text-center font-montserrat font-semibold text-md md:text-lg lg:text-[18px] leading-normal cursor-pointer hover:scale-105 transition duration-300 m-2 lg:m-5 lg:my-0 ">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={eachService.image_url} alt="" />
                  <span className="ml-[12px]">{eachService.title}</span>
                </li>
                {services.length !== index + 1 && (
                  <div className="h-[50px] mx-7 w-[1px] bg-white hidden lg:inline-block"></div>
                )}
                {services.length !== index + 1 && <hr className='border-gray-300 lg:hidden mx-4 my-1'/>}
              </Fragment>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
