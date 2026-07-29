import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/\d/, "Password needs a number")
  .regex(/[^A-Za-z0-9]/, "Password needs a special character");

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const adminRegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80, "Full name is too long"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  password: strongPassword,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  adminRegistrationCode: z.string().trim().min(1, "Admin registration code is required"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type AdminLoginSchemaType = z.infer<typeof adminLoginSchema>;
export type AdminRegisterSchemaType = z.infer<typeof adminRegisterSchema>;
