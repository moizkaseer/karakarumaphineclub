import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mountain,
  Users,
  Shield,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Smartphone,
  Copy,
  CheckCircle,
} from 'lucide-react'
import { submitMembershipApplication, type MembershipInsert } from '@/lib/database'

const MEMBERSHIP_FEE = 5000

const PAYMENT_PROVIDERS = [
  {
    id: 'jazzcash' as const,
    name: 'JazzCash',
    color: '#E5002B',
    account: '0300-1234567',
    accountTitle: 'Karakoram Alpine Club',
  },
  {
    id: 'easypaisa' as const,
    name: 'EasyPaisa',
    color: '#36B37E',
    account: '0345-1234567',
    accountTitle: 'Karakoram Alpine Club',
  },
  {
    id: 'nayapay' as const,
    name: 'NayaPay',
    color: '#6C5CE7',
    account: '0312-1234567',
    accountTitle: 'Karakoram Alpine Club',
  },
]

const BENEFITS = [
  {
    icon: Mountain,
    title: 'Guided Expeditions',
    description:
      'Access to organized expeditions across the Karakoram, Himalayas, and Hindu Kush with experienced guides.',
  },
  {
    icon: GraduationCap,
    title: 'Technical Training',
    description:
      'Rock climbing, ice climbing, high-altitude acclimatization, and rescue technique workshops throughout the year.',
  },
  {
    icon: Users,
    title: 'Community Network',
    description:
      'Connect with fellow climbers, find trek partners, and share experiences with a community that shares your passion.',
  },
  {
    icon: Shield,
    title: 'Conservation Impact',
    description:
      'Participate in cleanup drives and environmental programs that protect the mountains we love.',
  },
]

type PaymentMethod = 'jazzcash' | 'easypaisa' | 'nayapay'

interface PersonalInfo {
  full_name: string
  email: string
  phone: string
  location: string
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  climbing_history: string
  motivation: string
}

interface PaymentInfo {
  payment_method: PaymentMethod | null
  payment_phone: string
  payment_reference: string
}

