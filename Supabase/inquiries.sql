create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  organization text not null default '',
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  message text not null default '',
  source_page text not null default 'unknown',
  service_type text not null default 'general',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

create index if not exists inquiries_source_page_idx
  on public.inquiries (source_page);