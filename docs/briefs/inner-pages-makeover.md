# BRIEF — Inner-pages makeover (all 5 non-homepage templates)

Single hand-off. Homepage is out of scope and must not change.

---

```
Read ./CLAUDE.md in full first. Ignore the global ~/CLAUDE.md — it describes a different
project (a Next.js/Supabase CRM). Do not invoke /project-pm. This is a static Eleventy site.

## The job

A complete, professional, section-by-section redesign of these 5 page templates:

  1. src/pages/contact/index.njk      → /contact/            (1 section)
  2. src/pages/insights/post.njk      → /insights/<slug>/ ×3 (2 sections)
  3. src/pages/insights/index.njk     → /insights/           (1 section)
  4. src/pages/about/index.njk        → /about/              (4 sections)
  5. src/pages/ventures/index.njk     → /ventures/           (3 sections)

Keep the current colour palette. No palette changes in this brief.

## RULE 1 — the homepage must not change. This is the hard one.

src/pages/index.njk is out of scope. But these pages SHARE files with it — base.njk,
header.njk, footer.njk, main.css, main.js, tailwind.config.js. Editing a shared class
silently changes the homepage.

Work additively. New CSS classes, new partials, page-scoped markup. Do not edit an existing
shared class or partial. If you genuinely think one needs changing, STOP and ask me first.

**These 13 CSS classes are rendered by the homepage or by shared partials — do not edit their
definitions in main.css.** (Verified by grep; this list is complete, don't assume otherwise.)
    .btn-ghost  .btn-ghost-on-navy  .btn-primary  .eyebrow  .eyebrow-on-navy
    .eyebrow-pill  .facet-field  .fade-up  .link-underline  .nav-link  .shell
    .skip-link  .text-balance

`.link-underline` is the one most likely to catch you out — it's used heavily on the inner
pages AND on the homepage. Want a different underline treatment? Add a NEW class.

**These files are off-limits:**
    src/pages/index.njk, header.njk, footer.njk, base.njk, tailwind.config.js

**These are used ONLY by pages in scope — safe to change:**
    .register-row (only /insights/), .data-row (only /contact/),
    .grow-line and .sequence-row (only ventures-register.njk — verified by grep)

**The data files are shared. This is the trap.** Every file in src/_data/ is read by the
homepage or by a partial that renders on it:
    ventures.json  → ecosystem-journey.njk (homepage), index.njk, footer.njk (every page)
    timeline.json  → story-journey.njk (homepage), ecosystem-journey.njk
    insights.json  → index.njk (homepage), header.njk
    site.json      → base.njk, header.njk, footer.njk, index.njk, and both homepage partials

So: **do NOT edit any existing field in src/_data/*.json.** Adding a NEW field that only your
pages read is fine. Any new copy you write belongs in the page template, not the data file.
If you think an existing data value genuinely has to change, STOP and ask me first.

## How you prove the homepage didn't change

Two checks, both required:

1. **Byte-diff the built HTML.** Run `npm run build` and save a copy of `dist/index.html`
   BEFORE you start any work. At the end, build again and diff the two. They must be
   identical. This is the primary check — it catches meta tags, schema.org, footer links
   and anything else a screenshot can't see.
2. **Screenshot the homepage** at 1440px and 390px before and after. Must be identical.

Before you commit anything, run `git status` and confirm src/pages/index.njk and .eleventy.js
are not staged. If the working tree already has uncommitted changes to those when you start,
STOP and tell me — do not commit around them.

## RULE 2 — invent nothing

CLAUDE.md non-negotiable #1. These pages are thin because the source content is thin. Fix
that with structure, hierarchy, typography and interaction — not new facts.

Do NOT invent: statistics, student numbers, success rates, partner universities, testimonials,
awards, certifications, office locations, staff names, dates, or venture services. There is no
usable statistic anywhere in this repo (published student counts span 1,000+ to 25,000+, a 25×
spread) — do not put a number on any page.

Do NOT pull content from admizzeducation.com or admizzworks.com. CLAUDE.md §4 restricts all
content to admizz.com itself.

Any new connective copy you write must be short, claim nothing not in the data, and if it lands
in src/_data/*.json must carry `source: "written"` — never `source: "admizz"`.

## RULE 3 — don't reuse the homepage's signature treatments

  - The sticky-photo ecosystem pattern (partials/ecosystem-journey.njk) belongs to the homepage.
  - The drag-scrub journey (partials/story-journey.njk) belongs to the homepage.
  - Glassmorphism and 3D exist ONLY inside story-journey.njk as an explicit scoped exception.
    They are banned everywhere else (CLAUDE.md, docs/00-BRIEF.md §13). Do not reuse either.
  - partials/facet-field.njk is restricted to navy "bookend" sections (hero + close).
  - No cards. An earlier card-grid was rejected outright by the user ("looks so crap"). This
    site carries hierarchy with type, rule lines and whitespace — not boxed chrome.

Each page needs its own shape. Five pages that look like five variations of one template is
the failure mode here.

## Fix these four real bugs while you're in there

1. **/contact/ form can submit empty.** It has `novalidate` AND `required` attributes, with no
   custom validation to replace what novalidate turns off. Either drop novalidate or implement
   real validation with visible, accessible error states. It currently has no error states at all.
2. **/contact/ confirmation SVG hardcodes `#8A5E10`** (index.njk ~line 107-108) instead of using
   a design token. Replace with a token-driven value.
