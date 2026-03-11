import apiClient from "./client";
import type { Product } from "../types";

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};
