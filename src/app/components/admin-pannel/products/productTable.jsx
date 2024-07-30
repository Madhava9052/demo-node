'use client';
import { sendRequest } from '@/helpers/utils';
import { useState, useEffect } from 'react';
import TableSkeleton from '../../common/tableSkeleton';
import Link from 'next/link';
import Delete from '../home-page/delete';
import Pagination from '@/app/components/admin-pannel/pagiation';
import Cookies from "js-cookie";
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import useDebounce from '@/helpers/useDebounce';
import LazyLoadedImage from '../../common/lazyLoadedImage';
import { PRODUCTS_PAGE_ROUTES } from '@/constants/admin-pannel/routes';

export default function ProductTable({ products, searchParams, totalCount }) {
  const [tableData, setTableData] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [samplePrice, setSamplePrice] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);
  const [showSearchPagination, setShowshowSearchPagination] = useState(false)
  const [searchCount, setSearchCount] = useState(0);
  const [searchOffset, setSearchOffset] = useState(0);
  const offsetCount = searchParams?.offset ? parseInt(searchParams.offset) : 0;
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Drop down on Search
  const debounceInputValue = useDebounce(searchTerm, 1000);
  useEffect(() => {
    async function getSearchData() {
      if (debounceInputValue.trim() === '') {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await sendRequest(
          `/api/products/?search=${debounceInputValue}&drop_down=true`
        );
        setSearchResults(data); // Assuming the API response contains a 'results' array
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getSearchData();
  }, [debounceInputValue]);

  const handlePopSearch = (name) => {
    setSearchTerm(name);
    setSearchResults([]);
    document.getElementById("searchbtn").click();
  }

  const handleSearch = async (e = null, dataFor) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const pathForSearch = `/api/products/?search=${searchTerm.toLocaleUpperCase()}&offset=${searchOffset}&limit=10`;
      const pathForProducts = `/api/products/`;
      const responseData = await sendRequest(
        dataFor === 'search' ? pathForSearch : pathForProducts
        , {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
      if (dataFor === 'search') {
        setTableData(responseData.data);
        setSearchCount(responseData.count)
      } else {
        setTableData(responseData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setShowshowSearchPagination(true)
    setSearchResults([]);
  };

  //getting offset from pagination callback 
  const getSearchOffset = (offset) => {
    setSearchOffset(offset)
  }

  useEffect(() => {
    handleSearch(undefined, "search")
  }, [searchOffset, searchCount])

  //reset offset on new search term
  useEffect(() => {
    setSearchOffset(0);
  }, [searchTerm])

  const handleSample = async (itemID, method) => {
    setCurrentProductId(itemID)
    if (method === "view") {
      try {
        const responseData = await sendRequest(`/api/products/${itemID}/sample`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });
        // Handle different API response statuses
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          setSamplePrice(responseData?.data?.sample_price)
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
      setShowSampleModal(true);
    }
    else if (method === "update") {
      try {
        const responseData = await sendRequest(`/api/products/${itemID}/sample`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          method: "PUT",
          body: JSON.stringify({
            "sample_price": samplePrice,
          })
        });
        // Handle different API response statuses
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          setShowSampleModal(false);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }
  }



  return (
    <>
      <div className="flex justify-between items-center mb-[40px]">
        <h2
          onClick={(e) => {
            setSearchTerm('');
            handleSearch(e, 'products');
          }}
          className=" text-[#8A1E41] font-inter font-semibold text-2xl cursor-pointer"
        >
          All Products
        </h2>
        <form
          className="ml-auto my-3 grow max-w-[500px]"
          onSubmit={(e) => handleSearch(e, 'search')}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
              placeholder="Search product with code . . ."
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              id='searchbtn'
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-[#8A1E41] font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>

            {/* Search DropDown */}
            <ul className="bg-white absolute left-0 top-full w-full max-h-[500px] overflow-y-auto z-20">
              {isLoading ? (
                <li
                  className="flex border px-5 py-3 cursor-pointer w-full text-black text-base text-left bg-white border-b border-solid border-opacity-9
            "
                >
                  Loading...
                </li>
              ) : (
                searchResults?.map((result) => (
                  <div key={result.id}>
                    <li
                      onClick={() => handlePopSearch(result.name)}
                      className="flex border px-5 py-3 cursor-pointer w-full text-base text-left bg-white border-b border-solid border-opacity-9
                "
                    >
                      <LazyLoadedImage
                        src={result?.images[0]?.url}
                        alt="Image"
                        height={50}
                        width={50}
                        blur={true}
                      />

                      <div className="px-5 cursor-pointer w-95 text-black text-base text-left bg-white">
                        <p className="text-base font-normal">{result.name}</p>
                        <span className="text-sm font-semibold block">
                          $ {result.minimum_order_quantity_price}
                        </span>
                      </div>
                    </li>
                  </div>
                ))
              )}
            </ul>
          </div>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                internal Code
              </th>
              <th scope="col" className="px-6 py-3">
                price calculator
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>
              <th scope="col" className="px-6 py-3">
                sample price
              </th>
            </tr>
          </thead>
          <tbody>
            {!tableData ? (
              <TableSkeleton rows={10} columns={5} />
            ) : !tableData.length ? (
              <tr>
                <td colSpan={5} className="py-2 text-center">
                  No data found
                </td>
              </tr>
            ) : (
              tableData.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 flex gap-2">
                    {/* <Link
                      title="View"
                      href={`/admin/home-page/sliders/view/?id=${item.id}`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 14"
                      >
                        <g
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                        </g>
                      </svg>
                    </Link> */}
                    {/* <Link
                      title="Edit"
                      href={`/admin/products/edit/?id=${item.id}`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"
                        />
                      </svg>
                    </Link> */}
                    <Delete url={`/api/products/${item.id}/`} />
                  </td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.internal_code}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`${PRODUCTS_PAGE_ROUTES.PRICE_CALCULATOR}${item.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <button className="flex items-center text-white bg-[#8A1E41] rounded-md px-4 py-2">
                        Price
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
                    </Link>
                  </td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleSample(item.id, "view")} className="flex items-center text-white bg-[#8A1E41] rounded-md px-4 py-2">
                      <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#F9EBB2" d="M31,2c8.837,0,16,7.164,16,16c0,1.004-0.117,2.088-0.295,3.049l-1.77-1.77l-0.024-0.025 C44.949,18.855,45,18.383,45,18c0-7.73-6.268-14-14-14c-0.432,0-0.856,0.027-1.278,0.064c-0.82,0.074-1.616,0.229-2.391,0.439 c-3.525,0.955-6.49,3.248-8.327,6.307c-0.345,0.574-0.66,1.166-0.921,1.789C17.387,14.262,17,16.086,17,18 c0,0.617,0.131,1.818,0.131,1.818S16.396,20,16,20c-0.303,0-0.595-0.041-0.878-0.104c-0.033-0.008-0.038-0.008,0,0 C15.049,19.273,15,18.643,15,18c0-2.117,0.421-4.133,1.168-5.982c0.268-0.662,0.577-1.299,0.927-1.914 c1.899-3.336,4.963-5.914,8.64-7.197c0.72-0.252,1.458-0.461,2.221-0.607C28.941,2.107,29.958,2,31,2z"></path> <path fill="#B4CCB9" d="M61.414,41.414l-20.001,20C41.036,61.791,40.534,62,40,62s-1.036-0.209-1.414-0.586l-36-36 C2.214,25.041,2,24.525,2,24V4c0-1.104,0.897-2,2-2h18.778c-3.446,1.775-6.235,4.627-7.94,8.115C12.081,10.656,10,13.084,10,16 c0,3.312,2.687,6,6,6s6-2.688,6-6c0-1.488-0.545-2.848-1.443-3.896c1.748-3.088,4.822-5.316,8.451-5.924l32.406,32.406 C61.792,38.963,62,39.465,62,40C62,40.533,61.792,41.035,61.414,41.414z"></path> <g> <path fill="#394240" d="M62.828,37.172L48.347,22.689l0.012,0.012C48.764,21.201,49,19.629,49,18c0-9.941-8.059-18-18-18 c-1.663,0-3.266,0.244-4.793,0.666C25.557,0.236,24.791,0,24,0H4C1.791,0,0,1.791,0,4v20c0,1.061,0.422,2.078,1.172,2.828l36,36 C37.952,63.609,38.977,64,40,64s2.048-0.391,2.828-1.172l20-20C64.391,41.266,64.391,38.732,62.828,37.172z M25.734,2.906 c0.72-0.252,1.458-0.461,2.221-0.607C28.941,2.107,29.958,2,31,2c8.837,0,16,7.164,16,16c0,1.004-0.117,2.088-0.295,3.049 l-1.77-1.77l-0.024-0.025C44.949,18.855,45,18.383,45,18c0-7.73-6.268-14-14-14c-0.432,0-0.856,0.027-1.278,0.064 c-0.82,0.074-1.616,0.229-2.391,0.439c-3.525,0.955-6.49,3.248-8.327,6.307c-0.345,0.574-0.66,1.166-0.921,1.789 C17.387,14.262,17,16.086,17,18c0,0.617,0.131,1.818,0.131,1.818S16.396,20,16,20c-0.303,0-0.595-0.041-0.878-0.104 C15.049,19.273,15,18.643,15,18c0-2.117,0.421-4.133,1.168-5.982c0.268-0.662,0.577-1.299,0.927-1.914 C18.994,6.768,22.058,4.189,25.734,2.906z M42.965,17.309L31.692,6.035C37.765,6.383,42.617,11.234,42.965,17.309z M20,16 c0,0.99-0.371,1.885-0.971,2.578C19.021,18.387,19,18.197,19,18c0-1.301,0.213-2.549,0.596-3.723C19.848,14.801,20,15.381,20,16z M61.414,41.414l-20.001,20C41.036,61.791,40.534,62,40,62s-1.036-0.209-1.414-0.586l-36-36C2.214,25.041,2,24.525,2,24V4 c0-1.104,0.897-2,2-2h18.778c-3.446,1.775-6.235,4.627-7.94,8.115C12.081,10.656,10,13.084,10,16c0,3.312,2.687,6,6,6s6-2.688,6-6 c0-1.488-0.545-2.848-1.443-3.896c1.748-3.088,4.822-5.316,8.451-5.924l32.406,32.406C61.792,38.963,62,39.465,62,40 C62,40.533,61.792,41.035,61.414,41.414z M13.031,18.627C12.402,17.924,12,17.018,12,16c0-1.398,0.72-2.625,1.806-3.34 C13.282,14.348,13,16.141,13,18C13,18.211,13.022,18.418,13.031,18.627z"></path> <path fill="#394240" d="M50.122,37.879c-1.17-1.17-3.073-1.17-4.243,0l-7.984,7.984c-1.169,1.168-1.212,3.115-0.042,4.285 c1.168,1.17,3.108,1.135,4.278-0.035l7.992-7.99h-0.002C51.291,40.953,51.291,39.049,50.122,37.879z M48.707,40.709l-7.96,7.959 c-0.391,0.391-1.092,0.457-1.48,0.066c-0.391-0.391-0.34-1.074,0.051-1.465l7.976-7.975c0.391-0.391,1.023-0.391,1.414,0 C49.098,39.684,49.098,40.318,48.707,40.709z"></path> <path fill="#394240" d="M42.122,34.123c1.17-1.17,1.17-3.074,0.001-4.242c-1.17-1.17-3.073-1.172-4.243-0.002l-7.984,7.984 c-1.169,1.17-1.212,3.117-0.042,4.287c1.168,1.17,3.108,1.133,4.278-0.037l7.992-7.99H42.122z M40.708,32.709l-7.96,7.961 c-0.391,0.391-1.092,0.457-1.48,0.066c-0.391-0.391-0.34-1.074,0.051-1.465l7.976-7.977c0.391-0.391,1.023-0.391,1.414,0 C41.099,31.684,41.099,32.318,40.708,32.709z"></path> <path fill="#394240" d="M34.118,26.119c1.17-1.17,1.17-3.074,0.001-4.242c-1.17-1.17-3.073-1.172-4.243-0.002l-7.984,7.984 c-1.169,1.17-1.212,3.117-0.042,4.287c1.168,1.17,3.108,1.133,4.278-0.037l7.992-7.99H34.118z M32.704,24.705l-7.96,7.961 c-0.391,0.391-1.092,0.457-1.48,0.066c-0.391-0.391-0.34-1.074,0.051-1.465l7.976-7.977c0.391-0.391,1.023-0.391,1.414,0 C33.095,23.68,33.095,24.314,32.704,24.705z"></path> </g> <g> <path fill="#506C7F" d="M48.707,39.295c-0.391-0.391-1.023-0.391-1.414,0l-7.976,7.975c-0.391,0.391-0.441,1.074-0.051,1.465 c0.389,0.391,1.09,0.324,1.48-0.066l7.96-7.959C49.098,40.318,49.098,39.684,48.707,39.295z"></path> <path fill="#506C7F" d="M40.708,31.295c-0.391-0.391-1.023-0.391-1.414,0l-7.976,7.977c-0.391,0.391-0.441,1.074-0.051,1.465 c0.389,0.391,1.09,0.324,1.48-0.066l7.96-7.961C41.099,32.318,41.099,31.684,40.708,31.295z"></path> <path fill="#506C7F" d="M32.704,23.291c-0.391-0.391-1.023-0.391-1.414,0l-7.976,7.977c-0.391,0.391-0.441,1.074-0.051,1.465 c0.389,0.391,1.09,0.324,1.48-0.066l7.96-7.961C33.095,24.314,33.095,23.68,32.704,23.291z"></path> </g> <g> <path fill="#506C7F" d="M19.596,14.277C19.213,15.451,19,16.699,19,18c0,0.197,0.021,0.387,0.029,0.578 C19.629,17.885,20,16.99,20,16C20,15.381,19.848,14.801,19.596,14.277z"></path> <path fill="#506C7F" d="M12,16c0,1.018,0.402,1.924,1.031,2.627C13.022,18.418,13,18.211,13,18c0-1.859,0.282-3.652,0.806-5.34 C12.72,13.375,12,14.602,12,16z"></path> </g> </g> </g></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {showSampleModal && currentProductId &&
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full flex justify-center items-center"
        >
          <div className="relative w-full max-w-sm max-h-full">
            <div className="relative flex flex-col items-center bg-white rounded-lg shadow">
              <div className="pt-4">
              </div>
              <div className="flex items-center justify-between pb-4 pt-2 rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  Product Sample Price
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSampleModal(false)}
                  className="text-gray-600 absolute top-2 right-4 bg-transparent  hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                  data-modal-hide="default-modal"
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
              </div>
              <div className="p-4 space-y-4">
                <div className='flex flex-col'>
                  <label htmlFor='sample' className="block mb-2 text-sm font-medium dark:text-black">Price :</label>
                  <input onChange={e => setSamplePrice(e.target.value)} id="sample" type='text' className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={samplePrice} />
                </div>
              </div>
              <div className="flex items-center p-4 space-x-4 border-gray-200 rounded-b ">
                <button
                  onClick={() => handleSample(currentProductId, "update")}
                  data-modal-hide="default-modal"
                  type="button"
                  className="bg-white border border-red-300 text-caption-20 hover:bg-red-50 block rounded px-4 py-1 font-medium text-red-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      }


      {/* Pagination for Products with out search term */}
      {!showSearchPagination && tableData && tableData.length > 0 && (
        <div className="flex justify-between items-center">
          <Pagination
            total_count={totalCount ? totalCount : tableData.length}
            offsetCount={offsetCount}
            showTextOnly={true}
          />
          <Pagination
            total_count={totalCount ? totalCount : tableData.length}
            offsetCount={offsetCount}
            url={`/admin/products`}
          />
        </div>
      )}

      {/* Pagination for Products with out search term */}
      {showSearchPagination && tableData && tableData.length > 0 && (
        <div className="flex justify-between items-center">
          <Pagination
            total_count={searchCount ? searchCount : tableData.length}
            offsetCount={searchOffset}
            showTextOnly={true}
          />
          <Pagination
            total_count={searchCount ? searchCount : tableData.length}
            offsetCount={searchOffset}
            noRedirect={true}
            url={`/admin/products/?search=${searchTerm}`}
            callback={getSearchOffset}
          />
        </div>
      )}
    </>
  );
}
