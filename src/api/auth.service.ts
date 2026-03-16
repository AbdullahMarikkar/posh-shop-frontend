import apiClient from "./client";
import type { User } from "../types";

export interface LoginRequest {
  email: string;
  username: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  country: string;
  address: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  authenticated: string;
}

export const AuthService = {
  /**
   * POST /user/login
   * Backend sets HttpOnly cookies AND returns tokens in body.
   */
  login: async (credentials: LoginRequest): Promise<AuthTokens> => {
    const response = await apiClient.post(":8081/login", credentials);
    return response.data;
  },

  /**
   * POST /user/create
   * Creates a new user account.
   */
  signup: async (userData: SignupRequest): Promise<void> => {
    await apiClient.post("/create", userData);
  },

  /**
   * POST /user/refresh
   * Sends current tokens in body; backend refreshes cookies and returns new tokens.
   */
  refreshSession: async (
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthTokens> => {
    const response = await apiClient.post(":8081/refresh", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * GET /user?email=...
   * Fetch user details by email.
   */
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await apiClient.get(":8081/user", { params: { email } });
    return response.data;
  },
};
