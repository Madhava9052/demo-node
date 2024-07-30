'use client';

function Pagination({
  total_count,
  offsetCount,
  showTextOnly,
  url,
  queryString,
  noRedirect,
  callback
}) {
  const resultsPerPage = 10;
  const currentPage = offsetCount / resultsPerPage + 1;

  const totalPages = Math.ceil(total_count / resultsPerPage);

  const maxPagesToShow = 5;
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
        <p className="text-[16px]">
          Showing {offsetCount + 1}–
          {Math.min(
            resultsPerPage * (offsetCount / resultsPerPage) + resultsPerPage,
            total_count
          )}{' '}
          of {total_count} results
        </p>
      )}
      {!showTextOnly && (
        <>
          <div className="py-4 flex items-center gap-2 flex-wrap justify-center">
            <a
              disabled={currentPage === 1 ? true : false}
              onClick={() => {
                noRedirect && callback(offsetCount - resultsPerPage)
              }}
              href={noRedirect ? "#" : `${url}?offset=${offsetCount - resultsPerPage}&${
                queryString ? queryString : ''
              }`}
              className={`border-2 border-solid hover:border-[#8A1E41] py-2 px-4 ${
                currentPage === 1 ? 'pointer-events-none' : ''
              }`}
            >
              &lt;
            </a>
            {pageNumbers.map((pageNumber) => (
              <a
                key={pageNumber}
                onClick={() => {
                  noRedirect && callback(resultsPerPage * (pageNumber - 1))
                }}
                href={noRedirect ? "#" : `${url}?offset=${resultsPerPage * (pageNumber - 1)}&${
                  queryString ? queryString : ''
                }`}
                className={`border-2 border-solid hover:border-[#8A1E41] py-2 px-4 ${
                  currentPage === pageNumber
                    ? 'border-[#8A1E41] pointer-events-none'
                    : ''
                }`}
              >
                {pageNumber}
              </a>
            ))}
            <a
              onClick={() => {
                noRedirect && callback(offsetCount + resultsPerPage)
              }}
              href={noRedirect ? "#" : `${url}?offset=${offsetCount + resultsPerPage}&${
                queryString ? queryString : ''
              }`}
              className={`border-2 border-solid hover:border-[#8A1E41] py-2 px-4  ${
                currentPage === totalPages ? 'pointer-events-none' : ''
              } `}
            >
              &gt;
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default Pagination;
