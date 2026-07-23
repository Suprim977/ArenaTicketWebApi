"use server";

import { cookies } from "next/headers";
import { authService } from "@/services/auth.service";
import type { ActionResult, AuthPayload, AuthResponse, ForgotPasswordPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from "@/types/auth";

const getAuthToken = async (): Promise<string | undefined> => (await cookies()).get("token")?.value;

const persistSession = async (result: ActionResult<AuthResponse>) => {
  if (!result.ok || !result.data?.token) return;

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
  cookieStore.set("token", result.data.token, options);
  cookieStore.set("user_role", result.data.user.role, { ...options, httpOnly: false });
};

export const loginAction = async (payload: AuthPayload): Promise<ActionResult<AuthResponse>> => {
  try {
    const result = await authService.login({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });
    await persistSession(result);
    return result;
  } catch (error) {
    console.error("[loginAction] Unexpected login error", error);
    return { ok: false, message: error instanceof Error ? error.message : "Unable to sign in right now. Please try again." };
  }
};

export const registerAction = async (payload: RegisterPayload) => {
  try {
    return await authService.register(payload);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unable to register right now. Please try again." };
  }
};

export const forgotPasswordAction = async (payload: ForgotPasswordPayload) => authService.forgotPassword(payload);

export const resetPasswordAction = async (payload: ResetPasswordPayload) => authService.resetPassword(payload);

export const whoAmIAction = async () => authService.whoAmI(await getAuthToken());

export const updateProfileAction = async (formData: FormData) => authService.updateProfile(formData, await getAuthToken());

export const updatePasswordAction = async (payload: UpdatePasswordPayload) => authService.updatePassword(payload, await getAuthToken());
