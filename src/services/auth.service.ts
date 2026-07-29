import { axiosInstance, type ApiResponse } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { ActionResult, AdminLoginRequest, AdminRegisterRequest, AuthPayload, AuthResponse, AuthUser, AuthenticatedUser, ForgotPasswordPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from "@/types/auth";

const authorization = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const request = async <T>(operation: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> => {
  try {
    const response = await operation();
    return { ok: true, message: response.data.message ?? "Request completed", data: response.data.data };
  } catch (error) {
    return { ok: false, message: getApiErrorMessage(error, "Request failed") };
  }
};

type BackendAuthResponse = {
  user: {
    _id: string; email: string; name: string; role: "user" | "admin";
    firstName: string; lastName: string; countryCode?: import("@/types/user").CountryCode;
    phoneNumber?: string; gender?: import("@/types/user").Gender; profilePicture?: string | null;
    balance?: number; ticketsCount?: number; eventsAttended?: number;
  };
  token?: string;
  tokens: { accessToken: string };
};

const normalizeAuthResponse = (data: BackendAuthResponse): AuthResponse => {
  const [nameFirst = "", ...nameLast] = data.user.name.trim().split(/\s+/);
  return {
    token: data.token ?? data.tokens.accessToken,
    user: {
      _id: data.user._id,
      email: data.user.email,
      role: data.user.role,
      firstName: data.user.firstName ?? nameFirst,
      lastName: data.user.lastName ?? nameLast.join(" "),
      countryCode: data.user.countryCode,
      phoneNumber: data.user.phoneNumber,
      gender: data.user.gender,
      profilePicture: data.user.profilePicture ?? null,
      balance: data.user.balance,
      totalTickets: data.user.ticketsCount,
      eventsAttended: data.user.eventsAttended,
      person: { firstName: data.user.firstName ?? nameFirst, lastName: data.user.lastName ?? nameLast.join(" ") },
    },
  };
};

const authRequest = async (operation: () => Promise<ApiResponse<BackendAuthResponse>>): Promise<ActionResult<AuthResponse>> => {
  const result = await request(operation);
  return result.data ? { ok: true, message: result.message, data: normalizeAuthResponse(result.data) } : { ok: false, message: result.message };
};

type AdminAuthResponse = {
  user: AuthenticatedUser | { id: string; fullName: string; email: string; role: "user" | "admin" };
  token?: string;
};

const normalizeAdminUser = (user: AdminAuthResponse["user"]): AuthenticatedUser => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

const adminAuthRequest = async (operation: () => Promise<ApiResponse<AdminAuthResponse>>): Promise<ActionResult<{ token?: string; user: AuthenticatedUser }>> => {
  const result = await request(operation);
  if (!result.data) return { ok: false, message: result.message };
  return {
    ok: true,
    message: result.message,
    data: {
      token: result.data.token,
      user: normalizeAdminUser(result.data.user),
    },
  };
};

export const authService = {
  login: (payload: AuthPayload) => authRequest(() => axiosInstance.post(API_ENDPOINTS.auth.login, payload)),
  loginAdmin: (payload: AdminLoginRequest) => adminAuthRequest(() => axiosInstance.post(API_ENDPOINTS.auth.adminLogin, payload, { withCredentials: true })),
  registerAdmin: (payload: AdminRegisterRequest) => adminAuthRequest(() => axiosInstance.post(API_ENDPOINTS.auth.adminRegister, payload, { withCredentials: true })),
  register: (payload: RegisterPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.register, {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    countryCode: payload.countryCode,
    phoneNumber: payload.phoneNumber.replace(/\s/g, ""),
    gender: payload.gender,
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  })),
  forgotPassword: (payload: ForgotPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.forgotPassword, payload)),
  resetPassword: (payload: ResetPasswordPayload) => request<null>(() => axiosInstance.post(API_ENDPOINTS.auth.resetPassword, payload)),
  whoAmI: (token?: string) => request<AuthUser>(() => axiosInstance.get(API_ENDPOINTS.auth.whoami, { headers: authorization(token) })),
  getCurrentUser: (token?: string) => request<AuthUser>(() => axiosInstance.get(API_ENDPOINTS.auth.whoami, { headers: authorization(token) })),
  logout: () => request<null>(() => axiosInstance.post("/auth/logout")),
  updateProfile: (payload: FormData, token?: string) => request<AuthUser>(() => axiosInstance.patch(API_ENDPOINTS.auth.update, payload, { headers: authorization(token) })),
  updatePassword: (payload: UpdatePasswordPayload, token?: string) => request<null>(() => axiosInstance.patch(API_ENDPOINTS.auth.password, payload, { headers: authorization(token) })),
};
