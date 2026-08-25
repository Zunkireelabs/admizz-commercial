# Resume prompt

Paste this into a fresh Claude Code session started in this repo.

---

```
We're rebuilding the Admizz Group website (admizz.com) — a complete digital experience
transformation, not a redesign. This is a long-running project with substantial prior work.

Before doing ANYTHING, read these files in order:

  1. ./docs/RESUME-PROMPT.md              ← this file, IN FULL — the "Quick state" section below
                                             the fence has the actual current blockers and open
                                             decisions; nothing below is optional context
  2. ./CLAUDE.md                          ← overrides the global ~/CLAUDE.md, which describes a
                                             DIFFERENT project (the Lead Gen CRM) and must be
                                             ignored in this repo
  3. ./docs/00-BRIEF.md                   ← the mission and creative north star
  4. ./docs/01-AUDIT.md                   ← verified admizz.com facts (has a stale-scope banner
                                             at the top — read it, the corrected scope is in
                                             CLAUDE.md §4, not this file's original framing)
  5. ./docs/02-DIRECTION.md               ← strategy, IA, the lookalike-test gate (§4), roadmap
                                             (§10 is stale — see Quick state below)
  6. ./docs/03-CONTENT-VERIFICATION.md    ← the field-by-field map used by /verify-admizz-content

Then tell me, in a short summary:
  - what phase we're in and what's blocking it (see Quick state below — it's current)
  - the four non-negotiables (CLAUDE.md §2)
  - what you think the single biggest open item is right now

Do not write any site code or touch the VPS until I've confirmed direction.

One more thing before you touch anything: across the last several sessions, one methodology has
proven itself over and over on this project and should be your default for any pixel-level or
interaction-level claim, not just something the previous session happened to do:
  - Measure, don't guess. Use Playwright (page.evaluate + getBoundingClientRect(), or reading
    computed styles) instead of eyeballing a screenshot or assuming CSS math. This session alone
    caught a silently-failing Tailwind utility class this way (see Quick state) — grep the actual
    compiled CSS output, don't assume a class you wrote compiled just because the build succeeded.
  - Test with real interaction, not synthetic shortcuts. Real wheel-scroll (page.mouse.wheel in a
    loop with waits), not window.scrollTo(), for anything Lenis/GSAP-driven. Real mouse down/move/
    up sequences for drag interactions — and measure the VISIBLE/clipped element's bounding box,
    not a full-width element that may extend off-screen (this session's first drag test silently
    "failed" for exactly that reason; it was a test bug, not a site bug).
  - Distrust full-page/composite screenshots for anything sticky or fixed. `fullPage: true`
    screenshots render position:sticky and position:fixed elements unreliably (a sticky element may
    render frozen at one position for the whole composite; a fixed header may appear to "duplicate").
    This session hit exactly that and almost misdiagnosed a real, working feature as broken — the
    fix was re-testing with real, bounded-viewport scroll checkpoints instead.
  - Verify claims with a real screenshot before stating them as fact, every time, at the viewport
    size actually in question.
  - When two constraints fight, find the structural fix, not another spacing tweak.
```

---

## Quick state (keep this current — last updated 2026-08-25, end of session)

**Phase:** Still Phase 4 (homepage), now considerably further along. This session covered four
substantial pieces of work, all committed locally to `redesign/hero-globe-light-bg` — **nothing
pushed to origin.** Four new commits since the last resume-prompt update:

- `e061a7d` — **Nav redesign.** Header now defaults to a simple, flush full-width bar (also the
  correct no-JS/reduced-motion state) and morphs into a floating pill via a GSAP ScrollTrigger
  scrub over the first 140px of scroll. Fixed two regressions that fell out of the shape change
  (a fake "full-width" bar that still carried a permanent gutter margin; the hero photo's top
  offset was tuned against the old floating-pill footprint and needed retuning against the new,
  shorter resting height). Also blends the hero photo's top edge into the paper ground with a
  gradient, and bumped the logo from 28px to 32px.
- `18318c6` — **CTA gold correction.** `gold.DEFAULT` had drifted to an invented `#F2B33D` during
  the earlier blue rebrand; sampled the actual logo file directly and found the real brand gold is
  `#FDD63F` (which also matches the original pre-rebrand palette CLAUDE.md documents). Corrected
  the token and moved `.btn-primary` from navy/white to gold/navy-deep — every CTA site-wide now
  picks this up from the one shared component.
