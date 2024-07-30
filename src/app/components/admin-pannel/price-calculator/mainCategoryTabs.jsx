'use client';
import React, { useState } from 'react';

const TabbedContent = () => {
  const [activeTab, setActiveTab] = useState('BRANDED');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="my-8">
      <ul
        className="flex flex-wrap justify-evenly -mb-px text-sm font-medium text-center"
        id="myTab"
        data-tabs-toggle="#myTabContent"
        role="tablist"
      >
        <li
          className={`mr-2 border-b-4  ${
            activeTab === 'BRANDED' ? 'border-[#7A0028]' : 'border-[#838383]'
          }`}
          role="presentation"
        >
          <button
            className="inline-block p-4 md:px-20 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="branded-tab"
            onClick={() => handleTabClick('BRANDED')}
            type="button"
            role="tab"
            aria-controls="branded"
            aria-selected={activeTab === 'BRANDED'}
          >
            BRANDED
          </button>
        </li>
        <li
          className={`mr-2 border-b-4  ${
            activeTab === 'UNBRANDED'
              ? 'border-[#7A0028] text-[#7A0028] font-bold'
              : 'border-[#838383]'
          }`}
          role="presentation"
        >
          <button
            className="inline-block p-4 md:px-20 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="ubnrabded-tab"
            onClick={() => handleTabClick('UNBRANDED')}
            type="button"
            role="tab"
            aria-controls="unbranded"
            aria-selected={activeTab === 'UNBRANDED'}
          >
            UNBRANDED
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TabbedContent;
