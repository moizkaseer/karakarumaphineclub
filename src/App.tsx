import { useEffect, useRef, useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import HeroSection from './sections/HeroSection'
import SummitMissionSection from './sections/SummitMissionSection'
import SplitSection from './sections/SplitSection'
import EventsSection from './sections/EventsSection'
import StoriesSection from './sections/StoriesSection'
import ContactSection from './sections/ContactSection'
import AdminPanel from './sections/AdminPanel'
import { supabase } from './lib/supabase'
import { signOut } from './lib/database'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const snapInitialized = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(!!session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Global Scroll Snap for pinned sections - optimized
  useEffect(() => {
    const initSnap = () => {
      if (!window.gsap || !window.ScrollTrigger || snapInitialized.current) return

      const ScrollTrigger = window.ScrollTrigger

      // Wait for all ScrollTriggers to be created
      setTimeout(() => {
        const allTriggers = ScrollTrigger.getAll()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pinned = allTriggers.filter((st: any) => st.vars.pin)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => a.start - b.start)

        const maxScroll = ScrollTrigger.maxScroll(window)

        if (!maxScroll || pinned.length === 0) return

        // Build ranges and snap targets from pinned sections
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pinnedRanges = pinned.map((st: { start: number; end?: number }) => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }))

        // Create global snap - optimized
        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              // Check if within any pinned range (with buffer)
              const inPinned = pinnedRanges.some(
                (r: { start: number; end: number }) => value >= r.start - 0.02 && value <= r.end + 0.02
              )

              if (!inPinned) return value // Flowing section: free scroll

              // Find nearest pinned center
              const target = pinnedRanges.reduce(
                (closest: number, r: { center: number }) =>
                  Math.abs(r.center - value) < Math.abs(closest - value)
                    ? r.center
                    : closest,
                pinnedRanges[0]?.center ?? 0
              )

              return target
            },
            duration: { min: 0.1, max: 0.25 },
            delay: 0,
            ease: 'power2.out',
          },
        })

        snapInitialized.current = true
      }, 1200)
    }

    const timer = setTimeout(initSnap, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleAdminAccess = () => {
    setShowAdmin(true)
  }

  const handleAdminLogout = async () => {
    await signOut()
    setIsAdmin(false)
    setShowAdmin(false)
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
  }

  if (showAdmin) {
    return <AdminPanel isAdmin={isAdmin} onLogin={handleAdminLogin} onLogout={handleAdminLogout} onClose={() => setShowAdmin(false)} />
  }

  return (
    <div className="relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <Navigation onAdminClick={handleAdminAccess} />
      
      {/* Main content */}
      <main className="relative">
        {/* Section 1: Hero */}
        <HeroSection className="z-section-1" />
        
        {/* Section 2: Summit Mission */}
        <SummitMissionSection className="z-section-2" />
        
        {/* Section 3: Who We Are - Text Left / Image Right */}
        <SplitSection
          className="z-section-3"
          label="IDENTITY"
          headline="WHO WE ARE"
          body="A small collective of guides, athletes, and conservationists from Gilgit-Baltistan. We cap membership to keep the mountains—and our community—healthy."
          cta="Membership guidelines"
          caption="Baltoro Glacier • Pakistan"
          image="/who_we_are.jpg"
          layout="text-left"
        />
        
        {/* Section 4: Expeditions - Image Left / Text Right */}
        <SplitSection
          className="z-section-4"
          label="PROGRAMS"
          headline="EXPEDITIONS"
          body="From acclimatization treks to 7,000 m attempts. Small teams, experienced leadership, and a strict leave-no-trace protocol."
          cta="View upcoming routes"
          caption="Gasherbrum approach • 2026"
          image="/expeditions.jpg"
          layout="image-left"
        />
        
        {/* Section 5: Conservation - Text Left / Image Right */}
        <SplitSection
          className="z-section-5"
          label="IMPACT"
          headline="CONSERVATION"
          body="We fund waste removal, trail repair, and local ranger support. Every climb contributes to the range's long-term health."
          cta="See current projects"
          caption="Base camp cleanup • 2026"
          image="/conservation.jpg"
          layout="text-left"
        />
        
        {/* Section 6: Training - Image Left / Text Right */}
        <SplitSection
          className="z-section-6"
          label="PROGRAMS"
          headline="TRAINING"
          body="Technical skills, rescue readiness, and high-altitude conditioning. Built for climbers who want to operate safely in big terrain."
          cta="Explore courses"
          caption="Ice skills session • 2026"
          image="/training.jpg"
          layout="image-left"
        />
        
        {/* Section 7: Community - Text Left / Image Right */}
        <SplitSection
          className="z-section-7"
          label="CULTURE"
          headline="COMMUNITY"
          body="Summit days are personal. But the work—carrying loads, sharing stoves, cleaning camps—is collective. That's the club."
          cta="Meet the team"
          caption="Team camp • 2026"
          image="/community.jpg"
          layout="text-left"
        />
        
        {/* Section 8: Join - Image Left / Text Right */}
        <SplitSection
          className="z-section-8"
          label="MEMBERSHIP"
          headline="JOIN THE CLUB"
          body="Applications open quarterly. Priority is given to climbers committed to both ascent and stewardship."
          cta="Request an application"
          caption="Member ascent • 2026"
          image="/join.jpg"
          layout="image-left"
        />
        
        {/* Section 9: Support - Text Left / Image Right */}
        <SplitSection
          className="z-section-9"
          label="SUPPORT"
          headline="SUPPORT THE RANGE"
          body="Direct funding for waste removal, weather monitoring, and local guide education. Transparent budgets. Real outcomes."
          cta="View funding priorities"
          caption="Route recon • 2026"
          image="/support.jpg"
          layout="text-left"
        />
        
        {/* Section 10: Leave No Trace - Image Left / Text Right */}
        <SplitSection
          className="z-section-10"
          label="ETHICS"
          headline="LEAVE NO TRACE"
          body="Pack it out. Stay on rock where possible. Minimize fixed gear. Protect water sources. Teach others."
          cta="Download field checklist"
          caption="Sunset descent • 2026"
          image="/leave_no_trace.jpg"
          layout="image-left"
        />
        
        {/* Section 11: Plan - Text Left / Image Right */}
        <SplitSection
          className="z-section-11"
          label="PLANNING"
          headline="PLAN YOUR ASCENT"
          body="Check weather windows, permit requirements, and team availability. We'll help you choose a route that matches your experience."
          cta="Start planning"
          caption="Ridge traverse • 2026"
          image="/plan.jpg"
          layout="text-left"
        />
        
        {/* Section 12: Events */}
        <EventsSection className="z-section-12" />

        {/* Section 13: Stories */}
        <StoriesSection className="z-section-13" />

        {/* Section 14: Contact */}
        <ContactSection className="z-section-14" />
      </main>
    </div>
  )
}

export default App
