import { Response } from 'express';

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export class ApiResponseHelper {
  static success<T>(res: Response, data: T, message: string = 'Success', status: number = 200): Response {
    return res.status(status).json({ status, success: true, message, data });
  }

  static error(res: Response, message: string = 'Error', status: number = 500): Response {
    return res.status(status).json({ status, success: false, message, data: null });
  }
}