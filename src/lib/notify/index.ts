import type { DataSource } from "@/lib/data/types";

export type Attachment = {
  filename: string;
  /** Raw UTF-8 content. Encoded for the provider at send time. */
  content: string;
  contentType?: string;
};

export type Email = {
  to: string;
  subject: string;
  /** Always present. Plain text is the deliverability floor and the accessible fallback. */
  text: string;
  html?: string;
  attachments?: Attachment[];
};

export interface Notifier {
  send(email: Email, template: string): Promise<{ status: "sent" | "skipped" | "failed"; detail?: string }>;
}

/**
 * Where booking and lead alerts go.
 *
 * This exists because the seeded owner address is on a domain with no MX
 * records: mail sent there is accepted by nobody. The alert address is
 * therefore an explicit env var, separate from the public contact address
 * shown on the site, and the caller's fallback is only reached when it is
 * unset.
 */
export function ownerAlertRecipient(fallback: string): string {
  const configured = process.env.OWNER_ALERT_EMAIL?.trim();
  return configured && configured.length > 0 ? configured : fallback;
}

// The PPI lesson, verbatim: "a stub that returns ok: true makes 'no
// credentials' and 'working provider' indistinguishable to every caller."
// This adapter always reports its true outcome, and every outcome is written
// to notification_log by sendAndLog() below, never inferred, never silent.
class ConsoleNotifier implements Notifier {
  async send(email: Email, template: string) {
    console.log(`[notify:skipped] ${template} -> ${email.to} : ${email.subject}`);
    return { status: "skipped" as const, detail: "ConsoleNotifier: NOTIFY_FROM_EMAIL not set" };
  }
}

class ResendNotifier implements Notifier {
  constructor(private fromEmail: string) {}
  async send(email: Email, _template: string) {
    void _template;
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: this.fromEmail,
        to: email.to,
        subject: email.subject,
        text: email.text,
        ...(email.html ? { html: email.html } : {}),
        ...(email.attachments && email.attachments.length > 0
          ? {
              attachments: email.attachments.map((a) => ({
                filename: a.filename,
                content: Buffer.from(a.content, "utf8").toString("base64"),
                ...(a.contentType ? { contentType: a.contentType } : {}),
              })),
            }
          : {}),
      });
      if (result.error) return { status: "failed" as const, detail: result.error.message };
      return { status: "sent" as const };
    } catch (err) {
      return { status: "failed" as const, detail: err instanceof Error ? err.message : "unknown error" };
    }
  }
}

function getNotifier(): Notifier {
  const from = process.env.NOTIFY_FROM_EMAIL;
  return from ? new ResendNotifier(from) : new ConsoleNotifier();
}

export async function sendAndLog(
  dataSource: DataSource,
  email: Email,
  template: string,
  related: { bookingId?: string; leadId?: string } = {}
) {
  const notifier = getNotifier();
  const result = await notifier.send(email, template);
  await dataSource.logNotification({
    channel: "email",
    template,
    recipient: email.to,
    subject: email.subject,
    status: result.status,
    detail: result.detail,
    relatedBookingId: related.bookingId,
    relatedLeadId: related.leadId,
  });
}
