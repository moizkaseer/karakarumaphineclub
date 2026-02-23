import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Calendar, BookOpen, Users } from 'lucide-react'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const bottomLeftRef = useRef<HTMLDivElement>(null)
  const bottomRightRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap

      // Entrance timeline
      const entranceTl = gsap.timeline({ delay: 0.3 })

      // Background entrance
      entranceTl.fromTo(
        bgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
      )

      // Main title "KARAKORAM" — split into characters
      if (titleRef.current) {
        const mainTitle = titleRef.current.querySelector('.hero-main-title')
        if (mainTitle) {
          const text = mainTitle.textContent || ''
          mainTitle.innerHTML = text
            .split('')
            .map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('')

          const chars = mainTitle.querySelectorAll('.char')
          entranceTl.fromTo(
            chars,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: 'power3.out' },
            0.4
          )
        }
      }

      // Subtitle "ALPINE CLUB"
      entranceTl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0, letterSpacing: '0.3em' },
        { y: 0, opacity: 1, letterSpacing: '0.35em', duration: 0.7, ease: 'power2.out' },
        0.9
      )

      // Gold divider
      entranceTl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
        1.0
      )

      // Tagline
      entranceTl.fromTo(
        taglineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        1.1
      )

      // CTA buttons
      entranceTl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        1.25
      )

      // Quick nav links
      entranceTl.fromTo(
        linksRef.current?.children || [],
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        1.4
      )

      // Bottom elements
      entranceTl.fromTo(
        [bottomLeftRef.current, bottomRightRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        1.5
      )

      // Scroll-driven exit — pin hero and animate out on scroll
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
            gsap.set(bgRef.current, { opacity: 1, scale: 1, y: 0 })
            gsap.set([titleRef.current, subtitleRef.current, dividerRef.current, taglineRef.current, ctaRef.current, linksRef.current], { opacity: 1, y: 0 })
            gsap.set([bottomLeftRef.current, bottomRightRef.current], { opacity: 1 })
          },
        },
      })

      // Background parallax on scroll
      scrollTl.fromTo(
        bgRef.current,
        { y: 0, scale: 1 },
        { y: '-8vh', scale: 1.05, ease: 'none' },
        0
      )

      // Content slides up and fades out
      scrollTl.fromTo(
        [titleRef.current, subtitleRef.current, dividerRef.current, taglineRef.current, ctaRef.current, linksRef.current],
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
        scrollTl.scrollTrigger?.kill()
        scrollTl.kill()
        entranceTl.kill()
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
      <div ref={bgRef} className="absolute inset-0">
        <img
          src="hero.webp"
          alt="Karakoram Range, Pakistan"
          className="w-full h-full object-cover object-center"
          width={1920}
          height={1080}
          fetchPriority="high"
          style={{ filter: 'saturate(0.9) contrast(1.1) brightness(0.7)' }}
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/60 via-[#0B0F17]/20 to-[#0B0F17]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/30 via-transparent to-[#0B0F17]/30" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        {/* Title Block */}
        <div ref={titleRef} className="text-center">
          <h1
            className="hero-main-title headline-display text-center"
            style={{ fontSize: 'clamp(44px, 11vw, 140px)', lineHeight: 0.9 }}
          >
            KARAKORAM
          </h1>
        </div>

        {/* Subtitle */}
        <h2
          ref={subtitleRef}
          className="font-display font-bold text-center text-[#D4A23A] uppercase mt-3"
          style={{
            fontSize: 'clamp(16px, 3vw, 36px)',
            letterSpacing: '0.35em',
          }}
        >
          ALPINE CLUB
        </h2>

        {/* Gold Divider */}
        <div
          ref={dividerRef}
          className="mt-6 h-px bg-gradient-to-r from-transparent via-[#D4A23A] to-transparent"
          style={{ width: 'clamp(120px, 20vw, 280px)', transformOrigin: 'center' }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-6 text-center max-w-lg px-4 text-sm md:text-base leading-relaxed text-[#D4D8E2] drop-shadow-lg"
        >
          A community of alpine athletes dedicated to the responsible exploration
          and environmental protection of the Karakoram.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/join"
            className="btn-primary flex items-center gap-2 group"
          >
            <span>Join the Club</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="btn-secondary flex items-center gap-2 group"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Quick Navigation Links */}
        <div ref={linksRef} className="flex flex-wrap justify-center gap-6 mt-10">
          <Link
            to="/events"
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors duration-300 group"
          >
            <Calendar className="w-4 h-4 text-[#D4A23A]/70 group-hover:text-[#D4A23A]" />
            <span className="font-mono text-xs tracking-wider uppercase">Events</span>
          </Link>
          <Link
            to="/stories"
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors duration-300 group"
          >
            <BookOpen className="w-4 h-4 text-[#D4A23A]/70 group-hover:text-[#D4A23A]" />
            <span className="font-mono text-xs tracking-wider uppercase">Stories</span>
          </Link>
          <Link
            to="/team"
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors duration-300 group"
          >
            <Users className="w-4 h-4 text-[#D4A23A]/70 group-hover:text-[#D4A23A]" />
            <span className="font-mono text-xs tracking-wider uppercase">Our Team</span>
          </Link>
        </div>
      </div>

      {/* Bottom Left Microcopy */}
      <div ref={bottomLeftRef} className="absolute left-[4vw] bottom-[4.5vh] z-10 max-w-[80vw] md:max-w-[34vw]">
        <p className="caption-mono">
          Membership opens quarterly — limited spots available.
        </p>
      </div>

      {/* Bottom Right Scroll Hint */}
      <div ref={bottomRightRef} className="absolute right-[4vw] bottom-[4.5vh] z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="caption-mono">Scroll</span>
          <ChevronDown className="w-4 h-4 text-[#A7B1C4] animate-bounce" />
        </div>
      </div>
    </section>
  )
}
