'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from './pagiation';
import { CiMenuBurger } from "react-icons/ci";
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import FilterModal from './FilterModal';
import Link from 'next/link';
import "./FilterModal.css"

export default function Filters({
  siblingSubCategories,
  categoryId,
  categoryName,
  categoryType,
  responseData,
  offsetCount,
  sortByOnChangeHandle,
  sortBy,
  product,
}) {
  const router = useRouter();
  const [sidebarData, setSidebarData] = useState({});
  const [selectedOption, setSelectedOption] = useState(categoryId);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filtersSideBar, setFiltersSideBar] = useState(false)
  const resultsPerPage = 20;
  const currentPage = offsetCount / resultsPerPage + 1;
  // Calculate the total number of pages
  const totalPages = Math.ceil(responseData.count / resultsPerPage);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSubCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    // Redirect to the selected subcategory

    // Find the selected subcategory object based on its ID
    const { name: selectedSubCategoryName } = siblingSubCategories.find(
      (subCategory) => subCategory.id === selectedValue
    );
    const formatSubCategoryName = selectedSubCategoryName
      .toLowerCase()
      .split(' ')
      .join('-');
    if (categoryType === 'CATEGORY') {
      router.push(`/category/${formatSubCategoryName}/${selectedValue}`);
    } else {
      router.push(
        `/category/${categoryType.toLowerCase()}/${formatSubCategoryName}/${selectedValue}`
      );
    }
  };


  const handleFilterInMobile=() =>{
    setFiltersSideBar(!filtersSideBar)
  }

  //Fetching filter options data from selected Id
  const url = `/api/products/category/${selectedOption}/filters/`;
  useEffect(() => {
    async function fetchData() {
      try {
        const responseData = await sendRequest(url);
        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle error case
          console.error('API request error:', responseData.error);
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          setSidebarData(responseData.data)
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }
    fetchData();
  }, []);

  

  return (
    <div>
      <div className="text-black lg:px-[50px] xl:px-0 text-xs sm:text-base leading-8  flex flex-wrap items-center justify-between">
        <p >
          <Link href="/"><span className='cursor-pointer hover:text-[#FFCD00]'>Home</span> /{' '}</Link>
          {(product?.categories_data_information?.name)?.toLowerCase().split(' ').join('-') !== categoryName && 
          <Link className='cursor-pointer hover:text-[#FFCD00]' href={`/category/${(product?.categories_data_information?.name)?.toLowerCase()}/${product?.categories_data_information?.id}`}>{product?.categories_data_information?.name}{(product?.categories_data_information?.name)?.toLowerCase().split(' ').join('-') && <span className='text-black'>{' '}/{' '}</span>}</Link>}
           <span className="text-[#FFCD00]  font-medium capitalize">
            {decodeURIComponent(categoryName).split('-').join(' ')}
          </span>
        </p>
        <div className='hidden sm:block'>
        <Pagination
          offsetCount={offsetCount}
          categoryName={categoryName}
          responseData={responseData}
          categoryId={categoryId}
          showTextOnly={true}
        />
        </div>
        <div className='sm:hidden'>
        <button onClick={handleFilterInMobile}>
        <CiMenuBurger  />
        </button>
        
        </div>
      </div>
      <div className="lg:px-[50px] hidden sm:flex  xl:px-0  gap-y-2 sm:gap-y-4 justify-between items-start lg:items-end mt-4 pb-[20px]">
       
        <button onClick={handleToggleSidebar} className="font-bold flex gap-8 rounded border-[#0000001a] border border-solid py-[5px] px-2">
          Filter{' '}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.625 11.625V0H9.375V11.625C7.9375 11.9062 6.875 13.1875 6.875 14.6875C6.875 16.1875 7.9375 17.4688 9.375 17.75V20H10.625V17.75C12.0625 17.4688 13.125 16.1875 13.125 14.6875C13.125 13.1875 12.0625 11.9062 10.625 11.625ZM10 16.5625C8.96875 16.5625 8.125 15.7188 8.125 14.6875C8.125 13.6562 8.96875 12.8125 10 12.8125C11.0312 12.8125 11.875 13.6562 11.875 14.6875C11.875 15.7188 11.0312 16.5625 10 16.5625ZM19.375 7.8125C19.375 6.3125 18.3125 5.03125 16.875 4.75V0H15.625V4.75C14.1875 5.03125 13.125 6.3125 13.125 7.8125C13.125 9.3125 14.1875 10.5938 15.625 10.875V20H16.875V10.875C18.3125 10.5938 19.375 9.3125 19.375 7.8125ZM16.25 9.6875C15.2188 9.6875 14.375 8.84375 14.375 7.8125C14.375 6.78125 15.2188 5.9375 16.25 5.9375C17.2812 5.9375 18.125 6.78125 18.125 7.8125C18.125 8.84375 17.2812 9.6875 16.25 9.6875ZM6.875 5.625C6.875 4.125 5.8125 2.84375 4.375 2.5625V0H3.125V2.5625C1.6875 2.84375 0.625 4.125 0.625 5.625C0.625 7.125 1.6875 8.40625 3.125 8.6875V20H4.375V8.6875C5.8125 8.40625 6.875 7.125 6.875 5.625ZM3.75 7.5C2.71875 7.5 1.875 6.65625 1.875 5.625C1.875 4.59375 2.71875 3.75 3.75 3.75C4.78125 3.75 5.625 4.59375 5.625 5.625C5.625 6.65625 4.78125 7.5 3.75 7.5Z" fill="black" />
          </svg>
        </button>
        <FilterModal
          siblingSubCategories={siblingSubCategories}
          isOpen={isSidebarOpen}
          onClose={handleToggleSidebar}
          id={selectedOption}
          categoryType={categoryType}
          responseData={sidebarData}
          categoryName={categoryName}
        />
        
        <div className="flex flex-wrap justify-between sm:gap-x-10 gap-y-3">
          {categoryName !== "collection" && <div className='select-box'>
            <label
              htmlFor="subCategory"
              className="text-black font-montserrat text-md sm:text-[16px] font-semibold leading-normal"
            >
              Select category:
            </label>
            <select
              id="subCategory"
              value={selectedOption}
              defaultValue="select"
              onChange={handleSubCategoryChange}
              className="border mt-[10px] border-[#0000001a] border-solid py-[5px] px-2 sm:px-[10px] text-gray-900 text-base block w-full lg:w-[220px]"
            >
              <option value="" disabled>
                Select
              </option>
              {siblingSubCategories.map((eachSubCategory, index) => (
                <option key={index} value={eachSubCategory.id}>
                  {eachSubCategory.name}
                </option>
              ))}
            </select>
          </div>}
          <div className='select-box'>
            <label
              htmlFor="sortBy"
              className="text-black font-montserrat text-md sm:text-[16px] font-semibold leading-normal"
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy} // Set the selected value to the state variable
              onChange={sortByOnChangeHandle} // Attach the event handler
              className="border mt-[10px] border-[#0000001a] border-solid px-2 py-[5px] sm:px-[10px] text-gray-900 text-base block w-full lg:w-[220px]"
            >
              <option defaultValue="Select">Select</option>
              <option value="lowToHigh">Price : Low to High</option>
              <option value="highToLow">Price : High to Low</option>
              <option value="AToZ">Name : A to Z</option>
              <option value="ZToA">Name : Z tsiblingSubCategorieso A</option>
              <option value="NewToOld">Released : Newest to Oldest</option>
              <option value="oldToNew">Released : Oldest to Newest</option>
            </select>
          </div>
        </div>
      </div>
      {filtersSideBar &&(<div className="lg:px-[50px]   xl:px-0  gap-y-2 sm:gap-y-4 justify-between items-start lg:items-end mt-4 pb-[20px]">
       
        <button onClick={handleToggleSidebar} className="font-bold flex gap-8 rounded border-[#0000001a] border border-solid py-[5px] px-2">
          Filter{' '}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.625 11.625V0H9.375V11.625C7.9375 11.9062 6.875 13.1875 6.875 14.6875C6.875 16.1875 7.9375 17.4688 9.375 17.75V20H10.625V17.75C12.0625 17.4688 13.125 16.1875 13.125 14.6875C13.125 13.1875 12.0625 11.9062 10.625 11.625ZM10 16.5625C8.96875 16.5625 8.125 15.7188 8.125 14.6875C8.125 13.6562 8.96875 12.8125 10 12.8125C11.0312 12.8125 11.875 13.6562 11.875 14.6875C11.875 15.7188 11.0312 16.5625 10 16.5625ZM19.375 7.8125C19.375 6.3125 18.3125 5.03125 16.875 4.75V0H15.625V4.75C14.1875 5.03125 13.125 6.3125 13.125 7.8125C13.125 9.3125 14.1875 10.5938 15.625 10.875V20H16.875V10.875C18.3125 10.5938 19.375 9.3125 19.375 7.8125ZM16.25 9.6875C15.2188 9.6875 14.375 8.84375 14.375 7.8125C14.375 6.78125 15.2188 5.9375 16.25 5.9375C17.2812 5.9375 18.125 6.78125 18.125 7.8125C18.125 8.84375 17.2812 9.6875 16.25 9.6875ZM6.875 5.625C6.875 4.125 5.8125 2.84375 4.375 2.5625V0H3.125V2.5625C1.6875 2.84375 0.625 4.125 0.625 5.625C0.625 7.125 1.6875 8.40625 3.125 8.6875V20H4.375V8.6875C5.8125 8.40625 6.875 7.125 6.875 5.625ZM3.75 7.5C2.71875 7.5 1.875 6.65625 1.875 5.625C1.875 4.59375 2.71875 3.75 3.75 3.75C4.78125 3.75 5.625 4.59375 5.625 5.625C5.625 6.65625 4.78125 7.5 3.75 7.5Z" fill="black" />
          </svg>
        </button>
        <FilterModal
          siblingSubCategories={siblingSubCategories}
          isOpen={isSidebarOpen}
          onClose={handleToggleSidebar}
          id={selectedOption}
          categoryType={categoryType}
          responseData={sidebarData}
          categoryName={categoryName}
        />
        
        <div className="flex flex-wrap justify-between sm:gap-x-10 gap-y-3">
          {categoryName !== "collection" && <div className='select-box'>
            <label
              htmlFor="subCategory"
              className="text-black font-montserrat text-md sm:text-[16px] font-semibold leading-normal"
            >
              Select category:
            </label>
            <select
              id="subCategory"
              value={selectedOption}
              defaultValue="select"
              onChange={handleSubCategoryChange}
              className="border mt-[10px] border-[#0000001a] border-solid py-[5px] px-2 sm:px-[10px] text-gray-900 text-base block w-full lg:w-[220px]"
            >
              <option value="" disabled>
                Select
              </option>
              {siblingSubCategories.map((eachSubCategory, index) => (
                <option key={index} value={eachSubCategory.id}>
                  {eachSubCategory.name}
                </option>
              ))}
            </select>
          </div>}
          <div className='select-box'>
            <label
              htmlFor="sortBy"
              className="text-black font-montserrat text-md sm:text-[16px] font-semibold leading-normal"
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy} // Set the selected value to the state variable
              onChange={sortByOnChangeHandle} // Attach the event handler
              className="border mt-[10px] border-[#0000001a] border-solid px-2 py-[5px] sm:px-[10px] text-gray-900 text-base block w-full lg:w-[220px]"
            >
              <option defaultValue="Select">Select</option>
              <option value="lowToHigh">Price : Low to High</option>
              <option value="highToLow">Price : High to Low</option>
              <option value="AToZ">Name : A to Z</option>
              <option value="ZToA">Name : Z tsiblingSubCategorieso A</option>
              <option value="NewToOld">Released : Newest to Oldest</option>
              <option value="oldToNew">Released : Oldest to Newest</option>
            </select>
          </div>
        </div>
      </div>)}

      {<div>
        <div className='flex justify pb-4 sm:hidden'>
        
        <Pagination
          offsetCount={offsetCount}
          categoryName={categoryName}
          responseData={responseData}
          categoryId={categoryId}
          showTextOnly={true}
        />
        </div>
       
     
        </div>}


      
    </div>
  );
}
