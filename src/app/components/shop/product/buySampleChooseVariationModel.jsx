'use client';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import AlertMessage from '../../common/alert';
import Popover from '../../common/popOver';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/context/store';
import ProductForm from './product-detail/productForm';

function BuySampleChooseVariationModel({ productId, productVariations, searchParams, productDetails, templateDetails, priceCalculatorData}) {
  const router = useRouter();
  const { globalStore, setGlobalStore } = useGlobalContext(); // Access global context
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [selectedColorID, setSelectedColorID] = useState('');
  const [showBuySampleModel, setShowBuySampleModel] = useState(false);
  const [buySampleForm, setbuySampleForm] = useState({
    errorMessage: '',
    successMessage: '',
  });

  function camelCaseToNormalCase(str) {
    return (
      str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // remove leading/trailing spaces
        .trim()
        // capitalize the first letter
        .replace(/^\w/, (c) => c.toUpperCase())
    );
  }

  const handleClick = async (operation) => {
    if (operation === 'selectVariation') {
      setSelectedColorID(null);
      setShowBuySampleModel(true);
    }
  };

  const handlePopupClick = async (e) => {
    e.stopPropagation();
  };

  

  return (
    <div>
      <button
        onClick={() => handleClick('selectVariation')}
        className="disabled:cursor-not-allowed w-full px-7 py-3.5 bg-[#FFCD00] disabled:opacity-60 text-black text-center text-base font-semibold leading-normal "
      >
        Order Sample
      </button>
      {productVariations && showBuySampleModel && (
        <section
          onClick={() => setShowBuySampleModel(!showBuySampleModel)}
          className="fixed top-0 left-0 inline-block w-full overflow-y-auto h-full sm:flex items-center justify-center bg-black bg-opacity-70 z-50"
        >
          <div onClick={handlePopupClick} className='grow w-full lg:max-w-[676px]'>
            <div className='bg-[#F7F7F7] mt-4 p-6'>
              {productVariations && (
                <ProductForm
                  editParams={searchParams}
                  productDetails={productDetails}
                  productVariations={productVariations}
                  templateDetails={templateDetails}
                  priceCalculatorData={priceCalculatorData}
                  isSample={true}
                  setShowBuySampleModel={setShowBuySampleModel}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default BuySampleChooseVariationModel;
