import type { Event } from "./event";

export type TicketStatus = "valid" | "used" | "cancelled";

export interface Ticket {
  _id: string;
  id?: string;
  userId?: string;
  bookingId: string | { _id: string; bookingRef?: string; status?: string; totalAmount?: number; paymentMethod?: string };
  eventId: Event | string;
  ticketNumber: string;
  ticketTier: "normal" | "vip";
  section: string;
  quantity: number;
  qrToken: string;
  qrCodeData: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;
}
