import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use the Supabase data source.");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
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
  const sessionType = row.session_types as Record<string, unknown> | null;
  const customer = row.customers as Record<string, unknown> | null;
  return {
    id: row.id as string,
    confirmationCode: row.confirmation_code as string,
    sessionTypeName: (sessionType?.name as string) ?? "",
    startsAt: new Date(row.starts_at as string).toISOString(),
    endsAt: new Date(row.ends_at as string).toISOString(),
    status: row.status as BookingRecord["status"],
    customerName: (customer?.name as string) ?? "",
    customerEmail: (customer?.email as string) ?? "",
    customerPhone: (customer?.phone as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

export const supabaseSource: DataSource = {
  async getActiveSessionTypes() {
    const { data, error } = await getClient()
      .from("session_types")
      .select("*")
      .eq("active", true)
      .order("kind")
      .order("duration_minutes");
    if (error) throw new Error(`getActiveSessionTypes: ${error.message}`);
    return (data ?? []).map(toSessionType);
  },

  async getAvailability(sessionTypeId, fromDate, toDate) {
    const { data, error } = await getClient().rpc("get_availability", {
      p_session_type_id: sessionTypeId,
      p_from: fromDate,
      p_to: toDate,
    });
    if (error) throw new Error(`getAvailability: ${error.message}`);
    const byDate = new Map<string, string[]>();
    for (const row of (data ?? []) as { slot_date: string; slot_time: string }[]) {
      const date = String(row.slot_date).slice(0, 10);
      const time = String(row.slot_time).slice(0, 5);
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
    const { data, error } = await getClient().rpc("create_booking", {
      p_session_type_id: input.sessionTypeId,
      p_starts_at: input.startsAt,
      p_confirmation_code: confirmationCode,
      p_manage_token: manageToken,
      p_customer_email: input.email,
      p_customer_name: input.name,
      p_customer_phone: input.phone ?? null,
      p_notes: input.notes ?? null,
      p_whatsapp_e164: input.whatsappE164 ?? null,
    });
    if (error) return { ok: false, errorCode: "INTERNAL_ERROR", message: "Booking failed." };
    const result = data as Record<string, unknown>;
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
    const { data, error } = await getClient().rpc("cancel_booking", { p_manage_token: manageToken });
    if (error) return { ok: false, errorCode: "NOT_FOUND" };
    const result = data as Record<string, unknown>;
    if (result.ok === false) return { ok: false, errorCode: "NOT_FOUND" };
    return { ok: true };
  },

  async getBookingByToken(manageToken) {
    const { data, error } = await getClient()
      .from("bookings")
      .select("*, session_types(name), customers(name, email, phone)")
      .eq("manage_token", manageToken)
      .maybeSingle();
    if (error || !data) return null;
    return toBookingRecord(data as Record<string, unknown>);
  },

  async createLead(input: CreateLeadInput): Promise<Lead> {
    const { data, error } = await getClient()
      .from("leads")
      .insert({
        source: input.source,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        company: input.company ?? null,
        fields: input.fields ?? {},
        quiz_submission_id: input.quizSubmissionId ?? null,
      })
      .select("*")
      .single();
    if (error) throw new Error(`createLead: ${error.message}`);
    const row = data as Record<string, unknown>;
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
    const supabase = getClient();
    const { data: def, error: defError } = await supabase
      .from("quiz_definitions")
      .select("id")
      .eq("slug", input.quizSlug)
      .eq("published", true)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (defError || !def) throw new Error(`No published quiz for slug ${input.quizSlug}`);
    const { data, error } = await supabase
      .from("quiz_submissions")
      .insert({
        quiz_id: (def as Record<string, unknown>).id,
        answers: input.answers,
        complete: input.complete,
        source: input.source ?? {},
      })
      .select("id, dq_result")
      .single();
    if (error) throw new Error(`createQuizSubmission: ${error.message}`);
    const row = data as Record<string, unknown>;
    return { id: row.id as string, dqResult: (row.dq_result as string | null) ?? null };
  },

  async logNotification(entry: NotificationLogEntry) {
    const { error } = await getClient().from("notification_log").insert({
      channel: entry.channel,
      template: entry.template,
      recipient: entry.recipient,
      subject: entry.subject,
      status: entry.status,
      detail: entry.detail ?? null,
      related_booking_id: entry.relatedBookingId ?? null,
      related_lead_id: entry.relatedLeadId ?? null,
    });
    if (error) throw new Error(`logNotification: ${error.message}`);
  },

  async logLeadSink(entry: LeadSinkLogEntry) {
    const { error } = await getClient().from("lead_sink_log").insert({
      lead_id: entry.leadId ?? null,
      booking_id: entry.bookingId ?? null,
      sink: entry.sink,
      status: entry.status,
      detail: entry.detail ?? null,
    });
    if (error) throw new Error(`logLeadSink: ${error.message}`);
  },

  async adminListBookings() {
    const { data, error } = await getClient()
      .from("bookings")
      .select("*, session_types(name), customers(name, email, phone)")
      .order("starts_at", { ascending: false });
    if (error) throw new Error(`adminListBookings: ${error.message}`);
    return (data ?? []).map((r) => toBookingRecord(r as Record<string, unknown>));
  },

  async adminListLeads() {
    const { data, error } = await getClient().from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(`adminListLeads: ${error.message}`);
    return (data ?? []).map((row) => {
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
