import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mountain, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <Mountain className="w-16 h-16 text-[#D4A23A]/40 mb-8" />

      <h1
        className="headline-display text-center"
        style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
      >
        404
      </h1>

      <p className="font-display font-bold text-[#D4A23A] uppercase tracking-[0.3em] mt-2 text-sm">
        TRAIL NOT FOUND
      </p>

      <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#D4A23A] to-transparent" />

      <p className="body-text mt-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back on the trail.
      </p>

      <Link
        to="/"
        className="btn-primary flex items-center gap-2 group mt-8"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Base Camp</span>
      </Link>
    </main>
  )
}
