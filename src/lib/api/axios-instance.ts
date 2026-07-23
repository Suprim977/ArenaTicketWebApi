import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";

export type ApiSuccessResponse<T> = ApiEnvelope<T>;
export type ApiErrorResponse = ApiErrorBody;
export type ApiResponse<T> = AxiosResponse<ApiSuccessResponse<T>>;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token") ?? localStorage.getItem("token");
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
        localStorage.removeItem("user");
        Cookies.remove("token");
        Cookies.remove("user_role");
        if (window.location.pathname !== "/login") window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
