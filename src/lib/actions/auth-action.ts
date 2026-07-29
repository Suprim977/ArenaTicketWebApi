'use server';

import { authService } from "@/services/auth.service";
import type { AuthPayload, RegisterPayload } from "@/types/auth";

export const handleRequestPasswordReset = async (email: string | { email: string }) => {
  try {
    const normalizedEmail = typeof email === 'string' ? email : email.email;
    const response = await authService.forgotPassword({ email: normalizedEmail });
    return { ok: true, success: true, message: response.message || 'Password reset email sent successfully' };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return { ok: false, success: false, message: apiError.response?.data?.message || 'Request password reset failed' };
  }
};

export const handleResetPassword = async (
  token: string | { token: string; password?: string; newPassword?: string; confirmPassword?: string },
  newPassword?: string
) => {
  try {
    const normalizedToken = typeof token === 'string' ? token : token.token;
    const password =
      typeof token === 'string'
        ? (newPassword ?? '')
        : (token.password ?? token.newPassword ?? '');
    const response = await authService.resetPassword({
      token: normalizedToken,
      password,
      confirmPassword: password,
    });
    return { ok: true, success: true, message: response.message || 'Password has been reset successfully' };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return { ok: false, success: false, message: apiError.response?.data?.message || 'Reset password failed' };
  }
};

export const forgotPasswordAction = handleRequestPasswordReset;
export const resetPasswordAction = handleResetPassword;

export const loginAction = async (payload: AuthPayload) => {
  const response = await authService.login(payload);
  return {
    ok: response.ok,
    message: response.message,
    data: response.data,
  };
};

export const registerAction = async (payload: RegisterPayload) => {
  const response = await authService.register(payload);
  return {
    ok: response.ok,
    message: response.message,
    data: response.data,
  };
};
