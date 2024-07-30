'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Table({ data, data1, className }) {
  const router = useRouter();
  
  return (
    <table
      className={`w-full text-sm text-left text-gray-500 dark:text-gray-400 ${className}`}
    >
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            CATEGORY
          </th>
          <th scope="col" className="px-6 py-3">
            CODE
          </th>
          <th scope="col" className="px-6 py-3">
            PRICE CALCULATOR
          </th>
          <th scope="col" className="px-6 py-3">
            ADD PRICE CALCULATOR
          </th>
          <th scope="col" className="px-6 py-3">
            STATUS
          </th>
          <th scope="col" className="px-6 py-3">
            ACTION
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((value, index) => (
          <tr
            key={index}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
              >
                admin
              </button>
              Evox Lanyard
            </th>
            <td className="px-6 py-4">100225</td>
            <td className="px-6 py-4">X</td>
            <td className="px-6 py-4">
              <button className="flex items-center text-white bg-[#0888FF] rounded-md px-4 py-2">
                Add Price
                <svg
                  className="ml-1"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.75 13.125H19.25C19.4821 13.125 19.7046 13.0328 19.8687 12.8687C20.0328 12.7046 20.125 12.4821 20.125 12.25V7C20.125 6.76794 20.0328 6.54538 19.8687 6.38128C19.7046 6.21719 19.4821 6.125 19.25 6.125H8.75C8.51794 6.125 8.29538 6.21719 8.13128 6.38128C7.96719 6.54538 7.875 6.76794 7.875 7V12.25C7.875 12.4821 7.96719 12.7046 8.13128 12.8687C8.29538 13.0328 8.51794 13.125 8.75 13.125ZM9.625 7.875H18.375V11.375H9.625V7.875ZM21.875 2.625H6.125C5.66087 2.625 5.21575 2.80937 4.88756 3.13756C4.55937 3.46575 4.375 3.91087 4.375 4.375V23.625C4.375 24.0891 4.55937 24.5342 4.88756 24.8624C5.21575 25.1906 5.66087 25.375 6.125 25.375H21.875C22.3391 25.375 22.7842 25.1906 23.1124 24.8624C23.4406 24.5342 23.625 24.0891 23.625 23.625V4.375C23.625 3.91087 23.4406 3.46575 23.1124 3.13756C22.7842 2.80937 22.3391 2.625 21.875 2.625ZM21.875 23.625H6.125V4.375H21.875V23.625ZM10.9375 16.1875C10.9375 16.4471 10.8605 16.7008 10.7163 16.9167C10.5721 17.1325 10.3671 17.3008 10.1273 17.4001C9.88744 17.4994 9.62354 17.5254 9.36894 17.4748C9.11434 17.4241 8.88048 17.2991 8.69692 17.1156C8.51337 16.932 8.38836 16.6982 8.33772 16.4436C8.28708 16.189 8.31307 15.9251 8.41241 15.6852C8.51175 15.4454 8.67998 15.2404 8.89581 15.0962C9.11165 14.952 9.36541 14.875 9.625 14.875C9.9731 14.875 10.3069 15.0133 10.5531 15.2594C10.7992 15.5056 10.9375 15.8394 10.9375 16.1875ZM15.3125 16.1875C15.3125 16.4471 15.2355 16.7008 15.0913 16.9167C14.9471 17.1325 14.7421 17.3008 14.5023 17.4001C14.2624 17.4994 13.9985 17.5254 13.7439 17.4748C13.4893 17.4241 13.2555 17.2991 13.0719 17.1156C12.8884 16.932 12.7634 16.6982 12.7127 16.4436C12.6621 16.189 12.6881 15.9251 12.7874 15.6852C12.8867 15.4454 13.055 15.2404 13.2708 15.0962C13.4867 14.952 13.7404 14.875 14 14.875C14.3481 14.875 14.6819 15.0133 14.9281 15.2594C15.1742 15.5056 15.3125 15.8394 15.3125 16.1875ZM19.6875 16.1875C19.6875 16.4471 19.6105 16.7008 19.4663 16.9167C19.3221 17.1325 19.1171 17.3008 18.8773 17.4001C18.6374 17.4994 18.3735 17.5254 18.1189 17.4748C17.8643 17.4241 17.6305 17.2991 17.4469 17.1156C17.2634 16.932 17.1384 16.6982 17.0877 16.4436C17.0371 16.189 17.0631 15.9251 17.1624 15.6852C17.2617 15.4454 17.43 15.2404 17.6458 15.0962C17.8617 14.952 18.1154 14.875 18.375 14.875C18.7231 14.875 19.0569 15.0133 19.3031 15.2594C19.5492 15.5056 19.6875 15.8394 19.6875 16.1875ZM10.9375 20.5625C10.9375 20.8221 10.8605 21.0758 10.7163 21.2917C10.5721 21.5075 10.3671 21.6758 10.1273 21.7751C9.88744 21.8744 9.62354 21.9004 9.36894 21.8498C9.11434 21.7991 8.88048 21.6741 8.69692 21.4906C8.51337 21.307 8.38836 21.0732 8.33772 20.8186C8.28708 20.564 8.31307 20.3001 8.41241 20.0602C8.51175 19.8204 8.67998 19.6154 8.89581 19.4712C9.11165 19.327 9.36541 19.25 9.625 19.25C9.9731 19.25 10.3069 19.3883 10.5531 19.6344C10.7992 19.8806 10.9375 20.2144 10.9375 20.5625ZM15.3125 20.5625C15.3125 20.8221 15.2355 21.0758 15.0913 21.2917C14.9471 21.5075 14.7421 21.6758 14.5023 21.7751C14.2624 21.8744 13.9985 21.9004 13.7439 21.8498C13.4893 21.7991 13.2555 21.6741 13.0719 21.4906C12.8884 21.307 12.7634 21.0732 12.7127 20.8186C12.6621 20.564 12.6881 20.3001 12.7874 20.0602C12.8867 19.8204 13.055 19.6154 13.2708 19.4712C13.4867 19.327 13.7404 19.25 14 19.25C14.3481 19.25 14.6819 19.3883 14.9281 19.6344C15.1742 19.8806 15.3125 20.2144 15.3125 20.5625ZM19.6875 20.5625C19.6875 20.8221 19.6105 21.0758 19.4663 21.2917C19.3221 21.5075 19.1171 21.6758 18.8773 21.7751C18.6374 21.8744 18.3735 21.9004 18.1189 21.8498C17.8643 21.7991 17.6305 21.6741 17.4469 21.4906C17.2634 21.307 17.1384 21.0732 17.0877 20.8186C17.0371 20.564 17.0631 20.3001 17.1624 20.0602C17.2617 19.8204 17.43 19.6154 17.6458 19.4712C17.8617 19.327 18.1154 19.25 18.375 19.25C18.7231 19.25 19.0569 19.3883 19.3031 19.6344C19.5492 19.8806 19.6875 20.2144 19.6875 20.5625Z"
                    fill="white"
                  />
                </svg>
              </button>
            </td>
            <td className="px-6 py-4">
              <button className="flex items-center text-[#006A17] bg-[#D8FFE1] rounded-2xl px-4 py-2">
                Active
              </button>
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/admin/products/priceCalculator/${index}`}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.3103 6.87915L17.1216 2.68946C16.9823 2.55014 16.8169 2.43962 16.6349 2.36421C16.4529 2.28881 16.2578 2.25 16.0608 2.25C15.8638 2.25 15.6687 2.28881 15.4867 2.36421C15.3047 2.43962 15.1393 2.55014 15 2.68946L3.43969 14.2507C3.2998 14.3895 3.18889 14.5547 3.11341 14.7367C3.03792 14.9188 2.99938 15.114 3.00001 15.311V19.5007C3.00001 19.8985 3.15804 20.2801 3.43935 20.5614C3.72065 20.8427 4.10218 21.0007 4.50001 21.0007H8.6897C8.88675 21.0013 9.08197 20.9628 9.26399 20.8873C9.44602 20.8118 9.61122 20.7009 9.75001 20.561L21.3103 9.00071C21.4496 8.86142 21.5602 8.69604 21.6356 8.51403C21.711 8.33202 21.7498 8.13694 21.7498 7.93993C21.7498 7.74292 21.711 7.54784 21.6356 7.36583C21.5602 7.18382 21.4496 7.01844 21.3103 6.87915ZM8.6897 19.5007H4.50001V15.311L12.75 7.06102L16.9397 11.2507L8.6897 19.5007ZM18 10.1895L13.8103 6.00071L16.0603 3.75071L20.25 7.93946L18 10.1895Z"
                    fill="#434343"
                  />
                </svg>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}