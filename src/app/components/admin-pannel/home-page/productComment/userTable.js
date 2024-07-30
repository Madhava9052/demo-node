"use client"
import TableSkeleton from "@/app/components/common/tableSkeleton"
import { useState } from "react"

const UserTable = ({data, searchTerm, setSearchTerm, handleSearch, handleRemove, handleAdd, selectedProducts}) => {

    const handleCheck = (id, checked) => {
        checked ? handleAdd(id) : handleRemove(id)
    }

    return(
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                        placeholder="Search product"
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white uppercase bg-[#8A1E41] dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            First Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Last Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!data ? (
                        <TableSkeleton rows={10} columns={5} />
                    ) : !data.length ? (
                    <tr>
                        <td colSpan={5} className="py-2 text-center">
                        No data found
                        </td>
                    </tr>
                    ) : data.map((each, index) => {
                        const checked = selectedProducts.find(eachItem => eachItem.id === each.id)
                        return(
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            checked={checked !== undefined}
                                            onChange={(e) => handleCheck(each.id, e.target.checked)}
                                            id="checkbox-table-search-1"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {each.first_name ? each.first_name : "-"}
                                </th>
                                <td className="px-6 py-4">
                                    {each.last_name ? each.last_name : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    {each.email.length ? each.email[0].email : "-"}
                                </td>
                            </tr>
                        )})}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable