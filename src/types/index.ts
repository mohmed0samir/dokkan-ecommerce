// Core Types for Dokkan E-Commerce Platform

// User & Authentication Types
export type UserRole = 'customer' | 'admin' | 'super_admin' | 'product_manager' | 'order_manager' | 'advertising_manager' | 'analyst';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  phoneNumber?: string;
  addresses?: Address[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  locale: 'ar' | 'en';
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  district?: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Product Types
export type ProductStatus = 'draft' | 'active' | 'archived' | 'out_of_stock';
export type ProductVisibility = 'public' | 'hidden' | 'featured';

export interface Product {
  id: string;
  sku: string;
  name: LocalizedString;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  images: ProductImage[];
  price: Price;
  compareAtPrice?: Price;
  costPrice?: number;
  margin?: number;
  supplierId?: string;
  supplierSku?: string;
  status: ProductStatus;
  visibility: ProductVisibility;
  featured: boolean;
  tags: string[];
  variants: ProductVariant[];
  inventory: Inventory;
  specifications: Specification[];
  seo: SEOData;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: LocalizedString;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: LocalizedString;
  sku: string;
  price?: number;
  compareAtPrice?: number;
  inventory: Inventory;
  options: VariantOption[];
  image?: string;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  backorderLimit?: number;
}

export interface Specification {
  name: LocalizedString;
  value: LocalizedString;
  group?: string;
}

export interface Price {
  amount: number;
  currency: string;
  formatted: string;
}

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface SEOData {
  title?: LocalizedString;
  description?: LocalizedString;
  keywords?: string[];
  slug: string;
}

// Category Types
export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  description?: LocalizedString;
  image?: string;
  parentId?: string;
  level: number;
  displayOrder: number;
  featured: boolean;
  visible: boolean;
  productCount?: number;
  seo: SEOData;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: LocalizedString;
  image: string;
  variantOptions?: VariantOption[];
  maxQuantity?: number;
}

// Order Types
export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type CODStatus = 'pending' | 'collected' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  codStatus: CODStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string;
  internalNotes?: string;
  supplierId?: string;
  supplierOrderId?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  refundReason?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: LocalizedString;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantOptions?: VariantOption[];
  supplierCost?: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  apiConfig?: SupplierAPIConfig;
  apiStatus: 'connected' | 'disconnected' | 'error' | 'not_configured';
  lastSyncAt?: Date;
  syncError?: string;
  paymentTerms?: string;
  defaultMargin?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierAPIConfig {
  type: 'manual' | 'rest' | 'graphql' | 'custom';
  baseUrl?: string;
  authType?: 'api_key' | 'oauth' | 'basic' | 'bearer';
  credentials?: Record<string, string>;
  endpoints?: {
    products?: string;
    orders?: string;
    inventory?: string;
    tracking?: string;
  };
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  timeout?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productId: string;
  supplierSku: string;
  supplierPrice: number;
  supplierCurrency: string;
  stock: number;
  leadTime?: number;
  lastSyncedAt?: Date;
  syncStatus: 'synced' | 'pending' | 'error';
  syncError?: string;
}

// Advertising/Campaign Types
export type CampaignType =
  | 'sponsored_product'
  | 'featured_product'
  | 'promoted_category'
  | 'homepage_banner'
  | 'category_banner'
  | 'search_top';

export type CampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'expired'
  | 'rejected'
  | 'cancelled';

export type CampaignPricingModel = 'cpm' | 'cpc' | 'flat_fee' | 'package';

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  pricingModel: CampaignPricingModel;
  budget: number;
  spent: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  targeting: CampaignTargeting;
  creative: CampaignCreative;
  placement: CampaignPlacement;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  paymentVerified: boolean;
  paymentVerifiedAt?: Date;
  paymentVerifiedBy?: string;
  paymentNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignTargeting {
  categories?: string[];
  products?: string[];
  locations?: string[];
  devices?: ('mobile' | 'desktop' | 'tablet')[];
  ageRange?: { min: number; max: number };
  gender?: 'male' | 'female' | 'all';
  interests?: string[];
}

