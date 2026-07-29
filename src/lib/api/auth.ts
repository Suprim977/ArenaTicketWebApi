import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type RequestPasswordResetPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type ApiMessageResponse = {
  success: boolean;
  message: string;
};

export async function requestPasswordResetApi(payload: RequestPasswordResetPayload): Promise<ApiMessageResponse> {
  const response = await axiosInstance.post<ApiMessageResponse>(API_ENDPOINTS.auth.forgotPassword, payload);
  return response.data;
}

export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<ApiMessageResponse> {
  const response = await axiosInstance.post<ApiMessageResponse>(API_ENDPOINTS.auth.resetPassword, payload);
  return response.data;
}
