import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) return apiError("UNAUTHORIZED", "Sign in required.");
  try {
    const dataSource = await getDataSource();
    const leads = await dataSource.adminListLeads();
    return NextResponse.json({ leads });
  } catch {
    return apiError("INTERNAL_ERROR", "Could not load leads.");
  }
}
