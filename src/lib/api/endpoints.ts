export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    whoami: "/users/profile",
    update: "/users/profile",
    password: "/users/me/password",
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
    byBookingRef: (bookingRef: string) => `/bookings/${bookingRef}`,
  },
  adminUsers: {
    list: "/admin/users",
    byId: (id: string) => `/admin/users/${id}`,
  },
  adminEvents: {
    list: "/admin/events",
    byId: (id: string) => `/admin/events/${id}`,
  },
  adminBookings: {
    list: "/admin/bookings",
    byId: (id: string) => `/admin/bookings/${id}`,
  },
  adminPayments: {
    list: "/admin/payments",
  },
  profile: {
    get: "/users/profile",
    update: "/users/profile",
    photo: "/users/profile/photo",
  },
  payments: { initiate: "/payments/initiate" },
} as const;
