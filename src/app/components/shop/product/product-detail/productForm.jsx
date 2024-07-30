'use client';
import { useState, useEffect } from 'react';
import ChooseYourVariations from './chooseYourVariations';
import Link from 'next/link';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import AlertMessage from '@/app/components/common/alert';
import { useGlobalContext } from '@/app/context/store';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import UploadYourDesigns from './uploadYourDesigns';
import InstaQuoteModal from '../instaQuoteModal';
import AfterPayInfo from '../AfterPayInfo';
import Popover from '@/app/components/common/popOver';
import { Afterpay, DeliveryCost, DeliveryTime, InfoIcon } from '@/constants/SVGs';


export default function ProductForm({
  productDetails,
  productVariations,
  templateDetails,
  priceCalculatorData,
  isSample=false,
  setActiveImage,
  setShowBuySampleModel=() => {}
}) {
  const router = useRouter();
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const { globalStore, setGlobalStore, setProductStore } = useGlobalContext();
  const [selectedEditOptions, setSelectedEditOptions] = useState(null);
  const [cartID, setCartID] = useState("");
  const [getPriceDebounceTimeId, setGetPriceDebounceTimeId] = useState("");
  const [showAfterInfoModal, setShowAfterInfoModal] = useState(false);
  const [productDetailForm, setProductDetailForm] = useState(null);
  const [selectedPrintMethods, setSelectedPrintMethods] = useState([])
  const [currentSelectedPrintMethod, setCurrentSelectedPrintMethod] = useState(null);
  const [brandingQuantities, setBrandingQuantities] = useState({});
  const [showPrintMethods, setShowPrintMethods] = useState(false)
  const [showProductTemplate, setShowProductTemplate] = useState(false);
  
  console.log("issample", isSample)
  let editParams = {}
  for (let pair of searchParams.entries()) {
    editParams[pair[0]] = pair[1]
  }

  useEffect(() => {
    async function getCartDetails() {
      if (editParams.mode === "edit") {
        const response = await sendRequest("/api/carts/", {
          headers: {
            Authorization: `Bearer ${globalStore.userToken}`,
          },
        });
        //filtering cart details with edit options from url Params
        if (response.status === API_RESPONSE_STATUS.SUCCESS) {
          setSelectedEditOptions(response?.data?.cart_items?.filter(eachCartItem => (eachCartItem.product.id === pathName.substring(pathName.lastIndexOf("/") + 1) && eachCartItem.id === editParams.cart_id)))
          setCartID(response?.data?.id)
        }
      }
    }
    getCartDetails();

    setProductDetailForm({
      branding: false,
      product_id: productDetails.id,
      quantity: productDetails.minimum_order_quantity_number,
      price: productDetails.minimum_order_quantity_price,
      totalPrice: parseInt(
        productDetails.minimum_order_quantity_number *
        productDetails.minimum_order_quantity_price
      ),
      selected_colors: [],
      price_summary: [],
      variation_items: [],
      product_variation_item_id: '',
      product_variation_item_array: [],
      product_variations_items_object: {},
      errorMessage: '',
      successMessage: '',
      uploadYourDesignUrls: [],
      product_size_quantity: [],
      additional_comments: "",
      submitLater: false
    });
  }, []);

  useEffect(() => {
    //selected edit options 
    console.log("edittt", selectedEditOptions)
    if (editParams.mode === "edit" && selectedEditOptions) {
      setProductDetailForm(prevState => ({
        ...prevState,
        branding: selectedEditOptions?.[0]?.is_branding_available,
        quantity: selectedEditOptions?.[0]?.quantity,
        product_variations_items_object: { COLOUR: selectedEditOptions?.[0]?.product_variation_item?.id },
        errorMessage: '',
        successMessage: '',
        uploadYourDesignUrls: (selectedEditOptions && selectedEditOptions[0]?.user_product_file),
        additional_comments: (selectedEditOptions && selectedEditOptions[0].additional_comments),
        product_size_quantity: (selectedEditOptions && selectedEditOptions[0].product_size_quantity),
        submitLater: selectedEditOptions?.[0]?.is_branding_available && selectedEditOptions[0]?.user_product_file.length === 0
      }));
      const updatedBrandingList = selectedEditOptions[0].branding_list.map(each => {
        const selectedEditBranding = productDetails.branding_information.find(eachBrand => eachBrand.id === each.product_branding.id)
        return({
          branding_id: selectedEditBranding.id,
          quantity: each.quantity,
          name: selectedEditBranding.branding_solution?.title || selectedEditBranding.description,
          dimensions: selectedEditBranding.branding_area
        })
      })
      setSelectedPrintMethods(updatedBrandingList)
    }
  }, [selectedEditOptions])

  useEffect(() => {
    //Debounce for getPrice
    clearTimeout(getPriceDebounceTimeId);
    const getPriceTimeID = setTimeout(() => {
      getPrice({
        selectedPrintMethods,
        productQuantity: productDetailForm
          ? productDetailForm.quantity
          : productDetails.minimum_order_quantity_number,
      });
    }, 1000);
    setGetPriceDebounceTimeId(getPriceTimeID);
  }, [selectedPrintMethods, productDetailForm?.quantity, productDetailForm?.branding]);

  const getPrice = async ({ productVariation, productQuantity, selectedPrintMethods, product_branding_id }) => {
    const path = `/api/products/${productDetails.id}/variation_items/quantity/price/`;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        quantity: productQuantity
          ? parseInt(productQuantity)
          : parseInt(productDetailForm?.quantity),
        ...(productVariation && {
          variation_items: productVariation.variationIds,
        }),
        ...(selectedPrintMethods?.length && productDetailForm?.branding && {
          branding_information: selectedPrintMethods
        }),
        ...(globalStore.userId && { user_id: globalStore.userId }),
      }),
    };
    try {
      let responseData;
      responseData = await sendRequest(path, options);
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle error
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setProductDetailForm(prevState => ({
          ...prevState,
          quantity: productQuantity,
          price: responseData.data.per_quantity_price,
          totalPrice: responseData.data.total_quantity_price,
          price_summary: responseData.data.price_summary.sort((a, b) => a.quantity - b.quantity),
        }));
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  if (!productDetailForm) {
    return null; // or a loading indicator
  }

  const addProductInCart = async (e) => {
    e.preventDefault();
    if(isSample){
      if (productVariations?.COLOUR?.length > 0 && !Object.values(productDetailForm.product_variations_items_object).length) {
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: 'please choose your Color and try again',
        });
        return;
      }
      if (
        productDetailForm.branding && Object.values(productDetailForm.product_variations_items_object).length &&
        productDetailForm.uploadYourDesignUrls.length && selectedPrintMethods.length < 0
      ) {
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: 'please choose your "Print Method" and try again',
        });
        return;
      }
  
      const url = `/api/carts/product_sample/`;
  
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${globalStore.userToken}`,
        },
        body: JSON.stringify({
          product_id: productDetailForm.product_id,
          ...(productVariations?.COLOUR?.length > 0
            && {
              product_variation_item_id: Object.values(
                productDetailForm.product_variations_items_object
              )[0],
            }),
          quantity: selectedPrintMethods.length,
          product_branding_id: selectedPrintMethods.map(eachprintmethod => ({
            branding_id: eachprintmethod.branding_id,
            quantity: eachprintmethod.quantity
          })),
          ...(productDetailForm.product_size_quantity && productDetailForm.product_size_quantity.length && {
            product_size_quantity: productDetailForm.product_size_quantity
          }),
        }),
      };
  
      try {
        const responseData = await sendRequest(url, options);
  
        // Check the status of the response
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle error case
          return
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          setProductDetailForm({
            ...productDetailForm,
            errorMessage: '',
            successMessage: responseData.message,
          });
          setGlobalStore({
            ...globalStore,
            cartCount: editParams.mode === "edit" ? globalStore.cartCount : globalStore.cartCount + 1,
          });
          router.push('/user/cart');
          return
        }
      } catch (error) {
        // Handle any exceptions or network errors
        console.error('API request failed:', error);
        return
      }
    }
    if (editParams.mode === "edit") {
      await sendRequest(`/api/carts/${cartID}/cart_item/${editParams.cart_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalStore.userToken}`,
        }
      })
    }
    //Error handling for selections
    if (productVariations?.COLOUR?.length > 0){
      if (
        !Object.values(productDetailForm.product_variations_items_object).length
      ) {
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: 'please choose your Color and try again',
        });
        return;
      }
    }
    if (
      productDetailForm.branding && Object.values(productDetailForm.product_variations_items_object).length &&
      productDetailForm.uploadYourDesignUrls.length && selectedPrintMethods.length < 0
    ) {
      setProductDetailForm({
        ...productDetailForm,
        errorMessage: 'please choose your "Print Method" and try again',
      });
      return;
    }
    if (
      productDetailForm.branding && !productDetailForm.submitLater &&
      Object.values(productDetailForm.product_variations_items_object).length &&
      productDetailForm.uploadYourDesignUrls.length == 0
    ) {
      setProductDetailForm({
        ...productDetailForm,
        errorMessage: 'Please upload design files and try again',
      });
      return;
    }
    if (
      productDetailForm.quantity <
      productDetails.minimum_order_quantity_number ||
      !productDetailForm.quantity
    ) {
      setProductDetailForm({
        ...productDetailForm,
        errorMessage: `Quantity must be  greater than ${productDetails.minimum_order_quantity_number} `,
      });
      return;
    }
    const isAnyQuantityZero = selectedPrintMethods.some(eachprintmethod => eachprintmethod.quantity === 0);
    console.log(selectedPrintMethods, isAnyQuantityZero)
    if (productDetailForm.branding && (!selectedPrintMethods.length || isAnyQuantityZero)){
      setProductDetailForm({
        ...productDetailForm,
        errorMessage: `Selected Print Method Quantity cannot be 0`,
      });
      return;
    }

    const path = `/api/carts/`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${globalStore.userToken}`,
      },
      body: JSON.stringify({
        product_id: productDetailForm.product_id,
        quantity: parseInt(productDetailForm.quantity),
        additional_comments: productDetailForm.additional_comments,
        price: productDetailForm.totalPrice,
        ...(productDetailForm.product_size_quantity && productDetailForm.product_size_quantity.length && {
          product_size_quantity: productDetailForm.product_size_quantity
        }),
        ...(productVariations?.COLOUR?.length > 0
          && {
            product_variation_item_id: Object.values(
              productDetailForm.product_variations_items_object
            )[0],
          }),
        ...(productDetailForm.branding && {
          product_branding_id: selectedPrintMethods.map(eachprintmethod => ({
            branding_id: eachprintmethod.branding_id,
            quantity: eachprintmethod.quantity
          })),
          is_branding_available: true,
          ...(!productDetailForm.submitLater && {user_product_file_ids: productDetailForm.uploadYourDesignUrls.map(
            (e) => e.id
          ),})
        }),
      }),
    };
    if (!globalStore.userToken) {
      router.push(`/user/login?from=addToCart&id=${productDetails.id}`);
      return;
    }

    try {
      const responseData = await sendRequest(path, options);
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: '',
          successMessage: responseData.message,
        });
        setGlobalStore({
          ...globalStore,
          cartCount: editParams.mode === "edit" ? globalStore.cartCount : globalStore.cartCount + 1,
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const decreaseQuantity = (brandingId) => {
    setSelectedPrintMethods((prev) => {
      const updatedList = prev.map((eachBranding) => {
        if (eachBranding.branding_id === brandingId) {
          const newQuantity = Math.max(0, eachBranding.quantity - 1); // Ensure quantity is at least 0
          return { ...eachBranding, quantity: newQuantity };
        } else {
          return eachBranding;
        }
      });
      return updatedList;
    });
  };

  const increaseQuantity = (brandingId) => {
    console.log("brandingId", brandingId)
    setSelectedPrintMethods((prev) => {
      const updatedList = prev.map((eachBranding) => {
        if (eachBranding.branding_id === brandingId) {
          return { ...eachBranding, quantity: eachBranding.quantity + 1 };
        } else {
          return eachBranding;
        }
      });
      return updatedList;
    });
  };



  const removeSelectedPrintMethod = (branding_id) => {
    setSelectedPrintMethods(selectedPrintMethods.filter(printmethod => printmethod.branding_id !== branding_id))
    setBrandingQuantities((prevQuantities) => ({
      ...prevQuantities,
      [branding_id]: 0,
    }));
    if (currentSelectedPrintMethod?.branding_id === branding_id) {
      setCurrentSelectedPrintMethod(prev => ({
        ...prev,
        quantity: 0
      }))
    }
  }

  return (
    <form action="#" onSubmit={addProductInCart}>
      <div className="lg:px-8 lg:pb-4">
        {isSample && (
          <h3 className='text-black text-lg lg:text-[26px] font-semibold leading-normal'>{productDetails?.name}</h3>
        )}
        {!isSample && (<>
            <h4 className="text-black text-lg lg:text-[22px] font-semibold leading-normal ">
              <span className="mr-2 lg:mr-5 text-gray-600">1</span> Choose your product
            </h4>
            <div className="flex gap-4 mt-2 lg:mt-5 lg:gap-10">
              <div className="flex items-center">
                <label
                  htmlFor="branded"
                  className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                >
                  <input
                    id="branded"
                    type="radio"
                    name="isbranding"
                    checked={productDetailForm.branding}
                    onChange={(e) =>
                      setProductDetailForm({
                        ...productDetailForm,
                        branding: true,
                      })
                    }
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                    <div className="innerColor"></div>
                  </span>

                  <span className="ml-2.5  text-black  text-[18px] font-normal leading-140 tracking-normal">
                    Branded
                  </span>
                </label>
              </div>
              <div className="flex items-center  border-gray-300 ">
                <label
                  htmlFor="unbranded"
                  className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                >
                  <input
                    id="unbranded"
                    type="radio"
                    name="isbranding"
                    checked={!productDetailForm.branding}
                    onChange={(e) =>
                      setProductDetailForm({
                        ...productDetailForm,
                        branding: false,
                      })
                    }
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                    <div className="innerColor"></div>
                  </span>
                  <span className="ml-2.5 text-black  text-[18px] font-normal leading-140 tracking-normal">
                    Unbranded
                  </span>
                </label>
              </div>
            </div>
          </>)}

        {productVariations && (
          <>
            {productVariations?.COLOUR?.length > 0 ? <><h4 className={`text-black text-lg lg:text-[22px] ${isSample ? 'mt-[20px]' : 'mt-4'} font-semibold leading-normal`}>
              <span className="mr-1 lg:mr-5 text-gray-600">{isSample ? "1" :"2"}</span> Choose your
              colors
            </h4>
            <ChooseYourVariations
              productVariations={productVariations}
              productDetailForm={productDetailForm}
              selectedEditOptions={selectedEditOptions}
              isSample={isSample}
              setProductDetailForm={setProductDetailForm}
              handleChangeVariation={(keyName, variationId, color) => {
                setProductStore({colorVariationName: color})
                setProductDetailForm({
                  ...productDetailForm,
                  product_variations_items_object: {
                    ...productDetailForm.product_variations_items_object,
                    [keyName]: variationId
                  }
                });
              }}
              isSizesAvailable = {productVariations?.COLOUR[0]?.sizes.length > 0 ? true : false}
            /></> : (
              <h4 className="text-black text-lg lg:text-[22px] mt-[40px] leading-normal ">
              <span className="mr-1 lg:mr-5 text-gray-600">2</span> Product Available for Order
            </h4>
            )}
          </>
        )}

        {(productDetailForm.branding || isSample) && (
          <>
            {!isSample && <h4 className="flex items-center flex-wrap text-black  text-[22px] mt-4 font-semibold leading-normal text-lg lg:text-[22px]">
              <span className="mr-2 lg:mr-5 text-gray-600">3</span> Upload your designs{' '}
              <div className='flex items-center gap-4'>
                <span className="ml-5 text-gray-500  text-[14px] font-normal leading-normal tracking-normal underline">
                  <Link href="/need-design">Need a design?</Link>
                </span>
                {templateDetails.template_url ? (
                  <>
                    <button
                      type='button'
                      onClick={() => setShowProductTemplate(!showProductTemplate)}
                      className="ml-auto px-3 py-2 bg-[#EAEAEA] text-black text-center text-base font-semibold"
                      href={templateDetails.template_url}
                      target="_self"
                    >
                      Product Template
                    </button>
                    {showProductTemplate && (
                      <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen sm:px-4 text-center">
                          <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
                            aria-hidden="true"
                          ></div>
                          <div className="rounded-lg text-left shadow-xl transform transition-all w-full max-w-3xl overflow-visible">
                            <button onClick={() => setShowProductTemplate(!showProductTemplate)} className={`absolute right-0 -top-4 sm:-right-4 self-end p-2 text-gray-700 hover:bg-amber-200 bg-[#FFCD00] cursor-pointer`}>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                            <div className="">
                              <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                  <iframe
                                    src={templateDetails?.template_url}
                                    style={{
                                      width: '100%',
                                      height: '80vh',
                                    }}
                                  ></iframe>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  ''
                )}
              </div>
            </h4>}
            {/* <p className="flex text-[#53565B] text-center text-[14px] font-normal leading-normal r mt-2.5">
              Maximum file size 10Mb. For best results please upload an EPS
              file.
            </p> */}
            {!isSample && <UploadYourDesigns
              productDetailForm={productDetailForm}
              setProductDetailForm={setProductDetailForm}
              editParams={editParams}
            />}

            <h4 className="flex items-center text-black font-semibold leading-normal text-lg lg:text-[22px]">
              <span className="mr-2 lg:mr-5 text-gray-600">{isSample ? "2" :"4"}</span> {isSample ? "Choose your sample print method" : "Choose your print method / additional costs"}
              {!isSample && <span className="ml-5 text-gray-500  text-[14px] font-normal leading-normal tracking-normal underline">
                <Popover showInfoIcon={true} content={'Your design is applied directly onto the products’ surface by pushing ink through a fine mesh screen. This is one of our most popular decoration methods.'}>
                  <InfoIcon />
                </Popover>
              </span>}
            </h4>
            {isSample ? (
              <span className='text-sm'>
              Note: You can select multiple options to see the print methods or additional products. 
              The selected particular print method product sample may not be available.
            </span>) : (
              <span className='text-sm'>
              How many colours does your design have and based on the product template,
              multiply the position number. e.g. Your design has 4 colours, and based
              on the product template, the print method offering 2 position for the branding
              then 4 (colours) x 2 (position) = 8, so enter 8 in the qty. You can choose multiple
              options based on the product template and some products offering Gift Box also
              as additional cost.
            </span>
            )}
            <div className="grid grid-cols-1 mt-5">
              {/* selected print method */}
              {!isSample && selectedPrintMethods.map((eachmethod, index) =>
                <label
                  key={index}
                  className={`text-black w-full text-start border bg-white`}
                >
                  <span className='flex justify-between items-center px-8 py-4'>
                    <span className='flex flex-col'>
                      <span className='text-base font-semibold'>{eachmethod.name}</span>
                      <span className='text-sm'>{eachmethod.dimensions}</span>
                    </span>
                    <span className='flex items-center gap-2 '>
                      <span className='text-base font-semibold'>Qty</span>
                      <div className="number-input flex items-center border p-1 text-[#53565B]">
                        <input
                          type="button"
                          className={`plus rounded-r-md cursor-pointer`}
                          value={"-"}
                          onClick={() => {
                            decreaseQuantity(eachmethod.branding_id)
                          }}
                        />
                        <input
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setSelectedPrintMethods((prev) => {
                              const updatedList = prev.map((eachBranding) => {
                                if (eachBranding.branding_id === eachmethod.branding_id) {
                                  return { ...eachBranding, quantity: parseInt(inputValue) || 0 };
                                } else {
                                  return eachBranding;
                                }
                              });
                              return updatedList;
                            });
                            setBrandingQuantities((prevQuantities) => ({
                              ...prevQuantities,
                              [eachmethod.branding_id]: parseInt(inputValue) || 0,
                            }));
                            if (currentSelectedPrintMethod?.branding_id === eachmethod.branding_id) {
                              setCurrentSelectedPrintMethod((prev) => ({
                                ...prev,
                                quantity: parseInt(inputValue) || 0,
                              }));
                            }
                          }}
                          type="number"
                          value={(selectedPrintMethods.find((method) => method.branding_id === eachmethod.branding_id)?.quantity).toString()}
                          className="remove-arrow w-5 text-center border-0 appearance-none m-0 focus:outline-none border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="button"
                          className={`plus rounded-r-md cursor-pointer`}
                          value={"+"}
                          onClick={() => {
                            increaseQuantity(eachmethod.branding_id)
                          }}
                        />
                      </div>
                      <svg onClick={() => removeSelectedPrintMethod(eachmethod.branding_id)} className="ml-4 cursor-pointer" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.18 11L4.88 4.88L4.84 6.22L0.36 0.319999H3.14L6.28 4.52H5.22L8.38 0.319999H11.08L6.56 6.22L6.58 4.88L11.26 11H8.44L5.14 6.54L6.18 6.68L2.94 11H0.18Z" fill="#FFC107" />
                      </svg>
                    </span>
                  </span>
                </label>
              )}
              {!isSample && <input type='button'
                className='cursor-pointer border border-transparent hover:border-[#FFCD00] my-4 py-2 px-8 bg-white text-base font-semibold w-fit'
                value={"+ Add"}
                onClick={() => setShowPrintMethods(!showPrintMethods)}
              />}
              {(showPrintMethods && !isSample) && <div className='bg-white min-h-fit mx-auto w-full flex items-center justify-center flex-col'>
                {productDetails.branding_information.map(
                  (eachBrandInfo, index) =>
                    eachBrandInfo.id && (
                      <label
                        key={index}
                        className={`text-black w-full text-start border border-solid cursor-pointer hover:border-yellow-400`}
                      >
                        <span className='flex justify-between items-center pl-8 pr-14 py-4'>
                          <label
                            htmlFor={`branded-${eachBrandInfo.id}`}
                            className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center gap-2"
                          >
                            <input
                              id={`branded-${eachBrandInfo.id}`}
                              onChange={(e) => {
                                e.stopPropagation();
                                console.log("event",e)
                                const brandingId = eachBrandInfo.id;
                                const existingPrintMethodIndex = selectedPrintMethods.findIndex(method => method.branding_id === brandingId);
                                if (existingPrintMethodIndex === -1) {
                                  setSelectedPrintMethods(prev => [...prev, {
                                    branding_id: brandingId,
                                    quantity: brandingQuantities[brandingId] || 0,
                                    name: eachBrandInfo.description,
                                    dimensions: eachBrandInfo.branding_area
                                  }]);
                                }
                                setShowPrintMethods(false)
                              }}
                              hidden
                              type="radio"
                              value={eachBrandInfo.id}
                              checked={selectedPrintMethods.some(eachprintmethod => eachprintmethod.branding_id === eachBrandInfo.id)}
                            />
                            <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                              <div className="innerColor"></div>
                            </span>
                            <span className='flex flex-col'>
                              <span className='flex gap-3 items-center text-base font-semibold'>{eachBrandInfo.description}
                                <Popover content={'The price breakdown to display based on the branded all the columns or unbranded method'}>
                                  <InfoIcon />
                                </Popover>
                              </span>
                              <span className='text-sm'>{eachBrandInfo.branding_area}</span>
                            </span>
                            <span className='text-base font-semibold'></span>
                          </label>
                        </span>
                      </label>
                    )
                )}
              </div>}
              {(isSample) && <div className=' min-h-fit mx-auto w-full lg:pr-10 flex items-center justify-center flex-col'>
                {productDetails.branding_information.map(
                  (eachBrandInfo, index) =>
                    eachBrandInfo.id && (
                      <label
                        key={index}
                        className={`text-black w-full bg-white text-start border border-solid cursor-pointer hover:border-yellow-400`}
                      >
                        <span className='flex justify-between items-center pl-8 pr-14 py-4'>
                          <label
                            htmlFor={`branded-${eachBrandInfo.id}`}
                            className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center gap-2"
                          >
                            <input
                              id={`branded-${eachBrandInfo.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("event",e)
                                const brandingId = eachBrandInfo.id;
                                const existingPrintMethodIndex = selectedPrintMethods.findIndex(method => method.branding_id === brandingId);
                                if (existingPrintMethodIndex === -1) {
                                  setSelectedPrintMethods(prev => [...prev, {
                                    branding_id: brandingId,
                                    quantity: brandingQuantities[brandingId] || 0,
                                    name: eachBrandInfo.branding_solution?.title || eachBrandInfo.description,
                                    dimensions: eachBrandInfo.branding_area
                                  }]);
                                }else{
                                  setSelectedPrintMethods((prev => prev.filter((each) => each.branding_id !== brandingId)))
                                }
                                setShowPrintMethods(false)
                              }}
                              hidden
                              type="radio"
                              value={eachBrandInfo.id}
                              checked={selectedPrintMethods.some(eachprintmethod => eachprintmethod.branding_id === eachBrandInfo.id)}
                            />
                            <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                              <div className="innerColor"></div>
                            </span>
                            <span className='flex flex-col'>
                              <span className='flex gap-3 items-center text-base font-semibold'>{eachBrandInfo.branding_solution ? eachBrandInfo.branding_solution.title : eachBrandInfo.description}
                              </span>
                              <span className='text-sm'>{eachBrandInfo.branding_area}</span>
                            </span>
                            <span className='text-base font-semibold'></span>
                          </label>
                        </span>
                      </label>
                    )
                )}
              </div>}
            </div>
          </>
        )}

        { !isSample && (<textarea
          rows={3}
          onChange={(e) => {
            e.preventDefault()
            setProductDetailForm({
              ...productDetailForm,
              additional_comments: e.target.value
            })
          }}
          value={productDetailForm?.additional_comments || ""}
          placeholder='Position, design or any other requirements'
          className='bg-white p-2 border mt-2 resize-none w-full focus:outline-none focus:border-primary-600'
        />)}
        {!isSample && <h4 className='text-black text-lg lg:text-[22px] mt-4 font-semibold leading-normal'>
          <span className="mr-2 lg:mr-5 text-gray-600">
            {productDetailForm.branding ? "5" : "3"}
          </span>
          {productDetailForm.branding ? "Branded Price Breakdown" : "Unbranded Price Breakdown"}
        </h4>}
        {!productDetailForm.branding && !isSample ? <table className='border bg-white w-full text-sm text-[#53565B]'>
          <tbody>
            <tr className='border-b'>
              <td className='p-3 px-6'>Qty</td>
              {productDetailForm.price_summary && productDetailForm.price_summary.map((value, index) => <td key={index}>{value.quantity}</td>)}

            </tr>
            <tr>
              <td className='p-3 px-6'>Price</td>
              {productDetailForm.price_summary && productDetailForm.price_summary.map((value, index) => <td key={index}>{Math.round((value.price + Number.EPSILON) * 100) / 100}</td>)}
            </tr>
          </tbody>
        </table> : (!isSample && selectedPrintMethods.length > 0 && selectedPrintMethods[0].quantity > 0) ? <table className='border bg-white w-full text-sm text-[#53565B]'>
          <tbody>
            <tr className='border-b'>
              <td className='p-3 px-6'>Qty</td>
              {productDetailForm.price_summary && productDetailForm.price_summary.map((value, index) => <td key={index}>{value.quantity}</td>)}

            </tr>
            <tr>
              <td className='p-3 px-6'>Price</td>
              {productDetailForm.price_summary && productDetailForm.price_summary.map((value, index) => <td key={index}>{Math.round((value.price + Number.EPSILON) * 100) / 100}</td>)}
            </tr>
          </tbody>
        </table> : !isSample && "Please select print methods for price breakdown"}

        {!isSample && < h4 className="text-black text-lg lg:text-[22px] mt-4 font-semibold leading-normal ">
          <span className="mr-2 lg:mr-5 text-gray-600">
            {productDetailForm.branding ? "6" : "4"}
          </span>
          I would like
          <input
            type="number"
            pattern="[0-9]*" // Allow only digits
            id="quanity"
            name="quanity"
            min={0}
            value={productDetailForm?.quantity.toString()}
            disabled = {productVariations?.COLOUR[0]?.sizes.length > 0}
            onChange={(e) => {
              e.preventDefault();
              const inputValue = e.target.value;
              setProductDetailForm({
                ...productDetailForm,
                quantity: parseInt(inputValue) || 0, // Use 0 if the input value is not a valid number
              });
            }}
            className="no-spinners text-[#FFCD00] text-[24px] lg:text-[26px] max-w-[70px] mx-[10px] text-center bg-transparent border-b-2 border-[#FFCD00]"
          />
          Quantity (min: {productDetails.minimum_order_quantity_number})
        </h4>}
      </div>
      {!isSample && 
        (productDetailForm.quantity < productDetails.minimum_order_quantity_number || isNaN(productDetailForm.quantity) || productDetailForm.quantity === '') && (
          <AlertMessage
            name={'error'}
            message={`Minimum Order Quantity : ${productDetails.minimum_order_quantity_number}`}
            linkText={null}
            linkHref={null}
            textColor={'text-red-800'}
            bgColor={'bg-red-50'}
            closeAction={() =>
              setProductDetailForm({
                ...productDetailForm,
                errorMessage: '',
                successMessage: '',
              })
            }
          />
        )
      }
      {!isSample && productDetailForm.product_variations_items_object.COLOUR && productDetailForm.quantity > productVariations.COLOUR.find(each => each.id === productDetailForm.product_variations_items_object.COLOUR).available_quantity && <AlertMessage
        name={'error'}
        message={`Available stock is : ${productVariations.COLOUR.find(each => each.id === productDetailForm.product_variations_items_object.COLOUR).available_quantity}`}
        linkText={null}
        linkHref={null}
        textColor={
          'text-red-800'
        }
        bgColor={'bg-red-50'}
        closeAction={() =>
          setProductDetailForm({
            ...productDetailForm,
            errorMessage: '',
            successMessage: '',
          })
        }
      />}
      {
        (productDetailForm.errorMessage ||
          productDetailForm.successMessage) && (
          <div className="mb-3">
            <AlertMessage
              name={productDetailForm.errorMessage ? 'error' : 'success'}
              message={
                productDetailForm.errorMessage ||
                productDetailForm.successMessage
              }
              linkText={null}
              linkHref={null}
              textColor={
                productDetailForm.errorMessage
                  ? 'text-red-800'
                  : 'text-green-800'
              }
              bgColor={
                productDetailForm.errorMessage ? 'bg-red-50' : 'bg-green-50'
              }
              closeAction={() =>
                setProductDetailForm({
                  ...productDetailForm,
                  errorMessage: '',
                  successMessage: '',
                })
              }
            />
          </div>
        )
      }
      {!isSample && <>
        <div className="bg-white">
          <div className="bg-[#F7F7F7] px-[30px] py-[20px] grow pt-0">
            <p className="text-black  text-base font-normal leading-150 ">
              Lead time is 5 to 7 days after artwork approval and can change based
              on order requirement. For urgent orders call 09 623 6666
            </p>
          </div>
        </div>
      </>}

      {isSample ? (
        <>
          <div className='hidden lg:flex justify-between lg:items-center lg:pl-8'>
            <h1 className='text-[22px] px-5 py-3.5 bg-white font-semibold leading-normal text-black'>
              Qty {selectedPrintMethods.length}
            </h1>
            <div>
              <h1 className='text-[16px] leading-normal text-gray-500'>Unit cost</h1>
              <h1 className='text-[22px] font-semibold leading-normal text-black'>${' '}{selectedPrintMethods.length ? "30.00" : "0.00"} <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span></h1>
            </div>
            <div>
              <h1>Price</h1>
              <h1 className='text-[22px] font-semibold leading-normal text-black'>${' '}{(selectedPrintMethods.length * 30).toFixed(2)} <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span></h1>
            </div>
            <button
              type="submit"
              disabled={selectedPrintMethods.length === 0 || Object.values(productDetailForm.product_variations_items_object).length === 0}
              className={`px-5 py-3.5 w-[150px] ${(selectedPrintMethods.length === 0 || Object.values(productDetailForm.product_variations_items_object).length === 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFCD00] cursor-pointer'} text-black text-center text-base font-semibold leading-normal`}
            >
              Add To Cart
            </button>
          </div>
          <div className='flex lg:hidden flex-col justify-between lg:items-center lg:pl-8'>
            <h1 className='text-[22px] px-5 py-3.5 bg-white font-semibold leading-normal text-black'>
              Qty {selectedPrintMethods.length}
            </h1>
            <div className='flex justify-between'>
              <div>
                <h1 className='text-[16px] leading-normal text-gray-500'>Unit cost</h1>
                <h1 className='text-[22px] font-semibold leading-normal text-black'>${' '}{selectedPrintMethods.length ? "30.00" : "0.00"} <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span></h1>
              </div>
              <div>
                <h1>Price</h1>
                <h1 className='text-[22px] font-semibold leading-normal text-black'>${' '}{(selectedPrintMethods.length * 30).toFixed(2)} <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span></h1>
              </div>
            </div>
            <div className='flex justify-between'>
              <button
                onClick={() => setShowBuySampleModel(false)}
                className="px-5 py-3.5 w-[150px] bg-[#FFCD00] text-black text-center text-base font-semibold leading-normal "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedPrintMethods.length === 0 || Object.values(productDetailForm.product_variations_items_object).length === 0}
                className={`px-5 py-3.5 w-[150px] ${(selectedPrintMethods.length === 0 || Object.values(productDetailForm.product_variations_items_object).length === 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFCD00] cursor-pointer'} text-black text-center text-base font-semibold leading-normal`}
              >
                Add To Cart
              </button>
            </div>
          </div>
          {/* <button
            type="submit"
            className="block lg:hidden px-5 py-3.5 w-[150px] bg-[#FFCD00] text-black text-center text-base font-semibold leading-normal "
          >
            Add To Cart
          </button> */}
        </>
      ) : !productDetailForm.branding ?
      (<div className="bg-[#F7F7F7] lg:bg-white py-6">
        <div>
          <div className="flex justify-between items-end lg:items-start lg:flex-row gap-2">
            <div className="flex flex-col tracking-tighter lg:tracking-normal">
              <p>
                Per Quantity Price:
                <br />
                <span className="font-semibold lg:text-[22px] leading-8">
                  $ {productDetailForm?.price?.toFixed(2)}{' '}
                </span>
                <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span>
              </p>
              <InstaQuoteModal 
                productId={productDetailForm.product_id}
                productDetailForm={productDetailForm}
                selectedPrintMethods={selectedPrintMethods}
                productDetails={productDetails}
                setProductDetailForm={setProductDetailForm}
                productVariationsToCheck = {productVariations}
              />
            </div>
            <div className="flex flex-col tracking-tighter lg:tracking-normal">
              <p>
                Total Quantity Price:
                <br />
                <span className="font-semibold lg:text-[22px] leading-8">
                  $ {productDetailForm?.totalPrice?.toFixed(2)}
                </span>
                <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span>
              </p>
              <button
                type="submit"
                disabled={!globalStore.userId}
                className={`px-7 py-3.5 w-fit lg:w-full ${globalStore.userId ? 'bg-[#FFCD00] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-black text-center text-base font-semibold leading-normal`}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        {!globalStore.userId && <p className='font-semibold text-lg text-red-500'><span className='font-bold mr-2'>Note:</span>Please Login {" "} <Link className="text-blue-500" href="/user/login">
                  here
                </Link>{' '}  to Continue</p>}
        <div className='mt-4'>
          <span className='font-normal text-base'>or make 4 interest-free payments of $12.50 NZD fortnightly with</span>
          <div className='flex items-center mt-4'>
            <Afterpay />
            <span onClick={() => setShowAfterInfoModal(true)} className='cursor-pointer ml-2 underline text-base font-normal'>More Info</span>
            {showAfterInfoModal &&
              <AfterPayInfo
                showAfterInfoModal={showAfterInfoModal}
                setShowAfterInfoModal={setShowAfterInfoModal} />}
          </div>
        </div>
      </div>) : (!isSample && selectedPrintMethods.length > 0 && selectedPrintMethods[0].quantity > 0) ? (<div className="bg-[#F7F7F7] lg:bg-white py-6">
        <div>
          <div className="flex justify-between items-end lg:items-start lg:flex-row gap-2">
            <div className="flex flex-col tracking-tighter lg:tracking-normal">
              <p>
                Per Quantity Price:
                <br />
                <span className="font-semibold lg:text-[22px] leading-8">
                  $ {productDetailForm?.price?.toFixed(2)}{' '}
                </span>
                <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span>
              </p>
              <InstaQuoteModal 
                productId={productDetailForm.product_id}
                productDetailForm={productDetailForm}
                selectedPrintMethods={selectedPrintMethods}
                productDetails={productDetails}
                setProductDetailForm={setProductDetailForm}
                productVariationsToCheck = {productVariations}
              />
            </div>
            <div className="flex flex-col tracking-tighter lg:tracking-normal">
              <p>
                Total Quantity Price:
                <br />
                <span className="font-semibold lg:text-[22px] leading-8">
                  $ {productDetailForm?.totalPrice?.toFixed(2)}
                </span>
                <span className='text-[16px] leading-normal text-gray-500'>excl.GST</span>
              </p>
              <button
                type="submit"
                disabled={!globalStore.userId}
                className={`px-7 py-3.5 w-fit lg:w-full ${globalStore.userId ? 'bg-[#FFCD00] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-black text-center text-base font-semibold leading-normal`}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        {!globalStore.userId && <p className='font-semibold text-lg text-red-500'><span className='font-bold mr-2'>Note:</span>Please Login{" "} <Link className="text-blue-500" href="/user/login">
                  here
                </Link>{' '} to Continue</p>}
        <div className='mt-4'>
          <span className='font-normal text-base'>or make 4 interest-free payments of $12.50 NZD fortnightly with</span>
          <div className='flex items-center mt-4'>
            <Afterpay />
            <span onClick={() => setShowAfterInfoModal(true)} className='cursor-pointer ml-2 underline text-base font-normal'>More Info</span>
            {showAfterInfoModal &&
              <AfterPayInfo
                showAfterInfoModal={showAfterInfoModal}
                setShowAfterInfoModal={setShowAfterInfoModal} />}
          </div>
        </div>
      </div>) : ""}
    </form >
  );
}