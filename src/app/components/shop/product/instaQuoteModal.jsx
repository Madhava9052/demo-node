'use client';
import { BlobProvider } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import React, { useState } from 'react';
import Image from 'next/image'
import Cookies from "js-cookie";
import Popover from '../../common/popOver';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';

export default function InstaQuoteModal({ productId,productDetails,productDetailForm,setProductDetailForm,selectedPrintMethods,productVariationsToCheck }) {
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const { globalStore, setGlobalStore } = useGlobalContext();
  const [showInstantQuoteModal, setShowInstantQuoteModal] = useState(false);
  const [PDFData, setPDFData] = useState({});
  const [productVariations, setProductVariation] = useState(null);
  const [selectedColorID, setSelectedColorID] = useState("");
  const [download, setDownload] = useState(false);
  const colorId = productDetailForm.product_variations_items_object["COLOUR"];
  const [colour,setColour] = useState()
  
  
  function camelCaseToNormalCase(str) {
    return str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // remove leading/trailing spaces
        .trim()
        // capitalize the first letter
        .replace(/^\w/, c => c.toUpperCase());
}
   
  const handleClick = async (operation) => {
     if (operation === "getQuote") {
      if (productVariationsToCheck?.COLOUR?.length > 0){if (
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
        productDetailForm?.branding &&
        productDetailForm.uploadYourDesignUrls.length && selectedPrintMethods.length < 0
      ) {
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: 'please choose your "Print Method" and try again',
        });
        return;
      }
      if (
        (productDetailForm?.branding && !productDetailForm?.submitLater) &&
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
      if (isAnyQuantityZero){
        setProductDetailForm({
          ...productDetailForm,
          errorMessage: `Selected Print Method Quantity cannot be 0`,
        });
        return;
      }
      
      try {
        if (colorId){
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}/variation_item/${colorId}/quote/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          }

        });

        if (!response.ok) {
          throw new Error('Failed to fetch PDF data');
        }

        const jsonData = await response.json();
       
        const sortedPrintPrices =jsonData.data.product_price_objects.sort((a, b) => a.quantity - b.quantity);
        const productDetailsForProduct = jsonData.data.product_details;
        setColour(jsonData.data.product_details)
        // console.log(jsonData.data.product_details)
      
        
        // Make an api call

        const path = `/api/orders/instant_code/creation`;
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${globalStore.userToken}`,
          },
          body: JSON.stringify({
            product_id: productDetailForm.product_id,
            quantity: parseInt(productDetailForm.quantity),
            price: productDetailForm.totalPrice,
            ...(productDetailForm.product_size_quantity && productDetailForm.product_size_quantity.length && {
              product_size_quantity: productDetailForm.product_size_quantity
            }),
            ...(productVariationsToCheck?.COLOUR?.length > 0
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
          }
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
            setPDFData((prevState => ({
              ...prevState,
              product_price_objects: sortedPrintPrices,
              product_details: productDetailsForProduct,
    
            })));
          }
        } catch (error) {
          console.error('API request failed:', error);
        }

      }
     
     else{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/pricing_objects/${productId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }

      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF data');
      }

      const jsonData = await response.json();
     
      const sortedPrintPrices =jsonData.data.product_price_objects.sort((a, b) => a.quantity - b.quantity);
      
  
      // Make an api call

      const path = `/api/orders/instant_code/creation`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${globalStore.userToken}`,
        },
        body: JSON.stringify({
          product_id: productDetailForm.product_id,
          quantity: parseInt(productDetailForm.quantity),
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
        }

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
          setPDFData((prevState => ({
            ...prevState,
            product_price_objects: sortedPrintPrices,
    
          })));
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
      
      

    }

     
    } catch (error) {
        console.error('Error fetching PDF data:', error.message);
      }
      setShowQuoteModal(true);
      setShowInstantQuoteModal(true);
    }
  };

  const handlePopupClick = async (e) => {
    e.stopPropagation();
  };
  
  console.log(PDFData,"PDFDATA")
  
  
  return (
    <>
      <button
        type='button'
        disabled={!globalStore.userId}                                                                                                                                                                                       
        onClick={() => handleClick("getQuote")}                                                                                                                                                       
        className={`px-7 py-3.5 w-fit ${globalStore.userId ? 'bg-[#FFCD00] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} lg:w-[190px] text-black text-center text-base font-semibold leading-normal`}

      > 
        Instant Quote
      </button>
      {showInstantQuoteModal && (
        <section onClick={() => { setShowInstantQuoteModal(!showInstantQuoteModal); setShowQuoteModal(false); }} className="fixed top-0 left-0 inline-block w-full overflow-y-auto h-full sm:flex items-center justify-center bg-black bg-opacity-70 z-50">
          {showQuoteModal &&
            <section onClick={handlePopupClick} className="bg-white relative w-full lg:w-[50%] p-4 border-2 rounded-2xl z-40">
              <div className='border border-gray-300 rounded-lg'>
                <div className='h-[50px] border-b border-gray-300 w-full flex items-center justify-between'>
                  <img className="w-[30%]" src='/images/wlb_logo_black.png' />
                  <span className='flex items-center gap-1 mr-1'>
                    <svg fill="#8A1E41" width="22px" height="22px" viewBox="0 0 512 512" id="_66_Instagram" data-name="66 Instagram" xmlns="http://www.w3.org/2000/svg" stroke="#8A1E41"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="Path_86" data-name="Path 86" d="M480,0H32A31.981,31.981,0,0,0,0,32V480a31.981,31.981,0,0,0,32,32H480a31.981,31.981,0,0,0,32-32V32A31.981,31.981,0,0,0,480,0ZM192,256s5.062-64,64-64,64,64,64,64,1.844,64-64,64S192,256,192,256ZM448,448H64V224h68.531a128.013,128.013,0,1,0,246.938,0H448Zm0-288H352V64h96Z" fillRule="evenodd"></path> </g></svg>
                    <svg fill="#8A1E41" width="26px" height="26px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22,3V21a1,1,0,0,1-1,1H15.8V14.255h2.6l.39-3.018H15.8V9.309c0-.874.242-1.469,1.5-1.469h1.6V5.14a21.311,21.311,0,0,0-2.329-.119A3.636,3.636,0,0,0,12.683,9.01v2.227H10.076v3.018h2.607V22H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H21A1,1,0,0,1,22,3Z"></path></g></svg>
                  </span>

                </div>
                <div className=' p-4' >
                {PDFData?.product_details ?(
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <Image src={PDFData?.product_details?.image} alt="producting" width={250} height={238} />
                      <div className="flex flex-col mt-2 w-full mr-4">
                        <div className="flex justify-between items-center py-2 border-b-2">
                          {/* <span className="font-bold text-xl">{PDFData?.product_details?.name}</span> */}
                          <span className="float-right text-sm font-semibold text-[#8A1E41]">{PDFData?.product_details?.internal_code}</span>
                        </div>
                        <p className="font-bold text-xl pt-2">{PDFData?.product_details?.name}</p>
                        <p className="mt-4 text-base">{PDFData?.product_details?.description}</p>
                      </div>
                    </div>):
                    (
                      <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <Image src={productDetails?.images[0].url} alt="producting" width={250} height={238} />
                      <div className="flex flex-col mt-2 w-full mr-4">
                        <div className="flex justify-between items-center py-2 border-b-2">
                          {/* <span className="font-bold text-xl">{PDFData?.product_details?.name}</span> */}
                          <span className="float-right text-sm font-semibold text-[#8A1E41]">{productDetails?.internal_code}</span>
                        </div>
                        <p className="font-bold text-xl pt-2">{productDetails?.name}</p>
                        <p className="mt-4 text-base">{productDetails?.long_description}</p>
                      </div>
                    </div> 
                    )
                  }
                  <div className='flex flex-row w-full justify-between bg-[#F7F7F7] p-4'>




                  <div className='flex flex-col w-[50%]' >
                  <p className="pb-3">Product Type  - <span className='font-bold'>{productDetailForm.branding ? "Branded" : "unBranded"}</span></p>
                  <p className="pb-3">
                          {colour?.colour && "Product Color - "}
                          <span className='font-bold'>{colour?.colour}</span>
                  </p>
                  {(productDetailForm.branding && selectedPrintMethods.length>0)&&                                                                                           
                   <div className="pb-3">
                  <p>Print Method/Additional Cost</p>
                  <div className='flex flex-col'>
                  
                  {selectedPrintMethods.map((each, index) => (
                                          <div key={index}>
                                          <p className='font-bold'>{each.name} - Unit <span>{each.quantity}</span></p>
                                          <p>{each.dimensions}</p>
                                          </div>
                  ))}
                 
                  </div>
                 
                  </div>
                   }
                 {(productDetailForm.branding && productDetailForm.uploadYourDesignUrls.length > 0) &&<div className='flex flex-row'>
                  <p>Print File - </p>
                  {productDetailForm.uploadYourDesignUrls.map((each, index) => (
                                          
                                             <span key={index} className='font-bold'>{each.name}&nbsp;</span>
                                  
                                          ))}
                  </div>
                      }
                 



                  </div>
                  <div className='flex flex-col w-[30%]'>
                          <div className='flex flex-row justify-between pb-3'>
                              <p >Qty: </p>      
                              <p className='font-bold'>  {productDetailForm.quantity}</p>
                          </div>
                          <div className='flex flex-row justify-between pb-3'>
                              <p >Unit Price:</p>      
                              <p className='font-bold'> ${productDetailForm.price.toFixed(2)}</p>
                          </div>
                          <div className='flex flex-row justify-between pb-3 '>
                              <p>Total:</p>      
                              <p className='text-[#8A1E41] font-bold'>${productDetailForm.totalPrice.toFixed(2)}</p>
                         </div>
                  </div>
                  <div>
                  </div>

                  </div>
                  <div className="mx-auto w-full overflow-auto mt-3 border  ">
                    <table className="table-auto w-full text-sm text-left text-gray-500 overflow-x-scroll ">
                      {PDFData?.product_price_objects && (
                        <>
                          <thead>
                            {/* <tr className="text-center border-b-2 bg-[#8A1E41] text-white">
                              <th className="px-6 py-3 font-semibold" colSpan="7">{`${PDFData?.product_details?.internal_code || " "} - ${PDFData?.product_details?.name || " "}`}</th>
                            </tr> */}
                            {PDFData.product_price_objects && PDFData.product_price_objects.length > 0 && (
                              <tr className="text-xs  text-black border-b-2 uppercase">
                                <td className="px-6 py-3">Qty</td>
                                {PDFData.product_price_objects.map(({ quantity }, index) => (
                                  <td key={index} className="px-6 py-3 font-Montserrat text-black">{quantity}</td>
                                ))}
                              </tr>
                            )}
                          </thead>
                          <tbody className="bg-white">
                            {PDFData.product_price_objects && PDFData.product_price_objects.length > 0 && (
                              <>
                                <tr className="border-b-2">
                                  <td className="px-6 py-4">Price (unit)</td>
                                  {PDFData.product_price_objects.map(({ price }, index) => (
                                    <td key={index} className="px-6 py-4 font-Montserrat text-black">{price.toFixed(2)}</td>
                                  ))}
                                </tr>
                                <tr className="border-b-2">
                                  <td className="px-6 py-4">Price (subtotal)</td>
                                  {PDFData.product_price_objects.map(({ price, quantity }, index) => (
                                    <td key={index} className="px-6 py-4 font-Montserrat text-black">${(price * quantity).toFixed(2)}</td>
                                  ))}
                                </tr>
                              </>
                            )}
                          </tbody>
                        </>
                      )}
                    </table>
                  </div>
                 
                  </div>
                  <hr className=' border-1 border-gray-300' />
                  <div className='rounded-lg w-full  flex flex-col pl-2 mb-3 mt-3'>
                    <span className='text-sm text-gray-500 '>Note: All prices exclude GST, processing fees and shipping costs</span>
                    <span className='text-sm text-gray-500'>Shipping cost - $15 NZ wide and above $500 FREE SHIPPING.</span>
                    <span className='text-sm text-gray-500'>If you have any questions, email info@welovebranding.co.nz or contact us at 09 623 6666</span>
                    
                  </div>
                
                <div className='flex justify-between gap-4 m-4'>
                <button
                  onClick={() => setShowInstantQuoteModal(!showInstantQuoteModal)}
                  type="button"
                  data-modal-hide="default-modal"
                  className="px-7 py-3.5 bg-[#FFCD00] w-[103px] text-black text-center text-base font-semibold mt-3">
                  Close
                </button>
                <BlobProvider document={<InvoicePDF PDFData={PDFData} productDetails={productDetails} productId={productDetailForm.product_id} productDetailForm={productDetailForm} setProductDetailForm={setProductDetailForm} selectedPrintMethods={selectedPrintMethods} />} filename="Instant Quote.pdf">
                  {({ url }) => {
                    if (download) {
                      setDownload(false);
                      window.open(url, '_blank');
                    }
                    return (
                      <div className='flex items-center justify-center '>
                        <button type="button" className="px-7  py-3.5 bg-[#FFCD00] w-[184px] text-black text-center text-base font-semibold mt-3" onClick={() => setDownload(true)}>
                          Download PDF
                        </button>
                      </div>
                    );
                  }}
                </BlobProvider>
              </div>
              </div>
              
            </section>
          }
        </section>
      )}
    </>
  );
}