import type { Event } from "./event";
import type { User } from "./user";
import type { PaymentMethod, PaymentStatus } from "./payment";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export interface Booking {
  _id: string;
  id?: string;
  bookingRef: string;
  event?: Event;
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
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  qrCodeData?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  eventId: string;
  ticketTier: "Normal" | "VIP";
  section: string;
  quantity: number;
  paymentMethod: PaymentMethod;
}
