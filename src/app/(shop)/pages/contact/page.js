"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sendRequest } from '@/helpers/utils';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import ContactSkeleton from './ContactSkeleton';
import WLBGoogleMapAPI from './WLBGoogleMapAPI';

function ContactUS() {
    const [userName, setUserName] = useState("Name");
    const [companyName, setCompanyName] = useState("Company Name");
    const [userEmail, setUserEmail] = useState("Email");
    const [contactNumber, setContactNumber] = useState("Contact Number");
    const [subject, setSubject] = useState("Subject");
    const [message, setMessage] = useState("Message");
    const [selectedFile, setSelectedFile] = useState(null);
    const [contactApiResponse, setContactApiResponse] = useState([])

    useEffect(() => {
        async function fetchContactApi() {
            try {
                const responseData = await sendRequest(`/api/contact/`);
                if (responseData.status === API_RESPONSE_STATUS.ERROR) {
                    // Handle error case
                    console.error('API request error:', responseData.error);
                } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
                    setContactApiResponse(responseData.data)
                }
            } catch (error) {
                console.error('API request failed:', error);
            }
        }
        fetchContactApi();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit Clicked")
    }
    const handleFileChange = (e) => {
        console.log(e)
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    return <div>{
        (!contactApiResponse.length ? <ContactSkeleton /> :
            <>
                <div className='w-full h-[230px] lg:h-[350px] sm:h-[330px]' style={{ backgroundImage: `url(${contactApiResponse[0]?.avatar})`, backgroundSize: 'cover', }}>
                    <div className='container h-full px-2 lg:px-[50px] xl:px-0 mx-auto flex items-center'>

                        <div className='flex flex-col justify-center'>
                            <div className="mb-4">
                                <span className="inline-block h-[4px] align-middle w-[20px] sm:w-[60px] bg-[#8A1E41]"></span>
                                <span className="inline-block text-sm uppercase text-white p-2 sm:pl-3 font-semibold ">{`${contactApiResponse[0]?.title}`}</span>
                            </div>
                            <span className="inline-block tracking-wide align-middle text-4xl sm:text-5xl sm:tracking-normal text-white font-bold ">{`${contactApiResponse[0]?.description}`}</span>
                        </div>
                    </div>
                </div>
                <div className='my-4 lg:my-16'>
                    <nav className="container mx-auto px-2 lg:px-[50px] xl:px-0 text-xs sm:text-sm mt-4 lg:text-base ">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex text-gray-500">
                                <Link href="/" className="hover:text-[#FFCD00] flex items-center hover:cursor-pointer">Home</Link><span className='mx-1'>/</span>
                            </li>
                            <li className="flex items-center">
                                <Link href="#" className="font-semibold text-[#FFCD00] hover:cursor-default">Contact</Link>
                            </li>
                        </ol>
                    </nav>
                    <div className='container relative mx-auto my-4 lg:mt-10 mb-6'>
                        <div className="flex flex-col lg:flex-row gap-10 lg:px-[50px] xl:px-0">
                            <div className="container px-2 lg:px-0 lg:w-1/2">
                                <div className="mb-4">
                                    <span className="inline-block h-[2px] align-middle w-[40px] bg-[#8A1E41]"></span>
                                    <span className="inline-block align-middle text-xs lg:tracking-widest uppercase text-black pl-3 font-semibold ">{`${contactApiResponse[0]?.heading_one}`}</span></div>
                                <div>
                                    <h1 className="text-3xl font-bold xl:text-5xl lg:font-extrabold">{`${contactApiResponse[0]?.heading_two}`}</h1>
                                    <p className="mt-4 text-gray-500">{`${contactApiResponse[0]?.heading_three}`}</p>
                                </div>
                                <div className='flex flex-col gap-4 mt-5'>
                                    <div className="flex gap-4 items-center">
                                        <Link href="#"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></Link>
                                        <div className='flex flex-col'>
                                            <span className='font-bold'>Head Office</span>
                                            <p className=' text-gray-500'>{`${contactApiResponse[0]?.head_office_address}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Link href={`tel:${"09 623 6666"}`}><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 18H12.01M11 6H13M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></Link>
                                        <p className=' text-gray-500'>{`${contactApiResponse[0]?.number}`}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Link href={`mailto:${"sales@fivestarprint.co.nz"}`}><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18L9 12M20 18L15 12M3 8L10.225 12.8166C10.8665 13.2443 11.1872 13.4582 11.5339 13.5412C11.8403 13.6147 12.1597 13.6147 12.4661 13.5412C12.8128 13.4582 13.1335 13.2443 13.775 12.8166L21 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></Link>
                                        <p className=' text-gray-500'>{`${contactApiResponse[0]?.email}`}</p>
                                    </div>
                                    <div className='w-full'>
                                        <WLBGoogleMapAPI address={"Unit 5/273, Neilson Street, Onehunga, Auckland 1061"} />
                                    </div>
                                </div>
                            </div>
                            <div className="container px-2 lg:px-0 lg:w-1/2">
                                <h2 className='text-xl lg:text-3xl font-bold'>Get in touch with us!</h2>
                                <div>
                                    <form onSubmit={handleSubmit} >
                                        <div className='flex flex-col gap-4 mt-4 mr-2 lg:mr-0'>
                                            <input type='text' className=" text-md w-full rounded-lg p-2 border border-gray-400" onChange={e => setUserName(e.target.value)} value={userName} />
                                            <input type='text' className="w-full rounded-lg p-2 border border-gray-400" onChange={e => setCompanyName(e.target.value)} value={companyName} />
                                            <input type='email' className="w-full rounded-lg p-2 border border-gray-400" onChange={e => setUserEmail(e.target.value)} value={userEmail} />
                                            <input type='tel' className="w-full rounded-lg p-2 border border-gray-400" onChange={e => setContactNumber(e.target.value)} value={contactNumber} />
                                            <input type='text' className="w-full rounded-lg p-2 border border-gray-400" onChange={e => setSubject(e.target.value)} value={subject} />
                                            <textarea rows={5} cols={40} className='w-full rounded-lg p-2 border border-gray-400' onChange={e => setMessage(e.target.value)} value={message} />
                                            <input type='file' className="w-full" onChange={handleFileChange} />
                                            <input type='submit' className="rounded-lg text-bold text-white w-fit p-3 bg-[#8A1E41]" value="Submit" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
}
export default ContactUS;