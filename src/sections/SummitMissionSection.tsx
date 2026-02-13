import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

interface SummitMissionSectionProps {
  className?: string
}

export default function SummitMissionSection({ className = '' }: SummitMissionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const hairlineRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const captionRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      // Create scroll-driven animation timeline - optimized
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.4,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      })

      // ENTRANCE (0% - 30%) - simplified for performance
      scrollTl.fromTo(
        bgRef.current,
        { x: '5vw', scale: 1.08, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo(
        hairlineRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0.05
      )

      scrollTl.fromTo(
        labelRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      )

      scrollTl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )

      scrollTl.fromTo(
        bodyRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      )

      scrollTl.fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      )

      scrollTl.fromTo(
        captionRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0.25
      )

      // EXIT (70% - 100%) - simplified
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.04, opacity: 0.3, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: '-8vw', opacity: 0, ease: 'power2.in', stagger: 0.01 },
        0.72
      )

      scrollTl.fromTo(
        [labelRef.current, captionRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.78
      )

      scrollTl.fromTo(
        hairlineRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      )

      return () => {
        ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill())
      }
    }

    const timer = setTimeout(initGSAP, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="summit-mission"
      className={`section-pinned ${className}`}
      style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0"
      >
        <img
          src="/passu_cones.jpg"
          alt="Climber on summit"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.75) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/70 via-[#0B0F17]/30 to-transparent" />
      </div>

      {/* Hairline */}
      <div
        ref={hairlineRef}
        className="absolute left-[4vw] right-[4vw] top-[10vh] hairline origin-left"
      />

      {/* Label */}
      <div className="absolute left-1/2 top-[7.2vh] -translate-x-1/2 z-10">
        <span
          ref={labelRef}
          className="label-mono"
        >
          SUMMIT MISSION
        </span>
      </div>

      {/* Content */}
      <div className="absolute left-[6vw] top-[22vh] z-10 max-w-[62vw]">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="headline-display"
          style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
        >
          CLIMB HIGHER.<br />LEAVE LESS.
        </h2>

        {/* Body */}
        <p
          ref={bodyRef}
          className="body-text mt-8 max-w-[34vw] text-base"
        >
          We organize human-powered ascents across the Karakoram and Himalaya—then 
          reinvest every surplus into trail restoration, waste removal, and local stewardship.
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="cta-underline flex items-center gap-2 mt-8 text-[#F2F5FA] font-medium"
        >
          <span>Read our charter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Caption */}
      <div className="absolute right-[4vw] bottom-[4.5vh] z-10 text-right">
        <span
          ref={captionRef}
          className="caption-mono"
        >
          K2 vicinity • 5,200 m
        </span>
      </div>
    </section>
  )
}
