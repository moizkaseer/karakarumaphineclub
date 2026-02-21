import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Mountain, Shield, Users, Compass, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'About — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      // Hero entrance
      gsap.fromTo(
        heroRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
      )

      // Mission section
      ScrollTrigger.create({
        trigger: missionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            missionRef.current?.children || [],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          )
        },
        once: true,
      })

      // Values cards
      ScrollTrigger.create({
        trigger: valuesRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            valuesRef.current?.children || [],
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
          )
        },
        once: true,
      })
    }

    const timer = setTimeout(initGSAP, 200)
    return () => clearTimeout(timer)
  }, [])

  const values = [
    {
      icon: Mountain,
      title: 'Alpine Excellence',
      description: 'We pursue the highest standards in mountaineering, from technical skill to physical preparation, ensuring every expedition is safe and rewarding.',
    },
    {
      icon: Shield,
      title: 'Conservation First',
      description: 'The Karakoram is our home. We organize regular cleanup drives, promote Leave No Trace principles, and work to protect these fragile ecosystems.',
    },
    {
      icon: Users,
      title: 'Community & Education',
      description: 'We mentor the next generation of climbers through training programs, youth outreach, and making mountaineering accessible to all skill levels.',
    },
    {
      icon: Compass,
      title: 'Responsible Exploration',
      description: 'Every expedition we lead respects local communities, supports regional economies, and contributes to the sustainable development of northern Pakistan.',
    },
  ]

  return (
    <main ref={sectionRef} className="relative pt-24 min-h-screen">
      {/* Hero */}
      <section className="px-[4vw] py-[8vh]" ref={heroRef}>
        <span className="label-mono block text-[#D4A23A]">
          EST. 2020
        </span>

        <h1
          className="headline-display mt-4"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}
        >
          ABOUT <span className="text-[#D4A23A]">THE CLUB</span>
        </h1>

        <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#D4A23A] to-transparent" />

        <p className="body-text mt-8 max-w-2xl text-base leading-loose">
          Karakoram Alpine Club was founded by a group of passionate mountaineers from
          Gilgit-Baltistan with a simple belief: that the mountains belong to everyone,
          and that those who climb them have a duty to protect them.
        </p>

        <p className="body-text mt-4 max-w-2xl text-base leading-loose">
          What started as informal weekend treks among friends has grown into a recognized
          alpine organization leading expeditions across the Karakoram range, running training
          programs for aspiring climbers, and organizing conservation efforts to keep these
          mountains pristine for future generations.
        </p>
      </section>

      {/* Mission */}
      <section className="px-[4vw] py-[8vh] bg-[#0F1520]">
        <div className="h-px bg-gradient-to-r from-[#D4A23A]/40 via-[#D4A23A]/20 to-transparent mb-[6vh]" />

        <div ref={missionRef}>
          <span className="label-mono block text-[#D4A23A]">
            OUR MISSION
          </span>

          <h2
            className="headline-display mt-4"
            style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
          >
            CLIMB HIGHER. PROTECT MORE.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
            <div>
              <p className="body-text text-base leading-loose">
                Our mission is to foster a community of alpine athletes dedicated to the responsible
                exploration, education, and environmental protection of the Karakoram and its
                surrounding ranges.
              </p>
              <p className="body-text text-base leading-loose mt-4">
                We believe that mountaineering builds character, discipline, and a deep respect for
                nature. Through organized expeditions, technical training, and conservation programs,
                we aim to make the mountains accessible while keeping them wild.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#D4A23A]/10 border border-[#D4A23A]/20 flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-[#D4A23A] text-lg">15+</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-[#F2F5FA]">Expeditions Completed</h4>
                  <p className="body-text text-sm">Across the Karakoram, Himalayas, and beyond</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#D4A23A]/10 border border-[#D4A23A]/20 flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-[#D4A23A] text-lg">50+</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-[#F2F5FA]">Active Members</h4>
                  <p className="body-text text-sm">Climbers, guides, and conservation volunteers</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#D4A23A]/10 border border-[#D4A23A]/20 flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-[#D4A23A] text-lg">5+</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-[#F2F5FA]">Cleanup Drives</h4>
                  <p className="body-text text-sm">Protecting the trails and base camps we depend on</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-[4vw] py-[8vh]">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4A23A]/20 to-[#D4A23A]/40 mb-[6vh]" />

        <span className="label-mono block text-[#D4A23A]">
          WHAT WE STAND FOR
        </span>

        <h2
          className="headline-display mt-4"
          style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
        >
          OUR VALUES
        </h2>

        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-[#141B26] border border-[#1E293B] border-l-2 border-l-[#D4A23A]/40 p-8 hover:border-[#D4A23A]/30 hover:shadow-lg hover:shadow-[#D4A23A]/5 transition-all duration-300"
            >
              <value.icon className="w-8 h-8 text-[#D4A23A] mb-4" />
              <h3 className="font-display font-bold text-lg text-[#F2F5FA]">{value.title}</h3>
              <p className="body-text text-sm mt-3 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-[4vw] py-[8vh] bg-[#0F1520]">
        <div className="h-px bg-gradient-to-r from-[#D4A23A]/40 via-[#D4A23A]/20 to-transparent mb-[6vh]" />
        <div className="text-center">
          <h2
            className="headline-display"
            style={{ fontSize: 'clamp(24px, 3.5vw, 48px)' }}
          >
            READY TO JOIN?
          </h2>
          <p className="body-text mt-4 max-w-md mx-auto">
            Whether you're an experienced climber or just starting out, there's a place for you in Karakoram Alpine Club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/team" className="btn-secondary flex items-center gap-2 group justify-center">
              <span>Meet the Team</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/join" className="btn-primary flex items-center gap-2 group justify-center">
              <span>Join the Club</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
