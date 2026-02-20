import { useEffect } from 'react'
import ContactSection from '@/sections/ContactSection'

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative pt-24">
      <ContactSection />
    </main>
  )
}
