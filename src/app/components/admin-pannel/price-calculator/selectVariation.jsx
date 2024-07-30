'use client';

import { useEffect, useState } from 'react';
import TableSkeleton from '../../common/tableSkeleton';
import Delete from '../home-page/delete';
import Link from 'next/link';
import EachVariationRow from './eachVariationRow';
import Cookies from 'js-cookie';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import EachBrandingRow from './eachBrandingRow';
import PriceCalculator from '../../shop/product/product-detail/priceCalculator';

export default function SelectVariation({ productId, productData }) {
  const [priceVariationData, setPriceVariationData] = useState();
  const [activeTab, setActiveTab] = useState('BRANDED');
  const [unBrandedData, setUnBrandedData] = useState();
  const [brandedData, setBranded] = useState();

  const handleGetPriceForVariation = async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const url = `/api/products/${productId}/variation_items/prices`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        variation_items: [formData.variantId],
      }),
    };
    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setPriceVariationData(responseData.data);
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  useEffect(() => {
    async function getData() {
      const options = {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      };

      const [{ data: unBranded }, { data: branded }] = await Promise.all([
        sendRequest(`/api/products/${productId}/variations/`, options),
        sendRequest(`/api/products/${productId}/branding`, options),
      ]);
      setUnBrandedData(unBranded);
      setBranded(branded);
    }
    getData();
  }, []);

  if (!brandedData) {
    return <></>;
  }
  return (
    <>
      <PriceCalculator productId={productId} productData={productData} />

      {/* {activeTab === 'BRANDED' ? (
        <>
          
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Branding unit price
                </th>
                <th scope="col" className="px-6 py-3">
                  Branding set up price
                </th>
              </tr>
            </thead>
            <tbody>
              {brandedData.map((eachBrandingRow, index) => (
                <EachBrandingRow
                  key={index}
                  eachBrandingRow={eachBrandingRow}
                  productId={productId}
                />
              ))}
            </tbody>
          </table>
          </div>
          </>
      ) : (
        <>
          <div className="border rounded-lg border-gray-300 bg-white shadow-md p-4 mt-20">
            <h3 className="text-xl font-semibold">Select Variation</h3>
            <div className="mt-10">
              <form onSubmit={handleGetPriceForVariation}>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="variant"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Variant
                    </label>
                    <select
                      id="variant"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option defaultValue="Select Variant">
                        Select Variant
                      </option>
                      {Object.keys(unBrandedData).map((eachKey, index) => (
                        <option key={index} value={eachKey}>
                          {eachKey}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="item"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item
                    </label>
                    <select
                      id="item"
                      name="variantId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 capitalize text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option defaultValue="Select Item">Select Item</option>
                      {unBrandedData['COLOUR']?.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.color}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end justify-end">
                    <button className="bg-[#8A1E41] text-white px-4 h-12 flex justify-center items-center rounded cursor-pointer">
                      Get Price
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Variant
                </th>
                <th scope="col" className="px-6 py-3">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 flex justify-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((value, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Color
                  </th>
                  <td className="px-6 py-4">Red</td>

                  <td className="px-6 py-4 flex justify-center">
                    <div className="flex items-center gap-5">
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
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.625 5.25H19.25V4.375C19.25 3.67881 18.9734 3.01113 18.4812 2.51884C17.9889 2.02656 17.3212 1.75 16.625 1.75H11.375C10.6788 1.75 10.0111 2.02656 9.51884 2.51884C9.02656 3.01113 8.75 3.67881 8.75 4.375V5.25H4.375C4.14294 5.25 3.92038 5.34219 3.75628 5.50628C3.59219 5.67038 3.5 5.89294 3.5 6.125C3.5 6.35706 3.59219 6.57962 3.75628 6.74372C3.92038 6.90781 4.14294 7 4.375 7H5.25V22.75C5.25 23.2141 5.43437 23.6592 5.76256 23.9874C6.09075 24.3156 6.53587 24.5 7 24.5H21C21.4641 24.5 21.9092 24.3156 22.2374 23.9874C22.5656 23.6592 22.75 23.2141 22.75 22.75V7H23.625C23.8571 7 24.0796 6.90781 24.2437 6.74372C24.4078 6.57962 24.5 6.35706 24.5 6.125C24.5 5.89294 24.4078 5.67038 24.2437 5.50628C24.0796 5.34219 23.8571 5.25 23.625 5.25ZM10.5 4.375C10.5 4.14294 10.5922 3.92038 10.7563 3.75628C10.9204 3.59219 11.1429 3.5 11.375 3.5H16.625C16.8571 3.5 17.0796 3.59219 17.2437 3.75628C17.4078 3.92038 17.5 4.14294 17.5 4.375V5.25H10.5V4.375ZM21 22.75H7V7H21V22.75ZM12.25 11.375V18.375C12.25 18.6071 12.1578 18.8296 11.9937 18.9937C11.8296 19.1578 11.6071 19.25 11.375 19.25C11.1429 19.25 10.9204 19.1578 10.7563 18.9937C10.5922 18.8296 10.5 18.6071 10.5 18.375V11.375C10.5 11.1429 10.5922 10.9204 10.7563 10.7563C10.9204 10.5922 11.1429 10.5 11.375 10.5C11.6071 10.5 11.8296 10.5922 11.9937 10.7563C12.1578 10.9204 12.25 11.1429 12.25 11.375ZM17.5 11.375V18.375C17.5 18.6071 17.4078 18.8296 17.2437 18.9937C17.0796 19.1578 16.8571 19.25 16.625 19.25C16.3929 19.25 16.1704 19.1578 16.0063 18.9937C15.8422 18.8296 15.75 18.6071 15.75 18.375V11.375C15.75 11.1429 15.8422 10.9204 16.0063 10.7563C16.1704 10.5922 16.3929 10.5 16.625 10.5C16.8571 10.5 17.0796 10.5922 17.2437 10.7563C17.4078 10.9204 17.5 11.1429 17.5 11.375Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
          <div className="border rounded-lg border-gray-300 bg-white shadow-md p-4 mt-20 py-10">
        <h3 className="text-xl font-semibold">Selected Variation</h3>
        <div className="mt-5 flex justify-center">
          {Object.keys(selectedVariantionObje).map((eachKey, index) => (
            <span key={index}>
              {index != 0 && <span className="font-bold text-4xl px-5">+</span>}
              <span className="text-slate-500 text-4xl capitalize">
                {eachKey} :{' '}
              </span>{' '}
              <span className="font-bold text-4xl uppercase">
                {selectedVariantionObje[eachKey]}
              </span>
            </span>
          ))}
        </div>
      </div>
          {priceVariationData && (
            <div className="border rounded-lg border-gray-300 bg-white shadow-md p-4 mt-20">
              <h3 className="text-xl font-semibold">Define Price for Variation</h3>
        <div className="mt-10">
          <form>
            <div className="grid gap-6 mb-6 md:grid-cols-4">
              <div>
                <label
                  htmlFor="quanity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Quanity
                </label>
                <input
                  type="text"
                  id="quanity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Size"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Size"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="vendorShippingPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  INDIVIDUAL CUSTOMER PRICE
                </label>
                <input
                  type="text"
                  id="vendorShippingPrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="$15"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="customerShippingPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  TRADE CUSTOMER PRICE
                </label>
                <input
                  type="text"
                  id="customerShippingPrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="$10"
                  required
                />
              </div>
              <div className="empty col"></div>
              <div className="empty col"></div>
              <div className="empty col"></div>
              <div className="flex items-end justify-end">
                <buttom className="bg-[#8A1E41] text-white w-24 px-4 h-12 flex justify-center items-center rounded">
                  Add
                </buttom>
              </div>
            </div>
          </form>
        </div>
              <h3 className="text-xl font-semibold">
                All variation with prices
              </h3>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ACTION
                      </th>
                      <th scope="col" className="px-6 py-3">
                        QUANTITY
                      </th>
                      <th scope="col" className="px-6 py-3">
                        PRICE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        INDIVIDUAL CUSTOMER PRICE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        TRADE CUSTOMER PRICE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        is price calculated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!priceVariationData.length ? (
                      <tr>
                        <td colSpan={6} className="py-2 text-center">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      priceVariationData.map((eachVariationRow, index) => (
                        <EachVariationRow
                          key={index}
                          eachVariationRow={eachVariationRow}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )} */}
    </>
  );
}
