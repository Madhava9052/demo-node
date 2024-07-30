"use client";
import { sendRequest } from "@/helpers/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useState, useEffect } from "react";
import { VENDORS_PAGE_ROUTES } from "@/constants/admin-pannel/routes";
import { API_RESPONSE_STATUS } from "@/constants/variablesNames";

const CustomLink = ({ title, link }) => (
  <Link title={title} href={link}>
    <svg
      className="mx-[6px] w-[30px] h-[30px] sm:w-9 sm:h-9 border rounded-full"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="white" />
      <path
        d="M12 6V18"
        stroke="#b0b0b0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12H18"
        stroke="#b0b0b0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Link>
);

export default function VendorCreationSteptwo({ step, vendorData }) {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoryData } = await sendRequest("/api/categories/summary", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setCategory(categoryData);
        setSelectedCategory(categoryData?.[0]?.id || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data: subCategoryData } = await sendRequest(
          `/api/sub_category/?category_id=${selectedCategory}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setSubCategory(subCategoryData);
        setSelectedSubCategory(subCategoryData?.[0]?.id || "");
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      }
    };

    if (selectedCategory) {
      fetchSubCategories();
    }
  }, [selectedCategory]);

  const handleSubmit = async () => {
    const bodyData = {
      category_id: selectedCategory,
      sub_category_id: selectedSubCategory,
      vendor_id: vendorData?.id,
    };
    try {
      const response = await sendRequest("/api/vendor_categories", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(bodyData),
        method: "POST"
      });
      if (response.status === API_RESPONSE_STATUS.SUCCESS) {
        localStorage.removeItem("vendorData");
        window.location.href = VENDORS_PAGE_ROUTES.LIST
      }
    }
    catch (error) {
      console.error("Error", error)
    }
    console.log("bodyData", bodyData);
  };

  return (
    <>
      <h3 className=" flex items-center gap-2 text-[#8A1E41] font-semibold text-lg">Select for {vendorData?.name} {vendorData?.id}</h3>
      <div className="w-full">
        <label
          htmlFor="categoryName"
          className="block mb-2 text-sm capitalize font-semibold mt-[20px] text-gray-900"
        >
          Category
        </label>
        <div className="flex items-center gap-8">
          <select
            id="categoryName"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm block w-full"
          >
            <option value="">Select</option>
            {category.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <CustomLink title="Add new Category" link="/admin/product-listing/category/create?from=vendor" />
        </div>
      </div>

      <div className="w-full">
        <label
          htmlFor="subCategoryName"
          className="block mb-2 text-sm capitalize font-semibold mt-[20px] text-gray-900"
        >
          Sub Category
        </label>
        <div className="flex items-center gap-8">
          <select
            id="subCategoryName"
            required
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm block w-full"
          >
            <option value="">Select</option>
            {subCategory.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
          <CustomLink title="Add new Sub Category" link="/admin/product-listing/sub-category/create/?from=vendor" />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        {step > 0 && (
          <Link
            onClick={() => localStorage.removeItem("vendorData")}
            href={VENDORS_PAGE_ROUTES.LIST}
            className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]"
          >
            Skip
          </Link>
        )}
        <button
          onClick={handleSubmit}
          className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]"
        >
          Submit
        </button>
      </div>
    </>
  );
}