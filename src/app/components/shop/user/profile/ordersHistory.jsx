'use client';
import TableSkeleton from '@/app/components/common/tableSkeleton';
import { sendRequest } from '@/helpers/utils';
import { Tooltip } from '@mui/material';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orderPending, setOrderPending] = useState();
  const tableHeaders = ["Info", "Order", "Order Date", "Ship Date", "Type", "Product", "Value", "Payment Status", "Deli. Method", "Proof", "Photo", "Tracking"]

  useEffect(() => {
    const path = '/api/orders/';
    const options = {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    async function getData() {
      const responseData = await sendRequest(path, options);
      setOrderPending(responseData.data);
    }
    getData();
  }, []);

  return (
    <div>
      <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-black font-medium text-sm bg-[#D9D9D9] dark:bg-gray-700 dark:text-gray-400 divide-x divide-[#B0B0B0]">
              <tr className='divide-x divide-[#B0B0B0]'>
                  {tableHeaders.map((eachHeader, index) => <th key={index} scope="col" className="max-w-full p-1 border border-b-[#B0B0B0] border-r-[#B0B0B0]">{eachHeader} </th>)}
              </tr>
          </thead>
          <tbody>
              {!orderPending ? (
                  <TableSkeleton rows={10} columns={15} />
              ) : !orderPending.length ? (
                  <tr>
                      <td colSpan={15} className="py-2 text-center">
                          No data found
                      </td>
                  </tr>
              ) : (
                  orderPending.length>0 && orderPending?.map((eachOrder, index) => (
                      <tr
                          key={index}
                          className="bg-white divide-x divide-y divide-[#B0B0B0] dark:bg-gray-800 dark:border-gray-700 text-sm"
                      >
                          <td className="p-1 border border-b-[#B0B0B0]">
                              <Tooltip title="Order Details">
                                  <Link
                                      href={`/user/profile?product_order_id=${eachOrder.id}`}
                                  >
                                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M15.002 2.5C12.5297 2.5 10.1129 3.23311 8.05733 4.60663C6.00172 5.98015 4.39956 7.93238 3.45346 10.2165C2.50737 12.5005 2.25983 15.0139 2.74214 17.4386C3.22446 19.8634 4.41497 22.0907 6.16312 23.8388C7.91128 25.587 10.1386 26.7775 12.5633 27.2598C14.9881 27.7421 17.5014 27.4946 19.7855 26.5485C22.0696 25.6024 24.0218 24.0002 25.3953 21.9446C26.7688 19.889 27.502 17.4723 27.502 15C27.502 13.3585 27.1786 11.733 26.5505 10.2165C25.9223 8.69989 25.0015 7.3219 23.8408 6.16116C22.6801 5.00043 21.3021 4.07969 19.7855 3.45151C18.2689 2.82332 16.6435 2.5 15.002 2.5ZM18.752 16.25H16.252V18.75C16.252 19.0815 16.1203 19.3995 15.8858 19.6339C15.6514 19.8683 15.3335 20 15.002 20C14.6704 20 14.3525 19.8683 14.1181 19.6339C13.8837 19.3995 13.752 19.0815 13.752 18.75V16.25H11.252C10.9204 16.25 10.6025 16.1183 10.3681 15.8839C10.1337 15.6495 10.002 15.3315 10.002 15C10.002 14.6685 10.1337 14.3505 10.3681 14.1161C10.6025 13.8817 10.9204 13.75 11.252 13.75H13.752V11.25C13.752 10.9185 13.8837 10.6005 14.1181 10.3661C14.3525 10.1317 14.6704 10 15.002 10C15.3335 10 15.6514 10.1317 15.8858 10.3661C16.1203 10.6005 16.252 10.9185 16.252 11.25V13.75H18.752C19.0835 13.75 19.4014 13.8817 19.6358 14.1161C19.8703 14.3505 20.002 14.6685 20.002 15C20.002 15.3315 19.8703 15.6495 19.6358 15.8839C19.4014 16.1183 19.0835 16.25 18.752 16.25Z" fill="#8A1E41" />
                                      </svg>
                                  </Link>
                              </Tooltip>
                          </td>
                          <th className="px-6 py-1.5">
                              <p>{eachOrder?.order_id}</p>
                          </th>
                          <th
                              scope="row"
                              className="px-6 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                              {new Date(eachOrder.transaction_date).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </th>
                          {/* Ship Date */}
                          <td className="px-6 py-1.5">
                              <p>{eachOrder.order_item[0]?.shipped_date}</p>
                          </td>
                          {/* order */}
                          
                          {/* Type */}
                          <td className="px-6 py-1.5">
                              <p>{eachOrder?.order_item[0]?.is_branding_available ? "Branded" : "Unbranded"}</p>
                          </td>
                          <td title={eachOrder.order_item[0]?.product.name} className="px-1 py-1.5 table-cell overflow-ellipsis">
                              <p>{eachOrder.order_item[0]?.product.name}</p>
                          </td>
                          <td className="px-6 py-1.5">
                              <p>${Math.round((eachOrder.amount + Number.EPSILON) * 100) / 100}</p>
                          </td>
                          <td className="px-6 py-1.5">{eachOrder?.payment[0]?.status}</td>
                          <td className="px-6 py-1.5">{eachOrder.delivery_method}</td>
                          <td className="px-6 py-1.5">...</td>
                          <td className="px-6 py-1.5">...</td>
                          <td className="px-6 py-1.5">...</td>
                      </tr>
                  ))
              )}
          </tbody>
      </table>
  </div>
  );
}
