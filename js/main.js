import './color-utils.js';
import './i18n.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Lenis from 'lenis';
import SplitType from 'split-type';

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
  initModeToggle();
});

function initHeroAnimations() {
  // Split text for hero title
  const text = new SplitType('.hero-title', { types: 'words, chars' });
  
  gsap.from(text.chars, {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.02,
    ease: "power4.out",
    delay: 0.2
  });

  gsap.from('.hero-desc', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.8
  });

  gsap.from('.btn-magnetic', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 1
  });

  // Magnetic button effect
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
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create abstract particles
  const geometry = new THREE.BufferGeometry();
  const count = 2000;
  const positions = new Float32Array(count * 3);
  
  for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.5,
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
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    
    // Interactive camera
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
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
  // Parallax Images
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

  // Bento Box reveal
  gsap.from('.bento-item', {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '#about',
      start: "top 70%",
    }
  });

  // Projects reveal
  gsap.utils.toArray('.project-item').forEach(project => {
    gsap.from(project, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: project,
        start: "top 80%",
      }
    });
  });
}

function initModeToggle() {
  const btn = document.getElementById("mode-toggle");
  if (!btn) return;

  btn.addEventListener("click", function () {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    
    if (isDark) {
      root.setAttribute("data-theme", "light");
      root.classList.remove("bg-dark-bg", "text-gray-100");
      root.classList.add("bg-white", "text-black");
      btn.textContent = "☀️";
    } else {
      root.setAttribute("data-theme", "dark");
      root.classList.remove("bg-white", "text-black");
      root.classList.add("bg-dark-bg", "text-gray-100");
      btn.textContent = "🌙";
    }
  });
}