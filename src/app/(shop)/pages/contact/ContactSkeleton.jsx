function ContactSkeleton() {
    return <div>
        {/* ContactUS Image */}
        <div className='animate-pulse bg-gray-500 w-full h-[230px] lg:h-[350px] sm:h-[330px]'>
            <div className='container pt-4 lg:pt-6 mx-auto flex flex-col gap-8 sm:gap-12 lg:gap-40'>
                <div className='flex flex-col justify-center'>
                    <div className="mb-4">
                        <span className="inline-block text-sm sm:text-base lg:text-lg lg:tracking-widest uppercase text-white p-2 sm:pl-3 font-semibold "></span>
                    </div>
                    <span className="inline-block tracking-wide align-middle text-4xl sm:text-7xl lg:text-8xl sm:tracking-normal text-white pl-3 font-bold "></span>
                </div>
            </div>
        </div>
        <div className='container relative mx-auto mt-4 lg:mt-10 mb-6'>
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="animate-pulse bg-gray-500 w-full lg:w-1/2">
                    <div className="mb-4">
                        <span className=" w-[300px] h-8 inline-block align-middle text-xs lg:tracking-widest uppercase text-black pl-3 font-semibold "></span></div>
                    <div>
                        <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold"></h1>
                        <p className="mt-4 text-gray-500"></p>
                    </div>
                    <div className='flex flex-col gap-6 mt-5'>
                        <div className="flex gap-4 items-center">
                            <div className='flex flex-col'>
                                <span className='font-bold'></span>
                                <p className=' text-gray-500'></p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className='flex flex-col'>
                                <span className='font-bold'></span>
                                <p className=' text-gray-500'></p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <p className=' text-gray-500'></p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <p className=' text-gray-500'></p>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <h2 className='text-xl lg:text-3xl font-bold'></h2>
                    <div>
                        <form>
                            <div className='flex flex-col gap-4 mt-10 mr-2 lg:mr-0'>
                                <input type='text' className=" animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400"  />
                                <input type='text' className="animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400" />
                                <input type='email' className="animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400"  />
                                <input type='tel' className="animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400"  />
                                <input type='text' className="animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400"  />
                                <textarea rows={5} cols={40} className='animate-pulse bg-gray-500 w-full rounded-lg p-4 border border-gray-400' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default ContactSkeleton;