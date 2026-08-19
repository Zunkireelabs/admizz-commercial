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
// Lenis is only ever imported/instantiated when the user has NOT asked for
// reduced motion — reduced motion here means "no smooth-scroll hijacking",
// not "shorter smooth-scroll hijacking" (CLAUDE.md §5, motion section).
//
// Reveals (fade-up / hairline draw) are plain CSS transitions triggered by
// an IntersectionObserver. Under reduced motion the CSS itself skips the
// @keyframes and jumps straight to the end state, so the observer still
// runs — it just produces an instant, jank-free result either way.
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