3. **/insights/<slug>/ renders the whole article as ONE `<p>`** (post.njk line 32,
   `{{ post.body }}`). Bodies are 61-72 words. Split into real paragraphs.
4. **Admizz Institute's `href` is `"#"`** and is presented as a working link in two places
   (/contact/ venture list, /ventures/ CTA). A dead link dressed as a real one. Fix with
   hrefLabel — see below.

## Real material that exists and is currently unused — use it

  - **`hrefLabel` in src/_data/ventures.json.** NO template reads it today. Values:
    "No public site yet" / "admizzeducation.com" / "admizzworks.com". It was written to solve
    bug 4 honestly — Institute shows its status instead of a dead link.
  - **The ICEF credential.** Real, verified, currently only on the homepage: Admizz Education,
    IAS 6499, valid 2026-04-15 → 2027-04-15,
    https://accreditations.icef.com/certificate?id=c8a7212a-a25c-469f-8a7b-2b2f047e8c0c
    ATTRIBUTED TO ADMIZZ EDUCATION ONLY — not the group, not the other two ventures. It is the
    only accreditation that exists; AIRC, British Council, NAFSA, PIER and ISO were searched
    for and NOT FOUND.
  - **The venture↔article mapping is a clean 1:1** via insights.json `venture`:
        Admizz Institute           → ace-your-exams-unlock-your-future
        Admizz Education           → navigating-your-path-to-global-opportunities
        Admizz Workforce Solutions → empowering-careers-through-lifelong-learning
    Derive it from the data, don't hardcode slugs.
  - **A `readingTime` filter** exists in .eleventy.js (computes from real word count).

## Per page

### 1 · /contact/ — src/pages/contact/index.njk
One section: a 2-column split, intro + contact rows + venture list on the left, a bordered form
card on the right. The form is the entire point of the page and currently sits in a plain box.
Give the page real structure and give the form real states — empty, focused, invalid, submitting,
sent. Fix bugs 1, 2 and 4. Keep the honest "not actually wired to a backend" behaviour and its
explanatory comment; do NOT fake a real submission.

### 2 · /insights/<slug>/ — src/pages/insights/post.njk
The weakest page on the site. Navy masthead, then a 2-col body with one undivided paragraph and
a "More Insights" aside. Fix bug 3. Give it real article typography and rhythm — measure,
paragraph spacing, a considered relationship between the image, the text column and the aside.
Add reading time via the existing filter. There is no date or author field in the data; do not
invent either.

### 3 · /insights/ — src/pages/insights/index.njk
One section running a "featured post + smaller list" split. There are only 3 articles, so that
split makes one post large and two small for no editorial reason. Treat 3 as 3. `venture` is a
real organising dimension already in the data if you want it. `.register-row` is used only here
now, so you may change it freely.

### 4 · /about/ — src/pages/about/index.njk
Four sections: paper masthead, "The Record" timeline, founder, navy close.
  - The masthead's intro paragraph is `{{ site.description }}` — that is META DESCRIPTION copy
    (written for search results) being reused as body prose. It reads wrong. Fix it, but check
    what verbatim admizz.com About copy already appears on the homepage first and do NOT
    duplicate that here.
  - "The Record" renders the SAME timeline.json as the homepage's "Our Story" section, flatly,
    and entries are only 6-10 words each. It needs a different job from the homepage version,
    not a plainer copy of it.
  - The founder section uses the one real quote and is fine — polish, don't rebuild.

