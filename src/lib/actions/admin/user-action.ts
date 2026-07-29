import { axiosInstance } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { AuthRole } from "@/types/auth";

type ActionResult<T> = {
  ok: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminUser = {
  _id: string;
  email: string;
  role: AuthRole;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  gender?: string;
  profilePicture?: string | null;
  person?: {
    firstName?: string;
    lastName?: string;
  };
};

export type AdminUserPayload = {
  firstName: string;
  lastName: string;
  countryCode: "+977" | "+91" | "+1" | "+44";
  phoneNumber: string;
  gender: "male" | "female" | "other";
  email: string;
  password?: string;
  role: AuthRole;
};

const parseError = (error: unknown): string => {
  return getApiErrorMessage(error, "The user request could not be completed.");
};

export const getUsersAction = async (params: { page: number; limit: number }): Promise<ActionResult<AdminUser[]>> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.adminUsers.list, { params });
    return {
      ok: true,
      message: response.data?.message || "Users fetched",
      data: Array.isArray(response.data?.data) ? response.data.data : response.data?.data?.users || [],
      meta: response.data?.meta ?? {
        page: 1,
        limit: (response.data?.data?.users || []).length || params.limit,
        total: (response.data?.data?.users || []).length,
        totalPages: 1,
      },
    };
  } catch (error) {
    return { ok: false, message: parseError(error), data: [] };
  }
};

export const getUserByIdAction = async (id: string): Promise<ActionResult<AdminUser>> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.adminUsers.byId(id));
    return { ok: true, message: response.data?.message || "User fetched", data: response.data?.data?.user ?? response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const createUserAction = async (payload: AdminUserPayload): Promise<ActionResult<AdminUser>> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.adminUsers.list, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: payload.role,
      countryCode: payload.countryCode,
      phoneNumber: payload.phoneNumber.trim(),
      gender: payload.gender,
    });
    return { ok: true, message: response.data?.message || "User created", data: response.data?.data?.user ?? response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const updateUserAction = async (id: string, payload: AdminUserPayload): Promise<ActionResult<AdminUser>> => {
  try {
    const response = await axiosInstance.patch(API_ENDPOINTS.adminUsers.byId(id), {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      role: payload.role,
    });
    return { ok: true, message: response.data?.message || "User updated", data: response.data?.data?.user ?? response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const deleteUserAction = async (id: string): Promise<ActionResult<null>> => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.adminUsers.byId(id));
    return { ok: true, message: response.data?.message || "User deleted", data: null };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};
