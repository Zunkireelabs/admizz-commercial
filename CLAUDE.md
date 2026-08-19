# CLAUDE.md — Admizz Commercial

> **⛔ READ THIS FIRST — THE GLOBAL CLAUDE.md DOES NOT APPLY HERE.**
>
> `~/CLAUDE.md` describes a **different project**: the Zunkiree Labs *Lead Gen CRM* (Next.js 16,
> React 19, Supabase, `src/industries/` modules, RLS, tenant isolation). None of it applies to this
> repository.
>
> **In this repo, explicitly IGNORE all of the following from the global file:**
> - The "Automatic Skill Routing" rule that says to auto-invoke `/project-pm` on any dev request.
>   **Do not auto-invoke `/project-pm` here.** This is a static site, not the CRM.
> - Industry scoping rules, `src/industries/`, `manifest.ts`, `_registry.ts`, `getFeatureAccess`.
> - Tenant isolation rules, `scopedClient`, `createServiceClient`, RLS, Supabase migrations.
> - The two-session Opus-plans/Sonnet-executes workflow.
> - `docs/SESSION-LOG.md`, `docs/STATUS-BOARD.md`, `docs/FEATURE-ROADMAP.md`, `docs/FEATURE-CATALOG.md`
>   — those live in the CRM repo and do not exist here.
>
> The **one** thing that carries over: the CRM is a real, running system with an **Admizz Education
> tenant** (slug `admizz`). This site's lead capture should post into it — see §7.

---

## 1. What this is

A complete rebuild of **https://admizz.com/** — the corporate site of **Admizz Group**, an
education / test-prep / workforce company founded 2015, HQ Denver, Colorado.

This is not a redesign. The goal is a **premium digital experience** that repositions Admizz from
"education consultancy" to a global platform for education, skills and opportunity.

**The emotional target ladder:**

| Time | The visitor should think |
|---|---|
| 0–3s | "This is different." |
| 3–10s | "I understand what Admizz does." |
| 10–30s | "This is bigger than a consultancy." |
| 30–60s | "I can see myself using this." |
| 60s+ | "I want to explore." |
| Final | "I want to start my journey." |

The reaction must **not** be "nice consultancy website."

Full brief: [`docs/00-BRIEF.md`](./docs/00-BRIEF.md)

---

## 2. The four non-negotiables

**1 · Never invent business facts.**
No student numbers, partner universities, success rates, testimonials, awards, offices, or
certifications that are not verified. If content is missing, build a component that is *strong when
empty*, and add the gap to the content-request list in `docs/01-AUDIT.md` §9. Authenticity beats
marketing every time. This is the rule that most easily erodes — guard it.

**2 · Phase discipline. Do not build ahead of sign-off.**
Audit → strategy → design system → homepage → inner pages → QA. Each phase gates the next. Do not
start implementing a phase the user has not approved.

**3 · Interactivity must navigate real content.**
No fake product UI. No "explore 500+ universities" filter with no data behind it, no pathway quiz
returning generic output, no globe that spins meaninglessly. A visitor who pokes at it must find
something real. Simulated software is the same broken promise as an invented statistic.

**4 · Run the lookalike test before calling any page done.**
Reduce the page to a **200px-wide black-on-white silhouette** and put it beside five competitors'.
If you cannot identify ours, it is structurally templated — redesign it, regardless of how good the
colour and type are. See `docs/02-DIRECTION.md` §4.

---

## 3. Stack & commands

| Layer | Tech |
|---|---|
| SSG | Eleventy 3.1.6, Nunjucks |
| Build | Vite 7 via `@11ty/eleventy-plugin-vite` |
| CSS | Tailwind 3.4 + PostCSS + autoprefixer |
| JS | Alpine 3.15 (+ collapse) |
| Motion | GSAP 3.13 + Lenis 1.3 — **installed, not yet imported** |
| Images | `sharp` installed — **no pipeline wired yet**, add `@11ty/eleventy-img` |

```bash
npm run dev      # localhost:8080
npm run build    # → dist/
npm run clean
```

Node v22.23.1 · npm 10.9.8 · path alias: none (plain relative paths)

**Verified baseline build** (2026-08-18): succeeds in 1.85s → 5 files.
`index.html` 3.73 kB · CSS 7.35 kB · JS 49 kB total (Alpine is 48.39 kB of it).
Always re-run `npm run build` before declaring work done.

---

## 4. Current state

**⚠️ Scope correction (2026-08-19), read before touching `docs/01-AUDIT.md` or
`docs/02-DIRECTION.md`:** those two files were written for a student-facing education-consultancy
rebuild that pulled content from admizzeducation.com. **That direction was rejected.** This is
the **Admizz Group corporate site** — audience is partners/institutions/press, not students —
and **every piece of content comes from admizz.com itself, nothing from the sister sites.** Both
docs now carry a correction banner at the top; read it before trusting anything below it in
those files. This section (§4) is the accurate, current record.

**A working demo is built and verified**, source of truth for admizz.com content is
`docs/01-AUDIT.md` §1–§2 (the admizz.com-only facts, still accurate) plus the real assets
downloaded and inspected directly (logo, founder photo, 3 insight banners — see §5 below on
what's real vs. what's excluded).

