'use client';
import React, { useState } from 'react';

import {
  API_RESPONSE_STATUS,
  CONSTANT_STRINGS,
  VALUES_FOR_URLS,
} from '@/constants/variablesNames';
import { useSearchParams } from 'next/navigation';
import AlertMessage from '@/app/components/common/alert';
import { sendRequest } from '@/helpers/utils';
import Spinner from '@/app/components/common/spinner';

export default function ForgotPage() {
  const searchParams = useSearchParams();
  const [forgotForm, setForgotForm] = useState({
    email: '',
    password: '',
    errorMessage: '',
    successMessage: '',
    processLoading: false,
    emailForm: !searchParams.get('token'),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForgotForm({ ...forgotForm, [name]: value });
  };

  const handleSubmit = async (e, isResetPassword) => {
    e.preventDefault();

    // Determine the API endpoint and HTTP method based on the operation
    const url = isResetPassword
      ? `/api/users/reset_password/${searchParams.get('token')}?new_password=${forgotForm.password
      }`
      : `/api/users/forgot_password?email=${forgotForm.email}`;

    const method = isResetPassword ? 'GET' : 'PUT';

    // Prepare the options for the API request
    const options = {
      method,
    };
    setForgotForm({ ...forgotForm, processLoading: true });
    try {
      // Send a request to the API based on the operation
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Update forgotForm state with the error message and clear success message
        setForgotForm({
          ...forgotForm,
          errorMessage: responseData.message,
          successMessage: '',
          processLoading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Update forgotForm state with success message and clear email, password, and error message
        setForgotForm({
          ...forgotForm,
          successMessage: responseData.message,
          email: '',
          password: '',
          errorMessage: '',
          processLoading: false,
        });
      }
    } catch (error) {
      console.error('API request failed:', error);

      // Handle the error, e.g., display an error message to the user
      // You might want to update the state or show a generic error message here
      setForgotForm({
        ...forgotForm,
        errorMessage: 'An error occurred while processing your request.',
        successMessage: '', // Clear any previous success message on error
        processLoading: false,
      });
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex justify-center flex-col items-center">
        <h1 className="mb-4 text-2xl sm:text-4xl font-extrabold leading-none  text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
          Reset Password
        </h1>
        <p className="mb-6 w-[90%] sm:w-auto text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          {' '}
          Please enter your {forgotForm.emailForm?"Email Address":"new Password"}{' '}
        </p>
      </div>
      <div className="flex justify-center items-center mx-auto py-5">
        <div className="grid grid-cols-1 items-center grow max-w-xl mx-3 shadow-md border dark:border dark:bg-grey dark:border-black">
          <div className="p-4 sm:p-8">
            <div className="text-sm font-medium">
              {forgotForm.errorMessage || forgotForm.successMessage ? (
                <AlertMessage
                  name={forgotForm.errorMessage ? 'error' : 'success'}
                  message={forgotForm.errorMessage || forgotForm.successMessage}
                  linkText={
                    forgotForm.errorMessage ===
                      CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                      ? 'here'
                      : forgotForm.successMessage ===
                        CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                        ? 'here'
                        : null
                  }
                  linkHref={
                    forgotForm.errorMessage ===
                      CONSTANT_STRINGS.TO_VERIFICATION_ACCOUNT
                      ? `/user/register?${VALUES_FOR_URLS.VERIFICATION_PAGE}=true`
                      : forgotForm.successMessage ===
                        CONSTANT_STRINGS.T0_LOGIN_PAGE_FROM_RESET_PASSWORD
                        ? '/user/login'
                        : null
                  }
                  textColor={
                    forgotForm.errorMessage ? 'text-red-800' : 'text-green-800'
                  }
                  bgColor={
                    forgotForm.errorMessage ? 'bg-red-50' : 'bg-green-50'
                  }
                  closeAction={() =>
                    setForgotForm({
                      ...forgotForm,
                      errorMessage: '',
                      successMessage: '',
                    })
                  }
                />
              ) : null}
            </div>

            <form
              className="md:space-y-6"
              action="#"
              onSubmit={(e) => handleSubmit(e, !forgotForm.emailForm)}
            >
              <div className="my-2">
                {/* Determine label text based on forgotForm.emailForm */}
                <label
                  htmlFor="inputField"
                  className="block mb-2 text-sm font-medium dark:text-black"
                >
                  {forgotForm.emailForm
                    ? 'Email'
                    : 'Password'}
                </label>
                {/* Determine input type and name based on forgotForm.emailForm */}
                <input
                  type={forgotForm.emailForm ? 'email' : 'password'}
                  name={forgotForm.emailForm ? 'email' : 'password'}
                  id="inputField"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  // Determine placeholder text based on forgotForm.emailForm
                  placeholder={
                    forgotForm.emailForm ? 'Enter Email' : 'Enter Password'
                  }
                  required
                  // Determine input value based on forgotForm.emailForm
                  value={
                    forgotForm.emailForm
                      ? forgotForm.email
                      : forgotForm.password
                  }
                  onChange={handleInputChange}
                  autoComplete="on"
                />
              </div>

              <button
                type="submit"
                className="w-full my-2 text-black bg-[#FFCD00] text-base font-bold focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-md px-5 py-2.5 text-center dark-bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {forgotForm.processLoading ? (
                  <Spinner bgColor1="white" bgColor2="#851B39" />
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
