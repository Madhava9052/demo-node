import Link from 'next/link';
import Delete from '../home-page/delete';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import AlertMessage from '../../common/alert';

export default function EachVariationRow({ eachVariationRow }) {
  const [edit, setEdit] = useState(false);
  const [eachVariationForm, setEachVariationForm] = useState({
    customer_individual_final_price:
      eachVariationRow.customer_individual_final_price,
    customer_trade_final_price: eachVariationRow.customer_trade_final_price,
    product_price_id: eachVariationRow.id,
    isLoading: false,
    errorMessage: '',
    successMessage: '',
  });

  const handleSubmitEachVariation = async () => {
    if (
      !eachVariationForm.customer_individual_final_price ||
      !eachVariationForm.customer_trade_final_price
    ) {
      setEachVariationForm({
        ...eachVariationForm,
        errorMessage: 'Both Fields are requried',
        successMessage: '',
      });
    }
    const url = `/api/products/prices/customers/`;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        product_price_update_schema: [eachVariationForm],
      }),
    };
    try {
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        setEachVariationForm({
          ...eachVariationForm,
          errorMessage: responseData.message,
          successMessage: '',
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setEdit(false);
        setEachVariationForm({
          ...eachVariationForm,
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
      {(eachVariationForm.errorMessage || eachVariationForm.successMessage) && (
        <tr>
          <td colSpan={6} className="py-2 text-center">
            <AlertMessage
              name={eachVariationForm.errorMessage ? 'error' : 'success'}
              message={
                eachVariationForm.errorMessage ||
                eachVariationForm.successMessage
              }
              linkText={null}
              linkHref={null}
              textColor={
                eachVariationForm.errorMessage
                  ? 'text-red-800'
                  : 'text-green-800'
              }
              bgColor={
                eachVariationForm.errorMessage ? 'bg-red-50' : 'bg-green-50'
              }
              closeAction={() =>
                setEachVariationForm({
                  ...eachVariationForm,
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
          {/* <Delete
            url={`/api/products/price-clculator/${eachVariationRow.id}/`}
          /> */}
        </td>
        <td className="px-6 py-4">{eachVariationRow.quantity}</td>
        <td className="px-6 py-4">{eachVariationRow.price}</td>

        <td className="px-6 py-4">
          {edit ? (
            <input
              className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1"
              placeholder="Individual Price"
              required={true}
              defaultValue={eachVariationRow.customer_individual_final_price}
              type="number"
              onChange={(e) =>
                setEachVariationForm({
                  ...eachVariationForm,
                  customer_individual_final_price: e.target.value,
                })
              }
              name="customer_individual_final_price"
              id="customer_individual_final_price"
            />
          ) : (
            eachVariationForm.customer_individual_final_price
          )}
        </td>
        <td className="px-6 py-4">
          {edit ? (
            <input
              className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1"
              placeholder="Trade price"
              required={true}
              defaultValue={eachVariationRow.customer_trade_final_price}
              type="number"
              onChange={(e) =>
                setEachVariationForm({
                  ...eachVariationForm,
                  customer_trade_final_price: e.target.value,
                })
              }
              name="customer_trade_final_price"
              id="customer_trade_final_price"
            />
          ) : (
            eachVariationForm.customer_trade_final_price
          )}
        </td>

        <td className="px-6 py-4">
          <div className="flex gap-4 items-center">
            <span>
              {eachVariationRow.is_price_calculated ? 'True' : 'False'}
            </span>
            {edit && (
              <button
                onClick={handleSubmitEachVariation}
                className="bg-[#8A1E41] text-white dark:bg-black p-1 rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
