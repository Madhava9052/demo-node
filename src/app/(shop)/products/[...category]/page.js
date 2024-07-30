import { sendRequest } from '@/helpers/utils';
import CategoryLayout from '../../category/layout';
import FiltersAndProducts from '@/app/components/shop/category/filtersAndProducts';

export default async function Collection({ params, searchParams }) {
  const categoryId = params.category[params.category.length - 1];
  const categoryName = params.category[params.category.length - 2];
  const categoryType =
    params.category.length > 2
      ? params.category[params.category.length - 3].toUpperCase()
      : 'CATEGORY';
  let queryString = ""
  Object.keys(searchParams).forEach(key => {
    if (key === "colors"){
      queryString = queryString ? queryString + '&' + key + '=' + searchParams[key].split("#").join("%23") : queryString + "?" + key + '=' + searchParams[key]
    }else{
      queryString = queryString ? queryString + '&' + key + '=' + searchParams[key] : queryString + "?" + key + '=' + searchParams[key]
    }
  })
  const offsetCount = searchParams.offset ? parseInt(searchParams.offset) : 0;
  const [responseData, { data: categories = [] }] = await Promise.all([
    sendRequest(`/api/products/collections/${categoryId}${queryString}`),
    sendRequest(`/api/categories/`),
  ]);
  
  const { data: products = [] } = responseData;
  // Find the parent category of the target sub-category
  const parentCategory = categories.find((category) =>
    category.sub_categories.some((subCategory) => subCategory.id === categoryId)
  );
  const parentCategory1 = categories.find(
    (category) => category.id === categoryId
  );

  // Extract all sibling sub-categories of the target sub-category
  let siblingSubCategories = parentCategory
    ? parentCategory?.sub_categories
    : parentCategory1?.sub_categories
      ? parentCategory1?.sub_categories
      : [];

  return (
    <CategoryLayout
      queryParamValue={params}
      bannerDetails={{
        tittle: categoryName,
        description:
          'At Welovebranding we can custom print your business logo and branding on a wide variety of custom drink ware such as water bottles, coffee mugs, wine glasses, tumblers, beer glasses and more. High quality logo printing that everyone can find refreshing.',
      }}
    >
      <section className="mt-4 sm:mt-[60px] lg:mt-8">
        {!products?.length && (
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="my-4 text-4xl font-extrabold  leading-none text-gray-900 md:text-5xl lg:text-6xl">
              {`No products on category :- ${categoryName}`}
            </h1>
          </div>
        )}

        <FiltersAndProducts
          products={products}
          responseData={responseData}
          search={searchParams}
          siblingSubCategories={siblingSubCategories}
          categoryId={categoryId}
          categoryName={categoryName}
          categoryType={categoryType}
          offsetCount={offsetCount}
          showTextOnly={false}
          searchParams={searchParams}
        />
      </section>
    </CategoryLayout>
  );
}
