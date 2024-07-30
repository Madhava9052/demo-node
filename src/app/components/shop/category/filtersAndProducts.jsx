'use client';
import { useEffect, useState } from 'react';
import ItemCard from '../../common/itemCard';
import Filters from './filters';
import Pagination from './pagiation';
import ShowSelectedFilters from "./ShowSelectedFilters"

export default function FiltersAndProducts({
  responseData,
  products,
  search,
  siblingSubCategories,
  categoryId,
  categoryName,
  categoryType,
  offsetCount,
}) {
  const [productData, setProductData] = useState(products);
  const [offSet, setOffset] = useState(offsetCount);
  const [sortBy, setSortBy] = useState('Select'); 
  const [categoryList, setCategoryList] = useState([]);
  let cons=categoryName.replace("%20"," ").split(' ').join('-')

  const sortProductsData = (data, sortBy) => {
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

  useEffect(() => {
    setProductData(products)
  }, [products])

  const handleSortChange = (event) => {
    const selectedSortBy = event.target.value;

    setSortBy(selectedSortBy);

    const sortedResult = sortProductsData(productData, selectedSortBy);
    setProductData(sortedResult);
  };


  useEffect(() => {
    const filteredList = productData?.filter((eachProduct) => {
      return (eachProduct.sub_categories_data_information.name).toLowerCase().split(' ').join('-') == cons;
    });
    setCategoryList(filteredList);
  }, []);

  console.log(categoryList)
  console.log(cons)

  return (
    <>
      <div className="container px-4 lg:px-0 mx-auto ">
        <Filters
          sortByOnChangeHandle={handleSortChange}
          sortBy={sortBy}
          responseData={responseData}
          search={search}
          siblingSubCategories={siblingSubCategories}
          categoryId={categoryId}
          categoryName={cons}
          categoryType={categoryType}
          offsetCount={offsetCount}
          product={categoryList ? categoryList[0] : undefined}
        />
      </div>
      
        <ShowSelectedFilters
          filters={search}
          categoryId={categoryId}
          categoryName={categoryName}
          categoryType={categoryType} 
        />
        {!productData?.length && (
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="my-4 text-4xl font-extrabold  leading-none text-gray-900 md:text-5xl lg:text-6xl">
              {`No products on category :- ${categoryName}`}
            </h1>
          </div>
        )}

      <div className="container px-2 lg:px-[50px] xl:px-0 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 lg:gap-4 gap-y-8">
          {productData?.map((eachProduct, index) => (
            <ItemCard
              categoryPath={`${categoryName}/`}
              key={eachProduct.id}
              product={eachProduct}
              imgURL={eachProduct?.images[0]?.url}
              productId="1"
            />
          ))}
        </div>
        <div className="my-10 flex justify-center max-w-[600px] mx-auto">
          <Pagination
            responseData={responseData}
            categoryId={categoryId}
            offsetCount={offSet}
            categoryName={categoryName}
            showTextOnly={false}
          />
        </div>
      </div>
    </>
  );
}
