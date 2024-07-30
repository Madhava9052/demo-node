"use client"
import Accordion from "@/app/components/common/Accordion";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { sendRequest } from "@/helpers/utils";
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import Cookies from 'js-cookie';
import FaqsSkeleton from "./FaqsSkeleton";

const Faq = () => {

    const [faqsApiResponse, setFaqsApiResponse] = useState([]);
    const items = faqsApiResponse.map((item) => ({
        title: item.question,
        content: item.answer
    }));

    useEffect(() => {
        async function fetchFaqsApi() {
            try {
                const responseData = await sendRequest(`/api/frequently_asked_questions`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
                if (responseData.status === API_RESPONSE_STATUS.ERROR) {
                    // Handle error case
                    console.error('API request error:', responseData.error);
                } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
                    setFaqsApiResponse(responseData.data)
                }
            } catch (error) {
                console.error('API request failed:', error);
            }
        }
        fetchFaqsApi();
    }, [])

    return (<div>
        {!faqsApiResponse.length ? <FaqsSkeleton /> : <>
            <div className='w-full h-[230px] lg:h-[350px] sm:h-[330px]' style={{ backgroundImage: 'url("https://brunn.qodeinteractive.com/wp-content/uploads/2018/09/p5-background-img-1.jpg")', backgroundSize: 'cover', }}>
                <div className='container mx-auto flex h-full px-2 lg:px-[50px] xl:px-0'>
                    <div className='flex flex-col justify-center'>
                        <div className="mb-4">
                            <span className="inline-block h-[4px] align-middle w-[20px] sm:w-[60px] bg-[#8A1E41]"></span>
                            <span className="inline-block text-sm uppercase text-white p-2 sm:pl-3 font-semibold ">ASK AWAY</span>
                        </div>
                        <span className="inline-block w-full lg:w-1/2 align-middle text-4xl sm:text-5xl text-white font-bold ">Frequently <br /> Asked <br /> Questions</span>
                    </div>
                </div>
            </div>
            <nav className="container mt-16 mx-auto px-2 lg:px-[50px] xl:px-0 text-xs sm:text-sm lg:text-base text-gray-500">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex">
                        <Link href="/" className="hover:text-[#FFCD00] flex items-center hover:cursor-pointer">Home</Link><span className='mx-1'>/</span>
                    </li>
                    <li className="flex items-center">
                        <span className="text-[#FFCD00] font-semibold hover:cursor-default"> Frequently Asked Questions</span>
                    </li>
                </ol>
            </nav>
            <div className="container mx-auto mt-4 mb-16 px-2 lg:px-[50px] xl:px-0">
                <Accordion items={items} />
            </div>
        </>}
    </div>
    )
}
export default Faq;