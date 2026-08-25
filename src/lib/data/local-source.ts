import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type {
  BookingRecord,
  CreateBookingInput,
  CreateBookingResult,
  CreateLeadInput,
  DataSource,
  DaySlots,
  Lead,
  LeadSinkLogEntry,
  NotificationLogEntry,
  QuizSubmissionInput,
  QuizSubmissionResult,
  SessionType,
} from "./types";
import { generateConfirmationCode, generateManageToken } from "./tokens";

// PGlite is dev/test only — see ADR-001 #4. Required dynamically so a
// production bundle never needs the package resolvable (it is a
// devDependency; PPI's BUILD-NOTES flags the same external-module stub issue
// if this import is reachable from a production build path, which it is not:
// getDataSource() in index.ts only imports this file when CEYAG_DEV_DB=1).
type PGliteInstance = {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<{ rows: T[] }>;
  exec: (sql: string) => Promise<unknown>;
};

declare global {
  var __ceyagmarkPglite: PGliteInstance | undefined;
}

async function getDb(): Promise<PGliteInstance> {
  if (globalThis.__ceyagmarkPglite) return globalThis.__ceyagmarkPglite;

  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite() as unknown as PGliteInstance;

  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    await db.exec(sql);
  }
  const seed = readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf-8");
  await db.exec(seed);

  globalThis.__ceyagmarkPglite = db;
  return db;
}

// PGlite trap PPI already paid for (BUILD-NOTES Slice 4): `date`/`time`
// columns come back as JS Date objects here, while Supabase's PostgREST
// returns plain strings for the same columns. Both shapes are normalised so
// callers never see the difference.
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const str = String(value);
  return /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10) : new Date(str).toISOString().slice(0, 10);
}

function normalizeTime(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(11, 16);
  const str = String(value);
  return /^\d{2}:\d{2}/.test(str) ? str.slice(0, 5) : str;
}

function toSessionType(row: Record<string, unknown>): SessionType {
  return {
    id: row.id as string,
    slug: row.slug as string,
    kind: row.kind as "consulting" | "discovery",
    name: row.name as string,
    durationMinutes: Number(row.duration_minutes),
    priceLkr: Number(row.price_lkr),
    priceUsdCents: Number(row.price_usd_cents),
    bufferMinutes: Number(row.buffer_minutes),
  };
}

