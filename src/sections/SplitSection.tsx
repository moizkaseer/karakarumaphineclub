import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

interface SplitSectionProps {
  className?: string
  label: string
  headline: string
  body: string
  cta: string
  caption: string
  image: string
  layout: 'text-left' | 'image-left'
  onCtaClick?: () => void
}

export default function SplitSection({
  className = '',
  label,
  headline,
  body,
  cta,
  caption,
  image,
  layout,
  onCtaClick
}: SplitSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const hairlineRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const captionRef = useRef<HTMLSpanElement>(null)

  const isTextLeft = layout === 'text-left'
  const sectionId = label.toLowerCase().replace(/\s+/g, '-')

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=115%',
          pin: true,
          scrub: 0.4,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      })

      // ENTRANCE
      scrollTl.fromTo(
        panelRef.current,
        { x: isTextLeft ? '-45vw' : '45vw' },
        { x: 0, ease: 'none' },
        0
      )

      scrollTl.fromTo(
        imageRef.current,
        { x: isTextLeft ? '50vw' : '-50vw', scale: 1.06, opacity: 0 },
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

      // EXIT
      scrollTl.fromTo(
        panelRef.current,
        { x: 0, opacity: 1 },
        { x: isTextLeft ? '-15vw' : '15vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: isTextLeft ? '-8vw' : '8vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in', stagger: 0.01 },
        0.75
      )

      scrollTl.fromTo(
        [labelRef.current, captionRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      )

      scrollTl.fromTo(
        hairlineRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.82
      )

      return () => {
        ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill())
      }
    }

    const timer = setTimeout(initGSAP, 300)
    return () => clearTimeout(timer)
  }, [isTextLeft])

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={`section-pinned ${className}`}
      style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 ${
          isTextLeft ? 'left-0' : 'right-0'
        } w-[44vw] h-full bg-[#0B0F17] z-[5]`}
      />

      {/* Image */}
      <div
        ref={imageRef}
        className={`absolute top-0 ${
          isTextLeft ? 'right-0' : 'left-0'
        } w-[56vw] h-full overflow-hidden z-[1]`}
      >
        <img
          src={image}
          alt={headline}
          className="w-full h-full object-cover object-top"
          style={{ filter: 'saturate(0.8) contrast(1.1) brightness(0.85)' }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-${
            isTextLeft ? 'l' : 'r'
          } from-[#0B0F17]/50 to-transparent`}
        />
      </div>

      {/* Hairline */}
      <div
        ref={hairlineRef}
        className="absolute left-[4vw] right-[4vw] top-[10vh] hairline z-10 origin-left"
      />

      {/* Label */}
      <div className="absolute left-1/2 top-[7.2vh] -translate-x-1/2 z-10">
        <span ref={labelRef} className="label-mono">
          {label}
        </span>
      </div>

      {/* Text Content */}
      <div
        className={`absolute ${
          isTextLeft ? 'left-[6vw]' : 'left-[62vw]'
        } top-[22vh] z-10 max-w-[32vw]`}
      >
        <h2
          ref={headlineRef}
          className="headline-display"
          style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
        >
          {headline}
        </h2>

        <p ref={bodyRef} className="body-text mt-8 text-base">
          {body}
        </p>

        <button
          ref={ctaRef}
          onClick={onCtaClick ?? (() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }))}
          className="cta-underline flex items-center gap-2 mt-8 text-[#F2F5FA] font-medium group"
        >
          <span>{cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Caption */}
      <div
        className={`absolute ${
          isTextLeft ? 'right-[4vw] text-right' : 'left-[4vw]'
        } bottom-[4.5vh] z-10`}
      >
        <span ref={captionRef} className="caption-mono">
          {caption}
        </span>
      </div>
    </section>
  )
}
