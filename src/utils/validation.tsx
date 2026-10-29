import { z } from 'zod';
import { Locale } from '../locales';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Phone validation schema (Saudi Arabia)
 * Normalizes phone number by removing non-digit characters (except +) before validation
 */
export const phoneSchema = z.string().transform((val) => {
  // Normalize: keep only digits and + sign
  return val.replace(/[^\d+]/g, '');
}).pipe(z.string().regex(
  /^(\+966|0)?[5-9]\d{8}$/,
  'Invalid phone number. Use format: +966501234567 or 0501234567 or 501234567'
));

/**
 * Name validation schema
 */
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100);

/**
 * Address validation schemas
 */
export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  isDefault: z.boolean().default(false),
});

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

/**
 * Register form schema
 */
export const registerSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Profile update schema
 */
export const profileSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

/**
 * Checkout address schema
 */
export const checkoutAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  phone: phoneSchema,
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  saveAddress: z.boolean().default(false),
  setDefault: z.boolean().default(false),
});

/**
 * Product form schema
 */
export const productSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic name is required'),
    en: z.string().min(1, 'English name is required'),
  }),
  description: z.object({
    ar: z.string().min(1, 'Arabic description is required'),
    en: z.string().min(1, 'English description is required'),
  }),
  shortDescription: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  supplierId: z.string().optional(),
  supplierSku: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived', 'out_of_stock']),
  visibility: z.enum(['public', 'hidden', 'featured']),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  variants: z.array(
    z.object({
      name: z.object({
        ar: z.string().min(1),
        en: z.string().min(1),
      }),
      sku: z.string().min(1),
      price: z.number().positive().optional(),
      compareAtPrice: z.number().positive().optional(),
      inventory: z.object({
        quantity: z.number().int().nonnegative(),
        reserved: z.number().int().nonnegative().default(0),
        lowStockThreshold: z.number().int().nonnegative().default(5),
        trackQuantity: z.boolean().default(true),
        allowBackorder: z.boolean().default(false),
        backorderLimit: z.number().int().nonnegative().optional(),
      }),
      options: z.array(
        z.object({
          name: z.string().min(1),
          value: z.string().min(1),
        })
      ),
      image: z.string().optional(),
    })
  ).default([]),
  specifications: z.array(
    z.object({
      name: z.object({
        ar: z.string().min(1),
        en: z.string().min(1),
      }),
      value: z.object({
        ar: z.string().min(1),
        en: z.string().min(1),
      }),
      group: z.string().optional(),
    })
  ).default([]),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  shippingClass: z.string().optional(),
  seo: z.object({
    title: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    description: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    keywords: z.array(z.string()).default([]),
    slug: z.string().min(1, 'Slug is required'),
  }),
});

/**
 * Category form schema
 */
export const categorySchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic name is required'),
    en: z.string().min(1, 'English name is required'),
  }),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  parentId: z.string().optional(),
  displayOrder: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  seo: z.object({
    title: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    description: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    keywords: z.array(z.string()).default([]),
    slug: z.string().min(1),
  }),
});

/**
 * Supplier form schema
 */
export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contactName: z.string().optional(),
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  apiConfig: z
    .object({
      type: z.enum(['manual', 'rest', 'graphql', 'custom']),
      baseUrl: z.string().url().optional().or(z.literal('')),
      authType: z.enum(['api_key', 'oauth', 'basic', 'bearer']).optional(),
      credentials: z.record(z.string(), z.string()).optional(),
      endpoints: z
        .object({
          products: z.string().optional(),
          orders: z.string().optional(),
          inventory: z.string().optional(),
          tracking: z.string().optional(),
        })
        .optional(),
      rateLimit: z
        .object({
          requestsPerMinute: z.number().int().positive().optional(),
          requestsPerHour: z.number().int().positive().optional(),
        })
        .optional(),
      timeout: z.number().int().positive().optional(),
      retryPolicy: z
        .object({
          maxRetries: z.number().int().nonnegative().optional(),
          backoffMs: z.number().int().positive().optional(),
        })
        .optional(),
    })
    .optional(),
  paymentTerms: z.string().optional(),
  defaultMargin: z.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
});

/**
 * Campaign form schema
 */
