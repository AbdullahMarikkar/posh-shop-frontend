import axios from "axios";

// The axios instance — all API calls go through here
const apiClient = axios.create({
  // user-service is on 8081, posh-shop-backend may use a gateway.
  // VITE_API_URL should be set in .env (default: user-service base)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost",
  headers: {
    "Content-Type": "application/json",
  },
  // Critical: allows HttpOnly cookies to be sent cross-origin
  withCredentials: true,
});

// Configure dynamic port mapping 
apiClient.interceptors.request.use((config) => {
  if (config.url) {
    const portMatch = config.url.match(/^:(\d+)(\/.*)?$/);
    if (portMatch) {
      const port = portMatch[1];
      const path = portMatch[2] || '';
      try {
        const base = new URL(config.baseURL || window.location.origin);
        base.port = port;
        config.baseURL = base.toString().replace(/\/$/, "");
        config.url = path;
      } catch (e) {
        // Fallback
        config.baseURL = `http://localhost:${port}`;
        config.url = path;
      }
    }
  }
  return config;
});

// ─── Response interceptor: handle 401 with token refresh ─────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue subsequent 401s until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dynamically import to avoid circular dependency
        const { useAuthStore } = await import("../store/useAuthStore");
        const { accessToken, refreshToken } = useAuthStore.getState();

        if (!accessToken || !refreshToken) {
          throw new Error("No tokens available for refresh");
        }

        const { AuthService } = await import("./auth.service");
        const data = await AuthService.refreshSession(
          accessToken,
          refreshToken,
        );

        // Update stored tokens
        useAuthStore
          .getState()
          .setTokens(data.access_token, data.refresh_token);

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Force logout if refresh also fails
        const { useAuthStore } = await import("../store/useAuthStore");
        useAuthStore.getState().logout();

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
