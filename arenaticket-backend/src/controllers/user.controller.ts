import { NextFunction, Response } from "express";
import { LoginDto, RegisterDto, UpdatePasswordDto, UpdateProfileDto } from "../dtos/user.dto";
import { AuthenticatedRequest } from "../types/user.type";
import { sendSuccess } from "../utils/apihelper.util";
import { userService } from "../services/user.service";

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.body as RegisterDto;
    const result = await userService.register(payload);
    sendSuccess(res, "User registered successfully", result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.body as LoginDto;
    const result = await userService.login(payload);
    sendSuccess(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const whoami = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.whoami(String(req.user?.userId));
    sendSuccess(res, "User profile fetched", user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.body as UpdateProfileDto;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const user = await userService.updateProfile(String(req.user?.userId), payload, avatar);
    sendSuccess(res, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = req.body as UpdatePasswordDto;
    await userService.updatePassword(String(req.user?.userId), payload);
    sendSuccess(res, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};
