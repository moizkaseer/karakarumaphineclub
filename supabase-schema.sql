-- ============================================================
-- Karakoram Alpine Club - Supabase Schema
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- 0. ADMIN ACCESS HELPERS
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    or exists (
      select 1
      from public.admin_users as admins
      where lower(admins.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

-- Add at least one admin before using the dashboard:
-- insert into public.admin_users(email) values ('admin@example.com');

-- 1. EVENTS TABLE
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date date not null,
  location text not null,
  description text not null,
  max_participants integer not null default 10,
  images text[] default '{}',
  videos text[] default '{}',
  status text not null default 'upcoming'
    check (status in ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);

create policy "Admins can insert events"
  on public.events for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update events"
  on public.events for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete events"
  on public.events for delete
  to authenticated
  using (public.is_admin());

-- 2. CONTACT SUBMISSIONS TABLE
create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now(),
  read boolean default false
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read submissions"
  on public.contact_submissions for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update submissions"
  on public.contact_submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 3. NEWSLETTER SUBSCRIBERS TABLE
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default now(),
  active boolean default true
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update subscribers"
  on public.newsletter_subscribers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. MEMBERSHIP APPLICATIONS TABLE
create table public.membership_applications (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  location text not null,
  experience_level text not null
    check (experience_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  climbing_history text,
  motivation text not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  notes text,
  created_at timestamptz default now()
);

alter table public.membership_applications enable row level security;

create policy "Anyone can submit membership application"
  on public.membership_applications for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read applications"
  on public.membership_applications for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update applications"
  on public.membership_applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete applications"
  on public.membership_applications for delete
  to authenticated
  using (public.is_admin());

-- 5. STORIES TABLE
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  excerpt text not null,
  content text default '',
  image text default '',
  published boolean default false,
  created_at timestamptz default now()
);

alter table public.stories enable row level security;

create policy "Anyone can read published stories"
  on public.stories for select
  to anon
  using (published = true);

create policy "Admins can read all stories"
  on public.stories for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert stories"
  on public.stories for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update stories"
  on public.stories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete stories"
  on public.stories for delete
  to authenticated
  using (public.is_admin());

-- 6. STORAGE BUCKET for event images
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Public read access for event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Admins can upload event images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-images' and public.is_admin());

create policy "Admins can delete event images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-images' and public.is_admin());

-- 6. SEED DATA
insert into public.events (title, date, location, description, max_participants, status)
values
  ('K2 Base Camp Trek', '2026-07-15', 'Skardu to K2 Base Camp',
   'A challenging 14-day trek to the base camp of the world''s second highest peak. Experience the majesty of the Karakoram range.',
   12, 'upcoming'),
  ('Baltoro Glacier Cleanup', '2026-08-01', 'Baltoro Glacier',
   'Join our conservation team for a 10-day waste removal expedition along the Baltoro Glacier route.',
   20, 'upcoming');

insert into public.stories (title, category, excerpt, content, image, published)
values
  ('The K2 Weather Window', 'Expedition',
   'How we read the jet stream to pick a safer summit day.',
   'Full article content here...', '/lady_finger.jpg', true),
  ('Cleaning the Baltoro', 'Conservation',
   'A 14-day waste sweep from Paiju to Concordia.',
   'Full article content here...', '/passu_cones.jpg', true),
  ('Ice Rescue Drills', 'Training',
   'What to do when a teammate goes into a crevasse.',
   'Full article content here...', '/who_we_are.jpg', true);
