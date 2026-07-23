import { AxiosError } from "axios";
import { axiosInstance, type ApiResponse } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ActionResult, AuthPayload, AuthResponse, AuthUser, ForgotPasswordPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from "@/types/auth";

const authorization = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const messageFor = (error: unknown) => {
  if (!(error instanceof AxiosError)) return "Request failed";
  if (typeof error.response?.data?.message === "string") return error.response.data.message;
  if (error.response?.data?.errors) return Object.values(error.response.data.errors).flat().join(" ");
  if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") return "Cannot reach the ArenaTicket server. Please try again shortly.";
  return "Request failed";
};

const request = async <T>(operation: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> => {
  try {
    const response = await operation();
    return { ok: true, message: response.data.message ?? "Request completed", data: response.data.data };
  } catch (error) {
    return { ok: false, message: messageFor(error) };
  }
};

type BackendAuthResponse = {
  user: { _id: string; email: string; name: string; role: "USER" | "ADMIN" };
  tokens: { accessToken: string };
};

const normalizeAuthResponse = (data: BackendAuthResponse): AuthResponse => {
  const [firstName = "", ...lastName] = data.user.name.trim().split(/\s+/);
  return {
    token: data.tokens.accessToken,
    user: {
      _id: data.user._id,
      email: data.user.email,
      role: data.user.role.toLowerCase() as AuthUser["role"],
      person: { firstName, lastName: lastName.join(" ") },
    },
  };
};

const authRequest = async (operation: () => Promise<ApiResponse<BackendAuthResponse>>): Promise<ActionResult<AuthResponse>> => {
  const result = await request(operation);
  return result.data ? { ok: true, message: result.message, data: normalizeAuthResponse(result.data) } : { ok: false, message: result.message };
};

export const authService = {
  login: (payload: AuthPayload) => authRequest(() => axiosInstance.post(API_ENDPOINTS.auth.login, payload)),
  register: (payload: RegisterPayload) => authRequest(() => axiosInstance.post(API_ENDPOINTS.auth.register, {
    name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  })),
  forgotPassword: (payload: ForgotPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.forgotPassword, payload)),
  resetPassword: (payload: ResetPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.resetPassword, payload)),
  whoAmI: (token?: string) => request<AuthUser>(() => axiosInstance.get(API_ENDPOINTS.auth.whoami, { headers: authorization(token) })),
  updateProfile: (payload: FormData, token?: string) => request<AuthUser>(() => axiosInstance.patch(API_ENDPOINTS.auth.update, payload, { headers: authorization(token) })),
  updatePassword: (payload: UpdatePasswordPayload, token?: string) => request<null>(() => axiosInstance.patch(API_ENDPOINTS.auth.password, payload, { headers: authorization(token) })),
};
