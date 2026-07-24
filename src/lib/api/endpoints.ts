export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8089/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    whoami: "/users/profile",
    update: "/users/profile",
    password: "/users/change-password",
  },
  events: {
    list: "/events",
    byId: (id: string) => `/events/${id}`,
    categories: "/events",
    search: "/events",
  },
  bookings: {
    list: "/bookings/my-bookings",
    byRef: (bookingRef: string) => `/bookings/${bookingRef}`,
    create: "/bookings",
  },
  tickets: {
    list: "/tickets/my",
  },
  adminUsers: {
    list: "/admin/users",
    byId: (id: string) => `/admin/users/${id}`,
  },
  adminDashboard: "/admin/dashboard",
  adminBookings: {
    list: "/admin/bookings",
    byId: (id: string) => `/admin/bookings/${id}`,
  },
  adminPayments: {
    list: "/admin/payments",
  },
  adminTickets: { list: "/tickets" },
  profile: {
    get: "/users/profile",
    update: "/users/profile",
    photo: "/users/profile/photo",
  },
  payments: { initiate: "/payments/initiate" },
} as const;
