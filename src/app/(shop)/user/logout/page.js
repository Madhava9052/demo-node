'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/app/context/store';

export default function Logout() {
  const { globalStore, setGlobalStore } = useGlobalContext();

  useEffect(() => {
    // Delete the "token" cookie
    Cookies.remove('token');
    Cookies.remove('user_id');
    Cookies.remove('role');
    setGlobalStore({
      ...globalStore,
      cartCount: 0,
      wishListCount: 0,
      userToken: '',
      userId: '',
    });

    // Redirect to the login page
    window.location.href = '/user/login';
  }, []);

  return (
    <div className="flex justify-center my-20">
      <div className="flex flex-col gap-2  items-center justify-center w-68 h-56 p-2 border border-gray-200 rounded-lg bg-gray-50 ">
        <p className="text-center text-lg">
          Kindly hold on as we initiate the logout process.
        </p>
        <div className="px-4 py-2 text-md font-medium leading-none text-center text-blue-800 bg-blue-200  rounded-full animate-pulse ">
          Loading...
        </div>
      </div>
    </div>
  );
}
