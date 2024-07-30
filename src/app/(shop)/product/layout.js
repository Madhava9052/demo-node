import styles from './product.module.css';
import { sendRequest } from '@/helpers/utils';
import YouMayAlsoLike from '@/app/components/shop/product/youMayAlsoLike';

export const metadata = {
  title: 'We Love Branding',
  description:
    'We have been branding all manner of products for over 12 years and in this time have grown from our humble roots into one of the top print suppliers for many SME’s in New Zealand',
};
export default async function ProductLayout({ children }) {
  const [{ data: topProducts }] = await Promise.all([
    sendRequest('/api/products/?type=TOP'),
  ]);
  return (
    <main>
      {children}
      <section className="hidden lg:block lg:mt-24 w-full">
        <div
          className={`${styles['bg-custom-img-be-the-best-brand']} h-48 lg:h-[450px] flex items-center`}
        >
          <div className='container mx-auto lg:px-[50px] xl:px-0'>
            <div className="bg-black bg-opacity-50 w-full lg:max-w-[520px] lg:min-h-[300px] grow flex flex-col justify-center items-start pl-[20px] lg:pl-[40px]">
              <h3 className="text-white font-montserrat text-2xl font-semibold leading-[59px] tracking-[0.48px]">
                Be The Best Brand
              </h3>
              <p className="text-white font-montserrat text-[16px] max-w-[500px] font-normal font-weight-400 leading-normal tracking-0.24">
                Shop your look today!
              </p>
              <button className="bg-[#8A1E41] py-[14px] px-[28px] text-white mt-[20px]">
                Shop now
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto">
        <div className="lg:mt-4 xl:mt-2 overflow-scroll no-scrollbar">
          <YouMayAlsoLike topProducts={topProducts} title="You may also like" />
        </div>
      </section>
    </main>
  );
}
