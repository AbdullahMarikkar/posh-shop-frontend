import apiClient from './client';
import type { Product } from '../types';

/**
 * Backend: posh-shop-backend on port 8080
 * Route: GET /product/search?key=&category=&limit=&offset=&sortBy=&sortOrder=
 *
 * Note: brand filter is on the Product model but not yet a query param in the
 * backend controller — client-side brand filtering covers the gap.
 */
export const ProductService = {
  searchProducts: async (params: {
    key?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> => {
    const response = await apiClient.get('/product/search', { params });
    // Backend returns image field; map to imageUrl for frontend consistency
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((p: any) => ({ ...p, imageUrl: p.image ?? p.imageUrl }));
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get('/product/details', { params: { id } });
    const p = response.data;
    return { ...p, imageUrl: p.image ?? p.imageUrl };
  },
};
