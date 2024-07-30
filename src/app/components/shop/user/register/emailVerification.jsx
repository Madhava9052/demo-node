"use client"
import Spinner from '@/app/components/common/spinner';
import React, { useEffect, useRef, useState } from 'react';
import { API_RESPONSE_STATUS, CONSTANT_STRINGS, ROLES, VALUES_FOR_URLS } from '@/constants/variablesNames';
import AlertMessage from '@/app/components/common/alert';
import { sendRequest } from '@/helpers/utils';
import { useSearchParams } from 'next/navigation';

export default function EmailVerification({
  handleFormSubmit,
  registerStateData,
  isAdmin,
  setRegisterStateData
}) {
  const searchParams = useSearchParams()
  // Create an array of useRef objects to manage input elements
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [showResendOTPbtn, setShowResendOTPbtn] = useState(false)
  useEffect(() => {
    setRegisterStateData({
      customerType: ROLES.CUSTOMER_INDIVIDUAL,
      errorMessage: '',
      successMessage: '',
      processLoading: false,
    })
  }, [])

  // Handle input change for each input field
  const handleInputChange = (e, index) => {
    let value = e.target.value;

    // Remove any non-digit characters (except digits 0-9)
    value = value.replace(/[^0-9]/g, '');

    // Automatically focus on the next input field when a digit is entered
    if (value.length === 1 && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    // Update the input value with the sanitized value
    e.target.value = value.slice(0, 1);
  };

  const handleResendOtp = async () => {
    const response = await sendRequest(`/api/users/resend/otp?email=${searchParams.get("email")}`);
    if (response === API_RESPONSE_STATUS.SUCCESS) setShowResendOTPbtn(false)
  }

  // Handle keydown events, such as Backspace, to navigate between input fields
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      // Prevent the default behavior of the Backspace key
      e.preventDefault();
      // Move focus to the previous input field
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle paste events to populate input fields
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text/plain').split('');
    pasteData.forEach((char, index) => {
      if (index < 6) {
        inputRefs[index].current.value = char;
        if (index < 5) {
          inputRefs[index + 1].current.focus();
        }
      }
    });

    e.preventDefault(); // Prevent the default paste behavior
  };

  //reset otp function
  useEffect(() => {
    let otpTimer;
    const otpDuration = 15; // seconds

    function startOTPTimer() {
      let seconds = otpDuration;
      otpTimer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(otpTimer); // Stop the current timer
          setShowResendOTPbtn(true)
        }
      }, 1000);
    }
    startOTPTimer(); // Start the OTP timer

    return () => {
      clearInterval(otpTimer); // Clean up the timer when the component unmounts
    };
  }, [showResendOTPbtn]);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {registerStateData.email}</p>
            </div>
          </div>
          <form name="otpForm" onSubmit={handleFormSubmit}>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full">
                {/* Render the input fields */}
                {inputRefs.map((inputRef, index) => (
                  <div key={index} className="w-14 h-14">
                    <input
                      ref={inputRef}
                      className="no-spinners w-full h-full flex flex-col items-center justify-center text-center px-2 lg:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700 remove-arrow"
                      type="number"
                      name={`otpChar${index + 1}`}
                      maxLength={1}
                      onInput={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                    />
                  </div>
                ))}
              </div>
              {isAdmin && (
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
                          : null
                      }
                      linkHref={
                        registerStateData.errorMessage ===
                          CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                          ? `/admin/users/create?${VALUES_FOR_URLS.VERIFICATION_PAGE}=true`
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
              )}
              <div className="flex flex-col space-y-5">
                {/* Submit button */}
                {showResendOTPbtn &&
                  <menu className='flex gap-2 text-sm'>
                    <span>Didn&#39;t get the otp?</span>
                    < button onClick={handleResendOtp} type='button' className='w-fit cursor-pointer hover:underline font-semibold text-xs'>Resend</button>
                  </menu>}
                <button
                  type="submit"
                  className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#8A1E41] border-none text-white text-sm shadow-sm"
                >
                  {registerStateData.processLoading ? (
                    <Spinner bgColor1="white" bgColor2="#851B39" />
                  ) : (
                    'Verify Account'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}
