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
        scrollTl.scrollTrigger?.kill()
        scrollTl.kill()
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
      {/* Panel — on mobile: full width overlay, on desktop: side panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 ${
          isTextLeft ? 'left-0' : 'right-0'
        } w-full md:w-[44vw] h-full bg-[#0B0F17] md:bg-[#0B0F17] z-[5] md:z-[5] hidden md:block`}
      />

      {/* Image — on mobile: full bleed behind content, on desktop: side panel */}
      <div
        ref={imageRef}
        className={`absolute inset-0 md:top-0 ${
          isTextLeft ? 'md:right-0 md:left-auto' : 'md:left-0 md:right-auto'
        } md:w-[56vw] h-full overflow-hidden z-[1]`}
      >
        <img
          src={image}
          alt={headline}
          className="w-full h-full object-cover object-top"
          width={1920}
          height={1080}
          loading="lazy"
          style={{ filter: 'saturate(0.8) contrast(1.1) brightness(0.85)' }}
        />
        {/* Mobile: full gradient overlay for readability. Desktop: directional gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0B0F17]/90 via-[#0B0F17]/60 to-[#0B0F17]/30 md:bg-gradient-to-${
            isTextLeft ? 'l' : 'r'
          } md:from-[#0B0F17]/50 md:via-transparent md:to-transparent`}
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

      {/* Text Content — mobile: centered over image, desktop: side panel */}
      <div
        className={`absolute left-[6vw] ${
          isTextLeft ? 'md:left-[6vw]' : 'md:left-[62vw]'
        } top-[30vh] md:top-[22vh] z-10 max-w-[88vw] md:max-w-[32vw]`}
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
