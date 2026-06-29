export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    whoami: "/auth/whoami",
    update: "/auth/update",
    password: "/auth/password",
  },
  adminUsers: {
    list: "/admin/users",
    byId: (id: string) => `/admin/users/${id}`,
  },
};
