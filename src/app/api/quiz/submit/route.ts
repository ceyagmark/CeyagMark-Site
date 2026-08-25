import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { quizSubmitSchema } from "@/lib/validation/lead";
import { isRateLimited, clientKey } from "@/lib/rate-limit";
import { sinkLead } from "@/lib/lead-sink";

export async function POST(request: Request) {
  if (isRateLimited(`quiz:${clientKey(request)}`, 10, 10 * 60 * 1000)) {
    return apiError("RATE_LIMITED", "Too many attempts. Try again in a few minutes.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request body.");
  }

  const parsed = quizSubmitSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return apiError("VALIDATION_ERROR", first?.message ?? "Invalid submission.", { issues: parsed.error.issues });
  }

  try {
    const dataSource = await getDataSource();
    const submission = await dataSource.createQuizSubmission(parsed.data);

    // A complete quiz submission also becomes a lead, per the Hub Phase E
    // shape (QuizSubmission -> Lead with quizSubmissionId set).
    if (parsed.data.complete) {
      const answers = parsed.data.answers as Record<string, unknown>;
      const name = typeof answers.name === "string" ? answers.name : "Quiz respondent";
      const email = typeof answers.email === "string" ? answers.email : "";
      if (email) {
        const lead = await dataSource.createLead({
          source: "quiz",
          name,
          email,
          quizSubmissionId: submission.id,
        });
        await sinkLead(dataSource, lead);
      }
    }

    return NextResponse.json({ submission });
  } catch {
    return apiError("INTERNAL_ERROR", "Could not save your quiz answers.");
  }
}
