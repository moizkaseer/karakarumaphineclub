import { useState } from 'react'
import { X } from 'lucide-react'
import { submitMembershipApplication, type MembershipInsert } from '@/lib/database'

interface MembershipFormProps {
  isOpen: boolean
  onClose: () => void
}

type FormData = Omit<MembershipInsert, 'id' | 'created_at' | 'status' | 'notes'>

export default function MembershipForm({ isOpen, onClose }: MembershipFormProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    experience_level: 'beginner',
    climbing_history: '',
    motivation: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitMembershipApplication(formData)
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          location: '',
          experience_level: 'beginner',
          climbing_history: '',
          motivation: '',
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0B0F17]/95 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-2xl bg-[#151C2A] border border-[#1E293B] rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#151C2A] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#F2F5FA]">Join Karakoram Alpine Club</h2>
            <p className="text-sm text-[#A7B1C4] mt-1">
              Membership applications reviewed quarterly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#A7B1C4]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F2F5FA]">Personal Information</h3>

            <div>
              <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F2F5FA]">Climbing Experience</h3>

            <div>
              <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                Experience Level *
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors"
              >
                <option value="beginner">Beginner - New to climbing</option>
                <option value="intermediate">Intermediate - 1-3 years experience</option>
                <option value="advanced">Advanced - 3-5 years experience</option>
                <option value="expert">Expert - 5+ years, high-altitude experience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                Climbing History
              </label>
              <textarea
                name="climbing_history"
                value={formData.climbing_history || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors resize-none"
                placeholder="List any notable climbs, courses, certifications, or expeditions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                Why do you want to join? *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors resize-none"
                placeholder="Tell us about your passion for alpine climbing and why you want to be part of Karakoram Alpine Club..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#1E293B] text-[#A7B1C4] rounded-lg hover:bg-[#1E293B] transition-colors font-mono text-sm tracking-wider"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="flex-1 px-6 py-3 bg-[#D4A23A] text-[#0B0F17] rounded-lg hover:bg-[#E5B84B] transition-colors font-mono text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? '✓ SUBMITTED' : isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
            </button>
          </div>

          {submitted && (
            <div className="text-center text-sm text-[#4ADE80] font-mono">
              Application submitted successfully! We'll review it and get back to you.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
