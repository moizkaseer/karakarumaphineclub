import { useEffect, useState } from 'react'
import EventsSection from '@/sections/EventsSection'
import EventDetail from '@/sections/EventDetail'
import type { EventRow } from '@/lib/database'

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  useEffect(() => {
    document.title = 'Events & Expeditions — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative pt-24">
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegisterClick={() => setSelectedEvent(null)}
        />
      )}
      <EventsSection onEventClick={setSelectedEvent} />
    </main>
  )
}
