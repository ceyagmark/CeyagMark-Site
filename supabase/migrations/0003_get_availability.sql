-- Availability is computed inside one SQL function so local-source.ts and
-- supabase-source.ts call the identical logic instead of each re-implementing
-- it in TypeScript (ADR-001 #4 — the two-sources-drift trap PPI hit four
-- times). Candidate starts come only from availability_rules + overrides
-- (never inferred from session length — the other PPI trap), then filtered by
-- min_lead_time / max_advance and by not colliding with an existing confirmed
-- booking's [starts_at, ends_at + buffer) range.

create or replace function get_availability(
  p_session_type_id uuid,
  p_from date,
  p_to date
) returns table (slot_date date, slot_time time) as $$
declare
  v_session record;
  v_settings record;
  v_day date;
  v_rule record;
  v_candidate time;
  v_candidate_instant timestamptz;
  v_blocked boolean;
  v_override record;
  v_full_blackout boolean;
begin
  select * into v_session from session_types where id = p_session_type_id and active = true;
  if not found then
    return;
  end if;

  select * into v_settings from site_settings where id = 1;

  v_day := p_from;
  while v_day <= p_to loop
    v_full_blackout := exists (
      select 1 from availability_overrides
      where date = v_day and kind = 'blackout_full'
    );

    if not v_full_blackout then
      for v_rule in
        select * from availability_rules where day_of_week = extract(dow from v_day)
      loop
        v_candidate := v_rule.start_time;
        while v_candidate + (v_session.duration_minutes || ' minutes')::interval <= v_rule.end_time loop
          v_candidate_instant := (v_day::text || ' ' || v_candidate::text)::timestamp at time zone 'Asia/Colombo';

          if v_candidate_instant >= now() + (v_settings.min_lead_time_minutes || ' minutes')::interval
             and v_candidate_instant <= now() + (v_settings.max_advance_days || ' days')::interval then

            v_blocked := false;

            for v_override in
              select * from availability_overrides
              where date = v_day and kind = 'blackout_partial'
            loop
              if v_candidate >= v_override.start_time and v_candidate < v_override.end_time then
                v_blocked := true;
              end if;
            end loop;

            if not v_blocked then
              v_blocked := exists (
                select 1 from bookings b
                where b.status = 'confirmed'
                  and tstzrange(b.starts_at, b.hold_until)
                      && tstzrange(v_candidate_instant, v_candidate_instant + (v_session.duration_minutes || ' minutes')::interval)
              );
            end if;

            if not v_blocked then
              slot_date := v_day;
              slot_time := v_candidate;
              return next;
            end if;
          end if;

          v_candidate := v_candidate + (v_rule.slot_interval_minutes || ' minutes')::interval;
        end loop;
      end loop;
    end if;

    v_day := v_day + 1;
  end loop;
end;
$$ language plpgsql stable;
