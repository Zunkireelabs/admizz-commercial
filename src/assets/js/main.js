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
  Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/CustomEase'),
  ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }, { CustomEase }]) => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    // The exact same curve as the CSS `ease-signature` utility (tailwind.config.js) —
    // one signature easing curve, shared between CSS transitions and JS timelines.
    CustomEase.create('signature', '.23,1,.32,1');

    // Lenis and ScrollTrigger must share one clock and one scroll-notification
    // path, or every scrub/pin desyncs from what the visitor actually sees —
    // Lenis intercepts wheel/touch and animates scroll smoothly on its own
    // rAF loop, so ScrollTrigger never hears about it without this wiring.
    // Driving Lenis from gsap.ticker (instead of a separate raw rAF loop) is
    // what keeps both systems on the same frame.
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Hero entrance — a real sequence instead of a uniform fade-up stagger.
    // [data-hero-in] elements carry no hiding CSS of their own; only once this
    // code has actually run do they get set to opacity:0 and animated in.
    const heroEls = gsap.utils.toArray('[data-hero-in]');
    if (heroEls.length) {
      gsap.set(heroEls, { opacity: 0, y: 14 });
      gsap.timeline({ defaults: { ease: 'signature', duration: 0.7 } })
        .to(heroEls, { opacity: 1, y: 0, stagger: 0.12 });
    }

    // Header shape morph — simple full-width bar at the top, floating pill
    // once scroll starts (see header.njk comment for the margin-not-width
    // mechanism). Values are read from the live DOM at setup time — the
    // real computed gutter and the real available width — rather than
    // re-deriving the CSS clamp() formula here. Scrub, not a timed tween:
    // same "ease: none" pattern as every other scroll-tied effect below,
    // since the animation position IS the scroll position, not a curve
    // played back over time.
    const headerFrame = document.querySelector('.header-frame');
    const headerBar = document.querySelector('.header-bar');
    if (headerFrame && headerBar) {
      const topPad = window.innerWidth >= 768 ? 24 : 16;
      // Measured before the tween runs, so it's the frame's natural width at
      // zero margin (i.e. already inside the header's own gutter padding) —
      // reading this directly sidesteps clientWidth vs. content-box confusion.
      const availableWidth = headerFrame.getBoundingClientRect().width;
      const pillInset = Math.max(0, (availableWidth - 1152) / 2);

      gsap.timeline({ scrollTrigger: { start: 0, end: 140, scrub: 0.3 } })
        .fromTo(headerFrame,
          { marginLeft: 0, marginRight: 0, marginTop: 0 },
          { marginLeft: pillInset, marginRight: pillInset, marginTop: topPad, ease: 'none' },
          0)
        .fromTo(headerBar,
          { borderRadius: 0, boxShadow: '0 2px 4px rgba(16,25,43,0), 0 18px 40px -20px rgba(16,25,43,0)' },
          { borderRadius: 999, boxShadow: '0 2px 4px rgba(16,25,43,.05), 0 18px 40px -20px rgba(16,25,43,.24)', ease: 'none' },
          0);
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

    // Ventures sequence — the gold line draws in tied to real scroll
    // position across the three stages (not a one-shot reveal), and the
    // stage currently being read holds full presence while the others
    // recede. Genuine feedback about progress through Prepare → Study →
    // Work, not decoration. .js-scroll-armed is only added here, after GSAP
    // has actually loaded, so no-JS/reduced-motion visitors get every row
    // at full opacity from the base CSS.
    // Hero photo — very subtle scroll parallax, same scrub pattern as the
    // facet-field texture above; the photo drifts, everything layered on
    // top of it (badge, gradients) stays put.
    gsap.utils.toArray('.hero-photo-parallax').forEach((photo) => {
      const section = photo.closest('section');
      if (!section) return;
      gsap.to(photo, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    });

    gsap.utils.toArray('.grow-line').forEach((line) => {
      const sequence = line.closest('.relative');
      if (!sequence) return;
      gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: sequence, start: 'top 75%', end: 'bottom 65%', scrub: 0.4 },
      });
    });

    // Ecosystem story (homepage "One Ecosystem" section) — sticky photo
    // (plain CSS position:sticky, set in the markup, not GSAP pin) crossfades
    // as each text block scrolls to center. No pinning, no scroll-hijacking —
    // same trigger logic on every breakpoint, since sticky itself already
    // degrades to normal flow on mobile (.ecosystem-story-media is
    // hidden md:block there), so there's nothing extra to gate.
    const ecoGrid = document.querySelector('.ecosystem-story-grid');
    if (ecoGrid) {
      const ecoPhotos = gsap.utils.toArray('.ecosystem-story-photo', ecoGrid);
      const ecoBlocks = gsap.utils.toArray('.ecosystem-story-block', ecoGrid);
      const ecoTicks = gsap.utils.toArray('.ecosystem-progress-tick', ecoGrid);
      const ghostNum = ecoGrid.querySelector('.ecosystem-ghost-num');
      const ghostStage = ecoGrid.querySelector('.ecosystem-ghost-stage');
      ecoPhotos.forEach((p) => p.classList.add('ecosystem-armed'));
      ecoBlocks.forEach((b) => b.classList.add('ecosystem-armed'));
      ecoTicks.forEach((t) => t.classList.add('ecosystem-armed'));

      // `initial` skips the stagger reveal on setup (setEcoActive(0) below)
      // so block 1's content doesn't visibly flash in on page load — the
      // same reason the hero entrance only animates [data-hero-in] once
      // GSAP has actually loaded, never before. Real transitions (scrolling
      // to a new block, forward or back) always get the staggered reveal.
      const setEcoActive = (index, initial) => {
        ecoPhotos.forEach((p, i) => p.classList.toggle('is-active', i === index));
        ecoBlocks.forEach((b, i) => b.classList.toggle('is-active', i === index));
        ecoTicks.forEach((t, i) => t.classList.toggle('is-active', i === index));
        const block = ecoBlocks[index];
        if (block) {
          if (ghostNum) ghostNum.textContent = block.dataset.index;
          if (ghostStage) ghostStage.textContent = block.dataset.stage;
          if (!initial) {
            const fields = block.querySelectorAll('.eco-field');
            gsap.fromTo(fields, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.55, ease: 'signature' });
          }
        }
      };
      setEcoActive(0, true); // matches the no-JS default (venture 1 showing) — no flash on arm

      ecoBlocks.forEach((block, i) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => { if (self.isActive) setEcoActive(i); },
        });
      });
    }

    gsap.utils.toArray('.sequence-row').forEach((row) => {
      row.classList.add('js-scroll-armed');
      ScrollTrigger.create({
        trigger: row,
        start: 'top center',
        end: 'bottom center',
        toggleClass: { targets: row, className: 'is-active' },
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
        revealObserver.unobserve(el);
      }
    }
  },
  { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.style.animationDelay = prefersReducedMotion ? '0ms' : `${Math.min(i * 60, 300)}ms`;
  el.classList.add('js-armed');
  revealObserver.observe(el);
});
