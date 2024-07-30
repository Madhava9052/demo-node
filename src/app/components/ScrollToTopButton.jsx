import React, { useRef, useEffect } from 'react';

const ScrollToTopButton = ({ scrollableNodeRef }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableNode = scrollableNodeRef?.current;
      const button = buttonRef.current;

      if (scrollableNode && button) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableNode;
        const shouldShowButton = scrollTop > 0 && scrollTop + clientHeight < scrollHeight;
        button.style.display = shouldShowButton ? 'block' : 'none';
      }
    };

    const scrollableNode = scrollableNodeRef?.current;
    if (scrollableNode) {
      scrollableNode.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableNode) {
        scrollableNode.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollableNodeRef]);

  const scrollToTop = () => {
    const scrollableNode = scrollableNodeRef?.current;
    if (scrollableNode) {
      scrollableNode.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      ref={buttonRef}
      className='bg-[#8A1E41] rounded-full z-50 w-[50px] mx-auto h-[50px]  hover:lg:bg-yellow-400 text-white duration-300 transition flex justify-center items-center'
      onClick={scrollToTop}
      style={{ display: 'none', position: 'fixed', bottom: '20px', right: '20px' }}
    >
      <svg className="mx-auto w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="#ffffff"></path> </g></svg>
    </button>
  );
};

export default ScrollToTopButton;