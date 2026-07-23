export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    whoami: "/auth/profile",
    update: "/auth/profile",
    password: "/auth/change-password",
  },
  events: {
    list: "/tournaments",
    byId: (id: string) => `/tournaments/${id}`,
    categories: "/tournaments",
    search: "/tournaments",
  },
  bookings: {
    list: "/tickets/my-tickets",
    byRef: (bookingRef: string) => `/tickets/${bookingRef}`,
    create: "/tickets",
  },
  tickets: {
    byBookingRef: (bookingRef: string) => `/tickets/${bookingRef}`,
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
} as const;
