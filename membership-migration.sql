-- ============================================================
-- Membership Applications Table Migration
-- Run this in Supabase SQL Editor to add membership functionality
-- ============================================================

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

CREATE POLICY "Authenticated users can read applications"
  ON public.membership_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON public.membership_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete applications"
  ON public.membership_applications FOR DELETE
  TO authenticated
  USING (true);
