'use client';
import React, { Fragment, useState } from 'react';
import AlertMessage from '../../common/alert';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import BuySampleChooseVariationModel from './buySampleChooseVariationModel';

export default function BuySampleModal({
  companyData,
  productDetails,
  productVariations,
  productId,
  editParams,
  templateDetails,
  priceCalculatorData
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [buySampleForm, setbuySampleForm] = useState({
    product_id: productDetails.id,
    product_variation_item_id: '',
    product_variation_item_array: [],
    product_variations_items_object: {},
    errorMessage: '',
    successMessage: '',
  });
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBuyOrderSample = async () => {
    
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-7 py-3.5 bg-[#FFCD00] w-full xl:w-[190px] text-whit text-center text-base font-semibold leading-normal "
      >
        Buy Sample
      </button>

      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          onClick={closeModal}
          className="fixed top-0 bg-[#00000033] no-scrollbar right-0 z-30 w-full overflow-y-auto md:inset-0 h-full"
        >

          <div className="relative ml-auto w-full max-w-md z-40">
            <button
              onClick={closeModal}
              type="button"
              className="absolute top-5 -left-4 text-black bg-[#FFCD00] hover:text-gray-900 text-sm w-10 h-10 ml-auto inline-flex justify-center items-center z-40"
              data-modal-hide="authentication-modal"
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
            <div onClick={e => e.stopPropagation()} className="relative bg-white h-full shadow overflow-y-auto">

              <header className="bg-[#F7F7F7] text-start font-semibold px-6 lg:pl-10 py-6 text-[22px] lg:px-8">
                Buy sample
              </header>
              <div className="p-10">
                <h4
                  className="text-black  text-[18px] font-semibold leading-normal tracking-normal
"
                >
                  Physical sample
                </h4>
                <p
                  className="mt-4 mb-8 text-gray-500  text-[16px] font-normal leading-[140%] tracking-normal
"
                >
                  This &quot;physical&quot; sample will not have your printed
                  design on it. Instead, it will either be a sample of the
                  product with a pre-selected design or no design included so
                  that you are able to see the product quality.
                </p>
                <div className="mb-2">
                  {(buySampleForm.errorMessage ||
                    buySampleForm.successMessage) && (
                      <AlertMessage
                        name={buySampleForm.errorMessage ? 'error' : 'success'}
                        message={
                          buySampleForm.errorMessage ||
                          buySampleForm.successMessage
                        }
                        linkText={null}
                        linkHref={null}
                        textColor={
                          buySampleForm.errorMessage
                            ? 'text-red-800'
                            : 'text-green-800'
                        }
                        bgColor={
                          buySampleForm.errorMessage ? 'bg-red-50' : 'bg-green-50'
                        }
                        closeAction={() =>
                          setbuySampleForm({
                            ...buySampleForm,
                            errorMessage: '',
                            successMessage: '',
                          })
                        }
                      />
                    )}
                </div>
                {/* <button
                  onClick={handleBuyOrderSample}
                  className="disabled:cursor-not-allowed w-full px-7 py-3.5 bg-[#FFCD00] disabled:opacity-60 text-black text-center text-base font-semibold leading-normal "
                >
                  Order Sample
                </button> */}
                <BuySampleChooseVariationModel productVariations={productVariations} productId={productId} editParams={editParams} productDetails={productDetails} templateDetails={templateDetails} priceCalculatorData={priceCalculatorData} />
              </div>
              <hr className="border-t border-gray-200 h-1 w-full" />
              <div className="p-10">
                <h4 className="text-black  text-[18px] font-semibold leading-normal tracking-normal">
                  Instore sample
                </h4>
                <p className="mt-4 mb-8 text-gray-500  text-[16px] font-normal leading-[140%] tracking-normal">
                  Contact us or visit our store to check samples on display
                </p>

                <ul className="text-black font-montserrat text-base leading-normal tracking-normal bg-[#F7F7F7] p-8 mt-5 flex flex-col gap-5">
                  <li>
                    <span>
                      {
                        companyData?.information[0]?.address[
                        Object.keys(companyData?.information[0]?.address)[0]
                        ]
                      }
                    </span>
                  </li>
                  <li>
                    {' '}
                    <span>{companyData?.information[0]?.number?.number}</span>
                  </li>
                  <li>
                    {' '}
                    <span>{companyData?.information[0]?.email?.email}</span>
                  </li>
                  <li>
                    <span>
                      {Object.keys(
                        companyData?.information[0]?.working_hours
                      ).map((eachKey, index) => (
                        <Fragment key={index}>
                          <b>{eachKey} : </b>
                          {
                            companyData?.information[0]?.working_hours[eachKey]
                          }{' '}
                          <br />
                        </Fragment>
                      ))}
                    </span>
                  </li>
                </ul>
                <Link
                  href={"/pages/contact"}
                >
                  <button className="mt-8 px-7 cursor-pointer py-3.5 bg-[#FFCD00] w-full text-black text-center text-base font-semibold leading-normal ">Contact Us</button>

                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
