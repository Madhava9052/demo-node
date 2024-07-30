import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import useApi from '@/helpers/useApi';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Cookies from 'js-cookie';
import React, { Fragment, useState } from 'react';

export const DashboardForm = () => {
  const { globalStore } = useGlobalContext(); // Access global context
  const [dashboardStateData, setDashboardStateData] = useState({
    avatarImage: '',
    avatarImageUrl: '',
    saveProcessing: false,
    uploadingImageProcessing: false,
    errorMessage: '',
    successMessage: '',
  });

  const [newPassword, setNewPassword] = useState({
    errorMessage: '',
    successMessage: '',
    processLoading: false,
  });

  // console.log(newPassword);

  const [otp, setOtp] = useState('');
  const [otpLoader, setOtpLoader] = useState(false);
  const [showPasswordUpdatePopUp, setShowPasswordUpdatePopUp] = useState(false);
  const [showOtpPopUp, setShowOtpPopUp] = useState(false);
  const [showPasswordSuccessPopUp, setShowPasswordSuccessPopUp] =
    useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [showPassword, setShowPassword] = useState([false, false, false]);

  const isDetailsUpdated = () => {
    if (!showSaveBtn) {
      setShowSaveBtn(true);
    }
  };

  function validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    if (/\s/.test(password)) {
      return 'Password cannot contain whitespace.';
    }

    if (!/[a-zA-Z]/.test(password)) {
      return 'Password must contain at least one letter.';
    }

    if (!/\d/.test(password)) {
      return 'Password must contain at least one digit.';
    }

    if (!/[^\da-zA-Z]/.test(password)) {
      return 'Password must contain at least one symbol.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one capital letter.';
    }

    return '';
  }

  const handlePopupClick = async (e) => {
    e.stopPropagation();
  };

  const sendOTP = async () => {
    setNewPassword({
      ...newPassword,
      errorMessage: '',
      successMessage: '',
      processLoading: false,
    });

    if (newPassword.new_password !== newPassword.re_new_password) {
      setNewPassword({
        ...newPassword,
        errorMessage: 'Passwords do not match',
        processLoading: false,
      });
      return;
    }

    const returnValue = validatePassword(newPassword.new_password);

    if (returnValue === '') {
      setNewPassword({
        ...newPassword,
        processLoading: true,
      });
      const url = `/api/users/sending_otp_for_update_password`;

      // Set up the options for the API request
      const options = {
        method: 'POST',
        headers: {
          // Include an authorization header with a bearer token
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          old_password: newPassword.old_password,
          new_password: newPassword.new_password,
        }),
      };

      try {
        // Send the API request and await the response
        const responseData = await sendRequest(url, options);

        // Check if the API response indicates an error
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Update the newPassword state with the error message and reset success message
          setNewPassword({
            ...newPassword,
            errorMessage: responseData.message,
            successMessage: '',
            processLoading: false,
          });
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          // Update the newPassword state with the success message and reset error message
          setNewPassword({
            ...newPassword,
            errorMessage: '',
            successMessage: responseData.message,
            processLoading: false,
          });
          setTimeout(() => {
            setNewPassword({
              ...newPassword,
              errorMessage: '',
              successMessage: '',
              processLoading: false,
            });
            setShowPasswordUpdatePopUp(false);
            setShowOtpPopUp(true);
          }, 1000);
        }
      } catch (error) {
        // Handle any API request errors and log them
        console.error('API request failed:', error);

        // Update the dashboard state with a generic error message
        setNewPassword({
          ...newPassword,
          errorMessage: 'An error occurred while processing your request.',
          successMessage: '',
          processLoading: false,
        });
      }
    } else {
      setNewPassword({
        ...newPassword,
        errorMessage: returnValue,
        processLoading: false,
      });
      return;
    }
  };

  const updatePasswordWithOtp = async () => {
    const url = `/api/users/update_password_through_otp`;

    // Set up the options for the API request
    const options = {
      method: 'PUT',
      headers: {
        // Include an authorization header with a bearer token
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        verification_code: otp,
        new_password: newPassword.new_password,
      }),
    };

    try {
      // Send the API request and await the response
      const responseData = await sendRequest(url, options);

      // Check if the API response indicates an error
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Update the newPassword state with the error message and reset success message
        setNewPassword({
          ...newPassword,
          errorMessage: responseData.message,
          successMessage: '',
        });
        setOtp('');
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Update the newPassword state with the success message and reset error message
        setShowOtpPopUp(false);
        setShowPasswordSuccessPopUp(true);
        setNewPassword({
          errorMessage: '',
          successMessage: '',
          processLoading: false,
        });
        setOtp('');
      }
    } catch (error) {
      // Handle any API request errors and log them
      console.error('API request failed:', error);

      // Update the dashboard state with a generic error message
      setDashboardStateData({
        ...newPassword,
        errorMessage: 'An error occurred while processing your request.',
        successMessage: '',
      });
    }
  };

  const handleOtpInputChange = (event) => {
    const maxDigits = 6;
    let value = event.target.value;

    // Limit input to maxDigits characters
    if (value.length > maxDigits) {
      value = value.slice(0, maxDigits);
    }
    // Update the input value in state
    setOtp(value);
    updatePasswordWithOtp();
  };

  const path = '/api/users/dashboard';

  const { data: dashboardInfo, error, loading } = useApi(path);
  if (loading) {
    return <>Loading....</>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const sendDashboardData = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Extract form data from the event target
    const bodyData = Object.fromEntries(new FormData(e.target));
    // if (bodyData.number.length != process.env.NEXT_PUBLIC_PHONE_NUMBER_LENGTH) {
    //   setDashboardStateData({
    //     ...dashboardStateData,
    //     errorMessage: `Number length must be ${process.env.NEXT_PUBLIC_PHONE_NUMBER_LENGTH}`,
    //   });
    //   return;
    // }

    // Define the URL for the API endpoint
    const url = `/api/users/update_user_details`;

    // Set up the options for the API request
    const options = {
      method: 'PUT',
      headers: {
        // Include an authorization header with a bearer token
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(bodyData),
    };

    // Set a flag to indicate that the save operation is in progress
    setDashboardStateData({ ...dashboardStateData, saveProcessing: true });
    // setIsEmailVerified({dashboardInfo.account_information.is_verified})

    try {
      // Send the API request and await the response
      const responseData = await sendRequest(url, options);

      // Check if the API response indicates an error
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Update the dashboard state with the error message and reset success message
        setDashboardStateData({
          ...dashboardStateData,
          errorMessage: responseData.message,
          successMessage: '',
          saveProcessing: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Update the dashboard state with the success message and reset error message
        setDashboardStateData({
          ...dashboardStateData,
          errorMessage: '',
          successMessage: responseData.message,
          saveProcessing: false,
        });
        setShowSaveBtn(false);
      }
    } catch (error) {
      // Handle any API request errors and log them
      console.error('API request failed:', error);

      // Update the dashboard state with a generic error message
      setDashboardStateData({
        ...dashboardStateData,
        errorMessage: 'An error occurred while processing your request.',
        successMessage: '',
        saveProcessing: false,
      });
    }
  };

  const uploadImage = async (event) => {
    // Check if a file has been selected
    if (event.target.files && event.target.files[0]) {
      // Get the selected image file
      const image = event.target.files[0];

      // Update the dashboard state to display the selected image
      setDashboardStateData({
        ...dashboardStateData,
        avatarImageUrl: URL.createObjectURL(image),
      });
    }
    const path = `/api/upload/?path=${process.env.NEXT_PUBLIC_PROFILE_PATH_START}/${globalStore.userId}/${process.env.NEXT_PUBLIC_PROFILE_PATH_END}`;

    // Upload the image to the server and wait for the response
    const responseData = await uploadToServer(event, path);

    // Check if the server response indicates success
    if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
      // Update the dashboard state with the URL of the uploaded image
      setDashboardStateData({
        ...dashboardStateData,
        avatarImageUrl: responseData?.data?.urls[0],
      });
      setShowSaveBtn(true);
    }
  };
  return (
    <>
      {/* Pop for the entering the new password */}
      {showPasswordUpdatePopUp && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#00000060] z-20 w-[100%]"
          onClick={() => setShowPasswordUpdatePopUp(false)}
        >
          <div
            className="absolute w-[22%] bg-white z-20 pt-8 px-8 pb-2"
            onClick={handlePopupClick}
          >
            <div className="">
              <button
                onClick={() => setShowPasswordUpdatePopUp(false)}
                type="button"
                className="absolute top-0 right-0 sm:-top-4 sm:-right-4 text-black bg-[#FFCD00] hover:text-gray-900 text-sm w-10 h-10 ml-auto flex justify-center items-center z-40"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <h1 className="text-[20px] font-semibold font-[#000000]">
                My Password
              </h1>
              <div className="p-3 mt-3 flex flex-col gap-3">
                {/* <div className="flex w-full items-center gap-4">
                  <label
                    htmlFor="old_password"
                    className="font-semibold text-sm w-[40%] dark:text-black "
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="old_password"
                    id="old_password"
                    size="25"
                    className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                    placeholder="Enter password"
                    autoComplete="off"
                    onChange={(e) =>
                      setNewPassword({
                        ...newPassword,
                        old_password: e.target.value,
                      })
                    }
                  />
                </div> */}
                <div className="flex w-full items-center gap-4">
                  <label
                    htmlFor="old_password"
                    className="font-semibold text-sm w-[45%] dark:text-black "
                  >
                   Current Password
                  </label>
                  <div className="flex gap-3 justify-between items-center">
                    <div className="relative ">
                      <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <input
                          className="hidden js-password-toggle"
                          id="toggle"
                          type="checkbox"
                        />
                        <label
                          onClick={() =>
                            setShowPassword((prevState) => [
                              !prevState[0],
                              prevState[1],
                            ])
                          }
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
                      <input
                        type={showPassword[0] ? 'text' : 'password'}
                        name="old_password"
                        id="old_password"
                        size="19"
                        placeholder="Enter password"
                        className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                        required
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            old_password: e.target.value,
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center gap-4">
                  <label
                    htmlFor="new_password"
                    className="font-semibold text-sm w-[45%] dark:text-black "
                  >
                    New Password
                  </label>
                  <div className="flex gap-3 justify-between items-center">
                    <div className="relative ">
                      <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <input
                          className="hidden js-password-toggle"
                          id="toggle"
                          type="checkbox"
                        />
                        <label
                          onClick={() =>
                            setShowPassword((prevState) => [
                              prevState[0],
                              !prevState[1],
                              prevState[2]
                            ])
                          }
                          class="hover:bg-gray-100 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
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
                      <input
                        type={showPassword[1] ? 'text' : 'password'}
                        name="new_password"
                        id="new_password"
                        size="19"
                        placeholder="New password"
                        className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                        required
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            new_password: e.target.value,
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-normal">
                  At least 8 characters and must contain a combination of
                  letters, numbers, and/or symbols. Cannot begin or end with a
                  blank space.
                </span>
                <div className="flex flex-col w-full items-center gap-1 mt-4">
                  <label
                    htmlFor="reEnter_new_password"
                    className="font-semibold text-sm w-full dark:text-black "
                  >
                    Confirm New Password
                  </label>
                  <div className="flex gap-3 justify-between w-full items-center">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <input
                          className="hidden js-password-toggle"
                          id="toggle"
                          type="checkbox"
                        />
                        <label
                          onClick={() =>
                            setShowPassword((prevState) => [
                              prevState[0],
                              prevState[1],
                              !prevState[2]
                            ])
                          }
                          class="hover:bg-gray-100 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                          htmlFor="toggle"
                        >
                          {showPassword[2] ? (
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
                      <input
                        type={showPassword[2] ? 'text' : 'password'}
                        name="reEnter_new_password"
                        id="reEnter_new_password"
                        placeholder="Re-enter new password"
                        className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                        required
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            re_new_password: e.target.value,
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className=" flex justify-center bg-[#8A1E41] text-base font-semibold text-white py-2  w-[90px]"
                    onClick={sendOTP}
                  >
                    {newPassword.processLoading ? (
                      <Spinner bgColor1="white" bgColor2="#851B39" />
                    ) : (
                      'update'
                    )}
                  </button>
                </div>
                {(newPassword.errorMessage || newPassword.successMessage) && (
                  <AlertMessage
                    name={newPassword.errorMessage ? 'error' : 'success'}
                    message={
                      newPassword.errorMessage || newPassword.successMessage
                    }
                    linkText={null}
                    linkHref={null}
                    textColor={
                      newPassword.errorMessage
                        ? 'text-red-800'
                        : 'text-green-800'
                    }
                    bgColor={
                      newPassword.errorMessage ? 'bg-red-50' : 'bg-green-50'
                    }
                    closeAction={() =>
                      setNewPassword({
                        ...newPassword,
                        errorMessage: '',
                        successMessage: '',
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop for entering OTP */}
      {showOtpPopUp && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#00000060] z-20 w-[100%]  ">
          <div className="relative  w-[18%] bg-white z-20 py-8 px-8 ">
            <div className="">
              <button
                type="button"
                className="absolute top-0 right-0 sm:-top-4 sm:-right-4 text-black bg-[#FFCD00] hover:text-gray-900 text-sm w-10 h-10 ml-auto flex justify-center items-center z-40"
                data-modal-hide="authentication-modal"
                onClick={() => setShowOtpPopUp(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 my-3 flex flex-col gap-3">
                <div className="flex flex-col w-full items-center gap-4">
                  <label
                    htmlFor="otp"
                    className="font-semibold text-[22px] w-full dark:text-black "
                  >
                    Enter OTP
                  </label>
                  <input
                    type="number"
                    name="otp"
                    id="otp"
                    size="25"
                    className="remove-arrow bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                    placeholder="enter OTP"
                    autoComplete="off"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <span className="text-[9px] font-normal">
                  Note: OTP will come in your register email id and will be
                  valid only for 5 minutes. If you miss the OTP please click on
                  the below resend OTP link.
                </span>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className="text-[10px] font-semibold underline  decoration-1 text-[#8A1E41] cursor-pointer"
                    onClick={sendOTP}
                  >
                    Re-send OTP
                  </span>
                  <button
                    className=" flex justify-center bg-[#8A1E41] text-white text-base font-semibold py-2  w-[90px]"
                    onClick={handleOtpInputChange}
                  >
                    {otpLoader ? (
                      <Spinner bgColor1="white" bgColor2="#851B39" />
                    ) : (
                      'Enter'
                    )}
                  </button>
                </div>
                {(newPassword.errorMessage || newPassword.successMessage) && (
                  <AlertMessage
                    name={newPassword.errorMessage ? 'error' : 'success'}
                    message={
                      newPassword.errorMessage || newPassword.successMessage
                    }
                    linkText={null}
                    linkHref={null}
                    textColor={
                      newPassword.errorMessage
                        ? 'text-red-800'
                        : 'text-green-800'
                    }
                    bgColor={
                      newPassword.errorMessage ? 'bg-red-50' : 'bg-green-50'
                    }
                    closeAction={() =>
                      setNewPassword({
                        ...newPassword,
                        errorMessage: '',
                        successMessage: '',
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop for password updated successful */}
      {showPasswordSuccessPopUp && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#00000060] z-20 w-[100%]"
          onClick={() => setShowPasswordSuccessPopUp(false)}
        >
          <div
            className="relative  w-[18%] bg-white z-20 px-3 py-14"
            onClick={handlePopupClick}
          >
            <div className="flex flex-col justify-center text-center items-center gap-y-2">
              <button
                // onClick={() => setShowPasswordUpdatePopUp(false)}
                type="button"
                className="absolute top-0 right-0 sm:-top-4 sm:-right-4 text-black bg-[#FFCD00] hover:text-gray-900 text-sm w-10 h-10 ml-auto flex justify-center items-center z-40"
                data-modal-hide="authentication-modal"
                onClick={() => setShowPasswordSuccessPopUp(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg
                width="91"
                height="91"
                viewBox="0 0 91 91"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M45.08 88.16C68.774 88.16 88.16 68.774 88.16 45.08C88.16 21.386 68.774 2 45.08 2C21.386 2 2 21.386 2 45.08C2 68.774 21.386 88.16 45.08 88.16Z"
                  stroke="#93D500"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M26.7715 45.08L38.9631 57.2717L63.3895 32.8885"
                  stroke="#93D500"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-black text-[22px] font-semibold py-4">
                Password Changed!
              </p>
              <span>
                Your password has been <br /> changed successfully.
              </span>
            </div>
          </div>
        </div>
      )}

      {(dashboardStateData.errorMessage ||
        dashboardStateData.successMessage) && (
        <AlertMessage
          name={dashboardStateData.errorMessage ? 'error' : 'success'}
          message={
            dashboardStateData.errorMessage || dashboardStateData.successMessage
          }
          linkText={null}
          linkHref={null}
          textColor={
            dashboardStateData.errorMessage ? 'text-red-800' : 'text-green-800'
          }
          bgColor={
            dashboardStateData.errorMessage ? 'bg-red-50' : 'bg-green-50'
          }
          closeAction={() =>
            setDashboardStateData({
              ...dashboardStateData,
              errorMessage: '',
              successMessage: '',
            })
          }
        />
      )}

      <div>
        <h3 className="uppercase text-sm font-semibold bg-[#D9D9D9] text-[black] py-3 pl-6 dark:text-black">
          Login Details
        </h3>
      </div>

      <div className="flex justify-start items-start gap-x-3 mb-3 mt-3 w-full flex-wrap xl:flex-nowrap">
        <div className="flex items-center py-3 pl-6 gap-x-[120px]">
          <div className="flex items-center gap-4">
            <label
              htmlFor="email"
              className="block font-semibold text-sm dark:text-black "
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              size="30"
              className="bg-gray-50 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 cursor-not-allowed"
              defaultValue={dashboardInfo.account_information.email}
              disabled
            />
          </div>
          <div>
            <button
              className=" flex justify-center mx-4 bg-[#8A1E41] text-white text-base font-semibold py-2 px-5 w-[219px]"
              onClick={() => setShowPasswordUpdatePopUp(true)}
            >
              Change Password
            </button>
          </div>
          {/* {dashboardInfo.account_information?.is_verified && (
            <svg
              className="mx-3"
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0C4.49 0 0 4.49 0 10C0 15.51 4.49 20 10 20C15.51 20 20 15.51 20 10C20 4.49 15.51 0 10 0ZM14.78 7.7L9.11 13.37C8.97 13.51 8.78 13.59 8.58 13.59C8.38 13.59 8.19 13.51 8.05 13.37L5.22 10.54C4.93 10.25 4.93 9.77 5.22 9.48C5.51 9.19 5.99 9.19 6.28 9.48L8.58 11.78L13.72 6.64C14.01 6.35 14.49 6.35 14.78 6.64C15.07 6.93 15.07 7.4 14.78 7.7Z"
                fill="#8A1E41"
              />
            </svg>
          )} */}
        </div>
        {/* <div className="">
          <div className="flex py-3 pl-6">
            <div className="flex w-full items-center gap-6">
              <label
                htmlFor="new_password"
                className="font-semibold text-sm w-[35%] dark:text-black "
              >
                Change Password
              </label>
              <input
                type="password"
                name="new_password"
                id="new_password"
                size="25"
                className="bg-gray-50 flex-1  rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full pt-3 pb-2 px-2.5"
                placeholder="enter new password"
                onChange={(e) =>
                  setNewPassword({
                    ...newPassword,
                    new_password: e.target.value,
                  })
                }
                autoComplete="off"
              />
            </div>
            <button
              className=" flex justify-center mx-4 bg-[#8A1E41] text-white py-2 px-5 w-[90px]"
              onClick={sendOTP}
            >
              {newPassword.processLoading ? (
                <Spinner bgColor1="white" bgColor2="#851B39" />
              ) : (
                'update'
              )}
            </button>
          </div>
          <div className="flex justify-start mx-6">
            <span className="text-xs font-light">
              At least 8 characters and must contain a combination of letters,{' '}
              <br />
              numbers, and/or symbols. Cannot begin or end with a blank space.
            </span>
          </div>
        </div> */}

        {/* <div className="flex items-center py-3 pl-6 mr-6">
          <div className="flex w-full items-center gap-x-4">
            <label
              htmlFor="otp"
              className=" w-[30%] font-semibold text-sm dark:text-black "
            >
              Enter OTP
            </label>
            <input
              type="number"
              name="otp"
              id="otp"
              size="20"
              className="remove-arrow bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="enter otp here"
              value={otp}
              onChange={handleOtpInputChange}
            />
          </div>
        </div> */}
      </div>
      <form onSubmit={sendDashboardData}>
        {/* <p className="my-2 py-6 ml-2 text-xl">
        <b>Email : </b>
        {dashboardInfo.account_information.email}
      </p> */}
        <div>
          <h3 className="uppercase text-sm font-semibold bg-[#D9D9D9] text-[black] py-3 pl-6 dark:text-black">
            Account Details
          </h3>
        </div>
        <div className="p-2 mx-6 my-4 flex items-center gap-5">
          <input
            name="avatar"
            type="text"
            readOnly
            value={
              dashboardStateData.avatarImageUrl
                ? dashboardStateData.avatarImageUrl
                : dashboardInfo.profile_information.avatar
            }
            hidden
          />
          {!dashboardInfo.profile_information.avatar &&
          dashboardStateData.avatarImageUrl === '' ? (
            <svg
              className="w-20 h-20 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 14 18"
            >
              <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
            </svg>
          ) : (
            <Fragment>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-17 h-12 sm:w-[70px]  sm:h-[70px] rounded-full"
                src={
                  dashboardStateData.avatarImageUrl
                    ? dashboardStateData.avatarImageUrl
                    : dashboardInfo.profile_information.avatar
                }
                alt="avatar"
              />
            </Fragment>
          )}
          <div className="flex flex-col mx-4 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              className=""
            />
            <p className="text-xs text-wrap font-light w-fit pt-2 mr-4">
              Note: For best results, use a PNG version of your logo at least
              500px square.
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-x-2 flex-wrap xl:flex-nowrap">
          <div className="flex items-center py-3 mx-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="company"
                className="block font-semibold text-sm dark:text-black "
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                size="30"
                className="bg-gray-50 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                defaultValue={dashboardInfo.profile_information.company}
                onChange={isDetailsUpdated}
              />
            </div>
          </div>
          <div className="flex items-center py-3 mx-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="address"
                className="block font-semibold text-sm dark:text-black "
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                size="71"
                className="bg-gray-50 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                defaultValue={dashboardInfo.profile_information.address}
                onChange={isDetailsUpdated}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-x-4 flex-wrap xl:flex-nowrap">
          <div className="flex items-center py-3 mx-6">
            <div className="flex w-full items-center gap-x-4">
              <label
                htmlFor="first_name"
                className=" font-semibold w-[30%] text-sm dark:text-black "
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                size="20"
                className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                defaultValue={dashboardInfo.profile_information.first_name}
                autoComplete="on"
                onChange={isDetailsUpdated}
              />
            </div>
          </div>
          <div className="flex items-center py-3 mx-6">
            <div className="flex w-full items-center gap-x-4">
              <label
                htmlFor="last_name"
                className=" font-semibold w-[30%] text-sm dark:text-black "
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                size="20"
                className="bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                defaultValue={dashboardInfo.profile_information.last_name}
                autoComplete="on"
                onChange={isDetailsUpdated}
              />
            </div>
          </div>
          <div className="flex items-center py-3 mx-6">
            <div className="flex w-full items-center gap-x-1">
              <label
                htmlFor="number"
                className=" font-semibold w-[25%] text-sm dark:text-black "
              >
                Phone No.
              </label>
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  name="country_code"
                  id="country_code"
                  placeholder="+64"
                  size="5"
                  className="no-spinners w-1/5 bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
                  required
                  defaultValue={dashboardInfo.profile_information.country_code}
                  onChange={isDetailsUpdated}
                />
                <input
                  type="number"
                  name="number"
                  id="number"
                  size="10"
                  className="remove-arrow bg-gray-50 flex-1 rounded-[5px] border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-[80%] p-2.5"
                  defaultValue={dashboardInfo.profile_information.number}
                  autoComplete="on"
                  required
                  onChange={isDetailsUpdated}
                />
              </div>
            </div>
          </div>
        </div>

        {showSaveBtn && (
          <div className="flex justify-start">
            <button className="bg-[#8A1E41] text-white text-base font-semibold px-6 py-2 my-3 ml-6">
              {' '}
              {dashboardStateData.saveProcessing ? (
                <Spinner bgColor1="white" bgColor2="#851B39" />
              ) : (
                'SAVE'
              )}
            </button>
          </div>
        )}
      </form>
    </>
  );
};
