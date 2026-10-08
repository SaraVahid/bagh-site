// BAGH: entry point.
// Styles load via <link> in index.html. Copy timing comes in phase 3.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FramePlayer, pickFrameUrls } from './js/frames.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scrolling. Lenis runs on GSAP's ticker so ScrollTrigger reads the
// same scroll position Lenis just rendered. Skipped for reduced motion
// (the full static fallback comes in phase 4).
if (!reduceMotion) {
  const lenis = new Lenis({ lerp: 0.08 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page links (nav, Discover) scroll smoothly too
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target);
    });
  });
}

// Scroll-scrubbed film
const canvas = document.querySelector('.stage__canvas');
const urls = pickFrameUrls();

if (urls.length) {
  const player = new FramePlayer(canvas, urls);
  const { ready } = player.preload();

  // Scroll through #film (hero top to bottle bottom) maps 0..1 onto the
  // frames. Lenis already smooths the scroll, so the frame follows progress
  // directly. onRefresh covers a reload part-way down the page.
  const sync = (self) => player.setProgress(self.progress);
  ScrollTrigger.create({
    trigger: '#film',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: sync,
    onRefresh: sync,
  });

  // Hand over from the hero still once the film can be scrubbed end to end
  ready.then(() => document.documentElement.classList.add('is-film-ready'));
} else {
  console.info('BAGH: no frames in assets/frames yet; showing the still.');
}

// Section heights use viewport units; recalc after fonts settle layout
document.fonts?.ready.then(() => ScrollTrigger.refresh());