export interface CampaignCreative {
  headline: LocalizedString;
  description?: LocalizedString;
  imageUrl: string;
  destinationUrl: string;
  callToAction?: LocalizedString;
  altText?: LocalizedString;
}

export interface CampaignPlacement {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  page: 'home' | 'category' | 'product' | 'search' | 'cart' | 'checkout';
  priority: number;
  maxImpressionsPerDay?: number;
}

export interface Advertiser {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  taxId?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  balance: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignEvent {
  id: string;
  campaignId: string;
  type: 'impression' | 'click';
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  revenue?: number;
}

// Store Settings
export interface StoreSettings {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address?: LocalizedString;
  socialLinks: SocialLinks;
  currency: CurrencySettings;
  shipping: ShippingSettings;
  cod: CODSettings;
  taxes: TaxSettings;
  seo: GlobalSEO;
  maintenance: MaintenanceSettings;
  features: FeatureFlags;
  updatedAt: Date;
  updatedBy: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  whatsapp?: string;
}

export interface CurrencySettings {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export interface ShippingSettings {
  freeShippingThreshold?: number;
  defaultFee: number;
  regions: ShippingRegion[];
  estimatedDeliveryDays: { min: number; max: number };
}

export interface ShippingRegion {
  id: string;
  name: LocalizedString;
  countries: string[];
  fee: number;
  freeShippingThreshold?: number;
  estimatedDays: { min: number; max: number };
}

export interface CODSettings {
  enabled: boolean;
  fee: number;
  maxAmount?: number;
  allowedRegions?: string[];
  collectionInstructions?: LocalizedString;
}

export interface TaxSettings {
  enabled: boolean;
  defaultRate: number;
  includedInPrice: boolean;
  rates: TaxRate[];
}

export interface TaxRate {
  country: string;
  region?: string;
  rate: number;
  name: string;
}

export interface GlobalSEO {
  defaultTitle: LocalizedString;
  defaultDescription: LocalizedString;
  defaultImage?: string;
  twitterHandle?: string;
  facebookAppId?: string;
}

export interface MaintenanceSettings {
  enabled: boolean;
  message?: LocalizedString;
  allowedRoles?: UserRole[];
}

export interface FeatureFlags {
  guestCheckout: boolean;
  wishlist: boolean;
  compareProducts: boolean;
  productReviews: boolean;
  recentlyViewed: boolean;
  relatedProducts: boolean;
  inventoryDisplay: boolean;
  estimatedDelivery: boolean;
}

// Import/Export Types
export interface ImportJob {
  id: string;
  type: 'products' | 'suppliers' | 'inventory' | 'orders';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fileName: string;
  fileSize: number;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ImportError[];
  mapping?: ImportMapping;
  options: ImportOptions;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdBy: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  value?: unknown;
}

export interface ImportMapping {
  [sourceColumn: string]: string;
}

export interface ImportOptions {
  dryRun: boolean;
  skipErrors: boolean;
  updateExisting: boolean;
  createMissing: boolean;
  batchSize: number;
  name?: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'bulk_update' | 'import' | 'export';
  changes?: Record<string, { old: unknown; new: unknown }>;
  userId: string;
  userRole: UserRole;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: ResponseMeta;
}

// Form Types
export interface FormField {
  name: string;
  label: LocalizedString;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date' | 'datetime';
  required?: boolean;
  placeholder?: LocalizedString;
  options?: SelectOption[];
  validation?: ValidationRule[];
  dependsOn?: string;
  showWhen?: Record<string, unknown>;
}

export interface SelectOption {
  value: string;
  label: LocalizedString;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'url' | 'custom';
  value?: unknown;
  message: LocalizedString;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type EntityWithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type WithId<T> = T & { id: string };