import type { User, UserRole } from "./user";

export type AuthRole = UserRole;

export type AuthPerson = {
  firstName?: string;
  lastName?: string;
  arenaTag?: string;
  avatar?: string;
};

export type AuthUser = Partial<Omit<User, "role">> & {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
  person?: AuthPerson;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  gender: import("./user").Gender;
  confirmPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ActionResult<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
