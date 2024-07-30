export const productCreationSchema = [
  [
    {
      name: 'name',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'short_description',
      type: 'text',
      required: false,
      placeholder: 'This is required',
    },
    {
      name: 'long_description',
      type: 'text',
      required: false,
      placeholder: 'This is required',
    },
    {
      name: 'features',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'status',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'NEW', id: 'NEW' },
        { label: 'NORMAL', id: 'NORMAL' },
        { label: 'DISCONTINUED', id: 'DISCONTINUED' },
      ],
    },
    {
      name: 'type',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'TOP', id: 'TOP' },
        { label: 'HOT', id: 'HOT' },
        { label: 'BEST', id: 'BEST' },
        { label: 'TRENDING', id: 'TRENDING' },
        { label: 'FEATURED', id: 'FEATURED' },
        { label: 'LATEST', id: 'LATEST' },
      ],
    },
    {
      name: 'is_minimum_order_quantity_available',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'False', id: 'false' },
        { label: 'True', id: 'true' },
      ],
    },
    {
      name: 'is_product_sample_available',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'False', id: 'false' },
        { label: 'True', id: 'true' },
      ],
    },
  ],
  [
    {
      name: 'category_id',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'sub_category_id',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
    {
      name: 'vendor_id',
      type: 'text',
      required: true,
      placeholder: 'This is required',
    },
  ],
  [
    {
      name: 'is_additional_information_available',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'False', id: 'false' },
        { label: 'True', id: 'true' },
      ],
    },
  ],
  [
    {
      name: 'is_branding_available',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'False', id: 'false' },
        { label: 'True', id: 'true' },
      ],
    },
    
  ],
  [
    {
      name: 'is_variation_items_available',
      type: 'dropdown',
      required: true,
      values: [
        { label: 'False', id: 'false' },
        { label: 'True', id: 'true' },
      ],
    },
  ]
]

export const vendor = [
  {
    name: 'name',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'is_api_available',
    type: 'dropdown',
    required: true,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'shipping_charges',
    type: 'number',
    required: true,
  },
];

export const categorySchema = [
  {
    name: 'name',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'code',
    type: 'text',
    required: false,
  },
  {
    name: 'type',
    type: 'dropdown',
    required: true,
    values: [
      { label: 'COLLECTION', id: 'COLLECTION' },
      { label: 'BRAND', id: 'BRAND' },
      { label: 'CATEGORY', id: 'CATEGORY' },
    ],
  },
];

export const couponSchema = [
  {
    name: 'code',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'discount_percentage',
    type: 'number',
    required: false,
  },
  {
    name: 'min_amount',
    type: 'number',
    required: false,
  },
  {
    name: 'is_expiry',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },

]

export const subCategorySchema = [
  {
    name: 'name',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'avatar',
    type: 'file',
    required: true,
  },
  {
    name: 'code',
    type: 'text',
    required: false,
  },
  {
    name: 'category_id',
    type: 'dropdown',
    required: true,
    values: [],
  },
];

export const collectionSchema = [
  {
    name: 'name',
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
    name: 'is_featured',
    type: 'dropdown',
    required: true,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: "products",
    type: "chip",
    required: true,
  }
]

export const sliderSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'sub_title',
    type: 'text',
    required: false,
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'COLLECTION', id: 'COLLECTION' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
  {
    name: 'collection_id',
    type: 'dropdown',
    required: false,
    values: [],
  },
];

export const serviceSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'PAGE', id: 'PAGE' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
];

export const featuredBannerSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'COLLECTION', id: 'COLLECTION' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
  {
    name: 'collection_id',
    type: 'dropdown',
    required: false,
    values: [],
  },
];

export const largeBannerSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'COLLECTION', id: 'COLLECTION' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
  {
    name: 'collection_id',
    type: 'dropdown',
    required: false,
    values: [],
  },
];

export const catalogueSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'PAGE', id: 'PAGE' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
];

export const partnerSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'PAGE', id: 'PAGE' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
];

export const designPartnerSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
]

export const whatWeDoSchema = [
  {
    name: 'video_url',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'top_image_url',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'bottom_image_one_url',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'bottom_image_two_url',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },

  {
    name: 'right_image_title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'company_logo',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'company_title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'company_description',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'shipping_logo',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'shipping_title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'shipping_description',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'shopping_logo',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'shopping_title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'shopping_description',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'payment_method_logo',
    type: 'file',
    required: true,
    view: 'file',
    placeholder: 'This is required',
  },
  {
    name: 'payment_method_description',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
];

export const contactUs = [
  {
    name: 'title',
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
    name: 'avatar',
    type: 'file',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'heading_one',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'heading_two',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'heading_three',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'head_office_address',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'retail_store_address',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'number',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'email',
    type: 'email',
    required: true,
    placeholder: 'This is required',
  }
];

export const companySchema = [
  {
    name: 'title',
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
    name: 'avatar',
    type: 'file',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'address_head_office',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'address',
  },
  {
    name: 'address_retail_store',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'address',
  },
  {
    name: 'number',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'number',
  },
  {
    name: 'email',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'email',
  },
  {
    name: 'working_hours_monday_to_friday',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'working_hours',
  },
  {
    name: 'working_hours_saturday_to_sunday',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'working_hours',
  },
  {
    name: 'social_media_fb_link',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'social_media_links',
  },
  {
    name: 'social_media_insta_link',
    type: 'text',
    required: true,
    placeholder: 'This is required',
    parent: 'social_media_links',
  },
];

export const faqSchema = [
  {
    name: 'question',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'answer',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
]

export const designPartnerServiceSchema = [
  {
    name: 'title',
    type: 'text',
    required: true,
    placeholder: 'This is required',
  },
  {
    name: 'sub_title',
    type: 'text',
    required: false,
  },
  {
    name: 'description',
    type: 'text',
    required: false,
  },
  {
    name: 'image_url',
    type: 'file',
    required: true,
  },
  {
    name: 'image_alt',
    type: 'text',
    required: false,
  },
  {
    name: 'display_number',
    type: 'number',
    required: false,
  },
  {
    name: 'is_redirection_available',
    type: 'dropdown',
    required: false,
    values: [
      { label: 'False', id: 'false' },
      { label: 'True', id: 'true' },
    ],
  },
  {
    name: 'redirect_type',
    type: 'dropdown',
    values: [
      { label: 'LINK', id: 'LINK' },
      { label: 'COLLECTION', id: 'COLLECTION' },
    ],
  },
  {
    name: 'redirect_link',
    type: 'text',
    required: false,
  },
]