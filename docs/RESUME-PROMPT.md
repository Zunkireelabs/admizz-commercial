# Resume prompt

Paste this into a fresh Claude Code session started in this repo.

---

```
We're rebuilding the Admizz Group website (admizz.com) — a complete digital experience
transformation, not a redesign. This is a long-running project with substantial prior work.

Before doing ANYTHING, read these files in order:

  1. ./docs/RESUME-PROMPT.md              ← this file, IN FULL. Start with the block headed
                                             "SESSION 2026-08-29/30 — DIRECTION CHANGE" directly
                                             under "Quick state" — that is the CURRENT direction.
                                             Everything under "Inner-pages state" below it is a
                                             DIFFERENT branch and its homepage-freeze rule does
                                             NOT apply to the current work. Nothing here is
                                             optional context.
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

The immediate next action is NOT to start building. The 2026-08-30 block ends with three
questions I have not answered yet (university logos: copy or link · the 1,000-vs-2,000 student
number · the ~150 sister-site articles: link or write fresh), plus two older ones (is /ventures/
confirmed as the canonical design language, and does the palette revert per docs/briefs/
A-palette-revert.md). Ask me those first, in one short list, and wait. Step 1 of the agreed plan
(the admizzeducation.com content harvest) depends on the answers.

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
  - After ANY structural CSS edit, re-screenshot the WHOLE page, not just the piece you were
    working on. A find/replace that matched a nested selector silently deleted two entire rule
    blocks last session; the build stayed green (valid CSS, just less of it) and the homepage
    guard passed (the homepage didn't use those classes). The user found it, not the tooling.
  - A green build is not evidence the CSS you wrote survived. Check the compiled output for the
    literal class, and assert the page's styled classes exist in both the HTML and the CSS.
```

---

## Quick state (keep this current — last updated 2026-08-30)

---

# ⚠️ SESSION 2026-08-29/30 — DIRECTION CHANGE. READ THIS BEFORE THE INNER-PAGES STATE BELOW.

**Nothing changed on disk this session except this document.** No code edits, no commits,
no new branch. Everything below is analysis + an agreed plan, not work in progress.

## The constraint that just changed

The "**THE HOMEPAGE MUST NOT CHANGE**" rule further down governs `redesign/inner-pages` **only**.
The plan agreed this session **deliberately rebuilds the homepage**. Do not start that work on
`redesign/inner-pages` — cut a new branch from `stage`. The byte-diff guard
(`c8f97e30da7b6bed63bbcbd212d5221f6f8b1644`) still applies to any further inner-pages commits.

## How we got here

The user asked why the site "does not have the premium feel," gave **bcg.com** and **rillet.com**
as targets, then pivoted to content, then pointed at the sister site **admizzeducation.com**.
The answer changed twice as evidence came in — the final answer is the content one.

## Measured, not eyeballed (Playwright 1440×900 against a static `dist/` server)

| Page | Height |
|---|---|
| `/` | **7,879px — of which ~3,220px (41%) is saturated navy/purple gradient** |
| `/ventures/` | 3,576 |
| `/about/` | 3,879 |
| `/contact/` | 2,439 |
| `/insights/` | 2,333 |

**The `.story-journey` pin is NOT dead space — verified, do not "fix" it as a bug.** The section
spans y=3,495→6,233 (2,738px); ~1,890px of that is a GSAP pin spacer (`main.js:248`,
`end: innerHeight * (cards-1) * 0.7`). A `fullPage` screenshot renders it as a flat gradient void.
Scroll-checkpoint screenshots at y=3900/4600/5400/6000 show a working horizontal scrub.
The real criticism is proportion, not correctness: **1,890px of scroll to deliver four dates**,
during which the panel floats with ~450px of empty gradient beneath it and the edge cards are
clipped mid-word by the track mask ("2015" reads as "015", then "5").

## Reference sites, measured (firecrawl `formats: ["screenshot","branding"]`)

| | Rillet | BCG | Ours |
|---|---|---|---|
| Ground | `#FFFFFF` | `#FFFFFF` | `#F4F5FB` (blue-tinted) |
| Primary button | **`#000000`** | brand green | **gold `#FDD63F`** |
| Radius | 3.69px | 15px | 4→28px, inconsistent |
| Component shadow | **none on any** | none | `shadow-xl`→`2xl` |
| Decorative gradient | none | none | 41% of the homepage |
| h1 / body | 59px / 12px | 44px / 16px | 54px / 15px |

