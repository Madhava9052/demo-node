import {
  IMAGE_UPLOAD_END_POINT,
  replaceParams,
} from '@/constants/admin-pannel/end-points';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { uploadToServer } from '@/helpers/utils';
import Link from 'next/link';
import { useState } from 'react';

export default function EditUploadImage({ eachField, imagePathUrl }) {
  const [imgUrl, setUrl] = useState();
  const [isCopied, setIsCopied] = useState(false);

  const handleUploadToServer = async (event) => {
    let fileName = '';
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      fileName = event.target.files[0].name;

      const path = replaceParams(IMAGE_UPLOAD_END_POINT, {
        path: imagePathUrl,
      });
      // Upload the image to the server and wait for the response
      const responseData = await uploadToServer(event, path);

      // Check if the server response indicates success
      if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        setUrl(responseData.data.urls[0]);
      }
    }
  };

  const handleCopyClick = () => {
    const textArea = document.createElement('textarea');
    textArea.value = `${imgUrl}`;

    // Make the textarea invisible
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.select();

    try {
      // Execute copy command
      document.execCommand('copy');
      setIsCopied(true);
    } catch (err) {
      console.error('Unable to copy', err);
    } finally {
      // Clean up the textarea
      document.body.removeChild(textArea);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <div className="border border-[#8A1E41] shadow-lg p-4 mb-20">
      <div className="flex items-center gap-4">
        {imgUrl && (
          <div className="flex flex-col items-center gap-1">
            <small>Recent image</small>
            <img src={imgUrl} className="w-24 h-24" />
            <Link
              target="_blank"
              className="text-[14px] text-blue-400"
              href={imgUrl}
            >
              View
            </Link>
          </div>
        )}
        <div className="grow">
          <label
            htmlFor={eachField.name}
            className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
          >
            {eachField.name.split('_').join(' ')}
          </label>
          <input
            className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder={eachField.placeholder}
            required={eachField.required}
            type={eachField.type}
            name={eachField.name}
            id={eachField.name}
            accept="image/*"
            defaultValue={eachField.value}
            onChange={handleUploadToServer}
          />
        </div>
      </div>
      {imgUrl && (
        <div className="grow relative">
          <label
            htmlFor={eachField.name}
            className="block mb-2 text-sm font-medium dark:text-white mt-[20px] capitalize"
          >
            Copy the URL, and paste it into the input fields.
          </label>
          <div className="bg-gray-50 no-spinners flex items-center border border-gray-300 focus:ring-primary-600 focus:border-primary-600">
            <input
              className="bg-gray-50 text-gray-900 sm:text-sm rounded-sm w-full p-4 outline-none"
              text=""
              value={imgUrl}
            />
            {isCopied && (
              <div className="absolute right-0 top-2 text-[#8A1E41]">
                Copied!
              </div>
            )}
            <button
              onClick={handleCopyClick}
              type="submit"
              className="text-white bottom-2.5 bg-[#8A1E41] font-medium rounded-lg text-sm px-4 py-2 mr-2"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
