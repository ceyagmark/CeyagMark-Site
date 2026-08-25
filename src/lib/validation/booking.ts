import { z } from "zod";

// Single parsing site for booking input (W2/C7) — every caller imports this,
// no second ad-hoc check anywhere else in the codebase.
export const createBookingSchema = z.object({
  sessionTypeId: z.string().uuid(),
  startsAt: z.string().datetime({ offset: true }),
  name: z.string().trim().min(1, "Tell us your name.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000, "Keep notes under 2000 characters.").optional(),
  whatsappE164: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +94701234567.")
    .optional(),
});

export type CreateBookingParsed = z.infer<typeof createBookingSchema>;

export const availabilityQuerySchema = z.object({
  sessionTypeId: z.string().uuid(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
