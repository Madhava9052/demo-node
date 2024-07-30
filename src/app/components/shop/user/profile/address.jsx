'use client';
import TableSkeleton from '@/app/components/common/tableSkeleton';
import useApi from '@/helpers/useApi';

export default function Addresses() {
  const path = '/api/address/';

  const {
    data: addressList,
    error,
    loading: addressListLoading,
  } = useApi(path);

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            First Name
          </th>
          <th scope="col" className="px-6 py-3">
            Last name
          </th>
          <th scope="col" className="px-6 py-3">
            Street number
          </th>
          <th scope="col" className="px-6 py-3">
            postal code
          </th>
          <th scope="col" className="px-6 py-3">
            Type
          </th>
        </tr>
      </thead>
      <tbody>
        {addressListLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          addressList.map((eachAddress, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4">{eachAddress.first_name}</td>
              <td className="px-6 py-4">{eachAddress.last_name}</td>
              <td className="px-6 py-4">{eachAddress.street_number}</td>
              <td className="px-6 py-4"> {eachAddress.postal_code}</td>
              <td className="px-6 py-4">
                <b>{eachAddress.type}</b>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
