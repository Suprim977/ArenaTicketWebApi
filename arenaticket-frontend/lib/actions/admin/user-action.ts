import { AxiosError } from "axios";
import { axiosInstance } from "../../api/axios-instance";
import { API_ENDPOINTS } from "../../api/endpoints";

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

const parseError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Request failed";
  }

  return "Unexpected error";
};

export const getUsersAction = async (params: { page: number; limit: number }): Promise<ActionResult<any[]>> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.adminUsers.list, { params });
    return {
      ok: true,
      message: response.data?.message || "Users fetched",
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  } catch (error) {
    return { ok: false, message: parseError(error), data: [] };
  }
};

export const getUserByIdAction = async (id: string): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.adminUsers.byId(id));
    return { ok: true, message: response.data?.message || "User fetched", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const createUserAction = async (payload: any): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.adminUsers.list, payload);
    return { ok: true, message: response.data?.message || "User created", data: response.data?.data };
  } catch (error) {
    return { ok: false, message: parseError(error) };
  }
};

export const updateUserAction = async (id: string, payload: any): Promise<ActionResult<any>> => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.adminUsers.byId(id), payload);
    return { ok: true, message: response.data?.message || "User updated", data: response.data?.data };
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
