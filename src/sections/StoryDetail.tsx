import { useEffect } from 'react'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import type { StoryRow } from '@/lib/database'

interface StoryDetailProps {
  story: StoryRow
  onClose: () => void
}

export default function StoryDetail({ story, onClose }: StoryDetailProps) {
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

  const fallbackImage = 'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=1920'

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
          <span className="font-mono text-xs tracking-widest text-[#D4A23A]">JOURNAL</span>
        </div>
      </header>

      {/* Hero image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={story.image || fallbackImage}
          alt={story.title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          style={{ filter: 'saturate(0.8) contrast(1.05) brightness(0.75)' }}
          onError={(e) => { e.currentTarget.src = fallbackImage }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent" />

        {/* Category + Title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-[8vw] pb-10">
          <span className="caption-mono text-[#D4A23A]">{story.category}</span>
          <h1
            className="headline-display mt-2"
            style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
          >
            {story.title}
          </h1>
        </div>
      </div>

      {/* Article body */}
      <article className="px-6 md:px-[8vw] py-12 max-w-[800px]">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-10 pb-8 border-b border-[#1E293B]">
          <div className="flex items-center gap-2 text-[#A7B1C4] text-sm font-mono">
            <Calendar className="w-4 h-4 text-[#D4A23A]" />
            {new Date(story.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-2 text-[#A7B1C4] text-sm font-mono">
            <Tag className="w-4 h-4 text-[#D4A23A]" />
            {story.category}
          </div>
        </div>

        {/* Excerpt (lead) */}
        <p className="text-lg text-[#D4D8E2] leading-relaxed mb-8 font-medium">
          {story.excerpt}
        </p>

        {/* Full content */}
        {story.content ? (
          <div className="body-text leading-loose space-y-6 whitespace-pre-wrap">
            {story.content}
          </div>
        ) : (
          <p className="body-text italic">Full article coming soon.</p>
        )}
      </article>

      {/* Footer */}
      <div className="px-6 md:px-[8vw] py-10 border-t border-[#1E293B]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#F2F5FA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Stories</span>
        </button>
      </div>
    </div>
  )
}
