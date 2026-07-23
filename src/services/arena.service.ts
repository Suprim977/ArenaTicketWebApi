import { AxiosError } from "axios";
import { axiosInstance, type ApiResponse } from "@/lib/api/axios-instance";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ArenaEvent, ArenaResult, Booking, EventCategorySummary } from "@/types/arena";

const authorization = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const messageFor = (error: unknown) =>
  error instanceof AxiosError && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : "Request failed";

const request = async <T>(operation: () => Promise<ApiResponse<T>>): Promise<ArenaResult<T>> => {
  try {
    const response = await operation();
    return { ok: true, message: response.data.message ?? "Request completed", data: response.data.data };
  } catch (error) {
    return { ok: false, message: messageFor(error) };
  }
};

export const arenaService = {
  listEvents: (token?: string) => request<ArenaEvent[]>(() => axiosInstance.get(API_ENDPOINTS.events.list, { headers: authorization(token) })),
  getEventById: (eventId: string, token?: string) => request<ArenaEvent>(() => axiosInstance.get(API_ENDPOINTS.events.byId(eventId), { headers: authorization(token) })),
  listCategories: (token?: string) => request<EventCategorySummary[]>(() => axiosInstance.get(API_ENDPOINTS.events.categories, { headers: authorization(token) })),
  searchEvents: (query: string, category?: string, token?: string) => request<ArenaEvent[]>(() => axiosInstance.get(API_ENDPOINTS.events.search, { params: { query, category }, headers: authorization(token) })),
  listBookings: (token?: string) => request<Booking[]>(() => axiosInstance.get(API_ENDPOINTS.bookings.list, { headers: authorization(token) })),
  getBookingByRef: (bookingRef: string, token?: string) => request<Booking>(() => axiosInstance.get(API_ENDPOINTS.bookings.byRef(bookingRef), { headers: authorization(token) })),
  createBooking: (payload: Pick<Booking, "eventId" | "seatType" | "quantity" | "attendeeName" | "attendeeEmail">, token?: string) => request<Booking>(() => axiosInstance.post(API_ENDPOINTS.bookings.create, payload, { headers: authorization(token) })),
};
