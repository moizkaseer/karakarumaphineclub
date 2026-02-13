import { useEffect, useState } from 'react'

type GSAPInstance = typeof window.gsap
type ScrollTriggerInstance = typeof window.ScrollTrigger

export const useGSAP = () => {
  const [gsapInstance, setGsapInstance] = useState<GSAPInstance | null>(null)
  const [scrollTriggerInstance, setScrollTriggerInstance] = useState<ScrollTriggerInstance | null>(null)

  useEffect(() => {
    const syncGsap = () => {
      if (!window.gsap || !window.ScrollTrigger) return

      window.gsap.registerPlugin(window.ScrollTrigger)
      window.ScrollTrigger.refresh()
      setGsapInstance(window.gsap)
      setScrollTriggerInstance(window.ScrollTrigger)
    }

    syncGsap()
    const timer = window.setTimeout(syncGsap, 500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance }
}

export const useScrollAnimation = (
  animationCallback: (gsap: GSAPInstance, scrollTrigger: ScrollTriggerInstance) => void
) => {
  useEffect(() => {
    const initAnimation = () => {
      if (!window.gsap || !window.ScrollTrigger) return
      animationCallback(window.gsap, window.ScrollTrigger)
    }

    initAnimation()
    const timer = window.setTimeout(initAnimation, 600)

    return () => {
      window.clearTimeout(timer)
    }
  }, [animationCallback])
}

export default useGSAP
