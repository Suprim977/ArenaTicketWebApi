import { AxiosError } from "axios";
import { axiosInstance, type ApiResponse } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ActionResult, AuthPayload, AuthResponse, AuthUser, ForgotPasswordPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from "@/types/auth";

const authorization = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const messageFor = (error: unknown) =>
  error instanceof AxiosError && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : "Request failed";

const request = async <T>(operation: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> => {
  try {
    const response = await operation();
    return { ok: true, message: response.data.message ?? "Request completed", data: response.data.data };
  } catch (error) {
    return { ok: false, message: messageFor(error) };
  }
};

export const authService = {
  login: (payload: AuthPayload) => request<AuthResponse>(() => axiosInstance.post(API_ENDPOINTS.auth.login, payload)),
  register: (payload: RegisterPayload) => request<AuthResponse>(() => axiosInstance.post(API_ENDPOINTS.auth.register, payload)),
  forgotPassword: (payload: ForgotPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.forgotPassword, payload)),
  resetPassword: (payload: ResetPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.resetPassword, payload)),
  whoAmI: (token?: string) => request<AuthUser>(() => axiosInstance.get(API_ENDPOINTS.auth.whoami, { headers: authorization(token) })),
  updateProfile: (payload: FormData, token?: string) => request<AuthUser>(() => axiosInstance.put(API_ENDPOINTS.auth.update, payload, { headers: authorization(token) })),
  updatePassword: (payload: UpdatePasswordPayload, token?: string) => request<null>(() => axiosInstance.put(API_ENDPOINTS.auth.password, payload, { headers: authorization(token) })),
};
