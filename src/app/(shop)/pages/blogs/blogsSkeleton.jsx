function BlogsSkeleton(){
    return <>
        <div className='animate-pulse bg-gray-500 w-full h-[230px] lg:h-[340px] sm:h-[300px]'></div>
        <div className='lg:container mx-auto m-10  py-8  flex flex-row flex-wrap justify-between'>
            {[...Array(6)].map((_, index) => (
                <div key={index} className="w-[430px] sm:w-[300px]  md:w-[380px] lg:w-[340px] xl:w-[410px] 2xl:w-[450px] px-5 mt-6 cursor-pointer hover:text-[#8A1E41]">
                    <div className="animate-pulse bg-slate-500 h-[350px]"></div>
                    <div className="animate-pulse bg-slate-500 w-[60%] h-[20px] my-4"></div>
                    <div className="animate-pulse bg-slate-500 h-[50px] my-2"></div>
                </div>
            ))}
        </div>
    </>
}
export default BlogsSkeleton;