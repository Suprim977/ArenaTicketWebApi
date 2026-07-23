export type AuthRole = "admin" | "user";

export type AuthPerson = {
  firstName?: string;
  lastName?: string;
  arenaTag?: string;
  avatar?: string;
};

export type AuthUser = {
  _id: string;
  email: string;
  role: AuthRole;
  person?: AuthPerson;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  firstName: string;
  lastName: string;
  arenaTag?: string;
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
