import { useEffect, useRef, useState } from 'react'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { getEvents } from '@/lib/database'
import type { EventRow } from '@/lib/database'

interface EventsSectionProps {
  className?: string
  id?: string
  onEventClick?: (event: EventRow) => void
}

export default function EventsSection({ className = '', id, onEventClick }: EventsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])
  const animatedRef = useRef(false)

  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await getEvents()
      if (!error && data) {
        // Show only upcoming and ongoing events to the public
        setEvents(data.filter(e => e.status !== 'completed'))
      }
      setLoading(false)
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (events.length === 0 || animatedRef.current) return

    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      const triggers: { kill: () => void }[] = []

      const contentTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current?.children || [],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          )
        },
        once: true,
      })
      triggers.push(contentTrigger)

      cardsRef.current.forEach((card, index) => {
        if (!card) return

        const cardTrigger = ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
            )
          },
          once: true,
        })
        triggers.push(cardTrigger)
      })

      animatedRef.current = true

      return () => {
        triggers.forEach((t) => t.kill())
      }
    }

    const timer = setTimeout(initGSAP, 500)
    return () => clearTimeout(timer)
  }, [events])

  const statusColors = {
    upcoming: 'bg-green-500/20 text-green-400',
    ongoing: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative bg-[#0B0F17] py-[10vh] ${className}`}
    >
      <div className="mx-[4vw] hairline" />

      <div className="px-[4vw] pt-[6vh]" ref={contentRef}>
        <span className="label-mono block opacity-0">
          UPCOMING
        </span>

        <h2
          className="headline-display mt-4 max-w-[52vw] opacity-0"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
        >
          EVENTS & EXPEDITIONS
        </h2>

        <p className="body-text mt-4 max-w-[46vw] opacity-0">
          Join our upcoming treks, cleanup drives, and training sessions across the Karakoram range.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-[#141B26] border border-[#1E293B] p-6">
                <div className="h-4 bg-[#1E293B] w-1/4 mb-4" />
                <div className="h-6 bg-[#1E293B] w-3/4 mb-4" />
                <div className="h-4 bg-[#1E293B] w-1/2 mb-2" />
                <div className="h-4 bg-[#1E293B] w-1/3 mb-2" />
                <div className="h-16 bg-[#1E293B] mt-4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="body-text mt-12">No upcoming events at the moment. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {events.map((event, index) => (
              <article
                key={event.id}
                ref={(el) => { cardsRef.current[index] = el }}
                onClick={() => onEventClick?.(event)}
                className="bg-[#141B26] border border-[#1E293B] p-6 opacity-0 group hover:border-[#D4A23A]/30 transition-colors duration-300 cursor-pointer"
              >
                {/* Status badge */}
                <span className={`inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider ${statusColors[event.status]}`}>
                  {event.status}
                </span>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-[#F2F5FA] mt-3 group-hover:text-[#D4A23A] transition-colors duration-300">
                  {event.title}
                </h3>

                {/* Event image */}
                {event.images.length > 0 && (
                  <div className="mt-4 aspect-[16/10] overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'saturate(0.75) contrast(1.05)' }}
                    />
                  </div>
                )}

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#D4A23A]" />
                    <span className="text-[#A7B1C4]">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#D4A23A]" />
                    <span className="text-[#A7B1C4]">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[#D4A23A]" />
                    <span className="text-[#A7B1C4]">Max {event.max_participants} participants</span>
                  </div>
                </div>

                {/* Description */}
                <p className="body-text text-sm mt-4 line-clamp-3">
                  {event.description}
                </p>

                {/* CTA */}
                <span className="cta-underline flex items-center gap-2 mt-5 text-[#F2F5FA] text-sm font-medium">
                  <span>View details</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
