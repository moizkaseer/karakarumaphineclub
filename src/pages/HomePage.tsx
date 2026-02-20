import { useEffect, useRef, useState } from 'react'
import HeroSection from '@/sections/HeroSection'
import EventsSection from '@/sections/EventsSection'
import StoriesSection from '@/sections/StoriesSection'
import TeamSection from '@/sections/TeamSection'
import ContactSection from '@/sections/ContactSection'
import EventDetail from '@/sections/EventDetail'
import StoryDetail from '@/sections/StoryDetail'
import type { EventRow, StoryRow } from '@/lib/database'

interface HomePageProps {
  onJoinClick: () => void
}

export default function HomePage({ onJoinClick }: HomePageProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)
  const [selectedStory, setSelectedStory] = useState<StoryRow | null>(null)
  const snapInitialized = useRef(false)

  useEffect(() => {
    document.title = 'Karakoram Alpine Club | Expeditions, Training, Conservation'
    window.scrollTo(0, 0)
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

  return (
    <main className="relative">
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

      <HeroSection className="z-section-1" onJoinClick={onJoinClick} />
      <EventsSection className="z-section-2" id="events" onEventClick={setSelectedEvent} />
      <StoriesSection className="z-section-3" id="stories" onStoryClick={setSelectedStory} />
      <TeamSection className="z-section-4" id="team" />
      <ContactSection className="z-section-5" id="contact" />
    </main>
  )
}
