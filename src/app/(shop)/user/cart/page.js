'use client';
import AlertMessage from '@/app/components/common/alert';
import Spinner from '@/app/components/common/spinner';
import YouMayAlsoLike from '@/app/components/shop/product/youMayAlsoLike';
import StripeButton from '@/app/components/shop/stripe';
import CartCard from '@/app/components/shop/user/cart/cartCard';
import CartLoading from '@/app/components/shop/user/cart/cartLoading';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';

const libraries = ["places"];

export default function CartPage() {
  // Define and initialize state variables
  const [cartState, setCartState] = useState(null);
  const [address, setAddress] = useState();
  const [number, setNumber] = useState();
  const [topProducts, setTopProducts] = useState([])
  const [stepNum, setStepNum] = useState(0); // Tracks the current step in the checkout process
  const { globalStore, setGlobalStore } = useGlobalContext(); // Access global context
  const [pickUpAddress, setPickUpAddress] = useState([])
  const [autocomplete, setAutocomplete] = useState(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [selectedPickUpAddress, setSelectedPickUpAddress] = useState({})
  const [streetNumber, setStreetNumber] = useState('');

  // State variable for coupon-related information
  const [couponState, setCouponState] = useState({
    loading: false,
    successMessage: '',
    errorMessage: '',
  });
  // State variable to track the selected delivery method
  const [deliveryMethod, setDeliveryMethod] = useState('ship');

  // State variable to determine the billing address type (same or different)
  const [billingAddressType, setBillingAddressType] = useState('same');

  // State variable for billing address-related information
  const [billingAddressState, setBillingAddressState] = useState({
    loading: false,
    successMessage: '',
    errorMessage: '',
  });

  // State variable for shipping address-related information
  const [shippingAddressState, setShippingAddressState] = useState({
    loading: false,
    successMessage: '',
    errorMessage: '',
  });

  // State variable for contact information-related information
  const [contactInfo, setContactInfo] = useState({
    loading: false,
    successMessage: '',
    errorMessage: '',
  });

  // State variable to store checkout-related data
  const [checkoutData, setCheckoutData] = useState({
    delivery_method: 'SHIP',
  });

  // console.log("deliveryMethod", deliveryMethod)
  // console.log("shippingAddressState", shippingAddressState)
  // console.log("couponState", couponState)
  // console.log("cartState", cartState)
  // console.log("billingAddressState", billingAddressState)
  // console.log("pickUpAddress", pickUpAddress)
  // console.log("stepNum", stepNum)
  // console.log("adress", address)


  //handle refresh
  useEffect(() => {
    const storedStepNum = parseInt(localStorage.getItem("stepNum"));
    if (storedStepNum && storedStepNum === 2) {
      setStepNum(storedStepNum);
      const storedAddress = localStorage.getItem("address");
      if (storedAddress) {
        try {
          setAddress(JSON.parse(storedAddress));
        } catch (error) {
          console.error("Error parsing stored address:", error);
          // Handle the error, such as setting a default value for address
        }
      }
      const storedDeliveryMethod = localStorage.getItem("deliveryMethod");
      if (storedDeliveryMethod) {
        setDeliveryMethod(storedDeliveryMethod);
      }

      const storedShippingAddressState = localStorage.getItem("shippingAddressState");
      if (storedShippingAddressState) {
        setShippingAddressState(JSON.parse(storedShippingAddressState));
      }

      const storedCouponState = localStorage.getItem("couponState");
      if (storedCouponState) {
        setCouponState(JSON.parse(storedCouponState));
      }

      const storedCartState = localStorage.getItem("cartState");
      if (storedCartState) {
        setCartState(JSON.parse(storedCartState));
      }

      const storedBillingAddressState = localStorage.getItem("billingAddressState");
      if (storedBillingAddressState) {
        setBillingAddressState(JSON.parse(storedBillingAddressState));
      }
      const storedCheckoutData = localStorage.getItem("checkoutData");
      if (storedCheckoutData) {
        setCheckoutData(JSON.parse(storedCheckoutData));
      }
    } else {
      localStorage.removeItem("address");
      localStorage.removeItem("deliveryMethod");
      localStorage.removeItem("shippingAddressState");
      localStorage.removeItem("couponState");
      localStorage.removeItem("cartState");
      localStorage.removeItem("billingAddressState");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('address', JSON.stringify(address));
    localStorage.setItem('deliveryMethod', deliveryMethod);
    localStorage.setItem('shippingAddressState', JSON.stringify(shippingAddressState));
    localStorage.setItem('couponState', JSON.stringify(couponState));
    localStorage.setItem('cartState', JSON.stringify(cartState || {}));
    localStorage.setItem('billingAddressState', JSON.stringify(billingAddressState));
    localStorage.setItem('checkoutData', checkoutData);
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    localStorage.setItem('stepNum', stepNum.toString());
  }, [deliveryMethod, shippingAddressState, couponState, cartState, billingAddressState, pickUpAddress, stepNum, checkoutData]);

  // UseEffect hook to fetch initial data
  useEffect(() => {
    async function getData() {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      };

      const youmaylikeData = async () => {
        const [{ data: topProducts }] = await Promise.all([
          sendRequest('/api/products/?type=TOP'),
        ]);
        setTopProducts(topProducts)
      }
      youmaylikeData();

      // Fetch cart data and user's phone number in parallel
      const [
        { data: cartData },
        // { data: addresses },
        { data: numberData },
      ] = await Promise.all([
        sendRequest(`/api/carts/`, options),
        // sendRequest(`/api/address/`, options),
        sendRequest(`/api/users/number`, options),
      ]);

      // Update state variables with fetched data
      setCartState(cartData ? cartData : {});
      // setAddress(addresses);
      setNumber(numberData[0]?.number);
    }
    getData();
  }, []);


  useEffect(() => {
    const getPickUpData = async () => {
      const pickUpResponse = await sendRequest("/api/pickup_locations/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`
        }
      })
      setPickUpAddress(pickUpResponse.data)
      setSelectedPickUpAddress(pickUpResponse.data[0])
    }
    if (deliveryMethod !== "ship") {
      getPickUpData()
    }
  }, [deliveryMethod])

  if (cartState == null) {
    return <CartLoading />;
  }
  // If cartState is not yet available, display a loading message
  if (
    !cartState?.cart_items?.length &&
    !cartState?.save_for_later_items?.length
  ) {
    return (
      <section className="container mx-auto px-[20px] flex gap-20 h-[500px] flex-wrap items-center">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="my-4 text-4xl font-extrabold  leading-none text-gray-900 md:text-5xl lg:text-6xl">
            No products in your cart
          </h1>
        </div>
      </section>
    );
  }

  // Function to remove a cart item by its ID
  const removeCartItem = async (itemId, isSaveForLater) => {
    // Construct the API URL for deleting the cart item
    const url = `/api/carts/${cartState.id}/cart_item/${itemId}/`;
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    try {
      // Send the DELETE request to the API
      const responseData = await sendRequest(url, options);

      // Handle different API response statuses
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if needed
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If the DELETE request was successful, update the cart state
        const options = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        };
        const [
          { data: cartData },
          // { data: addresses },
          { data: numberData },
        ] = await Promise.all([
          sendRequest(`/api/carts/`, options),
          // sendRequest(`/api/address/`, options),
          sendRequest(`/api/users/number`, options),
        ]);
  
        // Update state variables with fetched data
        setCartState(cartData ? cartData : {});
        // setAddress(addresses);
        setNumber(numberData[0]?.number);
        // Update global store and refresh the page
        setGlobalStore({
          ...globalStore,
          cartCount: globalStore.cartCount - 1,
        });
        // window.location.reload();
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  // Function to Toggle the cart type using its ID and isSaveForLater value
  const moveToCart = async (itemId, isSaveForLater) => {
    // Construct the API URL for Toggling the cart item
    console.log("isSaveForLater", isSaveForLater)
    const url = `/api/carts/cart_item/${itemId}/save_for_later/?save_for_later=${!isSaveForLater}`;
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    try {
      // Send the PATCH request to the API
      const responseData = await sendRequest(url, options);

      // Handle different API response statuses
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if needed
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Update global store and refresh the page
        setGlobalStore({
          ...globalStore,
          cartCount: globalStore.cartCount - 1,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  // Function to handle coupon code submission
  const handleSubmitCouponCode = async (e, removeOrAdd) => {
    e.preventDefault();

    // Extract form data
    const formData = Object.fromEntries(new FormData(e.target));

    // Construct the API URL for applying or removing a coupon code
    const url = `/api/carts/${removeOrAdd === 'remove' ? 'remove' : 'apply'
      }/coupon/${formData.couponCode}`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    };
    setCouponState({ ...couponState, loading: true });

    try {
      // Send the request to apply or remove the coupon code
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if coupon code submission failed
        setCouponState({
          ...couponState,
          errorMessage: responseData.message,
          successMessage: '',
          loading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If coupon code submission was successful, update the cart state and display messages
        if (removeOrAdd === "remove") {
          setCartState({ ...cartState, ...responseData.data, applied_coupon_code: null, discount_amount: null });
        } else {
          setCartState({ ...cartState, ...responseData.data });
          setCouponState({
            ...couponState,
            errorMessage: '',
            successMessage: responseData.message,
            processLoading: false,
          });
        }
      }
      setTimeout(() => {
        setCouponState({
          ...couponState,
          errorMessage: '',
          successMessage: '',
          processLoading: false,
        });
      }, 5000);
      e.target.reset();
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  // Function to handle contact information submission
  const handleContactInformation = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = Object.fromEntries(new FormData(e.target));

    // Construct the API URL for updating contact information
    const url = `/api/users/number`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    };
    setContactInfo({ ...contactInfo, loading: true });

    try {
      // Send the request to update contact information
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if contact information submission failed
        setContactInfo({
          ...contactInfo,
          errorMessage: responseData.message,
          successMessage: '',
          loading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If contact information submission was successful, display success message
        setContactInfo({
          ...contactInfo,
          errorMessage: '',
          successMessage: responseData.message,
          loading: false,
        });
        setNumber(number);
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  async function handlePickUpAddress() {
    if (Object.keys(selectedPickUpAddress).length > 0) {
      setStepNum(2);

      const url = `/api/address/`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          "first_name": firstName,
          "last_name": lastName,
          "street_number": selectedPickUpAddress.street_number,
          "line_1": selectedPickUpAddress.line_1,
          "line_2": selectedPickUpAddress.line_2,
          "postal_code": selectedPickUpAddress.postal_code,
          "map_location": selectedPickUpAddress.map_location,
          "city": selectedPickUpAddress.city,
          "state": selectedPickUpAddress.state,
          "country": selectedPickUpAddress.country,
          "type": "PICKUP"
        }),
      };
      try {
        // Send the request to create or update the shipping address
        const responseData = await sendRequest(url, options);

        if (responseData.status === API_RESPONSE_STATUS.ERROR) {
          // Handle the error response if shipping address submission failed
          setSelectedPickUpAddress({
            ...selectedPickUpAddress,
            errorMessage: responseData.message,
            successMessage: '',
          });
        } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
          // If shipping address submission was successful, update the state and proceed to the next step
          setStepNum(2);
          setCheckoutData({
            ...checkoutData,
            shipping_address_id: responseData.data.id,
            billing_address_id: responseData.data.id,
            delivery_method: "PICK"
          });
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    } else {
      setSelectedPickUpAddress({ ...selectedPickUpAddress, errorMessage: 'Please Choose a PickUp Address to proceed' })
    }
  }
  // Function to handle shipping address submission
  const handleShippingAddress = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = Object.fromEntries(new FormData(e.target));

    // Construct the API URL for creating or updating the shipping address
    const url = `/api/address/${address ? address?.id : ''}`;
    const options = {
      method: address ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    };
    setShippingAddressState({ ...shippingAddressState, loading: true });

    try {
      // Send the request to create or update the shipping address
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if shipping address submission failed
        setShippingAddressState({
          ...shippingAddressState,
          errorMessage: responseData.message,
          successMessage: '',
          loading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If shipping address submission was successful, update the state and proceed to the next step
        setStepNum(2);
        setAddress(responseData.data);
        setCheckoutData({
          ...checkoutData,
          shipping_address_id: responseData.data.id,
          billing_address_id: responseData.data.id,
        });
        setShippingAddressState({
          ...shippingAddressState,
          ...responseData.data,
          errorMessage: '',
          successMessage: responseData.message,
          loading: false,
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  // Function to handle billing address submission
  const handleBillingAddress = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = Object.fromEntries(new FormData(e.target));

    // Construct the API URL for creating or updating the billing address
    const url = `/api/address/`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(formData),
    };
    setBillingAddressState({ ...billingAddressState, loading: true });

    try {
      // Send the request to create or update the billing address
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if billing address submission failed
        setBillingAddressState({
          ...billingAddressState,
          errorMessage: responseData.message,
          successMessage: '',
          loading: false,
        });
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If billing address submission was successful, update the state
        setCheckoutData({
          ...checkoutData,
          billing_address_id: responseData.data.id,
        });
        setBillingAddressState({
          ...billingAddressState,
          ...responseData.data,
          errorMessage: '',
          successMessage: responseData.message,
          loading: false,
        });
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const createOrder = async() => {
    const url = `/api/orders/check_out/?invoice=true`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(checkoutData),
    }
    try {
      // Send the request to create or update the billing address
      const responseData = await sendRequest(url, options);

      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle the error response if submission failed
        Swal.fire("Error", responseData.message, "error")
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // If submission was successful, redirect to orders
        Swal.fire("Success", "Order placed successfully", "success")
        window.location.href = '/user/profile?page=my_orders';
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  return (
    <section>
      <section className="container mx-auto flex flex-col lg:flex-row justify-between xl:flex-wrap gap-4 sm:gap-[60px] lg:gap-20 xl:gap-[7rem]">
        <div className="lg:max-w-[500px] xl:max-w-[960px] grow">
          <div className=" flex justify-between mt-8 sm:mt-10 items-center px-2 lg:px-[50px] xl:px-0">
            <div className="font-montserrat text-sm sm:text-base font-normal leading-normal tracking-normal">
              <span
                onClick={() => {
                  if (stepNum >= 0) {
                    setStepNum(0);
                  }
                }}
                className={`cursor-pointer ${stepNum === 0
                  ? 'text-[#000] font-semibold'
                  : 'text-[#53565B] font-normal'
                  }`}
              >
                Cart
              </span>{' '}
              &gt;{' '}
              <span
                onClick={() => {
                  if (stepNum >= 1) {
                    setStepNum(1);
                  }
                }}
                className={`cursor-pointer ${stepNum === 1
                  ? 'text-[#000] font-semibold'
                  : 'text-[#53565B] font-normal'
                  }`}
              >
                {' '}
                Information
              </span>{' '}
              &gt;
              <span
                onClick={() => {
                  if (stepNum >= 2) {
                    setStepNum(2);
                  }
                }}
                className={`cursor-pointer ${stepNum === 2
                  ? 'text-[#000] font-semibold'
                  : 'text-[#53565B] font-normal'
                  }`}
              >
                {' '}
                Shipping
              </span>{' '}
              &gt;
              <span
                className={`cursor-pointer ${stepNum === 3
                  ? 'text-[#000] font-semibold'
                  : 'text-[#53565B] font-normal'
                  }`}
              >
                {' '}
                Payment
              </span>
            </div>

          </div>

          {stepNum === 0 && (
            <div className=' mt-4 lg:mt-[40px] px-2 lg:pl-[50px] xl:pl-0' >
              <div className='flex items-center justify-between'>
                <h3 className="font-semibold text-lg sm:text-[26px]">
                  Your Cart{' '}
                  <span className="ml-1 text-gray-500 text-lg font-normal">
                    ({cartState.cart_items.length} items){' '}
                  </span>
                </h3>
                {!cartState?.cart_items?.length && (
                  <h3 className="text-[22px] text-center">
                    No Products in your cart
                  </h3>
                )}
                <span className="text-[#FFCD00] cursor-pointer group-hover:text-yellow-500 group-focus:text-yellow-500 font-semibold hover:underline text-sm sm:text-base">Want to build a box?</span>
              </div>
              {cartState.cart_items.map((eachCartItem, index) => (
                // Render CartCard component for each item in the cart
                <CartCard
                  key={index}
                  eachCartItem={eachCartItem}
                  onRemove={removeCartItem}
                  isSaveForLater={false}
                  onToggleCartItem={moveToCart}
                />
              ))}
              {cartState?.save_for_later_items?.length ? (
                <>
                  {' '}
                  <h3 className="font-bold text-[28px] mt-[40px]">Save Later</h3>
                  <p className="text-[16px]">
                    To buy an item now, click Move to cart.
                  </p>
                </>
              ) : (
                ''
              )}

              {cartState.save_for_later_items.map((eachSaveItem, index) => (
                // Render CartCard component for each item in the cart
                <CartCard
                  key={index}
                  eachCartItem={eachSaveItem}
                  onRemove={removeCartItem}
                  isSaveForLater={true}
                  onToggleCartItem={moveToCart}
                />
              ))}
              <Link href="/">
                <button className="mx-auto w-[364px] border-[#FFCD00] border-2 py-[14px] px-[28px] mt-8 sm:mt-12 text-yellow-400 font-semibold flex text-base items-center justify-center">
                  Continue Shopping
                </button>
              </Link>

            </div>
          )}
          {stepNum == 1 && (
            <div className='px-2 lg:px-[50px] xl:px-0'>

              {/* <div className="flex items-center mt-[16px] mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2 text-sm font-medium text-gray-900 "
              >
                Email me with news and offers
              </label>
            </div> */}

              <h3 className="text-black text-[26px] mt-[40px] font-semibold leading-normal tracking-normal">
                Delivery method
              </h3>
              <div className="rounded-md border border-gray-300 mt-[20px]">
                <div className="flex items-center p-[10px]">
                  <div className="flex items-center">
                    <label
                      htmlFor="ship"
                      className="ml-2 cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                    >
                      <input
                        id="ship"
                        type="radio"
                        value=""
                        defaultChecked={deliveryMethod === "ship" ? true : false}
                        onChange={() => setDeliveryMethod('ship')}
                        name="deliveryMethod"
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                      />
                      <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                        <div className="innerColor"></div>
                      </span>

                      <span className="flex items-center text-black  text-[18px] font-normal leading-140 tracking-normal">
                        <svg
                          className="ml-1"
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M30 12H25.5V6H4.5C2.85 6 1.5 7.35 1.5 9V25.5H4.5C4.5 27.99 6.51 30 9 30C11.49 30 13.5 27.99 13.5 25.5H22.5C22.5 27.99 24.51 30 27 30C29.49 30 31.5 27.99 31.5 25.5H34.5V18L30 12ZM29.25 14.25L32.19 18H25.5V14.25H29.25ZM9 27C8.175 27 7.5 26.325 7.5 25.5C7.5 24.675 8.175 24 9 24C9.825 24 10.5 24.675 10.5 25.5C10.5 26.325 9.825 27 9 27ZM12.33 22.5C11.505 21.585 10.335 21 9 21C7.665 21 6.495 21.585 5.67 22.5H4.5V9H22.5V22.5H12.33ZM27 27C26.175 27 25.5 26.325 25.5 25.5C25.5 24.675 26.175 24 27 24C27.825 24 28.5 24.675 28.5 25.5C28.5 26.325 27.825 27 27 27Z"
                            fill={deliveryMethod === "ship" ? '#FFCD00' : '#53565B'}
                          />
                        </svg>
                        <span className="ml-1 font-normal text-lg">Ship</span>
                      </span>
                    </label>
                  </div>
                  <label
                    htmlFor="pickUp"
                    className="ml-2 text-sm font-medium text-gray-900 flex items-center"
                  >
                  </label>
                </div>
                <div className="flex items-center border-t border-gray-300 p-[10px]">
                  <div className="flex items-center">
                    <label
                      htmlFor="pickUp"
                      className="ml-2 cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                    >
                      <input
                        id="pickUp"
                        type="radio"
                        name="deliveryMethod"
                        defaultChecked={deliveryMethod === "pickUp" ? true : false}
                        onChange={() => setDeliveryMethod('pickUp')}
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                      />
                      <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                        <div className="innerColor"></div>
                      </span>

                      <span className="flex items-center text-black  text-[18px] font-normal leading-140 tracking-normal">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M27.54 13.5L28.44 18H7.56L8.46 13.5H27.54ZM30 6H6V9H30V6ZM30 10.5H6L4.5 18V21H6V30H21V21H27V30H30V21H31.5V18L30 10.5ZM9 27V21H18V27H9Z"
                            fill={deliveryMethod === "pickUp" ? '#FFCD00' : '#53565B'}
                          />
                        </svg>
                        <span className="ml-2 text-lg font-normal">Pick up</span>
                      </span>
                    </label>
                  </div>
                  <label
                    htmlFor="pickUp"
                    className="ml-2 text-sm font-medium text-gray-900 flex items-center"
                  >
                  </label>
                </div>
              </div>
              {deliveryMethod === 'ship' ? (
                <>
                  <h3 className="text-black text-[26px] mt-[40px] mb-[20px] font-semibold leading-normal tracking-normal">
                    Shipping address
                  </h3>
                  <form
                    onSubmit={handleShippingAddress}
                    className="flex flex-col gap-y-5"
                  >
                    <input
                      hidden
                      type="text"
                      id="type"
                      name="type"
                      defaultValue="SHIPPING"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          defaultValue={address?.first_name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          defaultValue={address?.last_name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    <div className='flex flex-wrap sm:flex-nowrap gap-6'>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={address?.email}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Email"
                        required
                      />
                      <input
                        type="number"
                        id="contact"
                        name="contact"
                        defaultValue={address?.contact}
                        className="bg-gray-50 border border-gray-300 text-gray-900  w-full text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block sm:w-1/2 p-2.5"
                        placeholder="Contact Number"
                        required
                      />
                      
                    </div>
                    <input
                        type="text"
                        id="email"
                        name="company"
                        defaultValue={""}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Company(Optional)"
                      />
                    <div>
                      {/* <input
                        type="text"
                        id="line_1"
                        name="line_1"
                        defaultValue={address?.line_1}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Address line 1"
                        required
                      /> */}
                      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_KEY} libraries={libraries} loadScriptOptions={{ async: true }}>
                        <Autocomplete
                          onLoad={(autocomplete) => {
                            setAutocomplete(autocomplete);
                          }}
                          onPlaceChanged={() => {
                            if (autocomplete) {
                              const place = autocomplete.getPlace();
                              const streetNumberComponent = place.address_components.find(component => component.types.includes('street_number'));
                              const sublocalities = place.address_components.filter(component => component.types.includes('sublocality')).map(component => component.long_name);
                              setStreetNumber(streetNumberComponent?.long_name || '');
                              setAddressLine1(place.address_components.find(component => component.types.includes('route'))?.long_name || '');
                              setAddressLine2(sublocalities);
                              setCity(place.address_components.find(component => component.types.includes('locality'))?.long_name || '');
                              setState(place.address_components.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '');
                              setPostalCode(place.address_components.find(component => component.types.includes('postal_code'))?.long_name || '');
                              setCountry(place.address_components.find(component => component.types.includes('country'))?.long_name || '');
                            }
                          }}
                          options={{ componentRestrictions: { country: 'NZ' } }}
                        >
                          <input
                            type="text"
                            id="line_1"
                            name="line_1"
                            defaultValue={address?.line_1}
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Address line 1"
                            required
                          />
                        </Autocomplete>
                      </LoadScript>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="line_2"
                        name="line_2"
                        value={addressLine2}
                        defaultValue={address?.line_2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          id="street_number"
                          name="street_number"
                          defaultValue={address?.street_number}
                          value={streetNumber}
                          onChange={(e) => setStreetNumber(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Street Number"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          id="postal_code"
                          name="postal_code"
                          value={postalCode}
                          defaultValue={address?.postal_code}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Postal Code"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          defaultValue={address?.city}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          defaultValue={address?.state}
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          defaultValue={address?.country}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Country"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-[40px] w-fit flex flex-col sm:flex-row items-center sm:items-start mx-auto lg:mx-0">
                      <button
                        type="submit"
                        className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                      >
                        {shippingAddressState.loading ? (
                          <Spinner bgColor1="white" bgColor2="#851B39" />
                        ) : (
                          'Continue to payment'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStepNum(0)}
                        className="sm:ml-[40px] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                      >
                        Return to cart
                      </button>
                    </div>
                  </form>
                </>
              ) : deliveryMethod === 'pickUp' ? (
                <>
                  <h3 className="text-black text-[26px] mt-[40px] mb-[20px] font-semibold leading-normal tracking-normal">
                    Pickup location
                  </h3>
                  {
                    selectedPickUpAddress?.errorMessage && <AlertMessage
                      name={"Error"}
                      message={
                        selectedPickUpAddress.errorMessage}
                      linkText={null}
                      linkHref={null}
                      textColor={
                        selectedPickUpAddress.errorMessage ? 'text-red-800' : 'text-green-800'
                      }
                      bgColor={
                        selectedPickUpAddress.errorMessage ? 'bg-red-50' : 'bg-green-50'
                      }
                      closeAction={() => {
                        delete selectedPickUpAddress.errorMessage
                        setSelectedPickUpAddress({
                          ...selectedPickUpAddress,
                        })
                      }
                      }
                    />
                  }
                  <div className='max-h-80 overflow-y-auto flex flex-row md:flex-col lg:flex-row lg:flex-wrap   gap-2 no-scrollbar'>
                    {pickUpAddress && (
                      pickUpAddress.map((eachAddress, index) => (
                        <div className="rounded-md border border-gray-300" key={index}>
                          <div className="flex items-center p-[15px]">
                            <label
                              htmlFor={`location-${index}`}
                              className="text-sm grow font-medium text-gray-900  flex items-start"
                            >
                              <div className="flex items-center">
                                <label
                                  htmlFor="pickUp"
                                  className="cursor-pointer custom-radio-parent text-sm font-medium text-gray-900 flex items-center"
                                >
                                  <input
                                    id={`location-${index}`}
                                    type="radio"
                                    readOnly
                                    checked={selectedPickUpAddress?.id === eachAddress.id}
                                    value=""
                                    onClick={() => setSelectedPickUpAddress(eachAddress)}
                                    name="default-radio"
                                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                                  />
                                  <span style={{ backgroundColor: "#F7F7F7" }} className="custom-radio">
                                    <div className="innerColor"></div>
                                  </span>
                                </label>
                              </div>
                              <label
                                htmlFor="pickUp"
                                className="ml-2 text-sm font-medium text-gray-900 flex items-center"
                              >
                              </label>
                              <div className="flex flex-col grow gap-y-[10px]">
                                <div className="flex justify-between ">
                                  <span className="text-black text-[18px] font-normal leading-25.2 tracking-normal">
                                    {eachAddress?.name} - {eachAddress?.line_1},
                                  </span>
                                  <span className=''>
                                    {eachAddress.is_free ? <b>FREE</b> : <b>{eachAddress.price}</b>}
                                  </span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-lg font-normal tracking-normal">
                                  <div className='flex flex-col gap-2 text-base'>
                                    <span className='flex flex-wrap line-clamp-3 w-[400px]'>
                                      {`${eachAddress?.street_number}, ${eachAddress?.line_1}, ${eachAddress?.line_2},${eachAddress?.city},${eachAddress?.country}, ${eachAddress?.postal_code}`}
                                    </span>
                                    {/* <span className='flex flex-wrap line-clamp-3 w-[400px]'>
                                      {`${eachAddress?.long_description},${eachAddress?.map_location},`}
                                    </span> */}
                                  </div>
                                  <span>{eachAddress?.short_description}</span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))
                    )
                    }
                  </div>
                  <h3 className="flex justify-between text-black text-[26px] mt-[40px] mb-[20px] font-semibold leading-normal tracking-normal">
                    <span>Contact Information</span>
                    {/* <span className="ml-auto text-black text-[18px] font-normal leading-25.2 tracking-normal">
                Already have an account?
                <span className="text-[#FFCD00]"> Log in</span>
              </span> */}
                  </h3>
                  <div className="mb-4">
                    {contactInfo.errorMessage || contactInfo.successMessage ? (
                      <AlertMessage
                        name={contactInfo.errorMessage ? 'error' : 'success'}
                        message={
                          contactInfo.errorMessage || contactInfo.successMessage
                        }
                        linkText={null}
                        linkHref={null}
                        textColor={
                          contactInfo.errorMessage ? 'text-red-800' : 'text-green-800'
                        }
                        bgColor={
                          contactInfo.errorMessage ? 'bg-red-50' : 'bg-green-50'
                        }
                        closeAction={() =>
                          setContactInfo({
                            ...contactInfo,
                            errorMessage: '',
                            successMessage: '',
                          })
                        }
                      />
                    ) : null}
                  </div>
                  <form
                    onSubmit={handleContactInformation}
                    className="flex flex-wrap sm:flex-nowrap lg:flex-wrap xl:flex-nowrap items-center gap-5"
                  >
                    <input
                      type="number"
                      id="number"
                      name="number"
                      defaultValue={number}
                      className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Phone number"
                      required
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Email"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#FFCD00] rounded py-[10px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                    >
                      {contactInfo.loading ? (
                        <Spinner bgColor1="white" bgColor2="#851B39" />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </form>
                  <div className="mt-[40px]">
                    <button
                      onClick={handlePickUpAddress}
                      type="submit"
                      className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                    >
                      {shippingAddressState.loading ? (
                        <Spinner bgColor1="white" bgColor2="#851B39" />
                      ) : (
                        'Continue to shipping'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepNum(0)}
                      className="ml-[40px] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                    >
                      Return to cart
                    </button>
                  </div>
                </>
              ) : <></>}
            </div>
          )}
          {stepNum == 2 && (
            <div>
              <div className="rounded-md border border-gray-300 mt-12 mx-2 md:mx-2 lg:ml-12 xl:ml-0">
                <div className="flex items-center py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                  <span className="text-gray-500 text-[18px] ">Contact</span>{' '}
                  <span className="ml-[40px] text-black text-[18px] ">
                    {number}
                  </span>
                  <button
                    onClick={() => setStepNum(1)}
                    className="ml-auto text-yellow-400 font-montserrat text-[16px] font-semibold leading-normal tracking-normal hover:underline"
                  >
                    Change
                  </button>
                </div>
                {deliveryMethod === "ship" && (
                  <div className="flex items-center border-t border-gray-300 py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                    <span className="text-gray-500 text-[18px]">Ship to</span>
                    <span className="ml-[40px] text-black text-[18px] max-w-[460px] text-base">
                      {address?.street_number} - {address?.line_1}{' '}
                      {address?.line_2}
                      <br /> {address?.city}, {address?.state}, {address?.country}{' '}
                      - {address?.postal_code}
                    </span>
                    <button
                      onClick={() => setStepNum(1)}
                      className="ml-auto text-yellow-400 font-montserrat text-[16px] font-semibold leading-normal tracking-normal hover:underline"
                    >
                      Change
                    </button>
                  </div>
                )}
                {deliveryMethod === "pickUp" && (
                  <div className="flex items-center border-t border-gray-300 py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                    <span className="text-gray-500 text-[18px]">Pick Up</span>
                    <span className="ml-[40px] text-black text-[18px] max-w-[460px] text-base">
                      {selectedPickUpAddress?.street_number} - {selectedPickUpAddress?.line_1}{' '}
                      {selectedPickUpAddress?.line_2}
                      <br />{selectedPickUpAddress?.name}, {selectedPickUpAddress?.city}, {selectedPickUpAddress?.state}, {selectedPickUpAddress?.country}{' '}
                      - {selectedPickUpAddress?.postal_code}
                    </span>
                    <button
                      onClick={() => setStepNum(1)}
                      className="ml-auto text-yellow-400 font-montserrat text-[16px] font-semibold leading-normal tracking-normal hover:underline"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
              {/* <h3 className="text-black text-[22px] mt-[40px] mb-[20px] font-semibold leading-normal tracking-normal">
              Shipping method
            </h3>
            <div className="rounded-md border border-gray-300">
              <div className="flex items-center p-[20px]">
                <label
                  htmlFor="default-radio-1"
                  className="grow text-sm font-medium text-gray-900  flex items-center"
                >
                  <input
                    id=""
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />

                  <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                    Standard
                  </span>
                  <b className="ml-auto">FREE</b>
                </label>
              </div>
            </div> */}
              {/* <h3 className="text-black text-[22px] mt-[40px] mb-[16px] font-semibold leading-normal tracking-normal">
              Payment
            </h3>

            <p className="text-black font-montserrat text-[16px] font-normal leading-normal tracking-normal  mb-[20px]">
              All transactions are secure and encrypted.
            </p>
            <div className="rounded-md border border-gray-300">
              <div className="flex items-center p-[20px]">
                <label
                  htmlFor="default-radio-1"
                  className="grow text-sm font-medium text-gray-900  flex items-center"
                >
                  <input
                    id=""
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />

                  <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                    Credit card
                  </span>
                  <b className="ml-auto">
                    <svg
                      width="134"
                      height="24"
                      viewBox="0 0 134 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.07"
                        d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z"
                        fill="black"
                      />
                      <path
                        d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z"
                        fill="white"
                      />
                      <path
                        d="M28.3 10.1H28C27.6 11.1 27.3 11.6 27 13.1H28.9C28.6 11.6 28.6 10.9 28.3 10.1ZM31.2 16H29.5C29.4 16 29.4 16 29.3 15.9L29.1 15L29 14.8H26.6C26.5 14.8 26.4 14.8 26.4 15L26.1 15.9C26.1 16 26 16 26 16H23.9L24.1 15.5L27 8.7C27 8.2 27.3 8 27.8 8H29.3C29.4 8 29.5 8 29.5 8.2L30.9 14.7C31 15.1 31.1 15.4 31.1 15.8C31.2 15.9 31.2 15.9 31.2 16ZM17.8 15.7L18.2 13.9C18.3 13.9 18.4 14 18.4 14C19.1 14.3 19.8 14.5 20.5 14.4C20.7 14.4 21 14.3 21.2 14.2C21.7 14 21.7 13.5 21.3 13.1C21.1 12.9 20.8 12.8 20.5 12.6C20.1 12.4 19.7 12.2 19.4 11.9C18.2 10.9 18.6 9.5 19.3 8.8C19.9 8.4 20.2 8 21 8C22.2 8 23.5 8 24.1 8.2H24.2C24.1 8.8 24 9.3 23.8 9.9C23.3 9.7 22.8 9.5 22.3 9.5C22 9.5 21.7 9.5 21.4 9.6C21.2 9.6 21.1 9.7 21 9.8C20.8 10 20.8 10.3 21 10.5L21.5 10.9C21.9 11.1 22.3 11.3 22.6 11.5C23.1 11.8 23.6 12.3 23.7 12.9C23.9 13.8 23.6 14.6 22.8 15.2C22.3 15.6 22.1 15.8 21.4 15.8C20 15.8 18.9 15.9 18 15.6C17.9 15.8 17.9 15.8 17.8 15.7ZM14.3 16C14.4 15.3 14.4 15.3 14.5 15C15 12.8 15.5 10.5 15.9 8.3C16 8.1 16 8 16.2 8H18C17.8 9.2 17.6 10.1 17.3 11.2C17 12.7 16.7 14.2 16.3 15.7C16.3 15.9 16.2 15.9 16 15.9L14.3 16ZM5 8.2C5 8.1 5.2 8 5.3 8H8.7C9.2 8 9.6 8.3 9.7 8.8L10.6 13.2C10.6 13.3 10.6 13.3 10.7 13.4C10.7 13.3 10.8 13.3 10.8 13.3L12.9 8.2C12.8 8.1 12.9 8 13 8H15.1C15.1 8.1 15.1 8.1 15 8.2L11.9 15.5C11.8 15.7 11.8 15.8 11.7 15.9C11.6 16 11.4 15.9 11.2 15.9H9.7C9.6 15.9 9.5 15.9 9.5 15.7L7.9 9.5C7.7 9.3 7.4 9 7 8.9C6.4 8.6 5.3 8.4 5.1 8.4L5 8.2Z"
                        fill="#142688"
                      />
                      <path
                        opacity="0.07"
                        d="M131 0H99C97.3 0 96 1.3 96 3V21C96 22.7 97.4 24 99 24H131C132.7 24 134 22.7 134 21V3C134 1.3 132.6 0 131 0Z"
                        fill="black"
                      />
                      <path
                        d="M131 1C132.1 1 133 1.9 133 3V21C133 22.1 132.1 23 131 23H99C97.9 23 97 22.1 97 21V3C97 1.9 97.9 1 99 1H131Z"
                        fill="#006FCF"
                      />
                      <path
                        d="M104.971 10.268L105.745 12.144H104.203L104.971 10.268ZM121.046 10.346H118.069V11.173H120.998V12.412H118.075V13.334H121.052V14.073L123.129 11.828L121.052 9.488L121.046 10.346ZM106.983 8.006H110.978L111.865 9.941L112.687 8H123.057L124.135 9.19L125.25 8H130.013L126.494 11.852L129.977 15.68H125.143L124.065 14.49L122.94 15.68H106.03L105.536 14.49H104.406L103.911 15.68H100L103.286 8H106.716L106.983 8.006ZM115.646 9.084H113.407L111.907 12.62L110.282 9.084H108.06V13.894L106 9.084H104.007L101.625 14.596H103.18L103.674 13.406H106.27L106.764 14.596H109.484V10.661L111.235 14.602H112.425L114.165 10.673V14.603H115.623L115.647 9.083L115.646 9.084ZM124.986 11.852L127.517 9.084H125.695L124.094 10.81L122.546 9.084H116.652V14.602H122.462L124.076 12.864L125.624 14.602H127.499L124.987 11.852H124.986Z"
                        fill="white"
                      />
                      <path
                        opacity="0.07"
                        d="M83 0H51C49.3 0 48 1.3 48 3V21C48 22.7 49.4 24 51 24H83C84.7 24 86 22.7 86 21V3C86 1.3 84.6 0 83 0Z"
                        fill="black"
                      />
                      <path
                        d="M83 1C84.1 1 85 1.9 85 3V21C85 22.1 84.1 23 83 23H51C49.9 23 49 22.1 49 21V3C49 1.9 49.9 1 51 1H83Z"
                        fill="white"
                      />
                      <path
                        d="M63 19C66.866 19 70 15.866 70 12C70 8.13401 66.866 5 63 5C59.134 5 56 8.13401 56 12C56 15.866 59.134 19 63 19Z"
                        fill="#EB001B"
                      />
                      <path
                        d="M71 19C74.866 19 78 15.866 78 12C78 8.13401 74.866 5 71 5C67.134 5 64 8.13401 64 12C64 15.866 67.134 19 71 19Z"
                        fill="#F79E1B"
                      />
                      <path
                        d="M70 12.0008C70 9.60078 68.8 7.50078 67 6.30078C65.2 7.60078 64 9.70078 64 12.0008C64 14.3008 65.2 16.5008 67 17.7008C68.8 16.5008 70 14.4008 70 12.0008Z"
                        fill="#FF5F00"
                      />
                    </svg>
                  </b>
                </label>
              </div>
              <div className="flex items-center p-[20px] border-t">
                <label
                  htmlFor="default-radio-1"
                  className="grow text-sm font-medium text-gray-900  flex items-center"
                >
                  <input
                    id=""
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                  />

                  <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                    Afterpay
                  </span>
                  <b className="ml-auto">
                    <svg
                      width="134"
                      height="24"
                      viewBox="0 0 134 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.07"
                        d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z"
                        fill="black"
                      />
                      <path
                        d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z"
                        fill="white"
                      />
                      <path
                        d="M28.3 10.1H28C27.6 11.1 27.3 11.6 27 13.1H28.9C28.6 11.6 28.6 10.9 28.3 10.1ZM31.2 16H29.5C29.4 16 29.4 16 29.3 15.9L29.1 15L29 14.8H26.6C26.5 14.8 26.4 14.8 26.4 15L26.1 15.9C26.1 16 26 16 26 16H23.9L24.1 15.5L27 8.7C27 8.2 27.3 8 27.8 8H29.3C29.4 8 29.5 8 29.5 8.2L30.9 14.7C31 15.1 31.1 15.4 31.1 15.8C31.2 15.9 31.2 15.9 31.2 16ZM17.8 15.7L18.2 13.9C18.3 13.9 18.4 14 18.4 14C19.1 14.3 19.8 14.5 20.5 14.4C20.7 14.4 21 14.3 21.2 14.2C21.7 14 21.7 13.5 21.3 13.1C21.1 12.9 20.8 12.8 20.5 12.6C20.1 12.4 19.7 12.2 19.4 11.9C18.2 10.9 18.6 9.5 19.3 8.8C19.9 8.4 20.2 8 21 8C22.2 8 23.5 8 24.1 8.2H24.2C24.1 8.8 24 9.3 23.8 9.9C23.3 9.7 22.8 9.5 22.3 9.5C22 9.5 21.7 9.5 21.4 9.6C21.2 9.6 21.1 9.7 21 9.8C20.8 10 20.8 10.3 21 10.5L21.5 10.9C21.9 11.1 22.3 11.3 22.6 11.5C23.1 11.8 23.6 12.3 23.7 12.9C23.9 13.8 23.6 14.6 22.8 15.2C22.3 15.6 22.1 15.8 21.4 15.8C20 15.8 18.9 15.9 18 15.6C17.9 15.8 17.9 15.8 17.8 15.7ZM14.3 16C14.4 15.3 14.4 15.3 14.5 15C15 12.8 15.5 10.5 15.9 8.3C16 8.1 16 8 16.2 8H18C17.8 9.2 17.6 10.1 17.3 11.2C17 12.7 16.7 14.2 16.3 15.7C16.3 15.9 16.2 15.9 16 15.9L14.3 16ZM5 8.2C5 8.1 5.2 8 5.3 8H8.7C9.2 8 9.6 8.3 9.7 8.8L10.6 13.2C10.6 13.3 10.6 13.3 10.7 13.4C10.7 13.3 10.8 13.3 10.8 13.3L12.9 8.2C12.8 8.1 12.9 8 13 8H15.1C15.1 8.1 15.1 8.1 15 8.2L11.9 15.5C11.8 15.7 11.8 15.8 11.7 15.9C11.6 16 11.4 15.9 11.2 15.9H9.7C9.6 15.9 9.5 15.9 9.5 15.7L7.9 9.5C7.7 9.3 7.4 9 7 8.9C6.4 8.6 5.3 8.4 5.1 8.4L5 8.2Z"
                        fill="#142688"
                      />
                      <path
                        opacity="0.07"
                        d="M131 0H99C97.3 0 96 1.3 96 3V21C96 22.7 97.4 24 99 24H131C132.7 24 134 22.7 134 21V3C134 1.3 132.6 0 131 0Z"
                        fill="black"
                      />
                      <path
                        d="M131 1C132.1 1 133 1.9 133 3V21C133 22.1 132.1 23 131 23H99C97.9 23 97 22.1 97 21V3C97 1.9 97.9 1 99 1H131Z"
                        fill="#006FCF"
                      />
                      <path
                        d="M104.971 10.268L105.745 12.144H104.203L104.971 10.268ZM121.046 10.346H118.069V11.173H120.998V12.412H118.075V13.334H121.052V14.073L123.129 11.828L121.052 9.488L121.046 10.346ZM106.983 8.006H110.978L111.865 9.941L112.687 8H123.057L124.135 9.19L125.25 8H130.013L126.494 11.852L129.977 15.68H125.143L124.065 14.49L122.94 15.68H106.03L105.536 14.49H104.406L103.911 15.68H100L103.286 8H106.716L106.983 8.006ZM115.646 9.084H113.407L111.907 12.62L110.282 9.084H108.06V13.894L106 9.084H104.007L101.625 14.596H103.18L103.674 13.406H106.27L106.764 14.596H109.484V10.661L111.235 14.602H112.425L114.165 10.673V14.603H115.623L115.647 9.083L115.646 9.084ZM124.986 11.852L127.517 9.084H125.695L124.094 10.81L122.546 9.084H116.652V14.602H122.462L124.076 12.864L125.624 14.602H127.499L124.987 11.852H124.986Z"
                        fill="white"
                      />
                      <path
                        opacity="0.07"
                        d="M83 0H51C49.3 0 48 1.3 48 3V21C48 22.7 49.4 24 51 24H83C84.7 24 86 22.7 86 21V3C86 1.3 84.6 0 83 0Z"
                        fill="black"
                      />
                      <path
                        d="M83 1C84.1 1 85 1.9 85 3V21C85 22.1 84.1 23 83 23H51C49.9 23 49 22.1 49 21V3C49 1.9 49.9 1 51 1H83Z"
                        fill="white"
                      />
                      <path
                        d="M63 19C66.866 19 70 15.866 70 12C70 8.13401 66.866 5 63 5C59.134 5 56 8.13401 56 12C56 15.866 59.134 19 63 19Z"
                        fill="#EB001B"
                      />
                      <path
                        d="M71 19C74.866 19 78 15.866 78 12C78 8.13401 74.866 5 71 5C67.134 5 64 8.13401 64 12C64 15.866 67.134 19 71 19Z"
                        fill="#F79E1B"
                      />
                      <path
                        d="M70 12.0008C70 9.60078 68.8 7.50078 67 6.30078C65.2 7.60078 64 9.70078 64 12.0008C64 14.3008 65.2 16.5008 67 17.7008C68.8 16.5008 70 14.4008 70 12.0008Z"
                        fill="#FF5F00"
                      />
                    </svg>
                  </b>
                </label>
              </div>
            </div>
            <div className="bg-[#F8F8F8] px-[40px] py-[20px]">
              <p className=" max-w-[600px]">
                After clicking “Complete order”, you will be redirected to
                Afterpay to complete your purchase securely.
              </p>
            </div> */}
              {deliveryMethod === 'ship' && <><h3 className="text-black text-[22px] mt-[40px] mb-[16px] font-semibold leading-normal tracking-normal">
                Billing address
              </h3>

                <p className="text-black font-montserrat text-[16px] font-normal leading-normal tracking-normal  mb-[20px]">
                  Select the address that matches your card or payment method.
                </p>

                <div className="rounded-md border border-gray-300">
                  <div className="flex items-center p-[20px]">
                    <label
                      htmlFor="addressSame"
                      className="grow text-sm font-medium text-gray-900  flex items-center"
                    >
                      <input
                        id="addressSame"
                        type="radio"
                        value=""
                        defaultChecked={true}
                        onChange={() => setBillingAddressType('same')}
                        name="billingAddressType"
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                      />

                      <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                        Same as shipping address
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center p-[20px] border-t">
                    <label
                      htmlFor="addressDifferent"
                      className="grow text-sm font-medium text-gray-900  flex items-center"
                    >
                      <input
                        id="addressDifferent"
                        type="radio"
                        value=""
                        defaultChecked={false}
                        onChange={() => setBillingAddressType('different')}
                        name="billingAddressType"
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                      />

                      <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                        Use a different billing address
                      </span>
                    </label>
                  </div>
                </div></>}
              {billingAddressType === 'different' &&
                billingAddressState?.type !== 'BILLING' ? (
                <>
                  <h3 className="text-black text-[22px] mt-[40px] mb-[16px] font-semibold leading-normal tracking-normal">
                    Billing address
                  </h3>
                  <form
                    onSubmit={handleBillingAddress}
                    className="flex flex-col gap-y-5"
                  >
                    <input
                      hidden
                      type="text"
                      id="type"
                      name="type"
                      defaultValue="BILLING"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="company"
                      defaultValue={""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Company(Optional)"
                    />
                    <div>
                      <input
                        type="text"
                        id="line_1"
                        name="line_1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Address line 1"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="line_2"
                        name="line_2"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          id="street_number"
                          name="street_number"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Street Number"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          id="postal_code"
                          name="postal_code"
                          className="no-spinners bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Postal Code"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Country"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      {billingAddressState.errorMessage ||
                        billingAddressState.successMessage ? (
                        <AlertMessage
                          name={
                            billingAddressState.errorMessage ? 'error' : 'success'
                          }
                          message={
                            billingAddressState.errorMessage ||
                            billingAddressState.successMessage
                          }
                          linkText={null}
                          linkHref={null}
                          textColor={
                            billingAddressState.errorMessage
                              ? 'text-red-800'
                              : 'text-green-800'
                          }
                          bgColor={
                            billingAddressState.errorMessage
                              ? 'bg-red-50'
                              : 'bg-green-50'
                          }
                          closeAction={() =>
                            setBillingAddressState({
                              ...billingAddressState,
                              errorMessage: '',
                              successMessage: '',
                            })
                          }
                        />
                      ) : null}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                      >
                        {billingAddressState.loading ? (
                          <Spinner bgColor1="white" bgColor2="#851B39" />
                        ) : (
                          'Submit and Pay now'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : billingAddressType === 'different' &&
                billingAddressState.type === 'BILLING' ? (
                <div className="flex items-center border border-gray-300 py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                  <span className="text-gray-500 text-[18px]">
                    Billing address
                  </span>
                  <span className="ml-[40px] text-black text-[18px] max-w-[460px] text-base">
                    {billingAddressState?.street_number} -{' '}
                    {billingAddressState?.line_1} {billingAddressState?.line_2}
                    <br /> {billingAddressState?.city},{' '}
                    {billingAddressState?.state}, {billingAddressState?.country} -{' '}
                    {billingAddressState?.postal_code}
                  </span>
                </div>
              ) : (
                ''
              )}
              {(billingAddressType === 'same' ||
                billingAddressState.type === 'BILLING') && (
                  <div className="mt-[40px] mx-2 lg:ml-12 xl:ml-0 flex flex-col sm:flex-row gap-y-2 sm:gap-y-0">
                    <StripeButton checkoutData={checkoutData} />
                    <button
                      onClick={createOrder}
                      className={`px-7 py-3.5 sm:ml-[40px] bg-[#FFCD00] cursor-pointe text-black text-center text-base font-semibold leading-normal`}
                    >
                      Pay By Invoice
                    </button>
                    <button onClick={() => setStepNum(1)} className="sm:ml-[40px] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal">
                      Return to Information
                    </button>
                  </div>
                )}
            </div>
          )}
          {stepNum == 3 && (
            <div>
              <div className="rounded-md border border-gray-300 mt-[20px]">
                <div className="flex items-center py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                  <span className="text-gray-500 text-[18px] ">Contact</span>{' '}
                  <span className="ml-[40px] text-black text-[18px] ">
                    +64 224 590 229
                  </span>
                  <button className="ml-auto text-yellow-400 font-montserrat text-[16px] font-semibold leading-normal tracking-normal hover:underline">
                    Change
                  </button>
                </div>
                <div className="flex items-center border-t border-gray-300 py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                  <span className="text-gray-500 text-[18px]">Ship to</span>
                  <span className="ml-[40px] text-black text-[18px] max-w-[460px] text-base">
                    122 Remuera Road, Remuera, AUK, Auckland 1050, New Zealand
                  </span>
                  <button className="ml-auto text-yellow-400 font-montserrat text-[16px] font-semibold leading-normal tracking-normal hover:underline">
                    Change
                  </button>
                </div>
                <div className="flex items-center border-t border-gray-300 py-[10px] px-[20px] font-normal leading-25.2 tracking-normal">
                  <span className="text-gray-500 text-[18px]">Method</span>
                  <span className="ml-[40px] text-black text-[18px] max-w-[460px] text-base">
                    Standard - Free
                  </span>
                </div>
              </div>
              <h3 className="text-black text-[22px] mt-[40px] mb-[16px] font-semibold leading-normal tracking-normal">
                Payment
              </h3>

              <p className="text-black font-montserrat text-[16px] font-normal leading-normal tracking-normal  mb-[20px]">
                All transactions are secure and encrypted.
              </p>
              <div className="rounded-md border border-gray-300">
                <div className="flex items-center p-[20px]">
                  <label
                    htmlFor="default-radio-1"
                    className="grow text-sm font-medium text-gray-900  flex items-center"
                  >
                    <input
                      id=""
                      type="radio"
                      value=""
                      name="default-radio"
                      className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                    />

                    <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                      Credit card
                    </span>
                    <b className="ml-auto">
                      <svg
                        width="134"
                        height="24"
                        viewBox="0 0 134 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.07"
                          d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z"
                          fill="black"
                        />
                        <path
                          d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z"
                          fill="white"
                        />
                        <path
                          d="M28.3 10.1H28C27.6 11.1 27.3 11.6 27 13.1H28.9C28.6 11.6 28.6 10.9 28.3 10.1ZM31.2 16H29.5C29.4 16 29.4 16 29.3 15.9L29.1 15L29 14.8H26.6C26.5 14.8 26.4 14.8 26.4 15L26.1 15.9C26.1 16 26 16 26 16H23.9L24.1 15.5L27 8.7C27 8.2 27.3 8 27.8 8H29.3C29.4 8 29.5 8 29.5 8.2L30.9 14.7C31 15.1 31.1 15.4 31.1 15.8C31.2 15.9 31.2 15.9 31.2 16ZM17.8 15.7L18.2 13.9C18.3 13.9 18.4 14 18.4 14C19.1 14.3 19.8 14.5 20.5 14.4C20.7 14.4 21 14.3 21.2 14.2C21.7 14 21.7 13.5 21.3 13.1C21.1 12.9 20.8 12.8 20.5 12.6C20.1 12.4 19.7 12.2 19.4 11.9C18.2 10.9 18.6 9.5 19.3 8.8C19.9 8.4 20.2 8 21 8C22.2 8 23.5 8 24.1 8.2H24.2C24.1 8.8 24 9.3 23.8 9.9C23.3 9.7 22.8 9.5 22.3 9.5C22 9.5 21.7 9.5 21.4 9.6C21.2 9.6 21.1 9.7 21 9.8C20.8 10 20.8 10.3 21 10.5L21.5 10.9C21.9 11.1 22.3 11.3 22.6 11.5C23.1 11.8 23.6 12.3 23.7 12.9C23.9 13.8 23.6 14.6 22.8 15.2C22.3 15.6 22.1 15.8 21.4 15.8C20 15.8 18.9 15.9 18 15.6C17.9 15.8 17.9 15.8 17.8 15.7ZM14.3 16C14.4 15.3 14.4 15.3 14.5 15C15 12.8 15.5 10.5 15.9 8.3C16 8.1 16 8 16.2 8H18C17.8 9.2 17.6 10.1 17.3 11.2C17 12.7 16.7 14.2 16.3 15.7C16.3 15.9 16.2 15.9 16 15.9L14.3 16ZM5 8.2C5 8.1 5.2 8 5.3 8H8.7C9.2 8 9.6 8.3 9.7 8.8L10.6 13.2C10.6 13.3 10.6 13.3 10.7 13.4C10.7 13.3 10.8 13.3 10.8 13.3L12.9 8.2C12.8 8.1 12.9 8 13 8H15.1C15.1 8.1 15.1 8.1 15 8.2L11.9 15.5C11.8 15.7 11.8 15.8 11.7 15.9C11.6 16 11.4 15.9 11.2 15.9H9.7C9.6 15.9 9.5 15.9 9.5 15.7L7.9 9.5C7.7 9.3 7.4 9 7 8.9C6.4 8.6 5.3 8.4 5.1 8.4L5 8.2Z"
                          fill="#142688"
                        />
                        <path
                          opacity="0.07"
                          d="M131 0H99C97.3 0 96 1.3 96 3V21C96 22.7 97.4 24 99 24H131C132.7 24 134 22.7 134 21V3C134 1.3 132.6 0 131 0Z"
                          fill="black"
                        />
                        <path
                          d="M131 1C132.1 1 133 1.9 133 3V21C133 22.1 132.1 23 131 23H99C97.9 23 97 22.1 97 21V3C97 1.9 97.9 1 99 1H131Z"
                          fill="#006FCF"
                        />
                        <path
                          d="M104.971 10.268L105.745 12.144H104.203L104.971 10.268ZM121.046 10.346H118.069V11.173H120.998V12.412H118.075V13.334H121.052V14.073L123.129 11.828L121.052 9.488L121.046 10.346ZM106.983 8.006H110.978L111.865 9.941L112.687 8H123.057L124.135 9.19L125.25 8H130.013L126.494 11.852L129.977 15.68H125.143L124.065 14.49L122.94 15.68H106.03L105.536 14.49H104.406L103.911 15.68H100L103.286 8H106.716L106.983 8.006ZM115.646 9.084H113.407L111.907 12.62L110.282 9.084H108.06V13.894L106 9.084H104.007L101.625 14.596H103.18L103.674 13.406H106.27L106.764 14.596H109.484V10.661L111.235 14.602H112.425L114.165 10.673V14.603H115.623L115.647 9.083L115.646 9.084ZM124.986 11.852L127.517 9.084H125.695L124.094 10.81L122.546 9.084H116.652V14.602H122.462L124.076 12.864L125.624 14.602H127.499L124.987 11.852H124.986Z"
                          fill="white"
                        />
                        <path
                          opacity="0.07"
                          d="M83 0H51C49.3 0 48 1.3 48 3V21C48 22.7 49.4 24 51 24H83C84.7 24 86 22.7 86 21V3C86 1.3 84.6 0 83 0Z"
                          fill="black"
                        />
                        <path
                          d="M83 1C84.1 1 85 1.9 85 3V21C85 22.1 84.1 23 83 23H51C49.9 23 49 22.1 49 21V3C49 1.9 49.9 1 51 1H83Z"
                          fill="white"
                        />
                        <path
                          d="M63 19C66.866 19 70 15.866 70 12C70 8.13401 66.866 5 63 5C59.134 5 56 8.13401 56 12C56 15.866 59.134 19 63 19Z"
                          fill="#EB001B"
                        />
                        <path
                          d="M71 19C74.866 19 78 15.866 78 12C78 8.13401 74.866 5 71 5C67.134 5 64 8.13401 64 12C64 15.866 67.134 19 71 19Z"
                          fill="#F79E1B"
                        />
                        <path
                          d="M70 12.0008C70 9.60078 68.8 7.50078 67 6.30078C65.2 7.60078 64 9.70078 64 12.0008C64 14.3008 65.2 16.5008 67 17.7008C68.8 16.5008 70 14.4008 70 12.0008Z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </b>
                  </label>
                </div>
                <div className="bg-[#F8F8F8] px-[40px] py-[20px] flex flex-col gap-[16px]">
                  <div>
                    <input
                      type="text"
                      id="cardNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Card number"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="nameOnCard"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Name on card"
                      required
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        id="expireDate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Expiry date [MM / YY]"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="securityCode"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Security code"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-[20px] border-t">
                  <label
                    htmlFor="default-radio-1"
                    className="grow text-sm font-medium text-gray-900  flex items-center"
                  >
                    <input
                      id=""
                      type="radio"
                      value=""
                      name="default-radio"
                      className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300"
                    />

                    <span className="ml-2 text-gray-500 text-[18px] font-normal leading-25.2 tracking-normal">
                      Afterpay
                    </span>
                    <b className="ml-auto">
                      <svg
                        width="134"
                        height="24"
                        viewBox="0 0 134 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.07"
                          d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z"
                          fill="black"
                        />
                        <path
                          d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z"
                          fill="white"
                        />
                        <path
                          d="M28.3 10.1H28C27.6 11.1 27.3 11.6 27 13.1H28.9C28.6 11.6 28.6 10.9 28.3 10.1ZM31.2 16H29.5C29.4 16 29.4 16 29.3 15.9L29.1 15L29 14.8H26.6C26.5 14.8 26.4 14.8 26.4 15L26.1 15.9C26.1 16 26 16 26 16H23.9L24.1 15.5L27 8.7C27 8.2 27.3 8 27.8 8H29.3C29.4 8 29.5 8 29.5 8.2L30.9 14.7C31 15.1 31.1 15.4 31.1 15.8C31.2 15.9 31.2 15.9 31.2 16ZM17.8 15.7L18.2 13.9C18.3 13.9 18.4 14 18.4 14C19.1 14.3 19.8 14.5 20.5 14.4C20.7 14.4 21 14.3 21.2 14.2C21.7 14 21.7 13.5 21.3 13.1C21.1 12.9 20.8 12.8 20.5 12.6C20.1 12.4 19.7 12.2 19.4 11.9C18.2 10.9 18.6 9.5 19.3 8.8C19.9 8.4 20.2 8 21 8C22.2 8 23.5 8 24.1 8.2H24.2C24.1 8.8 24 9.3 23.8 9.9C23.3 9.7 22.8 9.5 22.3 9.5C22 9.5 21.7 9.5 21.4 9.6C21.2 9.6 21.1 9.7 21 9.8C20.8 10 20.8 10.3 21 10.5L21.5 10.9C21.9 11.1 22.3 11.3 22.6 11.5C23.1 11.8 23.6 12.3 23.7 12.9C23.9 13.8 23.6 14.6 22.8 15.2C22.3 15.6 22.1 15.8 21.4 15.8C20 15.8 18.9 15.9 18 15.6C17.9 15.8 17.9 15.8 17.8 15.7ZM14.3 16C14.4 15.3 14.4 15.3 14.5 15C15 12.8 15.5 10.5 15.9 8.3C16 8.1 16 8 16.2 8H18C17.8 9.2 17.6 10.1 17.3 11.2C17 12.7 16.7 14.2 16.3 15.7C16.3 15.9 16.2 15.9 16 15.9L14.3 16ZM5 8.2C5 8.1 5.2 8 5.3 8H8.7C9.2 8 9.6 8.3 9.7 8.8L10.6 13.2C10.6 13.3 10.6 13.3 10.7 13.4C10.7 13.3 10.8 13.3 10.8 13.3L12.9 8.2C12.8 8.1 12.9 8 13 8H15.1C15.1 8.1 15.1 8.1 15 8.2L11.9 15.5C11.8 15.7 11.8 15.8 11.7 15.9C11.6 16 11.4 15.9 11.2 15.9H9.7C9.6 15.9 9.5 15.9 9.5 15.7L7.9 9.5C7.7 9.3 7.4 9 7 8.9C6.4 8.6 5.3 8.4 5.1 8.4L5 8.2Z"
                          fill="#142688"
                        />
                        <path
                          opacity="0.07"
                          d="M131 0H99C97.3 0 96 1.3 96 3V21C96 22.7 97.4 24 99 24H131C132.7 24 134 22.7 134 21V3C134 1.3 132.6 0 131 0Z"
                          fill="black"
                        />
                        <path
                          d="M131 1C132.1 1 133 1.9 133 3V21C133 22.1 132.1 23 131 23H99C97.9 23 97 22.1 97 21V3C97 1.9 97.9 1 99 1H131Z"
                          fill="#006FCF"
                        />
                        <path
                          d="M104.971 10.268L105.745 12.144H104.203L104.971 10.268ZM121.046 10.346H118.069V11.173H120.998V12.412H118.075V13.334H121.052V14.073L123.129 11.828L121.052 9.488L121.046 10.346ZM106.983 8.006H110.978L111.865 9.941L112.687 8H123.057L124.135 9.19L125.25 8H130.013L126.494 11.852L129.977 15.68H125.143L124.065 14.49L122.94 15.68H106.03L105.536 14.49H104.406L103.911 15.68H100L103.286 8H106.716L106.983 8.006ZM115.646 9.084H113.407L111.907 12.62L110.282 9.084H108.06V13.894L106 9.084H104.007L101.625 14.596H103.18L103.674 13.406H106.27L106.764 14.596H109.484V10.661L111.235 14.602H112.425L114.165 10.673V14.603H115.623L115.647 9.083L115.646 9.084ZM124.986 11.852L127.517 9.084H125.695L124.094 10.81L122.546 9.084H116.652V14.602H122.462L124.076 12.864L125.624 14.602H127.499L124.987 11.852H124.986Z"
                          fill="white"
                        />
                        <path
                          opacity="0.07"
                          d="M83 0H51C49.3 0 48 1.3 48 3V21C48 22.7 49.4 24 51 24H83C84.7 24 86 22.7 86 21V3C86 1.3 84.6 0 83 0Z"
                          fill="black"
                        />
                        <path
                          d="M83 1C84.1 1 85 1.9 85 3V21C85 22.1 84.1 23 83 23H51C49.9 23 49 22.1 49 21V3C49 1.9 49.9 1 51 1H83Z"
                          fill="white"
                        />
                        <path
                          d="M63 19C66.866 19 70 15.866 70 12C70 8.13401 66.866 5 63 5C59.134 5 56 8.13401 56 12C56 15.866 59.134 19 63 19Z"
                          fill="#EB001B"
                        />
                        <path
                          d="M71 19C74.866 19 78 15.866 78 12C78 8.13401 74.866 5 71 5C67.134 5 64 8.13401 64 12C64 15.866 67.134 19 71 19Z"
                          fill="#F79E1B"
                        />
                        <path
                          d="M70 12.0008C70 9.60078 68.8 7.50078 67 6.30078C65.2 7.60078 64 9.70078 64 12.0008C64 14.3008 65.2 16.5008 67 17.7008C68.8 16.5008 70 14.4008 70 12.0008Z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </b>
                  </label>
                </div>
              </div>

              <div className="mt-[40px] ">
                <button
                  onClick={() => setStepNum(3)}
                  className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                >
                  Pay now
                </button>
                <button
                  onClick={() => setStepNum(1)}
                  className="ml-[40px] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  "
                >
                  Return to Shipping
                </button>
              </div>
            </div>
          )}

        </div>

        {stepNum == 0 && cartState?.cart_items?.length ? (
          <div className="py-8 sm:py-[64px] mx-auto mb-8 lg:min-w-[350px] lg:w-[30%] h-fit w-full px-2 lg:px-0">
            <h3 className="font-semibold text-[26px] sm:my-9">Order Summary</h3>
            <div className="w-full lg:pt-3">
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">Order Total :</span>{' '}
                <span className="font-semibold">
                  {' '}
                  $ {cartState.total_price.toFixed(2)}
                </span>
              </p>
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">Shipping cost : </span>{' '}
                <span className="font-semibold"> {cartState.shipping_cost ? `$ ${cartState.shipping_cost.toFixed(2)}` : "FREE"}</span>
              </p>
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">Processing cost : </span>{' '}
                <span className="font-semibold"> $ {cartState.processing_fee.toFixed(2)}</span>
              </p>
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">GST 15% : </span>{' '}
                <span className="font-semibold"> $ {cartState.gst_value.toFixed(2)}</span>
              </p>
              <p className="py-3 mt-6 border-t-2 text-lg border-slate-200 flex justify-between">
                <span className="text-slate-600 ">Sub Total : </span>
                <span className="text-[#8A1E41] font-semibold">
                  {' '}
                  $ {cartState.total_with_gst.toFixed(2)}
                </span>
              </p>
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">Coupon Code : </span>{' '}
                <input
                  className='rounded-md text-right px-2 max-w-[200px]'
                  type='text'
                  style={{border: "1px solid #E6E6E6"}}
                />
              </p>
              <p className="my-3 flex justify-between text-lg">
                <span className="text-slate-600 ">Coupon Discount: </span>{' '}
                <span className="font-semibold">$0.00</span>
              </p>
              <p className="py-3 my-6 border-t-2 text-lg border-slate-200 flex justify-between">
                <span className="text-slate-600 ">Total : </span>
                <span className="text-[#8A1E41] font-semibold">
                  {' '}
                  $ {cartState.total_with_gst.toFixed(2)}
                </span>
              </p>
              {/* Stripe checkout button */}
              <button
                onClick={() => setStepNum(1)}
                className="bg-[#FFCD00] w-full py-3 font-bold"
              >
                Proceed to Checkout
              </button>
              {/* <StripeButton /> */}
            </div>
          </div>
        ) : (stepNum == 1 || stepNum == 2) && (
          <div className="xl:w-[40%] lg:mt-14 py-[58px] mx-auto h-fit lg:mr-[50px] xl:mr-0 px-2 lg:px-0">
            <div className="flex flex-col gap-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
              {cartState.cart_items.map((eachCardItem, index) => (
                <div key={index} className="flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-[80px] h-[80px]"
                    src={eachCardItem.product_variation_image}
                    alt=""
                  />
                  <div className="flex flex-col ml-[12px] w-full">
                    <div className="flex justify-between">
                      <h4 className="max-w-[190px] xl:max-w-full text-black text-[22px] font-semibold tracking-normal">
                        {eachCardItem.product.name}
                      </h4>
                      <span className="ml-[28px] font-semibold text-lg">
                        $ {eachCardItem.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[#53565b] mt-[6px] text-lg">
                      Qty :<b> {eachCardItem.quantity}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* <hr className="border-t my-[30px] border-gray-300 h-1 w-full" /> */}
            <div className="mb-4">
              {couponState.errorMessage || couponState.successMessage ? (
                <AlertMessage
                  name={couponState.errorMessage ? 'error' : 'success'}
                  message={couponState.errorMessage || couponState.successMessage}
                  linkText={null}
                  linkHref={null}
                  textColor={
                    couponState.errorMessage ? 'text-red-800' : 'text-green-800'
                  }
                  bgColor={couponState.errorMessage ? 'bg-red-50' : 'bg-green-50'}
                  closeAction={() =>
                    setCouponState({
                      ...couponState,
                      errorMessage: '',
                      successMessage: '',
                    })
                  }
                />
              ) : null}
            </div>
            {/* <form
              onSubmit={(e) =>
                handleSubmitCouponCode(
                  e,
                  cartState.applied_coupon_code ? 'remove' : 'add'
                )
              }
              className="flex flex-col sm:flex-row items-center gap-5"
            >
              <div className="grow">
                <input
                  type="text"
                  id="couponcode"
                  name="couponCode"
                  defaultValue={cartState.applied_coupon_code}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
                  placeholder="Coupon Code"
                  required
                />
              </div>
              <button className="bg-[#FFCD00] py-[14px] px-[28px] text-black text-center font-montserrat text-[16px] font-semibold leading-normal  ">
                {cartState.applied_coupon_code ? 'Remove' : 'Apply'}
              </button>
            </form> */}

            <hr className="border-t my-[30px] border-gray-300 h-1 w-full" />
            <ul className="flex flex-col gap-5">
              {cartState.applied_coupon_code && (
                <li className="flex justify-between text-lg">
                  <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                    Applied Coupon Code
                  </span>
                  <b>{cartState.applied_coupon_code}</b>
                </li>
              )}

              <li className="flex justify-between text-lg">
                <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                  Subtotal
                </span>
                <b>$ {cartState.total_price.toFixed(2)}</b>
              </li>
              {cartState.discount_amount && (
                <li className="flex justify-between text-lg">
                  <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                    Discount Amount
                  </span>
                  <b className="text-[#8A1E41]">
                    {' '}
                    - $ {cartState.discount_amount.toFixed(2)}
                  </b>
                </li>
              )}

              <li className="flex justify-between text-lg">
                <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                  Shipping cost
                </span>
                <b>{cartState.shipping_cost ? `$ ${cartState.shipping_cost.toFixed(2)}` : "FREE"}</b>
              </li>
              <li className="flex justify-between text-lg">
                <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                  Processing cost
                </span>
                <b>$ {' '}{cartState.processing_fee.toFixed(2)}</b>
              </li>
              <li className="flex justify-between text-lg">
                <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                  GST 15%
                </span>
                <b>$ {' '}{cartState.gst_value.toFixed(2)}</b>
              </li>
            </ul>
            <hr className="border-t my-[30px] border-gray-300 h-1 w-full" />
            <ul>
              <li className="flex items-center justify-between text-lg">
                <div className="flex flex-col">
                  <span className="text-gray-500 leading-normal tracking-normal">
                    Sub Total
                  </span>
                  {/* <span className="text-gray-500 text-[14px] font-normal leading-19.6 tracking-normal">
                  Including $74.35 in taxes
                </span> */}
                </div>
                <b className="text-[#8A1E41]">
                  ${' '}
                  {cartState.total_with_gst.toFixed(2)}
                </b>
              </li>
              <li className="my-3 flex justify-between text-lg">
                <span className="text-gray-500 font-normal leading-25.2 tracking-normal">
                Coupon Discount:
                </span>
                <b>{"$ 0.00"}</b>
              </li>
            </ul>
            <hr className="border-t my-[30px] border-gray-300 h-1 w-full" />
            <ul>
              <li className="flex items-center justify-between text-lg">
                <div className="flex flex-col">
                  <span className="text-gray-500 leading-normal tracking-normal">
                    Total
                  </span>
                  {/* <span className="text-gray-500 text-[14px] font-normal leading-19.6 tracking-normal">
                  Including $74.35 in taxes
                </span> */}
                </div>
                <b className="text-[#8A1E41]">
                  ${' '}
                  {cartState.total_with_gst.toFixed(2)}
                </b>
              </li>
            </ul>
          </div>
        )}
        {/* <div className="lg:min-w-[490px]"></div> */}
      </section>
      <section className="mx-auto">
        <div className="lg:my-4 xl:mt-2 overflow-scroll no-scrollbar">
          <YouMayAlsoLike topProducts={topProducts} title="You may also like" />
        </div>
      </section>
    </section>
  );
}
