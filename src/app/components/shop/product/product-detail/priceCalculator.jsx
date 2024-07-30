import EachBrandingRow from '@/app/components/admin-pannel/price-calculator/eachBrandingRow';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import QuoteCalculator from './quoteCalculator';

export default function PriceCalculator({ productId, productData }) {
  const [priceCalculatorData, setPriceCalculatorData] = useState();

  useEffect(() => {
    async function getPriceCalculatorData() {
      const [{ data: priceCalculatorData }] = await Promise.all([
        sendRequest(`/api/products/${productId}/price`),
      ]);
      const updatedPriceData = {
        ...priceCalculatorData,
        product_price_objects: priceCalculatorData.product_price_objects.map(eachPrice => ({...eachPrice, price: Math.round((eachPrice.price + Number.EPSILON) * 100) / 100})).sort((a, b) => a.quantity-b.quantity)
      }
      setPriceCalculatorData(updatedPriceData);
    }
    getPriceCalculatorData();
  }, [productId]);
  if (!priceCalculatorData) {
    return <></>;
  }

  return (
    <div className="bg-white">
      <h3
        colSpan={5}
        className="text-center text-md font-bold text-white uppercase bg-[#8A1E41] py-3 mt-20"
      >
        UNBRANDED
      </h3>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
          {priceCalculatorData.product_price_objects.length && <tr className="">
            <th className="px-6 py-3 capitalize">quantity</th>
            {priceCalculatorData.product_price_objects.map(
              (eachQuantity, index) => (
                <th key={index} className="px-6 py-3">
                  {eachQuantity.quantity}
                </th>
              )
            )}
          </tr>}
        </thead>
        {priceCalculatorData.product_price_objects.length ? <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-3 capitalize font-bold">price</td>
            {priceCalculatorData.product_price_objects.map(
              (eachPrice, index) => (
                <td key={index} className="px-6 py-3">
                  ${eachPrice.price}
                </td>
              )
            )}
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-3 capitalize font-bold">
              customer trade percentage
            </td>

            {priceCalculatorData.product_price_objects.map(
              (eachPrice, index) => (
                <td key={index} className="px-6 py-3">
                  {eachPrice.customer_individual_percentage}%
                </td>
              )
            )}
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-3 capitalize font-bold">
              customer Individual percentage
            </td>

            {priceCalculatorData.product_price_objects.map(
              (eachPrice, index) => (
                <td key={index} className="px-6 py-3">
                  {eachPrice.customer_trade_percentage}%
                </td>
              )
            )}
          </tr>
        </tbody> : (
          <tbody>
            <tr>
              <td colSpan={5} className="py-2 text-center">
                No data found
              </td>
            </tr>
          </tbody>
          )}
      </table>

      <h3
        colSpan={5}
        className="text-center text-md font-bold text-white uppercase bg-[#8A1E41] py-3 mt-20"
      >
        BRANDED
      </h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Branding unit price
            </th>
            <th scope="col" className="px-6 py-3">
              Branding set up price
            </th>
          </tr>
        </thead>
        <tbody>
          {priceCalculatorData?.branding_objects?.map(
            (eachBrandingRow, index) => (
              <EachBrandingRow
                key={index}
                eachBrandingRow={eachBrandingRow}
                productId={productId}
              />
            )
          )}
        </tbody>
      </table>

      <QuoteCalculator
        priceCalculatorData={priceCalculatorData}
        productData={productData}
      />
    </div>
  );
}
