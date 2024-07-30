'use client';
import ItemCard from '@/app/components/common/itemCard';
import CardSkeleton from '@/app/components/common/itemCardSkeleton';
import { useGlobalContext } from '@/app/context/store';
import { API_RESPONSE_STATUS } from '@/constants/variablesNames';
import useApi from '@/helpers/useApi';
import { sendRequest } from '@/helpers/utils';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Wishlists() {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const path = `/api/wishlists/`;
  const [wishlistState, setWishlistState] = useState([])
  const { data: wishlistData, error, loading } = useApi(path);

  useEffect(() => {
    if (!loading) {
      setGlobalStore({ ...globalStore, wishListCount: wishlistData?.length });
      setWishlistState(wishlistData)
    }
  }, [loading, wishlistData]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleRemoveWishlist = async (wishListId) => {
    const url = `/api/wishlists/${wishListId}`;
    // Define the options for the DELETE request
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`, // Include authorization token
      },
    };

    try {
      // Send the DELETE request
      const responseData = await sendRequest(url, options);
      // Check the status of the response
      if (responseData.status === API_RESPONSE_STATUS.ERROR) {
        // Handle error case
      } else if (responseData.status === API_RESPONSE_STATUS.SUCCESS) {
        // Handle success case
        // Remove the deleted wishlist item from the local state
        setWishlistState(
          wishlistState.filter((item) => item.id !== wishListId)
        );
        setGlobalStore({
          ...globalStore,
          wishListCount: globalStore.wishListCount - 1,
        });
      }
    } catch (error) {
      // Handle any exceptions or network errors
      console.error('API request failed:', error);
    }
  };

  const handleShareWishListItem = async (product_id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/product/${product_id}`;
      await navigator.share({ url, title: 'We Love Branding' });
    } catch (error) {
      alert('Error occured while Sharing !');
      console.log('Error sharing:', error);
    }
  };

  const numItemsPerRow = 6; // Number of items to display in each row
  const numRows = Math.ceil(wishlistData?.length / numItemsPerRow); // Calculate number of rows

  return (
    <section className="container mx-auto mt-4 lg:my-14">
      <h3 className="text-[32px] font-semibold my-4 text-center">Wishlist</h3>
      {
        !loading ?
          <div className="md:flex flex-wrap justify-center px-4 lg:px-0 gap-2 md:gap-4 w-full grid grid-cols-2">
            {wishlistState.length > 0 ?
              wishlistState?.map((eachProduct, index) => {
                const row = Math.floor(index / numItemsPerRow);
                const col = index % numItemsPerRow;
                // Adjust grid item style based on row and column position
                let gridItemStyle = `w-1/${numItemsPerRow} mb-8 flex flex-col items-center justify-center`;
                // Center single item if necessary
                if (wishlistState.length === 1) {
                  gridItemStyle += " mx-auto";
                }
                return (
                  <article key={eachProduct.id} className={`h-fit w-fit ${gridItemStyle}`}>
                    <div className="shadow-lg max-w-[242px]">
                      <ItemCard
                        forWishList={true}
                        wishListId={eachProduct.id}
                        handleRemoveWishlist={handleRemoveWishlist}
                        product={eachProduct.product}
                        reviews={eachProduct.reviews}
                        availableStock={eachProduct.available_stock}
                        handleShareWishListItem={handleShareWishListItem}
                      />
                    </div>
                    <Link
                      href={`/product/${eachProduct.product.id}`}
                      disabled
                      className="px-7 mt-3 py-3.5 hover:bg-amber-300 cursor-pointer bg-[#FFCD00] rounded w-fit text-center text-base font-semibold"
                    >
                      Add to Cart
                    </Link>
                  </article>
                );
              }) : <h4 className="text-2xl font-semibold my-16 lg:my-32 text-center">
                Your wishlist is empty. Start adding items to See it here!
              </h4>
            }
          </div> : <div className="container animate-pulse mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 gap-y-10">
              {[...Array(24)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
      }
    </section>
  );
}