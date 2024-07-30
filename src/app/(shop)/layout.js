import '../globals.css';
import { Montserrat } from 'next/font/google';
import Footer from '@/app/components/shop/main-layout/footer';
import TopNavbar from '@/app/components/shop/main-layout/topNavbar';
import SearchNavbar from '@/app/components/shop/main-layout/searchNavbar';
import ProductNavbar from '@/app/components/shop/main-layout/productNavbar';
import { sendRequest } from '@/helpers/utils';
import { GlobalContextProvider } from '../context/store';
import { COMPANY_DATA_END_POINT } from '@/constants/admin-pannel/end-points';
import Script from 'next/script';
import ClientLayout from './ClientLayout';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'We Love Branding',
  description:
    'We have been branding all manner of products for over 12 years and in this time have grown from our humble roots into one of the top print suppliers for many SME’s in New Zealand',
};

export default async function RootLayout({ children }) {
  // Use Promise.all to fetch data from multiple APIs concurrently
  const [
    { data: productCategories },
    { data: categoryCollection },
    { data: categoryBrand },
    { data: brandingSolutions },
    { data: companyData },
  ] = await Promise.all([
    sendRequest('/api/categories'),
    sendRequest('/api/categories/?type=COLLECTION'),
    sendRequest('/api/categories/?type=BRAND'),
    sendRequest('/api/branding_solutions'),
    sendRequest(COMPANY_DATA_END_POINT),
  ]);

  // Combine data for the top navigation bar
  const finalTopNavbarData = [
    {
      name: 'Collection',
      dropdown: true,
      dropdownValues: categoryCollection[0]?.sub_categories,
    },
    {
      name: 'Brands',
      dropdown: true,
      dropdownValues: categoryBrand[0]?.sub_categories,
    },
    {
      name: 'Branding Solutions',
      dropdown: false,
      dropdownValues: brandingSolutions,
    },
    {
      name: 'Categories',
      dropdown: true,
      dropdownValues: productCategories,
    },
    { name: 'Contact', dropdown: false },
  ];

  if (process.env.NODE_ENV === 'production') {
    console.log = function () {};
  }

  return (
    <html lang="en">
      <body className={`${montserrat.className} `}>
        <GlobalContextProvider>
          <Script src={"//code.tidio.co/" + process.env.NEXT_PUBLIC_TIDIO_KEY} async />
          <ClientLayout>
            <section className="sticky top-0 z-30">
              <TopNavbar bannerNavbarItems={finalTopNavbarData} contactInfo={companyData?.information[0]} />
              <SearchNavbar logo={companyData?.avatar} />
              <ProductNavbar categoriesData={productCategories} />
            </section>
            {children}
            <div id="modal-root"></div>
            <Footer footerData={companyData} productCategories={productCategories} />
          </ClientLayout>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
