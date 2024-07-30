'use client';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import useDebounce from '@/helpers/useDebounce';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LazyLoadedImage from '../../common/lazyLoadedImage';

export default function SearchNavbar({ logo }) {
  const [isTokenExisting, setIsTokenExisting] = useState(false);
  const router = useRouter();
  const { globalStore, setGlobalStore } = useGlobalContext();

  useEffect(() => {
    async function fetchData() {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      };
      const responseData = await sendRequest(
        '/api/users/wishlist_and_cart_items_count',
        options
      );

      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setGlobalStore({
          ...globalStore,
          cartCount: responseData.data.cart_items_count,
          wishListCount: responseData.data.wishlist_count,
        });
      }
    }
    if (globalStore.userToken) {
      fetchData();
    }
  }, []);
  useEffect(() => {
    if (globalStore) {
      setIsTokenExisting(globalStore.userToken ? true : false);
    }
  }, [globalStore]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchForm = Object.fromEntries(new FormData(e.target));
    if (searchForm.search.trim() !== "") {
      router.push(`/products/${searchForm.search}?search=${searchForm.search}`);
      e.target.reset();
    }
    setSearchResults([]);
  };
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false)
  const debounceInputValue = useDebounce(inputValue, 1000);
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

  // const handlerOnChange = async (e) => {
  //   e.preventDefault();

  //   if (e.target.value.trim() === '') {
  //     setSearchResults([]);
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const { data } = await sendRequest(
  //       `/api/products/?search=${e.target.value}&drop_down=true`
  //     );
  //     setSearchResults(data); // Assuming the API response contains a 'results' array
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <nav className=" bg-[#000] px-4 pb-3 sm:pb-0 sm:px-[10px] lg:px-[50px] xl:px-[20px] border-b border-white border-opacity-20">
      <div className="sm:min-h-[80px] flex flex-col sm:flex-row items-center justify-between lg:justify-normal container mx-auto lg:flex-wrap ">
        <Link href="/" className="hidden sm:block w-[50%] lg:pl-0 lg:w-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo != null ? logo : '/images/brand-logo.png'}
            className="cursor-pointer my-3 lg:my-0"
            alt=""
          />
        </Link>

        {/* for mobile */}
        <div className='flex sm:hidden justify-between items-center container'>
            
          <Link href="/" className="w-[50%] sm:pl-8 lg:pl-0 sm:w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo != null ? logo : '/images/brand-logo.png'}
              className="cursor-pointer my-3 lg:my-0"
              alt=""
            />
          </Link>
          <div className="flex sm:hidden sm:ml-auto my-3 lg:my-0 lg:ml-0">
            <div onClick={() => setShowSearch(!showSearch)}>
              <svg
                className="mx-2 cursor-pointer"
                width="26"
                height="22"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" />
                <path
                  d="M23.7068 22.2928L16.8818 15.4678C18.2038 13.8349 18.9998 11.7599 18.9998 9.49992C18.9998 4.26197 14.7378 0 9.49988 0C4.26193 0 0 4.26193 0 9.49988C0 14.7378 4.26197 18.9998 9.49992 18.9998C11.7599 18.9998 13.8349 18.2038 15.4678 16.8818L22.2928 23.7068C22.4878 23.9018 22.7438 23.9998 22.9998 23.9998C23.2558 23.9998 23.5118 23.9018 23.7068 23.7068C24.0978 23.3158 24.0978 22.6838 23.7068 22.2928ZM9.49992 16.9998C5.36395 16.9998 2 13.6358 2 9.49988C2 5.3639 5.36395 1.99995 9.49992 1.99995C13.6359 1.99995 16.9998 5.3639 16.9998 9.49988C16.9998 13.6358 13.6359 16.9998 9.49992 16.9998Z"
                  fill="white"
                />
              </svg>
            </div>
            <Link href="/user/wishlists" className="relative flex">
              <svg
                className="mx-2 cursor-pointer"
                width="26"
                height="22"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.8379 3.11534C28.7203 6.20779 28.7203 11.2773 25.8379 14.3962L13.9845 27.2218L2.15611 14.4196C0.758506 12.8708 -0.0103803 10.8559 0.000105862 8.76979C0.000105862 6.64023 0.749884 4.61334 2.15455 3.1169C5.01366 -0.000434101 9.69899 -0.000434101 12.5799 3.11534L13.9861 4.63668L15.3908 3.11534C18.2717 -0.00198954 22.957 -0.00198954 25.8394 3.11534H25.8379ZM3.52033 4.63979C2.46877 5.75512 1.90877 7.24846 1.90877 8.84757C1.90877 10.4187 2.49211 11.9151 3.52033 13.0553L14.0001 24.4373L24.4799 13.0305C25.5314 11.9151 26.0914 10.4202 26.0914 8.82268C26.1017 7.26748 25.5264 5.76537 24.4799 4.6149C22.3566 2.28157 18.8799 2.28157 16.7317 4.6149L14.0001 7.57979L11.2686 4.63979C10.1952 3.47312 8.79522 2.88979 7.39522 2.88979C5.99522 2.88979 4.59366 3.47312 3.52033 4.63979Z"
                  fill="white"
                />
              </svg>
              <span
                className={`text-white text-xs bg-yellow-500 rounded-full w-4 h-4 ${globalStore.wishListCount > 0 ? 'flex' : 'hidden'
                  } items-center justify-center absolute -top-2 right-1`}
              >
                {globalStore.wishListCount}
              </span>
            </Link>
            <Link href="/user/cart" className="relative flex">
              <svg
                className={`mx-2 cursor-pointer${isTokenExisting ? 'lg:mx-4 min-w-[28px]' : 'w-full ml-4 mx-0'}`}
                width="26"
                height="22"
                viewBox="0 0 28 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.77344 8.64355H24.2256V27.2696H3.77344V8.64355Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M9.78516 11.2613V4.7689C9.78516 4.7689 10.6069 1.21777 13.9998 1.21777C17.3914 1.21777 18.2132 4.7689 18.2132 4.7689V11.2613"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>

              <span
                className={`text-white bg-yellow-500 rounded-full w-4 h-4  ${globalStore.cartCount > 0 ? 'flex' : 'hidden'
                  } items-center justify-center absolute -top-2 right-1`}
              >
                {globalStore.cartCount}
              </span>
            </Link>
            <Link href={`/user/${isTokenExisting ? 'profile' : 'login'}`}>
              <svg
                className="cursor-pointer ml-2"
                width="26"
                height="22"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.8341 13.7237C18.9228 13.0681 19.8241 12.1429 20.4509 11.0373C21.0777 9.93183 21.4089 8.68338 21.4125 7.41253C21.4107 3.32267 18.0861 0 14 0C12.0353 0.00246974 10.1518 0.784027 8.7626 2.17326C7.37336 3.5625 6.5918 5.44599 6.58933 7.41067C6.59245 8.68165 6.92323 9.93036 7.54973 11.0362C8.17622 12.1421 9.07727 13.0677 10.1659 13.7237C4.3064 15.3963 0 20.7872 0 27.1768V28H28V27.1768C28 20.7872 23.6936 15.3981 17.8341 13.7237ZM8.23573 7.41067C8.23771 5.88249 8.84565 4.41748 9.92623 3.3369C11.0068 2.25632 12.4718 1.64838 14 1.6464C15.5285 1.64838 16.9938 2.25657 18.0744 3.33756C19.1551 4.41854 19.7628 5.88404 19.7643 7.41253C19.7623 8.94071 19.1544 10.4057 18.0738 11.4863C16.9932 12.5669 15.5282 13.1748 14 13.1768C12.4715 13.1748 11.0062 12.5666 9.92557 11.4856C8.84494 10.4047 8.23722 8.93916 8.23573 7.41067ZM14 14.8213C7.46667 14.8213 2.1 19.9229 1.6744 26.3517H26.3256C26.1133 23.2262 24.7229 20.2976 22.4351 18.1575C20.1474 16.0173 17.1327 14.825 14 14.8213Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>
        </div>
        <form
          onMouseLeave={() => setSearchResults([])}
          onSubmit={handleSearch}
          className={`${showSearch ? 'flex' : 'hidden'} relative container grow lg:w-[360px] xl:w-4/12 sm:flex items-center order-last my-0 sm:my-3 lg:m-0 lg:ml-auto  md:order-none lg:grow-0`}
        >
          <input
            name="search"
            onBlur={() => setInputValue('')}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className="lg:max-w-[500px] ml-auto text-base grow sm:max-w-[300px] lg:min-w-[300px] pl-5 h-[40px] border text-black rounded-l border-r-0 border-black border-opacity-10 outline-none"
            placeholder="Search products, category"
          />
          {searchResults?.length ? (
            <div
              onClick={() => setSearchResults([])}
              className="bg-white flex justify-center items-center w-[25px] h-[40px]"
            >
              <svg
                className="w-4 h-4 text-gray-800 dark:text-white"
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
            </div>
          ) : (
            ''
          )}

          <button type="submit">
            <svg
              className="bg-[#8A1E41] cursor-pointer h-[40px] w-[40px] p-[13px]"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="#8A1E41" />
              <path
                d="M23.7068 22.2928L16.8818 15.4678C18.2038 13.8349 18.9998 11.7599 18.9998 9.49992C18.9998 4.26197 14.7378 0 9.49988 0C4.26193 0 0 4.26193 0 9.49988C0 14.7378 4.26197 18.9998 9.49992 18.9998C11.7599 18.9998 13.8349 18.2038 15.4678 16.8818L22.2928 23.7068C22.4878 23.9018 22.7438 23.9998 22.9998 23.9998C23.2558 23.9998 23.5118 23.9018 23.7068 23.7068C24.0978 23.3158 24.0978 22.6838 23.7068 22.2928ZM9.49992 16.9998C5.36395 16.9998 2 13.6358 2 9.49988C2 5.3639 5.36395 1.99995 9.49992 1.99995C13.6359 1.99995 16.9998 5.3639 16.9998 9.49988C16.9998 13.6358 13.6359 16.9998 9.49992 16.9998Z"
                fill="white"
              />
            </svg>
          </button>

          <ul className="bg-white absolute left-0 top-full w-full max-h-[500px] overflow-y-auto z-10">
            {isLoading ? (
              <li
                className="flex border px-5 py-3 cursor-pointer w-full text-black text-base text-left bg-white border-b border-solid border-opacity-9
            "
              >
                Loading...
              </li>
            ) : (
              searchResults?.map((result) => (
                <Link href={`/product/${result.id}`} key={result.id}>
                  <li
                    onClick={() => setSearchResults([])}
                    className="flex border px-5 py-3 cursor-pointer w-full text-base text-left bg-white border-b border-solid border-opacity-9
                "
                  >
                    <LazyLoadedImage
                      src={result?.images[0]?.url}
                      alt="Image"
                      height={70}
                      width={70}
                      blur={true}
                    />

                    <div className="px-5 cursor-pointer w-95 text-black text-base text-left bg-white">
                      <p className="text-base font-normal">{result.name}</p>
                      <span className="text-sm font-semibold block">
                        $ {result.minimum_order_quantity_price}
                      </span>
                    </div>
                  </li>
                </Link>
              ))
            )}
          </ul>
        </form>
        <div className="hidden h-[62px] mx-7 w-[1px] bg-white lg:inline"></div>
        <div className="hidden sm:flex sm:ml-auto my-3 lg:my-0 lg:ml-0">
          <Link href={`/user/${isTokenExisting ? 'profile' : 'login'}`}>
            <svg
              className="sm:ml-4 lg:mx-4 min-w-[28px] min-h-[28px] cursor-pointer"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.8341 13.7237C18.9228 13.0681 19.8241 12.1429 20.4509 11.0373C21.0777 9.93183 21.4089 8.68338 21.4125 7.41253C21.4107 3.32267 18.0861 0 14 0C12.0353 0.00246974 10.1518 0.784027 8.7626 2.17326C7.37336 3.5625 6.5918 5.44599 6.58933 7.41067C6.59245 8.68165 6.92323 9.93036 7.54973 11.0362C8.17622 12.1421 9.07727 13.0677 10.1659 13.7237C4.3064 15.3963 0 20.7872 0 27.1768V28H28V27.1768C28 20.7872 23.6936 15.3981 17.8341 13.7237ZM8.23573 7.41067C8.23771 5.88249 8.84565 4.41748 9.92623 3.3369C11.0068 2.25632 12.4718 1.64838 14 1.6464C15.5285 1.64838 16.9938 2.25657 18.0744 3.33756C19.1551 4.41854 19.7628 5.88404 19.7643 7.41253C19.7623 8.94071 19.1544 10.4057 18.0738 11.4863C16.9932 12.5669 15.5282 13.1748 14 13.1768C12.4715 13.1748 11.0062 12.5666 9.92557 11.4856C8.84494 10.4047 8.23722 8.93916 8.23573 7.41067ZM14 14.8213C7.46667 14.8213 2.1 19.9229 1.6744 26.3517H26.3256C26.1133 23.2262 24.7229 20.2976 22.4351 18.1575C20.1474 16.0173 17.1327 14.825 14 14.8213Z"
                fill="white"
              />
            </svg>
          </Link>
          <Link href="/user/wishlists" className="relative hidden xl:flex">
            <svg
              className="mx-2 lg:mx-4 min-w-[28px]  min-h-[28px] cursor-pointer"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.8379 3.11534C28.7203 6.20779 28.7203 11.2773 25.8379 14.3962L13.9845 27.2218L2.15611 14.4196C0.758506 12.8708 -0.0103803 10.8559 0.000105862 8.76979C0.000105862 6.64023 0.749884 4.61334 2.15455 3.1169C5.01366 -0.000434101 9.69899 -0.000434101 12.5799 3.11534L13.9861 4.63668L15.3908 3.11534C18.2717 -0.00198954 22.957 -0.00198954 25.8394 3.11534H25.8379ZM3.52033 4.63979C2.46877 5.75512 1.90877 7.24846 1.90877 8.84757C1.90877 10.4187 2.49211 11.9151 3.52033 13.0553L14.0001 24.4373L24.4799 13.0305C25.5314 11.9151 26.0914 10.4202 26.0914 8.82268C26.1017 7.26748 25.5264 5.76537 24.4799 4.6149C22.3566 2.28157 18.8799 2.28157 16.7317 4.6149L14.0001 7.57979L11.2686 4.63979C10.1952 3.47312 8.79522 2.88979 7.39522 2.88979C5.99522 2.88979 4.59366 3.47312 3.52033 4.63979Z"
                fill="white"
              />
            </svg>
            <span
              className={`text-white bg-yellow-500 rounded-full w-6 h-6 ${globalStore.wishListCount > 0 ? 'flex' : 'hidden'
                } items-center justify-center absolute -top-2 right-1`}
            >
              {globalStore.wishListCount}
            </span>
          </Link>
          <Link href="/user/cart" className="relative hidden xl:flex">
            <svg
              className={`mx-2 min-h-[28px] cursor-pointer${isTokenExisting ? 'lg:mx-4 min-w-[28px]' : 'w-full ml-4 mx-0'}`}
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.77344 8.64355H24.2256V27.2696H3.77344V8.64355Z"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M9.78516 11.2613V4.7689C9.78516 4.7689 10.6069 1.21777 13.9998 1.21777C17.3914 1.21777 18.2132 4.7689 18.2132 4.7689V11.2613"
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            <span
              className={`text-white bg-yellow-500 rounded-full w-6 h-6 ${globalStore.cartCount > 0 ? 'flex' : 'hidden'
                } items-center justify-center absolute -top-2 right-1`}
            >
              {globalStore.cartCount}
            </span>
          </Link>

          {isTokenExisting && (
            <Link className="hidden xl:flex" href="/user/logout">
              <svg
                className="mx-4 mr-0 min-w-[28px] min-h-[28px] cursor-pointer text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
