import apiClient from "./client";
import type { User, ShippingDetail } from "../types";

export const UserService = {
  /**
   * GET /user?email=...
   * user-service returns the user by email.
   */
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await apiClient.get(":8081/user", { params: { email } });
    return response.data;
  },

  /**
   * Alias to get the currently authenticated user by their stored email.
   * The caller should pass the email from the auth store.
   */
  getCurrentUser: async (): Promise<User> => {
    // Will be called after login; no email needed here since
    // auth.service.ts fetches user details via email post-login.
    throw new Error("Use AuthService.getUserByEmail(email) after login.");
  },

  getShippingDetails: async (userId: string): Promise<ShippingDetail[]> => {
    const response = await apiClient.get(":8081/user/shipping-details", { params: { user_id: userId } });
    return response.data || [];
  },

  addShippingDetail: async (userId: string, detail: ShippingDetail): Promise<any> => {
    const response = await apiClient.post(":8081/user/shipping-details", detail, { params: { user_id: userId } });
    return response.data;
  },
};
