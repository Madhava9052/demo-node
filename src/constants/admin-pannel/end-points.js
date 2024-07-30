export const replaceParams = (endpoint, params = {}) => {
  Object.keys(params).forEach((key) => {
    endpoint = endpoint.replace(`\${${key}}`, params[key]);
  });
  return endpoint;
};

export const IMAGES_PATHS = {
  DEFAULT_PATH: 'static/home_page',
  SLIDERS: 'static/home_page/sliders',
  SERVICES: 'static/home_page/services',
  FEATURED_BANNER: 'static/home_page/featured_banners',
  LARGE_BANNER: 'static/home_page/large_banners',
  CATALOGUE: 'static/home_page/catalogue',
  PARTNER: 'static/home_page/partners',
  COMPANY: 'static/home_page/company',
  WHATWEDO: 'static/home_page/whatwedos',
  SUBCATEGORY: "static/category_management/sub_category",
  CONTACT: "static/contact"
};

export const COLLECTION_DROPDOWN_END_POINT = '/api/collections/summary/';

export const IMAGE_UPLOAD_END_POINT = '/api/upload/?path=${path}';

export const COMPANY_DATA_END_POINT = '/api/company/';

export const SLIDER_END_POINTS = {
  LIST: '/api/sliders/${offsetValue}', //GET
  VIEW: '/api/sliders/${id}',
  CREATE: '/api/sliders/',
  EDIT: '/api/sliders/${id}',
  DELETE: '/api/sliders/${id}',
};

export const COLLECTION_END_POINTS = {
  LIST: '/api/collections/${offsetValue}',
  VIEW: '/api/collections/${id}',
  CREATE: '/api/collections/',
  EDIT: '/api/collections/${id}',
  DELETE: '/api/collections/${id}',
}

export const VENDER_END_POINTS = {
  LIST: '/api/vendors/',
  VIEW: '/api/vendors/${id}',
  CREATE: '/api/vendors/',
  EDIT: '/api/vendors/${id}',
  DELETE: '/api/vendors/${id}',
};

export const SERVICES_END_POINTS = {
  LIST: '/api/services/',
  VIEW: '/api/services/${id}',
  CREATE: '/api/services/',
  EDIT: '/api/services/${id}',
  DELETE: '/api/services/${id}',
};

export const FEATURED_BANNERS_END_POINTS = {
  LIST: '/api/banners/?banner_type=FEATURED_BANNER',
  VIEW: '/api/banners/${id}',
  CREATE: '/api/banners/',
  EDIT: '/api/banners/${id}',
  DELETE: '/api/banners/${id}',
};

export const LARGE_BANNERS_END_POINTS = {
  LIST: '/api/banners/?banner_type=LARGE_BANNER',
  VIEW: '/api/banners/${id}',
  CREATE: '/api/banners/',
  EDIT: '/api/banners/${id}',
  DELETE: '/api/banners/${id}',
};

export const CATALOGUE_END_POINTS = {
  LIST: '/api/catalogues/',
  VIEW: '/api/catalogues/${id}',
  CREATE: '/api/catalogues/',
  EDIT: '/api/catalogues/${id}',
  DELETE: '/api/catalogues/${id}',
};

export const BESTSELLER_END_POINTS = {
  LIST: '/api/best_sellers/',
  VIEW: '/api/best_sellers/${id}',
  CREATE: '/api/best_sellers/',
  EDIT: '/api/best_sellers/${id}',
  DELETE: '/api/best_sellers/${id}',
};

export const PRODUCT_HIGHLIGHT_END_POINTS = {
  LIST: '/api/product_highlights/',
  VIEW: '/api/product_highlights/${id}',
  CREATE: '/api/product_highlights/',
  EDIT: '/api/product_highlights/',
  DELETE: '/api/product_highlights/${id}',
};

export const PARTNER_END_POINTS = {
  LIST: '/api/partners/',
  VIEW: '/api/partners/${id}',
  CREATE: '/api/partners/',
  EDIT: '/api/partners/${id}',
  DELETE: '/api/partners/${id}',
};

export const COMPANY_END_POINTS = {
  LIST: '/api/company/',
  VIEW: '/api/company/${id}',
  EDIT: '/api/company/${id}',
};

export const DESIGN_PARTNERS_END_POINTS = {
  LIST: '/api/design_partners/',
  VIEW: '/api/design_partners/${id}',
  EDIT: '/api/design_partners/${id}',
};

export const WHATWEDO_END_POINTS = {
  LIST: '/api/whatwedo/',
  VIEW: '/api/whatwedo/${id}',
  EDIT: '/api/whatwedo/${id}',
};

export const CONTACT_US_END_POINTS = {
  LIST: '/api/contact/',
  VIEW: '/api/contact/${id}',
  EDIT: '/api/contact/${id}',
};

export const COUPON_END_POINTS = {
  LIST: '/api/coupons/',
  CREATE: '/api/coupons/',
  VIEW: '/api/coupons/${id}',
  EDIT: '/api/coupons/${id}',
};

export const FAQ_END_POINTS = {
  LIST: '/api/frequently_asked_questions/${offsetValue}', //GET
  VIEW: '/api/frequently_asked_questions/${id}',
  CREATE: '/api/frequently_asked_questions/',
  EDIT: '/api/frequently_asked_questions/${id}',
  DELETE: '/api/frequently_asked_questions/${id}',
};

export const PRODUCT_COMMENT_END_POINTS = {
  LIST: '/api/product_comments/${offsetValue}', //GET
  VIEW: '/api/product_comments/${id}',
  CREATE: '/api/product_comments/',
  EDIT: '/api/product_comments/${id}',
  DELETE: '/api/product_comments/${id}',
};

export const DESIGN_PARTNER_SERVICE_END_POINTS = {
  LIST: '/api/design_partner_services/${offsetValue}', //GET
  VIEW: '/api/design_partner_services/${id}',
  CREATE: '/api/design_partner_services/',
  EDIT: '/api/design_partner_services/${id}',
  DELETE: '/api/design_partner_services/${id}',
};