Rillet: `Space Grotesk` + `DM Sans`, one accent `#644EFF`, hero is a real product screenshot,
12 real customer logos. BCG: proprietary `Henderson BCG Serif/Sans`, accent `#96F878`, six
articles dated within the week. **Neither uses gradient, glassmorphism, particles, or glow.**
Their premium comes from having real things to show, not from visual technique.

## The structural finding: the site speaks three design languages

1. **"The record"** — `/ventures/` + `/about/`. Navy masthead, mono labels, hairline rules, data
   rows, Newsreader. **This is the good one. It is the canonical language.**
2. **"The showcase"** — `/`. Gradients, glass, Three.js particles, gold buttons, curved SVG divider.
3. **"The SaaS app"** — `/contact/`. Its hero title is `fontFamily.sans` at `wght 780`
   (`main.css:770`) while every other page uses Newsreader 320–460. Rounded shadow cards,
   icon chips, paper-plane illustration.

BCG and Rillet each have exactly one language and repeat it. **Incoherence is what reads as
"not premium" here — not craft.** The token layer (fluid type capped for WCAG 1.4.4, non-integer
variable weights, one signature easing curve) is genuinely good and is not the problem.

## Real bug found: gold text on a light ground

`_includes/partials/ecosystem-journey.njk:91` renders `text-gold` (`#FDD63F`) on `paper`
(`#F4F5FB`) — **≈1.25:1**, on the largest type on the homepage ("Institute", "Education",
"Workforce Solutions"). Same class at `pages/about/index.njk:46` ("impact."). CLAUDE.md §5 states
the rule ("Gold is never text on a light ground") and records gold-on-white as **1.41, FAIL**.

**Brief A's palette revert does NOT fix this on its own** — the class itself must go.
(`text-gold-text` at `insights/index.njk:75` and `ventures/index.njk:266` is the correct,
AA-passing token and is fine.)

## Blast radius of the cleanup — small and contained

```
bg-gradient         9 uses  → story-journey.njk, ecosystem-journey.njk, pages/index.njk
rounded-2xl/3xl     3 uses  → pages/index.njk:134, story-journey.njk:41, header.njk:84
text-gold (unsafe)  2 uses  → ecosystem-journey.njk:91, about/index.njk:46
shadow-xl/2xl       2 uses  → pages/index.njk:134
blur-/backdrop-blur 7 uses
```

## The content model, from bcg.com/industries/education/overview

That one page carries **~25 named, checkable facts** (1.6bn students · 2.2m in India · Gates
Foundation · UNICEF Generation Unlimited · WEF · Fulbright Vietnam · AVID: 111,780 educators
across 4,200 schools · Medtronic · California · 4 named leaders with cities · 2 dated articles).
Strip those out and about four paragraphs remain. **It is ~80% evidence, ~20% prose.**
Our whole five-page site carries ~15 checkable facts. That inversion is the real gap.

Its nine repeating blocks: what it is · why it matters (with a number) · what we do ·
how we do it · **what we've achieved** · **client stories** · **our people** · **our thinking
(dated)** · where next. Blocks 5–8 are all proof. **We currently have none of them.**

---

# ★ THE UNLOCK — admizzeducation.com already publishes the proof

Mapped 200+ pages on the sister site. Everything the group site lacks is already published by
Admizz themselves. **We are not blocked, and nothing needs inventing.**

**Headline figures:** 2,000+ students enrolled · 100+ partner universities · **95% visa approval
rate** · **$2M+ scholarships awarded** · 4.9/5 from 94 reviews · 10+ years · 24hr avg response ·
IELTS Band 7+, GRE 320+, TOEFL 100+ · 8.08K YouTube subscribers.

**~120 named universities WITH LOGOS**, grouped by country (UK · USA · Australia · Canada ·
France · Finland · New Zealand · India · Germany) at
`admizzeducation.com/images/universities/<country>/<name>.webp`. Monash, RMIT, Coventry,
Greenwich, Toronto, McGill, Sorbonne, TU Munich, Colorado State, Auckland, VIT, Heidelberg…
**This is the logo wall Rillet uses as its single strongest trust element.**

**4 named testimonials** with university + country route: Niraj Bhattarai (UWS, Nepal→UK) ·
Basant Khadka (Weber State, Nepal→USA) · Yousuf Abdirahman Mohamed (KIIT, Somalia→India) ·
Satyam Jaiswal (Greenwich, Nepal→UK).

