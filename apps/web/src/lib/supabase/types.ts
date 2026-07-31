export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  parent_id: string | null;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  item_code: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number | null;
  stock_status: string;
  sell_mode: string;
  is_active: boolean;
  slug: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  variant_type: string;
  price_override: number | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_path: string;
  sort_order: number;
}

export interface SiteSetting {
  key: string;
  value_en: string;
  value_ar: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  product_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}
