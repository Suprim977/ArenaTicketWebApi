export type EventCategory = "FPS" | "MOBA" | "Racing" | "Fighting" | "Sports" | "Festival" | string;
export type EventStatus = "upcoming" | "live" | "sold_out" | "cancelled" | string;

export interface TicketTier {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  capacity?: number;
  available?: number;
}

export interface Event {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  category: EventCategory;
  venue: string;
  stadium?: string;
  city?: string;
  date: string;
  startTime?: string;
  image?: string;
  status: EventStatus;
  priceFrom?: number;
  seatsLeft?: number;
  tiers?: TicketTier[];
  active?: boolean;
}

export interface EventFilters {
  search?: string;
  category?: string;
  date?: string;
}
