import Banner from '@/app/components/shop/home-page/banner/banner';
import BannerStrip from '@/app/components/shop/home-page/bannerStrip';
import OurBestSellersSection from '@/app/components/shop/home-page/ourBestSellersSection';
import FeaturedBanners from '../components/shop/home-page/featuredBanner';
import ShopByBrand from '../components/shop/home-page/shopByBrand';
import CatalogueImages from '../components/shop/home-page/catalogue';
import { sendRequest } from '@/helpers/utils';
import PromotionalProducts from '../components/shop/home-page/promotionalProducts';
import CustomerReviews from '../components/shop/home-page/customerReviews';
import TopProducts from '../components/shop/home-page/topProducts';
import LargeBanners from '../components/shop/home-page/lagerBanners';
import SubcriptionBanner from '../components/shop/home-page/SubscriptionBanner';
import Partners from '../components/shop/home-page/partnersLogos';
import FeaturedProducts from '../components/shop/home-page/featuredProducts';
import AboutFiveStar from '../components/shop/home-page/aboveFiveStar';
import AdvertisementBanner from '../components/shop/home-page/AdvertisementBanner';

export default async function Home() {
  const [
    { data: brandsInfo },
    { data: landingPageData },
    { data: topProducts },
    { data: featuredProducts },
    { data: bestSellersCategories },
  ] = await Promise.all([
    sendRequest('/api/categories/?type=BRAND'),
    sendRequest('/api/landing_page'),
    sendRequest('/api/products/?type=TOP'),
    sendRequest('/api/products/featured/collection/'),
    sendRequest('/api/products/category/best_sellers'),
  ]);
  return (
    <>
      {landingPageData?.sliders && (
        <Banner sliders={landingPageData?.sliders} />
      )}
      {landingPageData.services && (
        <BannerStrip services={landingPageData.services} />
      )}
      {landingPageData.featured_banners && (
        <FeaturedBanners featuredBanners={landingPageData.featured_banners} />
      )}
      {brandsInfo[0].sub_categories && (
        <ShopByBrand brandCategories={brandsInfo[0].sub_categories} />
      )}
      {bestSellersCategories?.best_seller?.length ? (
        <OurBestSellersSection
          bestSellersCategories={bestSellersCategories.best_seller}
        />
      ) : (
        ''
      )}
      {landingPageData?.catalogues && (
        <CatalogueImages catalogues={landingPageData?.catalogues} />
      )}
      {landingPageData?.whatwedos && (
        <PromotionalProducts whatwedos={landingPageData?.whatwedos} />
      )}
      {topProducts && <TopProducts topProducts={topProducts} />}
      {landingPageData?.about && (
        <AboutFiveStar
          aboutFiveStarData={landingPageData?.about.design_partners[0]}
          aboutFiveStarServices={
            landingPageData.about.design_partner_service_objects
          }
        />
      )}
      {featuredProducts && (
        <FeaturedProducts featuredProducts={featuredProducts} />
      )}
      <AdvertisementBanner/>
      {landingPageData.product_comments && (
        <CustomerReviews reviews={landingPageData.product_comments} />
      )}

      {landingPageData.large_banners && (
        <LargeBanners slides={landingPageData.large_banners} />
      )}
      <SubcriptionBanner/>
      {landingPageData.partners && (
        <Partners partners={landingPageData.partners} />
      )}
    </>
  );
}
