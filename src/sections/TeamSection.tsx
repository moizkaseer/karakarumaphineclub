import { useEffect, useRef } from 'react'
import { Mountain, Award, MapPin } from 'lucide-react'

interface TeamSectionProps {
  className?: string
  id?: string
}

const teamMembers = [
  {
    name: 'Sohail Sakhi',
    role: 'Founder & Lead Mountaineer',
    location: 'Gilgit, Pakistan',
    bio: 'With over 20 years of high-altitude experience across the Karakoram, Sohail founded the club to share the mountains with the next generation.',
    summits: ['Khimor Wall', 'Khimor-e-bal', 'Hidden Valley', 'Gasherbrum', 'Batura', 'Passu Cones', 'Batakoshi Peak'],
    image: null,
  },
  // {
  //   name: 'Adnan Khan',
  //   role: 'Co-Founder & Lead Mountaineer',
  //   location: 'Hunza, Pakistan',
  //   bio: 'A seasoned climber and strategist, Adnan co-founded the club to build a sustainable alpine community rooted in Hunza\'s mountaineering traditions.',
  //   summits: ['Khimor Wall', 'Hidden Valley', 'Gasherbrum', 'Batura', 'Passu Cones'],
  //   image: null,
  // },
  // {
  //   name: 'Azeem Khan',
  //   role: 'Head of Expeditions',
  //   location: 'North Macedonia',
  //   bio: 'An IFMGA-certified guide specializing in technical climbing and expedition logistics across Pakistan\'s northern areas.',
  //   summits: ['Khimor Wall'],
  //   image: null,
  // },
  // {
  //   name: 'Sherzad Karim',
  //   role: 'Climber & Safety Lead',
  //   location: 'Aliabad, Hunza, Pakistan',
  //   bio: 'Sherzad Karim from Aliabad, Hunza reached the summit of Nanga Parbat on July 3, 2025 — the club\'s highest summit to date.',
  //   summits: ['Nanga Parbat', 'Khimor Wall'],
  //   image: null,
  // },
  // {
  //   name: 'Nosher Ali Khan',
  //   role: 'Community & Outreach',
  //   location: 'USA',
  //   bio: 'Passionate about making mountaineering accessible, Nosher coordinates community events and youth programs from abroad.',
  //   summits: ['Pico de Orizaba', 'Khimor Wall'],
  //   image: null,
  // },
]

export default function TeamSection({ className = '', id }: TeamSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])
  const animatedRef = useRef(false)

  useEffect(() => {
    if (animatedRef.current) return

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
  }, [])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative bg-[#0B0F17] py-[10vh] ${className}`}
    >
      {/* Gold accent line at top */}
      <div className="mx-[4vw] h-px bg-gradient-to-r from-[#D4A23A]/40 via-[#D4A23A]/20 to-transparent" />

      <div className="px-[4vw] pt-[6vh]" ref={contentRef}>
        <span className="label-mono block opacity-0 text-[#D4A23A]">
          THE CREW
        </span>

        <h2
          className="headline-display mt-4 opacity-0"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
        >
          OUR <span className="text-[#D4A23A]">TEAM</span>
        </h2>

        <p className="body-text mt-4 max-w-lg opacity-0">
          Meet the experienced mountaineers and organizers behind Karakoram Alpine Club.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {teamMembers.map((member, index) => (
            <article
              key={member.name}
              ref={(el) => { cardsRef.current[index] = el }}
              className="bg-[#141B26] border border-[#1E293B] p-6 opacity-0 group hover:border-[#D4A23A]/30 transition-colors duration-300"
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-[#1E293B] border border-[#D4A23A]/20 flex items-center justify-center mx-auto mb-4 group-hover:border-[#D4A23A]/50 transition-colors duration-300">
                <Mountain className="w-8 h-8 text-[#D4A23A]/60" />
              </div>

              {/* Name & Role */}
              <h3 className="font-display font-bold text-lg text-[#F2F5FA] text-center group-hover:text-[#D4A23A] transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-xs font-mono tracking-wider text-[#D4A23A] text-center mt-1 uppercase">
                {member.role}
              </p>

              {/* Location */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <MapPin className="w-3 h-3 text-[#A7B1C4]" />
                <span className="text-xs text-[#A7B1C4]">{member.location}</span>
              </div>

              {/* Bio */}
              <p className="body-text text-sm mt-4 text-center line-clamp-4">
                {member.bio}
              </p>

              {/* Summits */}
              <div className="mt-4 pt-4 border-t border-[#1E293B]">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Award className="w-3 h-3 text-[#D4A23A]" />
                  <span className="text-xs font-mono tracking-wider text-[#A7B1C4] uppercase">Notable Summits</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {member.summits.filter(s => s.trim()).map((summit) => (
                    <span
                      key={summit}
                      className="px-2 py-0.5 text-xs font-mono bg-[#D4A23A]/10 text-[#D4A23A] border border-[#D4A23A]/20"
                    >
                      {summit}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
