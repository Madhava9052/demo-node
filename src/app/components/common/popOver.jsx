'use client';
import { InfoIcon } from '@/constants/SVGs';
import React, { useState, useRef } from 'react';

const Popover = ({ title, content, children, titleBg = '', showInfoIcon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [contentHovered, setContentHovered] = useState(false);
  const timerRef = useRef();

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      if (!contentHovered) {
        setIsHovered(false);
      }
    }, 100); // Adjust the delay as needed
  };

  const handleContentMouseEnter = () => {
    clearTimeout(timerRef.current);
    setContentHovered(true);
  };

  const handleContentMouseLeave = () => {
    setContentHovered(false);
    setIsHovered(false);
  };

  return (
    <>
      <div className={`${isHovered ? 'relative' : ''} lg:flex`}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
        {isHovered && (
          <div
            onMouseEnter={handleContentMouseEnter}
            onMouseLeave={handleContentMouseLeave}
            className="absolute z-50 bottom-full text-left inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-100"
          >
            {title && (
              <div
                className={`px-3 py-2 ${titleBg === '' ? 'bg-gray-100' : titleBg
                  }  border-b border-gray-200 rounded-t-lg`}
              >
                <h3
                  className={`font-semibold text-base ${titleBg === ''
                    ? 'text-gray-900'
                    : 'text-white'
                    }`}
                >
                  {title}
                </h3>
              </div>
            )}
            {content && (
              <div
                className="px-3 py-2 max-h-52 overflow-y-auto text-sm font-normal"
              >
                <div className='flex gap-2'>
                  {showInfoIcon && <InfoIcon />}
                  <p className='flex-1'>{content}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default Popover;
