"use client"
import { sendRequest } from "@/helpers/utils";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
export default function StepperTwo({ onSubmitComplete, step, setStepNo, }) {
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [subCategory, setSubCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState({});
    const [vendor, setVendor] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState({});
    const [brandingSolution, setBrandingSolution] = useState([]);
    const [selectedBranding, setSelectedBranding] = useState({});
    const [selectedVariation, setSelectedVariation] = useState({});
    const [variation, setVariation] = useState([]);

    useEffect(() => {
        const getData = async () => {
            //Category Data
            const { data: categoryData } = await sendRequest(`/api/categories/summary`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setSelectedCategory(categoryData?.[0]?.id)
            setCategory(categoryData);

            //Vendor Data
            const { data: VendorData } = await sendRequest(`/api/vendors/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setVendor(VendorData);
            setSelectedVendor(VendorData?.[0]?.id)

            //Branding Solution ID
            const { data: BrandingData } = await sendRequest(`/api/branding_solutions/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setBrandingSolution(BrandingData);
            setSelectedBranding(BrandingData?.[0]?.id)
           

            //Variation ID
            const { data: VariationData } = await sendRequest(`/api/variations/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setVariation(VariationData);
            setSelectedVariation(VariationData?.[0]?.id)
        };
        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            //SubCategory Data
            const { data: subCategoryData } = await sendRequest(`/api/sub_category/?category_id=${selectedCategory}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setSelectedSubCategory(subCategoryData?.[0]?.id)
            setSubCategory(subCategoryData)
        };
        if (selectedCategory) {
            getData();
        }
    }, [selectedCategory])

    const handleNext = () => {
        const exportData = {
            category_id: selectedCategory,
            sub_category_id: selectedSubCategory,
            vendor_id: selectedVendor,
            branding_solution_id:selectedBranding,
            variation_id:selectedVariation,
        }
        onSubmitComplete(exportData)
    }

    return <>
        <div className="w-full">
            <label
                htmlFor={'categoryName'}
                className="block mb-2 text-2xl font-bold mt-[20px] text-gray-500"
            >
                Category
            </label>
            <select
                id="categoryName"
                required={true}
                type={'dropdown'}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm block w-full"
            >
                <option value="">Select</option>
                {category.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                        {eachValue.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full">
            <label
                htmlFor={'subCategoryName'}
                className="block mb-2 text-2xl font-bold mt-[20px] text-gray-500"
            >
                Sub Category
            </label>
            <select
                id="subCategoryName"
                required={true}
                type={'dropdown'}
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
            >
                <option value="">Select</option>
                {selectedCategory && subCategory?.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                        {eachValue.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full">
            <label
                htmlFor={'vendorName'}
                className="block mb-2 text-2xl font-bold mt-[20px] text-gray-500"
            >
               Vendor
            </label>
            <select
                id="vendorName"
                required={true}
                type={'dropdown'}
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
            >
                <option value="">Select</option>
                {vendor?.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                        {eachValue.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full">
            <label
                htmlFor={'vendorName'}
                className="block mb-2 text-2xl font-bold mt-[20px] text-gray-500"
            >
               Branding Solution
            </label>
            <select
                id="vendorName"
                required={true}
                type={'dropdown'}
                value={selectedBranding}
                onChange={(e) => setSelectedBranding(e.target.value)}
                className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
            >
                <option value="">Select</option>
                {brandingSolution?.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                        {eachValue.title}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full">
            <label
                htmlFor={'vendorName'}
                className="block mb-2 text-2xl font-bold mt-[20px] text-gray-500"
            >
               Variation
            </label>
            <select
                id="vendorName"
                required={true}
                type={'dropdown'}
                value={selectedVariation}
                onChange={(e) => setSelectedVariation(e.target.value)}
                className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
            >
                <option value="">Select</option>
                {variation?.map((eachValue, index) => (
                    <option key={index} value={eachValue.id}>
                        {eachValue.name}
                    </option>
                ))}
            </select>
        </div>
        <div className='flex justify-between mt-8'>
            {!step <= 0 && <button onClick={() => setStepNo(step - 1)} className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                Back
            </button>}
            <button onClick={handleNext} className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                Next
            </button>
        </div>
    </>
}