### 5 · /ventures/ — src/pages/ventures/index.njk
Renders the SAME EIGHT FIELDS as the homepage's ecosystem section (index, stage, name, vertical,
description, verticalLine, exams, href, cta), with no photography and no choreography. A visitor
gets nothing they didn't already get on the homepage — and the homepage's closing CTA points
here, promising depth that isn't there.

Give it a job the homepage doesn't do: the reference record rather than the pitch. The audience
for this site is partners, institutions and press. Use hrefLabel, the ICEF credential and the
1:1 article mapping above.

**Required framing correction.** The page currently calls these "three distinct stages of the
same journey" (line 17). docs/01-AUDIT.md established that Admizz Workforce Solutions is US
vocational rehabilitation — supported employment, pre-employment transition, job coaching for
individuals with disabilities, working with the state department. It is not the careers arm of
a study-abroad company, and the audit says the "one journey" story is factually strained.
Reframe as **three businesses, one group** — keep the shared-purpose idea, drop the claim that
they are sequential stages of one person's path.

Note: partials/ventures-register.njk is used ONLY by this page. If your rebuild stops using it,
delete it — but grep for other consumers of its CSS/JS before removing those:
    main.css ~191-194 (.grow-line), ~207-220 (.sequence-row)
    main.js ~157-166 (.grow-line scrub), ~343 (.sequence-row loop)
`.grow-line` in particular may be used elsewhere. Report what you found; remove only what's dead.

## Design constraints

  - Radii scale to element size: 4px chips/inputs, 8px cards, 12-16px panels. Never uniform
    rounded-2xl — CLAUDE.md calls it the loudest template tell of 2026.
  - One signature easing curve: cubic-bezier(.23, 1, .32, 1). 100ms hover/press/focus,
    300-700ms entrances, index-staggered — never simultaneous.
  - Reveal animations must be VISIBLE BY DEFAULT in CSS; JS only ARMS them into the hidden
    state. Never make base visibility depend on JS running. See the comment above .grow-line
    in main.css before touching this pattern.
  - `navyHeader: true` front-matter is only valid when a page's FIRST section is a full-bleed
    navy band. It's currently set on /ventures/ and /insights/<slug>/. If you change either
    page to open on paper, remove the flag — light header text on paper is illegible.
  - base.njk has NO block/slot mechanism. A page cannot inject into <head> or add per-page
    script/style tags. Anything page-specific must be inline in the page template body.
  - prefers-reduced-motion must fully disable Lenis, not shorten it.
  - Gold is never text on a light ground. Use the gold-text token for gold-toned text on light.
  - Mobile gets a plain, natural stack. Never force a desktop interaction onto small screens.
  - Body copy stays 15px with positive tracking. Negative tracking on display type only.

## Verify before you report

  - `npm run build` clean. It runs Eleventy twice on purpose (see .eleventy.js) — don't
    "simplify" that to one pass.
  - Homepage before/after screenshots at 1440px and 390px — must be identical.
  - All 7 in-scope output pages screenshotted at 1440px, 768px and 390px.
  - Do NOT use fullPage screenshots. This site has a fixed header and a sticky section;
    full-page composites render them unreliably and have already caused one false "it's broken"
    diagnosis. Use bounded-viewport scroll checkpoints.
  - Measure, don't guess — Playwright getBoundingClientRect() / computed styles, not eyeballing.
  - Tailwind has SILENTLY emitted no CSS for a valid-looking class in this repo (bg-navy-deep/92).
    If a style doesn't show up despite a clean build, grep the compiled dist/assets/main-*.css
    for the literal class before assuming you mis-eyeballed it.
  - Keyboard: check focus order and that every link has a discernible name. Institute's
    non-link must not be focusable as if it were a link.
  - Re-read your own output against ventures.json / insights.json / timeline.json / site.json
    and confirm no invented fact reached any page.

## Commit

Commit on the current branch, do not push. One commit per page is fine and easier to review
than one giant one.

## Report back with

  1. The homepage before/after screenshots, stated plainly as identical or not.
  2. What you built per page and why — especially anywhere you deviated from this brief.
  3. Screenshots of all 7 pages at all three viewports.
  4. Every piece of copy you wrote yourself, quoted, so I can check it against the no-invention rule.
  5. What you did with ventures-register.njk and its CSS/JS, with your grep evidence.
  6. Anything you could not do without inventing content.

Don't claim anything is verified that you didn't actually measure. If something in this brief
turns out to be wrong when you look at the real files, say so rather than working around it.
```
