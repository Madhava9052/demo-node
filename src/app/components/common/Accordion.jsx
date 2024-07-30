"use client"// Accordion.js
import React, { useState } from 'react';

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div>
            {items.map((item, index) => (
                <div key={index} className="mb-4">
                    <div
                        className={`flex items-center justify-between pl-0 p-4 border-b border-gray-500 cursor-pointer hover:text-[#8A1E41]`}
                        onClick={() => handleToggle(index)}
                    >
                        <span className="lg:text-2xl text-xl tracking-normal font-semibold lg:font-bold w-[90%]">{item.title}</span>
                        <svg
                            className={`w-6 h-6 transition-transform transform ${activeIndex === index ? 'rotate-180' : ''
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                    <div
                        className={`overflow-hidden transition-max-height ease-in-out duration-1000 ${activeIndex === index ? 'ease-in-out duration-1000 max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <div className="pl-0 p-4 bg-white rounded-b-lg">
                            <p>{item.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Accordion;
