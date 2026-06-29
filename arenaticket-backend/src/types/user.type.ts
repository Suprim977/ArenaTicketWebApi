import { Request } from "express";

export type UserRole = "admin" | "user";

export interface IUser {
  _id?: string;
  email: string;
  role: UserRole;
  person: {
    _id?: string;
    firstName: string;
    lastName: string;
    arenaTag?: string;
    avatar?: string;
  };
}

export interface JwtUserPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}
