import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

export type ApiSuccessResponse<T> = { ok?: boolean; message?: string; data?: T; meta?: { page: number; limit: number; total: number; totalPages: number } };
export type ApiErrorResponse = { message?: string; errors?: Record<string, string[]> };
export type ApiResponse<T> = AxiosResponse<ApiSuccessResponse<T>>;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError<ApiErrorResponse>) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle 401 Unauthorized (expired/invalid token)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
