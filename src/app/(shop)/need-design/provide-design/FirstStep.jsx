"use client"
import React from 'react'
import { useState, useRef } from "react"

const FirstStep = ( {toggleStep} ) => {
    const [file, setFile] = useState(null)
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files)
        console.log(event)
    }

    const handleincreaseParameter = () => {
        toggleStep('increase')
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const handledecreaseParameter = () => {
        toggleStep('decrease')
    }

    return (
        <>
            <div className='container mx-auto flex justify-between my-10'>
                <div className='w-[62%]'>
                    <div className='flex justify-between'>
                        <h3 className='text-[26px] font-semibold'>Tell us about your project </h3>
                        <p className='font-[#53565B] text-lg font-semibold '>1/3</p>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='project_name'
                                className='text-[22px] font-semibold'
                            >
                                Name your project <span className='text-[#8A1E41]'>*</span>
                            </label>
                            <input
                                id='project_name'
                                className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' width='100%'
                                type="text"
                                placeholder='E.g. Packaging for an organic juice company'
                                required
                            />
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='design_type'
                                className='text-[22px] font-semibold'
                            >
                                What type of design do you need? <span className='text-[#8A1E41]'>*</span>
                            </label>
                            <input
                                id='design_type'
                                className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' width='100%'
                                type="text"
                                placeholder='Select category'
                                required
                            />
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='describe_project'
                                className='text-[22px] font-semibold'
                            >
                                Describe your project? <span className='text-[#8A1E41]'>*</span>
                            </label>
                            <textarea
                                id='describe_project'
                                className='resize-none border-[1px] w-[100%] mt-5 py-2 px-4 rounded'
                                placeholder='E.g. I need a package designed for a new flavor of organic juice. It should feature a retro and vibrant design style and include our company logo on the front of the bottle. Our juice appeals to adults aged from 25-35. Our bottle contains 500mls (see attached reference image for actual shape and size).'
                                rows="4"
                                required
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='design_use'
                                className='text-[22px] font-semibold'
                            >
                                How will your design be used?
                            </label>
                            <input
                                id='design_use'
                                className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' width='100%'
                                type="text"
                                placeholder='E.g. Billboard, facebook campaign, bookcover, etc'
                            />
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='design_file'
                                className='text-[22px] font-semibold'
                            >
                                Add reference files?
                            </label>
                            <p className='mt-4 text-lg'>
                                Upload any files that your designer needs including your logo, photos, brand guide, fonts, copy, and any other documents.
                            </p>
                            {!file ? <div
                                className='mt-10 w-[220px] h-[206px] flex flex-col justify-center text-center items-center gap-2 border-[1px] border-dashed border-[#53565B80] rounded'
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M37.9999 18H22.0001V1.99988C22.0001 0.896118 21.104 0 19.9999 0C18.8961 0 18 0.896118 18 1.99988V18H1.99988C0.896118 18 0 18.8961 0 19.9999C0 21.104 0.896118 22.0001 1.99988 22.0001H18V37.9999C18 39.104 18.8961 40.0001 19.9999 40.0001C21.104 40.0001 22.0001 39.104 22.0001 37.9999V22.0001H37.9999C39.104 22.0001 40.0001 21.104 40.0001 19.9999C40.0001 18.8961 39.104 18 37.9999 18Z" fill="black" />
                                </svg>
                                <p className='text-base'>Drag and drop your<br />files here</p>
                                <p className='text-sm'>OR</p>
                                <input 
                                    type="file"
                                    onChange={(event) => setFile(event.target.files)}
                                    hidden
                                    accept="image/png, image/jpeg"
                                    ref={inputRef}
                                />
                                <button onClick={() => inputRef.current.click()} className='text-base text-[#FFCD00] underline decoration-inherit'>select file</button>
                            </div>: 
                            <div  className='mt-10 w-[220px] h-[206px] flex flex-col justify-center text-center items-center gap-2 border-[1px] border-dashed border-[#53565B80] rounded'>
                                <button onClick={() => setFile(null)}>x</button>
                                {file[0].name}
                            </div>
                            }
                            

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
                <button onClick={handleincreaseParameter} className='bg-[#FFCD00] text-[#000000] w-[96px] h-[48px] text-base font-semibold'>Next</button>
            </div>
        </>
    )
}

export default FirstStep