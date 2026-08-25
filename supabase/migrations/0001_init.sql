-- CeyagMark booking + lead schema. Runs identically on Supabase and on PGlite
-- (local-source.ts / supabase-source.ts) — see SCHEMA.md.
--
-- No extension required: gen_random_uuid() is native since Postgres 13, and the
-- exclusion constraint below uses the range type's built-in GiST opclass (no
-- btree_gist), specifically to avoid the PGlite bundling trap PPI hit
-- (BUILD-NOTES.md Slice 0, decision 2: btree_gist is not in PGlite's default
-- bundle). Random tokens (confirmation_code, manage_token) are generated in
-- application code, not with gen_random_bytes(), for the same reason: pgcrypto
-- is also not guaranteed present.

create table session_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null check (kind in ('consulting', 'discovery')),
  name text not null,
  duration_minutes int not null check (duration_minutes > 0),
  price_lkr int not null default 0 check (price_lkr >= 0),
  price_usd_cents int not null default 0 check (price_usd_cents >= 0),
  buffer_minutes int not null default 0 check (buffer_minutes >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table availability_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_interval_minutes int not null check (slot_interval_minutes > 0),
  created_at timestamptz not null default now(),
  constraint availability_rules_window check (end_time > start_time)
);

create table availability_overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  kind text not null check (kind in ('blackout_full', 'blackout_partial', 'extra_window')),
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  phone text,
  updated_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text unique not null,
  session_type_id uuid not null references session_types (id),
  customer_id uuid not null references customers (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  buffer_minutes int not null default 0 check (buffer_minutes >= 0),
  -- Stored, not computed in the index expression: "timestamptz + interval" is
  -- STABLE, not IMMUTABLE (interval month/DST handling can depend on the
  -- session's TimeZone setting), and Postgres refuses a non-immutable
  -- expression in a GiST index. hold_until is ends_at + buffer_minutes,
  -- computed once in create_booking() at insert time.
  hold_until timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes text check (char_length(notes) <= 2000),
  manage_token text unique not null,
  whatsapp_e164 text,
  created_at timestamptz not null default now(),
  constraint bookings_time_order check (ends_at > starts_at and hold_until >= ends_at),
  -- The overlap trap (BUILD-NOTES / kickoff item 1): every status that holds a
  -- slot must be covered. Only 'confirmed' holds a slot; cancelled/completed/
  -- no_show are all terminal states on past-or-void bookings and never block a
  -- new one. hold_until already includes the buffer, so two sessions can
  -- never be booked back-to-back with no gap.
  exclude using gist (tstzrange(starts_at, hold_until) with &&) where (status = 'confirmed')
);

create index bookings_starts_at_idx on bookings (starts_at);
create index bookings_manage_token_idx on bookings (manage_token);

create table quiz_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  version int not null default 1,
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  unique (slug, version)
);

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quiz_definitions (id),
  "order" int not null,
  prompt text not null,
  type text not null check (type in ('single', 'multi', 'text', 'scale', 'dq')),
  options jsonb,
  logic jsonb,
  created_at timestamptz not null default now()
);

create table quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quiz_definitions (id),
  answers jsonb not null default '{}'::jsonb,
  complete boolean not null default false,
  source jsonb,
  dq_result text,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'free_audit', 'growth_audit', 'built_by', 'quiz')),
  quiz_submission_id uuid references quiz_submissions (id),
  stage text not null default 'new' check (
    stage in ('new', 'qualified', 'call_booked', 'proposal_sent', 'won', 'lost', 'nurture')
  ),
  name text not null,
  email text not null,
  phone text,
  company text,
  fields jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table notification_log (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email')),
  template text not null,
  recipient text not null,
  subject text not null,
  status text not null check (status in ('sent', 'skipped', 'failed')),
  detail text,
  related_booking_id uuid references bookings (id),
  related_lead_id uuid references leads (id),
  created_at timestamptz not null default now()
);

create table lead_sink_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id),
  booking_id uuid references bookings (id),
  sink text not null check (sink in ('db', 'hub', 'file')),
  status text not null check (status in ('sent', 'skipped', 'failed')),
  detail text,
  created_at timestamptz not null default now()
);

create table site_settings (
  id int primary key check (id = 1),
  min_lead_time_minutes int not null default 120,
  max_advance_days int not null default 30,
  owner_alert_email text not null,
  owner_whatsapp_e164 text not null
);
