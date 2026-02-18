-- ============================================================
-- FIX: Admin access + Story seed data
-- Run this in Supabase SQL Editor
-- ============================================================

-- STEP 1: Fix admin access
-- The is_admin() function checks the admin_users table.
-- Replace 'YOUR_ADMIN_EMAIL' with the email you use to log in:
INSERT INTO public.admin_users (email)
VALUES ('YOUR_ADMIN_EMAIL_HERE')
ON CONFLICT (email) DO NOTHING;

-- STEP 2: Alternative fix - allow ALL authenticated users admin access
-- (Uncomment these lines if you want any logged-in user to have admin access
--  without needing to be in admin_users table)

-- CREATE OR REPLACE FUNCTION public.is_admin()
-- RETURNS boolean
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
--   SELECT auth.role() = 'authenticated';
-- $$;

-- STEP 3: Seed stories with real content and images
-- Delete old seed stories with placeholder images
DELETE FROM public.stories WHERE image IN ('/lady_finger.jpg', '/passu_cones.jpg', '/who_we_are.jpg');

INSERT INTO public.stories (title, category, excerpt, content, image, published)
VALUES
  (
    'First Light on K2: The 2025 Summer Expedition',
    'Expedition',
    'Our team reached K2 Base Camp after a 10-day approach through the Baltoro Glacier. Here is what we found.',
    'The alarm went off at 3:00 AM. Outside the tent, the Karakoram was silent — the kind of silence that only exists above 5,000 meters, where the air is too thin to carry sound far.

Our team of eight set out from Concordia the previous week, following the well-worn path along the Baltoro Glacier. The approach to K2 Base Camp is not technically difficult, but it demands respect: altitude sickness, rockfall, and unpredictable weather are constant companions.

Day 1-3: Skardu to Askole
We drove from Skardu along the winding Shigar Valley road, passing through villages where apricot trees lined the streets. At Askole, the last settlement before the wilderness, we loaded our gear onto porters and began the trek.

Day 4-7: Askole to Concordia
The Baltoro Glacier stretched before us like a frozen highway. Each day brought new views: the Trango Towers rising like granite cathedrals, the Muztagh Tower gleaming in afternoon light, and finally, the unmistakable pyramid of K2 appearing on the horizon.

Day 8-10: Concordia to K2 Base Camp
The final push was the hardest. At 5,100 meters, every step required deliberate effort. But when we arrived and saw K2 filling the entire northern sky — its summit trailing a plume of snow — every blister and breathless moment was worth it.

The Karakoram does not give its beauty easily. You must earn every view. And that is exactly what makes it unforgettable.',
    'https://images.pexels.com/photos/35302566/pexels-photo-35302566.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Cleaning the Karakoram: 200kg Removed from Baltoro',
    'Conservation',
    'Our annual cleanup drive collected over 200 kilograms of waste from the Baltoro Glacier corridor.',
    'Every year, thousands of trekkers and climbers walk the Baltoro Glacier trail. And every year, they leave behind a trail of their own — discarded oxygen canisters, food wrappers, broken equipment, and human waste.

The Karakoram Alpine Club launched its annual cleanup in June 2025. A team of 15 volunteers, including local porters from Hushe and Askole, spent 12 days collecting waste from Paiju Camp to Concordia.

The Results:
- 200+ kg of waste collected
- 47 abandoned oxygen canisters recovered
- 3 illegal dump sites cleaned
- 2 composting toilets installed at Urdukas Camp

What We Learned:
The problem is not just the waste itself — it is the attitude that the mountains are someone else''s responsibility. Our cleanup drives are as much about education as they are about collection. We work with every expedition team we meet to share Leave No Trace principles.

Local porters are the backbone of this effort. Many of them have walked these trails for decades and have watched the pollution grow. Their knowledge of the terrain and their commitment to preserving it is what makes our work possible.

The Karakoram belongs to everyone. But it is our responsibility to keep it wild.',
    'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Alpine Skills: Crevasse Rescue Training in Hunza',
    'Training',
    'Our spring training camp in Passu covered essential alpine techniques — from glacier travel to emergency self-rescue.',
    'The Passu Glacier is one of the most accessible glaciers in the Karakoram, making it an ideal classroom for alpine training. Every spring, we run a 5-day skills camp for new and intermediate members.

Day 1: Rope Work & Knots
We started with the fundamentals. Every climber must be able to tie a figure-eight, a clove hitch, and a prusik knot with cold hands and closed eyes. We practiced until the movements became automatic.

Day 2: Glacier Travel
Walking on a glacier is nothing like walking on a trail. The surface is uneven, crevasses hide under thin snow bridges, and the ice shifts constantly. We practiced roped travel techniques — spacing, anchor placement, and the critical skill of self-arrest with an ice axe.

Day 3: Crevasse Rescue
The most important skill you hope never to use. We simulated crevasse falls and practiced hauling systems: the 3:1 Z-pulley, the 6:1 system, and improvised anchors using ice screws and snow stakes.

Day 4: Navigation & Weather
GPS devices fail. Batteries die. We taught map and compass navigation, altitude calculation, and how to read weather patterns specific to the Karakoram — particularly the jet stream indicators that signal incoming storms.

Day 5: Mock Expedition
The final day brought everything together. Teams navigated a glacier route, dealt with a simulated crevasse fall, and made weather-based decisions about whether to advance or retreat.

Our training philosophy is simple: the mountains will always be more powerful than us. Our job is to be prepared, make smart decisions, and bring everyone home safely.',
    'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  );
