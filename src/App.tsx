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
import MembershipForm from './components/MembershipForm'
import { supabase } from './lib/supabase'
import { signOut } from './lib/database'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showMembershipForm, setShowMembershipForm] = useState(false)
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

      {/* Membership Form Modal */}
      <MembershipForm isOpen={showMembershipForm} onClose={() => setShowMembershipForm(false)} />

      {/* Main content */}
      <main className="relative">
        {/* Section 1: Hero */}
        <HeroSection className="z-section-1" onJoinClick={() => setShowMembershipForm(true)} />
        
        {/* Section 2: Summit Mission */}
        <SummitMissionSection className="z-section-2" />

        {/* Section 3: Who We Are - Text Left / Image Right */}
        <SplitSection
          className="z-section-3"
          label="IDENTITY"
          headline="WHO WE ARE"
          body="A small collective of guides, athletes, and conservationists from Gilgit-Baltistan. We cap membership to keep the mountains—and our community—healthy."
          cta="Learn more"
          caption="Baltoro Glacier • Pakistan"
          image="/who_we_are.jpg"
          layout="text-left"
        />

        {/* Section 4: Events */}
        <EventsSection className="z-section-4" id="events" />

        {/* Section 5: Stories */}
        <StoriesSection className="z-section-5" id="stories" />

        {/* Section 6: Contact */}
        <ContactSection className="z-section-6" id="contact" />
      </main>
    </div>
  )
}

export default App
