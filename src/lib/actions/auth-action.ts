"use server";

import { cookies } from "next/headers";
import { authService } from "@/services/auth.service";
import type { AuthPayload, ForgotPasswordPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from "@/types/auth";

const getAuthToken = (): string | undefined => cookies().get("token")?.value;

export const loginAction = async (payload: AuthPayload) => authService.login(payload);

export const registerAction = async (payload: RegisterPayload) => authService.register(payload);

export const forgotPasswordAction = async (payload: ForgotPasswordPayload) => authService.forgotPassword(payload);

export const resetPasswordAction = async (payload: ResetPasswordPayload) => authService.resetPassword(payload);

export const whoAmIAction = async () => authService.whoAmI(getAuthToken());

export const updateProfileAction = async (formData: FormData) => authService.updateProfile(formData, getAuthToken());

export const updatePasswordAction = async (payload: UpdatePasswordPayload) => authService.updatePassword(payload, getAuthToken());
