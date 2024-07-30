'use client';

import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { uploadToServer } from '@/helpers/utils';
import Link from 'next/link';
import { useState } from 'react';
import Spinner from '../../common/spinner';
import {
    IMAGE_UPLOAD_END_POINT,
    replaceParams,
} from '@/constants/admin-pannel/end-points';
import AlertMessage from '../../common/alert';
import {
    FEATURED_BANNERS_PAGES_ROUTES,
    LARGE_BANNERS_PAGES_ROUTES,
} from '@/constants/admin-pannel/routes';

export default function StepperCreator({
    createSchema,
    url,
    submittedData,
    imageKey = 'image_url',
    successUrl = '',
    imagePathUrl = '',
    onSubmitComplete,
    step,
    setStepNo,
}) {
    const [creationFormInfo, setCreationInfo] = useState({
        errorMessage: '',
        successMessage: '',
        loading: false,
    });
    const [imgUrl, setUrl] = useState();
    const [isMinimumOrderQuantityAvailable, setIsMinimumOrderQuantityAvailable] = useState(false);

    const [updatedSchema, setUpdatedSchema] = useState(createSchema);

    const handleStepZero = (e) => {
        setCreationInfo((prevState) => ({ ...prevState, loading: true }));
        e.preventDefault();

        const bodyData = Object.fromEntries(new FormData(e.target));
        if (imgUrl) {
            bodyData[imageKey] = imgUrl;
        }
        bodyData.features = [bodyData.features];
        bodyData.type = [bodyData.type];

        // These two fields are required only for larger banners and Featured banners
        if (successUrl == FEATURED_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'FEATURED_BANNER';
        }
        if (successUrl == LARGE_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'LARGE_BANNER';
        }

        for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                if (bodyData[key] === '') {
                    delete bodyData[key];
                }
            }
        }
        onSubmitComplete(bodyData);
    };
    const handleStepTwo = (e) => {
        setCreationInfo((prevState) => ({ ...prevState, loading: true }));

        const bodyData = Object.fromEntries(new FormData(e.target));
        if (imgUrl) {
            bodyData[imageKey] = imgUrl;
        }
        const specifications = {
            specification: bodyData.specification || "",
            description: bodyData.description || ""
        };
        delete bodyData.specification;
        delete bodyData.description;

        const materials = {
            component: bodyData.component || "",
            material: bodyData.material || ""
        };
        delete bodyData.component;
        delete bodyData.material;

        const sizing = {
            sizing_line: bodyData.sizing_line || ""
        };
        delete bodyData.sizing_line;

        const carton = {
            length: bodyData.length || "",
            width: bodyData.width || "",
            height: bodyData.height || "",
            weight: bodyData.weight || "",
            quantity: bodyData.quantity || ""
        };
        delete bodyData.length;
        delete bodyData.width;
        delete bodyData.height;
        delete bodyData.weight;
        delete bodyData.quantity;

        // Convert dimensions to an array of strings if it exists
        const dimensions = bodyData.dimensions ? bodyData.dimensions.split(',').map(dimension => dimension.trim()) : [];
        delete bodyData.dimensions;

        bodyData.specifications = specifications;
        bodyData.materials = materials;
        bodyData.sizing = sizing;
        bodyData.carton = carton;
        bodyData.dimensions = dimensions;

        // These two fields are required only for larger banners and Featured banners
        if (successUrl == FEATURED_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'FEATURED_BANNER';
        }
        if (successUrl == LARGE_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'LARGE_BANNER';
        }

        for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                if (bodyData[key] === '') {
                    delete bodyData[key];
                }
            }
        }
        onSubmitComplete(bodyData);
    }

    const handleStepThree = (e) => {
        setCreationInfo((prevState) => ({ ...prevState, loading: true }));
        e.preventDefault();

        const bodyData = Object.fromEntries(new FormData(e.target));
        if (imgUrl) {
            bodyData[imageKey] = imgUrl;
        }


        // These two fields are required only for larger banners and Featured banners
        if (successUrl == FEATURED_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'FEATURED_BANNER';
        }
        if (successUrl == LARGE_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'LARGE_BANNER';
        }

        for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                if (bodyData[key] === '') {
                    delete bodyData[key];
                }
            }
        }
        onSubmitComplete(bodyData);
    };

    const handleStepFour = (e) => {
        setCreationInfo((prevState) => ({ ...prevState, loading: true }));
        e.preventDefault();

        const bodyData = Object.fromEntries(new FormData(e.target));
        if (imgUrl) {
            bodyData[imageKey] = imgUrl;
        }

        const product_variation_items = [
            {
                name: bodyData.name,
                hex_code: bodyData.hex_code,
                variation_id: submittedData?.variation_id,
                available_quantity: bodyData.available_quantity || 0,
                next_shipment_quantity: bodyData.next_shipment_quantity || 0,
                prices: [{ quantity: bodyData.quantity || 0, price: bodyData.price || 0 }],
                is_file_available: bodyData.is_file_available,
                files: [
                    {
                        name: bodyData.name,
                        type: "IMAGE",
                        url: bodyData.url,
                        caption: bodyData.caption,
                        is_thumbnail: bodyData.is_thumbnail,
                    },
                ],
            },
        ];
        delete submittedData.variation_id
        bodyData.product_variation_items = product_variation_items;

        // These two fields are required only for larger banners and Featured banners
        if (successUrl == FEATURED_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'FEATURED_BANNER';
        }
        if (successUrl == LARGE_BANNERS_PAGES_ROUTES.LIST) {
            bodyData.type = 'LARGE_BANNER';
        }

        for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                if (bodyData[key] === '') {
                    delete bodyData[key];
                }
            }
        }
        onSubmitComplete(bodyData);
    };

    const handleShowFields = (name, type) => {
        if (type === "is_minimum_order_quantity_available") {
            if (name === "false") {
                setUpdatedSchema(updatedSchema.filter(field => field.name !== 'minimum_order_quantity_number' && field.name !== 'minimum_order_quantity_price'));
            } else {
                setUpdatedSchema([
                    ...updatedSchema,
                    {
                        name: 'minimum_order_quantity_number',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'minimum_order_quantity_price',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                ]);
            }
        }

        if (type === "is_product_sample_available") {
            if (name === "false") {
                setUpdatedSchema(updatedSchema.filter(field => field.name !== 'product_sample_price'));
            } else {
                setUpdatedSchema([
                    ...updatedSchema,
                    {
                        name: 'product_sample_price',
                        type: 'number',
                        required: false,
                    },
                ]);
            }
        }
        if (type === "is_variation_items_available") {
            if (name === "false") {
                setUpdatedSchema(updatedSchema.filter(field => field.name !== 'name' && field.name !== 'hex_code' && field.name !== 'available_quantity' && field.name !== 'next_shipment_quantity' && field.name !== 'quantity' && field.name !== 'price' && field.name !== 'is_file_available' && field.name !== 'name' && field.name !== 'url' && field.name !== 'caption' && field.name !== 'is_thumbnail' && field.name !== 'Product Variation Items' && field.name !== 'Files' && field.name !== 'Prices'));
            } else {
                setUpdatedSchema([
                    ...updatedSchema,
                    { type: 'heading', name: 'Product Variation Items' },
                    {
                        name: 'name',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'hex_code',
                        type: 'color',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'available_quantity',
                        type: 'number',
                        required: true,
                    },
                    {
                        name: 'next_shipment_quantity',
                        type: 'number',
                        required: true,
                    },
                    { type: 'heading', name: 'Prices' },
                    {
                        name: 'quantity',
                        type: 'number',
                        required: true,
                    },
                    {
                        name: 'price',
                        type: 'number',
                        required: true,
                    },
                    { type: 'heading', name: 'Files' },
                    {
                        name: 'is_file_available',
                        type: 'dropdown',
                        required: true,
                        values: [
                            { label: 'False', id: 'false' },
                            { label: 'True', id: 'true' },
                        ],
                    },
                    {
                        name: 'name',
                        type: 'text',
                    },
                    {
                        name: 'url',
                        type: 'text',
                        
                    },
                    {
                        name: 'caption',
                        type: 'text',
                        
                    },
                    {
                        name: 'is_thumbnail',
                        type: 'dropdown',
                        values: [
                            { label: 'False', id: 'false' },
                            { label: 'True', id: 'true' },
                        ],
                    },
                ]);
            }
        }
        if (type === "is_branding_available") {
            if (name === "false") {
                setUpdatedSchema(updatedSchema.filter(field => field.name !== 'full_colour' && field.name !== 'mix_and_match' && field.name !== 'branding_type' && field.name !== 'branding_area' && field.name !== 'description' && field.name !== 'branding_unit_price' && field.name !== 'branding_set_up_price'));
            } else {
                setUpdatedSchema([
                    ...updatedSchema,
                    {
                        name: 'full_colour',
                        type: 'dropdown',
                        required: true,
                        values: [
                            { label: 'False', id: 'false' },
                            { label: 'True', id: 'true' },
                        ],
                    },
                    {
                        name: 'mix_and_match',
                        type: 'dropdown',
                        required: true,
                        values: [
                            { label: 'False', id: 'false' },
                            { label: 'True', id: 'true' },
                        ],
                    },
                    {
                        name: 'branding_type',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'branding_area',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'description',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'branding_unit_price',
                        type: 'number',
                        required: false,
                    },
                    {
                        name: 'branding_set_up_price',
                        type: 'number',
                        required: false,
                    },
                ]);
            }
        }
        if (type === "is_additional_information_available") {
            if (name === "false") {
                setUpdatedSchema(updatedSchema.filter(field => !["Specifications", 'Materials', 'specification', 'Sizing', 'Carton', 'description', 'component', 'material', 'dimensions', 'sizing_line', 'packaging', 'length', 'width', 'height', 'weight', 'quantity'].includes(field.name)));
            } else {
                setUpdatedSchema([
                    ...updatedSchema,

                    { type: 'heading', name: 'Specifications' },
                    {
                        name: 'specification',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'description',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    { type: 'heading', name: 'Materials' },
                    {
                        name: 'component',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'material',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'dimensions',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter dimensions (comma-separated)',
                    },
                    { type: 'heading', name: 'Sizing' },
                    {
                        name: 'sizing_line',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'packaging',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    { type: 'heading', name: 'Carton' },
                    {
                        name: 'length',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'width',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'height',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'weight',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                    {
                        name: 'quantity',
                        type: 'text',
                        required: true,
                        placeholder: 'This is required',
                    },
                ]);
            }
        }
    };


    const handleCreateForm = (e, step) => {
        e.preventDefault();
        switch (step) {
            case 0: handleStepZero(e);
                break;
            case 2: handleStepTwo(e);
                break;
            case 3: handleStepThree(e);
                break;
            case 4: handleStepFour(e);
                break;
        }
    };


    const handleUploadToServer = async (event) => {
        let fileName = '';
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            fileName = event.target.files[0].name;

            const path = replaceParams(IMAGE_UPLOAD_END_POINT, {
                path: imagePathUrl,
            });
            // Upload the image to the server and wait for the response
            const responseData = await uploadToServer(event, path);

            // Check if the server response indicates success
            if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
                setUrl(responseData.data.urls[0]);
            }
        }
    };
    return (
        <form onSubmit={(e) => handleCreateForm(e, step)} className="flex flex-col gap-6">
            <div className="grid gap-3 md:grid-cols-1">
                {updatedSchema.map((eachField, index) =>
                    eachField.type === 'heading' ? (
                        <div key={index} className="text-2xl font-semibold mt-4 text-gray-500">
                            {eachField.name}
                        </div>
                    ) : eachField.type === 'color' ? (
                        <div key={index}>
                            <label
                                htmlFor={eachField.name}
                                className="block mb-2 text-sm font-medium mt-[20px] capitalize"
                            >
                                {eachField.name.split('_').join(' ')}
                            </label>
                            <input
                                className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block"
                                placeholder={eachField.placeholder}
                                required={eachField.required}
                                type={eachField.type}
                                name={eachField.name}
                                id={eachField.name}
                                defaultValue={eachField.value || "#ff0000"}
                            />
                        </div>
                    ) : eachField.type === 'dropdown' ? (
                        <div key={index}>
                            <label
                                htmlFor={eachField.name}
                                className="block mb-2 text-sm font-medium mt-[20px] capitalize"
                            >
                                {eachField.name.split('_').join(' ')}
                            </label>
                            <select
                                onChange={(e) => handleShowFields(e.target.value, eachField.name)}
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
                    ) : eachField.type === 'file' ? (
                        <div key={index} className="flex items-center gap-4 mt-[20px]">
                            {imgUrl && (
                                <div className="flex flex-col items-center gap-1">
                                    <small>Recent image</small>
                                    <img src={imgUrl} className="w-24 h-24" />
                                    <Link
                                        target="_blank"
                                        className="text-[14px] text-blue-400"
                                        href={imgUrl}
                                    >
                                        View
                                    </Link>
                                </div>
                            )}
                            <div className="grow">
                                <label
                                    htmlFor={eachField.name}
                                    className="block mb-2 text-sm font-medium capitalize"
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
                                    defaultValue={eachField.value}
                                    onChange={handleUploadToServer}
                                />
                            </div>
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
            <div className='flex justify-between'>
                {(!step <= 0) && <button onClick={() => setStepNo(step - 1)} className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                    {creationFormInfo.loading ? (
                        <Spinner bgColor1="white" bgColor2="#851B39" />
                    ) : (
                        'Back'
                    )}
                </button>}
                {step !== 4 ? <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                    {creationFormInfo.loading ? (
                        <Spinner bgColor1="white" bgColor2="#851B39" />
                    ) : (
                        'Next'
                    )}
                </button> :
                    <button className="inline-flex h-[48px] rounded-md text-white font-semibold text-md px-[16px] justify-center items-center gap-4 flex-shrink-0 rounded-6 bg-[#8A1E41]">
                        {creationFormInfo.loading ? (
                            <Spinner bgColor1="white" bgColor2="#851B39" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                }
            </div>
        </form>
    );
}

