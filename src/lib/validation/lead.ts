import { z } from "zod";

const fieldsSchema = z
  .record(z.string().max(64), z.string().max(2000))
  .refine((obj) => Object.keys(obj).length <= 20, "Too many fields.")
  .optional();

export const createLeadSchema = z.object({
  source: z.enum(["contact", "free_audit", "growth_audit", "built_by", "quiz"]),
  name: z.string().trim().min(1, "Tell us your name.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  fields: fieldsSchema,
});

export type CreateLeadParsed = z.infer<typeof createLeadSchema>;

export const quizSubmitSchema = z.object({
  quizSlug: z.string().min(1).max(100),
  answers: z.record(z.string().max(100), z.unknown()).refine((obj) => Object.keys(obj).length <= 60, "Too many answers."),
  complete: z.boolean(),
  source: z.record(z.string().max(40), z.string().max(200)).optional(),
});

export type QuizSubmitParsed = z.infer<typeof quizSubmitSchema>;