- `716c6f6` — **"One Ecosystem" rebuilt, twice.** First pass was an editorial card-grid with a
  pinned scroll sequence — user rejected it outright ("looks so crap... i dont like this approach").
  Rebuilt from scratch as a sticky-photo-plus-scrolling-text layout instead: no cards, no borders,
  no page pin. A sticky photo column crossfades between the three ventures as the matching text
  block scrolls to center; scroll is never hijacked. Bolder ghost numbers, staggered content
  reveal, a real scale+crossfade image transition, minimal progress ticks. Photography for all
  three ventures is now purpose-cropped with `sharp` — see the content-authenticity flag below.
- `e9271ee` — **"Our Story" rebuilt as a drag-scrub journey; statement band resized, enhanced, and
  moved.** See both sub-sections immediately below — this is the most consequential commit to
  understand before continuing.

### "Our Story" — deliberate, explicit overrides of this project's own rules

The user explicitly asked to lift two of this project's own core anti-"generic AI site" rules for
this one section, after being asked to confirm exactly that via a structured multiple-choice
question (not assumed): **glassmorphism** (CLAUDE.md/00-BRIEF.md §13 explicitly ban this) and
**gratuitous 3D** ("DO NOT ADD 3D JUST BECAUSE IT LOOKS COOL"). Both are now live in
`story-journey.njk`:

- A frosted glass panel (`backdrop-blur-xl`, translucent white) floats over a blurred real photo
  (the same lecture-hall photo used for the Institute ecosystem card), tinted with a vibrant
  navy/gold gradient wash — NOT the flat dark overlay it started with, which was muddying into the
  photo's warm tones almost to the point of looking brown, not on-brand blue. If you see `/92` as
  an opacity value anywhere and something looks unexpectedly washed out, see the Tailwind bug note
  below — that's almost certainly why.
- A restrained Three.js particle layer (~200 slow-drifting gold points, gentle mouse parallax)
  sits behind the panel. **First and only 3D in the project.** `three` is now a real dependency
  (package.json), lazy-imported only when `.story-particles` exists in the DOM and
  `prefers-reduced-motion` is off.
