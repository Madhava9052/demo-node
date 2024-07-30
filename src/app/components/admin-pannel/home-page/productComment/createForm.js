'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  IMAGE_UPLOAD_END_POINT,
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import {
  FEATURED_BANNERS_PAGES_ROUTES,
  LARGE_BANNERS_PAGES_ROUTES,
} from '@/constants/admin-pannel/routes';
import Cookies from 'js-cookie';
import ProductTable from '../../collection/productTable';
import Spinner from '@/app/components/common/spinner';
import AlertMessage from '@/app/components/common/alert';
import Chip from '@/app/components/common/chip';
import Pagination from '../../pagiation';
import UserTable from './userTable';

export default function CreateForm({
  url,
  successUrl = '',
}) {
  const [creationFormInfo, setCreationInfo] = useState({
    errorMessage: '',
    successMessage: '',
    loading: false,
  });
  const [productsData, setProductsData] = useState([])
  const [productsList, setProductList] = useState([])
  const [userList, setUserList] = useState([])
  const [userData, setUserData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalUserCount, setTotalUserCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [offset, setOffset] = useState(0)
  const [userOffset, setUserOffset] = useState(0)
  const [renderType, setRenderType] = useState("product")

  const RenderProductsList = () => {
    switch (renderType) {
      case "product":
        return(
          <>
            <div>
              <label
                className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
              >
                {"Select One Product"}
              </label>
              <div className='border border-solid border-black pb-[15px] pt-[15px] rounded-lg'>
                <div className='flex gap-2 ml-[15px] flex-wrap'>
                {productsList.map((eachProduct, index) => (
                  <Chip key={index} name={eachProduct.name} callback={(id) => handleRemove(id)} id={eachProduct.id}/>
                ))}
                </div>
              </div>
            </div>
          </>
        )
      case "user":
        return(
          <>
            <div>
              <label
                className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
              >
                {"Select One User"}
              </label>
              <div className='border border-solid border-black pb-[15px] pt-[15px] rounded-lg'>
                <div className='flex gap-2 ml-[15px] flex-wrap'>
                {userList.map((eachUser, index) => (
                  <Chip key={index} name={eachUser.first_name + " " + eachUser.last_name} callback={(id) => handleRemove(id)} id={eachUser.id}/>
                ))}
                </div>
              </div>
            </div>
          </>
        )
      default:
        const selectedValues = {
          user: userList[0].first_name + ' ' + userList[0].last_name,
          product: productsList[0].name
        }
        return(
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">
                      Keys
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Values
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(selectedValues).map(
                    (eachKey, index) =>
                      (
                        <tr className="bg-white dark:bg-gray-800" key={index}>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                          >
                            {eachKey.split('_').join(' ')}
                          </th>
                          <td className="px-6 py-4">
                            {selectedValues[eachKey]}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <label
                htmlFor={"review"}
                className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
              >
                {"Review"}
              </label>
              <textarea
                className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder={"Please provide review about the product"}
                rows={5}
                required={true}
                name={"review"}
                id={"review"}
              />
            </div>
            <div>
              <label
                htmlFor={"rating"}
                className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
              >
                {"Rating"}
              </label>
              <input
                className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder={"Please provide rating between 1 and 5"}
                max={5}
                min={1}
                required={true}
                type={"number"}
                name={"rating"}
                id={"rating"}
              />
            </div>
          </>
        )
    }
  }

  const handleSubmit = async(e) => {
    const bodyData = Object.fromEntries(new FormData(e.target));

    if (productsList.length > 0) {
      bodyData["product_id"] = productsList[0].id;
    }

    if (userList.length > 0) {
      bodyData["user_id"] = userList[0].id;
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
  }

  const handleCreateForm = async (e) => {
    setCreationInfo((prevState) => ({ ...prevState, loading: true }));

    e.preventDefault();

    switch (renderType) {
      case "product":
        if (productsList.length === 0) {
          setCreationInfo((prevState) => ({
            ...prevState,
            errorMessage: "Please select a product",
            loading: false,
          }));
        }else{
          setCreationInfo((prevState) => ({
            ...prevState,
            errorMessage: "",
            loading: false,
          }));
          setRenderType("user")
        }
        break;
      case "user":
        if (userList.length === 0) {
          setCreationInfo((prevState) => ({
            ...prevState,
            errorMessage: "Please select one User",
            loading: false,
          }));
        }else{
          setCreationInfo((prevState) => ({
            ...prevState,
            errorMessage: "",
            loading: false,
          }));
          setRenderType("form")
        }
        break;
      default:
        handleSubmit(e)
        break;
    }};

  useEffect(() => {
    getProducts(0)
    getUsers(0)
  }, [])

  const getProducts = async(offset) => {
    setProductsData(null)
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

  const getUsers = async(offset) => {
    setUserData(null)
    const { data, total_count } = await sendRequest(`/api/users/?search=${userSearchTerm}&offset=${offset}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    )
    setTotalUserCount(total_count)
    setUserData(data)
    setUserOffset(offset)
  }

  const handleRemove = (id) => {
  }

  const handleAdd = (id) => {
    if (renderType === "product") {
      const addedProduct = productsData.find(product => product.id === id)
      setProductList([addedProduct])
    }else{
      const addedUser = userData.find(user => user.id === id)
      setUserList([addedUser])
    }
  }


  const handleSearch = (e) => {
    e.preventDefault()
    renderType === "product" ? getProducts(0) : getUsers(0)
  }

  return (
    <>
      <form onSubmit={handleCreateForm} className="flex flex-col gap-6">
        <div className="grid gap-3 md:grid-cols-1">
          {<RenderProductsList/>}
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
        <div className='flex justify-end align-center'>
          <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
            {creationFormInfo.loading ? (
              <Spinner bgColor1="white" bgColor2="#851B39" />
            ) : (
              renderType === "form" ? 'Submit' : "Next"
            )}
          </button>
        </div>
      </form>
      {renderType === "product" && <>
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
            url={`/admin/home-page/product-comments`}
            noRedirect = {true}
            callback = {getProducts}
          />
        </div>
      </>}
      {renderType === "user" && <>
        <UserTable
          data={userData}
          searchTerm={userSearchTerm}
          setSearchTerm={setUserSearchTerm}
          handleSearch = {handleSearch}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          selectedProducts={userList}
        />
        <div className="flex justify-between items-center">
          <Pagination
            total_count={totalUserCount}
            offsetCount={userOffset}
            showTextOnly={true}
          />
          <Pagination
            total_count={totalUserCount}
            offsetCount={userOffset}
            url={`/admin/home-page/product-comments`}
            noRedirect = {true}
            callback = {getUsers}
          />
        </div>
      </>}
    </>
  );
}
