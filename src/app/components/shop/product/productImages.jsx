'use client';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ImageModal from '../../common/imageModal';

const ProductImageGallery = ({ productDetails }) => {
  console.log(productDetails,'productDetails')
  const { images } = productDetails;
  const mainImage = images.find(each => each.caption === 'Main')
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeImage, setActiveImage] = useState(mainImage ? mainImage.url : images[0].url);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const { globalStore, setGlobalStore, productStore, setProductStore } =
    useGlobalContext();
  const [addedWishList, setAddedWishList] = useState(false);
  const [wishListData, setWishListData] = useState(null);
  const [showWishlistIcon, setShowWishlistIcon] = useState(false);

  const [isMagnifying, setIsMagnifying] = useState(false);
  const [magnifiedPosition, setMagnifiedPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ left: 0, top: 0 });

  const paramsObject = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  //Setting activeImage if redirected from cartPage edit button
  useEffect(() => {
    if (paramsObject.mode === 'edit') {
      setActiveImage(paramsObject.imgurl);
    }
  }, []);


  const handleIsOpenImageModal = () => {
    setIsOpenImageModal(!isOpenImageModal);
  };
  const handleImageChange = (newImageUrl) => {
    setActiveImage(newImageUrl);
  };
  const handleDownloadClick = async () => {
    try {
      // Fetch the image data
      const response = await fetch(activeImage);
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'image.jpg'; // You can specify the filename here

      // Trigger a click event on the anchor element
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up the anchor element and URL
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

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
      console.log('Error fetching WishList Data');
    }
  }

  const handleWishList = async (e) => {
    e.preventDefault();
    getWishListData();
    const user_id = Cookies.get('user_id');
    if (!user_id) {
      // Handle case when user is not logged in
      return;
    }

    const wishlistItem = wishListData?.find(
      (item) => item.product.id === productDetails.id
    );
    const url = wishlistItem
      ? `/api/wishlists/${wishlistItem.id}`
      : `/api/wishlists`;
    const method = wishlistItem ? 'DELETE' : 'POST';
    const bodyData = wishlistItem
      ? undefined
      : JSON.stringify({
          product_id: productDetails.id,
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

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        getWishListData(); //Ensure Wish list data is updated
        setAddedWishList(!addedWishList);
        setGlobalStore({
          ...globalStore,
          wishListCount: globalStore.wishListCount + (wishlistItem ? -1 : 1),
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_DOMAIN_URL}${pathname}`;
      await navigator.share({ url, title: 'We Love Branding' });
    } catch (error) {
      alert('Error occured while Sharing !');
      console.log('Error sharing:', error);
    }
  };

  useEffect(() => {
    setAddedWishList(
      productDetails?.wish_list
        ?.map((item) => item.user_id)
        .includes(globalStore.userId)
    );
    setShowWishlistIcon(globalStore.userId ? true : false);
  }, []);

  useEffect(() => {
    if (productStore.colorVariationName) {
      const imag = images.find((eachImage) => {
        // MatSliver === MatSliver
        if (
          eachImage.caption && eachImage.caption.toLowerCase().split(' ').join('') ===
          productStore.colorVariationName.toLowerCase()
        ) {
          return eachImage;
        }

        //White  === WhiteUSBSwivel
        if (
          productStore.colorVariationName
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(' ')
            .includes(eachImage.caption)
        ) {
          return eachImage;
        }

        //Light Blue  === LightBlueUSBSwivel
        if (
          productStore.colorVariationName
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(' ')
            .join(' ')
            .includes(eachImage.caption)
        ) {
          return eachImage;
        }
      });
      const defut = images.find((eachImage) =>
        ['Main', 'Feature'].includes(eachImage.caption)
      );

      if (imag) {
        setActiveImage(imag.url);
      } else if (defut) {
        setActiveImage(defut.url);
      }
    }
  }, [productStore]);

  const handleMouseEnter = (e) => {
    setIsMagnifying(true);
    updateMagnifiedPosition(e);
  };

  const handleMouseLeave = () => {
    setIsMagnifying(false);
  };

  const handleMouseMovement = (e) => {
    // Calculate the position relative to the 'first' element
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    // Update the lens position
    setLensPosition({ left: x - 230, top: y - 360 });
    updateMagnifiedPosition(e);
  };

  const updateMagnifiedPosition = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;
    const xPercent = (offsetX / width) * 100;
    const yPercent = (offsetY / height) * 100;
    setMagnifiedPosition({ x: xPercent, y: yPercent });
  };

  return (
    <>
      <ImageModal
        isOpenImageModal={isOpenImageModal}
        handleIsOpenImageModal={handleIsOpenImageModal}
        activeImage={activeImage}
        images={images}
      />

      <div className="relative container lg:sticky lg:top-[250px] lg:min-w-[500px] lg:w-[676px] min-h-[300px] lg:min-h-[600px] flex flex-col items-start ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div
          id="first"
          className="overflow-hidden mx-auto cursor-crosshair"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onMouseMove={handleMouseMove}
          onMouseMove={handleMouseMovement}
        >
          {isMagnifying && (
            <span 
            className='hidden lg:block'
            id="lens"
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              left: lensPosition.left + 'px',
              top: lensPosition.top + 'px',
              transform: 'translateY(-50%, -50%)',
              pointerEvents: 'none'
            }}
          ></span>
          )}
          <img
            className="mt-12 lg:mt-0 mx-auto h-[250px] sm:h-[350px] lg:min-h-[600px]"
            src={activeImage}
            alt=""
          />
        </div>
        <div className="absolute flex top-0 lg:left-5 gap-3">
          <div
            className="border border-solid border-opacity-20 rounded-full cursor-pointer"
            onClick={handleDownloadClick}
          >
            <svg
              className="w-8 h-8 lg:w-10 lg:h-10 p-2 text-[#656566]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 19"
            >
              <path
                stroke="#656566"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 15h.01M4 12H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-3M9.5 1v10.93m4-3.93-4 4-4-4"
              />
            </svg>
          </div>

          {showWishlistIcon && (
            <div
              className="border border-solid border-opacity-20 rounded-full cursor-pointer"
              onClick={handleWishList}
            >
              <svg
                className="w-8 h-8 lg:w-10 lg:h-10 p-2 text-[#656566]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={addedWishList ? 'red' : 'white'}
                viewBox="0 0 21 19"
              >
                <path
                  stroke={addedWishList ? 'red' : '#656566'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"
                />
              </svg>
            </div>
          )}
          <div
            className="border border-solid border-opacity-20 rounded-full cursor-pointer"
            onClick={handleShare}
          >
            <svg
              className="w-8 h-8 lg:w-10 lg:h-10 p-2 text-[#656566]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                opacity="0.8"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 0.79C19.9987 0.751515 19.9954 0.713127 19.99 0.675L19.985 0.65C19.9747 0.605799 19.9613 0.562362 19.945 0.52C19.94 0.51 19.935 0.495 19.93 0.485C19.917 0.454026 19.902 0.423959 19.885 0.395L19.855 0.35C19.8276 0.308311 19.7958 0.269747 19.76 0.235C19.725 0.199474 19.6865 0.16764 19.645 0.14L19.61 0.12C19.58 0.100382 19.5482 0.0836408 19.515 0.07L19.48 0.055C19.4376 0.0386947 19.3942 0.0253296 19.35 0.015L19.315 0.01C19.2803 0.00419346 19.2452 0.000851777 19.21 0L19.165 0C19.1282 0.000849646 19.0914 0.0041906 19.055 0.01L19.025 0.015C18.9838 0.0220171 18.9435 0.0337612 18.905 0.05L0.535 6.74C0.378007 6.79857 0.242648 6.90369 0.147037 7.0413C0.0514265 7.17891 0.000125641 7.34244 0 7.51C0.000236216 7.67761 0.0522384 7.84105 0.148896 7.97799C0.245553 8.11492 0.382147 8.21865 0.54 8.275L8.745 11.255L11.725 19.46C11.7812 19.6159 11.8836 19.7511 12.0184 19.8475C12.1533 19.944 12.3142 19.9972 12.48 20H12.49C12.6576 19.9999 12.8211 19.9486 12.9587 19.853C13.0963 19.7574 13.2014 19.622 13.26 19.465L19.95 1.095C19.965 1.055 19.975 1.015 19.985 0.985L19.99 0.955C19.996 0.913591 19.9994 0.871838 20 0.83V0.79ZM17.16 3.995L12.495 16.8L10.325 10.825L17.16 3.995ZM16.005 2.84L9.175 9.675L3.2 7.505L16.005 2.84Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div
          onClick={handleIsOpenImageModal}
          className="cursor-pointer border border-solid border-opacity-20 rounded-full absolute flex top-0 right-0 lg:right-10"
        >
          <svg
            className="w-8 h-8 lg:w-10 lg:h-10 p-2.5 text-gray-600"
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
              d="m19 19-4-4M5 8h6m-3 3V5m7 3A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <div className="container flex lg:mx-0 lg:my-10 justify-around gap-2 mx-auto lg:justify-start lg:gap-5 lg:flex-wrap overflow-x-auto mt-1">
          {images.map((eachImage, index) => (
            <div
              key={index}
              className="flex flex-col items-center shadow min-w-fit min-h-max"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={index}
                className={`w-24 h-24 cursor-pointer ${
                  eachImage.url === activeImage
                    ? 'border-2 border-yellow-500'
                    : ''
                }`}
                src={eachImage.url}
                alt=""
                onClick={() => handleImageChange(eachImage.url)}
              />
              <span className="text-sm"> {eachImage.caption}</span>
            </div>
          ))}
        </div>
        {/* Magnified Image */}
        {isMagnifying && (
          <div
            id="second"
            className="absolute bg-white border border-gray-300 shadow-md z-20 hidden lg:block"
            style={{
              left: 'calc(100% + 10px)',
              top: '25%',
              transform: 'translateY(-50%)',
              backgroundSize: '300% 300%',
              width: '500px', // Adjust width of magnified view
              height: '500px', // Adjust height of magnified view
              backgroundImage: `url(${activeImage})`,
              // backgroundSize: 'cover',
              backgroundPosition: `${magnifiedPosition.x}% ${magnifiedPosition.y}%`,
              //  // Set a high z-index value to ensure the magnified image appears over other content
              // display: 'block'
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default ProductImageGallery;