- GSAP Draggable + InertiaPlugin (both free, bundled in the installed `gsap` package already — no
  separate install needed) drive a horizontal drag-scrub card track, PLUS wheel/trackpad support
  (the interaction most people actually reach for — click-drag alone wasn't enough, confirmed by
  the user's real-world testing). Not a page-scroll pin — the page scrolls past normally; the
  horizontal movement is entirely self-contained (drag directly, wheel-scroll while hovering, or
  use the arrow buttons / ruler-style scrubber). A soft edge fade-mask replaces what was originally
  a hard clip that sliced the last card in half at rest. Cards have real active/inactive states
  (scale + opacity) so scrubbing gives per-card feedback, not just the connecting-line node dot.
- **This override is scoped to this one section, not a new project-wide default.** Every relevant
  file has a comment saying exactly that. Don't casually reuse glassmorphism or 3D elsewhere
  without the same explicit confirmation this section got.
- Mobile gets native `overflow-x` scroll instead of Draggable/Three.js — no desktop interaction
  forced onto small screens, same pattern as everywhere else on this page.

### A genuine, silent Tailwind JIT bug found this session — worth knowing before touching colors

`bg-navy-deep/92` (and only that specific value, in that specific spot) **silently failed to
generate any CSS at all**, while `/75`, `/78`, `/85`, `/90`, `/95`, and `/20` all compiled fine on
the same file, same session. Confirmed by grepping the actual compiled `dist/assets/main-*.css` —
the class was present in the HTML output but had zero corresponding rule in the CSS. No root cause
found (not worth the time sink); the fix was just switching to `/90`. **If a color/opacity change
doesn't visually show up despite a clean build, don't assume you mis-eyeballed it — grep the
compiled CSS for the literal class before spending time on anything else.**

### Statement band ("From vision to reality...")

Was `max-w-[18ch]` at up to 64px text — an 18-character column forced the ~115-character quote
across 5-6 towering lines, ballooning the section to ~2 viewport-heights of solid navy with empty
space beside it. Widened to 42ch + stepped down to `text-h1`. Also given a phrase-by-phrase
staggered reveal (same duration/ease as the hero entrance, just ScrollTrigger-gated) and an ambient
glow layer — **deliberately not** the `.facet-field` texture, which a code comment explicitly
restricts to the hero+close "bookend" sections only. **Moved in page order**: was between the
ecosystem section and "Our Story"; now sits directly below Insights, immediately above the closing
CTA band, per explicit instruction.

### Content-authenticity flags carried forward — read before adding more photography

Three ecosystem-section photos (`src/assets/images/ecosystem/`) are user-supplied, not the
original admizz.com-sourced insights photos:
- `institute.jpg` — a real conference/lecture-hall photo, used full per explicit instruction
  despite unrelated third-party (ABB Robotics) branding visible on the projector screen in frame.
- `education.jpg` and `workforce.jpg` — read as stock/AI-generated (over-uniform lighting,
  slightly-too-symmetric faces) and are lower resolution than the rest of the site's imagery
  (1024×768 / 1200×800 source vs. 1600×900 elsewhere). Used per explicit instruction.
- All three are flagged in code comments as **explicit exceptions the user confirmed, not a
  default any future session should repeat without the same explicit ask** — this project's
  content-authenticity rule (CLAUDE.md non-negotiable #1) is otherwise unchanged and still governs
  everything else.

### Open items carried forward, still unresolved

- **Blue palette vs. navy/gold is still not resolved** — flagged as open across at least three
  sessions now including this one. Nobody has said yes/no explicitly; don't assume silence means
  "settled on blue" just because that's what's shipped. Confirm explicitly before changing it
  either direction.
- **The lookalike-silhouette test (non-negotiable #4) has still never been run on any page.**
- Inner pages (`/about/`, `/insights/`, `/contact/`) still haven't had the line-by-line content
  grounding the homepage sections have now had multiple passes of.
- `/ventures/` page still uses the older `ventures-register.njk` partial (plain indexed list, no
  cards, no sticky photo) — deliberately untouched both times the homepage's ecosystem section was
  rebuilt, since a full-viewport-height interactive treatment doesn't suit a page that's mostly
  just this content. Worth a deliberate decision at some point, not an oversight.
- Two open content-provenance questions from before, still unresolved: `site.json.legalName`
  ("Admizz Group" vs. live `og:site_name` "Admizz Consulting Group"), and `site.json.description`'s
  wording/source tag.
- `robots.txt` still `Disallow: /` — correct for now, flip only at actual launch.

### Impeccable — installed, still untracked

`https://impeccable.style` is installed project-scoped (`.claude/skills/impeccable/`,
`.github/agents/`, `.github/hooks/`, `.github/skills/` — still **untracked**, deliberately not
committed alongside content changes, unchanged this session). Its PostToolUse hook flagged one real
issue this session (a CSS `width` animation causing layout thrash on the ecosystem progress ticks)
— fixed with `transform: scaleX()` instead. Worth actually reading its findings when they appear,
not reflexively suppressing them.

### Content/infra facts carried forward, unchanged

- `/verify-admizz-content` skill still exists (`.claude/skills/verify-admizz-content/SKILL.md`),
  read-only, re-checks `src/_data/*.json` against live admizz.com.
- CI/CD (`stage` → `dev-web.admizz.com` auto-deploy), the public-repo decision, and the
  `ssh vps` (`manjila`) vs. pipeline `VPS_USER` (`zunkireelabs`) distinction are all unchanged.
- `temp_ss/` is still untracked scratch (screenshots used as visual references this session — the
  ones actually cropped into real assets were saved to `src/assets/images/ecosystem/` and ARE
  committed; the raw screenshots themselves are not, by existing convention).

## If you only remember five things

1. **`redesign/hero-globe-light-bg` has 4 new commits this session, all local, nothing pushed.**
   Working tree is clean. Don't assume anything from this session is live anywhere.
2. **The glassmorphism + Three.js in "Our Story" is a confirmed, scoped exception, not a new
   house style.** Don't reuse either elsewhere without the same explicit confirmation this section
   got — every relevant file says so in its own comments.
3. **Tailwind can silently drop a class with no error.** `bg-navy-deep/92` did exactly that this
   session. If a style change doesn't show up despite a clean build, grep the compiled CSS for the
   literal class before assuming you mis-eyeballed something.
4. **The blue-vs-navy/gold palette question is still open after three-plus sessions.** Stop
   treating "that's what's currently shipped" as an answer — it isn't one until the user says so.
5. **Measure, don't guess — and don't trust full-page composite screenshots for sticky/fixed
   elements.** Both cost real time this session in the opposite direction each time: a synthetic
   drag test that "failed" only because it measured the wrong element's bounding box, and a
   full-page screenshot that made a correctly-working sticky photo and fixed nav look broken.
