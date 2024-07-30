import { useState } from 'react';

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index, e) => {
        if (e && e.target && e.target.classList.contains('text-yellow-400')) {
            return;
        }

        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        <div className="max-w-md mx-auto">
            <div className="rounded">
                {/* //Add max-h-[35rem] for scroll */}
                <div className="overflow-y-auto max-h-screen">
                    {items.map((item, index) => (
                        <div key={index} className="border-b">
                            <button
                                className={`w-full py-3 px-2 mt-1 text-left font-bold focus:outline-none ${activeIndex === index ? 'font-bold' : ''
                                    }`}
                                onClick={(e) => handleToggle(index, e)}
                            >
                                {item.title}{' '}
                                {item.title === "Colors" && (item.selectAllMethod !== null && activeIndex === index) && <span className='text-yellow-400 ml-3 font-normal text-sm' onClick={() => item.selectAllMethod(item.data)}>
                                    {item.selectAllState ? 'Deselect All' : 'Select All'}
                                </span>}
                                {(item.title === "Materials" || item.title === "Print Methods") && (item.selectAllMethod !== null && activeIndex === index) && <span className='text-yellow-400 ml-3 font-normal text-sm' onClick={item.selectAllMethod}>
                                    {
                                        typeof (item.selectAllState?.selectedAllMaterials) === "boolean"
                                            ? (item.selectAllState?.selectedAllMaterials && item.title === "Materials") || (item.selectAllState?.selectAllPrintMethods && item.title === "Print Methods")
                                                ? 'Deselect All'
                                                : 'Select All'
                                            : item.selectAllState
                                                ? 'Deselect All'
                                                : 'Select All'
                                    }
                                </span>}
                                <span className="float-right h-full">
                                    {activeIndex === index ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-3" width="14" height="2" viewBox="0 0 14 2" fill="none">
                                            <path d="M13.4166 0H0.583343C0.261166 0 0 0.261164 0 0.583338C0 0.905512 0.261166 1.16668 0.583343 1.16668H13.4167C13.7388 1.16668 14 0.905512 14 0.583338C14 0.261164 13.7388 0 13.4166 0Z" fill="#53565B" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-1" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M13.3 6.3H7.70004V0.699957C7.70004 0.313641 7.3864 0 6.99996 0C6.61364 0 6.3 0.313641 6.3 0.699957V6.3H0.699957C0.313641 6.3 0 6.61364 0 6.99996C0 7.3864 0.313641 7.70004 0.699957 7.70004H6.3V13.3C6.3 13.6864 6.61364 14 6.99996 14C7.3864 14 7.70004 13.6864 7.70004 13.3V7.70004H13.3C13.6864 7.70004 14 7.3864 14 6.99996C14 6.61364 13.6864 6.3 13.3 6.3Z" fill="#53565B" />
                                        </svg>
                                    )}
                                </span>
                            </button>
                            {activeIndex === index && (
                                <div key={`content-${index}`} className="max-h-[40vh] mx-2 overflow-y-auto overflow-x-hidden">
                                    <div key={`content-text-${index}`}>
                                        {item.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
