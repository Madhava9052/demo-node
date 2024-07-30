'use client';
import TableSkeleton from '@/app/components/common/tableSkeleton';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import React, { Fragment, useEffect, useState } from 'react';
import DesignFiles from './designFiles';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

export default function EachOrderHistory({ productOrderId }) {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const path = `/api/orders/${productOrderId}/?status=NEWORDER`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    async function getData() {
      const responseData = await sendRequest(path, options);
      setOrderDetails(responseData.data[0]);
    }
    getData();
  }, [productOrderId]);

  function getFileIcon(image) {
    const fileType = image.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType)) {
      return <img className="w-10 h-10" src={image.url} alt={image.name} />;
    } else if (
      ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'pptx', 'txt'].includes(fileType)
    ) {
      return (
        <svg
          width="25"
          height="38"
          viewBox="0 0 17 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.81602 11.0043C7.60117 10.3168 7.60547 8.98906 7.73008 8.98906C8.09102 8.98906 8.05664 10.5746 7.81602 11.0043ZM7.74297 13.0324C7.41211 13.9004 6.99961 14.893 6.52266 15.7266C7.30899 15.4258 8.19844 14.9875 9.22539 14.7855C8.67969 14.373 8.15547 13.7801 7.74297 13.0324ZM3.69961 18.3949C3.69961 18.4293 4.2668 18.1629 5.19922 16.6676C4.91133 16.9383 3.94883 17.7203 3.69961 18.3949ZM10.6563 6.875H16.5V20.9688C16.5 21.5402 16.0402 22 15.4688 22H1.03125C0.459766 22 0 21.5402 0 20.9688V1.03125C0 0.459766 0.459766 0 1.03125 0H9.625V5.84375C9.625 6.41094 10.0891 6.875 10.6563 6.875ZM10.3125 14.257C9.45313 13.7328 8.88164 13.0109 8.47774 11.9453C8.67109 11.1504 8.97617 9.94297 8.74414 9.18672C8.54219 7.92344 6.92227 8.04805 6.69023 8.89453C6.47539 9.68086 6.67305 10.7895 7.03828 12.2031C6.53984 13.3891 5.80508 14.9789 5.28516 15.8898C5.28086 15.8898 5.28086 15.8941 5.27656 15.8941C4.11211 16.4914 2.11406 17.8062 2.93477 18.816C3.17539 19.1125 3.62227 19.2457 3.85859 19.2457C4.62773 19.2457 5.39258 18.4723 6.48398 16.5902C7.59258 16.225 8.80859 15.7695 9.87852 15.5934C10.8109 16.1004 11.9023 16.4312 12.6285 16.4312C13.8832 16.4312 13.9691 15.0562 13.475 14.5664C12.8777 13.982 11.1418 14.1496 10.3125 14.257ZM16.1992 4.51172L11.9883 0.300781C11.7949 0.107422 11.5328 0 11.2578 0H11V5.5H16.5V5.23789C16.5 4.96719 16.3926 4.70508 16.1992 4.51172ZM13.0152 15.4816C13.1914 15.3656 12.9078 14.9703 11.1762 15.0949C12.7703 15.7738 13.0152 15.4816 13.0152 15.4816Z"
            fill="#8A1E41"
          />
        </svg>
      );
    }
  }

 

  if (!orderDetails) {
    return <> Loading..</>;
  }

  return (
    <>
      <div className="bg-white container my-4 ">
      <section className="flex gap-2 justify-between overflow-auto">
        {/* Order Details */}
        <article className="flex gap-3 min-w-max">
          <div className="w-[2px] bg-[#B0B0B0] h-[190px] opacity-60"></div>
          <div className="flex flex-col text-sm">
            <h4 className="text-base font-semibold text-[#8A1E41]">
              Order Details
            </h4>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="font-medium">Order No. :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.order_id}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Order Date :</td>
                  <td className="text-[#8A1E41]">
                    {new Date(orderDetails.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Type :</td>
                  <td className="text-[#8A1E41]">Branded & Unbranded</td>
                </tr>
                <tr>
                  <td className="font-medium">Value :</td>
                  <td className="text-[#8A1E41]">
                    ${orderDetails?.total_due_price_with_gst?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Sales Person :</td>
                  <td className="text-[#8A1E41]">{orderDetails?.sales_person?.first_name}</td>
                </tr>
                <tr>
                  <td className="font-medium">Operator :</td>
                  <td className="text-[#8A1E41]">{orderDetails?.operator?.first_name}</td>
                </tr>
                <tr>
                  <td className="font-medium">Source :</td>
                  <td className="text-[#8A1E41]">{orderDetails?.source}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        {/* Details */}
        <article className="flex gap-3 min-w-max">
          <div className="w-[2px] bg-[#B0B0B0] h-[190px] opacity-60"></div>
          <div className="flex flex-col text-sm">
            <h4 className="text-base font-semibold text-[#8A1E41]">
              Details
            </h4>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="font-medium">D. Method :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.delivery_method}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">First Name :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.user.first_name}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Last Name :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.user.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Company :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.user.company}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Email :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.user?.email[0]?.email}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Phone :</td>
                  <td className="text-[#8A1E41]">
                    {orderDetails.user?.number[0]?.number}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        {/* billing address*/}
        <article className="flex gap-3 min-w-max">
          <div className="w-[2px] bg-[#B0B0B0] h-[190px] opacity-60"></div>
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-3">
              <h4 className="text-base font-semibold text-[#8A1E41]">
                Billing Details
              </h4>
            </div>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.first_name}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.company}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.email}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.number}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.billing_address?.street_number}&nbsp;
                    {orderDetails?.billing_address?.line_1}&nbsp;
                    {orderDetails?.billing_address?.line_2},
                    <br />
                    {orderDetails?.billing_address?.city},&nbsp;
                    {orderDetails?.billing_address?.state}&nbsp;
                    {orderDetails?.billing_address?.postal_code}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        {/* shipping address */}
        <article className="flex gap-3 min-w-max">
          <div className="w-[2px] bg-[#B0B0B0] h-[190px] opacity-60"></div>
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-3">
              <h4 className="text-base font-semibold text-[#8A1E41]">
                Shipping Details
              </h4>
            </div>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.first_name}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.company}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.email}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.number}
                  </td>
                </tr>
                <tr>
                  <td className="text-[#8A1E41]">
                    {orderDetails?.shipping_address?.street_number}&nbsp;
                    {orderDetails?.shipping_address?.line_1}&nbsp;
                    {orderDetails?.shipping_address?.line_2},
                    <br />
                    {orderDetails?.shipping_address?.city},&nbsp;
                    {orderDetails?.shipping_address?.state}&nbsp;
                    {orderDetails?.shipping_address?.postal_code}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        {/* Media */}
        <article className="flex gap-3 min-w-max">
          <div className="w-[2px] bg-[#B0B0B0] h-[190px] opacity-60"></div>
          <div className="flex flex-col text-sm">
            <h4 className="text-base font-semibold text-[#8A1E41]">
              Media
            </h4>
            <table className="mt-4 w-auto">
              <tbody>
                <tr>
                  <td className="font-medium">Invoice :</td>
                  <td className="text-[#8A1E41]">
                    <svg
                      width="12"
                      height="16"
                      viewBox="0 0 12 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 7.75V8.625C9 8.83125 8.83125 9 8.625 9H3.375C3.16875 9 3 8.83125 3 8.625V7.75C3 7.54375 3.16875 7.375 3.375 7.375H8.625C8.83125 7.375 9 7.54375 9 7.75ZM8.625 10H3.375C3.16875 10 3 10.1687 3 10.375V11.25C3 11.4563 3.16875 11.625 3.375 11.625H8.625C8.83125 11.625 9 11.4563 9 11.25V10.375C9 10.1687 8.83125 10 8.625 10ZM12 4.12187V14.5C12 15.3281 11.3281 16 10.5 16H1.5C0.671875 16 0 15.3281 0 14.5V1.5C0 0.671875 0.671875 0 1.5 0H7.87813C8.275 0 8.65625 0.159375 8.9375 0.440625L11.5594 3.0625C11.8406 3.34063 12 3.725 12 4.12187ZM8 1.62188V4H10.3781L8 1.62188ZM10.5 14.5V5.5H7.25C6.83438 5.5 6.5 5.16563 6.5 4.75V1.5H1.5V14.5H10.5Z"
                        fill="#8A1E41"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Proof :</td>
                  <td className="text-[#8A1E41]">
                    <svg
                      width="12"
                      height="16"
                      viewBox="0 0 12 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.68438 8.00313C5.52813 7.50313 5.53125 6.5375 5.62188 6.5375C5.88438 6.5375 5.85938 7.69063 5.68438 8.00313ZM5.63125 9.47812C5.39063 10.1094 5.09063 10.8313 4.74375 11.4375C5.31563 11.2188 5.9625 10.9 6.70938 10.7531C6.3125 10.4531 5.93125 10.0219 5.63125 9.47812ZM2.69063 13.3781C2.69063 13.4031 3.10313 13.2094 3.78125 12.1219C3.57188 12.3187 2.87188 12.8875 2.69063 13.3781ZM7.75 5H12V15.25C12 15.6656 11.6656 16 11.25 16H0.75C0.334375 16 0 15.6656 0 15.25V0.75C0 0.334375 0.334375 0 0.75 0H7V4.25C7 4.6625 7.3375 5 7.75 5ZM7.5 10.3687C6.875 9.9875 6.45938 9.4625 6.16563 8.6875C6.30625 8.10938 6.52813 7.23125 6.35938 6.68125C6.2125 5.7625 5.03438 5.85313 4.86563 6.46875C4.70938 7.04063 4.85313 7.84688 5.11875 8.875C4.75625 9.7375 4.22188 10.8937 3.84375 11.5562C3.84063 11.5562 3.84063 11.5594 3.8375 11.5594C2.99063 11.9937 1.5375 12.95 2.13438 13.6844C2.30938 13.9 2.63438 13.9969 2.80625 13.9969C3.36563 13.9969 3.92188 13.4344 4.71563 12.0656C5.52188 11.8 6.40625 11.4688 7.18438 11.3406C7.8625 11.7094 8.65625 11.95 9.18438 11.95C10.0969 11.95 10.1594 10.95 9.8 10.5938C9.36563 10.1687 8.10313 10.2906 7.5 10.3687ZM11.7813 3.28125L8.71875 0.21875C8.57813 0.078125 8.3875 0 8.1875 0H8V4H12V3.80938C12 3.6125 11.9219 3.42188 11.7813 3.28125ZM9.46563 11.2594C9.59375 11.175 9.3875 10.8875 8.12813 10.9781C9.2875 11.4719 9.46563 11.2594 9.46563 11.2594Z"
                        fill="#8A1E41"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Photo :</td>
                  <td className="text-[#8A1E41]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.72233 5.44466C10.0317 5.44466 10.3285 5.32175 10.5473 5.10295C10.7661 4.88416 10.889 4.58741 10.889 4.27799C10.889 3.96858 10.7661 3.67183 10.5473 3.45304C10.3285 3.23424 10.0317 3.11133 9.72233 3.11133C9.41291 3.11133 9.11617 3.23424 8.89737 3.45304C8.67858 3.67183 8.55566 3.96858 8.55566 4.27799C8.55566 4.58741 8.67858 4.88416 8.89737 5.10295C9.11617 5.32175 9.41291 5.44466 9.72233 5.44466Z"
                        fill="#8A1E41"
                      />
                      <path
                        d="M0 1.55556C0 1.143 0.163888 0.747335 0.455612 0.455612C0.747335 0.163888 1.143 0 1.55556 0H12.4444C12.857 0 13.2527 0.163888 13.5444 0.455612C13.8361 0.747335 14 1.143 14 1.55556V12.4444C14 12.857 13.8361 13.2527 13.5444 13.5444C13.2527 13.8361 12.857 14 12.4444 14H1.55556C1.143 14 0.747335 13.8361 0.455612 13.5444C0.163888 13.2527 0 12.857 0 12.4444V1.55556ZM12.4444 1.55556H1.55556V7.71556L4.18056 5.61556C4.3185 5.50511 4.48995 5.44493 4.66667 5.44493C4.84338 5.44493 5.01483 5.50511 5.15278 5.61556L8.49722 8.29111L9.56122 7.22789C9.70708 7.08208 9.90487 7.00017 10.1111 7.00017C10.3174 7.00017 10.5151 7.08208 10.661 7.22789L12.4444 9.01133V1.55556ZM1.55556 12.4444H12.4444V11.2109L10.1111 8.87755L9.10544 9.88322C8.97011 10.0186 8.7896 10.0994 8.59844 10.11C8.40729 10.1206 8.21894 10.0604 8.06944 9.94078L4.66667 7.21778L1.55556 9.70667V12.4444Z"
                        fill="#8A1E41"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Delivery :</td>
                  <td className="text-[#8A1E41]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.72233 5.44466C10.0317 5.44466 10.3285 5.32175 10.5473 5.10295C10.7661 4.88416 10.889 4.58741 10.889 4.27799C10.889 3.96858 10.7661 3.67183 10.5473 3.45304C10.3285 3.23424 10.0317 3.11133 9.72233 3.11133C9.41291 3.11133 9.11617 3.23424 8.89737 3.45304C8.67858 3.67183 8.55566 3.96858 8.55566 4.27799C8.55566 4.58741 8.67858 4.88416 8.89737 5.10295C9.11617 5.32175 9.41291 5.44466 9.72233 5.44466Z"
                        fill="#8A1E41"
                      />
                      <path
                        d="M0 1.55556C0 1.143 0.163888 0.747335 0.455612 0.455612C0.747335 0.163888 1.143 0 1.55556 0H12.4444C12.857 0 13.2527 0.163888 13.5444 0.455612C13.8361 0.747335 14 1.143 14 1.55556V12.4444C14 12.857 13.8361 13.2527 13.5444 13.5444C13.2527 13.8361 12.857 14 12.4444 14H1.55556C1.143 14 0.747335 13.8361 0.455612 13.5444C0.163888 13.2527 0 12.857 0 12.4444V1.55556ZM12.4444 1.55556H1.55556V7.71556L4.18056 5.61556C4.3185 5.50511 4.48995 5.44493 4.66667 5.44493C4.84338 5.44493 5.01483 5.50511 5.15278 5.61556L8.49722 8.29111L9.56122 7.22789C9.70708 7.08208 9.90487 7.00017 10.1111 7.00017C10.3174 7.00017 10.5151 7.08208 10.661 7.22789L12.4444 9.01133V1.55556ZM1.55556 12.4444H12.4444V11.2109L10.1111 8.87755L9.10544 9.88322C8.97011 10.0186 8.7896 10.0994 8.59844 10.11C8.40729 10.1206 8.21894 10.0604 8.06944 9.94078L4.66667 7.21778L1.55556 9.70667V12.4444Z"
                        fill="#8A1E41"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Tracking :</td>
                  <td className="text-[#8A1E41] underline">track</td>
                </tr>
                <tr>
                  <td className="font-medium">Order PDF :</td>
                  <td className="text-[#8A1E41]">
                    <svg
                      width="12"
                      height="16"
                      viewBox="0 0 12 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 7.75V8.625C9 8.83125 8.83125 9 8.625 9H3.375C3.16875 9 3 8.83125 3 8.625V7.75C3 7.54375 3.16875 7.375 3.375 7.375H8.625C8.83125 7.375 9 7.54375 9 7.75ZM8.625 10H3.375C3.16875 10 3 10.1687 3 10.375V11.25C3 11.4563 3.16875 11.625 3.375 11.625H8.625C8.83125 11.625 9 11.4563 9 11.25V10.375C9 10.1687 8.83125 10 8.625 10ZM12 4.12187V14.5C12 15.3281 11.3281 16 10.5 16H1.5C0.671875 16 0 15.3281 0 14.5V1.5C0 0.671875 0.671875 0 1.5 0H7.87813C8.275 0 8.65625 0.159375 8.9375 0.440625L11.5594 3.0625C11.8406 3.34063 12 3.725 12 4.12187ZM8 1.62188V4H10.3781L8 1.62188ZM10.5 14.5V5.5H7.25C6.83438 5.5 6.5 5.16563 6.5 4.75V1.5H1.5V14.5H10.5Z"
                        fill="#8A1E41"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        {/* History */}
      </section>
        <div className="w-full mt-8 h-full overflow-auto">
          <table>
            <thead className="font-medium text-sm border-b">
              <tr className="text-center">
                <th className="px-4 py-2 border-r">Vendor</th>
                <th className="px-4 py-2 border-r ">WLB Code</th>
                <th className="px-4 py-2 border-r">Product Details</th>
                {/* <th className="px-4 py-2 border-r">
                  <Tooltip title="Notes">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8876 0.714292C11.8876 0.319798 11.5678 0 11.1733 0C10.7788 0 10.459 0.319798 10.459 0.714292V2.14327C10.459 2.53776 10.7788 2.85756 11.1733 2.85756C11.5678 2.85756 11.8876 2.53776 11.8876 2.14327V0.714292Z"
                        fill="black"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.74451 1.04248H3.80908C2.7571 1.04248 1.9043 1.89528 1.9043 2.94726V16.2807C1.9043 17.3327 2.7571 18.1855 3.80908 18.1855H13.333C14.3849 18.1855 15.2378 17.3327 15.2378 16.2807V2.94726C15.2378 1.89528 14.3849 1.04248 13.333 1.04248H12.3636V2.14275C12.3636 2.80024 11.8306 3.33324 11.1731 3.33324C10.5157 3.33324 9.98266 2.80024 9.98266 2.14275V1.04248H7.12549V2.14275C7.12549 2.80024 6.59248 3.33324 5.935 3.33324C5.27752 3.33324 4.74451 2.80024 4.74451 2.14275V1.04248ZM4.74451 6.19041C4.74451 5.92741 4.95771 5.71422 5.22071 5.71422H11.8874C12.1504 5.71422 12.3636 5.92741 12.3636 6.19041C12.3636 6.45341 12.1504 6.66661 11.8874 6.66661H5.22071C4.95771 6.66661 4.74451 6.45341 4.74451 6.19041ZM5.23761 8.18543C4.97466 8.18543 4.76142 8.39862 4.76142 8.66162C4.76142 8.92458 4.97466 9.13782 5.23761 9.13782H11.9043C12.1673 9.13782 12.3805 8.92458 12.3805 8.66162C12.3805 8.39862 12.1673 8.18543 11.9043 8.18543H5.23761ZM4.76142 11.0426C4.76142 10.7796 4.97466 10.5664 5.23761 10.5664H11.9043C12.1673 10.5664 12.3805 10.7796 12.3805 11.0426C12.3805 11.3056 12.1673 11.5188 11.9043 11.5188H5.23761C4.97466 11.5188 4.76142 11.3056 4.76142 11.0426ZM5.23761 12.9734C4.97466 12.9734 4.76142 13.1866 4.76142 13.4496C4.76142 13.7126 4.97466 13.9258 5.23761 13.9258H9.04717C9.31018 13.9258 9.52337 13.7126 9.52337 13.4496C9.52337 13.1866 9.31018 12.9734 9.04717 12.9734H5.23761Z"
                        fill="black"
                      />
                      <path
                        d="M0.4762 3.31299C0.739197 3.31299 0.952395 3.52619 0.952395 3.78918L0.95239 16.6667C0.95239 17.9817 2.01839 19.0477 3.33335 19.0477H12.4119C12.6748 19.0477 12.8881 19.2609 12.8881 19.5239C12.8881 19.7868 12.6748 20.0001 12.4119 20.0001H3.33335C1.4924 20.0001 0 18.5076 0 16.6667L4.76842e-06 3.78918C4.76842e-06 3.52619 0.213207 3.31299 0.4762 3.31299Z"
                        fill="black"
                      />
                      <path
                        d="M5.9389 0C6.33343 0 6.65319 0.319798 6.65319 0.714292V2.14327C6.65319 2.53776 6.33343 2.85756 5.9389 2.85756C5.54442 2.85756 5.22461 2.53776 5.22461 2.14327V0.714292C5.22461 0.319798 5.54442 0 5.9389 0Z"
                        fill="black"
                      />
                      <path
                        d="M18.0786 3.80957H17.1262C16.6003 3.80957 16.1738 4.23596 16.1738 4.76196V6.66674H19.031V4.76196C19.031 4.23596 18.6046 3.80957 18.0786 3.80957Z"
                        fill="black"
                      />
                      <path
                        d="M19.031 7.14307H16.1738V15.7146L17.6024 17.6194L19.031 15.7146V7.14307Z"
                        fill="black"
                      />
                    </svg>
                  </Tooltip>
                </th> */}
                <th className="px-4 py-2 border-r">D. Method</th>
                <th className="px-4 py-2 border-r">Ship Date</th>
                <th className="px-4 py-2 border-r">Estimated</th>
                <th className="px-4 py-2 border-r">Proof</th>
                <th className="px-4 py-2 border-r">Photo</th>
                <th className="px-4 py-2 border-r">track</th>
                <th className="px-4 py-2 border-r">Delivery</th>
                <th className="px-4 py-2 border-r">Qty</th>
                <th className="px-4 py-2 border-r">Unit Cost</th>
                <th className="px-4 py-2 border-r">Price</th>
              </tr>
            </thead>
            {orderDetails.order_item.map((item, index) => (
                <tbody className="text-sm" key={index}>
                  <tr className="align-top">
                    <td className="px-4 py-2 border-r">
                      {item.product.code}
                    </td>
                    <td className="px-4 py-2 border-r">
                      {item?.product?.internal_code?.split('-')[1]}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <div className="flex gap-1 text-sm">
                        <img
                          className="w-14 h-14"
                          src={item?.product?.images[0].url}
                        />
                        <div className="w-80">
                          <h6 className="font-medium">{item?.product?.name}</h6>
                          {/* <p>Stainless Steel Dome Lid Mirage</p> */}
                          <p>
                            <span className="font-medium">
                              Product Color -
                            </span>
                            <span>{item?.product_variation_item?.name}</span>
                          </p>
                          {item?.branding_list && (
                            <p>
                              <span className="font-medium">
                                Print Method / Additional Cost
                              </span>
                            </p>
                          )}
                          {item?.branding_list?.map((brands, index) => (
                            <p key={index}>
                              <span>
                                {brands?.product_branding.description} - Qty{' '}
                                {brands?.quantity}
                              </span>
                            </p>
                          ))}
                          <p>
                            <span className="font-medium">Design File :</span>
                          </p>
                          {item.user_product_file.length > 0 &&
                            item.user_product_file.map((file, index) => (
                              <Fragment key={index}>
                                <Link
                                  key={file.url}
                                  target="_balck"
                                  href={file.url}
                                  download
                                >
                                  <div className="grid grid-cols-3 mt-2">
                                    {getFileIcon(file)}
                                  </div>
                                </Link>
                              </Fragment>
                            ))}
                          <div className="grid grid-cols-1 gap-y-1 mt-2">
                            <label
                              className="text-xs"
                              htmlFor="additionalComments"
                            >
                              Additional comments
                            </label>
                            <textarea
                              id="additionalComments"
                              className="focus:outline-none border border-gray-300"
                              placeholder="Press enter to add"
                              value={item.additional_comments}
                              rows={3}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-r pt-2">
                      {item.delivery_method}
                    </td>
                    <td className="px-2 py-4 border-r">
                      {item.shipped_date}
                    </td>
                    <td className="px-2 py-4 border-r">
                      {item.estimated_date}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <div className="flex flex-col justify-center items-center gap-y-5">
                      {item.user_upload_files
                        .filter((allFiles) => allFiles.type === 'PROOF')
                        .map((filterFiles, index) => (
                          <div key={index} className="mb-4">
                            <div className="relative">
                              <Link
                                key={filterFiles.url}
                                target="_balck"
                                href={filterFiles.url}
                                download
                              >
                                <svg
                                  width="17"
                                  height="22"
                                  viewBox="0 0 17 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.81602 11.0043C7.60117 10.3168 7.60547 8.98906 7.73008 8.98906C8.09102 8.98906 8.05664 10.5746 7.81602 11.0043ZM7.74297 13.0324C7.41211 13.9004 6.99961 14.893 6.52266 15.7266C7.30899 15.4258 8.19844 14.9875 9.22539 14.7855C8.67969 14.373 8.15547 13.7801 7.74297 13.0324ZM3.69961 18.3949C3.69961 18.4293 4.2668 18.1629 5.19922 16.6676C4.91133 16.9383 3.94883 17.7203 3.69961 18.3949ZM10.6563 6.875H16.5V20.9688C16.5 21.5402 16.0402 22 15.4688 22H1.03125C0.459766 22 0 21.5402 0 20.9688V1.03125C0 0.459766 0.459766 0 1.03125 0H9.625V5.84375C9.625 6.41094 10.0891 6.875 10.6563 6.875ZM10.3125 14.257C9.45313 13.7328 8.88164 13.0109 8.47774 11.9453C8.67109 11.1504 8.97617 9.94297 8.74414 9.18672C8.54219 7.92344 6.92227 8.04805 6.69023 8.89453C6.47539 9.68086 6.67305 10.7895 7.03828 12.2031C6.53984 13.3891 5.80508 14.9789 5.28516 15.8898C5.28086 15.8898 5.28086 15.8941 5.27656 15.8941C4.11211 16.4914 2.11406 17.8062 2.93477 18.816C3.17539 19.1125 3.62227 19.2457 3.85859 19.2457C4.62773 19.2457 5.39258 18.4723 6.48398 16.5902C7.59258 16.225 8.80859 15.7695 9.87852 15.5934C10.8109 16.1004 11.9023 16.4312 12.6285 16.4312C13.8832 16.4312 13.9691 15.0562 13.475 14.5664C12.8777 13.982 11.1418 14.1496 10.3125 14.257ZM16.1992 4.51172L11.9883 0.300781C11.7949 0.107422 11.5328 0 11.2578 0H11V5.5H16.5V5.23789C16.5 4.96719 16.3926 4.70508 16.1992 4.51172ZM13.0152 15.4816C13.1914 15.3656 12.9078 14.9703 11.1762 15.0949C12.7703 15.7738 13.0152 15.4816 13.0152 15.4816Z"
                                    fill="#8A1E41"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r">
                      <div className="flex flex-col justify-center items-center gap-y-5">
                      {item.user_upload_files
                        .filter((allFiles) => allFiles.type === 'PHOTO')
                        .map((filterFiles, index) => (
                          <div key={index} className="mb-4">
                            <div className="relative">
                              <Link
                                key={filterFiles.url}
                                target="_balck"
                                href={filterFiles.url}
                                download
                              >
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15.2777 8.55534C15.7639 8.55534 16.2302 8.36218 16.574 8.01837C16.9178 7.67455 17.111 7.20824 17.111 6.72201C17.111 6.23577 16.9178 5.76946 16.574 5.42564C16.2302 5.08183 15.7639 4.88867 15.2777 4.88867C14.7914 4.88867 14.3251 5.08183 13.9813 5.42564C13.6375 5.76946 13.4443 6.23577 13.4443 6.72201C13.4443 7.20824 13.6375 7.67455 13.9813 8.01837C14.3251 8.36218 14.7914 8.55534 15.2777 8.55534Z"
                                    fill="#8A1E41"
                                  />
                                  <path
                                    d="M0 2.44444C0 1.79614 0.257539 1.17438 0.715961 0.715961C1.17438 0.257539 1.79614 0 2.44444 0H19.5556C20.2039 0 20.8256 0.257539 21.284 0.715961C21.7425 1.17438 22 1.79614 22 2.44444V19.5556C22 20.2039 21.7425 20.8256 21.284 21.284C20.8256 21.7425 20.2039 22 19.5556 22H2.44444C1.79614 22 1.17438 21.7425 0.715961 21.284C0.257539 20.8256 0 20.2039 0 19.5556V2.44444ZM19.5556 2.44444H2.44444V12.1244L6.56944 8.82444C6.78622 8.65088 7.05564 8.55632 7.33333 8.55632C7.61103 8.55632 7.88045 8.65088 8.09722 8.82444L13.3528 13.0289L15.0248 11.3581C15.254 11.129 15.5648 11.0003 15.8889 11.0003C16.213 11.0003 16.5238 11.129 16.753 11.3581L19.5556 14.1607V2.44444ZM2.44444 19.5556H19.5556V17.6171L15.8889 13.9504L14.3086 15.5308C14.0959 15.7436 13.8122 15.8705 13.5118 15.8871C13.2115 15.9038 12.9155 15.8092 12.6806 15.6212L7.33333 11.3422L2.44444 15.2533V19.5556Z"
                                    fill="#8A1E41"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r underline text-[#8A1E41] text-center cursor-pointer" >
                      {<a
                        href={item.tracking_url}
                        target="_blank"
                      >
                        Track
                      </a>}
                    </td>
                    <td className="px-4 py-2 border-r">
                      <div className="flex flex-col justify-center items-center gap-y-5">
                      {item.user_upload_files
                            .filter((allFiles) => allFiles.type === 'DELIVERY')
                            .map((filterFiles, index) => (
                              <div key={index} className="mb-4">
                                <div className="relative">
                                  <Link
                                    key={filterFiles.url}
                                    target="_balck"
                                    href={filterFiles.url}
                                    download
                                  >
                                    <svg
                                      width="22"
                                      height="22"
                                      viewBox="0 0 22 22"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M15.2777 8.55534C15.7639 8.55534 16.2302 8.36218 16.574 8.01837C16.9178 7.67455 17.111 7.20824 17.111 6.72201C17.111 6.23577 16.9178 5.76946 16.574 5.42564C16.2302 5.08183 15.7639 4.88867 15.2777 4.88867C14.7914 4.88867 14.3251 5.08183 13.9813 5.42564C13.6375 5.76946 13.4443 6.23577 13.4443 6.72201C13.4443 7.20824 13.6375 7.67455 13.9813 8.01837C14.3251 8.36218 14.7914 8.55534 15.2777 8.55534Z"
                                        fill="#8A1E41"
                                      />
                                      <path
                                        d="M0 2.44444C0 1.79614 0.257539 1.17438 0.715961 0.715961C1.17438 0.257539 1.79614 0 2.44444 0H19.5556C20.2039 0 20.8256 0.257539 21.284 0.715961C21.7425 1.17438 22 1.79614 22 2.44444V19.5556C22 20.2039 21.7425 20.8256 21.284 21.284C20.8256 21.7425 20.2039 22 19.5556 22H2.44444C1.79614 22 1.17438 21.7425 0.715961 21.284C0.257539 20.8256 0 20.2039 0 19.5556V2.44444ZM19.5556 2.44444H2.44444V12.1244L6.56944 8.82444C6.78622 8.65088 7.05564 8.55632 7.33333 8.55632C7.61103 8.55632 7.88045 8.65088 8.09722 8.82444L13.3528 13.0289L15.0248 11.3581C15.254 11.129 15.5648 11.0003 15.8889 11.0003C16.213 11.0003 16.5238 11.129 16.753 11.3581L19.5556 14.1607V2.44444ZM2.44444 19.5556H19.5556V17.6171L15.8889 13.9504L14.3086 15.5308C14.0959 15.7436 13.8122 15.8705 13.5118 15.8871C13.2115 15.9038 12.9155 15.8092 12.6806 15.6212L7.33333 11.3422L2.44444 15.2533V19.5556Z"
                                        fill="#8A1E41"
                                      />
                                    </svg>
                                  </Link>
                                </div>
                              </div>
                            ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r">{item?.quantity}</td>
                    <td className="px-4 py-2 border-r">
                    {item.due_price
                            ? (
                                (item.due_price + item.price) /
                                item.quantity
                              )?.toFixed(2)
                            : (item.price / item.quantity)?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border-r">{item.due_price
                          ? (item.due_price + item.price)?.toFixed(2)
                          : item.price?.toFixed(2)}</td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
        <div className="flex justify-end">
          <div className="w-[23%] lg:pt-3 mr-[120px]">
            <p className="my-3 px-4 flex justify-between text-sm">
              <span className="text-slate-600 ">Order Total</span>{' '}
              <span className="font-semibold">
                {' '}
                ${orderDetails?.due_price_for_normal_order.toFixed(2)}
              </span>
            </p>
            <p className="my-3 px-4  flex justify-between text-sm">
              <span className="text-slate-600 ">Shipping cost</span>{' '}
              <span className="font-semibold">
                {' '}
                {orderDetails?.shipping_cost
                  ? `'$'${orderDetails.shipping_cost.toFixed(2)}`
                  : 'FREE'}
              </span>
            </p>
            <p className="my-3 px-4  flex justify-between text-sm">
              <span className="text-slate-600 ">Processing cost</span>{' '}
              <span className="font-semibold">
                {' '}
                ${orderDetails.processing_fee?.toFixed(2)}
              </span>
            </p>
            <p className="my-3 px-4  flex justify-between text-sm">
              <span className="text-slate-600 ">GST 15%</span>{' '}
              <span className="font-semibold">
                {' '}
                $
                {orderDetails?.gst_value
                  ? `${orderDetails.gst_value.toFixed(2)}`
                  : '0.00'}
                {/* {cartState.gst_value.toFixed(2)} */}
              </span>
            </p>
            <p className="h-[1px] bg-[#B0B0B0]"></p>
            <p className="my-3 px-4  flex justify-between text-sm">
              <span className="text-slate-600 ">Sub Total</span>
              <span className="font-semibold">
                {' '}
                ${orderDetails?.total_due_price_with_gst.toFixed(2)}
              </span>
            </p>
            {/* <p className="my-3 flex justify-between text-lg">
              <span className="text-slate-600 ">Coupon Code : </span>{' '}
              <span className="font-semibold"></span>
            </p> */}
            <p className="my-3 px-4 flex justify-between text-sm">
              <span className="text-slate-600 ">Coupon Discount</span>{' '}
              <span className="font-semibold">$0.00</span>
            </p>
            <p className="h-[1px] bg-[#B0B0B0]"></p>
            <p className="my-3 px-4  flex justify-between text-sm">
              <span className="text-slate-600 ">Total</span>
              <span className="font-semibold">
                {' '}
                ${orderDetails?.total_due_price_with_gst.toFixed(2)}
              </span>
            </p>
            <p className="my-3 px-4  py-3 text-sm bg-[#D9D9D9] flex justify-between">
              <span className="text-[#53565B]">Balance Due</span>
              <span className="font-semibold">
                {' '}
                ${orderDetails.total_due_price_with_gst.toFixed(2)}
              </span>
            </p>
            {/* Stripe checkout button */}
            {/* <button
              onClick={() => setStepNum(1)}
              className="bg-[#FFCD00] w-full py-3 font-bold"
            >
              Proceed to Checkout
            </button> */}
            {/* <StripeButton /> */}
          </div>
        </div>
      </div>
    </>
  );
}
