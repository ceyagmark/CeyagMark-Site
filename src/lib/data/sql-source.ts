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

// The one SQL-backed DataSource. PGlite (dev/test) and Neon (production) both
// plug in through SqlExecutor, so the SQL and the row mapping live here once
// and the two cannot drift. An executor takes positional $1.. params and
// returns plain rows.
export type SqlExecutor = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

// PGlite trap PPI already paid for (BUILD-NOTES Slice 4): `date`/`time`
// columns can come back as JS Date objects from one driver and strings from
// another. getAvailability casts them to text in SQL so every driver sends
// strings, and these helpers stay as a belt-and-braces fallback.
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

// Timestamps arrive as Date or ISO string depending on the driver; bigint and
// numeric columns arrive as strings on some drivers, hence Number() below.
function toIso(value: unknown): string {
  return new Date(value as string | Date).toISOString();
}

// jsonb arrives parsed on both drivers; parse defensively if a driver ever
// hands back the raw text.
function asObject(value: unknown): Record<string, unknown> {
  if (typeof value === "string") return JSON.parse(value) as Record<string, unknown>;
  return (value as Record<string, unknown> | null) ?? {};
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
    startsAt: toIso(row.starts_at),
    endsAt: toIso(row.ends_at),
    status: row.status as BookingRecord["status"],
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: (row.customer_phone as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdAt: toIso(row.created_at),
  };
}

function toLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    source: r.source as Lead["source"],
    stage: r.stage as string,
    name: r.name as string,
    email: (r.email as string | null) ?? null,
    phone: (r.phone as string | null) ?? null,
    company: (r.company as string | null) ?? null,
    fields: asObject(r.fields) as Record<string, string>,
    createdAt: toIso(r.created_at),
  };
}

const BOOKING_SELECT = `select b.*, st.name as session_type_name, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
       from bookings b
       join session_types st on st.id = b.session_type_id
       join customers c on c.id = b.customer_id`;

export function createSqlSource(exec: SqlExecutor): DataSource {
  return {
    async getActiveSessionTypes() {
      const rows = await exec.query(
        "select * from session_types where active = true order by kind, duration_minutes"
      );
      return rows.map(toSessionType);
    },

    async getAvailability(sessionTypeId, fromDate, toDate) {
      const rows = await exec.query<{ slot_date: unknown; slot_time: unknown }>(
        "select slot_date::text as slot_date, slot_time::text as slot_time from get_availability($1, $2, $3)",
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
      const confirmationCode = generateConfirmationCode();
      const manageToken = generateManageToken();
      const rows = await exec.query<{ create_booking: unknown }>(
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
      if (!rows[0]?.create_booking) return { ok: false, errorCode: "INTERNAL_ERROR", message: "Booking failed." };
      const result = asObject(rows[0].create_booking);
      if (result.ok === false) {
        const errorCode = result.error_code as "VALIDATION_ERROR" | "SLOT_UNAVAILABLE" | "INTERNAL_ERROR";
        return { ok: false, errorCode, message: result.message as string };
      }
      return {
        ok: true,
        confirmationCode: result.confirmation_code as string,
        manageToken: result.manage_token as string,
        startsAt: toIso(result.starts_at),
        endsAt: toIso(result.ends_at),
        sessionTypeName: result.session_type_name as string,
        customerEmail: result.customer_email as string,
        customerName: result.customer_name as string,
        ownerAlertEmail: result.owner_alert_email as string,
      };
    },

    async cancelBooking(manageToken) {
      const rows = await exec.query<{ cancel_booking: unknown }>("select cancel_booking($1) as cancel_booking", [
        manageToken,
      ]);
      if (!rows[0]?.cancel_booking || asObject(rows[0].cancel_booking).ok === false) {
        return { ok: false, errorCode: "NOT_FOUND" };
      }
      return { ok: true };
    },

    async getBookingByToken(manageToken) {
      const rows = await exec.query(`${BOOKING_SELECT} where b.manage_token = $1`, [manageToken]);
      return rows[0] ? toBookingRecord(rows[0]) : null;
    },

    async createLead(input: CreateLeadInput): Promise<Lead> {
      const rows = await exec.query(
        `insert into leads (source, name, email, phone, company, fields, quiz_submission_id)
         values ($1,$2,$3,$4,$5,$6,$7)
         returning *`,
        [
          input.source,
          input.name,
          input.email ?? null,
          input.phone ?? null,
          input.company ?? null,
          JSON.stringify(input.fields ?? {}),
          input.quizSubmissionId ?? null,
        ]
      );
      const row = rows[0];
      if (!row) throw new Error("createLead: insert returned no row");
      return toLead(row);
    },

    async createQuizSubmission(input: QuizSubmissionInput): Promise<QuizSubmissionResult> {
      const defRows = await exec.query<{ id: string }>(
        "select id from quiz_definitions where slug = $1 and published = true order by version desc limit 1",
        [input.quizSlug]
      );
      const quizId = defRows[0]?.id;
      if (!quizId) throw new Error(`No published quiz for slug ${input.quizSlug}`);
      const rows = await exec.query<{ id: string; dq_result: string | null }>(
        `insert into quiz_submissions (quiz_id, answers, complete, source)
         values ($1,$2,$3,$4) returning id, dq_result`,
        [quizId, JSON.stringify(input.answers), input.complete, JSON.stringify(input.source ?? {})]
      );
      const row = rows[0];
      if (!row) throw new Error("createQuizSubmission: insert returned no row");
      return { id: row.id, dqResult: row.dq_result ?? null };
    },

    async logNotification(entry: NotificationLogEntry) {
      await exec.query(
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
      await exec.query(
        `insert into lead_sink_log (lead_id, booking_id, sink, status, detail) values ($1,$2,$3,$4,$5)`,
        [entry.leadId ?? null, entry.bookingId ?? null, entry.sink, entry.status, entry.detail ?? null]
      );
    },

    async adminListBookings() {
      const rows = await exec.query(`${BOOKING_SELECT} order by b.starts_at desc`);
      return rows.map(toBookingRecord);
    },

    async adminListLeads() {
      const rows = await exec.query("select * from leads order by created_at desc");
      return rows.map(toLead);
    },
  };
}
