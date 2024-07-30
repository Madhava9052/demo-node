function AdvertisementBanner() {
    return <section className="hidden lg:block relative container mt-12 mx-auto">
        <div className="w-full">
            <img src={"/images/advertisement.png"} className="w-[85%] h-[450px] object-cover" alt="advertisement" />
        </div>
        <div className="absolute min-w-[324px] p-8 right-0 top-12 bottom-12 bg-white h-fit shadow-lg">
            <div className="flex flex-col">
                <div className="font-semibold text-2xl text-left">
                    <span className="text-[#8A1E41]">Open up</span> <br /> to a new <br />experience
                </div>
                <span className="mt-4 font-normal leading-6 text-base max-w-[225px] text-left break-words">Create, package and ship fully custom branded boxes. Show your employees and customers some love!</span>
                <button className="bg-[#8A1E41] mt-8 w-fit text-white px-4 py-2">
                    <span className="text-base font-medium leading-5">Let&#39;s Go!</span>
                </button>
            </div>
        </div>


    </section>
}
export default AdvertisementBanner;
