-- CAiSEY Strategy Lab — Supabase Schema
-- Run this in the Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Teams table
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  submitted boolean not null default false,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Team members table
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Submissions table (one per team)
create table public.submissions (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null unique references public.teams(id) on delete cascade,
  q1_ip text,
  q2_funding text,
  q3_partnership text,
  q4_market text,
  q5_product text,
  slides_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_submissions_team_id on public.submissions(team_id);

-- Row Level Security (permissive for classroom use)
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.submissions enable row level security;

create policy "Allow all on teams" on public.teams for all using (true) with check (true);
create policy "Allow all on team_members" on public.team_members for all using (true) with check (true);
create policy "Allow all on submissions" on public.submissions for all using (true) with check (true);

-- Auto-update updated_at on submissions
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger submissions_updated_at
  before update on public.submissions
  for each row
  execute function public.update_updated_at();
