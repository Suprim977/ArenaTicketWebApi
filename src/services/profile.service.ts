import axiosInstance from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { UpdateUserPayload, User } from "@/types/user";

type UserResponse = User | { user: User };

const unwrapUser = (payload: UserResponse | ApiEnvelope<UserResponse>): User => {
  const value = payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
  return "user" in value ? value.user : value;
};

export const profileService = {
  getProfile: async (): Promise<User> =>
    unwrapUser((await axiosInstance.get(API_ENDPOINTS.profile.get)).data),
  updateProfile: async (data: UpdateUserPayload): Promise<User> =>
    unwrapUser((await axiosInstance.patch(API_ENDPOINTS.profile.update, data)).data),
  uploadProfilePhoto: async (file: File, onProgress?: (percentage: number) => void): Promise<User> => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return unwrapUser((await axiosInstance.patch(API_ENDPOINTS.profile.photo, formData, {
      onUploadProgress: ({ loaded, total }) => {
        if (total) onProgress?.(Math.round((loaded * 100) / total));
      },
    })).data);
  },
  deleteProfilePhoto: async (): Promise<User> =>
    unwrapUser((await axiosInstance.delete(API_ENDPOINTS.profile.photo)).data),
};
