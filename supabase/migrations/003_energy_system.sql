-- Phase 1: Energy System & Push Notifications Migration

-- Atomic energy consumption function
-- Uses row-level locking to prevent race conditions
-- First applies any pending refills (midnight/hourly), then consumes
create or replace function consume_energy(p_user_id uuid, amount integer)
returns void as $$
declare
  v_current_energy integer;
begin
  -- First apply any pending refills (midnight reset or hourly)
  perform refill_energy(p_user_id);

  -- Now lock the row and get current energy
  select energy into v_current_energy
  from profiles
  where id = p_user_id
  for update;

  if v_current_energy < amount then
    raise exception 'Insufficient energy';
  end if;

  -- Decrement energy and update last_energy_reset
  update profiles
  set energy = energy - amount,
      last_energy_reset = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Function to refill energy (resets to 10 at midnight or adds 1 per hour)
create or replace function refill_energy(p_user_id uuid)
returns integer as $$
declare
  v_current_energy integer;
  v_last_reset timestamp with time zone;
  v_hours_since_reset integer;
  v_new_energy integer;
  v_max_energy constant integer := 10;
begin
  -- Lock the row and get current values
  select energy, last_energy_reset
  into v_current_energy, v_last_reset
  from profiles
  where id = p_user_id
  for update;

  -- Check if we've crossed midnight since last reset
  if v_last_reset::date < current_date then
    -- Full reset at midnight
    v_new_energy := v_max_energy;
    update profiles
    set energy = v_new_energy,
        last_energy_reset = now()
    where id = p_user_id;
    return v_new_energy;
  end if;

  -- Calculate hours since last reset for hourly recharge
  v_hours_since_reset := extract(epoch from (now() - v_last_reset)) / 3600;

  if v_hours_since_reset >= 1 and v_current_energy < v_max_energy then
    -- Add 1 energy per hour passed, capped at max
    v_new_energy := least(v_current_energy + v_hours_since_reset, v_max_energy);
    update profiles
    set energy = v_new_energy,
        last_energy_reset = now()
    where id = p_user_id;
    return v_new_energy;
  end if;

  return v_current_energy;
end;
$$ language plpgsql security definer;

-- Function to get current energy with auto-refill
create or replace function get_energy_with_refill(p_user_id uuid)
returns integer as $$
declare
  v_energy integer;
begin
  -- First refill if needed
  perform refill_energy(p_user_id);

  -- Then return current energy
  select energy into v_energy from profiles where id = p_user_id;
  return v_energy;
end;
$$ language plpgsql security definer;

-- Push notification tokens table
create table if not exists push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  token text not null,
  platform text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, token)
);

-- RLS for push_tokens
alter table push_tokens enable row level security;

create policy "Users can read own push tokens" on push_tokens
  for select using (auth.uid() = user_id);

create policy "Users can insert own push tokens" on push_tokens
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own push tokens" on push_tokens
  for delete using (auth.uid() = user_id);
