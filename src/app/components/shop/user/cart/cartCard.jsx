import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { Fragment, useState } from 'react';

export default function CartCard({
  eachCartItem,
  onRemove,
  isSaveForLater,
  onToggleCartItem,
}) {
  const [cartItemAdditionInfoState, setcartItemAdditionInfoState] = useState({
    errorMessage: '',
    successMessage: '',
    processLoading: false,
  });
  // Function to handle coupon code submission
  const cartItemAdditionInfo = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = Object.fromEntries(new FormData(e.target));

    if (formData.additional_comments.trim() === "") {
      // Display an error message or handle the empty field scenario
      setcartItemAdditionInfoState({
        ...cartItemAdditionInfoState,
        errorMessage: 'Additional comments cannot be empty',
      });
      return;
    }



    setcartItemAdditionInfoState({
      ...cartItemAdditionInfoState,
      processLoading: true,
    });

    // Construct the API URL for applying or removing a coupon code
    const url = `/api/carts/cart_item/${eachCartItem.id}/`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      // Send the request to apply or remove the coupon code
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if coupon code submission failed
        setcartItemAdditionInfoState({
          ...cartItemAdditionInfoState,
          errorMessage: responseData.message,
          successMessage: '',
          processLoading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If coupon code submission was successful, update the cart state and display messages
        setcartItemAdditionInfoState({
          ...cartItemAdditionInfoState,
          errorMessage: '',
          successMessage: responseData.message,
          processLoading: false,
        });
      }
      setTimeout(() => {
        setcartItemAdditionInfoState({
          ...cartItemAdditionInfoState,
          errorMessage: '',
          successMessage: '',
          processLoading: false,
        });
      }, 5000);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  //redirect to product page with edit options
  const handleEdit = (cartItem) => {
    const url = `/product/${cartItem.product.id}/?mode=edit&cart_id=${cartItem.id}&imgurl=${cartItem.product_variation_image}`;
    window.location.href = url
  }

  //Share URL 
  const handleShare = async (eachCartItem) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/product/${eachCartItem?.product?.id}`;
      await navigator.share({ url, title: "We Love Branding" });
    } catch (error) {
      alert('Error occured while Sharing !');
      console.log('Error sharing:', error)
    }
  };

  return (
    <div className="bg-[#F7F7F7] mx-auto p-4 pb-8 py-6 relative shadow-lg overflow-hidden my-4 pr-8 lg:m-0 lg:mt-8">
      {eachCartItem.is_product_sample && (
        <div className="absolute z-10 left-0 top-0 h-16 w-16">
          <div className="absolute transform -rotate-45 bg-green-600 text-center text-white font-semibold py-1 left-[-35px] top-[32px] w-[170px]">
            Buy Sample
          </div>
        </div>
      )}

      <div className="flex flex-wrap relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={eachCartItem?.product_variation_image}
          className="w-32 h-32 border border-gray-200"
        />
        <div className='flex justify-between grow'>
          <div className="sm:ml-4 lg:ml-1 xl:ml-4 grow max-w-[400px]">
            <h4 className="my-3 font-semibold text-base sm:text-[22px] sm:leading-[26.82px]">
              {eachCartItem.product.name}
            </h4>
            <div>
              <p className="my-3">
                <span className="text-slate-500 text-lg">Product code :</span>{' '}
                <span className='text-lg font-semibold'>{eachCartItem.product.internal_code}</span>
              </p>
              <p className="my-3">
                <span className="text-slate-500 text-lg">Product Color :</span>{' '}
                <span className='text-lg font-semibold'>{eachCartItem?.product_variation_item?.name}</span>
              </p>
              {eachCartItem.product_size_quantity && (
                <>
                  <span className="text-slate-500 text-lg">Sizes :</span>{' '}
                  <div className="bg-white mb-2 border p-3 px-5 h-fit w-full flex items-center justify-between gap-3">
                    <div className="flex gap-2 items-center">
                      {/* <label
                        style={{
                          backgroundColor: `${showSizes.hex_code}`,
                        }}
                        className={` cursor-pointer rounded-full inline-block w-7 h-7 border bg-white`}
                      >
                        <input
                          hidden
                          type="radio"
                          name="color"
                          value={showSizes.hex_code}
                          defaultChecked="true"
                        />
                      </label> */}
                      <div className=" flex flex-1 flex-wrap gap-2 text-base">
                        {eachCartItem?.product_size_quantity?.map((size, index) => (
                          <span key={index} className="flex w-fit items-center gap-2">
                            {size.size}
                            <input
                              type="number"
                              className="text-sm text-center remove-arrow appearance-none focus:outline-none w-8 border"
                              defaultValue={size.quantity}
                              readOnly={true}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* <span className="flex items-center gap-2">
                      <span className="text-base font-semibold">Qty</span>
                      <div className="number-input flex items-center border p-1">
                        <input
                          disabled
                          type="number"
                          value={showSizes.sizes.reduce((acc, curr) => acc + parseInt(curr.quantity), 0)}
                          className="remove-arrow w-11 text-center border-0 appearance-none m-0 focus:outline-none border-gray-300 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <svg
                        className="ml-1 cursor-pointer"
                        width="12"
                        height="11"
                        viewBox="0 0 12 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() =>{
                          setShowSizes(null)
                          setSelectedVariation(false)
                        }}
                      >
                        <path
                          d="M0.18 11L4.88 4.88L4.84 6.22L0.36 0.319999H3.14L6.28 4.52H5.22L8.38 0.319999H11.08L6.56 6.22L6.58 4.88L11.26 11H8.44L5.14 6.54L6.18 6.68L2.94 11H0.18Z"
                          fill="#FFC107"
                        />
                      </svg>
                    </span> */}
                  </div>
                </>
              )}
              <p className="my-3">
                <span className="text-slate-500 text-lg"></span>{' '}

                <span className="text-slate-500 text-lg">Total Qty :</span>{' '}
                <span className='text-lg font-semibold'>{eachCartItem.quantity}</span>
              </p>
              {eachCartItem.is_product_sample && eachCartItem?.branding_list && (
                  <div className="my-3 flex flex-col">
                    <span className="text-slate-500 text-lg">Print Method / Additional Cost</span>{' '}
                    {eachCartItem?.branding_list?.map((eachbranding) => <span key={eachbranding.product_branding.id} className='text-lg font-semibold'>{eachbranding.product_branding.description} - Unit {eachbranding.quantity}</span>)}
                  </div>
              )}
              {!eachCartItem.is_product_sample && (
                <>
                  <p className="my-3">
                    <span className="text-slate-500 text-lg">Product Type :</span>{' '}
                    <span className='text-lg font-semibold'>{eachCartItem.is_branding_available ? 'Branded' : 'Unbranded'}</span>
                  </p>
                  {eachCartItem.is_branding_available && (
                    <>
                      <p className="my-3">
                        <span className="text-slate-500 text-lg">Print File : </span>{' '}
                        <br />
                        {eachCartItem.user_product_file.map((eachFile, index) => (
                          <Fragment key={index}>
                            <span className="font-bold">
                              {' '}
                              {eachFile.type.split("_").join(" ")} :{' '}
                            </span>{' '}
                            <Link
                              className="hover:text-yellow-400 hover:underline"
                              target="_blank"
                              href={eachFile.url}
                            >
                              <span className='text-lg font-semibold'>{eachFile.name}</span>
                            </Link>
                            <br />
                          </Fragment>
                        ))}
                      </p>
                      {eachCartItem?.branding_list &&
                        <div className="my-3 flex flex-col">
                          <span className="text-slate-500 text-lg">Print Method / Additional Cost</span>{' '}
                          {eachCartItem?.branding_list?.map((eachbranding) => <span key={eachbranding.product_branding.id} className='text-lg font-semibold'>{eachbranding.product_branding.description} - Unit {eachbranding.quantity}</span>)}
                        </div>}
                    </>
                  )}

                </>
              )}

            </div>
          </div>
          <div className="sm:ml-4 w-[200px]">
            <p className="my-3 flex justify-between text-lg">
              <span className="text-slate-500">Item Price :</span>
              <span className='font-semibold'>${' '}{(eachCartItem.price / eachCartItem.quantity).toFixed(2)}</span>
            </p>
            <p className="my-3 flex justify-between text-[#8A1E41] text-lg">
              <span className="text-slate-500">Total : </span>
              <span className='font-semibold'>${' '}{eachCartItem.price.toFixed(2)}</span>
            </p>
          </div>

        </div>

      </div>
      <form onSubmit={cartItemAdditionInfo} className='mx-auto pl-0 pr-0 md:pl-36 md:pr-28 lg:pl-1 lg:pr-0 xl:pl-36 xl:pr-28'>
        <textarea
          name="additional_comments"
          defaultValue={eachCartItem.additional_comments}
          className="w-full p-3 rounded text-sm outline-none resize-none border border-gray-200"
          placeholder="Additional comments"
          rows={4}
        ></textarea>

        {!isSaveForLater && (
          <button
            type="submit"
            className="text-sm font-semibold rounded p-3 mt-2 bg-[#FFCD00]
            "
          >
            {!cartItemAdditionInfoState.processLoading ? (
              'Update'
            ) : (
              <Spinner bgColor1="white" bgColor2="#851B39" />
            )}
          </button>
        )}
        {cartItemAdditionInfoState.errorMessage ||
          cartItemAdditionInfoState.successMessage ? (
          <AlertMessage
            name={
              cartItemAdditionInfoState.errorMessage
                ? 'error'
                : 'success'
            }
            message={
              cartItemAdditionInfoState.errorMessage ||
              cartItemAdditionInfoState.successMessage
            }
            linkText={null}
            linkHref={null}
            textColor={
              cartItemAdditionInfoState.errorMessage
                ? 'text-red-800'
                : 'text-green-800'
            }
            bgColor={
              cartItemAdditionInfoState.errorMessage
                ? 'bg-red-50'
                : 'bg-green-50'
            }
            closeAction={() =>
              setcartItemAdditionInfoState({
                ...cartItemAdditionInfoState,
                errorMessage: '',
                successMessage: '',
                processLoading: false,
              })
            }
          />
        ) : null}
      </form>
      <div className="flex sm:justify-end items-center text-base flex-wrap mt-4 md:mt-2 lg:mt-4 xl:mt-2 gap-y-3">
        <button onClick={() => handleShare(eachCartItem)} className="disabled:cursor-not-allowed disabled:text-slate-400 border-r-2 border-slate-400 px-3 hover:text-[#FFCD00]">
          Share
        </button>
        {!(isSaveForLater || eachCartItem.is_product_sample) && (
          <button onClick={() => handleEdit(eachCartItem)} className="disabled:cursor-not-allowed disabled:text-slate-400 border-r-2 border-slate-400 px-3 hover:text-[#FFCD00]">
            Edit
          </button>
        )}

        <button
          className="disabled:cursor-not-allowed disabled:text-slate-400 border-r-2 border-slate-400 px-3 hover:text-[#FFCD00]"
          onClick={() => onToggleCartItem(eachCartItem.id, isSaveForLater)}
        >
          {isSaveForLater ? 'Move to cart' : 'Save for later'}
        </button>
        <button
          type="button"
          onClick={() => onRemove(eachCartItem.id, isSaveForLater)}
          className="disabled:cursor-not-allowed disabled:text-slate-400 px-3 hover:text-[#FFCD00]"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
