import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";
import { AuthenticatedRequest, JwtUserPayload } from "../types/user.type";

export const authorized = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorized access"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (_error) {
    return next(new HttpException(401, "Invalid or expired token"));
  }
};
