'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import { Profiler, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Spinner from '@/app/components/common/spinner';
import AlertMessage from '@/app/components/common/alert';
import TableSkeleton from '@/app/components/common/tableSkeleton';
import Pagination from '@/app/components/admin-pannel/pagiation';
import Chip from '@/app/components/common/chip';

export default function EditForm({
    url,
    successUrl = '',
    productID
}) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [tableData, setTableData] = useState([]);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [offsetVal, setOffsetVal] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const getData = async () => {
            const { data: bestSellers } = await sendRequest(`${url+productID}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setCategory(bestSellers?.category?.id);
            setSelectedProducts([bestSellers?.product])

            const { data: categoryData } = await sendRequest(`/api/categories/summary`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setData(categoryData);
        };
        getData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTermLower = searchTerm.toLowerCase();

        // If search term is empty, reset to original data
        if (searchTermLower === '') {
            handleCategoryChange(category);
        } else {
            // Filter data based on the search term
            const searchedData = tableData.filter(
                (eachVendor) =>
                    eachVendor.name.toLowerCase().includes(searchTermLower)
            );
            setTableData(searchedData);
        }
    };

    const handleCreateBestSeller = async () => {

        if (category && selectedProducts) {
            setIsLoading(true);
            const requestBody = {
                product_id: selectedProducts[0]?.id,
                category_id: category
            }
            const options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify(requestBody)
            }
            try {
                const responseData = await sendRequest(`${url+productID}`, options);

                // Handle different API response statuses
                if (responseData.status === API_RESPONSE_STATUS.ERROR) {
                } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
                    setIsLoading(true);
                    window.location.href = successUrl
                        ? successUrl
                        : '/admin/home-page/best-sellers';
                }
            } catch (error) {
                console.error('API request failed:', error);
            }
        }
        else {
            setIsLoading(false);
            console.log("Select the required Fields")
        }
    }
    const fetchData = async (categoryId, offset) => {
        setTableData(null);
        const offsetValue = offset !== undefined ? `&offset=${offset}&limit=10` : '&offset=0&limit=10';

        const responseData = await sendRequest(
            `/api/products/category/${categoryId}?${offsetValue}`,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }
        );
        setTableData(responseData.data);
        setTotalCount(responseData.count);
    };

    const handleCategoryChange = async (categoryId) => {
        if (offsetVal) {
            setOffsetVal(0);
        }
        await fetchData(categoryId, offsetVal);
    };

    const handleOffsetChange = async (offset) => {
        setOffsetVal(offset);
        await fetchData(category, offset);
    };

   

    const handleProductSelection = (productId, productName) => {
        setSelectedProducts([{ id: productId, name: productName }]);
    };

    useEffect(() => {
        handleCategoryChange(category);
    }, [category]);

    useEffect(() => {
        handleOffsetChange(offsetVal);
    }, [offsetVal]);


    return (
        <>
            <div className="w-[50%]">
                <label
                    htmlFor={'categoryName'}
                    className="block mb-2 text-md font-bold dark:text-white mt-[20px] capitalize"
                >
                    Category
                </label>
                <select
                    id="categoryName"
                    required={true}
                    type={'dropdown'}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
                >
                    <option value="">Select</option>
                    {data.map((eachValue, index) => (
                        <option key={index} value={eachValue.id}>
                            {eachValue.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className='border border-solid border-black pb-[15px] pt-[15px] my-8 rounded-lg'>
                <div className='flex gap-2 ml-[15px] flex-wrap'>
                    {selectedProducts?.map((eachProduct, index) => (
                        <Chip key={index} name={eachProduct?.name} id={eachProduct?.id} />
                    ))}
                </div>
            </div>
            <form
                className="mr-auto my-3 grow max-w-[500px]"
                onSubmit={(e) => handleSearch(e)}
            >
                <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                        placeholder="Search Product"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-[#8A1E41] font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Search
                    </button>
                </div>
            </form>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                PRODUCT NAME
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!tableData ? (
                            <TableSkeleton rows={10} columns={1} />
                        ) : !tableData.length ? (
                            <tr>
                                <td colSpan={5} className="py-2 text-center">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            tableData.map((eachVendor, index) => (
                                <tr
                                    key={index}
                                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700
                                                }`}
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                onChange={() => handleProductSelection(eachVendor.id, eachVendor.name)}
                                                id={`checkbox-table-search-${index}`}
                                                type="checkbox"
                                                checked={selectedProducts.some((product) => product.id === eachVendor.id)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor={`checkbox-table-search-${index}`} className="ml-2">
                                                {eachVendor.name}
                                            </label>
                                        </div>

                                    </th>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {tableData && tableData.length > 0 && (
                <div className="flex justify-between items-center">
                    <Pagination
                        total_count={totalCount}
                        offsetCount={offsetVal}
                        showTextOnly={true}
                    />
                    <Pagination
                        total_count={totalCount}
                        offsetCount={offsetVal}
                        url={`/api/products/category/${category}`}
                        noRedirect={true}
                        callback={handleOffsetChange}
                    />
                </div>
            )}
            <div className='mt-4'>
                <button onClick={handleCreateBestSeller} className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                    {isLoading ? (
                        <Spinner bgColor1="white" bgColor2="#851B39" />
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
        </>
    )
}