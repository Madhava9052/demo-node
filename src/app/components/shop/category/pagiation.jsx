'use client';
import { useState } from 'react';

function Pagination({
  responseData,
  offsetCount,
  showTextOnly,
  url,
  categoryName,
  categoryId,
  queryString,
  noRedirect,
  callback,
  recordsPerPage,
}) {
  const [searchPage, setSearchPage] = useState('')

  const resultsPerPage = recordsPerPage ? recordsPerPage : 24;
  const currentPage = offsetCount / resultsPerPage + 1;

  const totalPages = Math.ceil(responseData.count / resultsPerPage);

  const maxPagesToShow = 3;
  const pagesBeforeAndAfter = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(currentPage - pagesBeforeAndAfter, 1);
  let endPage = Math.min(currentPage + pagesBeforeAndAfter, totalPages);

  if (endPage - startPage + 1 < maxPagesToShow) {
    if (currentPage <= totalPages / 2) {
      endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    } else {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {showTextOnly && (
        <p className="text-[12px] sm:text-[16px]">
          Showing {offsetCount + 1}–
          {Math.min(
            resultsPerPage * (offsetCount / resultsPerPage) + resultsPerPage,
            responseData.count
          )}{' '}
          of {responseData.count} results
        </p>
      )}
      {!showTextOnly && (
        <>
          <div className="py-4 flex items-center flex-wrap justify-center">
            <a
              disabled={currentPage === 1 ? true : false}
              onClick={() => {
                noRedirect && callback(0);
              }}
              href={
                noRedirect
                  ? '#'
                  : `/category/${categoryName}/${categoryId}?offset=${0}&${
                      queryString ? queryString : ''
                    }`
              }
              className={`border border-solid py-[18px] hover:border-[#FFCD00] px-6 ${
                currentPage === 1 ? 'pointer-events-none' : ''
              }`}
            >
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.5"
                  y1="12"
                  x2="0.499999"
                  y2="2.02259e-08"
                  stroke="black"
                />
                <path
                  d="M9.6779 12L10.3037 11.3763L4.94495 6L10.3037 0.623745L9.67791 -5.47097e-08L3.69743 6L9.6779 12Z"
                  fill="#231F20"
                />
              </svg>
            </a>
            <a
              disabled={currentPage === 1 ? true : false}
              onClick={() => {
                noRedirect && callback(offsetCount - resultsPerPage);
              }}
              href={
                noRedirect
                  ? '#'
                  : `/category/${categoryName}/${categoryId}?offset=${offsetCount - resultsPerPage}&${
                      queryString ? queryString : ''
                    }`
              }
              className={`border border-solid py-[18px] hover:border-[#FFCD00] px-6 ${
                currentPage === 1 ? 'pointer-events-none' : ''
              }`}
            >
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.6779 12L7.30371 11.3763L1.94495 6L7.30371 0.623745L6.67791 -5.47097e-08L0.697435 6L6.6779 12Z"
                  fill="#231F20"
                />
              </svg>
            </a>
            {pageNumbers.map((pageNumber) => (
              <a
                key={pageNumber}
                onClick={() => {
                  noRedirect && callback(resultsPerPage * (pageNumber - 1));
                }}
                href={
                  noRedirect
                    ? '#'
                    : `/category/${categoryName}/${categoryId}?offset=${resultsPerPage * (pageNumber - 1)}&${
                        queryString ? queryString : ''
                      }`
                }
                className={`border-y border-solid py-[9px] px-4 text-[20px] font-semibold ${
                  currentPage === pageNumber
                    ? 'text-[#FFCD00] border-b-[#FFCD00] border-b-2 pointer-events-none'
                    : ''
                }`}
              >
                {pageNumber}
              </a>
            ))}
            <a
              onClick={() => {
                noRedirect && callback(offsetCount + resultsPerPage);
              }}
              href={
                noRedirect
                  ? '#'
                  : `/category/${categoryName}/${categoryId}?offset=${offsetCount + resultsPerPage}&${
                      queryString ? queryString : ''
                    }`
              }
              className={`border border-solid py-[18px] hover:border-[#FFCD00] px-6  ${
                currentPage === totalPages ? 'pointer-events-none' : ''
              } `}
            >
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.3221 12L0.696289 11.3763L6.05505 6L0.696288 0.623745L1.32209 -5.47097e-08L7.30257 6L1.3221 12Z"
                  fill="#231F20"
                />
              </svg>
            </a>
            <a
              onClick={() => {
                noRedirect && callback(resultsPerPage * (totalPages - 1));
              }}
              href={
                noRedirect
                  ? '#'
                  : `/category/${categoryName}/${categoryId}?offset=${resultsPerPage * (totalPages - 1)}&${
                      queryString ? queryString : ''
                    }`
              }
              className={`border border-solid py-[18px] hover:border-[#FFCD00] px-6  ${
                currentPage === totalPages ? 'pointer-events-none' : ''
              } `}
            >
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="12.5"
                  y1="-6.39373e-08"
                  x2="12.5"
                  y2="12"
                  stroke="black"
                />
                <path
                  d="M3.3221 0L2.69629 0.623745L8.05505 6L2.69629 11.3763L3.3221 12L9.30257 6L3.3221 0Z"
                  fill="#231F20"
                />
              </svg>
            </a>
            <div className="ml-8 flex items-center">
              <input
                className="border remove-arrow w-[70px] h-[50px] flex justify-center items-center text-center text-[20px] text-[#B0B0B0]"
                type="number"
                id="enterPageNo"
                name="enterPageNo"
                min="0"
                max={totalPages}
                value={searchPage}
                onChange={(e) => {
                  setSearchPage(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (noRedirect) {
                      callback(resultsPerPage * (searchPage - 1));
                    } else {
                      window.location.href = `/category/${categoryName}/${categoryId}?offset=${resultsPerPage * (searchPage - 1)}&${queryString ? queryString : ''}`;
                    }
                  }
                }}
              />
              <p className="text-[20px] pl-3 text-[#B0B0B0]">of {totalPages}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Pagination;
