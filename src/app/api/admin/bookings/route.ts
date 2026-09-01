import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) return apiError("UNAUTHORIZED", "Sign in required.");
  try {
    const dataSource = await getDataSource();
    const bookings = await dataSource.adminListBookings();
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET /api/admin/bookings:", err);
    return apiError("INTERNAL_ERROR", "Could not load bookings.");
  }
}
