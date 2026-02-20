import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { getPublishedStories } from '@/lib/database'
import type { StoryRow } from '@/lib/database'

interface StoriesSectionProps {
  className?: string
  id?: string
  onStoryClick?: (story: StoryRow) => void
}

export default function StoriesSection({ className = '', id, onStoryClick }: StoriesSectionProps) {
  const fallbackStoryImage = 'https://images.pexels.com/photos/14282937/pexels-photo-14282937.jpeg?auto=compress&cs=tinysrgb&w=800'
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])
  const animatedRef = useRef(false)

  const [stories, setStories] = useState<StoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStories() {
      const { data, error } = await getPublishedStories()
      if (!error && data) {
        setStories(data)
      }
      setLoading(false)
    }
    loadStories()
  }, [])

  useEffect(() => {
    if (stories.length === 0 || animatedRef.current) return

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
  }, [stories])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative bg-[#0F1520] py-[10vh] ${className}`}
    >
      {/* Gold accent line at top */}
      <div className="mx-[4vw] h-px bg-gradient-to-r from-transparent via-[#D4A23A]/30 to-[#D4A23A]/60" />

      <div className="px-[4vw] pt-[6vh]" ref={contentRef}>
        <span className="label-mono block opacity-0 text-[#D4A23A]">
          JOURNAL
        </span>

        <h2
          className="headline-display mt-4 opacity-0"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
        >
          STORIES FROM <span className="text-[#D4A23A]">THE RANGE</span>
        </h2>

        <p className="body-text mt-4 max-w-lg opacity-0">
          Trip notes, conservation updates, and field lessons—written by guides and members.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-[#1E293B]" />
                <div className="mt-4 h-4 bg-[#1E293B] w-1/3" />
                <div className="mt-2 h-6 bg-[#1E293B] w-2/3" />
                <div className="mt-2 h-4 bg-[#1E293B]" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <p className="body-text mt-12">No stories published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {stories.map((story, index) => (
              <article
                key={story.id}
                ref={(el) => { cardsRef.current[index] = el }}
                onClick={() => onStoryClick?.(story)}
                className="group cursor-pointer opacity-0 bg-[#141B26] border border-[#1E293B] hover:border-[#D4A23A]/30 hover:shadow-lg hover:shadow-[#D4A23A]/5 transition-all duration-300 overflow-hidden"
              >
                {/* Image — no desaturation */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={story.image || fallbackStoryImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={640}
                    height={400}
                    onError={(event) => {
                      if (event.currentTarget.src.endsWith(fallbackStoryImage)) return
                      event.currentTarget.src = fallbackStoryImage
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141B26] via-transparent to-transparent opacity-60" />
                  {/* Category badge over image */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-[#D4A23A]/90 text-[#0B0F17] font-semibold">
                    {story.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold text-xl text-[#F2F5FA] group-hover:text-[#D4A23A] transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="body-text mt-2 text-sm line-clamp-2">{story.excerpt}</p>
                  <span className="cta-underline flex items-center gap-2 mt-4 text-[#D4A23A] text-sm font-medium">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>

                {/* Bottom gold accent */}
                <div className="h-px bg-gradient-to-r from-[#D4A23A]/40 via-[#D4A23A]/20 to-transparent" />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
