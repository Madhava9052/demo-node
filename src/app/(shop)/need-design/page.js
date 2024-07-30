'use client';
import Accordion from '@/app/components/common/Accordion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import Cookies from 'js-cookie';
import { content } from '../../../../tailwind.config';

export default function NeedDesign() {
  const [faqsApiResponse, setFaqsApiResponse] = useState([]);
  const items = faqsApiResponse.map((item) => ({
    title: item.question,
    content: item.answer,
  }));

  useEffect(() => {
    async function fetchFaqsApi() {
      try {
        const responseData = await sendRequest(
          `/api/frequently_asked_questions`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          }
        );
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle error case
          console.error('API request error:', responseData.error);
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          console.log(responseData);
          setFaqsApiResponse(responseData.data);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }
    fetchFaqsApi();
  }, []);

  return (
    <section>
      <div className="bg-[#8A1E41] h-[100px] sm:h-[200px] flex justify-center items-center gap-2 lg:gap-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="inline grow-0 max-w-[40%] lg:max-w-full"
          src="https://welovebrandings.spreadagency.co.nz/assets/images/1647841816logo-1.png"
          alt=""
        />
        <span className="text-white text-4xl lg:text-5xl">x</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="inline grow-0 max-w-[40%] lg:max-w-full"
          src="https://welovebrandings.spreadagency.co.nz/assets/images/five-star-logo.png"
          alt=""
        />
      </div>
      <div className='bg-[#F7F7F7] '>
        <div className="container mx-auto flex flex-col items-center xl:items-start xl:flex-row justify-center xl:justify-between px-2">
          <div className="mt-8 sm:mt-[70px] flex flex-col justify-center ">
            <h3 className="mb-[20px] text-black dark:text-white text-2xl lg:text-[38px] max-w-[370px] font-semibold leading-normal">
              Hire a professional designer
            </h3>
            <p className="mb-[33px] text-gray-600 text-[18px] font-normal leading-140 max-w-[500px]">
              Welovebranding has partnered with Fivestarprint to match you with
              design experts who can take your creative product to the next
              level. Save time and stand out with gorgeous custom designs for
              your brand.
            </p>
            <ul className="flex flex-col gap-y-[20px]">
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="ml-[10px] text-black text-[18px] font-semibold leading-normal">
                  Custom design by professionals
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="ml-[10px] text-black text-[18px] font-semibold leading-normal">
                  Print-ready files & full copyright
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="ml-[10px] text-black text-[18px] font-semibold leading-normal">
                  T-Shirt design from as low as NZ$99{' '}
                </span>
              </li>
            </ul>

            <button className="max-w-[167px] sm:max-w-[167px] mt-[40px] mb-0  md:mb-0 xl:mb-[58px] bg-[#FFCD00] px-[28px] py-[14px] text-black dark:text-white text-center text-[16px] font-semibold leading-normal ">
              Contact Now
            </button>
          </div>
          <div className="">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://welovebrandings.spreadagency.co.nz/assets/images/t-shirt.png"
              alt=""
              className="relative top-8 sm:top-16 xl:top-[92px] 2xl:top-16"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-[110px] min-h-screen px-2">
        <h3 className="text-black text-center text-2xl sm:text-[38px] font-semibold leading-normal">
          How it works
        </h3>
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 mt-8 sm:mt-[83px] ">
          <div className="mx-auto cursor-pointer">
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="opacity-10 group-hover:opacity-100"
                src="https://welovebrandings.spreadagency.co.nz/assets/images/how-it-work-icon-01.png"
                alt=""
              />
              <div className="absolute bottom-0 lg:-right-1/3 bg-white h-[200px] w-[200px] md:w-[300px] md:h-[300px] border-[10px] border-solid border-[#8a1e411a] group-hover:border-[#8A1E41] bg-light-gray ">
                <div className="opacity-10 group-hover:opacity-100 text-gray-700 text-center text-[120px] sm:text-[280px] font-bold leading-normal ">
                  1
                </div>
                <div className="absolute bottom-[23px] left-4 sm:left-[30px] text-[#000000] text-xl sm:text-[26px] font-semibold text-left leading-normal">
                  Tell us what you need
                </div>
                <p className="absolute top-full mt-[50px]">
                  We start by asking you a few questions about what you are
                  trying to accomplish, your timeline and your budget.
                </p>
              </div>
            </div>
          </div>

          <div className="mr-auto cursor-pointer ml-[100px] mt-[250px]">
            <div className="relative group">
              <div className="bg-white w-[200px] h-[200px] md:w-[300px] md:h-[300px] border-[10px] border-solid border-[#8a1e411a] group-hover:border-[#8A1E41] bg-light-gray relative ">
                <div className="opacity-10 group-hover:opacity-100 text-gray-700 text-center text-[120px] sm:text-[280px] font-bold leading-normal ">
                  2
                </div>
                <div className="absolute bottom-[23px] left-4 sm:left-[30px] text-[#000000] text-xl sm:text-[26px] font-semibold text-left leading-normal">
                  Match with a Designer
                </div>
                <p className="absolute top-full mt-[50px]">
                  We&apos;ll match you with talented and vetted designers.{' '}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="opacity-10 group-hover:opacity-100 z-10 absolute -top-1/2 sm:-right-1/2"
                  src="https://welovebrandings.spreadagency.co.nz/assets/images/how-it-work-icon-02.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="mx-auto cursor-pointer mt-[150px] h-max">
            <div className="relative group flex flex-row-reverse sm:flex-row sm:gap-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="opacity-10 group-hover:opacity-100"
                src="/images/need-design-3.png"
                alt=""
              />
              <div className="relative bg-white w-[200px] md:w-[300px] md:h-[300px] border-[10px] border-solid border-[#8a1e411a] group-hover:border-[#8A1E41] bg-light-gray ">
                <div className="opacity-10 group-hover:opacity-100 text-gray-700 text-center text-[120px] sm:text-[280px] font-bold leading-normal ">
                  3
                </div>
                <div className="absolute bottom-[23px] left-4 sm:left-[30px] text-[#000000] text-xl sm:text-[26px] font-semibold text-left leading-normal">
                  Bring your design to life
                </div>
                <p className="absolute top-full mt-[50px]">
                  Your designer will create a gorgeous design for you. You
                  provide feedback and only release payment when you&apos;re
                  happy.
                </p>
              </div>
            </div>
          </div>

          <div className="mr-auto cursor-pointer ml-[100px] mt-[350px] mb-[215px] sm:mt-[350px]">
            <div className="relative group">
              <div className="bg-white w-[200px] h-[200px] md:w-[300px] md:h-[300px] border-[10px] border-solid border-[#8a1e411a] group-hover:border-[#8A1E41] bg-light-gray relative ">
                <div className="opacity-10 group-hover:opacity-100 text-gray-700 text-center text-[120px] sm:text-[280px] font-bold leading-normal ">
                  4
                </div>
                <div className="absolute bottom-[23px] left-4 sm:left-[30px] text-[#000000] text-xl sm:text-[26px] font-semibold text-left leading-normal">
                  Place your order on website
                </div>
                <p className="absolute top-full mt-[50px]">
                  Once your design is complete, simply return to Swag.com,
                  upload your design & place your order.{' '}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="opacity-10 group-hover:opacity-100 z-10 absolute -top-1/2 sm:-right-1/2"
                  src="/images/need-design-4.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contianer mx-auto text-center">
        <Link href="/need-design/provide-design">
          <button className="bg-[#FFCD00] h-[48px] w-[154px] my-2 text-[16px] font-semibold cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
      <div className="container mx-auto py-4 max-w-[720px] ">
        <h3 className="text-[26px] font-bold text-[#000000] my-5 mb-2">
          Your burning FAQs,
          <br />
          answered.
        </h3>
        <Accordion items={items} />
      </div>
      <div className="container mx-auto py-4 my-4 h-[444px] flex direction-col">
        <div className="w-[58%] bg-[#C4C4C4]">
          <img src={''} width="100%" height="100%" />
        </div>
        <div className="w-[42%] bg-[#F7F7F7] p-[60px]">
          <h4 className="text-[22px] font-semibold">We&apos;re here to help</h4>
          <p className="py-[20px]">
            Questions? Our kind, happy and humble customer support team would
            love to hear from you.
          </p>
          <div className="flex gap-4 pt-[20px]">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.7101 18.583C23.0959 17.9435 22.3551 17.6016 21.57 17.6016C20.7912 17.6016 20.044 17.9372 19.4045 18.5767L17.4037 20.5712C17.2391 20.4826 17.0745 20.4002 16.9162 20.3179C16.6882 20.204 16.473 20.0963 16.2893 19.9823C14.4152 18.792 12.7119 17.2407 11.0783 15.2336C10.2869 14.2332 9.75502 13.391 9.36879 12.5363C9.88799 12.0614 10.3692 11.5675 10.8377 11.0926C11.015 10.9153 11.1923 10.7317 11.3696 10.5544C12.6993 9.22478 12.6993 7.50256 11.3696 6.1729L9.64105 4.44434C9.44477 4.24806 9.24215 4.04545 9.0522 3.84283C8.6723 3.45027 8.2734 3.04504 7.86184 2.66514C7.24766 2.05729 6.51319 1.73438 5.74072 1.73438C4.96825 1.73438 4.22111 2.05729 3.58794 2.66514C3.58161 2.67147 3.58161 2.67147 3.57528 2.6778L1.4225 4.84957C0.612037 5.66003 0.149822 6.64778 0.048515 7.79382C-0.103446 9.64268 0.441081 11.3649 0.858973 12.4919C1.88471 15.2589 3.41698 17.8232 5.70273 20.5712C8.47602 23.8827 11.8128 26.4977 15.6245 28.3402C17.0808 29.0304 19.0246 29.8471 21.1964 29.9864C21.3294 29.9928 21.4687 29.9991 21.5953 29.9991C23.0579 29.9991 24.2863 29.4736 25.2487 28.4288C25.255 28.4162 25.2677 28.4098 25.274 28.3972C25.6033 27.9983 25.9832 27.6374 26.3821 27.2511C26.6543 26.9915 26.9329 26.7193 27.2052 26.4344C27.832 25.7822 28.1613 25.0224 28.1613 24.2436C28.1613 23.4585 27.8257 22.705 27.1862 22.0718L23.7101 18.583ZM25.9769 25.2503C25.9705 25.2503 25.9705 25.2567 25.9769 25.2503C25.7299 25.5163 25.4766 25.7569 25.2044 26.0228C24.7928 26.4154 24.3749 26.8269 23.9824 27.2891C23.3429 27.973 22.5894 28.2959 21.6016 28.2959C21.5067 28.2959 21.4054 28.2959 21.3104 28.2895C19.4299 28.1692 17.6823 27.4348 16.3717 26.8079C12.7879 25.073 9.64105 22.61 7.02606 19.4885C4.86694 16.8861 3.42331 14.4801 2.46723 11.8968C1.87838 10.3202 1.6631 9.09182 1.75808 7.93311C1.82139 7.19231 2.10632 6.57813 2.63185 6.0526L4.79096 3.89349C5.10122 3.60223 5.43047 3.44394 5.75338 3.44394C6.15228 3.44394 6.4752 3.68454 6.67781 3.88715C6.68414 3.89349 6.69047 3.89982 6.69681 3.90615C7.08304 4.26706 7.45028 4.64063 7.83651 5.03953C8.0328 5.24214 8.23541 5.44475 8.43803 5.6537L10.1666 7.38226C10.8377 8.05342 10.8377 8.67392 10.1666 9.34509C9.98296 9.5287 9.80567 9.71232 9.62205 9.88961C9.09019 10.4341 8.58366 10.9407 8.0328 11.4345C8.02013 11.4472 8.00747 11.4535 8.00114 11.4662C7.45661 12.0107 7.55792 12.5426 7.67189 12.9035C7.67822 12.9225 7.68455 12.9415 7.69088 12.9605C8.14044 14.0495 8.77361 15.0753 9.73602 16.2973L9.74236 16.3036C11.4899 18.4564 13.3324 20.1343 15.3649 21.4196C15.6245 21.5843 15.8904 21.7172 16.1437 21.8439C16.3717 21.9578 16.5869 22.0655 16.7705 22.1795C16.7959 22.1921 16.8212 22.2111 16.8465 22.2238C17.0618 22.3314 17.2644 22.3821 17.4734 22.3821C17.9989 22.3821 18.3282 22.0528 18.4358 21.9452L20.6012 19.7797C20.8165 19.5645 21.1584 19.3049 21.5573 19.3049C21.9499 19.3049 22.2728 19.5518 22.4691 19.7671C22.4754 19.7734 22.4754 19.7734 22.4818 19.7797L25.9705 23.2685C26.6227 23.9143 26.6227 24.5792 25.9769 25.2503Z"
                fill="black"
              />
              <path
                d="M16.2134 7.13708C17.8723 7.41568 19.3792 8.20081 20.5822 9.40383C21.7853 10.6069 22.5641 12.1138 22.849 13.7727C22.9186 14.1906 23.2796 14.4819 23.6911 14.4819C23.7418 14.4819 23.7861 14.4755 23.8367 14.4692C24.3053 14.3932 24.6155 13.95 24.5396 13.4815C24.1977 11.4743 23.2479 9.64444 21.7979 8.19448C20.348 6.74452 18.5181 5.79476 16.511 5.45285C16.0424 5.37687 15.6055 5.68712 15.5232 6.14934C15.4409 6.61155 15.7448 7.0611 16.2134 7.13708Z"
                fill="#8A1E41"
              />
              <path
                d="M29.9654 13.2336C29.4019 9.92848 27.8443 6.92092 25.4509 4.52754C23.0575 2.13415 20.05 0.576553 16.7448 0.0130316C16.2826 -0.0692806 15.8457 0.247305 15.7634 0.709519C15.6874 1.17807 15.9977 1.61495 16.4662 1.69727C19.4168 2.19747 22.1078 3.59678 24.2479 5.73056C26.388 7.87068 27.781 10.5617 28.2812 13.5122C28.3508 13.9301 28.7117 14.2214 29.1233 14.2214C29.1739 14.2214 29.2183 14.215 29.2689 14.2087C29.7311 14.1391 30.0477 13.6958 29.9654 13.2336Z"
                fill="#8A1E41"
              />
            </svg>
            <p>09-623 6666</p>
          </div>
          <div className="flex gap-4 pt-[20px]">
            <svg
              width="28"
              height="26"
              viewBox="0 0 28 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.5431 0.416073C27.5422 0.398378 27.5401 0.3808 27.5371 0.363398C27.5365 0.359706 27.5356 0.356074 27.5349 0.352382C27.5318 0.336913 27.5278 0.32162 27.523 0.306445C27.5222 0.303808 27.5215 0.301171 27.5206 0.298535C27.5148 0.281367 27.5079 0.26455 27.5 0.248085C27.4986 0.245332 27.4971 0.242636 27.4957 0.239882C27.4883 0.225527 27.4802 0.211523 27.4712 0.197871C27.4696 0.195351 27.4681 0.192832 27.4664 0.190371C27.4561 0.175429 27.4448 0.161015 27.4324 0.147187C27.4301 0.144551 27.4275 0.14209 27.4251 0.139511C27.4193 0.133359 27.4138 0.127031 27.4076 0.121113C27.4023 0.116015 27.3965 0.111504 27.391 0.106758C27.3891 0.105117 27.3876 0.103183 27.3856 0.101543C27.3845 0.100605 27.3832 0.0999608 27.3821 0.0990233C27.3676 0.0871873 27.3526 0.0763475 27.3371 0.066621C27.3348 0.0652147 27.3324 0.0639843 27.33 0.062578C27.3161 0.0541991 27.3018 0.0467577 27.2871 0.040078C27.2837 0.038496 27.2803 0.0368554 27.2768 0.035332C27.2603 0.0283007 27.2435 0.0221484 27.2263 0.0172265C27.2233 0.0163476 27.2203 0.0157617 27.2173 0.0149414C27.2026 0.0110742 27.1878 0.00796873 27.1728 0.00562499C27.1684 0.00492187 27.1641 0.00416015 27.1596 0.00357421C27.1425 0.00140625 27.1252 0.000117187 27.108 0C27.1041 0 27.1003 0.000234375 27.0965 0.000292968C27.0818 0.000585936 27.0671 0.00158203 27.0524 0.00333984C27.0481 0.00386718 27.0438 0.00421874 27.0395 0.00486327C27.0219 0.00744139 27.0045 0.0110742 26.9873 0.0158789C26.9843 0.0166992 26.9813 0.0177539 26.9782 0.0186914C26.9624 0.0234375 26.9468 0.029121 26.9315 0.0356249C26.9297 0.0363867 26.9277 0.0368554 26.9259 0.0376757L7.95135 8.471C7.72958 8.56961 7.62967 8.82924 7.72823 9.05108C7.82678 9.27279 8.08647 9.3727 8.30825 9.2742L24.6996 1.9892L9.55155 15.4541L1.9775 12.0879L6.55348 10.0541C6.77526 9.95547 6.87516 9.69584 6.77661 9.47406C6.67805 9.25235 6.41831 9.15244 6.19659 9.25094L0.717031 11.6863C0.558359 11.7568 0.456055 11.9142 0.456055 12.0879C0.456055 12.2615 0.558359 12.4189 0.717031 12.4895L9.22875 16.2724L10.167 23.3091C10.1673 23.3111 10.168 23.3129 10.1683 23.315C10.1714 23.3362 10.1758 23.3573 10.182 23.378C10.1827 23.3801 10.1835 23.3821 10.1841 23.3842C10.1903 23.4039 10.198 23.4232 10.2071 23.4419C10.208 23.4437 10.2087 23.4457 10.2096 23.4475C10.2189 23.466 10.2298 23.4839 10.2418 23.5013C10.2442 23.5047 10.2466 23.5079 10.249 23.5112C10.2613 23.5279 10.2745 23.5442 10.2894 23.5593C10.3045 23.5746 10.3206 23.5881 10.3373 23.6008C10.3406 23.6033 10.3438 23.6058 10.3472 23.6081C10.3645 23.6205 10.3823 23.6317 10.4008 23.6413C10.4023 23.6421 10.4039 23.6427 10.4054 23.6435C10.4241 23.6528 10.4433 23.6608 10.4629 23.6673C10.4653 23.6681 10.4676 23.6691 10.4701 23.6698C10.4906 23.6763 10.5115 23.681 10.5327 23.6845C10.5346 23.6848 10.5363 23.6855 10.5383 23.6858C10.5405 23.6861 10.5427 23.686 10.545 23.6863C10.5642 23.6888 10.5834 23.6906 10.6027 23.6906C10.6027 23.6906 10.6027 23.6906 10.6028 23.6906H10.6028C10.6029 23.6906 10.6031 23.6905 10.6031 23.6905C10.6218 23.6905 10.6404 23.6889 10.659 23.6865C10.6634 23.6859 10.6679 23.6853 10.6723 23.6846C10.7091 23.6787 10.7453 23.6681 10.78 23.6527C10.7834 23.6512 10.7868 23.6497 10.7902 23.6481C10.8065 23.6404 10.8226 23.6319 10.838 23.622C10.8386 23.6216 10.8393 23.6213 10.8399 23.6209C10.8554 23.611 10.8704 23.5996 10.8848 23.5875C10.8885 23.5843 10.8921 23.581 10.8958 23.5777C10.9008 23.5732 10.9061 23.569 10.9109 23.5643L14.6871 19.8466L21.001 25.0463C21.0808 25.1121 21.1799 25.1466 21.2805 25.1466C21.3272 25.1466 21.3743 25.1391 21.42 25.1238C21.5637 25.0757 21.6724 24.957 21.7077 24.8097L27.5319 0.541933C27.5322 0.540761 27.5322 0.539589 27.5325 0.538476C27.5366 0.520429 27.5397 0.502265 27.5415 0.483983C27.5418 0.480585 27.542 0.477187 27.5422 0.473788C27.5434 0.458144 27.5438 0.442441 27.5434 0.426796C27.5432 0.423222 27.5434 0.419648 27.5431 0.416073ZM10.8359 21.6757L10.0983 16.144L23.4491 4.27663L12.6871 17.6363C12.685 17.6389 12.6834 17.6417 12.6814 17.6444C12.6732 17.6549 12.6656 17.6656 12.6585 17.6767C12.6558 17.681 12.6534 17.6853 12.6508 17.6897C12.6443 17.7007 12.6383 17.7119 12.6329 17.7233C12.6318 17.7256 12.6303 17.7278 12.6292 17.7301L10.8359 21.6757ZM11.9836 21.2747L13.1923 18.6156L14.0049 19.2847L11.9836 21.2747ZM21.0171 23.9209L13.6443 17.8491L26.2214 2.23628L21.0171 23.9209Z"
                fill="black"
              />
            </svg>
            <p>info@welovebranding.co.nz</p>
          </div>
          <a href="#" className="">
            <button className="bg-[#FFCD00] h-[48px] w-[154px] mt-[30px] text-[16px] font-semibold cursor-pointer">
              Contact Us
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
