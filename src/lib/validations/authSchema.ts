import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be 50 characters or less."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
