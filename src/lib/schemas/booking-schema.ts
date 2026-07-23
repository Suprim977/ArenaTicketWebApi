import { z } from "zod";

export const bookingSchema = z.object({
  eventId: z.string().min(1, "Choose an event"),
  seatType: z.string().min(1, "Choose a seat type"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(10, "Quantity cannot exceed 10"),
  attendeeName: z.string().min(2, "Attendee name is required"),
  attendeeEmail: z.string().email("Valid email is required"),
});

export type BookingSchemaType = z.infer<typeof bookingSchema>;
