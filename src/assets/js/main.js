// Import CSS (required for Vite bundling)
import '../css/main.css';

// Import Alpine.js and plugins
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

Alpine.plugin(collapse);

window.Alpine = Alpine;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Alpine.start());
} else {
  Alpine.start();
}

// ---------------------------------------------------------------------------
// Motion layer
//
// Lenis, GSAP and ScrollTrigger are only ever imported when the user has NOT
// asked for reduced motion — reduced motion here means "these never load",
// not "load them but shorten them" (CLAUDE.md §5, motion section).
//
// Reveals (fade-up / hairline draw) are plain CSS transitions triggered by
// an IntersectionObserver and work identically whether or not GSAP is present.
// GSAP only adds three specific, purposeful moments — the hero entrance
// choreography, the "At a Glance" stagger, and a slow facet-field parallax —
// none of which gate content visibility: every element it touches renders
// fully visible in the base HTML/CSS and is only hidden-then-revealed once
// GSAP has actually loaded and run.
// ---------------------------------------------------------------------------

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  import('lenis').then(({ default: Lenis }) => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/CustomEase'),
  ]).then(([{ gsap }, { ScrollTrigger }, { CustomEase }]) => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    // The exact same curve as the CSS `ease-signature` utility (tailwind.config.js) —
    // one signature easing curve, shared between CSS transitions and JS timelines.
    CustomEase.create('signature', '.23,1,.32,1');

    // Hero entrance — a real sequence instead of a uniform fade-up stagger.
    // [data-hero-in] elements carry no hiding CSS of their own; only once this
    // code has actually run do they get set to opacity:0 and animated in.
    const heroEls = gsap.utils.toArray('[data-hero-in]');
    if (heroEls.length) {
      gsap.set(heroEls, { opacity: 0, y: 14 });
      gsap.timeline({ defaults: { ease: 'signature', duration: 0.7 } })
        .to(heroEls, { opacity: 1, y: 0, stagger: 0.12 });
    }

    // Header scroll-progress line — real scroll fraction, not a decorative
    // loop. No `trigger` means it tracks the whole document (start 0, end max).
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
      gsap.to(scrollProgress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    }

    // Facet-field texture — a slow, ambient parallax drift on the texture
    // only, never the content sitting on top of it (CLAUDE.md: ambient loops
    // belong in the 2000ms+ tier; this is the scroll-scrubbed equivalent).
    gsap.utils.toArray('.facet-field').forEach((field) => {
      const section = field.closest('section');
      if (!section) return;
      gsap.to(field, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    });
  });
}

// Elements start fully visible in the CSS (see main.css). Only once JS has actually run
// do we "arm" them into the hidden pre-reveal state and start observing — so a no-JS
// visitor, a crawler, or a screenshot tool that doesn't simulate real scrolling all see
// the complete, correct page rather than content stuck at opacity:0.
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('fade-up')) el.dataset.revealed = 'true';
        if (el.classList.contains('grow-line')) el.dataset.drawn = 'true';
        revealObserver.unobserve(el);
      }
    }
  },
  { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.fade-up, .grow-line').forEach((el, i) => {
  el.style.animationDelay = prefersReducedMotion ? '0ms' : `${Math.min(i * 60, 300)}ms`;
  el.classList.add('js-armed');
  revealObserver.observe(el);
});
