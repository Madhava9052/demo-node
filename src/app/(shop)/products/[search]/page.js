'use client';
import ItemCard from '@/app/components/common/itemCard';
import CardSkeleton from '@/app/components/common/itemCardSkeleton';
// import FilterModal from '@/app/components/shop/category/FilterModal';
import Link from 'next/link';

import SearchPagination from '@/app/components/shop/product/searchFilter';

import { sendRequest } from '@/helpers/utils';

import { useEffect, useState } from 'react';

export default function ProductsSearchPage({ searchParams }) {
  const searchValue = searchParams.search;
  const [searchResultData, setsearchResultData] = useState();
  const [sortBy, setSortBy] = useState('Select'); // Default sorting option
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const offsetValue = searchParams.offset
    ? `offset=${searchParams.offset}`
    : '';
  const offsetCount = searchParams.offset ? parseInt(searchParams.offset) : 0;

  const path = `/api/products/?search=${searchValue}&${offsetValue}`;

  useEffect(() => {
    async function getSearchResult(path) {
      const [responseData] = await Promise.all([sendRequest(path)]);
      setsearchResultData(responseData);
    }
    getSearchResult(path);
  }, [searchValue, path]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sortSearchResults = (data, sortBy) => {
    switch (sortBy) {
      case 'lowToHigh':
        return data
          .slice()
          .sort(
            (a, b) =>
              a.minimum_order_quantity_price - b.minimum_order_quantity_price
          );

      case 'highToLow':
        return data
          .slice()
          .sort(
            (a, b) =>
              b.minimum_order_quantity_price - a.minimum_order_quantity_price
          );

      case 'AToZ':
        return data.slice().sort((a, b) => a.name.localeCompare(b.name));

      case 'ZToA':
        return data.slice().sort((a, b) => b.name.localeCompare(a.name));

      case 'NewToOld':
        return data
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      case 'oldToNew':
        return data
          .slice()
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      default:
        return data; // No sorting or default sorting
    }
  };

  const handleSortChange = (event) => {
    const selectedSortBy = event.target.value;

    setSortBy(selectedSortBy);
    // Call a sorting function here based on the selectedSortBy
    // You can implement sorting logic based on the selected option.
    const sortedResult = sortSearchResults(
      searchResultData.data,
      selectedSortBy
    );
    setsearchResultData({ ...searchResultData, data: [...sortedResult] });
  };

  return (
    <section className="mt-[60px] lg:mt-8">
      {!searchResultData?.data?.length && searchResultData && (
        <div className="container mx-auto">
          <h1 className="my-10 ml-5 font-semibold  leading-none text-3xl">
            Searched results for :-{' '}
            <span className="font-extrabold text-[#8A1E41]">{searchValue}</span>
          </h1>
        </div>
      )}
      {!searchResultData?.data?.length && searchResultData && (
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="my-4 text-4xl font-extrabold  leading-none text-gray-900 md:text-5xl lg:text-6xl">
            No products found
          </h1>
        </div>
      )}
      {searchResultData?.data.length && (
        <div className="container mx-auto">
          <div className="text-black text-base font-normal flex flex-wrap justify-between">
            <p>
              <Link href="/"><span className='hover:text-[#FFCD00] cursor-pointer'>Home</span></Link> /{' '}
              <span className="text-[#FFCD00] capitalize font-semibold">
                {decodeURIComponent(searchValue).split('-').join(' ')}
              </span>
            </p>
            <SearchPagination
              responseData={searchResultData}
              offsetCount={offsetCount}
              showTextOnly={true}
              searchValue={searchValue}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-y-4 justify-end items-start lg:items-center mt-4 pb-[20px]">
            {/* <button onClick={handleToggleSidebar} className="mt-[10px] font-bold flex gap-8 border border-solid border-opacity-20 py-3 px-2">
              Filter{' '}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.625 11.625V0H9.375V11.625C7.9375 11.9062 6.875 13.1875 6.875 14.6875C6.875 16.1875 7.9375 17.4688 9.375 17.75V20H10.625V17.75C12.0625 17.4688 13.125 16.1875 13.125 14.6875C13.125 13.1875 12.0625 11.9062 10.625 11.625ZM10 16.5625C8.96875 16.5625 8.125 15.7188 8.125 14.6875C8.125 13.6562 8.96875 12.8125 10 12.8125C11.0312 12.8125 11.875 13.6562 11.875 14.6875C11.875 15.7188 11.0312 16.5625 10 16.5625ZM19.375 7.8125C19.375 6.3125 18.3125 5.03125 16.875 4.75V0H15.625V4.75C14.1875 5.03125 13.125 6.3125 13.125 7.8125C13.125 9.3125 14.1875 10.5938 15.625 10.875V20H16.875V10.875C18.3125 10.5938 19.375 9.3125 19.375 7.8125ZM16.25 9.6875C15.2188 9.6875 14.375 8.84375 14.375 7.8125C14.375 6.78125 15.2188 5.9375 16.25 5.9375C17.2812 5.9375 18.125 6.78125 18.125 7.8125C18.125 8.84375 17.2812 9.6875 16.25 9.6875ZM6.875 5.625C6.875 4.125 5.8125 2.84375 4.375 2.5625V0H3.125V2.5625C1.6875 2.84375 0.625 4.125 0.625 5.625C0.625 7.125 1.6875 8.40625 3.125 8.6875V20H4.375V8.6875C5.8125 8.40625 6.875 7.125 6.875 5.625ZM3.75 7.5C2.71875 7.5 1.875 6.65625 1.875 5.625C1.875 4.59375 2.71875 3.75 3.75 3.75C4.78125 3.75 5.625 4.59375 5.625 5.625C5.625 6.65625 4.78125 7.5 3.75 7.5Z" fill="black" />
              </svg>
            </button> */}
            {/* <FilterModal
              // siblingSubCategories={siblingSubCategories}
              isOpen={isSidebarOpen}
              onClose={handleToggleSidebar}
              // id={selectedOption}
              // categoryType={categoryType}
              // responseData={sidebarData}
              // categoryName={categoryName}
            /> */}
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <label
                  htmlFor="sortBy"
                  className="text-black font-montserrat text-base font-semibold leading-normal"
                >
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy} // Set the selected value to the state variable
                  onChange={handleSortChange} // Attach the event handler
                  className="border mt-[10px] border-solid border-[#0000001a] py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
                >
                  <option defaultValue="Select">Select</option>
                  <option value="lowToHigh">Price : Low to High</option>
                  <option value="highToLow">Price : High to Low</option>
                  <option value="AToZ">Name : A to Z</option>
                  <option value="ZToA">Name : Z to A</option>
                  <option value="NewToOld">Released : Newest to Oldest</option>
                  <option value="oldToNew">Released : Oldest to Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 container mx-auto">
        {!searchResultData
          ? [...Array(8)].map((_, index) => <CardSkeleton key={index} />)
          : searchResultData?.data.map((eachProduct, index) => (
            <ItemCard
              categoryPath={`search-results/${searchValue}/`}
              key={eachProduct.id}
              product={eachProduct}
              imgURL={eachProduct?.images[0]?.url}
              productId="1"
            />
          ))}
      </div>
      {searchResultData?.data.length && (
        <div className="my-20 flex justify-center max-w-[600px] mx-auto">
          <SearchPagination
            responseData={searchResultData}
            offsetCount={offsetCount}
            showTextOnly={false}
            searchValue={searchValue}
          />
        </div>
      )}
    </section>
  );
}
