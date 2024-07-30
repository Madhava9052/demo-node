import React, { useState } from 'react';
import useApi from '@/helpers/useApi';
import TableSkeleton from '../../common/tableSkeleton';

export default function LiveStockStatus({ productId, productDetails }) {
  const path = `/api/products/${productId}/stocks/`;
  const { data: stocks, loading, error } = useApi(path);
  const [visibleRows, setVisibleRows] = useState(5);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const remainingCount = stocks?.length - visibleRows;

  const showMoreRows = () => {
    // Increment the number of visible rows by, e.g., 5
    setVisibleRows((prevVisibleRows) => prevVisibleRows + remainingCount);
  };



  return (
    <div className="flex flex-col lg:flex-row items-start justify-between">
      <div className="w-full lg:max-w-[800px] overflow-x-auto flex grow p-[10px] px-0 lg:p-0 lg:py-[40px]">
        <table className="w-full  text-center bg-[#F4F4F4] text-gray-500">
          <thead className="text-center text-black text-[18px] ">
            <tr className=' border-b'>
              <th scope="col" className="px-6 py-3 font-semibold">
                Item
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                In Stock
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Next Shipment
              </th>
            </tr>
          </thead>
          <tbody className='text-center text-sm'>
            {loading ? (
              <TableSkeleton rows={5} columns={3} />
            ) : !stocks.length ? <tr>
              <td colSpan={3} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                No data found
              </td>
            </tr> : (
              stocks?.slice(0, visibleRows).map((eachStock, index) => (
                <tr key={index} className="border-b text-lg">
                  <th
                    scope="row"
                    className="px-6 py-2 font-normal text-base text-gray-900 whitespace-nowrap"
                  >
                    {eachStock.item_name}
                  </th>
                  <td className="px-6 py-2 font-normal text-base">{eachStock.available_quantity}</td>
                  <td className="px-6 py-2 font-normal text-base">
                    {eachStock.next_shipment_quantity !== 0 && (
                      <span>
                        {eachStock.next_shipment_quantity} -{' '}
                        {eachStock.due_date}
                      </span>
                    )}
                  </td>
                </tr>

              ))
            )}
            <tr>
              {stocks?.length > visibleRows && (
                <td colSpan="3" className="px-6 py-4">
                  <button onClick={showMoreRows} className='flex items-center gap-2 mx-auto'>
                    <span className='text-[#FFCD00] text-lg font-semibold'>Show {remainingCount} more</span>
                    <span>
                      <svg
                        width="11"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.18005 6.18895L10.1788 1.08599L9.48613 0L5.08697 4.49197L0.687798 0L-1.93976e-09 1.08599L4.99879 6.18895L5.07227 6.30395L5.09187 6.28395L5.11146 6.30395L5.18005 6.18895Z"
                          fill="orange"
                        />
                      </svg>
                    </span>
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>

      </div>
      <div className="lg:w-[490px] lg:h-[400px] mt-[40px]">
        <img src={productDetails.images[0].url} alt="" />
      </div>
    </div>
  );
}
