import { NextFunction, Request, Response } from "express";
import { sendPaginated, sendSuccess } from "../../utils/apihelper.util";
import { userService } from "../../services/user.service";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await userService.getAllUsers(page, limit);
    sendPaginated(res, "Users fetched successfully", result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess(res, "User created successfully", user, 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccess(res, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    sendSuccess(res, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
