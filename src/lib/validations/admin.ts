import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(128, "Password is too long."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const contactStatuses = [
  "PENDING",
  "DONE",
  "COMPLETED",
  "RESOLVED",
] as const;

export const contactStatusSchema = z.object({
  status: z.enum(contactStatuses),
});

export type ContactStatusValue = (typeof contactStatuses)[number];