export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum([
    'sponsored_product',
    'featured_product',
    'promoted_category',
    'homepage_banner',
    'category_banner',
    'search_top',
  ]),
  pricingModel: z.enum(['cpm', 'cpc', 'flat_fee', 'package']),
  budget: z.number().positive('Budget must be positive'),
  currency: z.string().default('SAR'),
  startDate: z.date(),
  endDate: z.date(),
  targeting: z.object({
    categories: z.array(z.string()).default([]),
    products: z.array(z.string()).default([]),
    locations: z.array(z.string()).default([]),
    devices: z.array(z.enum(['mobile', 'desktop', 'tablet'])).default([]),
    ageRange: z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative() }).optional(),
    gender: z.enum(['male', 'female', 'all']).default('all'),
    interests: z.array(z.string()).default([]),
  }),
  creative: z.object({
    headline: z.object({
      ar: z.string().min(1),
      en: z.string().min(1),
    }),
    description: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    imageUrl: z.string().url('Valid image URL is required'),
    destinationUrl: z.string().url('Valid destination URL is required'),
    callToAction: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    altText: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
  }),
  placement: z.object({
    position: z.enum(['top', 'middle', 'bottom', 'sidebar', 'inline']),
    page: z.enum(['home', 'category', 'product', 'search', 'cart', 'checkout']),
    priority: z.number().int().nonnegative().default(0),
    maxImpressionsPerDay: z.number().int().positive().optional(),
  }),
});

/**
 * Advertiser form schema
 */
export const advertiserSchema = z.object({
  name: z.string().min(1, 'Advertiser name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  taxId: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Store settings schema
 */
export const storeSettingsSchema = z.object({
  name: z.object({
    ar: z.string().min(1),
    en: z.string().min(1),
  }),
  description: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  address: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
    snapchat: z.string().url().optional().or(z.literal('')),
    whatsapp: z.string().url().optional().or(z.literal('')),
  }),
  currency: z.object({
    code: z.string().default('SAR'),
    symbol: z.string().default('ر.س'),
    position: z.enum(['before', 'after']).default('after'),
    decimalPlaces: z.number().int().min(0).max(3).default(2),
    thousandsSeparator: z.string().default(','),
    decimalSeparator: z.string().default('.'),
  }),
  shipping: z.object({
    freeShippingThreshold: z.number().positive().optional(),
    defaultFee: z.number().nonnegative().default(0),
    regions: z.array(
      z.object({
        id: z.string(),
        name: z.object({ ar: z.string(), en: z.string() }),
        countries: z.array(z.string()),
        fee: z.number().nonnegative(),
        freeShippingThreshold: z.number().positive().optional(),
        estimatedDays: z.object({ min: z.number().int().positive(), max: z.number().int().positive() }),
      })
    ).default([]),
    estimatedDeliveryDays: z.object({ min: z.number().int().positive(), max: z.number().int().positive() }).default({ min: 2, max: 5 }),
  }),
  cod: z.object({
    enabled: z.boolean().default(true),
    fee: z.number().nonnegative().default(0),
    maxAmount: z.number().positive().optional(),
    allowedRegions: z.array(z.string()).default([]),
    collectionInstructions: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
  }),
  taxes: z.object({
    enabled: z.boolean().default(false),
    defaultRate: z.number().min(0).max(100).default(0),
    includedInPrice: z.boolean().default(false),
    rates: z.array(
      z.object({
        country: z.string(),
        region: z.string().optional(),
        rate: z.number().min(0).max(100),
        name: z.string(),
      })
    ).default([]),
  }),
  seo: z.object({
    defaultTitle: z.object({
      ar: z.string().min(1),
      en: z.string().min(1),
    }),
    defaultDescription: z.object({
      ar: z.string().min(1),
      en: z.string().min(1),
    }),
    defaultImage: z.string().url().optional(),
    twitterHandle: z.string().optional(),
    facebookAppId: z.string().optional(),
  }),
  maintenance: z.object({
    enabled: z.boolean().default(false),
    message: z.object({
      ar: z.string().optional(),
      en: z.string().optional(),
    }),
    allowedRoles: z.array(z.enum(['customer', 'admin', 'super_admin', 'product_manager', 'order_manager', 'advertising_manager', 'analyst'])).default(['admin', 'super_admin']),
  }),
  features: z.object({
    guestCheckout: z.boolean().default(true),
    wishlist: z.boolean().default(true),
    compareProducts: z.boolean().default(true),
    productReviews: z.boolean().default(true),
    recentlyViewed: z.boolean().default(true),
    relatedProducts: z.boolean().default(true),
    inventoryDisplay: z.boolean().default(true),
    estimatedDelivery: z.boolean().default(true),
  }),
});

/**
 * Type inference helpers
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type AdvertiserInput = z.infer<typeof advertiserSchema>;
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

/**
 * Localized string schema
 */
export const localizedStringSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

/**
 * Create a localized string validator
 */
export function createLocalizedStringSchema(required = true) {
  const base = z.object({
    ar: z.string(),
    en: z.string(),
  });

  if (required) {
    return base.refine(
      data => data.ar.trim() !== '' || data.en.trim() !== '',
      'At least one language is required'
    );
  }

  return base;
}

/**
 * Validation error formatter
 */
export function formatZodError(error: z.ZodError, locale: Locale): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    const message = typeof issue.message === 'string' ? issue.message : 'Validation error';
    errors[path] = message;
  }

  return errors;
}

/**
 * Safe parse with locale-aware error messages
 */
export function safeParse<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
  locale: Locale
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: formatZodError(result.error, locale) };
}