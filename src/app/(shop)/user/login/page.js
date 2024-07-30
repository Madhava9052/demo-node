'use client';

import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { useSearchParams } from 'next/navigation';
import {
  API_RESPONSE_STATUS,
  CONSTANT_STRINGS,
  ROLES,
  VALUES_FOR_URLS,
} from '@/constants/variablesNames';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { sendRequest } from '@/helpers/utils';
import Spinner from '@/app/components/common/spinner';
import AlertMessage from '@/app/components/common/alert';
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const [isChecked, setIsChecked] = useState(false);
  const searchParams = useSearchParams()
  var customerTypeToRegister =  searchParams.get('customerTypeToRegister');
  if (!customerTypeToRegister){
   customerTypeToRegister="CUSTOMER_INDIVIDUAL";
  } 
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [loginStateData, setLoginStateData] = useState({
    errorMessage: '',
    successMessage: '',
    customerType: customerTypeToRegister,
    processLoading: false,
  });


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const recaptchaRef = useRef(null);
  const handleCaptchaChange = (value) => {
    if (value) {
      setIsCaptchaVerified(true)
      setCaptchaError(false)
    } else {
      setIsCaptchaVerified(false)
    }
  };

  const handleCaptchaError = () => {
    setCaptchaError(true);
    setIsCaptchaVerified(false);

    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Reset the reCAPTCHA widget
    }
  };

  const handleCaptchaExpired = () => {
    setIsCaptchaVerified(false);

    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Reset the reCAPTCHA widget
    }

  };
  useEffect(() => {

    setIsCaptchaVerified(false);

    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Reset the reCAPTCHA widget
    }
  }, [loginStateData]);

  useEffect(() => {
    async function getGOuthToken() {
      if (searchParams?.has('token')) {
        const { role, user_id } = jwtDecode(searchParams.get("token"));
        Cookies.set('token', searchParams.get("token"), { expires: 30 });
        Cookies.set('user_id', user_id, { expires: 30 });
        Cookies.set("role", role)
        if (role === ROLES.SUPER_ADMIN) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/profile';
        }
      }
    }
    getGOuthToken()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract form data and set the API URL and options
    const bodyData = Object.fromEntries(new FormData(e.target));
    const url = `/api/users/login`;
    const options = {
      method: 'POST',
      body: JSON.stringify(bodyData),
    };
    
    // Set loading state while processing the login request
    setLoginStateData({ ...loginStateData, processLoading: true });
    
    try {
      // Send the login request to the API
      const responseData = await sendRequest(url, options);

      // Handle API response
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Update loginForm state with the error message and reset loading state
        setLoginStateData({
          ...loginStateData,
          email: bodyData.email, 
          errorMessage: responseData.message,
          successMessage: '', // Clear success message on error
          processLoading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Reset loading state

        // Decode the JWT token to get the user's role and user Id
        const { role, user_id } = jwtDecode(responseData.token);
        // Set the JWT token and user id in a cookie
        let expires = 30; // Default expiration
        if (isChecked) {
          expires = 365; // Set expiration to 365 days if "Remember Me" is checked
        }

        // Redirect the user based on their role and origin
        const from = searchParams.get('from');
        if (from === 'addToCart') {
          Cookies.set('token', responseData.token, { expires });
          Cookies.set('user_id', user_id, { expires });
          Cookies.set("role", role)
          setLoginStateData({
            ...loginStateData,
            errorMessage: '', // Clear any previous error message on success
            successMessage: responseData.message,
            processLoading: false,
          });
          // Redirect to the product page if coming from the cart
          window.location.href = `/product/${searchParams.get('id')}`;
          // router.push(`/product/${searchParams.get('id')}`);
        } else {
          if (role === ROLES.SUPER_ADMIN) {
            setLoginStateData({
              ...loginStateData,
              errorMessage: 'Please Login from Admin', // Clear any previous error message on success
              successMessage: "",
              processLoading: false,
            })
          } else {
            Cookies.set('token', responseData.token, { expires });
            Cookies.set('user_id', user_id, { expires });
            Cookies.set("role", role)
            setLoginStateData({
              ...loginStateData,
              errorMessage: '', // Clear any previous error message on success
              successMessage: responseData.message,
              processLoading: false,
            });
            // Redirect to the user profile page for other users
            // router.push('/user/profile');
            window.location.href = '/';
          }
        }
      }
    } catch (error) {
      console.error('API request failed:', error);

      // Handle the error, e.g., display an error message to the user
      // You might want to update the state or show a generic error message here
      setLoginStateData({
        ...loginStateData,
        errorMessage: 'An error occurred while processing your request.',
        successMessage: '', // Clear any previous success message on error
        processLoading: false,
      });
    }
  };

  return (
    <section className="bg-white container mx-auto">
      <span className="pt-10 flex justify-center items-center text-black lg:text-4xl font-plays font-bold">
        Login
      </span>
      <div className="flex justify-center mt-5 px-2">
        <div className="text-sm text-center w-full max-w-[600px] text-black font-bold">
          <ul className="flex flex-wrap">
            <li
              className={`w-1/2 cursor-pointer transition duration-300 inline-block px-[40px] pb-3 border-b-[4px] rounded-t-lg font-semibold hover:text-[#FFCD00]  ${loginStateData.customerType === ROLES.CUSTOMER_INDIVIDUAL
                ? 'text-[#FFCD00] border-yellow-400 lg:text-base '
                : 'text-black border-black lg:text-sm'
                }`}
              onClick={() =>
                setLoginStateData({
                  ...loginStateData,
                  customerType: ROLES.CUSTOMER_INDIVIDUAL,
                })
              }
            >
              General
            </li>
            <li
              className={`w-1/2 cursor-pointer  transition duration-300 inline-block px-[40px] pb-3 border-b-[4px] font-semibold rounded-t-lg hover:text-[#FFCD00]  ${loginStateData.customerType === ROLES.CUSTOMER_TRADE
                ? 'text-[#FFCD00] border-[#FFCD00] lg:text-base'
                : 'text-black border-black lg:text-sm'
                }`}
              onClick={() =>
                setLoginStateData({
                  ...loginStateData,
                  customerType: ROLES.CUSTOMER_TRADE,
                })
              }
            >
              Trade
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-start mx-auto py-4 sm:py-10 container px-2 lg:px-[50px] xl:px-0 lg:mb-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 container items-center ${loginStateData.customerType == ROLES.CUSTOMER_INDIVIDUAL
            ? ''
            : 'bg-[#F7F7F7]'
            } shadow-xl`}
        >
          <div className="grow w-full h-full order-2 lg:order-none	">
            {loginStateData.customerType == ROLES.CUSTOMER_INDIVIDUAL ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hidden sm:block w-full h-[514px]"
                  src="/images/login-register/gift.png"
                  alt=""
                />
              </>
            ) : (
              <div className="bg-[#8A1E41] text-white h-full p-4 sm:p-[40px] flex flex-col justify-center">
                <p className="text-white text-md font-weight-400 mb-[30px]">
                  At We Love Branding our time is dedicated to working with and
                  growing our commercial/trade relationships. We strive to
                  enable an easy, efficient and competitively priced experience
                  so that you can better service your customers.
                </p>
                <h4 className="text-white font-montserrat text-md sm:text-[22px] font-semibold">
                  Create a trade account for :
                </h4>
                <ul className="list-disc max-w-[570px] mx-auto sm:mt-[20px] list-outside	text-sm">
                  <li className="my-2 ml-5">Access to trade discounts.</li>
                  <li className="my-2 ml-5">
                    Accurate stock levels - both on hand and dates/quantities of
                    new stock coming in.
                  </li>
                  <li className="my-2 ml-5">
                    Ability to create client Quotes that can be saved, changed
                    and converted to orders.
                  </li>
                </ul>
                <h4 className="text-white font-montserrat text-[22px] font-semibold mt-4 sm:mt-[40px]">
                  WE LOOK FORWARD TO WORKING WITH YOU
                </h4>
              </div>
            )}
          </div>
          <div className="bg-[#F7F7F7] h-full p-4 sm:py-8 md:space-y-6 sm:px-[7rem] lg:px-20 xl:px-[7rem] order">
            <form className="md:space-y-6" action="#" onSubmit={handleSubmit}>
              {(loginStateData.errorMessage) && (
                  <AlertMessage
                    name={loginStateData.errorMessage ? 'error' : 'success'}
                    message={
                      loginStateData.errorMessage || loginStateData.successMessage
                    }
                    linkText={
                      loginStateData.errorMessage ===
                        CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                        ? 'here'
                        : loginStateData.errorMessage ===
                          CONSTANT_STRINGS.T0_LOGIN_PAGE
                          ? 'here'
                          : loginStateData.successMessage ===
                            CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                            ? 'here'
                            : null
                    }
                    linkHref={
                      loginStateData.errorMessage ===
                        CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                        ? `/user/register?${VALUES_FOR_URLS.VERIFICATION_PAGE}=true&email=${loginStateData.email}`
                        : loginStateData.errorMessage ===
                          CONSTANT_STRINGS.T0_LOGIN_PAGE
                          ? '/user/login'
                          : loginStateData.successMessage ===
                            CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                            ? '/user/login'
                            : null
                    }
                    textColor={
                      loginStateData.errorMessage
                        ? 'text-red-800'
                        : 'text-green-800'
                    }
                    bgColor={
                      loginStateData.errorMessage ? 'bg-red-50' : 'bg-green-50'
                    }
                    closeAction={() =>
                      setLoginStateData({
                        ...loginStateData,
                        errorMessage: '',
                        successMessage: '',
                      })
                    }
                  />
                )}
              <div className="my-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  autoComplete="on"
                />
              </div>
              <div className="my-2">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Password
                </label>
                <div className="relative w-full">
                  {isPasswordEmpty.trim() !== '' && <div className="absolute inset-y-0 right-0 flex items-center px-2">
                    <input className="hidden js-password-toggle" id="toggle" type="checkbox" />
                    <label onClick={() => setShowPassword(!showPassword)} className="hover:bg-gray-100 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label" htmlFor="toggle">
                      {showPassword ? <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> : <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M20.9994 3L17.6094 6.39" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6.38 17.62L3 21" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>}
                    </label>
                  </div>}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required
                    onChange={e => setIsPasswordEmpty(e.target.value)}
                    autoComplete="on"
                  />
                </div>
                <div className='mt-2 flex justify-between items-center'>
                  <div className="flex items-center">
                    <label className="inline-flex items-center">
                      <input
                        name="subscribe_newsletter"
                        id="subscribe_newsletter"
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="hidden"
                      />
                      <span className="w-4 h-4 inline-block bg-transparent border border-gray-300 rounded focus:ring-yellow-500 focus:ring-2 checked:bg-yellow-500 checked:border-transparent">
                        {isChecked && (
                          <div className="flex justify-center items-center h-full bg-yellow-400">
                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.07031 1.07031L2.75 5.39062L0.929688 3.57031L0.570312 3.92969L2.57031 5.92969L2.75 6.10156L2.92969 5.92969L7.42969 1.42969L7.07031 1.07031Z" fill="white" stroke="white" strokeWidth="0.5" />
                            </svg>
                          </div>
                        )}
                      </span>
                    </label>
                    <label
                      htmlFor="subscribe_newsletter"
                      className="ml-2 text-sm font-medium text-gray-500"
                    >
                      Remember Me
                    </label>
                  </div>
                  <Link
                    href="/user/forgot_password"
                    className="text-sm font-bold text-black hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className='flex flex-col items-start'>
                <span className='hidden text-sm font-bold w-fit'>Captcha</span>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  className='flex-1 w-full mt-2'
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                  onChange={handleCaptchaChange}
                  onErrored={handleCaptchaError}
                  onExpired={handleCaptchaExpired}
                />
              </div>

              <button
                disabled={!isCaptchaVerified}
                type="submit"
                className={`w-full my-2 text-black bg-[#FFCD00] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 py-2.5 text-center ${isCaptchaVerified ? "" : "cursor-not-allowed"}`}
              >
                {loginStateData.processLoading ? (
                  <Spinner bgColor1="white" bgColor2="#851B39" />
                ) : (
                  <span className='text-base font-bold text-black'>Login</span>
                )}
              </button>
              <div className="flex items-center justify-center my-2">
                <hr className="w-5/12 border-[#00000033]" />
                <span className="mx-[15px] font-bold text-sm">OR</span>
                <hr className="w-5/12 border-[#00000033]" />
              </div>
            </form>
            {((loginStateData.customerType === ROLES.CUSTOMER_INDIVIDUAL) && (loginStateData.customerType !== ROLES.CUSTOMER_TRADE)) && (
            <><Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login/google/${ROLES.CUSTOMER_INDIVIDUAL}`} className="w-full p-[10px] flex items-center justify-center rounded-md border border-gray-300 bg-white cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mr-1"
                src="/images/login-register/google.png"
                alt=""
              />
              <span className='text-base font-bold text-black'>Login with Google</span>
            </Link></>)}
            <p className="sm:my-2 my-4 text-gray-500 text-lg font-normal leading-normal">
              Don’t have an account yet ?
              <Link
                href={`/user/register?customerTypeToRegister=${loginStateData.customerType}`}
                className="text-base text-[#FFCD00] hover:underline ml-1"
               
              >
                {' '}
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
