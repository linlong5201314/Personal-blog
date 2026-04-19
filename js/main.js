import './color-utils.js';
import './i18n.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
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
  initWebGLBackground();
  initScrollAnimations();
  initAnchorNavigation();
  initModeToggle();
});

function initHeroAnimations() {
  gsap.from('.hero-kicker', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out"
  });

  gsap.from('.hero-title', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.1
  });

  gsap.from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.25
  });

  gsap.from('.info-chip, .btn-magnetic, .hero-panel', {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.4
  });

  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

function initWebGLBackground() {
  const container = document.getElementById('webgl-canvas');
  if (
    !container ||
    window.innerWidth < 1024 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const count = 900;
  const positions = new Float32Array(count * 3);
  
  for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.018,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 5;

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0002;
    particles.rotation.y += 0.00035;
    camera.position.x += (mouseX * 0.22 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 0.18 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initScrollAnimations() {
  gsap.utils.toArray('[data-speed]').forEach(el => {
    gsap.to(el, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0,
      }
    });
  });

  gsap.utils.toArray('.reveal-card').forEach((card, index) => {
    gsap.from(card, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: index % 3 === 0 ? 0 : 0.05,
      scrollTrigger: {
        trigger: card,
        start: "top 86%",
      }
    });
  });
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
