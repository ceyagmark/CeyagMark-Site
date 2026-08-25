export type SessionType = {
  id: string;
  slug: string;
  kind: "consulting" | "discovery";
  name: string;
  durationMinutes: number;
  priceLkr: number;
  priceUsdCents: number;
  bufferMinutes: number;
};

export type DaySlots = {
  date: string; // YYYY-MM-DD, Asia/Colombo calendar date
  times: string[]; // HH:mm, Asia/Colombo wall-clock
};

export type CreateBookingInput = {
  sessionTypeId: string;
  startsAt: string; // ISO instant
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  whatsappE164?: string;
};

export type CreateBookingResult =
  | {
      ok: true;
      confirmationCode: string;
      manageToken: string;
      startsAt: string;
      endsAt: string;
      sessionTypeName: string;
      customerEmail: string;
      customerName: string;
      ownerAlertEmail: string;
    }
  | { ok: false; errorCode: "VALIDATION_ERROR" | "SLOT_UNAVAILABLE" | "INTERNAL_ERROR"; message: string };

export type BookingRecord = {
  id: string;
  confirmationCode: string;
  sessionTypeName: string;
  startsAt: string;
  endsAt: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  createdAt: string;
};

export type CreateLeadInput = {
  source: "contact" | "free_audit" | "growth_audit" | "built_by" | "quiz";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  fields?: Record<string, string>;
  quizSubmissionId?: string;
};

export type Lead = {
  id: string;
  source: CreateLeadInput["source"];
  stage: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  fields: Record<string, string>;
  createdAt: string;
};

export type QuizSubmissionInput = {
  quizSlug: string;
  answers: Record<string, unknown>;
  complete: boolean;
  source?: Record<string, string>;
};

export type QuizSubmissionResult = {
  id: string;
  dqResult: string | null;
};

export type NotificationLogEntry = {
  channel: "email";
  template: string;
  recipient: string;
  subject: string;
  status: "sent" | "skipped" | "failed";
  detail?: string;
  relatedBookingId?: string;
  relatedLeadId?: string;
};

export type LeadSinkLogEntry = {
  leadId?: string;
  bookingId?: string;
  sink: "db" | "hub" | "file";
  status: "sent" | "skipped" | "failed";
  detail?: string;
};

export interface DataSource {
  getActiveSessionTypes(): Promise<SessionType[]>;
  getAvailability(sessionTypeId: string, fromDate: string, toDate: string): Promise<DaySlots[]>;
  createBooking(input: CreateBookingInput): Promise<CreateBookingResult>;
  cancelBooking(manageToken: string): Promise<{ ok: true } | { ok: false; errorCode: "NOT_FOUND" }>;
  getBookingByToken(manageToken: string): Promise<BookingRecord | null>;
  createLead(input: CreateLeadInput): Promise<Lead>;
  createQuizSubmission(input: QuizSubmissionInput): Promise<QuizSubmissionResult>;
  logNotification(entry: NotificationLogEntry): Promise<void>;
  logLeadSink(entry: LeadSinkLogEntry): Promise<void>;
  adminListBookings(): Promise<BookingRecord[]>;
  adminListLeads(): Promise<Lead[]>;
}