### Pages built (8, verified building clean, no broken asset refs)

`/` · `/ventures/` · `/about/` · `/insights/` · `/insights/<3 real posts>/` · `/contact/`

Homepage sections, each a different layout archetype (checked against the anti-template rules
in `docs/02-DIRECTION.md` §4, which still applies): navy masthead hero → paper editorial
statement (verbatim admizz.com About copy) → **the ecosystem register** (3 ventures as an
indexed list with a gold connecting line, reframed Prepare/Study/Work using admizz.com's own
"Our Portfolios" + "Our Verticals" copy merged into one section — the one bespoke interaction)
→ navy statement band (verbatim admizz.com quote) → timeline register (2015/2020/2021/Today,
verbatim) → founder (real photo + the one real quote) → insights (editorial index, not 3 equal
cards) → navy close.

### Known, deliberate debts (not bugs — decided under the one-day deadline)

- **Fonts load from Google Fonts CDN**, not self-hosted/axis-instanced yet. `latin-ext` subset
  requested so ₹ still renders. Self-hosting is still the target — see §5 typography.
- **`/contact/` form is front-end complete, not wired to a backend.** Shows a real client-side
  confirmation state. Wiring to the CRM (§7) needs the endpoint/key/CORS confirmed first.
- **GSAP is still unused.** Motion is Lenis (reduced-motion-gated) + plain CSS transitions
  driven by an IntersectionObserver. Sufficient for what's built; GSAP ScrollTrigger is the
  natural next step if richer scroll-linked motion is wanted later.

### A real bug found and fixed during build — worth knowing before adding new reveal-animated content

`.fade-up` / `.grow-line` elements must render **fully visible by default** in CSS. JS only
*arms* them into the hidden pre-reveal state (adds `.js-armed`) right before observing them.
**Never make content's base visibility depend on JS running** — a first version of this pattern
hid content at `opacity:0` unconditionally, which broke for anything a scroll-triggered observer
never fired for (a no-JS visitor, most screenshot tools, some crawlers). See the comment block in
`src/assets/css/main.css` above `.grow-line` before changing this pattern.

Also: the header's transparent-over-navy-hero state is gated by a per-page `navyHeader: true`
front-matter flag (`header.njk`), not scroll position alone — pages that open on the paper
ground must never get light text on a light background. Set the flag only on pages whose first
section is actually navy.

### Eleventy + Vite build quirk (see comment in `.eleventy.js`)

`{% image %}` / `{% imageEager %}` output must land inside `src/assets/images/` (already covered
by the existing passthrough-copy rule) — a separate top-level cache dir does NOT reliably survive
this Vite plugin's build. `npm run build` runs Eleventy **twice** on purpose: pass 1 generates the
files, pass 2 is the one Vite actually hashes correctly. Don't "simplify" this to one pass.

### Still not started

Inner-page depth beyond what's listed above (no dedicated venture detail pages), image
self-hosting/axis-instancing, sitemap.xml generation, and everything in `CLAUDE.md` §6 not yet
addressed. Full roadmap needs rewriting against the corrected scope — `docs/02-DIRECTION.md` §10
is stale.

---

## 5. Design system — hard values

**Recovered from the existing brand, not invented.** Elementor's globals were left at factory
defaults; the real palette was buried in per-widget CSS.

```
--navy       #002856   ink + statement surfaces
--gold       #FDD63F   foil / accent ONLY
--gold-text  #8A6200   gold-toned text on light
--paper      #F6F6F3   default ground (warm, near-neutral)
--ink        #10192B   body text
```

**Measured contrast (WCAG 2.1) — do not re-derive, these are verified:**

| Pair | Ratio | |
|---|---|---|
| Navy on paper | 13.99 | AAA |
| Gold on navy | 10.34 | AAA |
| Navy on gold | 10.34 | AAA |
| **Gold on white** | **1.41** | **FAIL** |
| `#8A6200` on white | 5.49 | AA |

**Two rules that follow:**
- **Gold is never text on a light ground.** It is a surface, a fill, a rule, a seal. This constraint
  is a feature — it prevents the "everything glows yellow" failure automatically.
- **Navy is ink and punctuation, never the default canvas.** A navy-background site is exactly the
  AI-SaaS look the brief bans. Full-bleed navy bands on a paper ground; never navy as the ground.

**Two honest risks:** navy+gold is the default academic-crest pairing (defend with warm paper +
whitespace); `#FDD63F` sits near WordPress's default `#fcb900` (defend by using it sparingly).

### Typography

| Role | Family | Axes | License |
|---|---|---|---|
| Display | **Newsreader** | `wght` 200–800, `opsz` 6–72 | SIL OFL 1.1 |
| Body / UI | **Archivo** | `wght` 100–900, `wdth` 62–125 | SIL OFL 1.1 |
| Labels / data | **Chivo Mono** | `wght` 100–900 | SIL OFL 1.1 |

- **Body 15px, tracking +0.15px.** Negative tracking on **display only** — crushed letter-spacing
  across the board is a specific AI-SaaS tell and hurts small-text legibility.
