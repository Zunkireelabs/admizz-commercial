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

    // Statement band — same hide-then-reveal idiom as the hero entrance
    // above (direct gsap.set, not the .fade-up/IntersectionObserver
    // pattern), just ScrollTrigger-gated instead of firing on load, since
    // this section isn't in the initial viewport. Phrase-by-phrase, not
    // word-by-word — matches the hero's stagger feel exactly (same
    // duration/ease/stagger values) rather than inventing a new rhythm.
    const statementLines = gsap.utils.toArray('.statement-line');
    if (statementLines.length) {
      gsap.set(statementLines, { opacity: 0, y: 14 });
      gsap.timeline({
        defaults: { ease: 'signature', duration: 0.7 },
        scrollTrigger: { trigger: statementLines[0].closest('section'), start: 'top 70%' },
      }).to(statementLines, { opacity: 1, y: 0, stagger: 0.12 });
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
            // Slides in from the side (x), not up (y) — a deliberate ask,
            // and it also reads better here: this column sits beside a
            // full-height photo, so a horizontal arrival feels connected to
            // it in a way a vertical one didn't.
            const fields = block.querySelectorAll('.eco-field');
            gsap.fromTo(fields, { opacity: 0, x: 32 }, { opacity: 1, x: 0, stagger: 0.07, duration: 0.6, ease: 'signature' });
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

    // Story journey ("Our Story") — the card track advances as the visitor
    // scrolls the page itself: ScrollTrigger pins the panel for a bounded
    // extra stretch of scroll and scrubs the track horizontally across it,
    // then releases back to normal page scroll. Deliberately the one
    // scroll-linked pin on this page — a company timeline is exactly the
    // "keep scrolling to see what happened next" case that justifies it,
    // versus the ecosystem section's plain sticky-photo (no pin) elsewhere.
    // Mobile gets native overflow-x scroll instead (no pin/Draggable there)
    // — same "don't force the desktop interaction onto small screens" call
    // as the rest of this page.
    const storyGlass = document.querySelector('.story-glass');
    if (storyGlass && window.innerWidth >= 768) {
      const track = storyGlass.querySelector('.story-track');
      const viewport = storyGlass.querySelector('.story-track-viewport');
      const cards = gsap.utils.toArray('.story-card', storyGlass);
      const nodes = gsap.utils.toArray('.story-node', storyGlass);
      const fill = storyGlass.querySelector('.story-scrubber-fill');
      const prevBtn = storyGlass.querySelector('.story-prev');
      const nextBtn = storyGlass.querySelector('.story-next');
      nodes.forEach((n) => n.classList.add('story-armed'));
      cards.forEach((c) => c.classList.add('story-armed'));

      const maxScroll = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      let currentIndex = 0;

      const updateProgress = (progress) => {
        const x = -maxScroll() * progress;
        gsap.set(track, { x });
        gsap.set(fill, { width: `${progress * 100}%` });
        currentIndex = Math.min(cards.length - 1, Math.round(progress * (cards.length - 1)));
        nodes.forEach((n, i) => n.classList.toggle('is-active', i === currentIndex));
        cards.forEach((c, i) => c.classList.toggle('is-active', i === currentIndex));
      };

      // Offset clears the fixed header (it overlays the page at all scroll
      // positions, pill or full-width) so the pinned panel doesn't tuck
      // underneath it.
      const headerClearance = () => (document.querySelector('.header-bar')?.offsetHeight || 72) + 24;

      const st = ScrollTrigger.create({
        trigger: storyGlass,
        start: () => `top top+=${headerClearance()}`,
        end: () => '+=' + Math.max(window.innerHeight * (cards.length - 1) * 0.7, 480),
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        onUpdate: (self) => updateProgress(self.progress),
      });

      const scrollToIndex = (index) => {
        const clamped = gsap.utils.clamp(0, cards.length - 1, index);
        const progress = cards.length > 1 ? clamped / (cards.length - 1) : 0;
        const target = st.start + progress * (st.end - st.start);
        window.scrollTo({ top: target, behavior: 'smooth' });
      };

      prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
      nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

      updateProgress(0);
    }

    // Story journey particle layer — a subtle, slow-drifting depth field of
    // gold points behind the glass panel, with gentle mouse parallax. A
    // deliberate, explicit override of this project's own no-gratuitous-3D
    // rule (see story-journey.njk header comment); kept intentionally
    // restrained (low point count, low opacity, slow motion) rather than
    // leaning on the override as license for a showy effect.
    const particleCanvas = document.querySelector('.story-particles');
    if (particleCanvas) {
      import('three').then(({ Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points }) => {
        const section = particleCanvas.closest('section');
        const scene = new Scene();
        const camera = new PerspectiveCamera(50, particleCanvas.clientWidth / Math.max(1, particleCanvas.clientHeight), 0.1, 100);
        camera.position.z = 12;
        const renderer = new WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const count = 200;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 30;
          positions[i + 1] = (Math.random() - 0.5) * 16;
          positions[i + 2] = (Math.random() - 0.5) * 14;
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        const material = new PointsMaterial({ color: 0xfdd63f, size: 0.045, transparent: true, opacity: 0.45 });
        const points = new Points(geometry, material);
        scene.add(points);

        let mouseX = 0;
        let mouseY = 0;
        section.addEventListener('mousemove', (e) => {
          const rect = section.getBoundingClientRect();
          mouseX = (e.clientX - rect.left) / rect.width - 0.5;
          mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        });

        function resize() {
          const w = particleCanvas.clientWidth;
          const h = particleCanvas.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / Math.max(1, h);
          camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        let visible = true;
        new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(section);

        gsap.ticker.add(() => {
          if (!visible) return;
          points.rotation.y += 0.0006;
          camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
          camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
          camera.lookAt(scene.position);
          renderer.render(scene, camera);
        });
      });
    }


    // -----------------------------------------------------------------
    // /ventures/ — "The Record"
    //
    // Page-scoped: the whole block is behind DOM checks, so no other page
    // pays for it and DrawSVGPlugin is only fetched where it's used (same
    // lazy pattern as the Three.js layer above).
    //
    // Everything here animates elements that are ALREADY FULLY RENDERED in
    // the base HTML/CSS. GSAP sets the hidden/undrawn state itself, and only
    // after the plugin has actually resolved — so a no-JS visitor, a crawler
    // or a screenshotter sees the finished page, never a blank one.
    // -----------------------------------------------------------------
    const ventureRecords = gsap.utils.toArray('[data-venture-record]');
    const fieldDiagram = document.querySelector('[data-field-diagram]');

    if (ventureRecords.length || fieldDiagram) {
      import('gsap/DrawSVGPlugin').then(({ DrawSVGPlugin }) => {
        gsap.registerPlugin(DrawSVGPlugin);

        // Field diagram — the three circles describe themselves in sequence,
        // then the mark and labels settle into the shared centre. It's in the
        // initial viewport, so this runs on load rather than on scroll.
        if (fieldDiagram) {
          const circles = gsap.utils.toArray('.field-circle', fieldDiagram);
          const nodes = gsap.utils.toArray('.field-node', fieldDiagram);
          const mark = fieldDiagram.querySelector('.field-mark');
          gsap.set(circles, { drawSVG: '0%' });
          // xPercent/yPercent, NOT a bare `y` on top of a CSS translate:
          // GSAP rewrites the element's whole transform, so a CSS
          // translate(-50%,-50%) it also animates is silently discarded —
          // that dropped a label onto a circle's arc once already. Handing
          // GSAP the centring explicitly keeps both in agreement, and the
          // CSS transform still holds for the no-JS case.
          gsap.set(nodes, { xPercent: -50, yPercent: -50, opacity: 0, y: 8 });
          if (mark) gsap.set(mark, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.9 });

          // Circles describe themselves, then the labels name each field, and
          // the mark settles into the shared centre last — the diagram
          // assembling in the order it reads.
          gsap.timeline({ defaults: { ease: 'signature' }, delay: 0.25 })
            .to(circles, { drawSVG: '100%', duration: 1.1, stagger: 0.14 }, 0)
            .to(nodes, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.55)
            .to(mark, { opacity: 1, scale: 1, duration: 0.6 }, 0.95);
        }

        ventureRecords.forEach((record) => {
          const head = record.querySelector('.venture-head');
          const plate = record.querySelector('.venture-plate');
          const name = record.querySelector('[data-venture-name]');
          const ledgerRows = gsap.utils.toArray('.venture-ledger-row, .icef-seal', record);

          const tl = gsap.timeline({
            defaults: { ease: 'signature' },
            scrollTrigger: { trigger: record, start: 'top 76%' },
          });

          if (head) {
            gsap.set(head, { opacity: 0 });
            tl.to(head, { opacity: 1, duration: 0.5 }, 0);
          }
          // The plate lifts and settles rather than fading — a physical
          // object being laid onto the record, matching what it is.
          if (plate) {
            gsap.set(plate, { opacity: 0, y: 20 });
            tl.to(plate, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
          }
          if (name) {
            gsap.set(name, { opacity: 0, y: 14 });
            tl.to(name, { opacity: 1, y: 0, duration: 0.7 }, 0.2);
          }
          // Ledger rows arrive in sequence, the way a list is read rather
          // than the way a block appears.
          if (ledgerRows.length) {
            gsap.set(ledgerRows, { opacity: 0, y: 10 });
            tl.to(ledgerRows, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.3);
          }
        });

        // ICEF seal — ring, then the check struck into it. Sequenced rather
        // than simultaneous so it reads as a mark being made: the credential
        // is the most load-bearing fact on this site and earns its own beat.
        const seal = document.querySelector('[data-icef-seal]');
        if (seal) {
          const ring = seal.querySelector('.icef-ring');
          const check = seal.querySelector('.icef-check');
          const marks = [ring, check].filter(Boolean);
          if (marks.length) {
            gsap.set(marks, { drawSVG: '0%' });
            gsap.timeline({
              defaults: { ease: 'signature' },
              scrollTrigger: { trigger: seal, start: 'top 85%' },
            })
              .to(ring, { drawSVG: '100%', duration: 0.8 }, 0)
              .to(check, { drawSVG: '100%', duration: 0.45 }, 0.4);
          }
        }
      });
    }

    // -----------------------------------------------------------------
    // /about/ — "Our Story" timeline
    //
    // Page-scoped: gated behind a DOM check so no other page pays for it.
    // The connecting line is scroll-SCRUBBED, not a one-shot reveal — same
    // exception the ventures/positions line uses (see the comment block
    // above .fade-up in main.css): it carries no hiding CSS of its own,
    // its resting state IS scaleY(1), and GSAP sets it to 0 itself only
    // once this code has actually run, right before scrubbing it back as
    // the visitor scrolls the section. No DrawSVGPlugin needed here, so
    // this sits outside the conditional import above.
    // -----------------------------------------------------------------
    const storyTimeline = document.querySelector('[data-story-timeline]');
    if (storyTimeline) {
      const line = storyTimeline.querySelector('.story-timeline-line');
      const rows = gsap.utils.toArray('.story-timeline-row', storyTimeline);

      if (line) {
        gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: storyTimeline, start: 'top 65%', end: 'bottom 75%', scrub: 0.4 },
        });
      }

      // Each row (dot, text, photo) arrives as its own beat rather than
      // simultaneously — same idiom as the ventures records above.
      rows.forEach((row) => {
        const dot = row.querySelector('.story-timeline-dot');
        const body = row.querySelector('.story-timeline-body');
        const photo = row.querySelector('.story-timeline-photo');
        const tl = gsap.timeline({
          defaults: { ease: 'signature' },
          scrollTrigger: { trigger: row, start: 'top 82%' },
        });
        if (dot) { gsap.set(dot, { scale: 0 }); tl.to(dot, { scale: 1, duration: 0.4 }, 0); }
        if (body) { gsap.set(body, { opacity: 0, y: 14 }); tl.to(body, { opacity: 1, y: 0, duration: 0.6 }, 0.05); }
        if (photo) { gsap.set(photo, { opacity: 0, y: 14 }); tl.to(photo, { opacity: 1, y: 0, duration: 0.6 }, 0.12); }

        // Ongoing scroll feedback, separate from the one-shot arrival above:
        // .is-active toggles as THIS row crosses the viewport centre, purely
        // additive (lift + shadow + dot pop — see main.css), so the row
        // that's actually being read stands off the page a little rather
        // than every row just sitting flat once revealed.
        ScrollTrigger.create({
          trigger: row,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => row.classList.toggle('is-active', self.isActive),
        });
      });
    }

    // -----------------------------------------------------------------
    // /about/ — business cards + leadership stat entrance. Plain, discrete
    // reveals (not scroll-scrubbed), same gsap.set-then-animate idiom as
    // the hero above — gated so only /about/ pays for it.
    // -----------------------------------------------------------------
    const storyVentureCards = gsap.utils.toArray('[data-story-venture-card]');
    if (storyVentureCards.length) {
      gsap.set(storyVentureCards, { opacity: 0, y: 16 });
      gsap.timeline({
        defaults: { ease: 'signature', duration: 0.6 },
        scrollTrigger: { trigger: storyVentureCards[0].closest('section'), start: 'top 75%' },
      }).to(storyVentureCards, { opacity: 1, y: 0, stagger: 0.1 });
    }

    // -----------------------------------------------------------------
    // /about/ — Journey → Three Businesses card-stack handoff.
    //
    // The incoming section is already visually a "card" in pure CSS
    // (rounded top + shadow, main.css) — that part needs no JS and holds
    // even with motion off. What GSAP adds is timing: pin the outgoing
    // section briefly once its bottom reaches the viewport bottom, so the
    // next section's rounded edge visibly slides up and over it instead of
    // an instant cut. pinSpacing:false — the incoming section is already
    // next in normal flow, so no extra gap should open up while pinned.
    // -----------------------------------------------------------------
    const stackOutgoing = document.querySelector('[data-stack-outgoing]');
    if (stackOutgoing) {
      // The outgoing section itself shrinks and dims WHILE pinned — not
      // just sitting static underneath — so the handoff reads as one card
      // being tucked away behind the next, not a coincidental overlap.
      gsap.set(stackOutgoing, { transformOrigin: 'top center' });
      ScrollTrigger.create({
        trigger: stackOutgoing,
        start: 'bottom bottom',
        end: '+=400',
        pin: true,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          gsap.set(stackOutgoing, {
            scale: 1 - self.progress * 0.06,
            opacity: 1 - self.progress * 0.4,
          });
        },
        onLeaveBack: () => gsap.set(stackOutgoing, { scale: 1, opacity: 1 }),
      });
    }
  });
}

