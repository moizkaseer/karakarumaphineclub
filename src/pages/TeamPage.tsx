import { useEffect } from 'react'
import TeamSection from '@/sections/TeamSection'

export default function TeamPage() {
  useEffect(() => {
    document.title = 'Our Team — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative pt-24">
      <TeamSection />
    </main>
  )
}
