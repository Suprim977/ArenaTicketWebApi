import { AxiosError } from "axios";
import { axiosInstance } from "../api/axios-instance";
import { API_ENDPOINTS } from "../api/endpoints";

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  firstName: string;
  lastName: string;
  arenaTag?: string;
};

type ActionResult<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

const parseError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Request failed";
  }

  return "Unexpected error";
};

export const loginAction = async (payload: AuthPayload): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.login, payload);
    return { ok: true, message: response.data?.message || "Login successful", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const registerAction = async (payload: RegisterPayload): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.register, payload);
    return { ok: true, message: response.data?.message || "Register successful", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const whoAmIAction = async (): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.auth.whoami);
    return { ok: true, message: response.data?.message || "Fetched profile", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const updateProfileAction = async (formData: FormData): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.auth.update, formData);
    return { ok: true, message: response.data?.message || "Profile updated", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const updatePasswordAction = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.auth.password, payload);
    return { ok: true, message: response.data?.message || "Password updated", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};
