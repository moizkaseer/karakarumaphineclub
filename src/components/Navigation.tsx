import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mountain, Menu, X, Lock } from 'lucide-react'

interface NavigationProps {
  onAdminClick: () => void
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Stories', path: '/stories' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 ${
          isScrolled
            ? 'top-4'
            : 'top-6'
        }`}
      >
        {/* Main Navigation Container */}
        <div
          className={`flex items-center gap-2 px-2 py-2 rounded-full transition-all duration-500 ${
            isScrolled
              ? 'bg-[#0B0F17]/85 backdrop-blur-md shadow-2xl shadow-black/30 border border-[#1E293B]/50'
              : 'bg-[#0B0F17]/40 backdrop-blur-sm border border-white/5'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300 group"
          >
            <Mountain className="w-5 h-5 text-[#D4A23A] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#F2F5FA] font-medium hidden sm:block">
              KARAKORAM
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-[#1E293B] hidden md:block" />

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-xs font-mono tracking-[0.12em] transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'text-[#D4A23A]'
                    : 'text-[#A7B1C4] hover:text-[#F2F5FA]'
                }`}
              >
                {item.label}
                {/* Active / hover underline */}
                <span className={`absolute bottom-1 left-4 right-4 h-px bg-[#D4A23A] transition-transform duration-300 origin-left ${
                  isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-[#1E293B] hidden md:block" />

          {/* Admin Button */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A23A]/30 text-[#D4A23A] hover:bg-[#D4A23A]/10 hover:border-[#D4A23A] transition-all duration-300 group"
          >
            <Lock className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-mono text-xs tracking-[0.1em] hidden sm:block">ADMIN</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#F2F5FA] hover:text-[#D4A23A] transition-colors rounded-full hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[999] bg-[#0B0F17]/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-mono text-xl tracking-[0.15em] transition-all duration-300 relative group ${
                isActive(item.path) ? 'text-[#D4A23A]' : 'text-[#F2F5FA] hover:text-[#D4A23A]'
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-[#D4A23A] transition-all duration-300 ${
                isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              onAdminClick()
            }}
            className="flex items-center gap-3 px-6 py-3 border border-[#D4A23A] text-[#D4A23A] mt-6 rounded-full hover:bg-[#D4A23A]/10 transition-all duration-300"
            style={{
              transitionDelay: isMobileMenuOpen ? '250ms' : '0ms',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <Lock className="w-4 h-4" />
            <span className="font-mono text-sm tracking-[0.1em]">ADMIN ACCESS</span>
          </button>
        </div>
      </div>
    </>
  )
}
