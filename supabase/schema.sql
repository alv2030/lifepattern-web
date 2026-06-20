-- LifePattern MVP schema for Supabase/PostgreSQL
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  checkin_date date not null,
  mood_score int check (mood_score between 1 and 10),
  energy_score int check (energy_score between 1 and 10),
  stress_score int check (stress_score between 1 and 10),
  sleep_hours numeric(3,1),
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, checkin_date)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  tag_type text not null check (tag_type in ('person','activity','work','health','location','emotion','custom')),
  created_at timestamptz default now(),
  unique(user_id, name, tag_type)
);

create table if not exists public.checkin_tags (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid references public.checkins(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  unique(checkin_id, tag_id)
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  insight_type text not null,
  title text not null,
  summary text not null,
  evidence jsonb,
  confidence_score numeric(3,2),
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

create table if not exists public.insight_feedback (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid references public.insights(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating text check (rating in ('accurate','somewhat','not_accurate')),
  saved boolean default false,
  dismissed boolean default false,
  comment text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.checkins enable row level security;
alter table public.tags enable row level security;
alter table public.checkin_tags enable row level security;
alter table public.insights enable row level security;
alter table public.insight_feedback enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can manage own checkins" on public.checkins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own tags" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own insights" on public.insights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own feedback" on public.insight_feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage checkin tags through owned checkins" on public.checkin_tags
for all using (
  exists (select 1 from public.checkins c where c.id = checkin_id and c.user_id = auth.uid())
)
with check (
  exists (select 1 from public.checkins c where c.id = checkin_id and c.user_id = auth.uid())
);
