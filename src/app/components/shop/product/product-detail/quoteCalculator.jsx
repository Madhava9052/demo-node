import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function QuoteCalculator({ priceCalculatorData, productData }) {
  const [quoteState, setQuoteState] = useState({
    successMessage: '',
    errorMessage: '',
    loading: false,
  });
  const [quoteCalculatorData, setQuoteCalculatorData] =
    useState(priceCalculatorData);

  const handleUpdateQuote = async (e) => {
    e.preventDefault();
    setQuoteState({ ...quoteState, loading: true });
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        product_price_update_schema: quoteCalculatorData.product_price_objects,
      }),
    };
    const responseData = await sendRequest(
      `/api/products/${productData.id}/price/`,
      options
    );
    if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
      setQuoteState({
        ...quoteState,
        loading: false,
        successMessage: responseData.message,
      });
    }
  };
  return (
    <form onSubmit={handleUpdateQuote} className="flex flex-col items-center">
      <h3 className="text-center w-full text-md font-bold text-white uppercase bg-[#8A1E41] py-3 mt-20">
        QUOTE CALCULATOR
      </h3>
      <h3 className="text-center w-full text-md font-bold text-white uppercase bg-[#8A1E41] py-3">
        {productData.code} {productData.name}
      </h3>
      <table className="text-sm w-full text-left border text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-3 py-2 uppercase">QUANTITY</th>
            <th className="px-3 py-2 uppercase">PRICE</th>
            <th className="px-3 py-2 uppercase">CUSTOMER INDIVIDUAL %</th>
            <th className="px-3 py-2 uppercase">CUSTOMER Trade %</th>
            <th className="px-3 py-2 uppercase">INDIVIDUAL ( Per Quantity )</th>
            <th className="px-3 py-2 uppercase">Trade ( Per Quantity )</th>
          </tr>
        </thead>
        <tbody>
          {}
          {quoteCalculatorData.product_price_objects.length ? 
            quoteCalculatorData.product_price_objects.map((eachQuote, index) => (
            <tr key={index}>
              <td className="px-6 py-3 font-semibold">{eachQuote.quantity}</td>
              <td className="px-6 py-3 font-semibold">{eachQuote.price}</td>
              <td className="px-6 py-3">
                <input
                  className="border  p-1 border-black font-bold max-w-[100px]"
                  required
                  onChange={(e) => {
                    if (e.target.value !== '') {
                      setQuoteCalculatorData({
                        ...quoteCalculatorData,
                        product_price_objects: [
                          ...Object.keys(
                            quoteCalculatorData.product_price_objects
                          ).map((key) =>
                            key != index
                              ? quoteCalculatorData.product_price_objects[key]
                              : {
                                  ...quoteCalculatorData.product_price_objects[
                                    key
                                  ],
                                  customer_individual_percentage: parseFloat(
                                    e.target.value
                                  ),
                                }
                          ),
                        ],
                      });
                    }
                  }}
                  defaultValue={eachQuote.customer_individual_percentage}
                />
              </td>
              <td className="px-6 py-3">
                <input
                  className="border  p-1 border-black font-bold max-w-[100px]"
                  required
                  onChange={(e) => {
                    if (e.target.value !== '') {
                      setQuoteCalculatorData({
                        ...quoteCalculatorData,
                        product_price_objects: [
                          ...Object.keys(
                            quoteCalculatorData.product_price_objects
                          ).map((key) =>
                            key != index
                              ? quoteCalculatorData.product_price_objects[key]
                              : {
                                  ...quoteCalculatorData.product_price_objects[
                                    key
                                  ],
                                  customer_trade_percentage: parseFloat(
                                    e.target.value
                                  ),
                                }
                          ),
                        ],
                      });
                    }
                  }}
                  defaultValue={eachQuote.customer_trade_percentage}
                />
              </td>
              <td className="px-6 py-3 text-[#8A1E41] font-semibold">
                ${' '}
                {(eachQuote.customer_individual_percentage
                  ? (eachQuote.quantity *
                      eachQuote.price *
                      (eachQuote.customer_individual_percentage / 100) +
                      eachQuote.quantity * eachQuote.price) /
                    eachQuote.quantity
                  : 0
                ).toFixed(2)}
              </td>
              <td className="px-6 py-3 text-[#8A1E41] font-semibold">
                ${' '}
                {(eachQuote.customer_trade_percentage
                  ? (eachQuote.quantity *
                      eachQuote.price *
                      (eachQuote.customer_trade_percentage / 100) +
                      eachQuote.quantity * eachQuote.price) /
                    eachQuote.quantity
                  : 0
                ).toFixed(2)}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="py-2 text-center">
                No data found
              </td>
            </tr>
          )
        }
        </tbody>
      </table>

      <div className="mt-2 w-1/2">
        {quoteState.errorMessage || quoteState.successMessage ? (
          <AlertMessage
            name={quoteState.errorMessage ? 'error' : 'success'}
            message={quoteState.errorMessage || quoteState.successMessage}
            linkText={null}
            linkHref={null}
            textColor={
              quoteState.errorMessage ? 'text-red-800' : 'text-green-800'
            }
            bgColor={quoteState.errorMessage ? 'bg-red-50' : 'bg-green-50'}
            closeAction={() =>
              setQuoteState({
                ...quoteState,
                errorMessage: '',
                successMessage: '',
              })
            }
          />
        ) : null}
      </div>
      {priceCalculatorData.product_price_objects.length && <button className="bg-[#8A1E41] mt-5 text-white dark:bg-black p-2 rounded-sm">
        {quoteState.loading ? (
          <Spinner bgColor1="white" bgColor2="#851B39" />
        ) : (
          ' Update'
        )}
      </button>}
    </form>
  );
}
