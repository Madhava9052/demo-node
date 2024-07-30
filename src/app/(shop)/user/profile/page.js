'use client';
import { useEffect, useState } from 'react';
import { DashboardForm } from '@/app/components/shop/user/profile/dashboardProfile';
import Link from 'next/link';
import OrderHistory from '@/app/components/shop/user/profile/ordersHistory';
import Addresses from '@/app/components/shop/user/profile/address';
import { useRouter, useSearchParams } from 'next/navigation';
import EachOrderHistory from '@/app/components/shop/user/profile/eachOrderHistory';
import PaymentConfetti from '@/app/components/common/confetti';

export default function UserProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('page') ? 'My orders' : 'Profile';
  const [paymentSuccessId, setPamentSuccessId] = useState('');
  const [currentTab, setCurrentTab] = useState(defaultTab);

  const productOrderId = searchParams.get('product_order_id');

  useEffect(() => {
    if (searchParams.get('transaction_number')) {
      setPamentSuccessId(searchParams.get('transaction_number'));
      // router.replace('/user/profile', undefined, { shallow: true });
      setTimeout(() => {
        setPamentSuccessId('');
      }, 8000);
    }
    // Clear the local storage if redirected after payment
    localStorage.removeItem('stepNum');
    localStorage.removeItem('couponState');
    localStorage.removeItem('deliveryMethod');
    localStorage.removeItem('billingAddressState');
    localStorage.removeItem('shippingAddressState');
    localStorage.removeItem('address');
    localStorage.removeItem('cartState');
  }, []);

  return (
    <section className="container mx-auto relative min-h-screen px-0 lg:px-1 xl:px-12 flex flex-col">
      {paymentSuccessId != '' && (
        <div
          className="fixed inset-0 flex items-center bg-[#00000073] justify-center z-50"
          onClick={() => setPamentSuccessId('')}
        >
          <PaymentConfetti />
          <div className="min-w-[400px] max-w-screen-sm mx-auto bg-white shadow-md rounded-md">
            <div className="bg-[#8A1E41] flex justify-center p-10">
              <img src="http://localhost:3000/images/brand-logo.png" alt="" />
            </div>
            <div className="flex flex-col justify-center items-center  p-6">
              <h1 className="mt-4 font-semibold text-xl">
                Payment Successful!
              </h1>
              <img
                width={144}
                height={144}
                src="/images/paymentcheck.png"
                alt=""
              />
              <small>
                Your order ID :- <b>{paymentSuccessId}</b>
              </small>
            </div>
            <div className="bg-[#8A1E41] flex justify-center p-5">
              <p className="text-white text-xl">We love branding</p>
            </div>
          </div>
        </div>
      )}
      <aside
        id="default-sidebar"
        className="lg:absolute top-0 lg:left-0 z-10 min-w-64 lg:w-44 mt-4 lg:my-10 transition-transform lg:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-[#8A1E41]  lg:w-[200px] xl:w-auto">
          <ul className=" font-medium flex lg:flex-col justify-evenly items-end flex-wrap lg:items-center">
            <li className='lg:w-full' onClick={() => setCurrentTab('Profile')}>
              <Link
                href=""
                className=" flex items-center py-2 lg:border-b text-white  hover:bg-black hover:bg-opacity-30 "
              >
                {currentTab === 'Profile' && (
                  <div className="bg-[#F7F7F7] lg:w-1 h-7 ml-2 rounded-sm"></div>
                )}
                <div className={`w-full flex items-center justify-start ${(currentTab === 'Profile') ? "lg:ml-7" : "lg:ml-10"}`}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.1207 11.78C11.0507 11.77 10.9607 11.77 10.8807 11.78C9.12073 11.72 7.7207 10.28 7.7207 8.50996C7.7207 6.69997 9.18073 5.22998 11.0007 5.22998C12.8107 5.22998 14.2807 6.69997 14.2807 8.50996C14.2707 10.28 12.8807 11.72 11.1207 11.78Z"
                      stroke="#F7F7F7"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.7397 18.38C15.9597 20.01 13.5997 21 10.9997 21C8.39975 21 6.03976 20.01 4.25977 18.38C4.35977 17.44 4.95976 16.52 6.02976 15.8001C8.76974 13.9801 13.2497 13.9801 15.9697 15.8001C17.0397 16.52 17.6397 17.44 17.7397 18.38Z"
                      stroke="#F7F7F7"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 20.9999C16.5227 20.9999 20.9999 16.5227 20.9999 11C20.9999 5.47713 16.5227 1 11 1C5.47713 1 1 5.47713 1 11C1 16.5227 5.47713 20.9999 11 20.9999Z"
                      stroke="#F7F7F7"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className=" ml-3 whitespace-nowrap text-base">
                    Profile
                  </span>
                </div>
              </Link>
            </li>
            <li className='lg:w-full' onClick={() => setCurrentTab('My orders')}>
              <Link
                href="/user/profile?page=my_orders"
                className=" flex items-center py-2 lg:border-b text-white w-full  hover:bg-black hover:bg-opacity-30 "
              >
                {currentTab === 'My orders' && (
                  <div className="bg-[#F7F7F7] lg:w-1 h-7 ml-2 rounded-sm"></div>
                )}

                <div className={`w-full flex items-center justify-start  ${(currentTab === 'My orders') ? "lg:ml-7" : "lg:ml-10"}`}>
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.5645 14.1895L13.125 19.6387L10.498 17.002L11.377 16.123L13.125 17.8613L17.6855 13.3105L18.5645 14.1895ZM8.75 6.25H5V5H8.75V6.25ZM8.75 8.75H5V7.5H8.75V8.75ZM5 10H8.75V11.25H5V10ZM3.75 6.25H2.5V5H3.75V6.25ZM3.75 8.75H2.5V7.5H3.75V8.75ZM2.5 10H3.75V11.25H2.5V10ZM10 6.25V1.25H1.25V18.75H10V20H0V0H10.8887L16.25 5.36133V12.5L15 13.75V6.25H10ZM11.25 5H14.1113L11.25 2.13867V5Z"
                      fill="#F7F7F7"
                    />
                  </svg>
                  <span className=" ml-3 whitespace-nowrap text-base">Orders</span>
                </div>
              </Link>
            </li>
            <li className='lg:w-full hover:bg-black hover:bg-opacity-30'>
              <a
                href="/user/logout"
                className="flex items-center justify-start py-2 text-white   lg:ml-9"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.6489 15.7266H17.1386C17.0354 15.7266 16.9388 15.7717 16.8743 15.8512C16.7239 16.0338 16.5628 16.21 16.3931 16.3776C15.6989 17.0725 14.8766 17.6262 13.9718 18.0082C13.0343 18.4042 12.0267 18.6073 11.0091 18.6055C9.97997 18.6055 8.98309 18.4035 8.04638 18.0082C7.1415 17.6262 6.31925 17.0725 5.62509 16.3776C4.92968 15.685 4.37517 14.8642 3.99227 13.9606C3.59481 13.0239 3.39501 12.0291 3.39501 11C3.39501 9.97093 3.59696 8.97621 3.99227 8.03949C4.3747 7.13499 4.9247 6.32074 5.62509 5.62249C6.32548 4.92425 7.13974 4.37425 8.04638 3.99183C8.98309 3.59652 9.97997 3.39456 11.0091 3.39456C12.0382 3.39456 13.035 3.59437 13.9718 3.99183C14.8784 4.37425 15.6927 4.92425 16.3931 5.62249C16.5628 5.79222 16.7218 5.96839 16.8743 6.14886C16.9388 6.22835 17.0376 6.27347 17.1386 6.27347H18.6489C18.7843 6.27347 18.8681 6.12308 18.7929 6.00921C17.145 3.44828 14.2618 1.75316 10.9854 1.76175C5.83778 1.77464 1.71063 5.95335 1.7622 11.0946C1.81376 16.1541 5.93446 20.2383 11.0091 20.2383C14.2768 20.2383 17.1472 18.5453 18.7929 15.9909C18.8659 15.877 18.7843 15.7266 18.6489 15.7266ZM20.5589 10.8647L17.5102 8.45843C17.3964 8.3682 17.2309 8.44984 17.2309 8.59378V10.2266H10.4849C10.3903 10.2266 10.313 10.3039 10.313 10.3985V11.6016C10.313 11.6961 10.3903 11.7735 10.4849 11.7735H17.2309V13.4063C17.2309 13.5502 17.3985 13.6319 17.5102 13.5416L20.5589 11.1354C20.5794 11.1193 20.596 11.0988 20.6075 11.0753C20.6189 11.0519 20.6248 11.0261 20.6248 11C20.6248 10.9739 20.6189 10.9482 20.6075 10.9248C20.596 10.9013 20.5794 10.8808 20.5589 10.8647Z"
                    fill="white"
                  />
                </svg>

                <span className="ml-3 whitespace-nowrap text-base">Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <section className="lg:ml-[14rem] xl:ml-[10rem] xl:-mr-12 my-4  lg:my-10 border-[1px] border-[#B0B0B0] no-scrollbar overflow-x-scroll">
        {currentTab === 'My orders' ? (
          productOrderId ? (
            <EachOrderHistory productOrderId={productOrderId} />
          ) : (
            <OrderHistory />
          )
        ) : // ) : currentTab === 'Address' ? (
        //   <Addresses />
        currentTab === 'Profile' ? (
          <DashboardForm />
        ) : (
          ''
        )}
      </section>
    </section>
  );
}
