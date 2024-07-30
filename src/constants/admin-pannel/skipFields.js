export const vendorDetailView = ['id', 'is_active'];

export const categoryView = [
  'id',
  'is_active',
  'product_highlight',
  'sub_categories',
];

export const collectionView = [
  'id',
  "product_objects",
];

export const subCategoryView = []
export const userView = []

export const commonSkipFields = [
  'id',
  'created_at',
  'updated_at',
  'created_by_id',
  'updated_by_id',
  'created_by_user',
  'updated_by_user',
];

export const collectionList = [
  ...commonSkipFields,
]

export const slidersList = [
  'image_url',
  'image_alt',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'redirect_link',
  ...commonSkipFields,
];

export const faqList = [
  ...commonSkipFields,
]

export const sliderDetailView = [];

export const faqDetailView = ["id"]

export const servicesList = [
  'is_active',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'image_alt',
  'redirect_link',
  'image_url',
  ...commonSkipFields,
];
export const serviceDetailView = ['id'];

export const featuredBannersList = [
  'type',
  'image_url',
  'image_alt',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'redirect_link',
  'type',
  ...commonSkipFields,
];
export const featuredBannersDetailView = ['id', 'type'];

export const largeBannersList = [
  'type',
  'image_url',
  'image_alt',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'redirect_link',
  'type',
  ...commonSkipFields,
];
export const largeBannersDetailView = ['id', 'type'];

export const cataglogueList = [
  'image_url',
  'image_alt',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'redirect_link',
  ...commonSkipFields,
];
export const cataglogueDetailView = ['id'];
export const productHighlightView = ['id'];

export const bestSellersList = ['id',...commonSkipFields];
export const productHighlightSkipList = ['id',...commonSkipFields];
export const bestSellersDetailView = ['id'];

export const partnerList = [
  'image_url',
  'image_alt',
  'display_number',
  'is_redirection_available',
  'redirect_type',
  'redirect_link',
  ...commonSkipFields,
];
export const partnerDetailView = ['id'];
export const whatWeDoList = [
  'video_url',
  'top_image_url',
  'bottom_image_one_url',
  'bottom_image_two_url',
  'right_image_url',
  'company_logo',
  'shipping_logo',
  'shipping_title',
  'shipping_description',
  'shopping_logo',
  'shopping_title',
  'shopping_description',
  'payment_method_logo',
  'payment_method_description',
  ...commonSkipFields,
];

export const contactUs = [
  ...commonSkipFields,
  "avatar",
  "heading_one",
  "heading_two",
  "heading_three",
  "head_office_address",
  "retail_store_address"
]

export const contactUsView = ["id", "is_active"]

export const whatwedoDetailView = ['id', 'is_active'];

export const productCommentList = ['id', 'is_active', 'review', ...commonSkipFields];
export const productCommentDetailView = ['id', 'is_active'];
export const designPartnersDetailView = ['id', 'is_active'];
export const couponList = ['id', 'is_active'];
export const couponDetailView = ['id', 'is_active'];
export const designPartnerSkipList = ['id', 'is_active', 'review', 'sub_title', "description", 'image_alt', 'display_number', ...commonSkipFields];
export const designPartnerServiceSkipList = ['id', 'is_active', 'sub_title', 'description', 'image_alt', 'display_number', 'is_redirection_available',
  'redirect_type', 'redirect_link' , ...commonSkipFields];
export const designPartnerServiceViewSkipList = ['id', 'is_active', 'sub_title', 'image_alt'];
export const companyList = [
  'is_active',
  'avatar',
  'address',
  'number',
  'email',
  'working_hours',
  'social_media_links',
  ...commonSkipFields,
];
export const companyDetailView = ['id'];
