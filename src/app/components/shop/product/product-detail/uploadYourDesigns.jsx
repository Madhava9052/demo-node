import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { uploadToServer } from '@/helpers/utils';
import Link from 'next/link';
import { useState, Fragment } from 'react';

export default function UploadYourDesigns({
  setProductDetailForm,
  productDetailForm,
  editParams
}) {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const [fileLimitReached, setFileLimitReached] = useState(false);
  const [shareYourDesignsFiles, setShareYourDesignsFiles] = useState({
    avatarImageUrl: '',
    serverImageUrlsWithName: [],
    successMessage: '',
    errorMessage: '',
    uploadingFrontDesign: false,
    uploadingBackDesign: false,
  });

  const uploadImage = async (event, uploadType) => {
    // Check if the limit of two files per section is reached
    if (
      (uploadType === 'FRONT_DESIGN' &&
        productDetailForm.uploadYourDesignUrls.filter(
          (file) => file.type === 'FRONT_DESIGN'
        ).length >= 5) ||
      (uploadType === 'BACK_DESIGN' &&
        productDetailForm.uploadYourDesignUrls.filter(
          (file) => file.type === 'BACK_DESIGN'
        ).length >= 2)
    ) {
      setFileLimitReached(true);
      return;
    }
    // Continue with the upload process
    setShareYourDesignsFiles({
      ...shareYourDesignsFiles,
      ...(uploadType === 'FRONT_DESIGN'
        ? { uploadingFrontDesign: true }
        : { uploadingBackDesign: true }),
    });
    // Get the selected image file
    const image = event.target.files?.[0];
    const fileName = event.target.files?.[0]?.name;

    const path = `/api/products/${productDetailForm.product_id}/file/?type=${uploadType}`;
    // Upload the image to the server and wait for the response
    const responseData = await uploadToServer(event, path);

    // Check if the server response indicates success
    if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
      setShareYourDesignsFiles({
        ...shareYourDesignsFiles,
        serverImageUrlsWithName: [
          ...shareYourDesignsFiles.serverImageUrlsWithName,
          ...responseData.data,
        ],
        successMessage: responseData.message,
      });
      setProductDetailForm({
        ...productDetailForm,
        submitLater: false,
        uploadYourDesignUrls: [
          ...productDetailForm.uploadYourDesignUrls,
          ...responseData.data,
        ],
        isLoading: true,
      });
      setTimeout(() => {
        setShareYourDesignsFiles({
          ...shareYourDesignsFiles,
          serverImageUrlsWithName: [
            ...shareYourDesignsFiles.serverImageUrlsWithName,
            ...responseData.data,
          ],
          successMessage: '',
          errorMessage: '',
        });
      }, 5000);
    }
  };

  const handleRemoveFile = (imageID, mode = "") => {
    console.log("imageID", imageID, mode)
    const filteredImages = shareYourDesignsFiles.serverImageUrlsWithName.filter(
      (image) => image.id !== imageID
    );
    setShareYourDesignsFiles({
      ...shareYourDesignsFiles,
      serverImageUrlsWithName: filteredImages,
    });
    if (mode = "edit" && imageID) {
      const editUploadFiles = productDetailForm.uploadYourDesignUrls.filter(
        (image) => image.id !== imageID
      );
      setProductDetailForm({
        ...productDetailForm,
        uploadYourDesignUrls: editUploadFiles
      })
    }
  };

  function getFileIcon(image) {
    const fileType = image.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType)) {
      return (
        <img className="w-10 h-10" src={image.url} alt={image.name} />
      );
    } else if (['doc', 'docx', 'pdf', 'xls', 'xlsx', 'pptx' ,"txt"].includes(fileType)) {
      return (
        <svg className="w-10 h-10 fill-current text-gray-700 hover:text-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_iconCarrier">
            <path fillRule="evenodd" clipRule="evenodd" d="M7 3C5.89543 3 5 3.89543 5 5V17.2C5 18.0566 5.00078 18.6389 5.03755 19.089C5.07337 19.5274 5.1383 19.7516 5.21799 19.908C5.40973 20.2843 5.7157 20.5903 6.09202 20.782C6.24842 20.8617 6.47262 20.9266 6.91104 20.9624C7.36113 20.9992 7.94342 21 8.8 21H15.2C16.0566 21 16.6389 20.9992 17.089 20.9624C17.5274 20.9266 17.7516 20.8617 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C18.8617 19.7516 18.9266 19.5274 18.9624 19.089C18.9992 18.6389 19 18.0566 19 17.2V13C19 10.7909 17.2091 9 15 9H14.25C12.4551 9 11 7.54493 11 5.75C11 4.23122 9.76878 3 8.25 3H7ZM10 1C16.0751 1 21 5.92487 21 12V17.2413C21 18.0463 21 18.7106 20.9558 19.2518C20.9099 19.8139 20.8113 20.3306 20.564 20.816C20.1805 21.5686 19.5686 22.1805 18.816 22.564C18.3306 22.8113 17.8139 22.9099 17.2518 22.9558C16.7106 23 16.0463 23 15.2413 23H8.75868C7.95372 23 7.28936 23 6.74817 22.9558C6.18608 22.9099 5.66937 22.8113 5.18404 22.564C4.43139 22.1805 3.81947 21.5686 3.43597 20.816C3.18868 20.3306 3.09012 19.8139 3.04419 19.2518C2.99998 18.7106 2.99999 18.0463 3 17.2413L3 5C3 2.79086 4.79086 1 7 1H10ZM17.9474 7.77263C16.7867 5.59506 14.7572 3.95074 12.3216 3.30229C12.7523 4.01713 13 4.85463 13 5.75C13 6.44036 13.5596 7 14.25 7H15C16.0712 7 17.0769 7.28073 17.9474 7.77263Z" ></path>
          </g>
        </svg>
      );
    }
  }

  return (
    <>
      <div className="mt-2">
        {(shareYourDesignsFiles.errorMessage ||
          shareYourDesignsFiles.successMessage) && (
            <AlertMessage
              name={shareYourDesignsFiles.errorMessage ? 'error' : 'success'}
              message={
                shareYourDesignsFiles.errorMessage ||
                shareYourDesignsFiles.successMessage
              }
              linkText={null}
              linkHref={null}
              textColor={
                shareYourDesignsFiles.errorMessage
                  ? 'text-red-800'
                  : 'text-green-800'
              }
              bgColor={
                shareYourDesignsFiles.errorMessage ? 'bg-red-50' : 'bg-green-50'
              }
              closeAction={() =>
                setShareYourDesignsFiles({
                  ...shareYourDesignsFiles,
                  errorMessage: '',
                  successMessage: '',
                })
              }
            />
          )}
        {fileLimitReached && (
          <AlertMessage
            name="error"
            message="You can upload only two Design files per section."
            textColor="text-red-800"
            bgColor="bg-red-50"
            closeAction={() => setFileLimitReached(false)}
          />
        )}
      </div>
      <div className="grid lg:grid-cols-3 items-start gap-2 mt-2">
        <label
          className={`${globalStore.userId ? 'cursor-pointer' : 'cursor-not-allowed'
            } py-2 text-black text-center font-montserrat text-base font-semibold leading-normal bg-white border-2 border-solid hover:border-yellow-400 ${productDetailForm.submitLater === false && (shareYourDesignsFiles.serverImageUrlsWithName.some(
              (file) => file.type === 'FRONT_DESIGN'
            ) || productDetailForm.uploadYourDesignUrls.some(
              (file) => file.type === 'FRONT_DESIGN'
            ))
              ? 'border-yellow-400'
              : ''
            }`}
        >
          {!globalStore.userId && (
            <>
              <small className="text-[#8A1E41]">
                Please login{' '}
                <Link className="text-blue-500" href="/user/login">
                  here
                </Link>{' '}
                to{' '}
              </small>
              <br />
            </>
          )}
          {shareYourDesignsFiles.uploadingFrontDesign ? (
            <Spinner bgColor1="white" bgColor2="#851B39" />
          ) : (
            '+ Upload Artwork'
          )}
          <input
            type="file"
            disabled={globalStore.userId ? false : true}
            className="w-0 h-0"
            onChange={(e) => uploadImage(e, 'FRONT_DESIGN')}
          />
        </label>
        <label
          className={`${globalStore.userId ? 'cursor-pointer' : 'cursor-not-allowed'
            } py-[8px] text-black text-center font-montserrat text-base font-semibold leading-normal bg-white border-2 border-solid hover:border-yellow-400 ${productDetailForm.submitLater
              ? 'border-yellow-400'
              : ''
            }`}
        >
          {!globalStore.userId && (
            <>
              <small className="text-[#8A1E41]">
                Please login{' '}
                <Link className="text-blue-500" href="/user/login">
                  here
                </Link>{' '}
                to{' '}
              </small>
              <br />
            </>
          )}
            <div className='flex justify-center'>
              {/* <input
                type='radio'
                onChange={(e) => {
                  setProductDetailForm({
                    ...productDetailForm,
                    submitLater: true,
                    uploadYourDesignUrls: []
                  })
                }}
                checked={productDetailForm?.submitLater}
                className='w-5 h-5 mr-3 text-blue-600 bg-gray-100 border-gray-300'
              />
              <span className=''>Submit Later</span> */}
              <label
                  htmlFor="submitLater"
                  className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                >
                  <input
                    id="submitLater"
                    type="radio"
                    name="submitLater"
                    checked={productDetailForm?.submitLater}
                    onChange={(e) => {
                      setProductDetailForm({
                        ...productDetailForm,
                        submitLater: true,
                        uploadYourDesignUrls: []
                      })
                    }}
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                    <div className="innerColor"></div>
                  </span>

                  <span className="ml-2.5  text-black  text-base font-semibold leading-normal tracking-normal">
                    Submit Later
                  </span>
                </label>
            </div>
        </label>
        {/* <label
          className={`${globalStore.userId ? 'cursor-pointer' : 'cursor-not-allowed'
            } py-3.5 text-black text-center font-montserrat text-base font-semibold leading-normal  bg-white border-2 border-solid hover:border-yellow-400 ${shareYourDesignsFiles.serverImageUrlsWithName.some(
              (file) => file.type === 'BACK_DESIGN'
            ) || productDetailForm.uploadYourDesignUrls.some(
              (file) => file.type === 'BACK_DESIGN'
            )
              ? 'border-yellow-400'
              : ''
            } `}
        >
          {!globalStore.userId && (
            <>
              <small className="text-[#8A1E41]">
                Please login
                <Link className="text-blue-500" href="/user/login">
                  {' '}
                  here
                </Link>{' '}
                to{' '}
              </small>
              <br />
            </>
          )}
          {shareYourDesignsFiles.uploadingBackDesign ? (
            <Spinner bgColor1="white" bgColor2="#851B39" />
          ) : (
            ' Upload Back Design'
          )}
          <input
            type="file"
            disabled={globalStore.userId ? false : true}
            className="w-0 h-0"
            onChange={(e) => uploadImage(e, 'BACK_DESIGN')}
          />
        </label> */}
      </div>
      {/* Comented to show only api data  */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-5">
        <div className='flex flex-col gap-2'>
          {shareYourDesignsFiles.serverImageUrlsWithName.length
            ? shareYourDesignsFiles.serverImageUrlsWithName.map(
              (image, index) =>
                image.type === 'FRONT_DESIGN' && (
                  <div key={index} className="flex justify-center items-center px-7 py-3.5 bg-[#EAEAEA] text-black text-center text-base font-semibold leading-normal ">
                    <div className='flex gap-2 items-center'>
                      <img className="w-10 h-10" src={image.url} alt={image.name} />
                      <span>{image.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(image.id)}
                      className="text-gray-600 bg-transparent hover:text-yellow-400 hover:bg-slate-200 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
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
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                )
            )
            : ''}
        </div>
        <div className='flex flex-col gap-2'>
          {shareYourDesignsFiles.serverImageUrlsWithName.length
            ? shareYourDesignsFiles.serverImageUrlsWithName.map(
              (image, index) =>
                image.type === 'BACK_DESIGN' && (
                  <div key={index} className="flex justify-center items-center px-7 py-3.5 bg-[#EAEAEA] text-black text-center text-base font-semibold leading-normal ">
                    <div className='flex gap-2 items-center'>
                      <img className="w-10 h-10" src={image.url} alt={image.name} />
                      <span>{image.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(image.id)}
                      className="text-gray-600 bg-transparent hover:text-yellow-400 hover:bg-slate-200 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
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
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                )
            )
            : ''}
        </div>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-5">
        <div className='flex flex-col gap-2'>
          {(productDetailForm?.uploadYourDesignUrls?.length !== 0)
            ? productDetailForm?.uploadYourDesignUrls?.map(
              (image, index) =>
                image.type === 'FRONT_DESIGN' && (
                  <Fragment key={index}>
                    <div className="px-7 py-3.5 bg-[#EAEAEA] text-black text-center text-base font-semibold leading-normal flex gap-2 justify-center items-center">
                      <Link key={image.url} target="_blank" href={image.url} download>
                        <div className="flex gap-2 justify-center items-center">
                          {getFileIcon(image)}
                          <span className='hover:underline hover:text-yellow-500 overflow-ellipsis line-clamp-1'>{image.name}</span>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFile(image.id, "edit") }}
                        className="text-gray-600 bg-transparent hover:text-yellow-400 hover:bg-slate-200 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                        data-modal-hide="default-modal"
                      >
                        <svg
                          className="w-31 h-3"
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
                        <span className="sr-only">Close</span>
                      </button>
                    </div></Fragment>
                )
            )
            : ''}
        </div>
        <div className='flex flex-col gap-2'>
          {(productDetailForm?.uploadYourDesignUrls?.length !== 0)
            ? productDetailForm?.uploadYourDesignUrls?.map(
              (image, index) =>
                image.type === 'BACK_DESIGN' && (
                  <Fragment key={index}>
                    <Fragment key={index}>
                      <div className="px-7 py-3.5 bg-[#EAEAEA] text-black text-center text-base font-semibold leading-normal flex gap-2 justify-center items-center">
                        <Link key={image.url} target="_blank" href={image.url} download>
                          <div className="flex gap-2 justify-center items-center">
                            {getFileIcon(image)}
                            <span className='hover:underline hover:text-yellow-500 overflow-ellipsis line-clamp-1'>{image.name}</span>
                          </div>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(image.id, "edit") }}
                          className="text-gray-600 bg-transparent hover:text-yellow-400 hover:bg-slate-200 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                          data-modal-hide="default-modal"
                        >
                          <svg
                            className="w-31 h-3"
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
                          <span className="sr-only">Close</span>
                        </button>
                      </div></Fragment></Fragment>
                )
            )
            : ''}
        </div>
      </div>
    </>
  );
}
