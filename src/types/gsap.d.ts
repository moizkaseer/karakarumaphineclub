// GSAP Type Definitions for CDN usage

declare global {
  interface Window {
    gsap: typeof import('gsap');
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  }
}

export {};
