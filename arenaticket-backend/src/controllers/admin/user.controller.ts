import { Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { ApiResponseHelper } from '../../utils/apihelper.util';
import { RegisterDto, UpdateProfileDto } from '../../dtos/user.dto';

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    
    const result = await UserService.getAllUsers(page, limit, search);
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (error: any) {
    ApiResponseHelper.error(res, error.message, error.status || 500);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    ApiResponseHelper.success(res, user);
  } catch (error: any) {
    ApiResponseHelper.error(res, error.message, error.status || 500);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body as RegisterDto);
    ApiResponseHelper.created(res, user, 'User created successfully');
  } catch (error: any) {
    ApiResponseHelper.error(res, error.message, error.status || 500);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body as UpdateProfileDto);
    ApiResponseHelper.success(res, user, 'User updated successfully');
  } catch (error: any) {
    ApiResponseHelper.error(res, error.message, error.status || 500);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    ApiResponseHelper.error(res, error.message, error.status || 500);
  }
};