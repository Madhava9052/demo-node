'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Spinner from '../../common/spinner';
import AlertMessage from '../../common/alert';
import {
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import Pagination from '../pagiation';
import ProductTable from './productTable';
import Chip from '../../common/chip';

export default function EditForm({
  editSchema,
  url,
  successUrl,
  selectedProducts
}) {

  const [editingFormInfo, setEditingInfo] = useState({
    errorMessage: '',
    successMessage: '',
    loading: false,
  });

  const [productsData, setProductsData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [offset, setOffset] = useState(0)
  const [productsList, setProductList] = useState(selectedProducts ? selectedProducts : [])
  const [productsBody, setProductBody] = useState({
    added_product_ids: [],
    removed_product_ids: []
  })

  const handleEditForm = async (e) => {
    setEditingInfo((prevState) => ({ ...prevState, loading: true }));

    e.preventDefault();

    const bodyData = Object.fromEntries(new FormData(e.target));

    bodyData["added_product_ids"] = productsBody.added_product_ids
    bodyData["removed_product_ids"] = productsBody.removed_product_ids

    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(bodyData),
    };
    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        setEditingInfo((prevState) => ({
          ...prevState,
          errorMessage: responseData.message,
          loading: false,
        }));
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setEditingInfo((prevState) => ({
          ...prevState,
          successMessage: responseData.message,
          loading: false,
        }));

        window.location.href = successUrl
          ? successUrl
          : '/admin';
      }
    } catch (error) {
      setEditingInfo((prevState) => ({ ...prevState, loading: false }));

      console.error('API request failed:', error);
    }
  };

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
    setProductBody({...productsBody, removed_product_ids: [...productsBody.removed_product_ids, id]});
  }

  const handleAdd = (id) => {
    const addedProduct = productsData.find(product => product.id === id)
    setProductList([...productsList, addedProduct])
    setProductBody({...productsBody, added_product_ids: [...productsBody.added_product_ids, id]});
  }


  const handleSearch = (e) => {
    e.preventDefault()
    getProducts(0)
  }

  return (
    <>
      <form onSubmit={handleEditForm} className="flex flex-col gap-6">
        <div className="grid gap-3 md:grid-cols-1">
          {editSchema.map((eachField, index) =>
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
                  defaultValue={eachField.value}
                  className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm block w-full"
                >
                  {/* <option defaultValue={eachField.value}>
                  {eachField.value}
                </option> */}
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
                  id={eachField.name}
                  step={0.01}
                  defaultValue={eachField.value}
                />
              </div>
            )
          )}
        </div>
        {editingFormInfo.errorMessage || editingFormInfo.successMessage ? (
          <AlertMessage
            name={editingFormInfo.errorMessage ? 'error' : 'success'}
            message={
              editingFormInfo.errorMessage || editingFormInfo.successMessage
            }
            linkText={null}
            linkHref={null}
            textColor={
              editingFormInfo.errorMessage ? 'text-red-800' : 'text-green-800'
            }
            bgColor={editingFormInfo.errorMessage ? 'bg-red-50' : 'bg-green-50'}
            closeAction={() =>
              setEditingInfo({
                ...editingFormInfo,
                errorMessage: '',
                successMessage: '',
              })
            }
          />
        ) : null}
        <div>
          <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
            {editingFormInfo.loading ? (
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
