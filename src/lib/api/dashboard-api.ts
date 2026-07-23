import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { Booking } from "@/types/booking";
import type { CreateBookingPayload } from "@/types/booking";
import type { Event, EventFilters } from "@/types/event";
import type { InitiatePaymentPayload, Payment } from "@/types/payment";
import type { UpdateUserPayload, User } from "@/types/user";

type ListPayload<T> = T[] | { data: T[]; events?: T[]; bookings?: T[] };
type UserPayload = User | { user: User };
type ItemPayload<T> = T | { event?: T; booking?: T; payment?: T };

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const unwrapList = <T>(payload: ListPayload<T> | ApiEnvelope<ListPayload<T>>): T[] => {
  const value = unwrap(payload);
  if (Array.isArray(value)) return value;
  return value.events ?? value.bookings ?? value.data ?? [];
};

const unwrapItem = <T>(payload: ItemPayload<T> | ApiEnvelope<ItemPayload<T>>): T => {
  const value = unwrap(payload);
  if (value && typeof value === "object") {
    if ("event" in value && value.event) return value.event;
    if ("booking" in value && value.booking) return value.booking;
    if ("payment" in value && value.payment) return value.payment;
  }
  return value as T;
};

const unwrapUser = (payload: UserPayload | ApiEnvelope<UserPayload>): User => {
  const value = unwrap<UserPayload>(payload);
  return "user" in value ? value.user : value;
};

type BackendEvent = Event & {
  location?: string;
  imageUrl?: string;
  time?: string;
};

const normalizeEvent = (event: BackendEvent): Event => {
  const eventTime = new Date(event.date).getTime();
  const lowestTierPrice = event.tiers?.length
    ? Math.min(...event.tiers.map((tier) => tier.price))
    : undefined;
  return {
    ...event,
    venue: event.venue || event.location || "Venue TBA",
    image: event.image || event.imageUrl,
    startTime: event.startTime || event.time,
    status: event.status || (Number.isNaN(eventTime) || eventTime >= Date.now() ? "upcoming" : "completed"),
    priceFrom: event.priceFrom ?? lowestTierPrice ?? 0,
    seatsLeft: event.seatsLeft ?? event.tiers?.reduce((total, tier) => total + (tier.available ?? 0), 0),
  };
};

export const dashboardApi = {
  getMe: async () => {
    return unwrapUser((await axiosInstance.get(API_ENDPOINTS.auth.whoami)).data);
  },
  getEvents: async (filters: EventFilters = {}) =>
    unwrapList<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.list, { params: filters })).data).map(normalizeEvent),
  getEvent: async (id: string) =>
    normalizeEvent(unwrapItem<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.byId(id))).data)),
  getConfirmedBookings: async () =>
    unwrapList<Booking>(
      (await axiosInstance.get(API_ENDPOINTS.bookings.list, { params: { status: "confirmed" } })).data,
    ),
  getBookings: async (status?: string) =>
    unwrapList<Booking>((await axiosInstance.get(API_ENDPOINTS.bookings.list, { params: { status } })).data),
  getBooking: async (bookingRef: string) =>
    unwrapItem<Booking>((await axiosInstance.get(API_ENDPOINTS.bookings.byRef(bookingRef))).data),
  createBooking: async (payload: CreateBookingPayload) =>
    unwrapItem<Booking>((await axiosInstance.post(API_ENDPOINTS.bookings.create, payload)).data),
  initiatePayment: async (payload: InitiatePaymentPayload) =>
    unwrapItem<Payment>((await axiosInstance.post(API_ENDPOINTS.payments.initiate, payload)).data),
  updateMe: async (payload: UpdateUserPayload) =>
    unwrapUser((await axiosInstance.put(API_ENDPOINTS.auth.update, payload)).data),
  updatePassword: async (payload: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put(API_ENDPOINTS.auth.password, payload),
  getAdminUsers: async () =>
    unwrapList<User>((await axiosInstance.get(API_ENDPOINTS.adminUsers.list)).data),
  getAdminEvents: async () =>
    unwrapList<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.adminEvents.list)).data).map(normalizeEvent),
  getAdminBookings: async () =>
    unwrapList<Booking>((await axiosInstance.get(API_ENDPOINTS.adminBookings.list)).data),
  deleteAdminUser: async (id: string) => axiosInstance.delete(API_ENDPOINTS.adminUsers.byId(id)),
  deleteAdminEvent: async (id: string) => axiosInstance.delete(API_ENDPOINTS.adminEvents.byId(id)),
};
