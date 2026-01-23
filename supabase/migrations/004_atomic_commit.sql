-- Atomic commit function that handles the entire commit flow in one transaction
-- This bypasses RLS issues and ensures data consistency
create or replace function commit_to_threshold(
  p_user_id uuid,
  p_threshold_id uuid,
  p_points integer
)
returns json as $func$
declare
  v_current_energy integer;
  v_commitment_id uuid;
  v_new_badges json;
begin
  -- First consume energy (includes refill check)
  perform refill_energy(p_user_id);

  select energy into v_current_energy
  from profiles
  where id = p_user_id
  for update;

  if v_current_energy < 1 then
    raise exception 'Insufficient energy';
  end if;

  -- Decrement energy
  update profiles
  set energy = energy - 1,
      last_energy_reset = now()
  where id = p_user_id;

  -- Insert commitment (use ON CONFLICT to handle duplicates gracefully)
  insert into commitments (user_id, threshold_id, points_earned)
  values (p_user_id, p_threshold_id, p_points)
  on conflict (user_id, threshold_id) do update
  set points_earned = commitments.points_earned + p_points,
      committed_at = now()
  returning id into v_commitment_id;

  -- Increment user points
  update profiles
  set points = points + p_points
  where id = p_user_id;

  -- Increment threshold count
  update thresholds
  set current_count = current_count + 1
  where id = p_threshold_id;

  -- Update user streak
  perform update_user_streak(p_user_id);

  -- Check and award badges, get results as JSON
  select json_agg(row_to_json(t))
  into v_new_badges
  from (select * from check_and_award_badges(p_user_id)) t;

  return json_build_object(
    'commitment_id', v_commitment_id,
    'points', p_points,
    'new_badges', coalesce(v_new_badges, '[]'::json)
  );
end;
$func$ language plpgsql security definer;
