import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Mail, MapPin, Phone, Instagram, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { submitContactForm, subscribeNewsletter } from '@/lib/database'

interface ContactSectionProps {
  className?: string
  id?: string
}

export default function ContactSection({ className = '', id }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      const triggers: { kill: () => void }[] = []

      const leftTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            leftColRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }
          )
        },
        once: true,
      })
      triggers.push(leftTrigger)

      const rightTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            rightColRef.current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power2.out' }
          )
        },
        once: true,
      })
      triggers.push(rightTrigger)

      const footerTrigger = ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(
            footerRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          )
        },
        once: true,
      })
      triggers.push(footerTrigger)

      return () => {
        triggers.forEach((t) => t.kill())
      }
    }

    const timer = setTimeout(initGSAP, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await submitContactForm({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    })

    if (error) {
      setDialogMessage('Something went wrong. Please try again.')
    } else {
      setDialogMessage('Thank you for reaching out! We will get back to you within 48 hours.')
    }

    setShowDialog(true)
    setFormData({ name: '', email: '', message: '' })
    setSubmitting(false)
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribing(true)

    const { error } = await subscribeNewsletter(newsletterEmail)

    if (error) {
      setDialogMessage('Something went wrong. Please try again.')
    } else {
      setDialogMessage('You have been subscribed to our quarterly updates!')
    }

    setShowDialog(true)
    setNewsletterEmail('')
    setSubscribing(false)
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative bg-[#0B0F17] py-[10vh] ${className}`}
    >
      <div className="mx-[4vw] hairline mb-[6vh]" />

      <div className="px-[4vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div ref={leftColRef} className="opacity-0">
            <h2 className="headline-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
              CONTACT THE CLUB
            </h2>
            <p className="body-text mt-6 max-w-md">
              Ask about membership, expeditions, or partnerships. We reply within 48 hours.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#D4A23A]" />
                <span className="text-[#F2F5FA]">info@karakoramalpine.club</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-[#D4A23A]" />
                <span className="text-[#F2F5FA]">+92 123 456 7890</span>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#D4A23A] mt-1" />
                <span className="text-[#F2F5FA]">
                  Karakoram Alpine Club<br />
                  Karim abad, Pakistan
                </span>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <a href="https://www.instagram.com/karakoramalpineclub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#1E293B] flex items-center justify-center text-[#A7B1C4] hover:text-[#D4A23A] hover:border-[#D4A23A] transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a href="https://twitter.com/karakoramalpine" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#1E293B] flex items-center justify-center text-[#A7B1C4] hover:text-[#D4A23A] hover:border-[#D4A23A] transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a> */}
            </div>

            <div className="mt-12">
              <h3 className="font-display font-semibold text-lg text-[#F2F5FA] mb-4">
                Get quarterly updates
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 max-w-xs"
                  required
                />
                <button type="submit" disabled={subscribing} className="btn-primary flex items-center gap-2">
                  <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div ref={rightColRef} className="opacity-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-mono block mb-2">NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="label-mono block mb-2">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="label-mono block mb-2">MESSAGE</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full resize-none"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div ref={footerRef} className="mt-20 pt-8 border-t border-[#1E293B] opacity-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="caption-mono text-center md:text-left">
              © {new Date().getFullYear()} Karakoram Alpine Club. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/about" className="caption-mono hover:text-[#D4A23A] transition-colors">
                About
              </Link>
              <Link to="/events" className="caption-mono hover:text-[#D4A23A] transition-colors">
                Events
              </Link>
              <Link to="/team" className="caption-mono hover:text-[#D4A23A] transition-colors">
                Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#141B26] border-[#1E293B] text-[#F2F5FA]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Message Sent</DialogTitle>
            <DialogDescription className="body-text">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
