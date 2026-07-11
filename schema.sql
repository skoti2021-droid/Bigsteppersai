-- ─────────────────────────────────────────────────────────────────────────────
-- BIG STEPPERS AI — Supabase schema
-- Run once in the Supabase SQL editor. Powers the website video grid,
-- the Instagram auto-sync, and the customer dashboard.
-- ─────────────────────────────────────────────────────────────────────────────

-- Customer profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  role text not null default 'customer' check (role in ('customer','admin')),
  plan text check (plan in ('Starter','Growth','Pro')),
  billing text check (billing in ('monthly','yearly')),
  stripe_customer_id text,
  renewal_date timestamptz,
  created_at timestamptz not null default now()
);

-- Website portfolio videos — the landing page grid reads this table.
-- Both the admin panel (manual) and the Instagram Edge Function (automatic)
-- write here.
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  title text not null,
  views text not null default 'New',
  thumbnail_url text,
  reel_url text,                -- instagram permalink
  video_url text,               -- optional self-hosted mp4 (plays natively)
  ig_media_id text unique,      -- prevents duplicate imports from the sync
  source text not null default 'manual' check (source in ('seed','manual','instagram')),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Hashtag → industry routing for the auto-sync
create table if not exists public.hashtag_map (
  hashtag text primary key,     -- lowercase, includes '#'
  industry text not null
);

insert into public.hashtag_map (hashtag, industry) values
  ('#roofing','Roofing'), ('#dentist','Dentist'), ('#restaurant','Restaurant'),
  ('#realestate','Real Estate'), ('#hvac','HVAC'), ('#medspa','Med Spa'),
  ('#lawfirm','Law Firm'), ('#plumbing','Plumbing'), ('#solar','Solar'),
  ('#gym','Gym'), ('#autodetailing','Auto Detailing'), ('#landscaping','Landscaping')
on conflict (hashtag) do nothing;

-- Sync audit log
create table if not exists public.sync_log (
  id bigint generated always as identity primary key,
  ran_at timestamptz not null default now(),
  imported int not null default 0,
  skipped int not null default 0,
  error text
);

-- Customer projects (dashboard)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  promote text not null,
  duration text not null,
  style text not null,
  website text,
  cta text,
  notes text,
  status text not null default 'Submitted' check (status in
    ('Submitted','Creative Review','Script','AI Generation','Editing','Quality Check','Client Review','Delivered')),
  delivered_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.videos enable row level security;
alter table public.hashtag_map enable row level security;
alter table public.sync_log enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "own projects" on public.projects
  for all using (auth.uid() = user_id);

-- Anyone (including logged-out landing page visitors) can read published videos
create policy "public read videos" on public.videos
  for select using (published = true);

-- Only admins manage videos / hashtags / logs
create policy "admin write videos" on public.videos
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin hashtags" on public.hashtag_map
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin sync log" on public.sync_log
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Schedule the Instagram sync every 30 minutes (requires pg_cron + pg_net,
-- enabled in Dashboard → Database → Extensions). Replace YOUR-PROJECT-REF.
-- select cron.schedule(
--   'instagram-sync-30min',
--   '*/30 * * * *',
--   $$ select net.http_post(
--        url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/instagram-sync',
--        headers := '{"Authorization": "Bearer YOUR-ANON-KEY"}'::jsonb
--      ) $$
-- );
