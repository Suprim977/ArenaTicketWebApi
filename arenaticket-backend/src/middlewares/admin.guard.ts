import { NextFunction, Response } from "express";
import { HttpException } from "../exceptions/http-exception";
import { AuthenticatedRequest } from "../types/user.type";

export const adminGuard = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new HttpException(401, "Unauthorized access"));
  }

  if (req.user.role !== "admin") {
    return next(new HttpException(403, "Admin access required"));
  }

  next();
};
