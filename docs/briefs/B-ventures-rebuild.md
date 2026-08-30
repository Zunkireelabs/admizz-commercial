# BRIEF B — Rebuild `/ventures/`

**Run only after Brief A has landed and been reviewed.** This page must be built once, in the
final palette.

Paste everything inside the fence into a fresh Claude Code session in this repo.

---

```
Before doing anything, read ./CLAUDE.md in full, then ./docs/RESUME-PROMPT.md.

Two things about CLAUDE.md that matter immediately:
  - It OVERRIDES the global ~/CLAUDE.md, which describes a completely different project
    (a Next.js/Supabase CRM). None of that applies here.
  - DO NOT auto-invoke /project-pm. The global file tells you to. This repo countermands it.

## The problem you are solving

/ventures/ (src/pages/ventures/index.njk, 37 lines) includes partials/ventures-register.njk
and renders exactly these fields: index, stage, name, vertical, description, verticalLine,
exams, href, cta.

The homepage's "One Ecosystem" section (partials/ecosystem-journey.njk) renders THE SAME EIGHT
FIELDS — just far better, with photography and scroll choreography.

So /ventures/ currently gives a visitor zero information they did not already get on the
homepage. Worse: ecosystem-journey.njk closes with a CTA pointing AT /ventures/, promising
depth that isn't there. That is a live broken promise.

This cannot be fixed by adding facts. There are none to add — see the hard content limits below.
It has to be fixed by surfacing real content that exists but is currently invisible on this page,
and by giving the page a job the homepage doesn't do.

## Hard content limits — read before you plan anything

CLAUDE.md non-negotiable #1: never invent business facts. This page is where that rule is most
likely to erode, because the page feels thin and the temptation is to pad it.

Total venture-specific prose that exists in this repo:
  institute  — description 34 words, verticalLine 12 words
  education  — description 20 words, verticalLine  7 words
  workforce  — description 29 words, verticalLine 13 words

That is everything. There is NO second paragraph, no services list, no process, no pricing,
no locations, no staff, no testimonials, no per-venture founding dates, no per-venture logos
or icons, and no taglines.

DO NOT INVENT, and do not pull from the sister sites (admizzeducation.com / admizzworks.com) —
CLAUDE.md §4 restricts all content to admizz.com itself.

**There is no usable venture statistic anywhere.** docs/01-AUDIT.md found published student
counts spanning 1,000+ / 1,500+ / 1K+ / 2,000+ / 25,000+ (a 25× spread) and success rates given
as both 95% and 98%. The rule (01-AUDIT.md §139-140) is that no statistic appears on the rebuilt
site until Admizz supplies one authoritative figure per metric with a definition and measurement
period. Do not put a number on this page.

## What you have to work with that ISN'T on the page today

This is the actual material for the rebuild. All of it is verified and already in the repo.

1. **`hrefLabel` in ventures.json — a field NO template currently reads.**
   Values: "No public site yet" / "admizzeducation.com" / "admizzworks.com".
   It was written for exactly this problem. Right now Institute's link is a dead `href="#"`
   with a "Prepare With Admizz" CTA that goes nowhere. Rendering hrefLabel turns a broken link
   into an honest status. Use it. Institute's entry must NOT present as a working link.

2. **The ICEF credential — real, verified, currently only on the homepage.**
   Admizz Education, IAS 6499, valid 2026-04-15 → 2027-04-15
   https://accreditations.icef.com/certificate?id=c8a7212a-a25c-469f-8a7b-2b2f047e8c0c
   ATTRIBUTED TO ADMIZZ EDUCATION ONLY. Not the group, not the other two ventures. This is the
   only accreditation that exists — AIRC, British Council, NAFSA, PIER and ISO were all searched
   for and NOT FOUND. See src/pages/index.njk for how it is currently presented.

3. **The insights cross-reference — a clean 1:1 mapping, verified.**
   Each venture has exactly one related article already tagged in insights.json via `venture`:
     Admizz Institute            → /insights/ace-your-exams-unlock-your-future/
     Admizz Education            → /insights/navigating-your-path-to-global-opportunities/
     Admizz Workforce Solutions  → /insights/empowering-careers-through-lifelong-learning/
   Derive this from the data (match on `venture` == `name`), do not hardcode the slugs.
   This gives each venture real supporting material without a word being invented.

4. **timeline.json** — 2015 / 2020 / 2021 / Today, three of four sourced from admizz.com.
   Use if it earns its place; don't force it.

## Required framing change — this is a correction, not a preference

The page currently says these are "three distinct stages of the same journey"
(ventures/index.njk:17) under the headline "One ecosystem. Many ways forward."

docs/01-AUDIT.md established that Admizz Workforce Solutions is **US vocational rehabilitation** —
supported employment, pre-employment transition, non-medical assessment, job coaching for
individuals with disabilities, working with the state department. It is not the careers arm of
a study-abroad company. The audit's own words: "Any 'one ecosystem, one journey' story is
factually strained."

Calling that business stage 3 of a student's study-abroad journey is inaccurate, and somewhat
tone-deaf about the population it actually serves.

**Rewrite the framing as "three businesses, one group"** — keep the connective idea that they
share a purpose, drop the claim that they are sequential stages of one person's path. Describe
each business as what it verifiably is.

You are writing new connective copy here. Keep it short and claim nothing not in the data. Any
new copy that lands in src/_data/*.json must carry `source: "written"`, never `source: "admizz"` —
that field is the audit trail for what came from the real site.

## Recommended direction (I want your judgement on it, not blind compliance)

Build it as a **dossier / reference page, not a marketing page.**

The homepage sells the ecosystem cinematically. /ventures/ should be the record: what each
business actually is, what category it operates in, what its real web presence is (including
"no public site yet"), what credential it holds (Education only), and what it has published.
The audience for this site is partners, institutions and press (CLAUDE.md §4) — a reference
page serves them better than a second sales pitch.

The key insight: **the three ventures are genuinely asymmetric, and showing that honestly IS the
content.** Institute has five exams but no website. Education has a website and the only
accreditation but no exam list. Workforce has a website and neither. A templated design would
force three identical cards and flatten that. A page that lets each record be a different shape
tells the truth and passes the lookalike test by construction.

If you think there is a better structure, propose it in your report with reasoning — but it must
still solve "adds nothing over the homepage" and must respect every constraint below.

## Design constraints — non-negotiable

- **Do NOT reuse the homepage's sticky-photo pattern.** ecosystem-journey.njk owns that. Two
  pages running the same signature treatment devalues both. This page needs its own shape.
- **No cards.** An earlier card-grid version of the homepage ecosystem section was rejected
  outright by the user ("looks so crap... i dont like this approach"). Do not reintroduce boxed
  chrome. This site carries hierarchy with type, rule lines and whitespace.
- **No glassmorphism. No 3D.** Both exist in partials/story-journey.njk as an EXPLICIT, SCOPED
  exception the user confirmed for that one section. They are banned everywhere else
  (CLAUDE.md, docs/00-BRIEF.md §13). Do not reuse either here.
- **facet-field.njk is restricted** to the navy "bookend" sections (hero + close) — its own
  comment says so. Not decoration to sprinkle on this page.
- **Photography is severely constrained.** src/assets/images/ecosystem/ holds institute.jpg
  (600×750), education.jpg (600×768), workforce.jpg (640×800). They are ALREADY cropped portrait
  for the homepage's sticky column and are only ~600px wide — they CANNOT go full-bleed or 16:9
  without visible upscaling. Also: institute.jpg carries unrelated third-party ABB Robotics
  branding on a projector screen, and education.jpg + workforce.jpg read as stock/AI-generated.
  All three are flagged in code as user-confirmed exceptions, NOT a default to repeat. Using them
  small, or not at all, are both legitimate calls — say which you chose and why.
- **Radii scale to element size** (4px chips/inputs, 8px cards, 12-16px panels). Never uniform
  rounded-2xl.
- **One signature easing curve**: cubic-bezier(.23, 1, .32, 1). 100ms for hover/press,
  300-700ms for entrances, index-staggered.
- **Reveal animations must be visible by default in CSS**, with JS only ARMING them into the
  hidden state (the .fade-up / .js-armed pattern — see the comment above .grow-line in
  src/assets/css/main.css). Never make base visibility depend on JS running.
- **`navyHeader: true`** is currently set on this page and is only valid while the first section
  is a full-bleed navy band. If you change the page to open on paper, you MUST remove the flag —
  light header text on a paper ground is close to illegible (header.njk:2-5).
- **base.njk has no block/slot mechanism.** A page cannot inject into <head> or add per-page
  script/style tags. Anything page-specific must be inline in the page template body.
- **prefers-reduced-motion must fully disable Lenis**, not shorten it.
- Mobile gets a plain, natural stack — never a desktop interaction forced onto small screens.

## Housekeeping that falls out of this

`partials/ventures-register.njk` becomes a single-use orphan — /ventures/ is its ONLY remaining
consumer (its header comment claiming the homepage uses it is stale). If your rebuild stops using
it, delete it.

**Before deleting its supporting CSS/JS, grep for other consumers.** Do not assume:
  - src/assets/css/main.css ~191-194  `.grow-line`
  - src/assets/css/main.css ~207-220  `.sequence-row`
  - src/assets/js/main.js   ~157-166  GSAP scrub of .grow-line
  - src/assets/js/main.js   ~343      .sequence-row ScrollTrigger loop
`.grow-line` in particular may well be used elsewhere. Report what you found before removing
anything, and remove only what is genuinely dead.

Also check whether ecosystem-journey.njk's closing CTA (~line 119, "Let's build your future",
links to /ventures/) still makes sense against the rebuilt page. Report; don't unilaterally
rewrite the homepage.

## Run the lookalike test — CLAUDE.md non-negotiable #4

It has NEVER been run on any page in this project. Run it on this one.

Reduce the finished page to a 200px-wide black-on-white silhouette and put it beside five
competitors' equivalent pages. If you cannot identify ours, it is structurally templated —
redesign it, regardless of how good the colour and type are. See docs/02-DIRECTION.md §4.

Include the silhouette in your report and give me your honest verdict, including if it fails.

## Verification

- `npm run build` clean (it runs Eleventy twice on purpose — don't "simplify" that, see .eleventy.js).
- Screenshots at 1440px, 768px and 390px.
- Methodology this project learned the hard way:
  · Measure, don't guess — Playwright getBoundingClientRect() / computed styles, not eyeballing.
  · Do NOT trust fullPage:true screenshots for sticky/fixed elements. This site has a fixed
    header; full-page composites render it unreliably and have already caused one false
    "it's broken" diagnosis. Use bounded-viewport scroll checkpoints.
  · Real interaction — page.mouse.wheel() in a loop, not window.scrollTo(), for Lenis/GSAP work.
  · Tailwind can SILENTLY emit no CSS for a valid-looking class (bg-navy-deep/92 did exactly
    that). If a style doesn't show up despite a clean build, grep the compiled
    dist/assets/main-*.css for the literal class before assuming you mis-eyeballed it.
- Check keyboard focus order and that every link has a discernible name. Institute's non-link
  must not be focusable as if it were a link.
- Confirm no invented fact reached the page. Re-read your own output against ventures.json.

## Commit

Commit on the current branch. Do not push.

## Report back with

1. The structure you built and WHY, especially if you deviated from my recommended direction.
2. Screenshots at all three viewports.
3. The 200px silhouette + your honest lookalike verdict.
4. What you did with ventures-register.njk and its CSS/JS, plus your grep evidence for anything
   you deleted.
5. Every piece of copy you wrote yourself, quoted, so I can check it against the no-invention rule.
6. How you handled the photography question.
7. Anything you could not do without inventing content — I want that list; it feeds Brief C.

Do not claim anything is verified that you did not actually measure. If something in this brief
turns out to be wrong when you look at the real files, say so rather than working around it.
```
