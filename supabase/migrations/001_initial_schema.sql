-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  points integer default 0,
  energy integer default 10,
  last_energy_reset timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Thresholds (the cards users swipe on)
create table thresholds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  target_count integer not null,
  current_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Commitments (user's decisions)
create table commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  threshold_id uuid references thresholds(id) on delete cascade not null,
  points_earned integer default 0,
  committed_at timestamp with time zone default now(),
  unique(user_id, threshold_id)
);

-- Row Level Security
alter table profiles enable row level security;
alter table thresholds enable row level security;
alter table commitments enable row level security;

-- Policies
create policy "Public profiles readable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Thresholds readable by all" on thresholds for select using (true);

create policy "Users can read own commitments" on commitments for select using (auth.uid() = user_id);
create policy "Users can create own commitments" on commitments for insert with check (auth.uid() = user_id);

-- Helper functions
create or replace function increment_points(user_id uuid, amount integer)
returns void as $$
begin
  update profiles set points = points + amount where id = user_id;
end;
$$ language plpgsql security definer;

create or replace function increment_threshold_count(threshold_id uuid)
returns void as $$
begin
  update thresholds set current_count = current_count + 1 where id = threshold_id;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
