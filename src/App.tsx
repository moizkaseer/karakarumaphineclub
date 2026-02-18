import { useEffect, useRef, useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import HeroSection from './sections/HeroSection'
import EventsSection from './sections/EventsSection'
import StoriesSection from './sections/StoriesSection'
import ContactSection from './sections/ContactSection'
import StoryDetail from './sections/StoryDetail'
import EventDetail from './sections/EventDetail'
import AdminPanel from './sections/AdminPanel'
import MembershipForm from './components/MembershipForm'
import { supabase } from './lib/supabase'
import { signOut } from './lib/database'
import type { StoryRow, EventRow } from './lib/database'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const [selectedStory, setSelectedStory] = useState<StoryRow | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)
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

  // Global Scroll Snap for pinned sections
  useEffect(() => {
    const initSnap = () => {
      if (!window.gsap || !window.ScrollTrigger || snapInitialized.current) return

      const ScrollTrigger = window.ScrollTrigger

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allTriggers = ScrollTrigger.getAll()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pinned = allTriggers.filter((st: any) => st.vars.pin)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => a.start - b.start)

        const maxScroll = ScrollTrigger.maxScroll(window)

        if (!maxScroll || pinned.length === 0) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pinnedRanges = pinned.map((st: any) => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }))

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(
                (r: { start: number; end: number }) => value >= r.start - 0.02 && value <= r.end + 0.02
              )

              if (!inPinned) return value

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

      {/* Full-page detail views */}
      {selectedStory && (
        <StoryDetail story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegisterClick={() => {
            setSelectedEvent(null)
            setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
          }}
        />
      )}

      {/* Main content */}
      <main className="relative">
        <HeroSection className="z-section-1" onJoinClick={() => setShowMembershipForm(true)} />
        <EventsSection className="z-section-2" id="events" onEventClick={setSelectedEvent} />
        <StoriesSection className="z-section-3" id="stories" onStoryClick={setSelectedStory} />
        <ContactSection className="z-section-4" id="contact" />
      </main>
    </div>
  )
}

export default App
