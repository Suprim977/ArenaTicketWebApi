import axiosInstance from "./axios-instance";
import { API_ENDPOINTS } from "./endpoints";
import type { ApiEnvelope } from "@/types/api";
import type { Booking } from "@/types/booking";
import type { CreateBookingPayload } from "@/types/booking";
import type { Event, EventFilters } from "@/types/event";
import type { InitiatePaymentPayload, InitiatePaymentResult, Payment } from "@/types/payment";
import type { Ticket } from "@/types/ticket";
import type { User } from "@/types/user";
import { profileService } from "@/services/profile.service";
import { normalizeMediaPath } from "@/lib/media-url";

type ListPayload<T> = T[] | { data?: T[]; events?: T[]; bookings?: T[]; tickets?: T[]; users?: T[]; payments?: T[] };
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
  return value.events ?? value.bookings ?? value.tickets ?? value.users ?? value.payments ?? value.data ?? [];
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

type BackendEvent = Event & {
  location?: string;
  imageUrl?: string;
  time?: string;
};
type BackendBooking = Booking & {
  eventId?: BackendEvent | string;
  userId?: User | string;
};

export type AdminEventPayload = {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  prizePool: number;
  format: string;
  normalPrice: number;
  vipPrice: number;
  normalCapacity: number;
  vipCapacity: number;
  availability: boolean;
};

const eventFormData = (payload: AdminEventPayload, eventImage?: File): FormData => {
  const formData = new FormData();
  const tiers = [
    { name: "Standard", price: payload.normalPrice, capacity: payload.normalCapacity, available: payload.normalCapacity },
    { name: "VIP", price: payload.vipPrice, capacity: payload.vipCapacity, available: payload.vipCapacity },
  ];

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("description", payload.description);
  formData.append("category", payload.category);
  formData.append("date", new Date(`${payload.date}T${payload.time}`).toISOString());
  formData.append("time", payload.time);
  formData.append("location", payload.location);
  formData.append("status", "published");
  formData.append("availability", String(payload.availability));
  formData.append("ticketPrices", JSON.stringify({ normal: payload.normalPrice, vip: payload.vipPrice }));
  formData.append("prizePool", String(payload.prizePool));
  formData.append("format", payload.format);
  formData.append("tiers", JSON.stringify(tiers));
  formData.append("relatedEvents", JSON.stringify([]));
  if (eventImage) formData.append("eventImage", eventImage);

  return formData;
};

const normalizeEvent = (event: BackendEvent): Event => {
  const eventTime = new Date(event.date).getTime();
  const lowestTierPrice = event.tiers?.length
    ? Math.min(...event.tiers.map((tier) => tier.price))
    : undefined;
  return {
    ...event,
    venue: event.venue || event.location || "Venue TBA",
    imageUrl: normalizeMediaPath(event.imageUrl) ?? undefined,
    startTime: event.startTime || event.time || (event.date ? new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined),
    status: event.status || (Number.isNaN(eventTime) || eventTime >= Date.now() ? "upcoming" : "completed"),
    priceFrom: event.priceFrom ?? event.ticketPrices?.normal ?? lowestTierPrice ?? 0,
    seatsLeft: event.seatsLeft ?? event.tiers?.reduce((total, tier) => total + (tier.available ?? 0), 0),
  };
};

const normalizeBooking = (booking: BackendBooking): Booking => ({
  ...booking,
  event: booking.event ?? (booking.eventId && typeof booking.eventId === "object" ? normalizeEvent(booking.eventId) : undefined),
  user: booking.user ?? (booking.userId && typeof booking.userId === "object" ? booking.userId : undefined),
});

export const dashboardApi = {
  getMe: profileService.getProfile,
  getEvents: async (filters: EventFilters = {}) =>
    unwrapList<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.list, { params: { limit: 100, ...filters } })).data).map(normalizeEvent),
  getEvent: async (id: string) =>
    normalizeEvent(unwrapItem<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.byId(id))).data)),
  getConfirmedBookings: async () =>
    unwrapList<BackendBooking>(
      (await axiosInstance.get(API_ENDPOINTS.bookings.list, { params: { status: "confirmed" } })).data,
    ).map(normalizeBooking),
  getBookings: async (status?: string) =>
    unwrapList<BackendBooking>((await axiosInstance.get(API_ENDPOINTS.bookings.list, { params: { status } })).data).map(normalizeBooking),
  getTickets: async () =>
    unwrapList<Ticket>((await axiosInstance.get(API_ENDPOINTS.tickets.list)).data),
  getBooking: async (bookingRef: string) =>
    normalizeBooking(unwrapItem<BackendBooking>((await axiosInstance.get(API_ENDPOINTS.bookings.byRef(bookingRef))).data)),
  createBooking: async (payload: CreateBookingPayload) =>
    normalizeBooking(unwrapItem<BackendBooking>((await axiosInstance.post(API_ENDPOINTS.bookings.create, payload)).data)),
  initiatePayment: async (payload: InitiatePaymentPayload) =>
    unwrap<InitiatePaymentResult>((await axiosInstance.post(API_ENDPOINTS.payments.initiate, payload)).data),
  updateMe: profileService.updateProfile,
  updatePassword: async (payload: { currentPassword: string; newPassword: string }) =>
    axiosInstance.patch(API_ENDPOINTS.auth.password, payload),
  getAdminDashboard: async () =>
    unwrap<{ totalUsers: number; totalEvents: number; totalBookings: number; ticketsSold: number; totalRevenue: number }>(
      (await axiosInstance.get(API_ENDPOINTS.adminDashboard)).data,
    ),
  getAdminUsers: async () =>
    unwrapList<User>((await axiosInstance.get(API_ENDPOINTS.adminUsers.list)).data),
  getAdminEvents: async () =>
    unwrapList<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.list, { params: { limit: 100 } })).data).map(normalizeEvent),
  getAdminEvent: async (id: string) =>
    normalizeEvent(unwrapItem<BackendEvent>((await axiosInstance.get(API_ENDPOINTS.events.byId(id))).data)),
  createAdminEvent: async (payload: AdminEventPayload, eventImage?: File) => {
    if (!eventImage) throw new Error("Event image is required.");
    return normalizeEvent(unwrapItem<BackendEvent>((await axiosInstance.post(
      API_ENDPOINTS.events.list,
      eventFormData(payload, eventImage),
    )).data));
  },
  updateAdminEvent: async (id: string, payload: AdminEventPayload, eventImage?: File) =>
    normalizeEvent(unwrapItem<BackendEvent>((await axiosInstance.patch(
      API_ENDPOINTS.events.byId(id),
      eventFormData(payload, eventImage),
    )).data)),
  getAdminBookings: async () =>
    unwrapList<BackendBooking>((await axiosInstance.get(API_ENDPOINTS.adminBookings.list)).data).map(normalizeBooking),
  getAdminPayments: async () =>
    unwrapList<Payment>((await axiosInstance.get(API_ENDPOINTS.adminPayments.list)).data),
  getAdminTickets: async () =>
    unwrapList<Ticket>((await axiosInstance.get(API_ENDPOINTS.adminTickets.list)).data),
  deleteAdminUser: async (id: string) => axiosInstance.delete(API_ENDPOINTS.adminUsers.byId(id)),
  deleteAdminEvent: async (id: string) => axiosInstance.delete(API_ENDPOINTS.events.byId(id)),
};
