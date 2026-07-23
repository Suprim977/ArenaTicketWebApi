import type { Event } from "./event";
import type { User } from "./user";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export interface Booking {
  _id: string;
  id?: string;
  bookingRef: string;
  event: Event;
  user?: User;
  tier?: string;
  section?: string;
  seats?: string[];
  quantity: number;
  subtotal: number;
  bookingFee: number;
  tax: number;
  totalAmount: number;
  status: BookingStatus;
  attendeeName?: string;
  attendeeEmail?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  eventId: string;
  tier: string;
  section?: string;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
}
