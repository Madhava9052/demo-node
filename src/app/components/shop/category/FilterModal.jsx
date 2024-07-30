import FilterModalAccordion from './FilterModalAccordion';
import "./FilterModal.css"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Slider } from '@mui/material';

const FilterModal = ({ isOpen, onClose, id, responseData, categoryType, categoryName,onCloseForMobile }) => {
    const items = [];
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState([])
    const [selectPrintMethods, setSelectPrintMethods] = useState([])
    const [selectAllColors, setSelectAllColors] = useState(false);
    const [selectedAllMaterials, setSelectedAllMaterials] = useState(false);
    const [selectAllPrintMethods, setSelectAllPrintMethods] = useState(false);
    const [stockSliderValues, setStockSliderValues] = useState({ min: null, max: null });
    const [priceSliderValues, setPriceSliderValues] = useState({});

    //if no search params then update values of stock and price sliders with response data
    useEffect(() => {
        if (responseData?.stock_available?.[0] && !searchParams.has("min_stock_qty") && !searchParams.has("max_stock_qty") && !searchParams.has("min_price") && !searchParams.has("max_price")) {
            setStockSliderValues({
                min: responseData.stock_available[0].stock_minimum_quantity,
                max: responseData.stock_available[0].stock_maximum_quantity
            });
            setPriceSliderValues({ min: responseData?.price_range?.[0]?.price_minimum_value, max: responseData?.price_range?.[0]?.price_maximum_value })
        }
    }, [responseData]);

    //handling if page refreshed for filter modal
    useEffect(() => {
        if (searchParams.toString().length > 0) {
            setSelectedColors(searchParams?.get("colors")?.split(",") || [])
            setSelectedMaterial(searchParams?.get("materials")?.split(",") || [])
            setSelectPrintMethods(searchParams?.get("print_methods")?.split(",") || [])
            setStockSliderValues({
                min: searchParams?.get("max_stock_qty") ? parseInt(searchParams?.get("min_stock_qty")) : responseData.stock_available?.[0].stock_minimum_quantity,
                max: searchParams?.get("max_stock_qty") ? parseInt(searchParams?.get("max_stock_qty")) : responseData.stock_available?.[0].stock_maximum_quantity
            })
            setPriceSliderValues({ min: searchParams?.get("min_price") ? parseFloat(searchParams?.get("min_price")) : responseData?.price_range?.[0]?.price_minimum_value, max: searchParams?.get("max_price") ? parseFloat(searchParams?.get("max_price")) : responseData?.price_range?.[0]?.price_maximum_value })
        }
    }, [searchParams])

    const handleApplyFilter = async () => {
        let queryString = ""

        const queryObject = {
            colors: selectedColors.join(",").split("#").join("%23"),
            materials: selectedMaterial.join(","),
            print_methods: selectPrintMethods.join(","),
            min_stock_qty: stockSliderValues.min,
            max_stock_qty: stockSliderValues.max,
            min_price: priceSliderValues.min,
            max_price: priceSliderValues.max
        }

        Object.keys(queryObject).forEach(key => {
            if (queryObject[key]) {
                queryString = queryString ? queryString + '&' + key + '=' + queryObject[key] : queryString + "?" + key + "=" + queryObject[key]
            } else {
                queryString = queryString + ""
            }
        })
        const formatSubCategoryName = categoryName
            .toLowerCase()
            .split(' ')
            .join('-');
        if (categoryType === 'CATEGORY') {
            router.push(`/category/${formatSubCategoryName}/${id}${queryString}`);
        } else {
            router.push(
                `/category/${categoryType.toLowerCase()}/${formatSubCategoryName}/${id}${queryString}`
            );
        }
        onClose();
        if(onCloseForMobile){
        onCloseForMobile();
        }
    };

    const handleColorClick = (color) => {
        const updatedColors = selectedColors.includes(color)
            ? selectedColors.filter((selectedColor) => selectedColor !== color)
            : [...selectedColors, color];

        setSelectedColors(updatedColors);
        setSelectAllColors(false);
    };

    const handleSelectAllClick = (type, value) => {
        const allValues = Object.entries(value).map((val) => val[0]);
        if ((type === "materials")) {
            if (selectedAllMaterials) {
                setSelectedMaterial([])
            } else {
                setSelectedMaterial(allValues);
            }
            setSelectedAllMaterials(!selectedAllMaterials);
        }
        else if ((type === "print_methods" && selectPrintMethods)) {
            if (selectAllPrintMethods) {
                setSelectPrintMethods([])
            } else {
                setSelectPrintMethods(allValues)
            }
            setSelectAllPrintMethods(!selectAllPrintMethods)
        }
    };

    const handleColorToggleSelectAll = (value) => {
        if (selectAllColors) {
            setSelectedColors([]); // Deselect all colors
        } else {
            let allColors = [];
            Object.entries(value).forEach(([color]) => {
                allColors.push(color);
            });
            setSelectedColors(allColors);
        }
        setSelectAllColors((prevSelectAll) => !prevSelectAll);
    };

    const handleCheckboxClick = (event, type, value) => {
        const clickedValue = event.target.id;
        if (type === "materials") {
            setSelectedMaterial((prevSelectedValues) =>
                prevSelectedValues.includes(clickedValue)
                    ? prevSelectedValues.filter((value) => value !== clickedValue)
                    : [...prevSelectedValues, clickedValue]
            );
            setSelectedAllMaterials(false)
        }
        if (type === "print_methods") {
            setSelectPrintMethods((prevSelectedValues) =>
                prevSelectedValues.includes(clickedValue)
                    ? prevSelectedValues.filter((value) => value !== clickedValue)
                    : [...prevSelectedValues, clickedValue]
            );
            setSelectAllPrintMethods(false)
        }
    };


    Object?.entries(responseData)?.forEach((value) => {
        const words = value[0].split('_');
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        let jsx;
        if (value[0] !== "colors" && value[0] !== "price_range" && value[0] !== "stock_available") {
            jsx = <div className='pb-3'>
                {Object.entries(value[1]).map((val) => (
                    <div key={val[0]} className='flex gap-2 items-center'>
                        <input
                            type="checkbox"
                            id={val[0]}
                            onChange={(event) => handleCheckboxClick(event, value[0], value[1])}
                            className="hidden"
                            checked={selectedMaterial.includes(val[0]) || selectPrintMethods.includes(val[0])}
                        />
                        <label
                            htmlFor={val[0]}
                            className={`cursor-pointer relative my-1 flex items-center text-gray-700`}
                        >
                            <div className="w-5 h-5 mr-2 border border-gray-300 rounded-full flex items-center justify-center">
                                <div className={`w-3 h-3 rounded-full ${selectedMaterial.includes(val[0]) || selectPrintMethods.includes(val[0]) ? 'bg-yellow-300' : ''}`}></div>
                            </div>
                            <span className="flex-1">{val[0]}({val[1]})</span>
                        </label>
                    </div>
                ))}
            </div>
            items.push({ title: capitalizedWords.join(' '), content: jsx, selectAllMethod: () => handleSelectAllClick(value[0], value[1]), selectAllState: { selectedAllMaterials, selectAllPrintMethods } })
        }
        if (value[0] === "colors") {
            jsx = <div className="flex flex-wrap gap-4 m-1 pb-3">
                {Object.entries(value[1]).map(([color]) => (
                    <div
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`cursor-pointer w-8 h-8 rounded-full shadow-md ${selectedColors.includes(color) ? 'border-[3px] rounded-full ring-2 ring-[#FFCD00]' : 'border'
                            }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    ></div>
                ))}
            </div>
            items.push({ title: capitalizedWords.join(' '), content: jsx, data: value[1], selectAllMethod: handleColorToggleSelectAll, selectAllState: selectAllColors })
        }

        if (value[0] === "stock_available") {
            jsx = <div>
                {Object.entries(value[1]).map((stock, index) => (
                    <div key={index} className='mb-1'>
                        <Slider
                            size="small"
                            value={stockSliderValues ? stockSliderValues.min : stock[1].stock_minimum_quantity}
                            min={stock[1].stock_minimum_quantity}
                            max={stock[1].stock_maximum_quantity}
                            defaultValue={stock[1].stock_minimum_quantity} // Set default value here
                            aria-label="Small"
                            valueLabelDisplay="off"
                            onChange={(e, value) => setStockSliderValues({ min: value, max: stockSliderValues.max })}
                            sx={{
                                color: '#8A1E41',
                                '& .MuiSlider-rail': {
                                    height: '3px',
                                    color: '#53565B',
                                },
                                '&.Mui-active': {
                                    boxShadow: 'none',
                                },
                                '&.MuiSlider-root': {
                                    marginX: "0.5rem",
                                    width: "96%"
                                },
                                '& .MuiSlider-thumb': {
                                    height: '15px',
                                    width: '15px',
                                    backgroundColor: '#8A1E41',
                                    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
                                    '&:focus, &:hover, &.Mui-active': {
                                        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                                        '@media (hover: none)': {
                                            boxShadow: "none",
                                        },
                                    },
                                    '&:before': {
                                        boxShadow:
                                            '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
                                    },
                                },
                                '& .Mui-focusVisible': {
                                    '& .MuiSlider-thumb': {
                                        boxShadow: 'none !important', // Remove the focus shadow
                                    },
                                    '&.Mui-active': {
                                        boxShadow: 'none',
                                    },
                                },
                            }}
                        />
                        <div className="flex items-center mb-3">
                            <div className="flex p-2 border gap-12 w-fit rounded-lg">
                                <span className="text-gray-600 font-normal text-sm">Qty</span>
                                <span className="font-semibold">{stockSliderValues?.min}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            items.push({ title: capitalizedWords.join(' '), content: jsx, selectAllMethod: null, selectAllState: null })
        }

        if (value[0] === "price_range") {
            jsx = <div>
                {Object.entries(value[1]).map((range, index) => (
                    <div key={index} className="mb-4 mt-2">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Slider
                                min={range[1]?.price_minimum_value}
                                max={range[1]?.price_maximum_value}
                                value={[priceSliderValues.min, priceSliderValues.max]}
                                onChange={(_, newValue) =>
                                    setPriceSliderValues({ min: newValue[0], max: newValue[1] })
                                }
                                onChangeCommitted={(_, newValue) =>
                                    setPriceSliderValues({ min: newValue[0], max: newValue[1] })
                                }
                                sx={{
                                    color: '#8A1E41',
                                    '& .MuiSlider-rail': {
                                        height: '3px',
                                        color: '#53565B',
                                    },
                                    '&.Mui-active': {
                                        boxShadow: 'none',
                                    },
                                    '&.MuiSlider-root': {
                                        marginX: "0.5rem",
                                        width: "96%"
                                    },
                                    '& .MuiSlider-thumb': {
                                        height: '15px',
                                        width: '15px',
                                        backgroundColor: '#8A1E41',
                                        boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
                                        '&:focus, &:hover, &.Mui-active': {
                                            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                                            '@media (hover: none)': {
                                                boxShadow: "none",
                                            },
                                        },
                                        '&:before': {
                                            boxShadow:
                                                '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
                                        },
                                    },
                                    '& .Mui-focusVisible': {
                                        '& .MuiSlider-thumb': {
                                            boxShadow: 'none !important', // Remove the focus shadow
                                        },
                                        '&.Mui-active': {
                                            boxShadow: 'none',
                                        },
                                    },
                                }}
                            />
                        </Box>
                        <div className="mt-2 flex gap-4 items-center text-sm">
                            <div className="flex p-2 border gap-10 w-fit mt-2 rounded-lg">
                                <span className="text-gray-600 font-medium">$</span>
                                <span className="font-semibold">{priceSliderValues?.min?.toFixed(2)}</span>
                            </div>
                            -
                            <div className="flex p-2 border gap-10 w-fit mt-2 rounded-lg">
                                <span className="text-gray-600 font-medium">$</span>
                                <span className="font-semibold">{priceSliderValues?.max?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            items.push({ title: capitalizedWords.join(' '), content: jsx, selectAllMethod: null, selectAllState: null })
        }

    })


    return (
        <div>
            <div onClick={onClose} className={`fixed top-0 left-0 h-full w-full bg-black opacity-50 z-40 ${isOpen ? 'block' : 'hidden'}`}></div>
            <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <button onClick={onClose} className={`absolute ${isOpen ? 'top-4 sm:-left-4' : 'hidden'} top-4 self-end p-2 text-gray-700 hover:bg-amber-200 bg-[#FFCD00] cursor-pointer`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div className='flex items-center justify-center p-6 border-b'>
                    <h2 className="text-2xl font-semibold ">Filter</h2>
                </div>
                <div>
                    <div className="flex flex-col h-full p-4">
                        <div className="mb-4">
                            <FilterModalAccordion items={items} />
                        </div>
                    </div>
                </div>
                <div className='fixed bottom-2 right-2'>
                    <button onClick={handleApplyFilter} className="px-7 py-3.5 hover:bg-amber-200  bg-[#FFCD00] rounded w-fit text-center text-base font-semibold">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
