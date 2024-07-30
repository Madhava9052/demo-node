'use client';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function DesignFiles({ product_id, order_item_id }) {
  const [filesData, setFiles] = useState();
  const [showFiles, setShowFiles] = useState(false);
  useEffect(() => {
    const path = `/api/products/${product_id}/branding/${order_item_id}/files/`;
    const options = {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    async function getData() {
      const responseData = await sendRequest(path, options);
      setFiles(responseData.data);
    }
    getData();
  }, []);
  if (!filesData) {
    return <>Loading...</>;
  }
  return (
    <>
      <button
        className="border mt-4 border-[#853b39] text-[#853b39] text-[12px] p-1 px-2"
        onClick={() => setShowFiles(!showFiles)}
      >
        View Design Files
      </button>
      {showFiles && (
        <div className="mt-4 flex gap-3">
          {filesData.files.map((eachFile, index) => (
            <a key={index} target="_blank" href={eachFile.url}>
              <img className="w-20 h-20 rounded" src={eachFile.url} alt="" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}