**Also there:** 9 destination pages · ~150 published articles (visa guides, IELTS vs PTE,
scholarship guides, 2026 policy changes) · offices in **Kathmandu, Birgunj, Janakpur** alongside
Denver · audiences already segmented as **Students / Universities / Recruitment Partners** ·
contact `hello@admizz.com` (**note: `site.json` currently says `info@admizz.com`** — a third
provenance question for the existing list below).

## Three conflicts this creates — resolve before publishing any of it

1. **NUMBER CONFLICT.** `src/_data/timeline.json` says **"1,000+ student admissions"** (sourced
   from admizz.com). The sister site says **"2,000+ students enrolled."** Same group, two numbers,
   both public. Must be resolved — a visitor comparing the two sites sees a contradiction.
2. **PROVENANCE.** These are Admizz's own marketing claims, not independently verified. Sourcing
   them *with attribution* is not the same as inventing them, so **non-negotiable #1 is satisfied**
   — but "95% visa approval" and "$2M+ scholarships" are exactly the claims that invite scrutiny,
   and the group site is the serious partner/press-facing property. Confirm before amplifying.
3. **STRUCTURAL.** The group site presents **Admizz Institute** as a separate venture with
   "No public site yet"; the sister site delivers test prep **under Admizz Education**. The group
   describes itself differently from how the business actually operates. This compounds the
   framing correction already logged below ("three stages of the same journey" vs "three
   businesses, one group").

## The agreed plan — four steps, in this order

1. **Harvest.** Pull the figures, university logos and testimonials into `src/_data/*` with a
   provenance tag per fact (`source: "admizzeducation"` alongside the existing `source: "admizz"`),
   plus a `status: verified | draft` field so unconfirmed values can be withheld from the public
   build while still rendering in a client-preview build. (The `CONFIRM` chips already on
   `/contact/` are an ad-hoc version of this — see the bug note below.)
2. **Resolve.** One short message to Admizz: the 1,000-vs-2,000 conflict, and the source of the
   95% / $2M figures. Not a long content request — three questions.
3. **Build the proof blocks** the site has never had: a real stats row, the university logo wall,
   real testimonials, the destinations. **The homepage's "Global Reach / Student First / Future
   Ready" icon strip is filler with zero information — this is what replaces it.**
4. **Design cleanup**, last: Brief A palette revert · dark buttons instead of gold ·
   delete gradients/glass/particles/curved divider · fix the `text-gold` contrast bug ·
   realign `/contact/` typography to Newsreader.

**Register translation rule.** The group site is for partners and press, not students. Do not
copy the student-facing voice across. Student site: *"95% visa success — start your journey."*
Group site: *"Across 100+ institutional partners in 9 countries, Admizz Education maintains a 95%
visa approval rate."* Same fact, different reader.

## Bug to fold into step 4

**Six `CONFIRM` placeholder chips are live in the built site** — `pages/contact/index.njk:208`
(postcode 80202), `:219` (office hours), `:287` (Kathmandu) — as is *"A privacy note is being
drafted"* at `:172`. Internal QA markers are reaching visitors. Not yet indexed (robots.txt
disallows), so it is contained, but it must not survive launch. See also `LAUNCH-BLOCKERS.md §1`.

## SESSION 2026-08-30 continued — branch `redesign/proof-content`, decisions made

The 5 open questions below were answered this session and acted on. Commits so far (local
only, not pushed): `8142600` data harvest · `efc4211` palette revert to logo-sampled navy/gold ·
`8ce90b6` palette changed AGAIN to an exact match of admizzeducation.com's live colors
(`#0D1282`/`#FFD800`) at explicit user request — **this was a deliberate choice, not a mistake,
confirmed after the user raised and then dismissed a "does it look too similar" concern; colors
are correct and closed** · `2d64b98` homepage: real stats + a 104-university "academic network"
register replaced the empty icon strip.

**Mid-session correction — the real problem isn't color, it's content genre.** User feedback,
verbatim direction: the site "still looks like the educational consultancy... not the top notch
premium consulting site." Diagnosis that held up: the new proof section relays
admizzeducation.com's own consumer-facing marketing numbers (2,000 students, 95% visa approval)
almost verbatim — that's a vendor testimonial, not sector intelligence. BCG's education page
(the reference) is ~80% third-party-sourced market/sector data with the company's own work shown
as *one instance* of understanding that landscape, not the whole pitch. **Next work: real,
sourced sector-level content per venture** (international student mobility data for Education,
testing-demand data for Institute, US vocational-rehab data for Workforce Solutions) — see the
new content-research work below this block.

