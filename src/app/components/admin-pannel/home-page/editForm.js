'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useState } from 'react';
import Spinner from '../../common/spinner';
import AlertMessage from '../../common/alert';
import EditUploadImage from './editImageInEditForm';
import {
  IMAGE_UPLOAD_END_POINT,
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import { COMPANY_PAGES_ROUTES } from '@/constants/admin-pannel/routes';

export default function EditForm({
  editSchema,
  url,
  successUrl,
  imagePathUrl,
  imageKey = "image_url"
}) {
  const [imgUrl, setUrl] = useState();

  const [editingFormInfo, setEditingInfo] = useState({
    errorMessage: '',
    successMessage: '',
    loading: false,
  });

  const handleEditForm = async (e) => {
    setEditingInfo((prevState) => ({ ...prevState, loading: true }));

    e.preventDefault();

    const bodyData = Object.fromEntries(new FormData(e.target));

    if (imgUrl) {
      if (successUrl == COMPANY_PAGES_ROUTES.LIST) {
        bodyData.avatar = imgUrl;
      } else {
        bodyData[imageKey] = imgUrl;
      }
    }

    for (const key in bodyData) {
      if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
        if (!imgUrl && key === 'image_url') {
          delete bodyData[key];
        }
      }
    }

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
    <>
      {imagePathUrl === 'static/home_page/whatwedos' && (
        <EditUploadImage
          eachField={{
            name: 'Upload an image',
            type: 'file',
            required: true,
            view: 'file',
            placeholder: 'This is required',
          }}
          imagePathUrl={imagePathUrl}
        />
      )}

      <form onSubmit={handleEditForm} className="flex flex-col gap-6">
        <div className="grid gap-3 md:grid-cols-1">
          {editSchema.map((eachField, index) =>
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
                  defaultValue={eachField.value}
                  className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
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
            ) : eachField.type === 'file' ? (
              eachField.value ? (
                <div key={index} className="flex items-center gap-4 mt-[20px]">
                  <div className="flex flex-col items-center gap-1">
                    <small>Existing image</small>
                    <img src={eachField.value} className="w-24 h-24" />
                    <Link
                      target="_blank"
                      className="text-[14px] text-blue-400"
                      href={eachField.value}
                    >
                      View
                    </Link>
                  </div>
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
                      className="block mb-2 text-sm font-medium dark:text-white capitalize"
                    >
                      {eachField.name.split('_').join(' ')}
                    </label>
                    <input
                      className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder={eachField.placeholder}
                      required={eachField.value ? false : eachField.required}
                      type={
                        eachField.type == 'file' && eachField.view === 'file'
                          ? 'text'
                          : 'file'
                      }
                      accept="image/*"
                      name={eachField.name}
                      id={eachField.name}
                      {...(eachField.view === 'file'
                        ? { defaultValue: eachField.value }
                        : {})}
                      onChange={handleUploadToServer}
                    />
                    <input
                      hidden
                      value={eachField.value}
                      name={eachField.name}
                      type={'text'}
                    />
                  </div>
                </div>
              ) : (
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
                          className="block mb-2 text-sm font-medium text-black mt-[20px] capitalize"
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
                      accept="image/*"
                      defaultValue={eachField.value}
                      onChange={handleUploadToServer}
                    />
                  </div>
                </div>
              )
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
    </>
  );
}
