import React from 'react';
import BuySampleModal from '@/app/components/shop/product/buySampleModal';
import ProductDescription from '@/app/components/shop/product/product-detail/productDescription';
import ProductForm from '@/app/components/shop/product/product-detail/productForm';
import ProductImageGallery from '@/app/components/shop/product/productImages';

import ProductTabs from '@/app/components/shop/product/productTabs';
import { COMPANY_DATA_END_POINT } from '@/constants/admin-pannel/end-points';
import { sendRequest } from '@/helpers/utils';
import Link from 'next/link';

export const metadata = {
  title: 'We Love Branding',
  description:
    'We have been branding all manner of products for over 12 years and in this time have grown from our humble roots into one of the top print suppliers for many SME’s in New Zealand',
};

export default async function ProductPage({ params, searchParams }) {
  const productId = params.id[params.id.length - 1];
  const [
    { data: productDetails = {} },
    { data: productVariations = {} },
    { data: templateDetails = {} },
    { data: companyData = {} },
    { data: topProducts },
    { data: priceCalculatorData },
  ] = await Promise.all([
    sendRequest(`/api/products/${productId}/`),
    sendRequest(`/api/products/${productId}/variations/`),
    sendRequest(`/api/products/${productId}/template/`),
    sendRequest(COMPANY_DATA_END_POINT),
    sendRequest('/api/products/?type=TOP'),
    sendRequest(`/api/products/${productId}/price`),
  ]);

  return (
    <div className="px-2 lg:px-[50px] xl:px-0 lg:container flex flex-col justify-center mx-auto">
      <div className="flex justify-between items-center gap-1">
        <p className="mt-2 lg:mt-[40px] text-gray-500 text-xs lg:text-base font-normal leading-normal tracking-normal">
          <Link href="/"><span className='hover:text-[#FFCD00] hover:font-medium'> Home{' '}/ {' '}</span></Link>
          {/* {params.id.map((item, index) => (
            <Link key={item} href={searchParams.categoryId ? `/category/${item}/${searchParams.categoryId}` : searchParams.ishome === "true" ? "/" : ``}>
              <span
                key={item}
                className={`breadcrumb-item capitalize hover:text-[#FFCD00] ${index === params.id.length - 1
                  ? 'text-[#FFCD00] font-semibold capitalize hover:cursor-auto'
                  : ''
                  }`}
              >
                {' '}
                {' '}
                {index === params.id.length - 1
                  ? <><Link key={item} href={`/category/${(productDetails?.categories_data_information?.name).toLowerCase()}/${productDetails?.categories_data_information?.id}`}>{productDetails?.categories_data_information?.name}</Link>{' '}/{' '}<Link key={item} href={`/category/${(productDetails?.sub_categories_data_information?.name).toLowerCase()}/${productDetails?.sub_categories_data_information?.id}`}>{productDetails?.sub_categories_data_information?.name}</Link>{' '}/{' '}<button disabled> {productDetails?.name} </button></>
                  : ""}
              </span>
            </Link>
            
          ))} */}
          <><Link className='hover:text-[#FFCD00]' href={`/category/${(productDetails?.categories_data_information?.name).toLowerCase()}/${productDetails?.categories_data_information?.id}`}><span>{productDetails?.categories_data_information?.name}</span></Link>{' '}/{' '}<Link className='hover:text-[#FFCD00]'  href={`/category/${(productDetails?.sub_categories_data_information?.name).toLowerCase()}/${productDetails?.sub_categories_data_information?.id}`}><span>{productDetails?.sub_categories_data_information?.name}</span></Link>{' '}/{' '}<button  className='text-[#FFCD00]'> {productDetails?.name} </button></>
          
        </p>
        <p className="mt-2 lg:mt-[40px] text-xs tracking-tighter lg:tracking-normal lg:text-xl font-semibold text-[#8A1E41]">
          {productDetails?.internal_code}
        </p>
      </div>
      <div className="mt-3 flex flex-col lg:flex-row items-center justify-between xl:gap-36 lg:items-start">
        <ProductImageGallery productDetails={productDetails}  />
        <div className="grow w-full lg:max-w-[676px]">
          <div className="bg-[#F7F7F7] mt-4 p-2 lg:p-0 lg:pt-10">
            <div className="flex flex-col xl:flex-row items-start gap-4 lg:gap-12 lg:px-8">
              <div className="grow">
                <h3 className="text-black text-lg lg:text-[26px] font-semibold">
                  {productDetails?.name}
                </h3>
                <ProductDescription
                  description={productDetails?.long_description}
                />
              </div>
              <div className="flex flex-col mx-auto lg:mx-0 gap-y-2.5">
                <BuySampleModal
                  companyData={companyData}
                  productVariations={productVariations}
                  productDetails={productDetails}
                  productId = {productId}
                  editParams={searchParams}
                  templateDetails={templateDetails}
                  priceCalculatorData={priceCalculatorData}
                />
              </div>
            </div>

            <hr className="border-t my-4 lg:my-[30px] border-gray-200 h-1 w-full" />
            <ProductForm
              editParams={searchParams}
              productDetails={productDetails}
              productVariations={productVariations}
              templateDetails={templateDetails}
              priceCalculatorData={priceCalculatorData}
            />
          </div>
        </div>
      </div>
      <ProductTabs productDetails={productDetails} templateDetails={templateDetails}/>
    </div>
  );
}
