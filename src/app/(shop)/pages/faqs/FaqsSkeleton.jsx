function FaqsSkeleton(){
    return <>
        <div className='animate-pulse bg-gray-500 w-full h-[230px] lg:h-[350px] sm:h-[330px]'></div>
        <div>
            {[...Array(4)].map((_, index) => (
                <div key={index} className="lg:container max-w-[80%] mx-auto m-10">
                    <div
                        className={`animate-pulse bg-slate-500 h-12 mx-auto flex items-center justify-between pl-0 p-4 border-b border-gray-500 cursor-pointer hover:text-[#8A1E41]`}
                    >
                        <span className="animate-pulse bg-slate-500 lg:text-2xl text-xl tracking-normal font-semibold lg:font-bold "></span>
                    </div>
                </div>
            ))}
        </div>
    </>
}
export default FaqsSkeleton;