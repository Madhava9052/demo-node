export default function ArrowButton({
  direction,
  show,
  clickHandler,
  style = {},
  className = '',
}) {
  return (
    <button
      className={`left-button border border-[#8A1E41] p-3 rounded-full ${className} ${
        show ? '' : 'hidden'
      }`}
      onClick={clickHandler}
      style={{ ...style }}
    >
      {direction === 'right' ? (
        <svg
          className="w-[16px] h-[16px] text-[#8A1E41]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 8 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
          />
        </svg>
      ) : (
        <svg
          className="w-[16px] h-[16px] text-[#8A1E41]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 8 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
          />
        </svg>
      )}
    </button>
  );
}
