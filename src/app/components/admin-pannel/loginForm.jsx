'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Spinner from '../common/spinner';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS, ROLES } from '@/constants/variablesNames';
import AlertMessage from '../common/alert';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';

const LoginForm = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState("");

  // Define a single state object for the form data
  const [loginStateData, setLoginStateData] = useState({
    errorMessage: '',
    successMessage: '',
    processLoading: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the API URL
    const url = `/api/users/login`;

    // Extract form data and set the request options
    const bodyData = Object.fromEntries(new FormData(e.target));
    const options = {
      method: 'POST',
      body: JSON.stringify(bodyData),
    };
    // Set loading state while processing the login request
    setLoginStateData({ ...loginStateData, processLoading: true });
    try {
      // Send the login request to the API
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle API response with an error
        setLoginStateData({
          ...loginStateData,
          errorMessage: responseData.message,
          successMessage: '', // Clear any previous success message on error
          processLoading: false,
        });
      } else if (responseData.status === 'success') {
        // Handle API response with success
        const { role, user_id } = jwtDecode(responseData.token);
        Cookies.set("role", role)

        let expires = 30; // Default expiration
        if (isChecked) {
          expires = 365; // Set expiration to 365 days if "Remember Me" is checked
        }
        // Set the JWT token in a cookie with a 30-day expiration
        Cookies.set('token', responseData.token, { expires });
        Cookies.set('user_id', user_id, { expires });
        Cookies.set("role", role)

        setLoginStateData({
          ...loginStateData,
          successMessage: responseData.message,
          errorMessage: '', // Clear any previous error message on success
          processLoading: false,
        });

        if (role === ROLES.SUPER_ADMIN) {
          // Redirect to the admin products page for super admins
          router.push('/admin/dashboard');
        } else {
          // Redirect to the user profile page for other users
          router.push('/');
        }
      }
    } catch (error) {
      console.error('API request failed:', error);

      // Handle unexpected errors, e.g., display a generic error message to the user
      setLoginStateData({
        ...loginStateData,
        errorMessage: 'An error occurred while processing your request.',
        successMessage: '', // Clear any previous success message on error
      });
    }
  };

  return (
    <div className="bg-[#F7F7F7] w-[624px] h-[516px] p-4 md:p-8 lg:p-24 flex flex-col justify-center items-center">
      <form className="md:space-y-6 self-stretch" onSubmit={handleSubmit}>
        {(loginStateData.errorMessage) && (
          <AlertMessage
            name={loginStateData.errorMessage ? 'error' : 'success'}
            message={
              loginStateData.errorMessage || loginStateData.successMessage
            }
            linkText={null}
            linkHref={null}
            textColor={
              loginStateData.errorMessage ? 'text-red-800' : 'text-green-800'
            }
            bgColor={loginStateData.errorMessage ? 'bg-red-50' : 'bg-green-50'}
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
            className="block mb-2 text-sm font-semibold dark:text-black"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="mail@abc.com"
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
                  onChange={() => setIsChecked(!isChecked)}
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

        <div>
          <button
            type="submit"
            className="w-full my-2 text-black bg-[#FFCD00] focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-md px-5 py-2.5 text-center"
          >
            {loginStateData.processLoading ? (
              <Spinner bgColor1="white" bgColor2="#851B39" />
            ) : (
              'Login'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
