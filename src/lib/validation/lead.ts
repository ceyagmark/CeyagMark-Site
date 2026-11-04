import { z } from "zod";

const fieldsSchema = z
  .record(z.string().max(64), z.string().max(2000))
  .refine((obj) => Object.keys(obj).length <= 20, "Too many fields.")
  .optional();

// villa_check is the only source where email is optional: villa owners reply
// on WhatsApp, so that source requires a WhatsApp number instead.
export const createLeadSchema = z
  .object({
    source: z.enum(["contact", "free_audit", "growth_audit", "built_by", "quiz", "villa_check"]),
    name: z.string().trim().min(1, "Tell us your name.").max(200),
    email: z
      .string()
      .trim()
      .max(320)
      .transform((v) => (v === "" ? undefined : v))
      .pipe(z.string().email("Enter a valid email address.").optional())
      .optional(),
    phone: z.string().trim().max(40).optional(),
    company: z.string().trim().max(200).optional(),
    fields: fieldsSchema,
  })
  .superRefine((lead, ctx) => {
    if (lead.source === "villa_check") {
      if (!lead.phone || !/^\+[1-9]\d{7,14}$/.test(lead.phone)) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter your WhatsApp number, e.g. +94701234567." });
      }
    } else if (!lead.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email address." });
    }
  });

export type CreateLeadParsed = z.infer<typeof createLeadSchema>;

export const quizSubmitSchema = z.object({
  quizSlug: z.string().min(1).max(100),
  answers: z.record(z.string().max(100), z.unknown()).refine((obj) => Object.keys(obj).length <= 60, "Too many answers."),
  complete: z.boolean(),
  source: z.record(z.string().max(40), z.string().max(200)).optional(),
});

export type QuizSubmitParsed = z.infer<typeof quizSubmitSchema>;
