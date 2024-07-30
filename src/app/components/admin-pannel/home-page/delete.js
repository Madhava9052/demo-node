'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import DeleteAlertModal from '../../common/deleteAlertModal';
import { useState } from 'react';

export default function Delete({ url }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleDeleteModal = async () => {
    setShowDeleteModal((prevState) => !prevState);
  };

  const handleDeleteItem = async () => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    try {
      // Send the DELETE request to the API
      const responseData = await sendRequest(url, options);

      // Handle different API response statuses
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if needed
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        window.location.reload();
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  return (
    <>
      <button title="Delete" onClick={handleToggleDeleteModal}>
        <svg
          className="w-5 h-5 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
          />
        </svg>
      </button>
      {showDeleteModal && (
        <DeleteAlertModal
          headMessage="Please Confirm"
          bodyMessage={`This action will permanently delete the item. Are you sure you want to proceed ?`}
          onSuccess={handleDeleteItem}
          onFailure={handleToggleDeleteModal}
        />
      )}
    </>
  );
}
