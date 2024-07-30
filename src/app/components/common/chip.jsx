const Chip = ({ name, callback, id }) => {
    return (
        <div
            className="relative grid  items-center whitespace-nowrap w-[max-content] rounded-lg bg-gray-300 py-1.5 px-3 font-sans text-xs font-bold uppercase text-dark">
            <span className="mr-5">{name}</span>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    if (callback)
                        callback(id)
                }}
                className="!absolute  top-2/4 right-1 mx-px h-5 max-h-[32px] w-5 max-w-[32px] -translate-y-2/4  rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-dark transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                {callback && <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"
                        strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </span>}
            </button>
        </div>
    )
}

export default Chip