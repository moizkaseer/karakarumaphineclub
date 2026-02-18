import { useEffect } from 'react'
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, Clock, Activity } from 'lucide-react'
import type { EventRow } from '@/lib/database'

interface EventDetailProps {
  event: EventRow
  onClose: () => void
  onRegisterClick: () => void
}

export default function EventDetail({ event, onClose, onRegisterClick }: EventDetailProps) {
  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC key closes
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const fallbackImage = 'https://images.pexels.com/photos/35302566/pexels-photo-35302566.jpeg?auto=compress&cs=tinysrgb&w=1920'

  const statusConfig = {
    upcoming: { label: 'Upcoming', icon: Clock, color: 'text-green-400 bg-green-400/10' },
    ongoing: { label: 'Ongoing', icon: Activity, color: 'text-blue-400 bg-blue-400/10' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'text-gray-400 bg-gray-400/10' },
  }
  const status = statusConfig[event.status]
  const StatusIcon = status.icon

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0B0F17] overflow-y-auto">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#1E293B]">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#F2F5FA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back</span>
          </button>
          <div className="h-5 w-px bg-[#1E293B]" />
          <span className="font-mono text-xs tracking-widest text-[#D4A23A]">EVENTS & EXPEDITIONS</span>
        </div>
      </header>

      {/* Hero image (first image or fallback) */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={event.images[0] || fallbackImage}
          alt={event.title}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.05) brightness(0.75)' }}
          onError={(e) => { e.currentTarget.src = fallbackImage }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent" />

        {/* Status + Title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-[8vw] pb-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          <h1
            className="headline-display mt-3"
            style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Event details */}
      <div className="px-6 md:px-[8vw] py-12 max-w-[900px]">
        {/* Key metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-[#1E293B]">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#D4A23A] mt-0.5 flex-shrink-0" />
            <div>
              <p className="caption-mono text-[#A7B1C4] mb-1">DATE</p>
              <p className="text-[#F2F5FA] font-medium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#D4A23A] mt-0.5 flex-shrink-0" />
            <div>
              <p className="caption-mono text-[#A7B1C4] mb-1">LOCATION</p>
              <p className="text-[#F2F5FA] font-medium">{event.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#D4A23A] mt-0.5 flex-shrink-0" />
            <div>
              <p className="caption-mono text-[#A7B1C4] mb-1">CAPACITY</p>
              <p className="text-[#F2F5FA] font-medium">{event.max_participants} participants</p>
            </div>
          </div>
        </div>

        {/* Full description */}
        <h2 className="font-display font-bold text-xl text-[#F2F5FA] mb-4">About this Event</h2>
        <div className="body-text leading-loose whitespace-pre-wrap">
          {event.description}
        </div>

        {/* Image gallery (if more than 1 image) */}
        {event.images.length > 1 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-[#F2F5FA] mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {event.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img}
                    alt={`${event.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.75) contrast(1.05)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {event.videos.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-[#F2F5FA] mb-4">Videos</h2>
            <div className="space-y-4">
              {event.videos.map((url, i) => (
                <div key={i} className="aspect-video bg-[#141B26] border border-[#1E293B]">
                  <video
                    src={url}
                    controls
                    className="w-full h-full"
                    poster={event.images[0] || fallbackImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Register CTA */}
        {event.status !== 'completed' && (
          <div className="mt-14 pt-10 border-t border-[#1E293B]">
            <p className="body-text mb-4">
              Interested in joining this expedition? Contact us and we'll get back to you with details.
            </p>
            <button
              onClick={() => { onClose(); setTimeout(onRegisterClick, 100) }}
              className="btn-primary flex items-center gap-2"
            >
              Register Interest
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 md:px-[8vw] py-10 border-t border-[#1E293B]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#F2F5FA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Events</span>
        </button>
      </div>
    </div>
  )
}
