"use client"
import React, { useState } from 'react'

function ThirdStep({toggleStep}) {
    const [industryValue, setIndustryValue] = useState('')
    const [hearAboutValue, setHearAboutValue] = useState('')
    const [aboutCompany, setAboutCompany] = useState('')
    const [showCase, setShowCase] = useState('')

    const industry_options = [
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Construction", value: "Construction" },
        { label: "Education", value: "Education" },
        { label: "Entertainment", value: "Entertainment" },
    ]

    const hear_about_options = [
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "Tweeter", value: "tweeter" },
    ]

    const about_your_company = [
        { value: "yes_interested", label: "Yes and I'm interested in agency services" },
        { value: "yes_not_interested", label: "Yes and I'm NOT interested in agency services" },
        { value: "no_agency", label: "No, I'm not an agency" },
    ]

    const can_showcase = [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
    ]

    function handleIndustrySlected(event) {
        setIndustryValue(event.target.industryValue)
    }

    function handleHearAboutSlected(event) {
        setHearAboutValue(event.target.hearAboutValue)
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
                    <div onClick={handledecreaseParameter} className='flex gap-3 items-center'>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.145941 6.85493L6.62183 13.47L8 12.5533L2.29949 6.73176L8 0.910187L6.62183 -2.02555e-08L0.145941 6.61507L-3.95775e-07 6.71231L0.0253812 6.73824L-4.02517e-07 6.76417L0.145941 6.85493Z" fill="#53565B" />
                        </svg>
                        <button className='text-base font-semibold'>Back</button>
                    </div>
                    <div className='mt-5 flex justify-between'>
                        <h3 className='text-[26px] font-semibold'>About you</h3>
                        <p className='font-[#53565B] text-lg font-semibold '>3/3</p>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <h2 className='text-[22px] font-semibold'>
                                What industry are you in?
                            </h2>
                            <select className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' onChange={handleIndustrySlected}>
                                <option defaultValue='Select industry' disabled>Select industry</option>
                                {industry_options.map((option, index) => (
                                    <option key={index} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='social_media'
                                className='text-[22px] font-semibold'
                            >
                                Add your website and/or social media pages
                            </label>
                            <input
                                id='social_media'
                                className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' width='100%'
                                type="text"
                                placeholder='E.g. www.website-name.com'
                                required
                            />
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <h2
                                className='text-[22px] font-semibold'
                            >
                                Is your company a digital, marketing or design agency?
                            </h2>
                            {
                                about_your_company.map(item => (
                                    <div key={item.value}  className='text-base w-[100%] mt-4' width='100%' >
                                        <input
                                            name='about_compay'
                                            type='radio'
                                            value={item.value}
                                            id={item.value}
                                            className=''
                                            checked={aboutCompany === item.value}
                                            onChange={e => setAboutCompany(e.target.value)}
                                        /><label className='pl-2' htmlFor={item.value}>{item.label}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <h2 className='text-[22px] font-semibold'>
                                How did you hear about us?
                            </h2>
                            <select className='border-[1px] w-[100%] h-12 mt-5 py-2 px-4 rounded' onChange={handleHearAboutSlected}>
                                <option defaultValue='' disabled>Select channel</option>
                                {hear_about_options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <h2
                                className='text-[22px] font-semibold'
                            >
                                Can designer showcase the finished designs in their fivestar portfolio?
                            </h2>
                            {
                                can_showcase.map(item => (
                                    <div key={item.value}  className='text-base w-[100%] mt-4' width='100%' >
                                        <input
                                            name='show_case'
                                            type='radio'
                                            value={item.value}
                                            id={item.value}
                                            className='text-lg'
                                            checked={showCase === item.value}
                                            onChange={e => setShowCase(e.target.value)}
                                        /><label className='pl-2' htmlFor={item.value}>{item.label}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='mt-10 border shadow-lg' >
                        <div className=' my-10 mx-[60px]'>
                            <label
                                htmlFor='describe_project'
                                className='text-[22px] font-semibold'
                            >
                                Anything else you&apos;d like to share with your designer?
                            </label>
                            <textarea
                                id='describe_project'
                                className='resize-none border-[1px] w-[100%] mt-5 py-2 px-4 rounded'
                                rows="5"
                                required
                            >
                            </textarea>
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

export default ThirdStep