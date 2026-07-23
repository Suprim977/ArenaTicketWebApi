export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    whoami: "/auth/whoami",
    update: "/auth/update",
    password: "/auth/password",
  },
  events: {
    list: "/events",
    byId: (id: string) => `/events/${id}`,
    categories: "/events/categories",
    search: "/events/search",
  },
  bookings: {
    list: "/bookings",
    byRef: (bookingRef: string) => `/bookings/${bookingRef}`,
    create: "/bookings",
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