import { useEffect, useRef } from 'react';

// Custom hook for GSAP animations
export const useGSAP = () => {
  const gsapRef = useRef<typeof window.gsap | null>(null);
  const scrollTriggerRef = useRef<typeof window.ScrollTrigger | null>(null);

  useEffect(() => {
    // Wait for GSAP to load from CDN
    const checkGSAP = () => {
      if (window.gsap && window.ScrollTrigger) {
        gsapRef.current = window.gsap;
        scrollTriggerRef.current = window.ScrollTrigger;
        
        // Register ScrollTrigger plugin
        window.gsap.registerPlugin(window.ScrollTrigger);
        
        // Refresh ScrollTrigger after setup
        window.ScrollTrigger.refresh();
      }
    };

    // Check immediately
    checkGSAP();

    // Also check after a short delay to ensure CDN scripts loaded
    const timer = setTimeout(checkGSAP, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { gsap: gsapRef.current, ScrollTrigger: scrollTriggerRef.current };
};

// Hook for creating scroll-triggered animations
export const useScrollAnimation = (
  animationCallback: (gsap: typeof window.gsap, scrollTrigger: typeof window.ScrollTrigger) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const initAnimation = () => {
      if (window.gsap && window.ScrollTrigger) {
        animationCallback(window.gsap, window.ScrollTrigger);
      }
    };

    // Try immediately
    initAnimation();

    // Retry after delay
    const timer = setTimeout(initAnimation, 600);

    return () => {
      clearTimeout(timer);
    };
  }, deps);
};

export default useGSAP;
