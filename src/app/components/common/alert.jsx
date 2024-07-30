import Link from 'next/link';

export default function AlertMessage({
  name,
  message,
  linkText,
  linkHref,
  textColor,
  bgColor,
  closeAction,
}) {
  return (
    <div
      className={`flex items-center p-4  ${bgColor} ${textColor}`}
      role="alert"
    >
      <span className="sr-only">Info</span>
      <div className="text-sm font-medium capitalize">
        {message}
        {linkText && linkHref && (
          <Link href={linkHref} className={`${textColor} font-bold underline`}>
            {' '}
            {linkText}
          </Link>
        )}
      </div>

      <button
        onClick={closeAction}
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} focus:${textColor} dark:${textColor} rounded-lg inline-flex items-center justify-center h-8 w-8 dark:hover:bg-gray-700`}
        data-dismiss-target={`#${name}-alert`}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
