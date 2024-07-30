import { useSearchParams } from 'next/navigation';
import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import { CONSTANT_STRINGS, VALUES_FOR_URLS } from '@/constants/variablesNames';
import Link from 'next/link';
import { ROLES } from '@/constants/variablesNames';
import { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Autocomplete, LoadScript } from '@react-google-maps/api';

export default function RegisterationForm({
  handleFormSubmit,
  registerStateData,
  isAdmin,
  setRegisterStateData,
  address,
  setAddress
}) {
  const [showPassword, setShowPassword] = useState([false, false]);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState('');
  const searchParams = useSearchParams();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

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
    async function getGOuthToken() {
      if (searchParams?.has('token')) {
        const { role, user_id } = jwtDecode(searchParams.get('token'));
        // Set the JWT token and user id in a cookie with a 30-day expiration
        Cookies.set('token', searchParams.get('token'), { expires: 30 });
        Cookies.set('user_id', user_id, { expires: 30 });
        if (role === ROLES.SUPER_ADMIN) {
          // Redirect to the admin products page for super admins
          // router.push('/admin/products');
          window.location.href = '/admin/dashboard';
        } else {
          // Redirect to the user profile page for other users
          // router.push('/user/profile');
          window.location.href = '/user/profile';
        }
      }
    }
    getGOuthToken();
  }, [searchParams]);

  useEffect(() => {

    setIsCaptchaVerified(false);

    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Reset the reCAPTCHA widget
    }
  }, [registerStateData]);

  return (
    <form
      name="signupForm"
      className="w-full"
      onSubmit={handleFormSubmit}
    >
      <div className="flex w-full items-center mb-2">
        <label htmlFor="company" className="text-sm font-bold w-[22%]">
          Company{registerStateData.customerType === ROLES.CUSTOMER_INDIVIDUAL ? "" : (<span className="text-red-500">*</span>)}
        </label>
        <input
          type="text"
          name="company"
          id="company"
          className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
          placeholder="Company"
          {...(registerStateData.customerType === ROLES.CUSTOMER_TRADE && { required: true })}
          autoComplete="on"
        />
      </div>

      <div className="flex items-center mb-2">
        <label
          htmlFor="firstName"
          className="text-sm font-bold w-[22%]"
        >
          First name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="first_name"
          id="firstName"
          className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
          placeholder="First name"
          required
          autoComplete="on"
        />
      </div>

      <div className="mb-2 flex items-center">
        <label
          htmlFor="lastName"
          className="text-sm font-bold w-[22%]"
        >
          Last name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="last_name"
          id="lastName"
          className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
          placeholder="Last name"
          required
        />
      </div>

      <div className="mb-2 flex items-center">
        <label htmlFor="address" className="text-sm font-bold w-[22%]">
          Address
        </label>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_KEY} libraries={["places"]} loadScriptOptions={{ async: true }}>
          <Autocomplete
            className='w-[78%]'
            onLoad={(autocomplete) => {
              setAutocomplete(autocomplete);
            }}
            onPlaceChanged={() => {
              if (autocomplete) {
                const place = autocomplete.getPlace();
                setAddress(place?.name + ", " + place?.formatted_address)
              }
            }}
            options={{ componentRestrictions: { country: ['NZ', 'IND'] } }}
          >
            <input
              type="text"
              id="line_1"
              name="line_1"
              defaultValue={address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
              placeholder="Address"
              required
            />
          </Autocomplete>
        </LoadScript>
      </div>

      <div className="mb-2 flex items-center ">
        <label
          htmlFor="phoneNumber"
          className="text-sm font-bold w-[22%] text-gray-900"
        >
          Phone No. <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-1 gap-3">
          <input
            type="number"
            name="country_code"
            id="countryCode"
            placeholder="+ Country code"
            className="w-1/3 no-spinners bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
            required
          />
          <input
            type="number"
            name="number"
            id="phoneNumber"
            placeholder="Phone number"
            className="flex-1 no-spinners bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
            required
          />
        </div>
      </div>

      <div className="mb-2 flex items-center">
        <label htmlFor="email" className="text-sm font-bold w-[22%]">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
          placeholder="name@company.com"
          required
          autoComplete="on"
        />
      </div>

      <div className="relative w-full mb-2 flex items-center gap-7">

        <label htmlFor="password" className=" mb-2 text-sm font-bold w-[22%]">
          Create Password <span className="text-red-500">*</span>
        </label>
        <div className='flex gap-3 justify-between w-full items-center'>
          <div className='relative w-1/2'>
            {isPasswordEmpty.trim() !== '' && (
              <div className="absolute inset-y-0 right-0 flex items-center px-2">
                <input
                  className="hidden js-password-toggle"
                  id="toggle"
                  type="checkbox"
                />
                <label
                  onClick={() => setShowPassword(prevState => [!prevState[0], prevState[1]])}
                  class="hover:bg-gray-100 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                  htmlFor="toggle"
                >
                  {showPassword[0] ? (
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {' '}
                        <path
                          d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                      </g>
                    </svg>
                  ) : (
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {' '}
                        <path
                          d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M20.9994 3L17.6094 6.39"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M6.38 17.62L3 21"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                        <path
                          d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                      </g>
                    </svg>
                  )}
                </label>
              </div>
            )}
            <input
              type={showPassword[0] ? 'text' : "password"}
              name="password"
              id="password"
              placeholder="Enter Password"
              className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
              required
              onChange={(e) => setIsPasswordEmpty(e.target.value)}
              autoComplete="on"
            />
          </div>
          <p className='flex-1 font-medium text-[8px]'>
            At least 8 characters and must contain a combination of letters, numbers, and/or symbols. Cannot begin or end with a blank space.
          </p>
        </div>
      </div>

      <div className="relative w-full mb-2 flex items-center">
        {isPasswordEmpty.trim() !== '' && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <input
              className="hidden js-password-toggle"
              id="toggle1"
              type="checkbox"
            />
            <label
              onClick={() => setShowPassword(prevState => [prevState[0], !prevState[1]])}
              className="hover:bg-gray-100 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
              htmlFor="toggle"
            >
              {showPassword[1] ? (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                  </g>
                </svg>
              ) : (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M20.9994 3L17.6094 6.39"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M6.38 17.62L3 21"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                    <path
                      d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                  </g>
                </svg>
              )}
            </label>
          </div>
        )}
        <label htmlFor="repassword" className=" mb-2 text-sm font-bold w-[22%]">
          Re-create Password <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword[1] ? 'text' : 'password'}
          name="repassword"
          id="repassword"
          placeholder="Re-Enter Password"
          className="flex-1 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 "
          required
          onChange={(e) => setIsPasswordEmpty(e.target.value)}
          autoComplete="on"
        />
      </div>

      {!isAdmin && (
        <div className='flex items-center'>
          <span className='text-sm font-bold w-[22%]'>
            Captcha <span className="text-red-500">*</span>
          </span>
          <ReCAPTCHA
            ref={recaptchaRef}
            className='flex-1 w-full'
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
            onChange={handleCaptchaChange}
            onErrored={handleCaptchaError}
            onExpired={handleCaptchaExpired}
          />
        </div>
      )}

      {isAdmin && (
        <div className="my-2 ">
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-bold text-gray-900"
          >
            Customer Type <span className="text-red-500">*</span>
          </label>
          <select
            type="dropdown"
            name="customer_type"
            id="customerType"
            className="no-spinners bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required
          >
            <option value="">Select</option>
            {['CUSTOMER_INDIVIDUAL', 'CUSTOMER_TRADE'].map(
              (eachValue, index) => (
                <option key={index} value={eachValue}>
                  {eachValue}
                </option>
              )
            )}
          </select>
        </div>
      )}

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

      {isAdmin ? (
        <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
          {registerStateData.processLoading ? (
            <Spinner bgColor1="white" bgColor2="#851B39" />
          ) : (
            'Submit'
          )}
        </button>
      ) : (
        <button
          type="submit"
          disabled={!isCaptchaVerified}
          className={`w-full my-2 text-black   focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-[#FFCD00] ${isCaptchaVerified ? "" : "cursor-not-allowed"}`}
        >
          {registerStateData.processLoading ? (
            <Spinner bgColor1="white" bgColor2="#851B39" />
          ) : (
            'Sign up'
          )}
        </button>
      )}
      {!isAdmin && (registerStateData.customerType === ROLES.CUSTOMER_INDIVIDUAL) && (registerStateData.customerType !== ROLES.CUSTOMER_TRADE)&& (
        <>
          <div className="flex items-center justify-center">
            <hr className="w-5/12 border-[#00000033]" />
            <span className="mx-[15px] font-bold text-sm">OR</span>
            <hr className="w-5/12 border-[#00000033]" />
          </div>
          <Link
            href={`https://api-dev.wlb.spreadagency.co.nz/api/users/login/google/${ROLES.CUSTOMER_INDIVIDUAL}`}
            className="my-2 w-full p-[10px] flex items-center font-bold text-sm justify-center rounded-md border border-gray-300 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mr-1"
              src="/images/login-register/google.png"
              alt=""
            />
            Sign-up with Google
          </Link>

        </>
      )}
      {!isAdmin && (
        <>
          <p className="sm:my-2 my-4 text-gray-500 text-lg font-normal leading-normal">
            Already have an account?{' '}
            <Link
              href={`/user/login?customerTypeToRegister=${registerStateData.customerType}`}
              className="text-base text-[#FFCD00] hover:underline ml-1"
            >
              Login in here
            </Link>
          </p>
        </>
      )}
    </form>
  );
}
