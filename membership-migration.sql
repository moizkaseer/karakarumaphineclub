-- ============================================================
-- Membership Applications Table Migration
-- Run this in Supabase SQL Editor to add membership functionality
-- ============================================================

-- Admin helpers (safe to re-run)
CREATE TABLE IF NOT EXISTS public.admin_users (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    OR EXISTS (
      SELECT 1
      FROM public.admin_users AS admins
      WHERE lower(admins.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

-- Create membership applications table
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text NOT NULL,
  experience_level text NOT NULL
    CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  climbing_history text,
  motivation text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit membership application"
  ON public.membership_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read applications"
  ON public.membership_applications FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update applications"
  ON public.membership_applications FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete applications"
  ON public.membership_applications FOR DELETE
  TO authenticated
  USING (public.is_admin());
