import { axiosInstance, type ApiResponse } from "@/lib/api/axios-instance";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ArenaEvent, ArenaResult, Booking, EventCategorySummary } from "@/types/arena";

const authorization = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : undefined);

const request = async <T>(operation: () => Promise<ApiResponse<T>>): Promise<ArenaResult<T>> => {
  try {
    const response = await operation();
    return { ok: true, message: response.data.message ?? "Request completed", data: response.data.data };
  } catch (error) {
    return { ok: false, message: getApiErrorMessage(error, "The request could not be completed.") };
  }
};

type BackendTournament = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  imageUrl?: string;
  status?: string;
  tiers?: { name: string; price: number; available?: number }[];
  ticketPrices?: { normal: number; vip: number };
};

type TournamentList =
  | BackendTournament[]
  | {
      data?: BackendTournament[];
      events?: BackendTournament[];
      tournaments?: BackendTournament[];
    };
const toArenaEvent = (tournament: BackendTournament): ArenaEvent => {
  const date = new Date(tournament.date);
  return {
    id: tournament._id,
    title: tournament.title,
    category: (tournament.category ?? "Festival") as ArenaEvent["category"],
    venue: tournament.location,
    city: tournament.location,
    date: Number.isNaN(date.valueOf()) ? tournament.date : date.toISOString().slice(0, 10),
    time: Number.isNaN(date.valueOf()) ? "TBA" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    priceFrom: tournament.ticketPrices?.normal ?? Math.min(...(tournament.tiers?.map((tier) => tier.price) ?? [600])),
    seatsLeft: tournament.tiers?.reduce((sum, tier) => sum + (tier.available ?? 0), 0) ?? 0,
    status: tournament.status === "sold_out" ? "sold out" : "upcoming",
    description: tournament.description,
    image: tournament.imageUrl,
  };
};

const listTournaments = async (token?: string): Promise<ArenaResult<ArenaEvent[]>> => {
  const result = await request<TournamentList>(() => axiosInstance.get(API_ENDPOINTS.events.list, { headers: authorization(token) }));
  if (!result.data) return { ok: false, message: result.message };
  const tournaments = Array.isArray(result.data)
    ? result.data
    : result.data.data ?? result.data.events ?? result.data.tournaments ?? [];
  return { ok: true, message: result.message, data: tournaments.map(toArenaEvent) };
};

export const arenaService = {
  listEvents: listTournaments,
  getEventById: async (eventId: string, token?: string) => {
    const result = await listTournaments(token);
    const event = result.data?.find((item) => item.id === eventId);
    return event ? { ok: true, message: "Tournament retrieved successfully", data: event } : { ok: false, message: "Tournament not found" };
  },
  listCategories: async (token?: string) => {
    const result = await listTournaments(token);
    if (!result.data) return { ok: false, message: result.message };
    const categories: EventCategorySummary[] = [{ name: "Festival", label: "Tournaments", description: "Live tournaments from the ArenaTicket API.", count: result.data.length }];
    return { ok: true, message: result.message, data: categories };
  },
  searchEvents: async (query: string, _category?: string, token?: string) => {
    const result = await listTournaments(token);
    if (!result.data) return result;
    const normalizedQuery = query.trim().toLowerCase();
    return { ...result, data: result.data.filter((event) => !normalizedQuery || [event.title, event.description, event.venue].join(" ").toLowerCase().includes(normalizedQuery)) };
  },
  listBookings: (token?: string) => request<Booking[]>(() => axiosInstance.get(API_ENDPOINTS.bookings.list, { headers: authorization(token) })),
  getBookingByRef: (bookingRef: string, token?: string) => request<Booking>(() => axiosInstance.get(API_ENDPOINTS.bookings.byRef(bookingRef), { headers: authorization(token) })),
};
