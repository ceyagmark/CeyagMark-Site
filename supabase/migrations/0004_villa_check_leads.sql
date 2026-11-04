-- Villa owners reply on WhatsApp, not email, so a villa_check lead carries a
-- WhatsApp number and email becomes optional. The API (lib/validation/lead.ts)
-- still requires email for every other source.
alter table leads drop constraint leads_source_check;
alter table leads add constraint leads_source_check
  check (source in ('contact', 'free_audit', 'growth_audit', 'built_by', 'quiz', 'villa_check'));

alter table leads alter column email drop not null;
