create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  location text,
  headline text,
  professional_summary text,
  skills text[] not null default '{}',
  work_experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  additional_details text[] not null default '{}',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  parsed_data jsonb,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.resumes enable row level security;

drop policy if exists "Users can view own extended profile" on public.user_profiles;
create policy "Users can view own extended profile"
on public.user_profiles for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own extended profile" on public.user_profiles;
create policy "Users can insert own extended profile"
on public.user_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own extended profile" on public.user_profiles;
create policy "Users can update own extended profile"
on public.user_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own resumes" on public.resumes;
create policy "Users can view own resumes"
on public.resumes for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own resumes" on public.resumes;
create policy "Users can insert own resumes"
on public.resumes for insert
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own resume files" on storage.objects;
create policy "Users can upload own resume files"
on storage.objects for insert
with check (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can view own resume files" on storage.objects;
create policy "Users can view own resume files"
on storage.objects for select
using (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);
