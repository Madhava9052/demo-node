import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ColorFilter = ({ color, onRemove }) => (
    <div key={`color-${color}`} className="bg-white flex flex-wrap gap-1 items-center py-[10px] pr-2 pl-4 min-w-fit rounded-full">
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />
        <span onClick={() => onRemove(color)} className="w-6 h-6 flex cursor-pointer items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2915 0.294846C10.682 -0.095678 11.3152 -0.095678 11.7057 0.294846C12.0962 0.685371 12.0962 1.31854 11.7057 1.70906L7.41401 6.00077L11.7057 10.2925C12.0962 10.683 12.0962 11.3162 11.7057 11.7067C11.3152 12.0972 10.682 12.0972 10.2915 11.7067L5.9998 7.41498L1.70808 11.7067C1.31756 12.0972 0.684393 12.0972 0.293869 11.7067C-0.0966544 11.3162 -0.0966544 10.683 0.293869 10.2925L4.58558 6.00077L0.293875 1.70906C-0.0966489 1.31854 -0.0966489 0.685371 0.293875 0.294846C0.6844 -0.095678 1.31756 -0.095678 1.70809 0.294846L5.9998 4.58655L10.2915 0.294846Z" fill="#FFCD00" />
            </svg>
        </span>
    </div>
);

const MaterialOrPrintMethodFilter = ({ item, onRemove }) => (
    <div key={`filter-${item}`} className="bg-white flex justify-between gap-1 items-center h-[44px] min-w-fit py-[10px] px-[8px] rounded-full overflow-hidden">
        <span className="text-md ml-2 font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">{item}</span>
        <span onClick={() => onRemove(item)} className="w-6 h-6 flex cursor-pointer items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2915 0.294846C10.682 -0.095678 11.3152 -0.095678 11.7057 0.294846C12.0962 0.685371 12.0962 1.31854 11.7057 1.70906L7.41401 6.00077L11.7057 10.2925C12.0962 10.683 12.0962 11.3162 11.7057 11.7067C11.3152 12.0972 10.682 12.0972 10.2915 11.7067L5.9998 7.41498L1.70808 11.7067C1.31756 12.0972 0.684393 12.0972 0.293869 11.7067C-0.0966544 11.3162 -0.0966544 10.683 0.293869 10.2925L4.58558 6.00077L0.293875 1.70906C-0.0966489 1.31854 -0.0966489 0.685371 0.293875 0.294846C0.6844 -0.095678 1.31756 -0.095678 1.70809 0.294846L5.9998 4.58655L10.2915 0.294846Z" fill="#FFCD00" />
            </svg>
        </span>
    </div>
);

const PriceFilter = ({ min, max, onRemove }) => (
    <div key="price-filter" className="bg-white flex justify-between gap-1 items-center h-11 py-3 px-2 min-w-fit rounded-full">
        <span className="text-md ml-2 font-semibold whitespace-nowrap">from ${min} - ${max}</span>
        <span onClick={() => onRemove("price")} className="w-6 h-6 cursor-pointer flex mr-2 items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2915 0.294846C10.682 -0.095678 11.3152 -0.095678 11.7057 0.294846C12.0962 0.685371 12.0962 1.31854 11.7057 1.70906L7.41401 6.00077L11.7057 10.2925C12.0962 10.683 12.0962 11.3162 11.7057 11.7067C11.3152 12.0972 10.682 12.0972 10.2915 11.7067L5.9998 7.41498L1.70808 11.7067C1.31756 12.0972 0.684393 12.0972 0.293869 11.7067C-0.0966544 11.3162 -0.0966544 10.683 0.293869 10.2925L4.58558 6.00077L0.293875 1.70906C-0.0966489 1.31854 -0.0966489 0.685371 0.293875 0.294846C0.6844 -0.095678 1.31756 -0.095678 1.70809 0.294846L5.9998 4.58655L10.2915 0.294846Z" fill="#FFCD00" />
            </svg>
        </span>
    </div>
);

const StockFilter = ({ min, onRemove }) => (
    <div key="stock-filter" className="bg-white flex justify-between gap-1 items-center h-11 py-3 px-2 min-w-fit rounded-full">
        <span className="text-md ml-2 font-semibold whitespace-nowrap">Qty {min}</span>
        <span onClick={() => onRemove("stock")} className="w-6 h-6 cursor-pointer flex mr-2 items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2915 0.294846C10.682 -0.095678 11.3152 -0.095678 11.7057 0.294846C12.0962 0.685371 12.0962 1.31854 11.7057 1.70906L7.41401 6.00077L11.7057 10.2925C12.0962 10.683 12.0962 11.3162 11.7057 11.7067C11.3152 12.0972 10.682 12.0972 10.2915 11.7067L5.9998 7.41498L1.70808 11.7067C1.31756 12.0972 0.684393 12.0972 0.293869 11.7067C-0.0966544 11.3162 -0.0966544 10.683 0.293869 10.2925L4.58558 6.00077L0.293875 1.70906C-0.0966489 1.31854 -0.0966489 0.685371 0.293875 0.294846C0.6844 -0.095678 1.31756 -0.095678 1.70809 0.294846L5.9998 4.58655L10.2915 0.294846Z" fill="#FFCD00" />
            </svg>
        </span>
    </div>
);

