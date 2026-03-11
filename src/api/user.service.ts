import apiClient from "./client";
import type { User } from "../types";

export const UserService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
};
