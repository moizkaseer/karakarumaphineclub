-- ============================================================
-- COMPLETE FIX: Tables + Admin + RLS + Seed Data
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- 1. ADMIN HELPERS (safe to re-run)
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

-- 2. ADD YOUR ADMIN EMAIL
INSERT INTO public.admin_users (email)
VALUES ('moizkaseer@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 3. STORIES TABLE (safe to re-run)
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  content text DEFAULT '',
  image text DEFAULT '',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Anyone can read published stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can read all stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can insert stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can update stories" ON public.stories;
DROP POLICY IF EXISTS "Admins can delete stories" ON public.stories;

CREATE POLICY "Anyone can read published stories"
  ON public.stories FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Admins can read all stories"
  ON public.stories FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert stories"
  ON public.stories FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update stories"
  ON public.stories FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete stories"
  ON public.stories FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. EVENTS TABLE (safe to re-run)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  max_participants integer NOT NULL DEFAULT 10,
  images text[] DEFAULT '{}',
  videos text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

CREATE POLICY "Events are publicly readable"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE TO authenticated
  USING (public.is_admin());

-- 5. CONTACT SUBMISSIONS (safe to re-run)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can read submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. NEWSLETTER SUBSCRIBERS (safe to re-run)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can read subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update subscribers"
  ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. MEMBERSHIP APPLICATIONS (safe to re-run)
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
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit membership application" ON public.membership_applications;
DROP POLICY IF EXISTS "Admins can read applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON public.membership_applications;

CREATE POLICY "Anyone can submit membership application"
  ON public.membership_applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read applications"
  ON public.membership_applications FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update applications"
  ON public.membership_applications FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete applications"
  ON public.membership_applications FOR DELETE TO authenticated
  USING (public.is_admin());

-- 8. STORAGE BUCKET (safe to re-run)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for event images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;

CREATE POLICY "Public read access for event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-images' AND public.is_admin());

CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'event-images' AND public.is_admin());

-- 8b. STORY IMAGES BUCKET (safe to re-run)
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for story images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload story images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete story images" ON storage.objects;

CREATE POLICY "Public read access for story images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-images');

CREATE POLICY "Admins can upload story images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'story-images' AND public.is_admin());

CREATE POLICY "Admins can delete story images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'story-images' AND public.is_admin());

-- 9. SEED DATA: Delete old stories with broken image paths
DELETE FROM public.stories
WHERE image IN ('/lady_finger.jpg', '/passu_cones.jpg', '/who_we_are.jpg');

-- 10. SEED DATA: Insert stories (skips if title already exists)
INSERT INTO public.stories (title, category, excerpt, content, image, published)
SELECT * FROM (VALUES
  (
    'First Light on K2: The 2025 Summer Expedition'::text,
    'Expedition'::text,
    'Our team reached K2 Base Camp after a 10-day approach through the Baltoro Glacier.'::text,
    'The alarm went off at 3:00 AM. Outside the tent, the Karakoram was silent.

Our team of eight set out from Concordia the previous week, following the well-worn path along the Baltoro Glacier. The approach to K2 Base Camp is not technically difficult, but it demands respect: altitude sickness, rockfall, and unpredictable weather are constant companions.

Day 1-3: Skardu to Askole
We drove from Skardu along the winding Shigar Valley road, passing through villages where apricot trees lined the streets. At Askole, the last settlement before the wilderness, we loaded our gear onto porters and began the trek.

Day 4-7: Askole to Concordia
The Baltoro Glacier stretched before us like a frozen highway. Each day brought new views: the Trango Towers rising like granite cathedrals, the Muztagh Tower gleaming in afternoon light, and finally, the unmistakable pyramid of K2 appearing on the horizon.

Day 8-10: Concordia to K2 Base Camp
The final push was the hardest. At 5,100 meters, every step required deliberate effort. But when we arrived and saw K2 filling the entire northern sky, every blister and breathless moment was worth it.

The Karakoram does not give its beauty easily. You must earn every view.'::text,
    'https://images.pexels.com/photos/35302566/pexels-photo-35302566.jpeg?auto=compress&cs=tinysrgb&w=800'::text,
    true::boolean
  ),
  (
    'Cleaning the Karakoram: 200kg Removed from Baltoro'::text,
    'Conservation'::text,
    'Our annual cleanup drive collected over 200 kilograms of waste from the Baltoro Glacier corridor.'::text,
    'Every year, thousands of trekkers and climbers walk the Baltoro Glacier trail. And every year, they leave behind discarded oxygen canisters, food wrappers, broken equipment, and human waste.

The Karakoram Alpine Club launched its annual cleanup in June 2025. A team of 15 volunteers, including local porters from Hushe and Askole, spent 12 days collecting waste from Paiju Camp to Concordia.

The Results:
- 200+ kg of waste collected
- 47 abandoned oxygen canisters recovered
- 3 illegal dump sites cleaned
- 2 composting toilets installed at Urdukas Camp

Local porters are the backbone of this effort. Many of them have walked these trails for decades and have watched the pollution grow. Their knowledge of the terrain and their commitment to preserving it is what makes our work possible.

The Karakoram belongs to everyone. But it is our responsibility to keep it wild.'::text,
    'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=800'::text,
    true::boolean
  ),
  (
    'Alpine Skills: Crevasse Rescue Training in Hunza'::text,
    'Training'::text,
    'Our spring training camp in Passu covered essential alpine techniques from glacier travel to emergency self-rescue.'::text,
    'The Passu Glacier is one of the most accessible glaciers in the Karakoram, making it an ideal classroom for alpine training. Every spring, we run a 5-day skills camp for new and intermediate members.

Day 1: Rope Work and Knots
We started with the fundamentals. Every climber must be able to tie a figure-eight, a clove hitch, and a prusik knot with cold hands and closed eyes.

Day 2: Glacier Travel
Walking on a glacier is nothing like walking on a trail. We practiced roped travel techniques, spacing, anchor placement, and self-arrest with an ice axe.

Day 3: Crevasse Rescue
We simulated crevasse falls and practiced hauling systems: the 3:1 Z-pulley, the 6:1 system, and improvised anchors using ice screws and snow stakes.

Day 4: Navigation and Weather
We taught map and compass navigation, altitude calculation, and how to read weather patterns specific to the Karakoram.

Day 5: Mock Expedition
The final day brought everything together. Teams navigated a glacier route, dealt with a simulated crevasse fall, and made weather-based decisions about whether to advance or retreat.

Our training philosophy is simple: the mountains will always be more powerful than us. Our job is to be prepared, make smart decisions, and bring everyone home safely.'::text,
    'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=800'::text,
    true::boolean
  )
) AS seed(title, category, excerpt, content, image, published)
WHERE NOT EXISTS (
  SELECT 1 FROM public.stories s WHERE s.title = seed.title
);

-- 11. SEED DATA: Events (skips if title already exists)
INSERT INTO public.events (title, date, location, description, max_participants, status)
SELECT * FROM (VALUES
  (
    'K2 Base Camp Trek'::text,
    '2026-07-15'::date,
    'Skardu to K2 Base Camp'::text,
    'A challenging 14-day trek to the base camp of the world''s second highest peak. Experience the majesty of the Karakoram range.'::text,
    12::integer,
    'upcoming'::text
  ),
  (
    'Baltoro Glacier Cleanup'::text,
    '2026-08-01'::date,
    'Baltoro Glacier'::text,
    'Join our conservation team for a 10-day waste removal expedition along the Baltoro Glacier route.'::text,
    20::integer,
    'upcoming'::text
  )
) AS seed(title, date, location, description, max_participants, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.events e WHERE e.title = seed.title
);
