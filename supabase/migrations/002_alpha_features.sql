-- Phase 2: Alpha Features Migration

-- Add streak tracking to profiles
alter table profiles add column if not exists current_streak integer default 0;
alter table profiles add column if not exists longest_streak integer default 0;
alter table profiles add column if not exists last_activity_date date;

-- Badges table
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text not null,
  requirement_type text not null, -- 'commits', 'streak', 'points', 'early_commits'
  requirement_value integer not null,
  points_reward integer default 0,
  created_at timestamp with time zone default now()
);

-- User badges (earned achievements)
create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  badge_id uuid references badges(id) on delete cascade not null,
  earned_at timestamp with time zone default now(),
  unique(user_id, badge_id)
);

-- RLS for badges
alter table badges enable row level security;
alter table user_badges enable row level security;

create policy "Badges readable by all" on badges for select using (true);
create policy "User badges readable by owner" on user_badges for select using (auth.uid() = user_id);
create policy "User badges insertable by system" on user_badges for insert with check (auth.uid() = user_id);

-- Function to update streak on activity
create or replace function update_user_streak(p_user_id uuid)
returns void as $$
declare
  v_last_activity date;
  v_today date := current_date;
  v_current_streak integer;
  v_longest_streak integer;
begin
  select last_activity_date, current_streak, longest_streak
  into v_last_activity, v_current_streak, v_longest_streak
  from profiles where id = p_user_id;

  if v_last_activity is null or v_last_activity < v_today - interval '1 day' then
    -- Streak broken or first activity
    v_current_streak := 1;
  elsif v_last_activity = v_today - interval '1 day' then
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
  elsif v_last_activity = v_today then
    -- Same day, no change
    return;
  end if;

  -- Update longest streak if needed
  if v_current_streak > v_longest_streak then
    v_longest_streak := v_current_streak;
  end if;

  update profiles
  set current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = v_today
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Function to check and award badges
create or replace function check_and_award_badges(p_user_id uuid)
returns table(badge_name text, badge_icon text) as $$
declare
  v_profile profiles%rowtype;
  v_commit_count integer;
  v_early_commit_count integer;
  v_badge badges%rowtype;
begin
  -- Get user profile
  select * into v_profile from profiles where id = p_user_id;

  -- Count commitments
  select count(*) into v_commit_count from commitments where user_id = p_user_id;

  -- Count early commitments (bonus points > 10 means early)
  select count(*) into v_early_commit_count from commitments where user_id = p_user_id and points_earned > 10;

  -- Check each badge
  for v_badge in select * from badges loop
    -- Skip if already earned
    if exists (select 1 from user_badges where user_id = p_user_id and badge_id = v_badge.id) then
      continue;
    end if;

    -- Check requirements
    if (v_badge.requirement_type = 'commits' and v_commit_count >= v_badge.requirement_value) or
       (v_badge.requirement_type = 'streak' and v_profile.current_streak >= v_badge.requirement_value) or
       (v_badge.requirement_type = 'points' and v_profile.points >= v_badge.requirement_value) or
       (v_badge.requirement_type = 'early_commits' and v_early_commit_count >= v_badge.requirement_value) then

      -- Award badge
      insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id);

      -- Award bonus points
      if v_badge.points_reward > 0 then
        update profiles set points = points + v_badge.points_reward where id = p_user_id;
      end if;

      badge_name := v_badge.name;
      badge_icon := v_badge.icon;
      return next;
    end if;
  end loop;
end;
$$ language plpgsql security definer;

-- Seed initial badges
insert into badges (name, description, icon, requirement_type, requirement_value, points_reward) values
('First Step', 'Make your first commitment', '🌱', 'commits', 1, 5),
('Committed', 'Make 5 commitments', '✊', 'commits', 5, 10),
('Activist', 'Make 25 commitments', '📢', 'commits', 25, 25),
('Movement Builder', 'Make 100 commitments', '🔥', 'commits', 100, 100),
('Early Bird', 'Be an early supporter 3 times', '🐦', 'early_commits', 3, 15),
('Trendsetter', 'Be an early supporter 10 times', '⭐', 'early_commits', 10, 50),
('On Fire', 'Maintain a 3-day streak', '🔥', 'streak', 3, 10),
('Week Warrior', 'Maintain a 7-day streak', '💪', 'streak', 7, 25),
('Monthly Master', 'Maintain a 30-day streak', '🏆', 'streak', 30, 100),
('Century Club', 'Earn 100 points', '💯', 'points', 100, 0),
('Point Master', 'Earn 500 points', '🎯', 'points', 500, 0),
('Legend', 'Earn 1000 points', '👑', 'points', 1000, 0)
on conflict (name) do nothing;

-- Create leaderboard view
create or replace view leaderboard as
select
  p.id,
  p.username,
  p.points,
  p.current_streak,
  p.longest_streak,
  (select count(*) from commitments c where c.user_id = p.id) as total_commits,
  (select count(*) from user_badges ub where ub.user_id = p.id) as badge_count,
  rank() over (order by p.points desc) as rank
from profiles p
where p.points > 0
order by p.points desc
limit 100;
