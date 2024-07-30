export default function DeleteAlertModal({
  headMessage,
  bodyMessage,
  onSuccess,
  onFailure,
}) {
  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center"
    >
      <div className="relative w-full max-w-sm max-h-full">
        <div className="relative flex flex-col items-center border-t-4 border-red-600 bg-white rounded-lg shadow">
          <div className="pt-4">
            <svg
              class="w-8 h-8 text-red-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
            </svg>
          </div>
          <div className="flex items-center justify-between pb-4 pt-2 rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">
              {headMessage}
            </h3>
            <button
              type="button"
              onClick={onFailure}
              className="text-gray-600 absolute top-2 right-4 bg-transparent  hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              data-modal-hide="default-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-base leading-relaxed text-gray-500  text-center">
              {bodyMessage}
            </p>
          </div>
          <div className="flex items-center p-4 space-x-4 border-gray-200 rounded-b ">
            <button
              onClick={onFailure}
              data-modal-hide="default-modal"
              type="button"
              className="bg-white border border-red-300 text-caption-20 hover:bg-red-50 block rounded px-4 py-1 font-medium text-red-600"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              data-modal-hide="default-modal"
              type="button"
              className="bg-red-600 text-caption-20 hover:bg-red-400 block rounded px-4 py-1 font-medium text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
