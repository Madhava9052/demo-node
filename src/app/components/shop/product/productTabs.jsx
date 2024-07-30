'use client';

import { useEffect, useState } from 'react';
import LiveStockStatus from './liveStockStatus';
import Spinner from '../../common/spinner';
import { sendRequest, uploadToServer } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import AlertMessage from '../../common/alert';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/app/context/store';

export default function ProductTabs({ productDetails  ,templateDetails }) {
  const [activeProductDescriptionTab, setActiveProductDescriptionTab] =
    useState('Description');
  const [askQuestionOrRequest, setaskQuestionOrRequest] = useState({
    isUploading: false,
    filesUlrs: [],
    serverImageUrl: '',
    successMessage: '',
  });
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { globalStore } = useGlobalContext();
  const [customerReviewData, setCustomerReviewData] = useState({});
  const [additionalInformationData, setAdditionalInformationData] = useState({});
  const [userReview, setUserReview] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [showProductTemplate, setShowProductTemplate] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      review: userReview,
      rating,
      product_id: productDetails?.id,
      user_id: globalStore?.userId
    };

    let options = {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    };

    //if the user has bought product but not reviewed
    if (customerReviewData?.user_comment.length) {
      options.method = 'PUT';
    }
    


    try {
      let url = `/api/product_comments/`;

      if (customerReviewData?.user_comment.length) {
        url += `${customerReviewData?.user_comment?.[0]?.id}`;
      }

      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        console.log(responseData);
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract form data and set the API URL and options
    const bodyData = Object.fromEntries(new FormData(e.target));
    const url = `/api/request_quotes/`;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        ...bodyData,
        files: askQuestionOrRequest.filesUlrs[0],
      }),
    };

    

    try {
      // Send the login request to the API
      const responseData = await sendRequest(url, options);
      // Handle API response
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setaskQuestionOrRequest({
          ...askQuestionOrRequest,
          isProcessing: false,
          filesUlrs: [],
          successMessage: responseData.message,
        });
        e.target.reset();
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const uploadImage = async (event) => {
    setaskQuestionOrRequest({ ...askQuestionOrRequest, isUploading: true });
    // Check if a file has been selected
    let fileName = '';
    if (event.target.files && event.target.files[0]) {
      // Get the selected image file
      const image = event.target.files[0];
      fileName = event.target.files[0].name;

      const path = `/api/upload/request_quote?product_id=${productDetails.id}`;
      // Upload the image to the server and wait for the response
      const responseData = await uploadToServer(event, path);

      // Check if the server response indicates success
      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setaskQuestionOrRequest({
          ...askQuestionOrRequest,
          isUploading: false,
          filesUlrs: [responseData.data.urls[0]],
        });
      }
    }
  };

  //Star review element 
  const handleStarClick = (index, isHalf) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
  };

  const handleStarHover = (index, isHalf) => {
    const newHoveredRating = isHalf ? index + 0.5 : index + 1;
    setHoveredRating(newHoveredRating);
  };

  const handleHoverLeave = () => {
    setHoveredRating(0);
  };

  //fetch customer review data and intialise existing reviews
  useEffect(() => {
    let url = `/api/products/${productDetails.id}/comments/`;
    let url_additional = `/api/products/additional_information/${productDetails.id}`;
    if (globalStore.userId !== undefined && globalStore.userId !== null) {
      url += `?user_id=${globalStore.userId}`;
    }

    async function fetchReviewData() {
      try {
        const responseData = await sendRequest(url);
        if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          setCustomerReviewData(responseData.data);

          // Check if userReview and rating are not already set
          if (!rating && !userReview) {
            setUserReview(responseData.data?.user_comment?.[0]?.review);
            setRating(responseData.data?.user_comment?.[0]?.rating);
          }
        } else if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle error if needed
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }

    async function fetchAdditionalInformation(){
      try{
        const responseData = await sendRequest(url_additional);
        if (responseData.status === API_RESPONSE_STATUS.SUCCESS){
          console.log(responseData.data)
          setAdditionalInformationData(responseData.data);
        }else if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle error if needed
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    }

    if (activeProductDescriptionTab === "Review") {
      fetchReviewData();
    }
    if (activeProductDescriptionTab === "Additional Information") {
          fetchAdditionalInformation();
        } 
        
    

  }, [activeProductDescriptionTab]);



  
 
  return (
    <>
      <div className="text-lg lg:text-xl font-semibold  text-center text-black mt-4 lg:mt-[80px]">
        <ul className="flex flex-wrap justify-around gap-4 lg:gap-0">
          <li
            className={`ml-0 pl-2 cursor-pointer transition duration-300 grow lg:pb-[16px] border-b-2 rounded-t-lg hover:text-[#FFCD00] ${activeProductDescriptionTab === 'Description'
              ? 'text-[#FFCD00] border-[#FFCD00]'
              : 'text-black border-gray-200'
              }`}
            onClick={() => setActiveProductDescriptionTab('Description')}
          >
            Description
          </li>
          <li
            className={`cursor-pointer transition duration-300 grow lg:pb-[16px] border-b-2 rounded-t-lg hover:text-[#FFCD00]  ${activeProductDescriptionTab === 'Additional Information'
              ? 'text-[#FFCD00] border-[#FFCD00]'
              : 'text-black border-gray-200'
              }`}
            onClick={() =>
              setActiveProductDescriptionTab('Additional Information')
            }
          >
            Additional Information
          </li>
          <li
            className={`cursor-pointer transition duration-300 grow lg:pb-[16px] border-b-2 rounded-t-lg hover:text-[#FFCD00]  ${activeProductDescriptionTab === 'Live Stock Status'
              ? 'text-[#FFCD00] border-[#FFCD00]'
              : 'text-black border-gray-200'
              }`}
            onClick={() => setActiveProductDescriptionTab('Live Stock Status')}
          >
            Live Stock Status
          </li>
          <li
            className={`mr-0 pr-2 cursor-pointer transition duration-300 grow lg:pb-[16px] border-b-2 rounded-t-lg hover:text-[#FFCD00] ${activeProductDescriptionTab === 'Ask a question'
              ? 'text-[#FFCD00] border-[#FFCD00]'
              : 'text-black border-gray-200'
              }`}
            onClick={() => setActiveProductDescriptionTab('Ask a question')}
          >
            Ask a question
          </li>
          <li
            className={`mr-0 pr-2 cursor-pointer transition duration-300 grow lg:pb-[16px] border-b-2 rounded-t-lg hover:text-[#FFCD00]  ${activeProductDescriptionTab === 'Review'
              ? 'text-[#FFCD00] border-[#FFCD00]'
              : 'text-black border-gray-200'
              }`}
            onClick={() => setActiveProductDescriptionTab('Review')}
          >
            Review
          </li>
        </ul>
      </div>
      {activeProductDescriptionTab == 'Description' && (
        <div className="flex flex-col lg:flex-row items-start justify-around">
          <div className="max-w-full lg:max-w-[600px] xl:max-w-[800px]">
            <h3 className="text-black font-montserrat text-[18px] font-semibold leading-normal mt-10">
              {productDetails.name}
            </h3>
            <p className="text-black font-montserrat text-base font-normal leading-snug mt-4">
              {productDetails.long_description}
            </p>
            {productDetails.features && (
              <>
                <h3 className="text-black font-montserrat text-[18px] font-semibold leading-normal mt-10">
                  Features
                </h3>
                <ul className="text-black font-montserrat text-base font-normal leading-snug st mt-[16px]">
                  {productDetails.features.map((eachFeature, index) => (
                    <li className="list-disc ml-5" key={index}>
                      {' '}
                      {eachFeature}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="lg:w-[490px] lg:h-[400px] mx-auto mt-10">
            <img src={productDetails?.images[0]?.url} alt="" />
          </div>
        </div>
      )}
      {activeProductDescriptionTab == 'Additional Information' && (
        <div className="flex flex-col lg:flex-row items-start justify-between">
          <div className="max-w-full lg:max-w-[600px] xl:max-w-[800px]">
           <div>
            <h3 className="text-black text-18px font-montserrat  font-semibold leading-normal mt-10" style={{fontSize: "18px"}}>
              Specifications
            </h3>
            <table className="w-full  text-18px text-center text-gray-500 mt-4">
                <thead className=" font-semibold text-black bg-gray-100">
                  <tr className='border-b'>
                    <th scope="col" className="px-6 py-3 pt-5 text-18px text-start font-semibold" style={{fontSize: "18px"}}>
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 pt-5 text-18px text-start font-semibold" style={{fontSize: "18px"}}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                {additionalInformationData.specifications?.map((eachBrandInfo, index) => (
                     <tr key={index} className="bg-white-100 border-b ">
                          <td
                             scope="row"
                            className="px-6 py-4 text-start text-16px whitespace-nowrap"
                          >
                          {eachBrandInfo.specification}
                          </td>
                          <td className="px-6 py-4 text-16px text-start">
                            {eachBrandInfo.description}
                          </td>
                      </tr>
                 ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-black font-montserrat text-18px font-semibold leading-normal mt-10" style={{fontSize: "18px"}}>
              Colours
            </h3>
            <p className="text-black font-montserrat text-base font-normal">
              {productDetails.additional_information[0].colours.colours +
                productDetails.additional_information[0].colours
                  .secondary_colour}
            </p>

            <h3 className="text-black text-18px font-semibold font-montserrat   leading-normal mt-4" style={{fontSize: "18px"}}>
               Dimensions
            </h3>
            {additionalInformationData.dimensions?.map((eachDimension, index) => (
               <p key={index}>{eachDimension}</p>
            ))}
            <h3 className="text-black text-18px font-semibold font-montserrat  leading-normal mt-4" style={{fontSize: "18px"}}>
               Materials
            </h3>
            {additionalInformationData.materials?.map((eachMaterials,index)=>(
              <p key={index}>{eachMaterials.component && (<span className='pr-2'>{eachMaterials.component} :</span>)} <span className=''>{eachMaterials.material}</span></p>
            ))}
           <h3 className="text-black text-18px font-semibold font-montserrat   leading-normal mt-4" style={{fontSize: "18px"}}>
               Branding
            </h3>
            {templateDetails.template_url ? (
                  <>
                    <button
                      type='button'
                      onClick={() => setShowProductTemplate(!showProductTemplate)}
                      className="ml-auto text-black text-center text-base underline"
                      href={templateDetails.template_url}
                      target="_self"
                    >
                      <ul className='list-disc px-5' >
                        <li >
                      Branding Template
                      </li>
                      </ul>
                    </button>
                    {showProductTemplate && (
                      <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen sm:px-4 text-center">
                          <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
                            aria-hidden="true"
                          ></div>
                          <div className="rounded-lg text-left shadow-xl transform transition-all w-full max-w-3xl overflow-visible">
                            <button onClick={() => setShowProductTemplate(!showProductTemplate)} className={`absolute right-0 -top-4 sm:-right-4 self-end p-2 text-gray-700 hover:bg-amber-200 bg-[#FFCD00] cursor-pointer`}>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                            <div className="">
                              <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                  <iframe
                                    src={templateDetails?.template_url}
                                    style={{
                                      width: '100%',
                                      height: '80vh',
                                    }}
                                  ></iframe>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  ''
                )}
           {productDetails.branding_information?.map((eachPrintMethod, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-black text-18px font-semibold font-montserrat leading-normal" style={{fontSize: "18px"}}>
                    {eachPrintMethod.description}
                </h3>
                <p>{eachPrintMethod.branding_area}</p>
              </div>
            ))}
            
          </div>
          <div className="w-full lg:w-[490px] lg:h-[400px] mt-10">
            <img src={productDetails?.images[0]?.url} alt="" />
          </div>
        </div>
      )}
      {activeProductDescriptionTab == 'Live Stock Status' && (
        <LiveStockStatus
          productId={productDetails.id}
          productDetails={productDetails}
        />
      )}
      {activeProductDescriptionTab == 'Ask a question' && (
        <div className="flex flex-col xl:flex-row items-center lg:items-start justify-between mt-10">
          
          <form onSubmit={handleSubmit} className="grow max-w-[760px]">
  <h3 className="text-black text-lg font-semibold leading-normal tracking-normal">
    Request a Quote
  </h3>

  <input
    hidden
    name="product_id"
    type="text"
    id="productID"
    defaultValue={productDetails.id}
  />

  <div className="flex flex-col md:flex-row md:gap-4">
    <div className="flex-1">
      <div className="flex items-center mt-[20px]">
        <label
          htmlFor="firstName"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          First Name<sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="text"
          name="first_name"
          id="firstName"
          className="bg-white border border-gray-300 flex-grow text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center mt-[20px]">
        <label
          htmlFor="lastName"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          Last Name<sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="text"
          name="last_name"
          id="lastName"
          className="bg-white border border-gray-300 flex-grow text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
    </div>
  </div>

  <div className='flex flex-col md:flex-row md:gap-4'>
    <div className="flex-1">
      <div className="flex items-center mt-[20px]">
        <label
          htmlFor="companyName"
          className="text-sm mr-4 whitespace-nowrap w-24 "
        >
          Company Name
        </label>
        <input
          type="text"
          name="company"
          id="companyName"
          className="bg-white border border-gray-300 flex-grow text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2.5"
          defaultValue=""
        />
      </div>
    </div>
    <div className="flex-1 flex">
      <div className="flex items-center mt-[20px] mr-4">
        <label
          htmlFor="quantity"
          className="text-sm whitespace-nowrap w-24"
        >
          Quantity <sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="number"
          name="quantity_required"
          id="quantity"
          className="no-spinners bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 w-[110px] p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
      <div className="flex items-center mt-[20px]">
        <label
          htmlFor="color"
          className="text-sm whitespace-nowrap w-24"
        >
          Colour<sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="text"
          name="color"
          id="color"
          className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 w-[100px] p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
    </div>
  </div>

  <div className='flex flex-col md:flex-row md:gap-4'>
    <div className="flex-1">
      <div className='flex items-center mt-[20px]'>
        <label
          htmlFor="phoneNumber"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          Phone<sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="number"
          name="number"
          id="phoneNumber"
          className="no-spinners bg-white border border-gray-300 flex-grow text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
    </div>
    <div className="flex-1">
      <div className='flex items-center mt-[20px]'>
        <label
          htmlFor="email"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          Email<sup><span className='text-[#8A1E41] align-text-top ml-1 text-base'>*</span></sup>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-white border border-gray-300 flex-grow text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 p-2.5"
          defaultValue=""
          required={true}
        />
      </div>
    </div>
  </div>

  <div className='flex flex-col md:flex-row md:gap-4 mt-[20px]'>
    <div className='flex-1'>
      <div className='flex items-start'>
        <label
          htmlFor="message"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          Message<sup><span className='text-[#8A1E41] ml-1 text-base align-text-top'>*</span></sup>
        </label>
        <textarea
          id="message"
          rows="4"
          name="message"
          className="resize-none p-2.5 flex-grow text-sm text-gray-900 bg-white border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
          required={true}
        ></textarea>
      </div>
    </div>
    <div className='flex-1'>
      <div className='flex items-start'>
        <label
          htmlFor="files"
          className="text-sm mr-4 whitespace-nowrap w-24"
        >
          ArtWork File
        </label>
        <div className="flex-grow">
          <label
            htmlFor="files"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 overflow-y-auto"
          >
            

                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]">
                  {askQuestionOrRequest.isUploading ? (
                    <Spinner bgColor1="white" bgColor2="#851B39" />
                  ) : askQuestionOrRequest.filesUlrs.length ? (
                    <img
                      className="w-32 h-32 mb-3"
                      src={askQuestionOrRequest.filesUlrs[0]}
                    />
                  ) : (<></>)}
                  <p className="mb-2 text-sm text-gray-400">
                    Drop files here or
                  </p>
                  <label
                    htmlFor='files'
                    className="px-7 py-3.5 border-yellow-400 border-2 w-[190px] text-yellow-400 text-center text-base font-semibold leading-normal "
                  >
                    Select Files
                  </label>
                </div>
                <input
                  onChange={uploadImage}
                  id="files"
                  type="file"
                  className="hidden"
                  required={true}
                />
              </label>
            
          <input
            onChange={uploadImage}
            id="files"
            type="file"
            className="hidden"
            required={true}
          />
        </div>
      </div>
    </div>
  </div>

  <div className='flex justify-between mt-5'>
    <div className="flex items-center">
    <div className="flex items-center mb-4 mt-5">
              <label className="inline-flex items-center">
                <input
                  name="subscribe_newsletter"
                  id="subscribe_newsletter"
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="hidden"
                />
                <span className="w-5 h-5 inline-block bg-transparent border border-gray-300 focus:ring-yellow-500 focus:ring-2 checked:bg-[#FFCC00] checked:border-transparent">
                  {isChecked && (
                    <div className="flex justify-center items-center h-full bg-[#FFCC00]">
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.07031 1.07031L2.75 5.39062L0.929688 3.57031L0.570312 3.92969L2.57031 5.92969L2.75 6.10156L2.92969 5.92969L7.42969 1.42969L7.07031 1.07031Z" fill="white" stroke="white" strokeWidth="0.5" />
                      </svg>
                    </div>
                  )}
                </span> 
              </label>
              <label
                htmlFor="subscribe_newsletter"
                className="ml-2 text-sm font-normal text-gray-600"
              >
                Subscribe to newsletter
              </label>
            </div>
            <div className="mt-5">
              {(askQuestionOrRequest.errorMessage ||
                askQuestionOrRequest.successMessage) && (
                  <AlertMessage
                    name={askQuestionOrRequest.errorMessage ? 'error' : 'success'}
                    message={
                      askQuestionOrRequest.errorMessage ||
                      askQuestionOrRequest.successMessage
                    }
                    linkText={null}
                    linkHref={null}
                    textColor={
                      askQuestionOrRequest.errorMessage
                        ? 'text-red-800'
                        : 'text-green-800'
                    }
                    bgColor={
                      askQuestionOrRequest.errorMessage
                        ? 'bg-red-50'
                        : 'bg-green-50'
                    }
                    closeAction={() =>
                      setaskQuestionOrRequest({
                        ...askQuestionOrRequest,
                        errorMessage: '',
                        successMessage: '',
                      })
                    }
                  />
                )}
            </div>
    </div>
    <button className="px-2 py-2.5 bg-[#FFCC00] text-black text-center text-sm font-semibold leading-normal w-[149px]">
      Submit
    </button>
  </div>
</form>
          <div className="lg:w-[490px] lg:h-[400px] mt-10">
            <img src={productDetails?.images[0]?.url} alt="" />
          </div>
        </div>
      )}

      {activeProductDescriptionTab == 'Review' && (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mt-10">
          <div className="grow max-w-[400px]">
            {(customerReviewData?.can_review == true) ?
              <div>
                <form onSubmit={handleReviewSubmit} >
                  <h3 className="text-black text-lg lg:text-[18px] font-semibold leading-normal tracking-normal">
                    Write Your Review
                  </h3>
                  <p className="text-black mt-4 text-base font-normal leading-150 ">
                    How do you rate this product?
                  </p>
                  <div>
                    {[...Array(5).keys()].map((index) => (
                      <span
                        title={hoveredRating}
                        key={index}
                        onClick={() => handleStarClick(index, false)}
                        onMouseEnter={() => handleStarHover(index, false)}
                        onMouseLeave={handleHoverLeave}
                        className='text-2xl cursor-pointer'
                        style={{
                          color: index < hoveredRating ? "yellow" : "gray",
                        }}
                      >
                        {index < Math.floor(rating)
                          ? "★"
                          : index + 0.5 === rating
                            ? "½"
                            : "☆"}
                      </span>
                    ))}
                  </div>
                  <div className="bg-white">

                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium  mt-[20px]"
                    >
                      Review :
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      name="message"
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      placeholder="Write your thoughts here..."
                      className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <button className="mt-5 px-7 py-3.5 bg-[#FFCD00] text-black text-center text-base font-semibold leading-normal ml-[150px]">
                    Submit
                  </button>
                </form>

              </div>
              : <span className='text-black text-lg lg:text-xl font-bold leading-normal tracking-normal'>Please buy this product to Review</span>
            }
            {!customerReviewData?.product_comments?.length ? <h3 className='text-black font-montserrat text-xl font-semibold leading-normal mt-10'>No Reviews on this product yet!</h3> :
              <div className='mt-4'>
                <h3 className='text-black font-montserrat text-lg font-semibold leading-normal'>Customer Reviews</h3>
                {customerReviewData?.product_comments?.map(comment => {
                  return <div key={comment.id} className="bg-[#F7F7F7] mt-4 px-[30px] py-[20px]  grow border border-solid border-gray-200">
                    <div className='flex justify-between items-center gap-4'>
                      <p className="text-black  text-[22px] font-semibold leading-150 ">{comment.commented_by}</p>
                      <p className="text-gray-500 text-base">{new Date(comment.commented_date).toLocaleString()}</p>
                    </div>

                    <div>
                      {[...Array(5).keys()].map((index) => (
                        <span
                          title={comment.rating} key={index}
                          className='text-2xl cursor-pointer'
                          style={{
                            color: "gray",
                          }}
                        >
                          {index < Math.floor(comment.rating)
                            ? "★"
                            : index + 0.5 === rating
                              ? "½"
                              : "☆"}
                        </span>
                      ))}
                    </div>
                    <p className="text-black  text-base font-normal leading-150 ">
                      {comment.review}
                    </p>
                  </div>
                })}

              </div>
            }
          </div>


          <div className="lg:w-[490px] lg:h-[400px] items-center mt-10">
            <img src={productDetails?.images[0]?.url} alt="" />
          </div>
        </div>
      )}
    </>
  );
}
