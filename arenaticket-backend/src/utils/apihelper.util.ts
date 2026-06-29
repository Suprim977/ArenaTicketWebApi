import { Response } from "express";

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T,
  meta: { page: number; limit: number; total: number; totalPages: number },
  statusCode = 200,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};