// Elements start fully visible in the CSS (see main.css). Only once JS has actually run
// do we "arm" them into the hidden pre-reveal state and start observing — so a no-JS
// visitor, a crawler, or a screenshot tool that doesn't simulate real scrolling all see
// the complete, correct page rather than content stuck at opacity:0.
//
// Stagger is computed PER GROUP, AT REVEAL TIME — not per document at load.
// The earlier version assigned `i * 60ms` capped at 300ms using each element's
// index across the whole document, once, on load. That produced two bugs:
//   1. Every .fade-up past the 5th on a page hit the 300ms cap and therefore
//      shared one delay, so they arrived SIMULTANEOUSLY — the uniform
//      everything-at-once reveal this system exists to avoid.
//   2. The delay was baked in at load but consumed on scroll, so a late
//      element sat idle for 300ms after entering view. That is lag, not rhythm.
// Elements that cross the threshold in the same observer callback are one
// visual beat-group: they are ordered by document position and staggered
// against each other. An element crossing alone gets 0ms and starts at once.
const REVEAL_STEP_MS = 110;  // gap between beats inside one group
const REVEAL_CAP_MS = 440;   // no element ever waits longer than this

// An element's group is its nearest explicit [data-reveal-group], else its
// nearest <section>. Opt a subtree out of its section's rhythm by marking it.
const revealGroupOf = (el) => el.closest('[data-reveal-group], section') || document.body;

const revealObserver = new IntersectionObserver(
  (entries) => {
    const arriving = entries.filter((entry) => entry.isIntersecting);
    if (!arriving.length) return;

    // Callback order is not guaranteed to be document order; sort so the
    // stagger always runs top-to-bottom, the direction the eye reads.
    arriving.sort((a, b) =>
      a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

    const beatsSoFar = new Map();
    for (const entry of arriving) {
      const el = entry.target;
      const group = revealGroupOf(el);
      const beat = beatsSoFar.get(group) ?? 0;
      beatsSoFar.set(group, beat + 1);

      if (el.classList.contains('fade-up')) {
        el.style.animationDelay = prefersReducedMotion
          ? '0ms'
          : `${Math.min(beat * REVEAL_STEP_MS, REVEAL_CAP_MS)}ms`;
        el.dataset.revealed = 'true';
      }
      revealObserver.unobserve(el);
    }
  },
  { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.fade-up').forEach((el) => {
  el.classList.add('js-armed');
  revealObserver.observe(el);
});