function toBookingRecord(row: Record<string, unknown>): BookingRecord {
  return {
    id: row.id as string,
    confirmationCode: row.confirmation_code as string,
    sessionTypeName: row.session_type_name as string,
    startsAt: new Date(row.starts_at as string).toISOString(),
    endsAt: new Date(row.ends_at as string).toISOString(),
    status: row.status as BookingRecord["status"],
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: (row.customer_phone as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

export const localSource: DataSource = {
  async getActiveSessionTypes() {
    const db = await getDb();
    const { rows } = await db.query(
      "select * from session_types where active = true order by kind, duration_minutes"
    );
    return rows.map(toSessionType);
  },

  async getAvailability(sessionTypeId, fromDate, toDate) {
    const db = await getDb();
    const { rows } = await db.query<{ slot_date: unknown; slot_time: unknown }>(
      "select slot_date, slot_time from get_availability($1, $2, $3)",
      [sessionTypeId, fromDate, toDate]
    );
    const byDate = new Map<string, string[]>();
    for (const row of rows) {
      const date = normalizeDate(row.slot_date);
      const time = normalizeTime(row.slot_time);
      const existing = byDate.get(date);
      if (existing) existing.push(time);
      else byDate.set(date, [time]);
    }
    const result: DaySlots[] = [];
    for (const [date, times] of byDate) result.push({ date, times });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  },

  async createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
    const db = await getDb();
    const confirmationCode = generateConfirmationCode();
    const manageToken = generateManageToken();
    const { rows } = await db.query<{ create_booking: Record<string, unknown> }>(
      "select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as create_booking",
      [
        input.sessionTypeId,
        input.startsAt,
        confirmationCode,
        manageToken,
        input.email,
        input.name,
        input.phone ?? null,
        input.notes ?? null,
        input.whatsappE164 ?? null,
      ]
    );
    const result = rows[0]?.create_booking;
    if (!result) return { ok: false, errorCode: "INTERNAL_ERROR", message: "Booking failed." };
    if (result.ok === false) {
      const errorCode = result.error_code as "VALIDATION_ERROR" | "SLOT_UNAVAILABLE" | "INTERNAL_ERROR";
      return { ok: false, errorCode, message: result.message as string };
    }
    return {
      ok: true,
      confirmationCode: result.confirmation_code as string,
      manageToken: result.manage_token as string,
      startsAt: new Date(result.starts_at as string).toISOString(),
      endsAt: new Date(result.ends_at as string).toISOString(),
      sessionTypeName: result.session_type_name as string,
      customerEmail: result.customer_email as string,
      customerName: result.customer_name as string,
      ownerAlertEmail: result.owner_alert_email as string,
    };
  },

  async cancelBooking(manageToken) {
    const db = await getDb();
    const { rows } = await db.query<{ cancel_booking: Record<string, unknown> }>(
      "select cancel_booking($1) as cancel_booking",
      [manageToken]
    );
    const result = rows[0]?.cancel_booking;
    if (!result || result.ok === false) return { ok: false, errorCode: "NOT_FOUND" };
    return { ok: true };
  },

  async getBookingByToken(manageToken) {
    const db = await getDb();
    const { rows } = await db.query(
      `select b.*, st.name as session_type_name, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
       from bookings b
       join session_types st on st.id = b.session_type_id
       join customers c on c.id = b.customer_id
       where b.manage_token = $1`,
      [manageToken]
    );
    const row = rows[0];
    return row ? toBookingRecord(row as Record<string, unknown>) : null;
  },

  async createLead(input: CreateLeadInput): Promise<Lead> {
    const db = await getDb();
    const { rows } = await db.query(
      `insert into leads (source, name, email, phone, company, fields, quiz_submission_id)
       values ($1,$2,$3,$4,$5,$6,$7)
       returning *`,
      [
        input.source,
        input.name,
        input.email,
        input.phone ?? null,
        input.company ?? null,
        JSON.stringify(input.fields ?? {}),
        input.quizSubmissionId ?? null,
      ]
    );
    const row = rows[0] as Record<string, unknown>;
    return {
      id: row.id as string,
      source: row.source as Lead["source"],
      stage: row.stage as string,
      name: row.name as string,
      email: row.email as string,
      phone: (row.phone as string | null) ?? null,
      company: (row.company as string | null) ?? null,
      fields: (row.fields as Record<string, string>) ?? {},
      createdAt: new Date(row.created_at as string).toISOString(),
    };
  },

  async createQuizSubmission(input: QuizSubmissionInput): Promise<QuizSubmissionResult> {
    const db = await getDb();
    const { rows: defRows } = await db.query(
      "select id from quiz_definitions where slug = $1 and published = true order by version desc limit 1",
      [input.quizSlug]
    );
    const quizId = (defRows[0] as Record<string, unknown> | undefined)?.id as string | undefined;
    if (!quizId) throw new Error(`No published quiz for slug ${input.quizSlug}`);
    const { rows } = await db.query(
      `insert into quiz_submissions (quiz_id, answers, complete, source)
       values ($1,$2,$3,$4) returning id, dq_result`,
      [quizId, JSON.stringify(input.answers), input.complete, JSON.stringify(input.source ?? {})]
    );
    const row = rows[0] as Record<string, unknown>;
    return { id: row.id as string, dqResult: (row.dq_result as string | null) ?? null };
  },

  async logNotification(entry: NotificationLogEntry) {
    const db = await getDb();
    await db.query(
      `insert into notification_log (channel, template, recipient, subject, status, detail, related_booking_id, related_lead_id)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        entry.channel,
        entry.template,
        entry.recipient,
        entry.subject,
        entry.status,
        entry.detail ?? null,
        entry.relatedBookingId ?? null,
        entry.relatedLeadId ?? null,
      ]
    );
  },

  async logLeadSink(entry: LeadSinkLogEntry) {
    const db = await getDb();
    await db.query(
      `insert into lead_sink_log (lead_id, booking_id, sink, status, detail) values ($1,$2,$3,$4,$5)`,
      [entry.leadId ?? null, entry.bookingId ?? null, entry.sink, entry.status, entry.detail ?? null]
    );
  },

  async adminListBookings() {
    const db = await getDb();
    const { rows } = await db.query(
      `select b.*, st.name as session_type_name, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
       from bookings b
       join session_types st on st.id = b.session_type_id
       join customers c on c.id = b.customer_id
       order by b.starts_at desc`
    );
    return rows.map((r) => toBookingRecord(r as Record<string, unknown>));
  },

  async adminListLeads() {
    const db = await getDb();
    const { rows } = await db.query("select * from leads order by created_at desc");
    return rows.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        id: r.id as string,
        source: r.source as Lead["source"],
        stage: r.stage as string,
        name: r.name as string,
        email: r.email as string,
        phone: (r.phone as string | null) ?? null,
        company: (r.company as string | null) ?? null,
        fields: (r.fields as Record<string, string>) ?? {},
        createdAt: new Date(r.created_at as string).toISOString(),
      };
    });
  },
};
