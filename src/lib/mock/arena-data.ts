import type { ArenaEvent, Booking, DashboardMetric, EventCategorySummary } from "@/types/arena";

export const mockMetrics: DashboardMetric[] = [
  { label: "Events", value: "24", helper: "Live and upcoming" },
  { label: "Bookings", value: "1.2k", helper: "This month" },
  { label: "Users", value: "8.4k", helper: "Active accounts" },
  { label: "Payments", value: "98.7%", helper: "Success rate" },
];

export const mockCategories: EventCategorySummary[] = [
  { name: "FPS", label: "Shooter", description: "High energy tactical matches.", count: 12 },
  { name: "MOBA", label: "Strategy", description: "Team-based battle arena showdowns.", count: 8 },
  { name: "Racing", label: "Speed", description: "Fast lap competitions and time trials.", count: 5 },
  { name: "Fighting", label: "Duel", description: "1v1 bracket action and grand finals.", count: 6 },
  { name: "Sports", label: "Arena Sports", description: "Live stadium esports experiences.", count: 4 },
  { name: "Festival", label: "Live Show", description: "Community nights, finals, and celebrations.", count: 3 },
];

export const mockEvents: ArenaEvent[] = [
  {
    id: "evt-101",
    title: "Champions Clash Finals",
    category: "FPS",
    venue: "Arena One",
    city: "Lagos",
    date: "2026-08-08",
    time: "19:30",
    priceFrom: 18000,
    seatsLeft: 124,
    status: "live",
    description: "The season finale with the top four squads battling for the title.",
  },
  {
    id: "evt-102",
    title: "City Rivals Showdown",
    category: "MOBA",
    venue: "North Dome",
    city: "Abuja",
    date: "2026-08-14",
    time: "17:00",
    priceFrom: 12000,
    seatsLeft: 210,
    status: "upcoming",
    description: "Regional teams meet for a best-of-three showdown.",
  },
  {
    id: "evt-103",
    title: "Night Sprint Cup",
    category: "Racing",
    venue: "Velocity Hall",
    city: "Port Harcourt",
    date: "2026-08-21",
    time: "20:00",
    priceFrom: 15000,
    seatsLeft: 76,
    status: "upcoming",
    description: "A late-night racing exhibition with live commentary and premium seats.",
  },
  {
    id: "evt-104",
    title: "Street Kings Invitational",
    category: "Fighting",
    venue: "The Grid",
    city: "Lagos",
    date: "2026-08-24",
    time: "18:00",
    priceFrom: 10000,
    seatsLeft: 31,
    status: "sold out",
    description: "A compact invitational for fans of rapid bracket action.",
  },
];

export const mockBookings: Booking[] = [
  {
    bookingRef: "AT-20260808-001",
    eventId: "evt-101",
    eventTitle: "Champions Clash Finals",
    seatType: "VIP Front Row",
    quantity: 2,
    totalPrice: 36000,
    attendeeName: "Jordan Fan",
    attendeeEmail: "fan@arenaticket.com",
    status: "confirmed",
    createdAt: "2026-07-12T09:00:00.000Z",
  },
  {
    bookingRef: "AT-20260814-014",
    eventId: "evt-102",
    eventTitle: "City Rivals Showdown",
    seatType: "General",
    quantity: 1,
    totalPrice: 12000,
    attendeeName: "Amina Play",
    attendeeEmail: "amina@example.com",
    status: "pending",
    createdAt: "2026-07-12T13:20:00.000Z",
  },
];
