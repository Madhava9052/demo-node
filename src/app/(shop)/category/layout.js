import LargeBanners from '../../components/shop/home-page/lagerBanners';

import HomePageBanner from '@/app/components/shop/home-page/banner/banner';
import BannerStrip from '@/app/components/shop/home-page/bannerStrip';
import { sendRequest } from '@/helpers/utils';

export default async function CategoryLayout({
  children,
  queryParamValue,
  bannerDetails,
}) {
  const [{ data: landingPageData }] = await Promise.all([
    sendRequest('/api/landing_page'),
  ]);
  const showLayout =
    queryParamValue &&
    (Object.keys(queryParamValue).includes('category') ||
      Object.keys(queryParamValue).includes('collection') ||
      Object.keys(queryParamValue).includes('brand'));
  return (
    <main>
      {showLayout && (
        <HomePageBanner from={'listingPage'} bannerDetails={bannerDetails} />
      )}
      {children}
      {showLayout && (
        <>
          {landingPageData.large_banners && (
            <LargeBanners slides={landingPageData.large_banners} />
          )}
          {landingPageData.services && (
            <BannerStrip services={landingPageData.services} />
          )}
        </>
      )}
    </main>
  );
}
