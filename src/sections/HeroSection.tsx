import { useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  className?: string
  onJoinClick?: () => void
}

export default function HeroSection({ className = '', onJoinClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const bottomLeftRef = useRef<HTMLDivElement>(null)
  const bottomRightRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      // Split title into characters
      if (titleRef.current) {
        const text = titleRef.current.innerText
        titleRef.current.innerHTML = text
          .split('')
          .map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')
      }

      const chars = titleRef.current?.querySelectorAll('.char')

      // Entrance timeline - optimized
      const entranceTl = gsap.timeline({ delay: 0.2 })

      // Background entrance
      entranceTl.fromTo(
        bgRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      )

      // Title character stagger - optimized
      if (chars) {
        entranceTl.fromTo(
          chars,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.025,
            ease: 'power3.out',
          },
          0.3
        )
      }

      // Subheadline
      entranceTl.fromTo(
        subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.8
      )

      // CTAs
      entranceTl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.95
      )

      // Bottom elements
      entranceTl.fromTo(
        [bottomLeftRef.current, bottomRightRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        1.1
      )

      // Scroll-driven exit - optimized with fastScrollEnd
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
          fastScrollEnd: true,
          preventOverlaps: true,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set(bgRef.current, { opacity: 1, scale: 1, y: 0 })
            gsap.set([titleRef.current, subRef.current, ctaRef.current], { opacity: 1, y: 0 })
            gsap.set([bottomLeftRef.current, bottomRightRef.current], { opacity: 1 })
          },
        },
      })

      // Background exit
      scrollTl.fromTo(
        bgRef.current,
        { y: 0, scale: 1 },
        { y: '-8vh', scale: 1.05, ease: 'none' },
        0
      )

      // Content exit
      scrollTl.fromTo(
        [titleRef.current, subRef.current, ctaRef.current],
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.65
      )

      // Bottom elements fade
      scrollTl.fromTo(
        [bottomLeftRef.current, bottomRightRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      )

      return () => {
        ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill())
      }
    }

    const timer = setTimeout(initGSAP, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
      style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-gpvzeM0Kmgw?w=1920&q=85&fit=crop"
          alt="K2 Mountain Pakistan"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.85) contrast(1.1) brightness(0.85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/40 via-transparent to-[#0B0F17]/70" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="headline-display text-center"
          style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
        >
          KARAKORAM
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="label-mono mt-6 text-center"
        >
          ALPINE CLUB / EXPEDITION • CONSERVATION
        </p>

        {/* CTA Button */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <button
            onClick={onJoinClick}
            className="btn-primary flex items-center gap-2 group"
          >
            <span>Join the Club</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Bottom Left Microcopy */}
      <div
        ref={bottomLeftRef}
        className="absolute left-[4vw] bottom-[4.5vh] z-10 max-w-[34vw]"
      >
        <p className="caption-mono">
          Membership opens quarterly — limited spots available.
        </p>
      </div>

      {/* Bottom Right Scroll Hint */}
      <div
        ref={bottomRightRef}
        className="absolute right-[4vw] bottom-[4.5vh] z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="caption-mono">Scroll</span>
          <ChevronDown className="w-4 h-4 text-[#A7B1C4] animate-bounce" />
        </div>
      </div>
    </section>
  )
}