**Forward-looking note, not a current build task — logged so it isn't lost:** the user gave
`intrnforte.com` as a reference, then clarified it's **not for the group site now** — it's
because **Admizz Institute is expected to commercialize into its own business later**, closer to
intrnforte's model (structured programs, certifications, job-outcome tracking, its own enrollment
numbers) rather than staying bundled inside Admizz Education as test-prep support. Do NOT build
anything from intrnforte.com's look into the current homepage — Institute has no public content
yet and inventing any would violate non-negotiable #1. What DOES change: treat Institute's
current site presence ("No public site yet" in `ventures.json`, the dead link in the frozen
footer) as a placeholder that should age well, not a permanent dead end — when Institute does
launch, a "training → certification → job outcome" narrative (same shape as BCG's own AVID
citation: "111,780 educators across 4,200 schools") is the right model *then*, with real
Institute-specific facts, not before.

## Three questions the user has NOT yet answered — ask first thing

1. **University logos** — copy them into this repo, or link out to the sister site's partner page?
2. **1,000 vs 2,000** — ask Admizz, or adopt the sister site's newer number?
3. **The ~150 existing articles** — link out to them from `/insights/`, or write fresh
   group-level pieces?

Two earlier questions also still unanswered: whether `/ventures/` is confirmed as the canonical
design language, and whether the palette reverts to warm paper `#F6F6F3` + navy `#002856`
(Brief A) or stays on the current blue.

## Tooling notes from this session

- **`npx http-server dist` is broken for this site** — it 301s directory URLs and serves
  `index.html` for every route, so `/ventures/` silently renders the homepage. Use
  `python3 -m http.server` instead. Both `/ventures/` and `/about/` were briefly misdiagnosed
  because of this.
- **Check the port is actually yours.** `:8099` was held by a stale server from an earlier
  session; the first homepage screenshot came from it. It happened to be serving the same
  content, but re-verify on a fresh port before trusting any measurement.
- Full-page screenshots were sliced for reading with a tiny `sharp` script
  (`node_modules/sharp/dist/index.cjs` — the package has no `lib/index.js` entry).
- `firecrawl_scrape` with `formats: ["screenshot","branding"]` returns a competitor's real
  palette, fonts, radii and component shadows as structured data. Faster and more reliable than
  reading a screenshot. `firecrawl_map` enumerated the sister site's 200+ URLs in one call.

---

## Inner-pages state (last updated 2026-08-27 — still accurate for that branch)

**Phase:** Inner pages. The homepage is done and shipped; work has moved to the five
non-homepage templates. One of the five (`/ventures/`) is complete.

### Branch — READ THIS FIRST

```
origin/main    e09e88b  production, untouched
origin/stage   8faffac  LIVE on dev-web.admizz.com (PR #1 merged 2026-08-25)
                 │
               c5fb5a3
                 └── redesign/inner-pages  79f9d3b   ← 4 commits, LOCAL ONLY, never pushed
```

`redesign/inner-pages` was cut 2026-08-26 from `c5fb5a3`. It reports "1 behind stage", but that
commit is only PR #1's merge commit — the trees are identical, so **no rebase is needed**.

The previous branch `redesign/hero-globe-light-bg` **was** pushed and merged to stage (the old
version of this file claimed otherwise — that claim was wrong twice over and is now corrected).
The homepage on dev-web.admizz.com is current.

Local `stage` is stale at `0db5030`, 16 behind. Fetch before ever working from it.

### The governing constraint: THE HOMEPAGE MUST NOT CHANGE