export default function JoinPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)

  const [personal, setPersonal] = useState<PersonalInfo>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    experience_level: 'beginner',
    climbing_history: '',
    motivation: '',
  })

  const [payment, setPayment] = useState<PaymentInfo>({
    payment_method: null,
    payment_phone: '',
    payment_reference: '',
  })

  useEffect(() => {
    document.title = 'Join the Club — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  // GSAP animations
  useEffect(() => {
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      gsap.fromTo(
        heroRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
      )

      ScrollTrigger.create({
        trigger: benefitsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            benefitsRef.current?.querySelectorAll('.benefit-card') || [],
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
          )
        },
        once: true,
      })

      ScrollTrigger.create({
        trigger: formRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            formRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
          )
        },
        once: true,
      })
    }

    const timer = setTimeout(initGSAP, 200)
    return () => clearTimeout(timer)
  }, [])

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPersonal((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPayment((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPayment((prev) => ({ ...prev, payment_method: method }))
  }

  const copyAccountNumber = (account: string) => {
    navigator.clipboard.writeText(account.replace(/-/g, ''))
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  const canProceedStep1 =
    personal.full_name && personal.email && personal.phone && personal.location && personal.motivation

  const canProceedStep2 =
    payment.payment_method && payment.payment_phone && payment.payment_reference

  const goToStep = (s: number) => {
    setStep(s)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async () => {
    if (!canProceedStep2) return
    setIsSubmitting(true)

    try {
      const application: MembershipInsert = {
        full_name: personal.full_name,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        experience_level: personal.experience_level,
        climbing_history: personal.climbing_history || null,
        motivation: personal.motivation,
        payment_method: payment.payment_method,
        payment_phone: payment.payment_phone,
        payment_reference: payment.payment_reference,
        payment_status: 'pending',
        membership_fee: MEMBERSHIP_FEE,
      }

      await submitMembershipApplication(application)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProvider = PAYMENT_PROVIDERS.find((p) => p.id === payment.payment_method)

  const inputClass =
    'w-full px-4 py-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-[#F2F5FA] focus:outline-none focus:border-[#D4A23A] transition-colors placeholder:text-[#4A5568]'

  if (submitted) {
    return (
      <main className="relative pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#D4A23A]/10 border border-[#D4A23A]/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#D4A23A]" />
          </div>
          <h1
            className="headline-display"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            APPLICATION <span className="text-[#D4A23A]">SUBMITTED</span>
          </h1>
          <p className="body-text mt-4 text-base leading-relaxed">
            Thank you for applying to join Karakoram Alpine Club! We've received your application
            and payment reference. Our team will verify your payment and review your application
            within 3-5 business days.
          </p>
          <p className="body-text mt-3 text-sm">
            You'll receive an email at <span className="text-[#F2F5FA]">{personal.email}</span> once
            your membership is confirmed.
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 group mt-8"
          >
            <span>Back to Home</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="Climbing on the East Ridge of Mirshikar.webp"
            alt="Climbing on the East Ridge of Mirshikar"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'saturate(0.85) contrast(1.1) brightness(0.5)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/70 via-[#0B0F17]/30 to-[#0B0F17]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/40 via-transparent to-[#0B0F17]/40" />
        </div>

        {/* Content */}
        <div ref={heroRef} className="relative z-10 text-center px-6 max-w-3xl">
          <span className="label-mono block text-[#D4A23A]">MEMBERSHIP</span>

          <h1
            className="headline-display mt-4"
            style={{ fontSize: 'clamp(36px, 7vw, 90px)' }}
          >
            JOIN THE <span className="text-[#D4A23A]">EXPEDITION</span>
          </h1>

          <div className="mt-6 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4A23A] to-transparent" />

          <p className="body-text mt-6 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Become part of a community dedicated to alpine excellence, conservation, and the
            responsible exploration of the Karakoram.
          </p>

          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary inline-flex items-center gap-2 group mt-8"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-[4vw] py-[8vh] bg-[#0F1520]">
        <div className="h-px bg-gradient-to-r from-[#D4A23A]/40 via-[#D4A23A]/20 to-transparent mb-[6vh]" />

        <span className="label-mono block text-[#D4A23A]">WHY JOIN</span>
        <h2
          className="headline-display mt-4"
          style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
        >
          MEMBER BENEFITS
        </h2>

        <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="benefit-card bg-[#141B26] border border-[#1E293B] border-l-2 border-l-[#D4A23A]/40 p-8 hover:border-[#D4A23A]/30 hover:shadow-lg hover:shadow-[#D4A23A]/5 transition-all duration-300"
            >
              <benefit.icon className="w-8 h-8 text-[#D4A23A] mb-4" />
              <h3 className="font-display font-bold text-lg text-[#F2F5FA]">{benefit.title}</h3>
              <p className="body-text text-sm mt-3 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Fee Display */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-baseline gap-2 bg-[#141B26] border border-[#D4A23A]/20 px-8 py-5 rounded-lg">
            <span className="label-mono text-[#A7B1C4]">Annual Membership</span>
            <span className="font-display font-black text-3xl text-[#D4A23A]">
              PKR {MEMBERSHIP_FEE.toLocaleString()}
            </span>
            <span className="body-text text-sm">/year</span>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section ref={formRef} className="px-[4vw] py-[8vh]">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4A23A]/20 to-[#D4A23A]/40 mb-[6vh]" />

        <span className="label-mono block text-[#D4A23A]">APPLICATION</span>
        <h2
          className="headline-display mt-4"
          style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}
        >
          APPLY FOR MEMBERSHIP
        </h2>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mt-8 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                  step === s
                    ? 'bg-[#D4A23A] text-[#0B0F17]'
                    : step > s
                    ? 'bg-[#D4A23A]/20 text-[#D4A23A] border border-[#D4A23A]/40'
                    : 'bg-[#141B26] text-[#A7B1C4] border border-[#1E293B]'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span
                className={`font-mono text-xs tracking-wider hidden sm:block ${
                  step === s ? 'text-[#F2F5FA]' : 'text-[#A7B1C4]'
                }`}
              >
                {s === 1 ? 'PERSONAL INFO' : s === 2 ? 'PAYMENT' : 'CONFIRM'}
              </span>
              {s < 3 && (
                <div
                  className={`w-12 h-px ${
                    step > s ? 'bg-[#D4A23A]/40' : 'bg-[#1E293B]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-2xl">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F2F5FA]">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={personal.full_name}
                    onChange={handlePersonalChange}
                    required
                    className={inputClass}
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
                      value={personal.email}
                      onChange={handlePersonalChange}
                      required
                      className={inputClass}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={personal.phone}
                      onChange={handlePersonalChange}
                      required
                      className={inputClass}
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
                    value={personal.location}
                    onChange={handlePersonalChange}
                    required
                    className={inputClass}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F2F5FA]">Climbing Experience</h3>

                <div>
                  <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="experience_level"
                    value={personal.experience_level}
                    onChange={handlePersonalChange}
                    className={inputClass}
                  >
                    <option value="beginner">Beginner — New to climbing</option>
                    <option value="intermediate">Intermediate — 1-3 years experience</option>
                    <option value="advanced">Advanced — 3-5 years experience</option>
                    <option value="expert">Expert — 5+ years, high-altitude experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                    Climbing History
                  </label>
                  <textarea
                    name="climbing_history"
                    value={personal.climbing_history}
                    onChange={handlePersonalChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="List any notable climbs, courses, certifications, or expeditions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                    Why do you want to join? *
                  </label>
                  <textarea
                    name="motivation"
                    value={personal.motivation}
                    onChange={handlePersonalChange}
                    required
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your passion for alpine climbing..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => goToStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-primary flex items-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#F2F5FA]">Payment Method</h3>
              <p className="body-text text-sm">
                Select your preferred payment method and send{' '}
                <span className="text-[#D4A23A] font-bold">PKR {MEMBERSHIP_FEE.toLocaleString()}</span>{' '}
                to the account shown below. Then enter your transaction details.
              </p>

              {/* Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => selectPaymentMethod(provider.id)}
                    className={`relative p-5 rounded-lg border-2 transition-all duration-300 text-left ${
                      payment.payment_method === provider.id
                        ? 'border-[#D4A23A] bg-[#D4A23A]/5'
                        : 'border-[#1E293B] bg-[#141B26] hover:border-[#D4A23A]/30'
                    }`}
                  >
                    {payment.payment_method === provider.id && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-4 h-4 text-[#D4A23A]" />
                      </div>
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${provider.color}20` }}
                    >
                      <Smartphone className="w-5 h-5" style={{ color: provider.color }} />
                    </div>
                    <span className="font-display font-bold text-[#F2F5FA] block">
                      {provider.name}
                    </span>
                    <span className="text-xs text-[#A7B1C4] font-mono mt-1 block">
                      Mobile Wallet
                    </span>
                  </button>
                ))}
              </div>

              {/* Account Details */}
              {selectedProvider && (
                <div className="bg-[#141B26] border border-[#D4A23A]/20 rounded-lg p-6 space-y-4">
                  <h4 className="font-mono text-xs tracking-wider text-[#D4A23A] uppercase">
                    Send Payment To
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-[#A7B1C4] font-mono block mb-1">Account Title</span>
                      <span className="text-[#F2F5FA] font-medium">{selectedProvider.accountTitle}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#A7B1C4] font-mono block mb-1">
                        {selectedProvider.name} Number
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#F2F5FA] font-mono text-lg font-bold">
                          {selectedProvider.account}
                        </span>
                        <button
                          onClick={() => copyAccountNumber(selectedProvider.account)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          title="Copy number"
                        >
                          {copiedAccount ? (
                            <Check className="w-4 h-4 text-[#4ADE80]" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#A7B1C4]" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-[#A7B1C4] font-mono block mb-1">Amount</span>
                      <span className="text-[#D4A23A] font-display font-bold text-xl">
                        PKR {MEMBERSHIP_FEE.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-[#1E293B] my-4" />

                  <p className="text-xs text-[#A7B1C4] leading-relaxed">
                    Open your {selectedProvider.name} app, send{' '}
                    <span className="text-[#F2F5FA]">PKR {MEMBERSHIP_FEE.toLocaleString()}</span> to the
                    number above, then enter your details below.
                  </p>
                </div>
              )}

              {/* Payment Details Input */}
              {payment.payment_method && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                      Your {selectedProvider?.name} Number *
                    </label>
                    <input
                      type="tel"
                      name="payment_phone"
                      value={payment.payment_phone}
                      onChange={handlePaymentChange}
                      className={inputClass}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                      Transaction ID / Reference *
                    </label>
                    <input
                      type="text"
                      name="payment_reference"
                      value={payment.payment_reference}
                      onChange={handlePaymentChange}
                      className={inputClass}
                      placeholder="Enter your transaction reference number"
                    />
                    <p className="text-xs text-[#A7B1C4] mt-1">
                      You'll find this in your payment confirmation SMS or app notification.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => goToStep(1)}
                  className="btn-secondary flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => goToStep(3)}
                  disabled={!canProceedStep2}
                  className="btn-primary flex items-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Review Application</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#F2F5FA]">Review Your Application</h3>
              <p className="body-text text-sm">
                Please review your details before submitting.
              </p>

              {/* Personal Summary */}
              <div className="bg-[#141B26] border border-[#1E293B] rounded-lg p-6 space-y-3">
                <h4 className="font-mono text-xs tracking-wider text-[#D4A23A] uppercase mb-4">
                  Personal Information
                </h4>
                <SummaryRow label="Name" value={personal.full_name} />
                <SummaryRow label="Email" value={personal.email} />
                <SummaryRow label="Phone" value={personal.phone} />
                <SummaryRow label="Location" value={personal.location} />
                <SummaryRow
                  label="Experience"
                  value={personal.experience_level.charAt(0).toUpperCase() + personal.experience_level.slice(1)}
                />
                {personal.climbing_history && (
                  <SummaryRow label="Climbing History" value={personal.climbing_history} />
                )}
                <SummaryRow label="Motivation" value={personal.motivation} />
              </div>

              {/* Payment Summary */}
              <div className="bg-[#141B26] border border-[#1E293B] rounded-lg p-6 space-y-3">
                <h4 className="font-mono text-xs tracking-wider text-[#D4A23A] uppercase mb-4">
                  Payment Details
                </h4>
                <SummaryRow label="Method" value={selectedProvider?.name || ''} />
                <SummaryRow label="Your Number" value={payment.payment_phone} />
                <SummaryRow label="Transaction ID" value={payment.payment_reference} />
                <SummaryRow label="Amount" value={`PKR ${MEMBERSHIP_FEE.toLocaleString()}`} />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => goToStep(2)}
                  className="btn-secondary flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  {!isSubmitting && (
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-xs font-mono text-[#A7B1C4] shrink-0 sm:w-32">{label}</span>
      <span className="text-sm text-[#F2F5FA] whitespace-pre-wrap">{value}</span>
    </div>
  )
}
