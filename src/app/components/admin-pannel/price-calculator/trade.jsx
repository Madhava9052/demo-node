'use client';
import React, { useState } from 'react';

const TabbedNavigation = () => {
  const [activeTab, setActiveTab] = useState('TRADE');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <ul className="flex justify-center max-w-fit mx-auto text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow dark:divide-gray-700 dark:text-gray-400 mt-20">
      <li>
        <a
          href="#"
          className={`inline-block w-full p-4 ${
            activeTab === 'TRADE'
              ? 'text-white bg-[#000] rounded-l-lg dark:bg-gray-700 dark:text-white'
              : 'bg-white rounded-l-lg hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleTabClick('TRADE')}
          aria-current={activeTab === 'TRADE' ? 'page' : null}
        >
          TRADE
        </a>
      </li>
      <li>
        <a
          href="#"
          className={`inline-block w-full p-4 ${
            activeTab === 'INDIVIDUAL'
              ? 'text-white bg-[#000] rounded-r-lg dark:bg-gray-700 dark:text-white'
              : 'bg-white rounded-r-lg hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleTabClick('INDIVIDUAL')}
          aria-current={activeTab === 'INDIVIDUAL' ? 'page' : null}
        >
          INDIVIDUAL
        </a>
      </li>
    </ul>
  );
};

export default TabbedNavigation;
