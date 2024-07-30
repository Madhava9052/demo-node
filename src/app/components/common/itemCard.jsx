'use client';

import React, { useEffect, useState } from 'react';
import { API_RESPONSE_STATUS, PRODUCT } from '@/constants/variablesNames';
import Link from 'next/link';
import Popover from './popOver';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/app/context/store';
import StarRating from './starRating';
import LazyLoadedImage from './lazyLoadedImage';
import ImageModal from './imageModal';
import { usePathname } from 'next/navigation';

export default function ItemCard({ product, categoryPath = '',availableStock, forWishList, handleRemoveWishlist, wishListId, handleShareWishListItem, reviews }) {
  const pathName = usePathname();
  const [productData, setProductData] = useState(product);
  const [isTokenExisting, setIsTokenExisting] = useState(false);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const { globalStore, setGlobalStore } = useGlobalContext();
  const [wishListData, setWishListData] = useState(null)
  const [categoryId, setCategoryId] = useState(null);
  
    
  // console.log(productData) 


  async function getWishListData() {
    try {
      const response = await sendRequest(`/api/wishlists/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      if (response.status === API_RESPONSE_STATUS.SUCCESS) {
        setWishListData(response.data);
      }
    } catch {
      console.log("Error fetching WishList Data");
    }
  }

  const brandingSolutions = productData.branding_information.map(
    (info) => info?.branding_solution?.title
  );

  const popOverDescription = brandingSolutions.filter(Boolean).join(', ');

  const handleIsOpenImageModal = () => {
    setIsOpenImageModal(!isOpenImageModal);
  };

  const handleWishList = async (e) => {
    e.preventDefault();
    getWishListData();
    const user_id = Cookies.get('user_id');
    if (!user_id) {
      // Handle case when user is not logged in
      return;
    }

    const wishlistItem = wishListData?.find(item => item.product.id === productData.id);
    const url = wishlistItem ? `/api/wishlists/${wishlistItem.id}` : `/api/wishlists`;
    const method = wishlistItem ? 'DELETE' : 'POST';
    const bodyData = wishlistItem ? undefined : JSON.stringify({
      product_id: productData.id,
      user_id: user_id,
    });

    const options = {
      method: method,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: bodyData,
    };

    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        getWishListData() //Ensure Wish list data is updated 
        const updatedWishList = wishlistItem ?
          productData.wish_list.filter(item => item.user_id !== user_id) :
          [...productData.wish_list, { user_id: responseData.data.user_id }];

        setProductData({
          ...productData,
          wish_list: updatedWishList,
        });
        setGlobalStore({
          ...globalStore,
          wishListCount: globalStore.wishListCount + (wishlistItem ? -1 : 1),
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };


  useEffect(() => {
    if (globalStore) {
      setIsTokenExisting(globalStore.userToken ? true : false);
    }
  }, [globalStore]);

  //Product Page BreadCrumbs Functionality

  //Regex for checking category followed by (brands|collection|Branding Solutions) and extracting category id 
  const regex = /\/category\/((brands|collection|Branding\sSolutions)\/([^\/]+)\/([^\/]+)|([^\/]+)\/([^\/]+))$/;
  const isCategory = pathName.match(regex);
  const regexforhomepage = /\/product\/(featured|top-products|our-best-sellers)\/([^\/]+)$/;
  const isFromHome = pathName.match(regexforhomepage);

  useEffect(() => {
    if (isCategory && isCategory.length > 0) {
      const extractedCategoryId = pathName.slice(pathName.lastIndexOf("/") + 1); // Extracted ID
      setCategoryId(extractedCategoryId); // Set the categoryId state variable
    }
  }, []);

  const mainImage = productData?.images.find(each => each.caption === 'Main')

  return (
    <>
      <div className="relative mx-auto border-[#0000001a] bg-[#fff] h-full w-fit p-1 sm:p-3 cursor-pointer border">
        <Link href={`/product/${isCategory ? `${categoryPath}${productData.id}?categoryId=${categoryId}` : pathName === "/" ? `/${categoryPath}/${productData.id}/?ishome=true` : `${productData.id}`}`}>
          {/* <Link href={`/product/${categoryPath}${productData.id}`}> check here  */}
          <div className="absolute z-10 flex text-sm font-semibold flex-wrap gap-1">
            {productData.status == PRODUCT.status.NEW && (
              <span className=" text-white bg-[#008000]  px-[10px] py-[7px] inline-flex items-center justify-center gap-[10px]">
                New in
              </span>
            )}
            {productData?.type?.map((eachType, index) => (
              <span
                key={index}
                className={`text-white text-sm font-semibold ${eachType === PRODUCT.type.DISCOUNT_PERCENTAGGE
                  ? 'bg-[#DD0000]'
                  : 'bg-[#8A1E41]'
                  }  px-[10px] py-[7px] inline-flex items-center justify-center gap-[10px]`}
              >
                {eachType.slice(0, 1).toUpperCase() + eachType.slice(1).toLowerCase()}
              </span>
            ))}
          </div>

          {(isTokenExisting) ? (
            <div
              className="absolute z-10 right-[2px] sm:right-[12px]"

            >
              {
                forWishList ?
                  <menu className='flex gap-4 justify-end mt-2'>
                    <svg onClick={(e) => { e.preventDefault(); handleShareWishListItem(product.id) }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" fillRule="evenodd" clipRule="evenodd" d="M20 0.79C19.9987 0.751515 19.9954 0.713127 19.99 0.675L19.985 0.65C19.9747 0.605799 19.9613 0.562362 19.945 0.52C19.94 0.51 19.935 0.495 19.93 0.485C19.917 0.454026 19.902 0.423959 19.885 0.395L19.855 0.35C19.8276 0.308311 19.7958 0.269747 19.76 0.235C19.725 0.199474 19.6865 0.16764 19.645 0.14L19.61 0.12C19.58 0.100382 19.5482 0.0836408 19.515 0.07L19.48 0.055C19.4376 0.0386947 19.3942 0.0253296 19.35 0.015L19.315 0.01C19.2803 0.00419346 19.2452 0.000851777 19.21 0L19.165 0C19.1282 0.000849646 19.0914 0.0041906 19.055 0.01L19.025 0.015C18.9838 0.0220171 18.9435 0.0337612 18.905 0.05L0.535 6.74C0.378007 6.79857 0.242648 6.90369 0.147037 7.0413C0.0514265 7.17891 0.000125641 7.34244 0 7.51C0.000236216 7.67761 0.0522384 7.84105 0.148896 7.97799C0.245553 8.11492 0.382147 8.21865 0.54 8.275L8.745 11.255L11.725 19.46C11.7812 19.6159 11.8836 19.7511 12.0184 19.8475C12.1533 19.944 12.3142 19.9972 12.48 20H12.49C12.6576 19.9999 12.8211 19.9486 12.9587 19.853C13.0963 19.7574 13.2014 19.622 13.26 19.465L19.95 1.095C19.965 1.055 19.975 1.015 19.985 0.985L19.99 0.955C19.996 0.913591 19.9994 0.871838 20 0.83V0.79ZM17.16 3.995L12.495 16.8L10.325 10.825L17.16 3.995ZM16.005 2.84L9.175 9.675L3.2 7.505L16.005 2.84Z" fill="#3E3F40" />
                    </svg>
                    <svg onClick={(e) => { e.preventDefault(); handleRemoveWishlist(wishListId) }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 18L10 10M10 10L18 2M10 10L2 2M10 10L18 18" stroke="#656566" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </menu> : <svg
                    onClick={handleWishList}
                    className="w-5 h-5 text-[#53565B] dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={
                      productData?.wish_list
                        ?.map((item) => item.user_id)
                        .includes(Cookies.get('user_id'))
                        ? 'red'
                        : 'white'
                    }
                    viewBox="0 0 21 19"
                  >
                    <path
                      stroke={
                        productData?.wish_list
                          ?.map((item) => item.user_id)
                          .includes(Cookies.get('user_id'))
                          ? 'red'
                          : '#53565B'
                      }
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"
                    />
                  </svg>
              }
            </div>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <LazyLoadedImage
            src={mainImage ? mainImage.url : productData?.images[0]?.url}
            alt="Image"
            height={288}
            blur={true}
          />
          <div className='flex flex-col justify-end h-[60px]'>
            {(productData?.reviews?.rating || productData?.reviews?.total_reviews !== 0) && (
              <div className='flex my-1 items-center'>
                <StarRating rating={reviews?.rating} />
                <span className='hidden sm:block ml-2 text-sm'>{reviews?.total_reviews}&nbsp;reviews</span>
              </div>
            )}
            <div className={`flex items-center ${productData?.variations?.COLOUR?.length > 0 ? "mt-2" : "mt-0"}`}>
              {productData?.variations?.COLOUR?.length > 0 && (
                <>
                  {productData?.variations?.COLOUR?.slice(0, 3).map((eachColor, index) => (
                    <Popover key={eachColor.color} title="Color" content={eachColor.color}>
                      <label
                        style={{
                          backgroundColor: eachColor.hex_code,
                        }}
                        className={`relative cursor-pointer rounded-full block border ${index < 1 ? "ml-0" : ""} mx-[6px] w-[30px] h-[30px]`}
                      >
                        <input
                          hidden
                          type="radio"
                          name="color"
                          value={eachColor.color}
                        />
                      </label>
                    </Popover>
                  ))}
                  <Popover title="More">
                    <svg
                      className='mx-[6px] w-[30px] h-[30px] border rounded-full'
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <rect width="24" height="24" fill="white"></rect>
                        <path d="M12 6V18" stroke="#b0b0b0" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M6 12H18" stroke="#b0b0b0" strokeLinecap="round" strokeLinejoin="round"></path>
                      </g>
                    </svg>
                  </Popover>
                </>
              )}
            </div>
          </div>
        </Link >
        <div className="border-b-2 border-gray-300 my-2 sm:my-4"></div>
        {productData.name.toLowerCase().length > 21 ? (
          <Popover title="Product Name" content={productData.name}>
            <p className="text-black capitalize sm:text-lg font-semibold leading-normal tracking-tighter sm:tracking-normal line-clamp-1">
              {productData.name.toLowerCase()}
            </p>
          </Popover>
        ) : (
          <p className="text-black capitalize sm:text-lg font-semibold leading-normal tracking-tighter sm:tracking-normal line-clamp-1">
            {productData.name.toLowerCase()}
          </p>
        )}
        <span className="font-montserrat text-base sm:text-lg sm:font-normal sm:leading-140 ">
          from <span className='text-[#8A1E41]'>${productData?.minimum_order_quantity_price?.toFixed(2)}</span>
        </span>

        <div className="flex items-center justify-start gap-x-2">

          <Popover
            title="Product Description"
            content={productData.long_description}
          >
            <div className="my-1 lg:my-[6px] min-w-[30px] min-h-[30px] xl:min-w-[36px] xl:min-h-[36px] bg-[#0000001A] rounded-full flex items-center justify-center hover:bg-transparent hover:border-[#8A1E41] hover:border hover:text-[#8A1E41]">
              D
            </div>
          </Popover>
          <Popover title="Available Stock" content={`${availableStock === 0 ? "Out of Stock" : availableStock}`}>
            <div className="my-1 lg:my-[6px] min-w-[30px] min-h-[30px] xl:min-w-[36px] xl:min-h-[36px] bg-[#0000001A] rounded-full flex items-center justify-center hover:bg-transparent hover:border-[#8A1E41] hover:border hover:text-[#8A1E41]">
              S
            </div>
          </Popover>
          <Popover
            title="Branding Information"
            content={popOverDescription}
          >
            <div className="my-1 lg:my-[6px] min-w-[30px] min-h-[30px] xl:min-w-[36px] xl:min-h-[36px] bg-[#0000001A] rounded-full flex items-center justify-center hover:bg-transparent hover:border-[#8A1E41] hover:border hover:text-[#8A1E41]">
              B
            </div>
          </Popover>
          <Popover title="Product Images" content="Click to View Product Images">
            <div
              onClick={(e) => {
                e.preventDefault();
                handleIsOpenImageModal();
              }}
              className="my-1 lg:my-[6px] min-w-[30px] min-h-[30px] xl:min-w-[36px] xl:min-h-[36px] bg-[#0000001A] rounded-full flex items-center justify-center hover:bg-transparent hover:border-[#8A1E41] hover:border hover:text-[#8A1E41]"
            >
              I
            </div>
          </Popover>
        </div>
      </div>

      <ImageModal
        isOpenImageModal={isOpenImageModal}
        handleIsOpenImageModal={handleIsOpenImageModal}
        activeImage={productData?.images[0]?.url}
        images={productData.images}
      />
    </>
  );
}
