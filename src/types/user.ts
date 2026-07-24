export type UserRole = "user" | "admin";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type CountryCode = "+977" | "+91" | "+1" | "+44";

export interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  countryCode?: CountryCode;
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

export type UpdateUserPayload = Pick<
  User,
  "firstName" | "lastName" | "countryCode" | "phoneNumber" | "gender"
>;
