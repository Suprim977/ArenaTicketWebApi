export type UserRole = "user" | "admin";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
  phoneNumber?: string;
  gender?: Gender;
  email: string;
  role: UserRole;
  profilePicture: string | null;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  balance?: number;
  totalTickets?: number;
  eventsAttended?: number;
}

export type UpdateUserPayload = Pick<User, "firstName" | "lastName">;
