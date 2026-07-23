"use server";

import { cookies } from "next/headers";
import { arenaService } from "@/services/arena.service";

const getAuthToken = (): string | undefined => cookies().get("token")?.value;

export const getEventsAction = async () => arenaService.listEvents(getAuthToken());
export const getEventByIdAction = async (eventId: string) => arenaService.getEventById(eventId, getAuthToken());
export const getCategoriesAction = async () => arenaService.listCategories(getAuthToken());
export const searchEventsAction = async (query: string, category?: string) => arenaService.searchEvents(query, category, getAuthToken());
export const getBookingsAction = async () => arenaService.listBookings(getAuthToken());
export const getBookingByRefAction = async (bookingRef: string) => arenaService.getBookingByRef(bookingRef, getAuthToken());
export const createBookingAction = async (payload: {
  eventId: string;
  seatType: string;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
}) => arenaService.createBooking(payload, getAuthToken());
