import { useState, useEffect } from 'react'
import { Mountain, Menu, X, Lock } from 'lucide-react'

interface NavigationProps {
  onAdminClick: () => void
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { label: 'Expeditions', id: 'expeditions' },
    { label: 'Conservation', id: 'conservation' },
    { label: 'Training', id: 'training' },
    { label: 'Stories', id: 'stories' },
    { label: 'Contact', id: 'contact' },
  ]

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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300 group"
          >
            <Mountain className="w-5 h-5 text-[#D4A23A] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#F2F5FA] font-medium hidden sm:block">
              KARAKORAM
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-[#1E293B] hidden md:block" />

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-4 py-2 text-xs font-mono tracking-[0.12em] text-[#A7B1C4] hover:text-[#F2F5FA] transition-all duration-300 group"
              >
                {item.label}
                {/* Hover underline */}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-[#D4A23A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
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
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="font-mono text-xl tracking-[0.15em] text-[#F2F5FA] hover:text-[#D4A23A] transition-all duration-300 relative group"
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4A23A] group-hover:w-full transition-all duration-300" />
            </button>
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
