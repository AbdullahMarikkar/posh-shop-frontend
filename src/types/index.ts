export interface Product {
  id: string;
  name: string;
  description: string;
  sku?: string;
  price: number;
  imageUrl: string;  // mapped from "image" in the backend
  status?: string;
  category?: string;
  brand?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface ShippingDetail {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  delivery_address: string;
  city: string;
  postal: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

// ─── Search / Filter types ────────────────────────────────────────────────────

export type SortField = 'price' | 'name' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  key: string;           // full-text search — name/description/sku/brand
  category: string;     // '' means all
  brand: string;        // '' means all
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const DEFAULT_FILTERS: SearchFilters = {
  key: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'name',
  sortOrder: 'asc',
};
