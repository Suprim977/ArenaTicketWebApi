'use server';

import { requestPasswordResetApi, resetPasswordApi } from "@/lib/api/auth";

export type ActionResult = {
  ok: boolean;
  message: string;
};

export async function requestPasswordResetAction(email: string): Promise<ActionResult> {
  try {
    const response = await requestPasswordResetApi({ email });
    return { ok: response.success, message: response.message };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      ok: false,
      message: apiError.response?.data?.message ?? 'Unable to request a password reset right now.',
    };
  }
}

export async function resetPasswordAction(token: string, newPassword: string): Promise<ActionResult> {
  try {
    const response = await resetPasswordApi({ token, newPassword });
    return { ok: response.success, message: response.message };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return {
      ok: false,
      message: apiError.response?.data?.message ?? 'Unable to reset your password right now.',
    };
  }
}
