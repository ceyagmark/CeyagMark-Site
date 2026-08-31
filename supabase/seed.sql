-- Seed data. Contact details are the real, already-published business contact
-- from the live site (index.html JSON-LD: telephone +94703727895, email
-- growth@ceyagmark.com) — not invented. Business hours are now real too
-- (7pm-10pm, confirmed by Shashika 2026-08-25); slot spacing (30 min) remains
-- an unconfirmed placeholder.

insert into site_settings (id, min_lead_time_minutes, max_advance_days, owner_alert_email, owner_whatsapp_e164)
values (1, 120, 30, 'growth@ceyagmark.com', '+94703727895');

-- Session types. Prices from Projects/CeyagMark/portfolio/cases.json _pricing
-- block and cases.json's consulting figures, verbatim.
insert into session_types (slug, kind, name, duration_minutes, price_lkr, price_usd_cents, buffer_minutes, active) values
  ('consulting-30', 'consulting', 'Strategy Session (30 min)', 30, 3000, 2000, 10, true),
  ('consulting-60', 'consulting', 'Strategy Session (60 min)', 60, 6000, 4000, 10, true),
  ('consulting-90', 'consulting', 'Technical Deep Dive (90 min)', 90, 9000, 6000, 15, true),
  ('discovery-leak-report', 'discovery', 'Free Discovery Call: The Leak Report', 20, 0, 0, 10, true),
  ('discovery-fix-sprint', 'discovery', 'Free Discovery Call: The Fix Sprint', 20, 0, 0, 10, true),
  ('discovery-build-and-run', 'discovery', 'Free Discovery Call: Build & Run', 20, 0, 0, 10, true);

-- Availability: Mon-Fri 19:00-22:00 Asia/Colombo, 30-minute start spacing.
-- Real hours, confirmed by Shashika 2026-08-25 (previously an invented
-- placeholder — see BUILD-NOTES.md Slice 1/6). Days-of-week were not
-- explicitly restated when he confirmed the time window; Mon-Fri is carried
-- over from the placeholder, not independently confirmed — flag if wrong.
insert into availability_rules (day_of_week, start_time, end_time, slot_interval_minutes) values
  (1, '19:00', '22:00', 30),
  (2, '19:00', '22:00', 30),
  (3, '19:00', '22:00', 30),
  (4, '19:00', '22:00', 30),
  (5, '19:00', '22:00', 30);

-- Growth-audit quiz shell — Hub Phase E shape (QuizDefinition/QuizQuestion),
-- ported from the existing quiz.html question set. Full question port is a
-- Slice 2/3 item; this seeds the definition row so quiz_submissions has
-- somewhere to point.
insert into quiz_definitions (slug, title, version, published) values
  ('growth-audit', 'CeyagMark Growth Audit', 1, true);
