import './color-utils.js';
import './i18n.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)


document.addEventListener("DOMContentLoaded", function () {
  initHeroAnimations();
  initRevealAnimations();
  initAnchorNavigation();
});

function initHeroAnimations() {
  // Hero content animations
  gsap.from('.hero-greeting', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.2
  });

  gsap.from('.hero-name', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.4
  });

  gsap.from('.hero-tagline', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.6
  });

  gsap.from('.hero-tag', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.8
  });

  gsap.from('.hero-scroll-btn', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 1.2
  });
}

function initRevealAnimations() {
  // Reveal animations for sections with stagger
  gsap.utils.toArray('.reveal-up').forEach((el, index) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: (index % 3) * 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      }
    });
  });

  // Parallax effect for hobby images
  gsap.utils.toArray('.hobby-img-item img').forEach((img) => {
    gsap.to(img, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  // About photo parallax
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto) {
    gsap.to(aboutPhoto, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: aboutPhoto,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }
}

function initAnchorNavigation() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetTop, behavior: 'auto' });
        return;
      }

      lenis.scrollTo(targetTop, {
        duration: 0.35,
        lerp: 0.18
      });
    });
  });
}

function initModeToggle() {
  const btn = document.getElementById("mode-toggle");
  if (!btn) return;
  btn.textContent =
    document.documentElement.getAttribute("data-theme") === "dark" ? "🌙" : "☀️";

  btn.addEventListener("click", function () {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    
    if (isDark) {
      root.setAttribute("data-theme", "light");
      btn.textContent = "☀️";
    } else {
      root.setAttribute("data-theme", "dark");
      btn.textContent = "🌙";
    }
  });
}
