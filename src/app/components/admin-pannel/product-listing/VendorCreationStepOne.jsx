'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Spinner from '../../common/spinner';
import AlertMessage from '../../common/alert';
import VendorCreationSteptwo from './VendorCreationSteptwo';

export default function CreateForm({
    createSchema,
    url
}) {
    const [step, setStep] = useState(0);
    const [vendorData, setVendorData] = useState({})
    const [creationFormInfo, setCreationInfo] = useState({
        errorMessage: '',
        successMessage: '',
        loading: false,
    });

    useEffect(() => {
        const localVendorData = JSON.parse(localStorage.getItem("vendorData"));
        if(localVendorData){
        setVendorData(localVendorData);
        setStep(1);
        }
    }, [])

    const handleCreateForm = async (e) => {
        setCreationInfo((prevState) => ({ ...prevState, loading: true }));
        e.preventDefault();

        const bodyData = Object.fromEntries(new FormData(e.target));

        for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                if (bodyData[key] === '') {
                    delete bodyData[key];
                }
            }
        }

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(bodyData),
        };
        try {
            const responseData = await sendRequest(url, options);

            if (responseData.status === API_RESPONSE_STATUS.ERROR) {
                setCreationInfo((prevState) => ({
                    ...prevState,
                    errorMessage: responseData.message,
                    loading: false,
                }));
            } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
                setStep(prev => prev + 1);
                setVendorData(responseData.data)
                localStorage.setItem("vendorData", JSON.stringify(responseData.data))
            }
        } catch (error) {
            console.error('API request failed:', error);
            setCreationInfo((prevState) => ({ ...prevState, loading: false }));
        }
    };

    return (step === 1 && Object.keys(vendorData).length) ?
        <VendorCreationSteptwo
            step={step}
            vendorData={vendorData}
            setStepNo={setStep}
        /> : (
            <form onSubmit={handleCreateForm} className="flex flex-col gap-6">
                <div className="grid gap-3 md:grid-cols-1">
                    {createSchema.map((eachField, index) =>
                        eachField.type === 'dropdown' ? (
                            <div key={index}>
                                <label
                                    htmlFor={eachField.name}
                                    className="block mb-2 text-sm font-medium mt-[20px] capitalize"
                                >
                                    {eachField.name.split('_').join(' ')}
                                </label>
                                <select
                                    id={eachField.name}
                                    required={eachField.required}
                                    type={eachField.type}
                                    name={eachField.name}
                                    className="border mt-[10px] border-solid border-opacity-20 py-[12px] px-[10px] text-gray-900 text-sm   block w-full"
                                >
                                    <option value="">Select</option>
                                    {eachField.values.map((eachValue, index) => (
                                        <option key={index} value={eachValue.id}>
                                            {eachValue.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div key={index}>
                                <label
                                    htmlFor={eachField.name}
                                    className="block mb-2 text-sm font-medium mt-[20px] capitalize"
                                >
                                    {eachField.name.split('_').join(' ')}
                                </label>
                                <input
                                    className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder={eachField.placeholder}
                                    required={eachField.required}
                                    type={eachField.type}
                                    name={eachField.name}
                                    accept="image/*"
                                    id={eachField.name}
                                    step={0.01}
                                />
                            </div>
                        )
                    )}
                </div>
                {creationFormInfo.errorMessage || creationFormInfo.successMessage ? (
                    <AlertMessage
                        name={creationFormInfo.errorMessage ? 'error' : 'success'}
                        message={
                            creationFormInfo.errorMessage || creationFormInfo.successMessage
                        }
                        linkText={null}
                        linkHref={null}
                        textColor={
                            creationFormInfo.errorMessage ? 'text-red-800' : 'text-green-800'
                        }
                        bgColor={creationFormInfo.errorMessage ? 'bg-red-50' : 'bg-green-50'}
                        closeAction={() =>
                            setCreationInfo({
                                ...creationFormInfo,
                                errorMessage: '',
                                successMessage: '',
                            })
                        }
                    />
                ) : null}
                <div>
                    <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                        {creationFormInfo.loading ? (
                            <Spinner bgColor1="white" bgColor2="#851B39" />
                        ) : (
                            'Submit & Continue'
                        )}
                    </button>
                </div>
            </form>
        );
}
