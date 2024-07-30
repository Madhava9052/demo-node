import React from 'react'

function ReviewDetails({toggleStep}) {

    const handleincreaseParameter = () => {
        toggleStep('increase')
    }

    const handledecreaseParameter = () => {
        toggleStep('decrease')
    }
    return (
        <>
            <div className='container mx-auto flex justify-between my-10'>
                <div className='w-[62%]'>
                    <div onClick={handledecreaseParameter} className='flex gap-3 items-center cursor-pointer'>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.145941 6.85493L6.62183 13.47L8 12.5533L2.29949 6.73176L8 0.910187L6.62183 -2.02555e-08L0.145941 6.61507L-3.95775e-07 6.71231L0.0253812 6.73824L-4.02517e-07 6.76417L0.145941 6.85493Z" fill="#53565B" />
                        </svg>
                        <button className='text-base font-semibold'>Back</button>
                    </div>
                    <div className='mt-5 flex justify-between'>
                        <h3 className='text-[26px] font-semibold'>Review your brief</h3>

                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' mt-10 mx-[60px] flex justify-between'>
                            <h2
                                className='text-[22px] font-semibold'
                            >
                                Tell us about your project
                            </h2>
                            <svg className='cursor-pointer' width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.20001 20.644C1.48001 21.384 0.950013 22.288 0.950013 24.417C0.950013 26.546 0.659013 27.23 1.18101 27.759C1.70201 28.288 2.42501 27.815 4.42901 27.815C6.43301 27.815 7.89901 26.675 8.70301 25.996C9.50701 25.317 21.232 12.953 21.923 12.483C22.614 12.013 23.351 10.895 22.567 10.217C21.783 9.53802 19.134 7.15402 18.323 6.52002C17.512 5.88602 16.743 6.22402 15.845 7.03502C14.947 7.84602 2.92001 19.904 2.20001 20.644ZM20.249 3.02702C19.276 3.92502 19.767 4.36202 20.412 5.11902C21.057 5.87602 23.567 7.95202 24.026 8.43602C24.485 8.92002 25.113 9.41002 25.94 8.53702C26.767 7.66402 27.744 6.38302 28.395 5.61402C29.046 4.84502 29.342 3.62802 27.143 1.71402C24.944 -0.199981 23.837 -0.287981 22.98 0.408019C22.123 1.10302 21.222 2.12902 20.249 3.02702Z" fill="black" />
                            </svg>
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                Name your project
                            </h3>
                            <p className='mt-4 text-[#53565B] text-base font-normal'>
                                Welovebranding design
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                Select category
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                T-shirt 
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                Describe your project
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                How will your design be used?
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                T-shirt marketing
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                How will your design be used?
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                T-shirt marketing
                            </p>
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' mt-10 mx-[60px] flex justify-between'>
                            <h2
                                className='text-[22px] font-semibold'
                            >
                                Your time & budget
                            </h2>
                            <svg className='cursor-pointer' width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.20001 20.644C1.48001 21.384 0.950013 22.288 0.950013 24.417C0.950013 26.546 0.659013 27.23 1.18101 27.759C1.70201 28.288 2.42501 27.815 4.42901 27.815C6.43301 27.815 7.89901 26.675 8.70301 25.996C9.50701 25.317 21.232 12.953 21.923 12.483C22.614 12.013 23.351 10.895 22.567 10.217C21.783 9.53802 19.134 7.15402 18.323 6.52002C17.512 5.88602 16.743 6.22402 15.845 7.03502C14.947 7.84602 2.92001 19.904 2.20001 20.644ZM20.249 3.02702C19.276 3.92502 19.767 4.36202 20.412 5.11902C21.057 5.87602 23.567 7.95202 24.026 8.43602C24.485 8.92002 25.113 9.41002 25.94 8.53702C26.767 7.66402 27.744 6.38302 28.395 5.61402C29.046 4.84502 29.342 3.62802 27.143 1.71402C24.944 -0.199981 23.837 -0.287981 22.98 0.408019C22.123 1.10302 21.222 2.12902 20.249 3.02702Z" fill="black" />
                            </svg>
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                What&apos;s your timeline
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                48 hours
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                What&apos;s your budget
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                $1600
                            </p>
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' mt-10 mx-[60px] flex justify-between'>
                            <h2
                                className='text-[22px] font-semibold'
                            >
                                About you
                            </h2>
                            <svg className='cursor-pointer' width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.20001 20.644C1.48001 21.384 0.950013 22.288 0.950013 24.417C0.950013 26.546 0.659013 27.23 1.18101 27.759C1.70201 28.288 2.42501 27.815 4.42901 27.815C6.43301 27.815 7.89901 26.675 8.70301 25.996C9.50701 25.317 21.232 12.953 21.923 12.483C22.614 12.013 23.351 10.895 22.567 10.217C21.783 9.53802 19.134 7.15402 18.323 6.52002C17.512 5.88602 16.743 6.22402 15.845 7.03502C14.947 7.84602 2.92001 19.904 2.20001 20.644ZM20.249 3.02702C19.276 3.92502 19.767 4.36202 20.412 5.11902C21.057 5.87602 23.567 7.95202 24.026 8.43602C24.485 8.92002 25.113 9.41002 25.94 8.53702C26.767 7.66402 27.744 6.38302 28.395 5.61402C29.046 4.84502 29.342 3.62802 27.143 1.71402C24.944 -0.199981 23.837 -0.287981 22.98 0.408019C22.123 1.10302 21.222 2.12902 20.249 3.02702Z" fill="black" />
                            </svg>
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                What industry are you in?
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                Finance
                            </p>
                            <hr className='mt-5 text-[#0000001A]' />
                        </div>
                        <div className='my-8 mx-[60px]'>
                            <h3 className='text-lg font-semibold'>
                                How did you hear about us?
                            </h3>
                            <p className='text-[#53565B] mt-4 text-base font-normal'>
                                Facebook
                            </p>
                        </div>
                    </div>
                </div>
                <div className='w-[34%] flex flex-col gap-y-3 '>
                    <div >
                        <img src='' alt='img' width="100%" className='bg-[#C4C4C4] h-[400px]' />
                    </div>
                    <div>
                        <img src='' alt='img' width="100%" className='bg-[#C4C4C4] h-[400px]' />
                    </div>
                    <div>
                        <img src='' alt='img' width="100%" className='bg-[#C4C4C4] h-[400px]' />
                    </div>
                </div>
            </div>
            <div className='container mx-auto mb-10 flex justify-end'>
                <button className='bg-[#FFCD00] text-[#000000] w-[96px] h-[48px] text-base font-semibold'>Next</button>
            </div>
        </>
    )
}

export default ReviewDetails