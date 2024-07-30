//sidebar.jsx

'use client';

import React, { useState } from 'react';
import DropdownComponent from './dropdown';
import Link from 'next/link';
import Cookies from 'js-cookie';


export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  const removeToken = () =>{
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('user_id');
  };

  return (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-[300px] h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'
          }`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-[#8A1E41] dark:bg-gray-800 ">
          <span className="flex items-center justify-center mt-6 my-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Link href="/">
              <img
                src="https://welovebrandings.spreadagency.co.nz/assets/images/1647841814logo-1.png"
                className="h-6 mr-3 sm:h-7"
                alt="welovebrandings Logo"
              />
            </Link>
          </span>
          <button
            data-drawer-target="sidebar-multi-level-sidebar"
            data-drawer-toggle="sidebar-multi-level-sidebar"
            aria-controls="sidebar-multi-level-sidebar"
            type="button"
            className="inline-flex absolute right-1 top-0 items-center p-2 mt-2 ml-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleSidebar}
          >
            <span className="sr-only">close sidebar</span>
            <svg
              className="w-4 h-4"
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
          </button>
          <div className="h-[2px] w-full bg-[#F7F7F7]"></div>

          <ul className="flex flex-col font-semibold">
            <div>
              <DropdownComponent
                showDropdownIcon={false}
                title="Dashboard"
              />
              <DropdownComponent
                showDropdownIcon={true}
                title="Orders"
                items={[
                  { name: 'New Orders', link: '/admin/order-management/new-orders' },
                  { name: 'Pending', link: '/admin/order-management/pending' },
                  {
                    name: 'Processing',
                    link: '/admin/order-management/processing',
                  },
                  {
                    name: 'Shipped',
                    link: '/admin/order-management/shipped',
                  },
                  {
                    name: 'Completed',
                    link: '/admin/order-management/completed',
                  },
                ]}
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="Feed Back"
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="Samples"
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="Instant Quotes"
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="Payments"
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="Users"
              />

              <DropdownComponent
                showDropdownIcon={true}
                title="Products"
                items={[
                  { name: 'Vendor', link: '/admin/product-listing/vendor' },
                  { name: 'Category', link: '/admin/product-listing/category' },
                  { name: 'Sub Category', link: '/admin/product-listing/sub-category' },
                  { name: 'Products', link: '/admin/product-listing/products' },
                  { name: 'Product Highlight', link: '/admin/product-listing/product-highlight' },
                  // { name: 'Vender Product Category', link: '/admin/products' },
                ]}
              />
              <DropdownComponent showDropdownIcon={false} title="Coupons" />
              <DropdownComponent showDropdownIcon={false} title="Reports" />
              <DropdownComponent
                showDropdownIcon={true}
                title="Dynamic Feeds"
                items={[
                  { name: 'Slider', link: '/admin/home-page/sliders' },
                  { name: 'Services', link: '/admin/home-page/services' },
                  {
                    name: 'Featured Banners',
                    link: '/admin/home-page/featured-banners',
                  },
                  {
                    name: 'Large Banners',
                    link: '/admin/home-page/large-banners',
                  },
                  { name: 'Catalogues', link: '/admin/home-page/catalogues' },
                  { name: 'Partners', link: '/admin/home-page/partners' },
                  { name: 'Best Seller', link: '/admin/home-page/best-sellers' },
                  { name: 'What We Do', link: '/admin/home-page/what-we-do' },
                  {
                    name: 'Product Reviews',
                    link: '/admin/home-page/product-review',
                  },
                  {
                    name: 'Design Partners',
                    link: '/admin/home-page/design_partners',
                  },
                  {
                    name: 'Design Partners Services',
                    link: '/admin/home-page/design_partner_services',
                  },
                ]}
              />
              <DropdownComponent showDropdownIcon={false} title="Product Reviews" />
              <DropdownComponent
                showDropdownIcon={false}
                title="Contact Us"
              />
              <DropdownComponent
                showDropdownIcon={false}
                title="FAQ'S"
              />
              <DropdownComponent showDropdownIcon={false} title="Company" />
              <DropdownComponent
                showDropdownIcon={false}
                title="Product Collection"
              />
            </div>
            <li className='mt-auto border-t hover:bg-black hover:bg-opacity-30'>
              <Link
              onClick={() => {
                removeToken();
              }}
                href="/adminlogin"
                className="flex px-9 items-center justify-start w-full p-2 py-4 text-white dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.6678 23.0195H25.2649C25.1009 23.0195 24.9471 23.0913 24.8445 23.2178C24.6053 23.5083 24.3489 23.7886 24.0789 24.0552C22.9745 25.1607 21.6664 26.0417 20.2268 26.6494C18.7354 27.2793 17.1324 27.6025 15.5135 27.5996C13.8762 27.5996 12.2903 27.2783 10.8001 26.6494C9.36051 26.0417 8.05237 25.1607 6.94803 24.0552C5.84169 22.9534 4.95953 21.6476 4.35037 20.21C3.71805 18.7197 3.40017 17.1372 3.40017 15.5C3.40017 13.8628 3.72146 12.2803 4.35037 10.79C4.95877 9.35107 5.83377 8.05566 6.94803 6.94482C8.06228 5.83398 9.35769 4.95897 10.8001 4.35058C12.2903 3.72167 13.8762 3.40038 15.5135 3.40038C17.1507 3.40038 18.7366 3.71825 20.2268 4.35058C21.6692 4.95897 22.9646 5.83398 24.0789 6.94482C24.3489 7.21483 24.6018 7.49511 24.8445 7.78222C24.9471 7.90868 25.1043 7.98046 25.2649 7.98046H27.6678C27.8831 7.98046 28.0164 7.7412 27.8968 7.56005C25.2752 3.48583 20.6883 0.789053 15.4759 0.802725C7.2864 0.823233 0.720487 7.47118 0.802518 15.6504C0.884549 23.6997 7.44021 30.1973 15.5135 30.1973C20.7122 30.1973 25.2786 27.5039 27.8968 23.4399C28.013 23.2588 27.8831 23.0195 27.6678 23.0195ZM30.7063 15.2847L25.8562 11.4565C25.6751 11.313 25.4119 11.4429 25.4119 11.6719V14.2695H14.6795C14.5291 14.2695 14.406 14.3926 14.406 14.543V16.457C14.406 16.6074 14.5291 16.7305 14.6795 16.7305H25.4119V19.3281C25.4119 19.5571 25.6785 19.687 25.8562 19.5434L30.7063 15.7153C30.739 15.6897 30.7654 15.6571 30.7836 15.6198C30.8018 15.5824 30.8112 15.5415 30.8112 15.5C30.8112 15.4585 30.8018 15.4175 30.7836 15.3802C30.7654 15.3429 30.739 15.3102 30.7063 15.2847Z" fill="white" />
                </svg>
                <span className="ml-3 whitespace-nowrap w-fit">Logout </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
