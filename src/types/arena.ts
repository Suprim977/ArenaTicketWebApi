import type { ActionResult } from "./auth";

export type EventCategory = "FPS" | "MOBA" | "Racing" | "Fighting" | "Sports" | "Festival";

export type EventStatus = "upcoming" | "live" | "sold out";

export type ArenaEvent = {
  id: string;
  title: string;
  category: EventCategory;
  venue: string;
  city: string;
  date: string;
  time: string;
  priceFrom: number;
  seatsLeft: number;
  status: EventStatus;
  description: string;
  image?: string;
};

export type Booking = {
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  seatType: string;
  quantity: number;
  totalPrice: number;
  attendeeName: string;
  attendeeEmail: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
};

export type EventCategorySummary = {
  name: EventCategory;
  label: string;
  description: string;
  count: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type ArenaResult<T> = ActionResult<T>;
