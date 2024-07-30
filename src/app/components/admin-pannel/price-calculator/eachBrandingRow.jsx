import Link from 'next/link';
import Delete from '../home-page/delete';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import AlertMessage from '../../common/alert';

export default function EachBrandingRow({ eachBrandingRow, productId }) {
  const [edit, setEdit] = useState(false);
  const [eachBrandingForm, setEachBrandingForm] = useState({
    branding_unit_price: eachBrandingRow.branding_unit_price,
    branding_set_up_price: eachBrandingRow.branding_set_up_price,
    product_branding_id: eachBrandingRow.id,
    isLoading: false,
    errorMessage: '',
    successMessage: '',
  });

  const handleSubmitEachBranding = async () => {
    if (
      !eachBrandingForm.branding_unit_price ||
      !eachBrandingForm.branding_set_up_price
    ) {
      setEachBrandingForm({
        ...eachBrandingForm,
        errorMessage: 'Both Fields are requried',
        successMessage: '',
      });
    }
    const url = `/api/products/${productId}/branding`;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        product_branding_update_schema: [eachBrandingForm],
      }),
    };
    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        setEachBrandingForm({
          ...eachBrandingForm,
          errorMessage: responseData.message,
          successMessage: '',
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setEdit(false);
        setEachBrandingForm({
          ...eachBrandingForm,
          errorMessage: '',
          successMessage: responseData.message,
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  return (
    <>
      {(eachBrandingForm.errorMessage || eachBrandingForm.successMessage) && (
        <tr>
          <td colSpan={6} className="py-2 text-center">
            <AlertMessage
              name={eachBrandingForm.errorMessage ? 'error' : 'success'}
              message={
                eachBrandingForm.errorMessage || eachBrandingForm.successMessage
              }
              linkText={null}
              linkHref={null}
              textColor={
                eachBrandingForm.errorMessage
                  ? 'text-red-800'
                  : 'text-green-800'
              }
              bgColor={
                eachBrandingForm.errorMessage ? 'bg-red-50' : 'bg-green-50'
              }
              closeAction={() =>
                setEachBrandingForm({
                  ...eachBrandingForm,
                  errorMessage: '',
                  successMessage: '',
                })
              }
            />
          </td>
        </tr>
      )}

      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 flex gap-4">
          <button onClick={() => setEdit(!edit)}>
            <svg
              className="w-5 h-5 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"
              />
            </svg>
          </button>
          {edit && (
            <button
              onClick={handleSubmitEachBranding}
              className="bg-[#8A1E41] text-white dark:bg-black p-1 rounded-md"
            >
              Submit
            </button>
          )}
          {/* <Delete
            url={`/api/products/price-clculator/${eachBrandingRow.id}/`}
          /> */}
        </td>
        <td className="px-6 py-4 font-bold">{eachBrandingRow.description}</td>

        <td className="px-6 py-4 font-bold text-[#8A1E41]">
          {edit ? (
            <input
              className="no-spinners bg-gray-50 border text-[#8A1E41] border-black sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1"
              placeholder="Branding Set Up Price"
              required={true}
              defaultValue={eachBrandingRow.branding_unit_price}
              type="number"
              onChange={(e) =>
                setEachBrandingForm({
                  ...eachBrandingForm,
                  branding_unit_price: e.target.value,
                })
              }
              name="branding_unit_price"
              id="branding_unit_price"
            />
          ) : (
            eachBrandingForm.branding_unit_price
          )}
        </td>
        <td className="px-6 py-4 font-bold text-[#8A1E41]">
          {edit ? (
            <input
              className="no-spinners bg-gray-50 border text-[#8A1E41] border-black sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1"
              placeholder=""
              required={true}
              defaultValue={eachBrandingRow.branding_set_up_price}
              type="number"
              onChange={(e) =>
                setEachBrandingForm({
                  ...eachBrandingForm,
                  branding_set_up_price: e.target.value,
                })
              }
              name="branding_set_up_price"
              id="branding_set_up_price"
            />
          ) : (
            eachBrandingForm.branding_set_up_price
          )}
        </td>
      </tr>
    </>
  );
}
