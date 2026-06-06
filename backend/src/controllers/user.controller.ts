import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import { ApiResponseHelper } from '../utils/apihelper.util';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, parsedData.error.errors[0].message, 400);
      }

      const user = await userService.createUser(parsedData.data);
      return ApiResponseHelper.success(res, user, 'User registered successfully', 201);
    } catch (error: any) {
      return ApiResponseHelper.error(res, error.message || 'Registration failed', error.status || 500);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, parsedData.error.errors[0].message, 400);
      }

      const { user, token } = await userService.loginUser(parsedData.data);
      return ApiResponseHelper.success(res, { user, token }, 'Login successful');
    } catch (error: any) {
      return ApiResponseHelper.error(res, error.message || 'Login failed', error.status || 500);
    }
  }
}