- **Non-integer variable weights** (460, 530, 590) — free de-templating, costs nothing.
- **Restrain display size.** 46px at weight 400 with 108% leading beats a 120px ultra-bold hero.
- **Radii scale to element size:** 4px chips/inputs · 8px cards · 12–16px panels. Never uniform
  `rounded-2xl` — the loudest template tell of 2026.
- Fluid type steps capped at **2.5× min** or WCAG 1.4.4 fails under zoom.
- **Two parallel ink ramps** — editorial text and embedded UI/data get separate contrast logic.

**Font pipeline (do it right the first time):**
- Self-host in `src/assets/fonts/`, reference **root-absolutely** (`/assets/fonts/x.woff2`) so Vite
  hashes them. **Not** in `public/` — that bypasses hashing and breaks immutable caching.
- **Ship `latin-ext`, not `latin`.** The `latin` subset excludes **₹ (U+20B9)** — every rupee figure
  would fall back mid-sentence. Also excludes ā, ṛ, ś. Devanagari needs its own `unicode-range` face.
- `→` (U+2192) is in **neither** subset — use an inline SVG for arrows.
- **Axis-instance before shipping** (~53% saving). Then declare the real range, e.g.
  `font-weight: 400 700`. Google's `css2` API ignores requested ranges — this saving only exists
  when self-hosting.
- Exactly **one** preload, with `crossorigin`. Set `font-synthesis: none`. Do **not** gzip woff2.
- Safari lacks `ascent-override` — set explicit `line-height` so line boxes don't depend on metrics.
- Use `@capsizecss/core`, not `fontpie` (abandoned 2022).

### Motion

**One signature easing curve: `cubic-bezier(.23, 1, .32, 1)`.** Use it everywhere; at most one
secondary. A single curve used consistently is what makes a site feel authored.

| Duration | Use |
|---|---|
| 100ms | Hover, press, focus. Slower than ~120ms reads as lag. |
| 300–700ms | Entrances, reveals. Index-staggered, never simultaneous. |
| 2000ms+ | Ambient loops only. |

- **Exactly one bespoke, brand-meaningful interaction** — the route diagram (`docs/02-DIRECTION.md`
  §5). One is enough, and it must carry meaning rather than decorate.
- Header starts **invisible**, materialises chrome on scroll (~120ms).
- Generate texture with `feTurbulence fractalNoise` — never ship a noise PNG.
- **`prefers-reduced-motion` must disable Lenis entirely**, not shorten it. Smooth-scroll hijacking
  is precisely what those users are asking you to stop.

---

## 6. Scaffold fixes required before/during build

- `src/_data/site.json` — every field empty; `url` is `http://localhost:8080`, which emits **broken
  canonical + OG URLs in production**.
- `public/robots.txt` is `Disallow: /` — must flip at launch.
- `base.njk`: remove `html.scroll-smooth` (fights Lenis) and `body.overflow-x-hidden` (breaks
  `position: sticky`).
- `base.njk` schema.org: `contactType: "sales"` and a `github` social link are wrong for an
  education company. Needs `EducationalOrganization`, `PostalAddress` per office, real `sameAs`.
- `tailwind.config.js`: brand colour is literally Tailwind's default `blue-600`; all fonts are
  `system-ui`; type scale is fixed rem, **not fluid**. Full rebuild.
- `header.njk`: no mobile nav, no ARIA, inline `style=` attributes mixing two styling systems.
- No sitemap template exists, though `.eleventy.js` has a Vite plugin that copies one.
- No image pipeline. Add `@11ty/eleventy-img` over the already-installed `sharp`.

---

## 7. Lead capture — use the CRM you already own

The current admizz.com captures **zero** leads (no `<form>` element exists anywhere on it).

Rather than adding Formspree or Netlify Forms, post directly into the **Zunkiree Labs Lead Gen CRM**,
which already has an *Admizz Education* tenant (slug `admizz`) with live leads.

- Endpoint shape: `POST /api/public/submit/[tenantSlug]/[formSlug]`
- Requires a Bearer API key (form-category key), CORS-enabled
- **Confirm the endpoint contract, key, and allowed CORS origin before building against it.**

This makes the site a real lead engine wired to a real pipeline — counsellor assignment, stage
tracking, idempotency — rather than a form that emails an inbox.

---

## 8. Documents

| File | Contents |
|---|---|
| [`docs/00-BRIEF.md`](./docs/00-BRIEF.md) | The original master brief, compressed. Mission, positioning, anti-patterns. **Read for the ambition.** |
| [`docs/01-AUDIT.md`](./docs/01-AUDIT.md) | Every verified finding with sources. Includes the P0 content-request list for Admizz. |
| [`docs/02-DIRECTION.md`](./docs/02-DIRECTION.md) | Strategy: positioning, IA, hero concept, anti-template rules, roadmap. |

Keep these current. When a phase ships, update §4 of this file and the roadmap in `02-DIRECTION.md`.

---

## 9. Working notes

- `temp_ss/` is untracked scratch (screenshots from the CRM project). Not part of this build.
- No test runner is configured.
- Git: `main` is the only branch so far. Commit only when asked.
