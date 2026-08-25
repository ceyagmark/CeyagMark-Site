import { NextResponse } from "next/server";

// One error envelope for the whole API (W9), decided before endpoint one.
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "SLOT_UNAVAILABLE"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  SLOT_UNAVAILABLE: 409,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_ERROR: 500,
};

export function apiError(code: ApiErrorCode, message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ error: { code, message, details } }, { status: STATUS_BY_CODE[code] });
}