const ShowSelectedFilters = ({ filters, categoryId, categoryType, categoryName, responseData }) => {
    const [filtersData, setFiltersData] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const initialFiltersData = objectPropertiesToArray(filters);
            setFiltersData(initialFiltersData);
        }
    }, [filters]);

    function objectPropertiesToArray(obj) {
        const newObj = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                if (key !== "offset") {
                    if (typeof obj[key] === 'string') {
                        if (obj[key].includes(',')) {
                            newObj[key] = obj[key].split(',');
                        } else {
                            newObj[key] = [obj[key]];
                        }
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        return newObj;
    }

    const handleRemove = useMemo(
        () => (item) => {
            setFiltersData(prevFiltersData => {
                let updatedFiltersData = { ...prevFiltersData };
                for (let key in updatedFiltersData) {
                    if (Array.isArray(updatedFiltersData[key])) {
                        updatedFiltersData[key] = updatedFiltersData[key].filter(value => value !== item);
                    }
                }
                if (item === "stock") {
                    updatedFiltersData["min_stock_qty"] = [];
                    updatedFiltersData["max_stock_qty"] = [];
                } else if (item === "price") {
                    updatedFiltersData["max_price"] = [];
                    updatedFiltersData["min_price"] = [];
                }
                return updatedFiltersData;
            });
        },
        []
    );

    useEffect(() => {
        if (filtersData) {
            let queryString = `?offset=${filters?.offset || 0}`;
            let queryObject = {
                colors: (filtersData?.colors || []).map(color => color.split("#").join("%23")).join(","),
                materials: (filtersData?.materials || []).join(","),
                print_methods: (filtersData?.print_methods || []).join(","),
                min_stock_qty: (filtersData?.min_stock_qty || []).join(""),
                max_stock_qty: (filtersData?.max_stock_qty || []).join(""),
                min_price: (filtersData?.min_price || []).join(""),
                max_price: (filtersData?.max_price || []).join("")
            };

            Object.keys(queryObject).forEach(key => {
                if (queryObject[key]) {
                    queryString = queryString ? queryString + '&' + key + '=' + queryObject[key] : queryString + "?" + key + "=" + queryObject[key];
                } else {
                    queryString = queryString + "";
                }
            });

            const formatSubCategoryName = categoryName
                .toLowerCase()
                .split(' ')
                .join('-');

            router.push(`/category/${formatSubCategoryName}/${categoryId}${queryString}`);
        }
    }, [filtersData, router, categoryName, categoryId]);

    return (
        <>
            {(filtersData && Object.keys(filtersData).length > 0 && Object.keys(Object.fromEntries(searchParams)).length > 0) && <section className="mb-10 w-full overflow-x-scroll no-scrollbar bg-[#F7F7F7] h-[84px] justify-items-start flex">
                <div className="container mx-auto flex gap-4 items-center">
                    {(filtersData && Object.keys(filtersData).length > 0 && typeof filtersData !== null) &&
                        <Swiper
                            grabCursor
                            spaceBetween={10}
                            slidesPerView="auto"
                            freeMode={true}
                            className="mySwiper !mx-0"
                        >
                            {filtersData.colors?.map((color, index) => (
                                <SwiperSlide key={`color-${color}`} className="!w-auto">
                                    <ColorFilter color={color} onRemove={handleRemove} />
                                </SwiperSlide>
                            ))}
                            {filtersData.materials?.map((material, index) => (
                                <SwiperSlide key={`material-${material}`} className="!w-auto">
                                    <MaterialOrPrintMethodFilter item={material} onRemove={handleRemove} />
                                </SwiperSlide>
                            ))}
                            {filtersData.print_methods?.map((method, index) => (
                                <SwiperSlide key={`print-method-${method}`} className="!w-auto">
                                    <MaterialOrPrintMethodFilter item={method} onRemove={handleRemove} />
                                </SwiperSlide>
                            ))}
                            {(filtersData?.max_price?.length > 0 && filtersData?.min_price?.length > 0) && (
                                <SwiperSlide key="price-filter" className="!w-auto">
                                    <PriceFilter
                                        min={filtersData?.min_price?.[0]}
                                        max={filtersData?.max_price?.[0]}
                                        onRemove={handleRemove}
                                    />
                                </SwiperSlide>
                            )}
                            {filtersData?.min_stock_qty?.length > 0 && (
                                <SwiperSlide key="stock-filter" className="!w-auto">
                                    <StockFilter
                                        min={filtersData?.min_stock_qty[0]}
                                        onRemove={handleRemove}
                                    />
                                </SwiperSlide>
                            )}
                        </Swiper>}
                </div>
            </section>}
        </>
    );
};

export default ShowSelectedFilters;