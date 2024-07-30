'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Spinner from '../../common/spinner';
import {
  IMAGE_UPLOAD_END_POINT,
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import AlertMessage from '../../common/alert';
import {
  FEATURED_BANNERS_PAGES_ROUTES,
  LARGE_BANNERS_PAGES_ROUTES,
} from '@/constants/admin-pannel/routes';
import Chip from '../../common/chip';
import ProductTable from './productTable';
import Cookies from 'js-cookie';
import Pagination from '../pagiation';

export default function CreateForm({
  createSchema,
  url,
  productsList,
  setProductList,
  successUrl = '',
}) {
  const [creationFormInfo, setCreationInfo] = useState({
    errorMessage: '',
    successMessage: '',
    loading: false,
  });
  const [productsData, setProductsData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [offset, setOffset] = useState(0)

  const handleCreateForm = async (e) => {
    if (productsList.length === 0) {
      e.preventDefault();
      setCreationInfo((prevState) => ({
        ...prevState,
        errorMessage: "Please select a product",
        loading: false,
      }));
    }else{
    setCreationInfo((prevState) => ({ ...prevState, loading: true }));

    e.preventDefault();

    const bodyData = Object.fromEntries(new FormData(e.target));

    if (productsList.length > 0) {
      bodyData["product_ids"] = productsList.map(eachProduct => eachProduct.id)
    }

    // These two fields are requried for only for larger banners and Featured banners
    if (successUrl == FEATURED_BANNERS_PAGES_ROUTES.LIST) {
      bodyData.type = 'FEATURED_BANNER';
    }
    if (successUrl == LARGE_BANNERS_PAGES_ROUTES.LIST) {
      bodyData.type = 'LARGE_BANNER';
    }

    for (const key in bodyData) {
      if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
        if (bodyData[key] === '') {
          delete bodyData[key];
        }
      }
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(bodyData),
    };
    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        setCreationInfo((prevState) => ({
          ...prevState,
          errorMessage: responseData.message,
          loading: false,
        }));
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        window.location.href = successUrl
          ? successUrl
          : '/admin';
      }
    } catch (error) {
      console.error('API request failed:', error);
      setCreationInfo((prevState) => ({ ...prevState, loading: false }));
    }
  }};

  useEffect(() => {
    getProducts(0)
  }, [])

  const getProducts = async(offset) => {
    const { data, count } = await sendRequest(`/api/products/?search=${searchTerm}&offset=${offset}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    )
    setTotalCount(count)
    setProductsData(data)
    setOffset(offset)
  }

  const handleRemove = (id) => {
    const updatedData = productsList.filter(product => product.id !== id);
    setProductList(updatedData)
  }

  const handleAdd = (id) => {
    const addedProduct = productsData.find(product => product.id === id)
    setProductList([...productsList, addedProduct])
  }


  const handleSearch = (e) => {
    e.preventDefault()
    getProducts(0)
  }

  return (
    <>
      <form onSubmit={handleCreateForm} className="flex flex-col gap-6">
        <div className="grid gap-3 md:grid-cols-1">
          {createSchema.map((eachField, index) =>
            eachField.type === 'dropdown' ? (
              <div key={index}>
                <label
                  htmlFor={eachField.name}
                  className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
                >
                  {eachField.name.split('_').join(' ')}
                </label>
                <select
                  id={eachField.name}
                  required={eachField.required}
                  type={eachField.type}
                  name={eachField.name}
                  className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
                >
                  <option value="">Select</option>
                  {eachField.values.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                      {eachValue.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : eachField.type === 'chip' ? (
              <div>
                <label
                  className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
                >
                  {eachField.name.split('_').join(' ')}
                </label>
                <div className='border border-solid border-black pb-[15px] pt-[15px] rounded-lg'>
                  <div className='flex gap-2 ml-[15px] flex-wrap'>
                  {productsList.map((eachProduct, index) => (
                    <Chip key={index} name={eachProduct.name} callback={(id) => handleRemove(id)} id={eachProduct.id}/>
                  ))}
                  </div>
                </div>
              </div>
            ) : (
              <div key={index}>
                <label
                  htmlFor={eachField.name}
                  className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
                >
                  {eachField.name.split('_').join(' ')}
                </label>
                <input
                  className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder={eachField.placeholder}
                  required={eachField.required}
                  type={eachField.type}
                  name={eachField.name}
                  accept="image/*"
                  id={eachField.name}
                  step={0.01}
                />
              </div>
            )
          )}
        </div>
        {creationFormInfo.errorMessage || creationFormInfo.successMessage ? (
          <AlertMessage
            name={creationFormInfo.errorMessage ? 'error' : 'success'}
            message={
              creationFormInfo.errorMessage || creationFormInfo.successMessage
            }
            linkText={null}
            linkHref={null}
            textColor={
              creationFormInfo.errorMessage ? 'text-red-800' : 'text-green-800'
            }
            bgColor={creationFormInfo.errorMessage ? 'bg-red-50' : 'bg-green-50'}
            closeAction={() =>
              setCreationInfo({
                ...creationFormInfo,
                errorMessage: '',
                successMessage: '',
              })
            }
          />
        ) : null}
        <div>
          <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
            {creationFormInfo.loading ? (
              <Spinner bgColor1="white" bgColor2="#851B39" />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
      <ProductTable
        data={productsData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch = {handleSearch}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        selectedProducts={productsList}
      />
      <div className="flex justify-between items-center">
        <Pagination
          total_count={totalCount}
          offsetCount={offset}
          showTextOnly={true}
        />
        <Pagination
          total_count={totalCount}
          offsetCount={offset}
          url={`/admin/home-page/sliders`}
          noRedirect = {true}
          callback = {getProducts}
        />
      </div>
    </>
  );
}
