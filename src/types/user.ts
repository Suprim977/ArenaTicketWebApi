export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  balance?: number;
  totalTickets?: number;
  eventsAttended?: number;
}

export type UpdateUserPayload = Pick<User, "firstName" | "lastName" | "email">;
