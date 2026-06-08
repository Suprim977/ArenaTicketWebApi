import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponseHelper } from '../utils/apihelper.util';
import { RegisterDTO, LoginDTO } from '../dtos/user.dto';

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const parsedData = RegisterDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, parsedData.error.issues[0].message, 400);
      }

      const result = await UserService.register(parsedData.data);
      return ApiResponseHelper.success(res, result, 'User registered successfully', 201);
    } catch (error: any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsedData = LoginDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, parsedData.error.issues[0].message, 400);
      }

      const result = await UserService.login(parsedData.data);
      return ApiResponseHelper.success(res, result, 'Login successful', 200);
    } catch (error: any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }
}