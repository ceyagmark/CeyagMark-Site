-- The single write path for bookings (PPI trap: "one SQL function decides, and
-- its returned flag gates every email — three actors can reach one booking in
-- the same second"). Both data sources call this function; neither ever runs a
-- raw INSERT into bookings. Tokens are generated in application code (see
-- 0001's header comment) and passed in, so this function needs no crypto
-- extension.
--
-- Availability is re-derived here from availability_rules/availability_overrides
-- and site_settings.min_lead_time_minutes, never trusted from the caller — a
-- stale or forged starts_at is rejected with 'SLOT_UNAVAILABLE' before the
-- INSERT is attempted, and the exclusion constraint is the backstop for the
-- true concurrent-write race (two callers landing in the same millisecond).

create or replace function create_booking(
  p_session_type_id uuid,
  p_starts_at timestamptz,
  p_confirmation_code text,
  p_manage_token text,
  p_customer_email text,
  p_customer_name text,
  p_customer_phone text,
  p_notes text,
  p_whatsapp_e164 text
) returns jsonb as $$
declare
  v_session record;
  v_ends_at timestamptz;
  v_hold_until timestamptz;
  v_customer_id uuid;
  v_booking_id uuid;
  v_settings record;
  v_dow int;
  v_local_time time;
  v_rule record;
  v_override record;
  v_in_window boolean := false;
begin
  select * into v_session from session_types where id = p_session_type_id and active = true;
  if not found then
    return jsonb_build_object('ok', false, 'error_code', 'VALIDATION_ERROR', 'message', 'That session type is not available.');
  end if;

  select * into v_settings from site_settings where id = 1;
  if not found then
    return jsonb_build_object('ok', false, 'error_code', 'INTERNAL_ERROR', 'message', 'Booking is not configured yet.');
  end if;

  if p_starts_at < now() + (v_settings.min_lead_time_minutes || ' minutes')::interval then
    return jsonb_build_object('ok', false, 'error_code', 'SLOT_UNAVAILABLE', 'message', 'That time no longer has enough notice. Pick a later time.');
  end if;

  if p_starts_at > now() + (v_settings.max_advance_days || ' days')::interval then
    return jsonb_build_object('ok', false, 'error_code', 'VALIDATION_ERROR', 'message', 'That date is too far ahead to book yet.');
  end if;

  v_ends_at := p_starts_at + (v_session.duration_minutes || ' minutes')::interval;
  v_hold_until := v_ends_at + (v_session.buffer_minutes || ' minutes')::interval;

  -- Re-derive: is p_starts_at inside an open window on its day, per the
  -- weekly rules, minus any full/partial blackout for that date? (PPI trap:
  -- "business hours are half-derived" — the daily window comes only from
  -- availability_rules, never inferred from session lengths.)
  v_dow := extract(dow from p_starts_at at time zone 'Asia/Colombo');
  v_local_time := (p_starts_at at time zone 'Asia/Colombo')::time;

  for v_rule in select * from availability_rules where day_of_week = v_dow loop
    if v_local_time >= v_rule.start_time and v_local_time < v_rule.end_time then
      v_in_window := true;
    end if;
  end loop;

  if not v_in_window then
    return jsonb_build_object('ok', false, 'error_code', 'SLOT_UNAVAILABLE', 'message', 'That time is outside our booking hours.');
  end if;

  for v_override in
    select * from availability_overrides where date = (p_starts_at at time zone 'Asia/Colombo')::date
  loop
    if v_override.kind = 'blackout_full' then
      return jsonb_build_object('ok', false, 'error_code', 'SLOT_UNAVAILABLE', 'message', 'That day is not available.');
    elsif v_override.kind = 'blackout_partial'
      and v_local_time >= v_override.start_time and v_local_time < v_override.end_time then
      return jsonb_build_object('ok', false, 'error_code', 'SLOT_UNAVAILABLE', 'message', 'That time is not available.');
    end if;
  end loop;

  insert into customers (email, name, phone, updated_at)
  values (lower(p_customer_email), p_customer_name, p_customer_phone, now())
  on conflict (email) do update
    set name = excluded.name, phone = excluded.phone, updated_at = now()
  returning id into v_customer_id;

  begin
    insert into bookings (
      confirmation_code, session_type_id, customer_id, starts_at, ends_at,
      buffer_minutes, hold_until, notes, manage_token, whatsapp_e164
    ) values (
      p_confirmation_code, p_session_type_id, v_customer_id, p_starts_at, v_ends_at,
      v_session.buffer_minutes, v_hold_until, p_notes, p_manage_token, p_whatsapp_e164
    ) returning id into v_booking_id;
  exception
    when exclusion_violation then
      return jsonb_build_object('ok', false, 'error_code', 'SLOT_UNAVAILABLE', 'message', 'That time was just taken. Pick another.');
  end;

  return jsonb_build_object(
    'ok', true,
    'booking_id', v_booking_id,
    'confirmation_code', p_confirmation_code,
    'manage_token', p_manage_token,
    'starts_at', p_starts_at,
    'ends_at', v_ends_at,
    'session_type_name', v_session.name,
    'customer_email', lower(p_customer_email),
    'customer_name', p_customer_name,
    'owner_alert_email', v_settings.owner_alert_email
  );
end;
$$ language plpgsql;

create or replace function cancel_booking(p_manage_token text) returns jsonb as $$
declare
  v_booking record;
begin
  select * into v_booking from bookings where manage_token = p_manage_token;
  if not found then
    return jsonb_build_object('ok', false, 'error_code', 'NOT_FOUND', 'message', 'Booking not found.');
  end if;
  if v_booking.status <> 'confirmed' then
    return jsonb_build_object('ok', true, 'already', true);
  end if;
  update bookings set status = 'cancelled' where id = v_booking.id;
  return jsonb_build_object('ok', true, 'already', false);
end;
$$ language plpgsql;
