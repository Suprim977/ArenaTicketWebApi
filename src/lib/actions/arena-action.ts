"use server";

import { cookies } from "next/headers";
import { arenaService } from "@/services/arena.service";

const getAuthToken = async (): Promise<string | undefined> => (await cookies()).get("token")?.value;

export const getEventsAction = async () => arenaService.listEvents(await getAuthToken());
export const getEventByIdAction = async (eventId: string) => arenaService.getEventById(eventId, await getAuthToken());
export const getCategoriesAction = async () => arenaService.listCategories(await getAuthToken());
export const searchEventsAction = async (query: string, category?: string) => arenaService.searchEvents(query, category, await getAuthToken());
export const getBookingsAction = async () => arenaService.listBookings(await getAuthToken());
export const getBookingByRefAction = async (bookingRef: string) => arenaService.getBookingByRef(bookingRef, await getAuthToken());
