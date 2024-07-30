export default function AfterPayInfo({ showAfterInfoModal, setShowAfterInfoModal }) {
    const handleCloseModal = () => {
        setShowAfterInfoModal(false);
    };
    return (showAfterInfoModal &&
        <section onClick={handleCloseModal} className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50">
            <div className="relative max-w-md lg:min-w-[567px] lg:h-[506px] rounded-2xl z-40">
                <img src={"/images/afterpay.png"}  alt="afterpay.png" />
                <button onClick={handleCloseModal} className={`absolute right-0 -top-4 sm:-right-4 self-end p-2 text-gray-700 hover:bg-amber-200 bg-[#FFCD00] cursor-pointer`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </section>)
}