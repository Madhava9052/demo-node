'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useState } from 'react';
import Spinner from '../../common/spinner';
import { VENDORS_PAGE_ROUTES } from '@/constants/admin-pannel/routes';

import {
  IMAGE_UPLOAD_END_POINT,
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import AlertMessage from '../../common/alert';
import {
  FEATURED_BANNERS_PAGES_ROUTES,
  LARGE_BANNERS_PAGES_ROUTES,
} from '@/constants/admin-pannel/routes';
import { useSearchParams } from 'next/navigation';

export default function CreateForm({
  createSchema,
  url,
  imageKey = 'image_url',
  successUrl = '',
  imagePathUrl = '',
}) {
  const searchParams = useSearchParams();
  const [creationFormInfo, setCreationInfo] = useState({
    errorMessage: '',
    successMessage: '',
    loading: false,
  });
  const [imgUrl, setUrl] = useState();

  const handleCreateForm = async (e) => {
    setCreationInfo((prevState) => ({ ...prevState, loading: true }));

    e.preventDefault();

    const bodyData = Object.fromEntries(new FormData(e.target));
    if (imgUrl) {
      bodyData[imageKey] = imgUrl;
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
        window.location.href = searchParams.get("from") === "vendor" ? VENDORS_PAGE_ROUTES.CREATE : successUrl
          ? successUrl
          : '/admin';
      }
    } catch (error) {
      console.error('API request failed:', error);
      setCreationInfo((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleUploadToServer = async (event) => {
    let fileName = '';
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      fileName = event.target.files[0].name;

      const path = replaceParams(IMAGE_UPLOAD_END_POINT, {
        path: imagePathUrl,
      });
      // Upload the image to the server and wait for the response
      const responseData = await uploadToServer(event, path);

      // Check if the server response indicates success
      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setUrl(responseData.data.urls[0]);
      }
    }
  };
  return (
    <form onSubmit={handleCreateForm} className="flex flex-col gap-6">
      <div className="grid gap-3 md:grid-cols-1">
        {createSchema.map((eachField, index) =>
          eachField.type === 'dropdown' ? (
            <div key={index}>
              <label
                htmlFor={eachField.name}
                className="block mb-2 text-sm font-medium mt-[20px] capitalize"
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
          ) : eachField.type === 'file' ? (
            <div key={index} className="flex items-center gap-4 mt-[20px]">
              {imgUrl && (
                <div className="flex flex-col items-center gap-1">
                  <small>Recent image</small>
                  <img src={imgUrl} className="w-24 h-24" />
                  <Link
                    target="_blank"
                    className="text-[14px] text-blue-400"
                    href={imgUrl}
                  >
                    View
                  </Link>
                </div>
              )}
              <div className="grow">
                <label
                  htmlFor={eachField.name}
                  className="block mb-2 text-sm font-medium capitalize"
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
                  defaultValue={eachField.value}
                  onChange={handleUploadToServer}
                />
              </div>
            </div>
          ) : (
            <div key={index}>
              <label
                htmlFor={eachField.name}
                className="block mb-2 text-sm font-medium mt-[20px] capitalize"
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
  );
}
