'use client';
import AlertMessage from '@/app/components/common/alert';
import EmailVerification from '@/app/components/shop/user/register/emailVerification';
import RegisterationForm from '@/app/components/shop/user/register/registerationForm';
import {
  API_RESPONSE_STATUS,
  CONSTANT_STRINGS,
  ROLES,
  VALUES_FOR_URLS,
} from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerTypeToRegister =  searchParams.get('customerTypeToRegister');
  const [address, setAddress] = useState("")
 

  const [registerStateData, setRegisterStateData] = useState({
    customerType: customerTypeToRegister,
    errorMessage: '',
    successMessage: '',
    processLoading: false,
  });

  const handleFormSubmit = async (e, action) => {
    e.preventDefault();
    const formElement = e.target;

    // Define common variables
    let url, method;
    let bodyData = Object.fromEntries(new FormData(formElement));
    
    // if(bodyData.)
    // Determine the API endpoint and method based on the action
    if (action === 'signup') {
      // Sign up action
      url = `/api/users/signup`;
      method = 'POST';
      bodyData["number"] = bodyData.country_code + bodyData.number
      bodyData['customer_type'] = registerStateData.customerType;
      bodyData['address'] = address
    //   console.log(bodyData.repassword)
      if (bodyData.password.length < 8) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password must be at least 8 characters long.`,
        });
        return ;

      }
      
  
    if (/\s/.test(bodyData.password)) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password cannot contain whitespace.`,
        });
        return ;
      }
  
    if (!/[a-zA-Z]/.test(bodyData.password)) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password must contain at least one letter.`,
        });
        return;
      }
  
    if (!/\d/.test(bodyData.password)) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password must contain at least one digit.`,
        });
        return;
      }
  
      if (!/[^\da-zA-Z]/.test(bodyData.password)) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password must contain at least one symbol.`,
        });
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Password must contain at least one capital letter.`,
        });
        return;
      }
      if(bodyData.password!==bodyData.repassword){
        setRegisterStateData({
          ...registerStateData,
          errorMessage: `Passwords do not match.`,
        });
        return;
      }
      delete bodyData['g-recaptcha-response'];
     
      delete bodyData['repassword'];
    } else if (action === 'verifyEmail') {
      // Verify email action
      const verificationObject = Object.fromEntries(new FormData(formElement));
      const verificationCode = Object.values(verificationObject).join('');

      // Check if the verification code has the correct length
      if (verificationCode.length !== 6) {
        // Display an error message and reset the form
        setRegisterStateData({
          ...registerStateData,
          errorMessage: 'Please provide a 6-digit verification code',
        });
        formElement.reset();
        return;
      }


      url = `/api/users/email/verify/${verificationCode}?customer_type=${registerStateData.customerType}`;
      method = 'GET';
    }

    // Set loading state while processing the request
    setRegisterStateData({ ...registerStateData, processLoading: true });

    // Send the request to the API
    const responseData = await sendRequest(url, {
      method,
      body: action === 'signup' ? JSON.stringify(bodyData) : undefined,
    });

    // Handle API response
    if (responseData.status === API_RESPONSE_STATUS.ERROR) {
      // Update registerStateData state with the error message and reset loading state
      setRegisterStateData({
        ...registerStateData,
        errorMessage: responseData.message,
        processLoading: false,
      });

      if (action === 'verifyEmail') {
        formElement.reset();
      }
    } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
      // Reset loading state
      setRegisterStateData({
        ...registerStateData,
        processLoading: false,
        errorMessage: '',
      });

      // Redirect based on the action
      if (action === 'signup') {
        router.push(`/user/register?${VALUES_FOR_URLS.VERIFICATION_PAGE}=true`);
      } else if (action === 'verifyEmail') {
        router.push('/user/login');
      }
    }
  };

  return (
    <section className="bg-white container mx-auto">
      <span className="pt-10 flex justify-center items-center text-black lg:text-4xl font-plays font-bold">
        Sign Up
      </span>
      <div className="flex justify-center mt-5 px-2">
        <div className="text-sm font-medium text-center w-full max-w-[600px] text-gray-500">
          <ul className="flex flex-wrap">
            <li
              className={`w-1/2 cursor-pointer transition duration-300 inline-block px-[40px] pb-[16px] border-b-[4px] font-semibold rounded-t-lg hover:text-[#FFCD00] ${registerStateData.customerType === ROLES.CUSTOMER_INDIVIDUAL
                ? 'text-[#FFCD00] border-[#FFCD00] lg:text-base'
                : 'text-black border-black lg:text-sm'
                }`}
              onClick={() =>
                setRegisterStateData({
                  ...registerStateData,
                  customerType: ROLES.CUSTOMER_INDIVIDUAL,
                  customerTypeChanged: true
                })
              }
            >
              General
            </li>
            <li
              className={`w-1/2 cursor-pointer transition duration-300 inline-block font-semibold px-[40px] pb-[16px] border-b-[4px] rounded-t-lg hover:text-[#FFCD00] ${registerStateData.customerType === ROLES.CUSTOMER_TRADE
                ? 'text-[#FFCD00] border-[#FFCD00] lg:text-base'
                : 'text-black border-black lg:text-sm'
                }`}
              onClick={() =>
                setRegisterStateData({
                  ...registerStateData,
                  customerType: ROLES.CUSTOMER_TRADE,
                  customerTypeChanged: true
                })
              }
            >
              Trade
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-center mx-auto py-4 sm:py-10 px-2 lg:px-[50px] xl:px-0">
        <div
          className={`grid grid-cols-1 xl:grid-cols-2 lg:container bg-[#F7F7F7] items-start px-2 w-full lg:px-0 ${registerStateData.customerType == ROLES.CUSTOMER_INDIVIDUAL
            ? ''
            : 'bg-[#F7F7F7]'
            } shadow dark:border dark:bg-grey`}
        >
          <div className="grow w-full  h-full order-2 xl:order-none	">
            {registerStateData.customerType == ROLES.CUSTOMER_INDIVIDUAL ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hidden sm:block w-full h-[750px]"
                  src="/images/login-register/gift.png"
                  alt=""
                />
              </>
            ) : (
              <div className="bg-[#851B39] text-white h-full p-4 lg:p-[40px] flex flex-col justify-start">
                <p className="text-white text-md font-weight-400 mb-4 sm:mb-[30px]">
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
          <div className="p-4 sm:px-28 sm:py-8 lg:px-20 xl:px-28">
            <div className="mb-4">
              {registerStateData.errorMessage ||
                registerStateData.successMessage ? (
                <AlertMessage
                  name={registerStateData.errorMessage ? 'error' : 'success'}
                  message={
                    registerStateData.errorMessage ||
                    registerStateData.successMessage
                  }
                  linkText={
                    registerStateData.errorMessage ===
                      CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                      ? 'here'
                      : registerStateData.errorMessage ===
                        CONSTANT_STRINGS.T0_LOGIN_PAGE
                        ? 'here'
                        : registerStateData.successMessage ===
                          CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                          ? 'here'
                          : null
                  }
                  linkHref={
                    registerStateData.errorMessage ===
                      CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                      ? `/user/register?${VALUES_FOR_URLS.VERIFICATION_PAGE}=true`
                      : registerStateData.errorMessage ===
                        CONSTANT_STRINGS.T0_LOGIN_PAGE
                        ? '/user/login'
                        : registerStateData.successMessage ===
                          CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                          ? '/user/login'
                          : null
                  }
                  textColor={
                    registerStateData.errorMessage
                      ? 'text-red-800'
                      : 'text-green-800'
                  }
                  bgColor={
                    registerStateData.errorMessage ? 'bg-red-50' : 'bg-green-50'
                  }
                  closeAction={() =>
                    setRegisterStateData({
                      ...registerStateData,
                      errorMessage: '',
                      successMessage: '',
                    })
                  }
                />
              ) : null}
            </div>
            {searchParams.get(VALUES_FOR_URLS.VERIFICATION_PAGE) ? (
              <EmailVerification
                handleFormSubmit={(e) => handleFormSubmit(e, 'verifyEmail')}
                registerStateData={registerStateData}
                setRegisterStateData={setRegisterStateData}
              />
            ) : (
              <RegisterationForm
                handleFormSubmit={(e) => handleFormSubmit(e, 'signup')}
                registerStateData={registerStateData}
                setRegisterStateData={setRegisterStateData}
                address={address}
                setAddress={setAddress}
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
