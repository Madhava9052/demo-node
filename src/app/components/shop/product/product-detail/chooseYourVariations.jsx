import Popover from '@/app/components/common/popOver';
import { useGlobalContext } from '@/app/context/store';
import React, { Fragment, useEffect, useState } from 'react';

export default function ChooseYourVariations({
  productVariations,
  setProductDetailForm,
  productDetailForm,
  handleChangeVariation,
  isSizesAvailable,
  selectedEditOptions,
  isSample
}) {
  const { globalStore, setGlobalStore, productStore, setProductStore } =
    useGlobalContext();
  const [showSizes, setShowSizes] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(false);
  

  const sortProductSizes = (product) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
    console.log(product);
    // Create a map for quick lookup of index in sizeOrder
    const sizeIndexMap = Object.fromEntries(
      sizeOrder.map((size, index) => [size, index])
    );

    // Sort sizes array based on position in sizeOrder
    product.sizes.sort((a, b) => {
      const indexA =
        sizeIndexMap[a.size_name] !== undefined
          ? sizeIndexMap[a.size_name]
          : Infinity;
      const indexB =
        sizeIndexMap[b.size_name] !== undefined
          ? sizeIndexMap[b.size_name]
          : Infinity;
      return indexA - indexB;
    });
    // Return the updated product object (optional)
    // const allSizes = [...product.sizes];

    const updatedSizes = product.sizes.map((size) => ({
      ...size,
      quantity: 0,
    }));

    const updatedProduct = {
      ...product,
      sizes: updatedSizes,
    };

    console.log(updatedProduct);
    return updatedProduct;
  };

  const decreaseQuantity = (sizeName) => {
    const allSizes = showSizes.sizes.map((item) => {
      if (item.size_name === sizeName) {
        return { ...item, quantity: parseInt(item.quantity) - 1 };
      }
      return item;
    });
    setShowSizes({
      ...showSizes,
      sizes: allSizes,
    });
  };

  const increaseQuantity = (sizeName) => {
    const allSizes = showSizes.sizes.map((item) => {
      if (item.size_name === sizeName) {
        return { ...item, quantity: parseInt(item.quantity) + 1 };
      }
      return item;
    });
    setShowSizes({
      ...showSizes,
      sizes: allSizes,
    });
  };

  useEffect(() => {
    if(selectedEditOptions){
      const selectedEditVariation = productVariations.COLOUR.find(each => each.id === selectedEditOptions[0]?.product_variation_item?.id)
      const sortedVariation = sortProductSizes(selectedEditVariation)
      const updatedEditVariation = {
        ...sortedVariation,
        sizes: sortedVariation.sizes.map(eachSize => {
          const selectedEditSize = selectedEditOptions[0].product_size_quantity.find(each => each.size === eachSize.size_name)
          return selectedEditSize ? {...eachSize, quantity: selectedEditSize.quantity} : eachSize
        })
      }
      setShowSizes(updatedEditVariation)
      setSelectedVariation(true)
    }
  },[selectedEditOptions])

  useEffect(() => {
    if(productVariations?.COLOUR[0]?.sizes.length > 0){
      console.log("sizes", showSizes)
      if(showSizes){
        const totalQuantity = showSizes.sizes.reduce((acc, curr) => acc + parseInt(curr.quantity), 0)
        setProductDetailForm({
          ...productDetailForm,
          quantity: parseInt(totalQuantity) || 0, // Use 0 if the input value is not a valid number
          product_size_quantity: showSizes.sizes.map(size => ({size: size.size_name, quantity: size.quantity})).filter(each => each.quantity > 0)
        })
      }else{
        setProductDetailForm({
          ...productDetailForm,
          quantity: 0,
          product_size_quantity: [],
          product_variations_items_object: {COLOUR:null}
        })
      }
    }
  }, [showSizes])

  return (
    <div className="my-5 max-w-[600px] mt-2">
      {isSizesAvailable && selectedVariation && !isSample && (
        <div className="bg-white mb-2 border p-3 px-5 h-fit w-full flex items-center justify-between gap-3">
          <div className="flex gap-2 items-center">
            <label
              style={{
                backgroundColor: `${showSizes.hex_code}`,
              }}
              className={` cursor-pointer rounded-full inline-block w-7 h-7 border bg-white`}
            >
              <input
                hidden
                type="radio"
                name="color"
                value={showSizes.hex_code}
                defaultChecked="true"
              />
            </label>
            <div className=" flex flex-1 flex-wrap gap-2 text-base">
              {showSizes?.sizes?.map((size, index) => (
                <span key={index} className="flex w-fit items-center gap-2">
                  {size.size_name}
                  <input
                    type="number"
                    className="text-sm text-center remove-arrow appearance-none focus:outline-none w-8 border"
                    value={size.quantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const allSizes = showSizes.sizes.map((item) => {
                        if (item.size_name === size.size_name) {
                          if (inputValue > item.stock) {
                            return { ...item, quantity: item.stock };
                          } else {
                            return { ...item, quantity: inputValue };
                          }
                        }
                        return item;
                      });
                      setShowSizes({
                        ...showSizes,
                        sizes: allSizes,
                      });
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
          <span className="flex items-center gap-2">
            <span className="text-base font-semibold">Qty</span>
            <div className="number-input flex items-center border p-1">
              <input
                disabled
                type="number"
                value={showSizes.sizes.reduce((acc, curr) => acc + parseInt(curr.quantity), 0)}
                className="remove-arrow w-11 text-center border-0 appearance-none m-0 focus:outline-none border-gray-300 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <svg
              className="ml-1 cursor-pointer"
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() =>{
                setShowSizes(null)
                setSelectedVariation(false)
              }}
            >
              <path
                d="M0.18 11L4.88 4.88L4.84 6.22L0.36 0.319999H3.14L6.28 4.52H5.22L8.38 0.319999H11.08L6.56 6.22L6.58 4.88L11.26 11H8.44L5.14 6.54L6.18 6.68L2.94 11H0.18Z"
                fill="#FFC107"
              />
            </svg>
          </span>
        </div>
      )}
      {productVariations?.COLOUR?.length > 0 ? (
        Object.keys(productVariations).map((eachKey, index) => {
          if (eachKey === 'COLOUR') {
            return (
              <span
                key={index}
                className="flex text-black text-sm items-center my-3 flex-wrap"
              >
                {/* {eachKey} : <br></br> */}
                {productVariations[eachKey].map((eachVariantItem, index1) => (
                  <Popover
                    key={index1}
                    title={eachVariantItem.color}
                    titleBg="bg-[#8A1E41]"
                    content={
                      eachVariantItem.is_stock_available || eachVariantItem.available_quantity
                        ? `Available Quantity ${eachVariantItem.available_quantity}`
                        : 'Stock Not Available'
                    }
                  >
                    <span className="cursor-pointer">
                      {/* {eachVariantItem.color} */}
                    </span>
                    <div
                      className={`mr-4 w-8 h-8 inline-block  
                        ${
                          Object.values(productDetailForm.product_variations_items_object).includes(
                            eachVariantItem.id
                          )
                            ? 'ring-2 ring-[#FFCD00] rounded-full'
                            : ''
                        }`}
                                        >
                                          <label
                                            style={{
                                              backgroundColor: eachVariantItem.hex_code,
                                            }}
                                            className={` cursor-pointer  rounded-full inline-block  
                          ${
                            Object.values(
                              productDetailForm.product_variations_items_object
                            ).includes(eachVariantItem.id)
                              ? 'w-8 h-8 border-4 bg-transparent rounded-full'
                              : 'w-7 h-7 border-2 bg-transparent'
                          }`}
                      >
                        <input
                          hidden
                          type="radio"
                          name="color"
                          value={eachVariantItem.name}
                          defaultChecked={productDetailForm.product_variation_item_array.includes(
                            eachVariantItem.id
                          )}
                          disabled={!(eachVariantItem.is_stock_available && eachVariantItem.available_quantity)}
                          onClick={() => {
                            !isSizesAvailable
                              ? eachVariantItem.is_stock_available &&
                                handleChangeVariation(
                                  eachKey,
                                  eachVariantItem.id,
                                  eachVariantItem.color
                                )
                              : (setShowSizes(
                                  sortProductSizes(eachVariantItem)
                                ),
                                handleChangeVariation(
                                  eachKey,
                                  eachVariantItem.id,
                                  eachVariantItem.color
                                ),
                                setSelectedVariation(false)
                                
                              );
                          }}
                        />
                      </label>
                    </div>
                  </Popover>
                ))}
              </span>
            );
          }
        })
      ) : (
        <h4 className="text-red-500 w-fit text-xl font-medium leading-normal ">
          No colors available currently
        </h4>
      )}

      {isSizesAvailable && showSizes && (
        <>
          <h4 className="text-black text-lg lg:text-[20px] font-semibold">
            <span className="mr-1 lg:mr-5"> Choose Size and Qty</span>
          </h4>
          <div className="mt-2 flex flex-1 flex-wrap gap-2 text-base font-semibold">
            {showSizes.sizes.map((size) => {
              if (isSample){
                const isSelected = showSizes.sizes.filter((item) => item.quantity > 0).map((item) => item.size_name).includes(size.size_name)
                return(
                <div 
                  onClick={(e) => {
                    const allSizes = showSizes.sizes.map((item) => {
                      if (item.size_name === size.size_name) {
                        return { ...item, quantity: 1};
                      }
                      return { ...item, quantity: 0};
                    });
                    setShowSizes({
                      ...showSizes,
                      sizes: allSizes,
                    });
                  }}
                  key={size.size_name}
                  className={`cursor-pointer flex flex-col items-center`}
                >
                    <span className={`bg-white py-2 px-4 flex w-fit items-center gap-2 ${isSelected && 'border-2 border-orange-600'}`}>
                      {size.size_name}
                    </span>
                    <span className="text-[9px] text-[#8A1E41]">
                      {size.stock} in stock
                    </span>
                </div>)
              }else{
                return(<div key={size.size_name} className="flex flex-col items-center">
                  <span className="bg-white py-2 px-4 flex w-fit items-center gap-2">
                    {size.size_name}
                    <div className="flex flex-col">
                      <div
                        className="number-input flex items-center border py-1"
                        // onClick={addQuantityToSizes}
                      >
                        <input
                          type="button"
                          disabled={size.quantity <= 0}
                          readOnly
                          className="plus text-gray-500 rounded-r-md px-1 cursor-pointer hover:bg-gray-50"
                          value={'-'}
                          onClick={() => {
                            decreaseQuantity(size.size_name);
                            setSelectedVariation(true);
                          }}
                        />
                        <input
                          type="number"
                          value={size.quantity}
                          className="remove-arrow w-6 text-center border-0 appearance-none m-0 focus:outline-none border-gray-300 shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const allSizes = showSizes.sizes.map((item) => {
                              if (item.size_name === size.size_name) {
                                if (inputValue > item.stock) {
                                  return { ...item, quantity: item.stock };
                                } else {
                                  return { ...item, quantity: inputValue };
                                }
                              }
                              return item;
                            });
                            setSelectedVariation(true)
                            setShowSizes({
                              ...showSizes,
                              sizes: allSizes,
                            });
                          }}
                        />
                        <input
                          type="button"
                          disabled={size.quantity >= size.stock}
                          readOnly
                          className="plus text-gray-500 rounded-r-md px-1 cursor-pointer hover:bg-gray-50"
                          value={'+'}
                          onClick={() => {
                            increaseQuantity(size.size_name);
                            setSelectedVariation(true);
                          }}
                        />
                      </div>
                    </div>
                  </span>
                  <span className="text-[9px] text-[#8A1E41]">
                    {size.stock} in stock
                  </span>
                </div>)
              }
            })}
          </div>
        </>
      )}
    </div>
  );
}
