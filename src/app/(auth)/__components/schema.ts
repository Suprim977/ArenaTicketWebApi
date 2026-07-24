import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must be at most 50 characters"),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must be at most 50 characters"),
    countryCode: z.enum(["+977", "+91", "+1", "+44"]),
    phoneNumber: z.string().trim().regex(/^\d+$/, "Phone number must contain digits only"),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().trim().toLowerCase().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password needs an uppercase letter")
      .regex(/[a-z]/, "Password needs a lowercase letter")
      .regex(/\d/, "Password needs a number")
      .regex(/[^A-Za-z0-9]/, "Password needs a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, context) => {
    if (data.countryCode === "+977" && data.phoneNumber.length !== 10) {
      context.addIssue({ code: "custom", path: ["phoneNumber"], message: "Nepal phone numbers must be exactly 10 digits" });
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/\d/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
