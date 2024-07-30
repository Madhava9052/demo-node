import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

function BlogView() {
  return (
    <>
      <div
        className="relative w-full h-[120px] sm:h-[190px] md:h-[228px] lg:h-[304px] xl:h-[450px]"
        style={{
          backgroundImage:
            "url('https://brunn.qodeinteractive.com/wp-content/uploads/2018/09/blog-title-img-1.jpg')",
          backgroundSize: 'fit',
        }}
      >
        <div className="container pt-4 mx-auto pl-6 lg:pl-12 xl:pl-0">
          <div className="absolute bottom-[150px] pt-2 md:pt-4 lg:pt-6 ">
            <span className="text-4xl sm:text-5xl lg:text-5xl text-[#fff] font-bold">
              Fivestar - Print. Design. Web.
            </span>
          </div>
        </div>
      </div>
      <div
        
        className="container mx-auto mt-10"
      >
        <div className="relative w-full h-[1000px] overflow-hidden">
          <div
            className="w-full h-full hover:scale-105 transition duration-700 ease-in-out "
            style={{
              backgroundImage: `url('https://fivestarprint.co.nz/wp-content/uploads/2023/08/Sensory-Floor-Stickers.png')`,
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="absolute bottom-0 bg-[#8A1E41] w-[76px] h-[76px] py-1 flex items-center justify-center text-center">
            <span className="text-sm text-[#fff]">Aug <br/><span>24</span></span>
          </div>
        </div>

        <div className="h-[265px] flex flex-col pt-10 pb-12 px-6 bg-[#fafafa]">
          <div className="flex items-center gap-4 mb-2">
            <hr className="w-[40px] h-[2px] bg-[#8A1E41] border-0" />
            <span className="text-[14px] text-[#000000] hover:text-[#FFCD00] transition duration-700 font-semibold ">
              We Love Branding
            </span>
          </div>
          <p className="h-[115px] overflow-hidden text-[25px] text-[#110729] font-bold ">
                Revamp Your Office Space: Creative Ways to Utilize Floor Decals
          </p>
         
        </div>
      </div>
    </>
  );
}

export default BlogView;