Everything on this branch is additive. Frozen, do not edit:

    src/pages/index.njk   base.njk   header.njk   footer.njk
    ecosystem-journey.njk   story-journey.njk   facet-field.njk
    tailwind.config.js   .eleventy.js
    every EXISTING field in all five src/_data/*.json   (new fields are fine)

`.link-underline` is shared with the homepage — add a new class rather than editing it.
`.register-row` (/insights/ only) and `.data-row` (/contact/ only) are safe to change.

**The guard, run after every commit:** build, then diff `dist/index.html` against a saved
baseline with asset hashes normalised —
`sed -E 's/-[A-Za-z0-9_-]{8}\.(css|js|jpeg|jpg|webp|png|svg)/-HASH.\1/g'`.
The homepage fingerprint has been **`c8f97e30da7b6bed63bbcbd212d5221f6f8b1644`** across every
commit on this branch. Also assert no class the homepage renders lost its CSS rule (406 classes).

### What shipped: `/ventures/` (4 commits)

Was a plain list rendering the same eight fields as the homepage's ecosystem section — a live
broken promise, since the homepage CTA points here offering depth. Rebuilt as the **reference
record** for partners/institutions/press: the homepage pitches, this page documents.

- **Masthead**: index rail (jumps to each record) · statement · field diagram · a 4-across
  record strip of hard facts spanning the full width.
- **Field diagram**: three overlapping circles, brand mark at the shared centre, labels inside.
  Deliberately NOT an arrow sequence — a sequence is exactly the claim the audit rejects.
- **Positions row**: all three side by side, connectors are plain rules with no arrowheads.
- **Records**: three columns — numbered photo plate, entry, ledger — with the ICEF credential
  as a certificate affordance.
- **Close**: left-weighted band on sunk paper (deliberately not /about/'s centred navy close).

**Framing correction.** "Three distinct stages of the same journey" → **"Three businesses, one
group."** The audit establishes Workforce Solutions as US vocational rehabilitation, not the
careers arm of a study-abroad company. ⚠️ **The homepage still carries the original framing**
("three stages of the same journey", in the frozen ecosystem section). The two pages disagree
until that separate PR happens.

**Three things surfaced that existed in the data but reached no template:** `hrefLabel` (fixes
the dead Institute link — now a plain status, verified not focusable); the ICEF credential
(IAS 6499, with an explicit note that it is held by Admizz Education and does **not** extend to
the other two); the venture↔article mapping derived from `insights.json`.

### Still queued: four pages

1. **`/insights/<slug>/` ×3** — weakest page on the site. `post.njk` renders the entire article
   as ONE `<p>` (`{{ post.body }}`). Add real paragraphs, article typography, reading time via
   the existing (unused here) `readingTime` filter in `.eleventy.js`. No date/author — that data
   doesn't exist.
2. **`/insights/`** — "featured + rest" makes one post big and two small for no editorial reason.
   Only three exist. `venture` is a real organising dimension already in the data.
3. **`/about/`** — the masthead intro is `{{ site.description }}`, i.e. META-DESCRIPTION copy
   used as body prose. Fix in the template, never by editing `site.json` (it also feeds every
   page's meta tags and the footer). "The Record" replays the homepage's timeline flatly.
4. **`/contact/`** — the form has `novalidate` AND `required` with no replacement validation, so
   **it submits empty**. Worse: on submit it fakes a 500ms wait then says "Thanks — we'll be in
   touch. A member of the Admizz team will reach out shortly." **Nothing is sent anywhere and
   nobody will.** Proposed fix (agreed, not yet built): validate properly, then hand off to a
   prefilled `mailto:` to info@admizz.com so the message genuinely arrives, with a success state
   that says what actually happened. Swap to the CRM endpoint (CLAUDE.md §7) once the form slug,
   API key and CORS origin are confirmed. Also: the confirmation SVG hardcodes `#8A5E10`.

### Content permissions as they now stand

The user granted **"you can create the new content"** — taken as licence to write prose,
headings, section framing, labels and microcopy, and a lot of that is now on `/ventures/`.
It is NOT licence to invent checkable business facts (student numbers, partner universities,
success rates, testimonials, extra accreditations, offices, staff names). That distinction was
stated explicitly and accepted. CLAUDE.md non-negotiable #1 still governs.

Copy written this session, all in the page template, none in `_data`: the masthead paragraph
("…access to opportunity shouldn't depend on where someone starts"), "Where the three meet" and
its paragraph, the ICEF scope note, "No accreditation on record" (deliberately not "None" —
absence of a record is not evidence of absence), and the close band.

### Photography

`institute-plate.jpg` is a NEW derivative committed this session. The full `institute.jpg` frame
is dominated by a projector carrying unrelated third-party branding (**ABB Robotics**,
"Transforming the future of construction industry"). Incidental at the homepage's small sticky
size; at this page's plate size it read as a partnership Admizz does not have — on the one page
whose entire job is verifiable credibility. Cropped to the audience only.

`education.jpg` and `workforce.jpg` remain the ones a previous session flagged as reading like
stock/AI-generated. They are the only venture photography in the repo and are used under the
same explicit exception. **On a credibility page they are the weakest element — real photography
would lift `/ventures/` more than any further code.** Worth raising with the client.

### Five traps this session cost real time on — read before touching CSS or GSAP

1. **A find/replace matched a NESTED selector and silently deleted two rule blocks.**
   `css.index('.masthead-figure {')` hit the copy inside a media query, swallowing
   `.record-strip*` and `.masthead-index-*` entirely. Build green, homepage guard green, page
   visibly broken. Anchor replacements on something unique, and re-screenshot the whole page.
2. **GSAP rewrites an element's ENTIRE transform.** A CSS `translate(-50%,-100%)` was silently
   discarded when GSAP animated `y` on the same element, dropping a label onto a circle's arc.
   Use `xPercent`/`yPercent` so GSAP owns the centring, or animate an inner child.
3. **The build reports a misleading error when CSS fails to parse.** A PostCSS
   "Unclosed block" surfaced as `ENOENT ... .11ty-vite/robots.txt`. Grep the log for the PostCSS
   error before chasing the file it names.
4. **`npm run dev` overwrites `dist/` with development output.** Never verify a production build
   against `dist/` while `eleventy --serve` is running. Protocol: stop dev → `npm run build` →
   serve `dist/` on a static port → verify → restart dev.
5. **The header is FIXED and ~70px tall at rest (66px mobile).** Any page opening on a full-bleed
   band needs `padding-top` that clears it. A symmetric padding value tuned for the bottom put
   the eyebrow and index rail *underneath* the header at every width. Measure clearance.

### Verification scripts — gitignored, recreate as needed

Playwright 1.62.1 resolves from the project's `node_modules`; run scripts from the repo root.
The ones that earned their keep: bounded-viewport scroll screenshots with real `page.mouse.wheel`
(never `fullPage`); a no-JS + `reducedMotion:'reduce'` probe asserting content renders finished;
a geometry probe comparing label boxes against circle equations; and a **CSS contract check**
asserting every styled class on a page exists in both the HTML and the compiled CSS — that last
one exists specifically because trap #1 got past everything else.

### Open items carried forward, still unresolved

- **Palette.** Still blue (`navy.DEFAULT: #3D5AFE`). `docs/briefs/A-palette-revert.md` would
  revert to `#002856`, but **a palette revert repaints the homepage**, so it cannot happen on
  this branch. It needs its own branch where a homepage change is the point. Note `ink.faint`
  currently measures 3.03:1 on paper and is failing AA on 10px mono labels; the brief's
  `#666E80` fixes it. Still never explicitly decided by the user — do not assume.
- **The lookalike-silhouette test (non-negotiable #4) has still never been run on any page.**
- **The dead Institute link is still in the frozen footer**, therefore on all 8 pages. Fixed on
  `/ventures/` only. Belongs in the same small homepage PR as the framing correction.
- `docs/briefs/` (4 briefs) and the Impeccable install are still untracked, deliberately.
- Two content-provenance questions: `site.json.legalName` ("Admizz Group" vs live og:site_name
  "Admizz Consulting Group") and `site.json.description`'s wording/source tag.
- `robots.txt` still `Disallow: /` — correct until launch.
- `/verify-admizz-content` skill still exists and is read-only.

## If you only remember five things

> **Scope note (2026-08-30):** the five below describe the `redesign/inner-pages` branch and are
> still accurate *for that branch*. They are NOT the current direction. The agreed next work is
> the content harvest + homepage rebuild in the session block at the top of this file, which
> happens on a NEW branch and deliberately changes the homepage. Read that block first.


1. **`redesign/inner-pages` has 4 commits, all local, never pushed.** Nothing built since
   2026-08-26 exists anywhere but this machine.
2. **The homepage must not change.** Byte-diff `dist/index.html` (hashes normalised) against
   `c8f97e30da7b6bed63bbcbd212d5221f6f8b1644` after every commit. It has held so far.
3. **A green build proves nothing about your CSS surviving.** Rules were deleted silently once
   already. Assert styled classes exist in the compiled output, and re-screenshot whole pages.
4. **`/contact/` currently lies to visitors** — it claims someone will be in touch and sends
   nothing. That is the most damaging thing left on the site.
5. **Measure, don't guess.** The diagram's label overflow was arithmetic (a 91px region holding
   119px of text), not placement — no amount of nudging would ever have fixed it.
