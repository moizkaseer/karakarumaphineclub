import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import AdminPanel from './sections/AdminPanel'
import MembershipForm from './components/MembershipForm'
import { supabase } from './lib/supabase'
import { signOut } from './lib/database'

// Lazy-loaded pages — each page is only downloaded when the user navigates to it
const HomePage = lazy(() => import('./pages/HomePage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const StoriesPage = lazy(() => import('./pages/StoriesPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#D4A23A]/30 border-t-[#D4A23A] rounded-full animate-spin" />
        <span className="caption-mono text-[#D4A23A]">Loading...</span>
      </div>
    </div>
  )
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showMembershipForm, setShowMembershipForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(!!session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleAdminAccess = () => {
    setShowAdmin(true)
  }

  const handleAdminLogout = async () => {
    await signOut()
    setIsAdmin(false)
    setShowAdmin(false)
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
  }

  if (showAdmin) {
    return <AdminPanel isAdmin={isAdmin} onLogin={handleAdminLogin} onLogout={handleAdminLogout} onClose={() => setShowAdmin(false)} />
  }

  return (
    <div className="relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navigation onAdminClick={handleAdminAccess} />

      {/* Membership Form Modal */}
      <MembershipForm isOpen={showMembershipForm} onClose={() => setShowMembershipForm(false)} />

      {/* Routes — Suspense shows a spinner while a page chunk loads */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage onJoinClick={() => setShowMembershipForm(true)} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
