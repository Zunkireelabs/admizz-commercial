# BRIEF D — `/insights/<slug>/` (the article template)

One page template, three output URLs. Everything else on the site is out of scope.

Hand this whole fenced block to the Sonnet session.

---

```
Read ./CLAUDE.md in full before anything else. It OVERRIDES the global ~/CLAUDE.md, which
describes a completely different project (a Next.js/Supabase multi-tenant CRM) and applies
to NOTHING in this repo. In particular: do NOT invoke /project-pm. Do not look for
docs/SESSION-LOG.md, STATUS-BOARD.md, FEATURE-ROADMAP.md or FEATURE-CATALOG.md — they do
not exist here. This is a static Eleventy + Vite + Tailwind + Alpine site.

Branch: redesign/inner-pages. Already checked out. Commit here; DO NOT push.

## The job

Rebuild ONE template:

    src/pages/insights/post.njk   →   /insights/<slug>/   (3 URLs, one template)

The three URLs, all of which must be checked:
    /insights/navigating-your-path-to-global-opportunities/
    /insights/empowering-careers-through-lifelong-learning/
    /insights/ace-your-exams-unlock-your-future/

This is the weakest page on the site. Nothing else is in scope — not /insights/, not
/about/, not /contact/, not the homepage. Those have their own briefs coming.


## RULE 1 — THE HOMEPAGE MUST NOT CHANGE. This is the hard one.

This page shares base.njk, header.njk, footer.njk, main.css and main.js with the homepage.
Editing a shared class silently changes the homepage. Work ADDITIVELY: new page-scoped CSS
classes, new markup. Do not edit an existing shared class.

**Off-limits files:**
    src/pages/index.njk   base.njk   header.njk   footer.njk
    tailwind.config.js    .eleventy.js
    partials/ecosystem-journey.njk   story-journey.njk   facet-field.njk

**These 13 CSS classes are rendered by the homepage or by shared partials. Do NOT edit
their definitions in src/assets/css/main.css:**
    .btn-ghost  .btn-ghost-on-navy  .btn-primary  .eyebrow  .eyebrow-on-navy
    .eyebrow-pill  .facet-field  .fade-up  .link-underline  .nav-link  .shell
    .skip-link  .text-balance

`.link-underline` is the one that will catch you out — it's used on this page AND on the
homepage. Want a different underline? Add a NEW class.

You may USE any of these classes freely. You just may not change their definitions.

**Data files are shared — do NOT edit any EXISTING field in src/_data/*.json.**
Adding a NEW field is fine and is expected here (see "Paragraphs" below). `insights.json`
is read by the homepage and by header.njk, so changing an existing value changes the
homepage.

### How you prove the homepage didn't change — run this after EVERY commit

    npm run build
    sed -E 's/-[A-Za-z0-9_-]{8}\.(css|js|jpeg|jpg|webp|png|svg)/-HASH.\1/g' dist/index.html \
      | shasum | awk '{print $1}'

It MUST print exactly:

    c8f97e30da7b6bed63bbcbd212d5221f6f8b1644

This has held across every commit on this branch. If it changes, you broke the homepage —
stop and fix it before continuing, don't "note it and move on".

Also confirm `git status` never shows src/pages/index.njk or .eleventy.js as modified.


## RULE 2 — INVENT NOTHING

CLAUDE.md non-negotiable #1. Do NOT invent: dates, authors, bylines, statistics, student
numbers, success rates, partner universities, testimonials, awards, certifications, office
locations, staff names, categories, or tags.

**There is no date field and no author field in insights.json. Do not add either.** Do not
put "5 min read · March 2026" style furniture on this page. If a piece of article chrome
requires a fact that doesn't exist, the chrome doesn't ship.

Do NOT pull content from admizzeducation.com or admizzworks.com. CLAUDE.md §4 restricts all
content to admizz.com itself.

Any short connective copy YOU write (a section label, a caption) is permitted, must claim
nothing not already in the data, and must live in the page template — NOT in src/_data/.


## RULE 3 — DON'T REUSE THE HOMEPAGE'S SIGNATURE TREATMENTS

  - The sticky-photo crossfade (partials/ecosystem-journey.njk) belongs to the homepage.
  - The drag-scrub journey (partials/story-journey.njk) belongs to the homepage.
  - Glassmorphism and 3D exist ONLY inside story-journey.njk as an explicit scoped
    exception. Banned everywhere else. Do not reuse either.
  - partials/facet-field.njk is restricted to navy "bookend" sections.
  - **No cards.** A card grid was rejected outright by the user ("looks so crap"). This site
    carries hierarchy with type, rule lines and whitespace — not boxed chrome.
  - Do not copy /ventures/'s devices either (index rail, record strip, numbered plates,
    hairline ledgers). That page is a documentary register; this one is not. Two pages that
    look like two skins of one template is the failure mode.


## THE ACTUAL DESIGN PROBLEM — read this before you design anything

I measured every article body. This is the whole content of the page:

    navigating-your-path-to-global-opportunities   68 words, 4 sentences
    empowering-careers-through-lifelong-learning   61 words, 4 sentences
    ace-your-exams-unlock-your-future              72 words, 4 sentences

**These are not articles. They are ~65-word notes.** The page is broken today not only
because the body is one undivided <p> (it is — measured: 1 paragraph, 72 words) but because
it is dressed as a longform article template with almost nothing inside it. A two-column
essay layout with a sidebar, wrapped around 65 words, is why the page reads as unfinished.

**The design decision, already made — do not relitigate it:** treat these as SHORT NOTES and
let the page own that. Deliberate, confident brevity. A tight, well-set page that looks
finished at 65 words beats a longform shell that looks empty. Do not add filler, do not
stretch the type to fill space, do not invent sections.

**Do NOT add a reading time.** The `readingTime` filter in .eleventy.js is
`max(1, round(words/200))`, so all three pages would print an identical "1 min read" —
the same string on every page, derived from 65 words. It communicates nothing. An earlier
brief asked for it; that instruction is withdrawn.

⚠️ **The filter is NOT unused, and this is a homepage-freeze landmine.** The homepage
renders `{{ post.body | readingTime }}` at src/pages/index.njk:282, and /ventures/ renders
it at line 304. That means **the `body` field of insights.json is read by the frozen
homepage.** If you edit, re-split, trim or reword `body`, the homepage's "N min read"
output can change and the fingerprint check WILL fail. This is the single most likely way
to break the freeze on this task. Add new fields; leave `body` byte-for-byte untouched.

### The fourth-sentence problem

Every one of the three bodies ends with a teaser sentence written for a blog card, not for
the article itself:

    "Discover how we've empowered countless students to achieve their academic goals globally."
    "Read more to find out how we are transforming lives through education and upskilling initiatives."
    "Dive into the secrets of test success with Admizz Institute."

"Read more to find out how" INSIDE the article is nonsense — there is nothing more to read.
These are real admizz.com strings (`source: "admizz"`), so **you may not rewrite them.**

Handle it structurally instead: lift that final sentence OUT of the body flow and set it as
a closing line — a distinct closing/cta register at the foot of the note, next to the link
to the venture. Same words, unchanged, given a role where they make sense. Do not delete it
and do not reword it.

Flag this in your report as a content-request item for the client (the bodies need real
article copy, or the format should be renamed away from "Insights").

### Paragraphs — how to split without inventing

The fix is to segment the existing text, not to write new text.

Add a NEW field to each entry in src/_data/insights.json — suggested name `paragraphs`
(an array of strings) plus `closing` (the fourth sentence) — and leave the existing `body`
field **completely untouched** (adding is allowed; editing an existing field is not).

Hard constraint: the words in `paragraphs` + `closing` must be byte-identical to the words
in `body`, in the same order. Nothing added, removed, reordered or reworded. You are only
choosing where the breaks go. Prove it in your report by showing a comparison of the
concatenated new fields against the original `body` for all three entries.

Each body is 4 sentences (roughly 11–28 words each), so realistically that's 2 short
paragraphs + 1 closing line. Do not force 4 one-sentence paragraphs — that looks like a list.

Mark the new fields with `"source": "admizz"` semantics preserved — i.e. do not add a
`source: "written"` tag to re-segmented admizz copy, because the WORDS are still admizz's.
Add a brief comment in your report explaining the segmentation choice.


## MATERIAL THAT EXISTS AND IS CURRENTLY UNUSED — use it

  - **The venture ↔ article mapping is a clean 1:1**, already in insights.json via `venture`:
        Admizz Institute            → ace-your-exams-unlock-your-future
        Admizz Education            → navigating-your-path-to-global-opportunities
        Admizz Workforce Solutions  → empowering-careers-through-lifelong-learning
    Derive it from the data. Do not hardcode slugs.

  - **`hrefLabel` in src/_data/ventures.json.** Values: "No public site yet" /
    "admizzeducation.com" / "admizzworks.com".

  - **Each post has a real photo** with real alt text already written:
    study-abroad.jpg, lifelong-learning.jpg, exams.jpg.


## FIX THESE REAL BUGS WHILE YOU'RE IN THERE

1. **Body renders as ONE `<p>`** (post.njk line 32, `{{ post.body }}`). Measured: 1
   paragraph. Fix per the "Paragraphs" section above.

2. **Dead link dressed as a real one.** The template renders
   `<a href="{{ post.ventureHref }}">Explore {{ post.venture }}</a>`. For the Institute post,
   `ventureHref` is `"#"` — so /insights/ace-your-exams-unlock-your-future/ ships a
   keyboard-focusable anchor that goes nowhere. I verified this: tag `A`, href `#`,
   tabIndex 0.

   Fix it honestly using the `hrefLabel` pattern from ventures.json: when there is no real
   URL, render a NON-INTERACTIVE element showing the status ("No public site yet") instead
   of an anchor. It must not be focusable and must not have a link's affordance. Derive the
   venture record by matching `post.venture` against ventures.json `name`.

   (The same dead link also exists in the shared footer on all 8 pages. That is NOT in scope
   here — the footer is frozen. Leave it. It's queued in a separate homepage brief.)

3. **The aside leaves the right column empty for most of the page.** At 1440px the
   "More Insights" aside is a short stub and the entire right side below it is blank. Solve
   this structurally — a different layout relationship between image, text and related
   links — not by padding the aside with invented content.


## DESIGN CONSTRAINTS (from CLAUDE.md §5 — these are measured values, don't re-derive)

  - Palette is UNCHANGED. Do not touch tailwind.config.js. Current brand blue stays.
  - **Gold is never text on a light ground** (1.41:1). Use the `gold-text` token (#8A5E10,
    5.23:1 on paper) for gold-toned text on light. Gold as a surface/rule/seal is fine.
  - Radii scale to element size: 4px chips/inputs, 8px cards, 12–16px panels. NEVER uniform
    rounded-2xl — CLAUDE.md calls it the loudest template tell of 2026.
  - One signature easing curve: `cubic-bezier(.23, 1, .32, 1)` (the `ease-signature` token).
    100ms hover/press/focus (`duration-press`), 300–700ms entrances (`duration-enter`),
    index-staggered — never simultaneous.
  - Body copy stays 15px with POSITIVE tracking. Negative tracking on display type only.
  - Measure for body text: `max-w-measure` (68ch) / `max-w-measure-tight` (54ch) exist.
  - **Reveal animations must be VISIBLE BY DEFAULT in CSS.** JS only ARMS them into the
    hidden state by adding `.js-armed`. Never make base visibility depend on JS running.
    Read the comment block above `.fade-up` / `.grow-line` in main.css before touching this.
  - `prefers-reduced-motion` must FULLY disable Lenis, not shorten it. Already handled in
    main.js — don't regress it.
  - **`navyHeader: true` front-matter is currently set on this template and is only valid
    while the page's FIRST section is a full-bleed navy band.** The header is transparent
    over navy; if you change the page to open on paper you MUST remove the flag or you get
    light header text on a light background (illegible).
  - **base.njk has NO block/slot mechanism.** A page cannot inject into `<head>` or add
    per-page `<script>`/`<style>` tags via a layout block. Anything page-specific must be
    inline in the page template body. (Inline non-module `<script>` in the body runs BEFORE
    the deferred module bundle, so defining a global for Alpine's `x-data` does work.)
  - Mobile gets a plain, natural stack. Never force a desktop interaction onto small screens.
  - New page-scoped CSS goes at the END of main.css, following the commented-section pattern
    already used for the `/ventures/` block. Add a header comment saying it is page-scoped
    and that nothing above is rendered by the homepage.


## TRAPS THAT HAVE ALREADY COST THIS PROJECT REAL TIME — read before touching CSS or JS

1. **A find/replace matched a NESTED selector and silently deleted two whole rule blocks.**
   Build stayed green (valid CSS, just less of it), the homepage guard passed (the homepage
   didn't use those classes), and the page was visibly broken. The user found it, not the
   tooling. ANCHOR replacements on something unique, and re-screenshot the WHOLE page after
   any structural CSS edit. Prefer appending over rewriting.

2. **A green build is NOT evidence your CSS survived.** Assert the literal class name exists
   in the compiled `dist/assets/main-*.css` AND in the built HTML. Tailwind has silently
   emitted no CSS for a valid-LOOKING class in this repo before (`bg-navy-deep/92`). If a
   style doesn't appear despite a clean build, grep the compiled CSS for the literal class
   before assuming you mis-eyeballed it.

3. **`npm run dev` overwrites `dist/` with development output.** NEVER verify a production
   build against dist/ while `eleventy --serve` is running — you will get a false homepage
   fingerprint. Protocol: stop dev → `npm run build` → serve dist/ on a static port →
   verify → restart dev if needed. (I hit exactly this at the start of the planning session
   and got a mismatched fingerprint that was a test artifact, not a regression.)

4. **The build reports a MISLEADING error when CSS fails to parse.** A PostCSS "Unclosed
   block" surfaces as `ENOENT ... .11ty-vite/robots.txt`. Grep the build log for the PostCSS
   error before chasing the file it names.

5. **GSAP rewrites an element's ENTIRE transform.** A CSS `translate(-50%,-100%)` was
   silently discarded when GSAP animated `y` on the same element. Use `xPercent`/`yPercent`
   so GSAP owns the centring, or animate an inner child. (Only relevant if you use GSAP —
   you probably don't need it for this page.)

6. **The header is FIXED, ~70px tall at rest (66px mobile).** Any page opening on a
   full-bleed band needs `padding-top` that clears it. Measure the clearance; don't guess a
   symmetric padding value.

7. **`npm run build` runs Eleventy TWICE on purpose** (see the comment in .eleventy.js) —
   pass 1 generates images, pass 2 is the one Vite hashes correctly. Do NOT "simplify" this
   to one pass. Files the image shortcodes generate must land inside src/assets/images/.


## VERIFY BEFORE YOU REPORT — measure, don't guess

Playwright 1.62.1 resolves from this project's node_modules. Run scripts FROM THE REPO ROOT.
Verification scripts are gitignored by pattern (`.shot.mjs`, `.verify.mjs`, `.check.mjs`,
etc.) — reuse those names or add to .gitignore; do not commit them.

  - `npm run build` clean.
  - Homepage fingerprint check above → must be c8f97e30da7b6bed63bbcbd212d5221f6f8b1644.
  - **All THREE article URLs** screenshotted at 1440px, 768px and 390px. Not just one —
    they share a template but have different image aspect ratios and title lengths.
  - **Do NOT use fullPage screenshots.** This site has a fixed header and a sticky section;
    full-page composites render them unreliably and have already caused one false "it's
    broken" diagnosis. Use bounded-viewport scroll checkpoints with real `page.mouse.wheel`
    in a loop with waits — NOT `window.scrollTo()`, which Lenis does not drive.
  - A no-JS + `reducedMotion:'reduce'` probe asserting the content renders FINISHED (not
    stuck at opacity 0). This is the single most important accessibility check on this site.
  - A CSS contract check: every class you styled exists in both the built HTML and the
    compiled CSS. This check exists specifically because trap #1 got past everything else.
  - Keyboard pass: focus order is sensible, every link has a discernible name, and the
    Institute post's non-link is NOT focusable as if it were a link.
  - Re-read your output against insights.json and ventures.json and confirm no invented fact
    reached any page.

Do not claim anything is verified that you did not actually measure.


## COMMIT

Commit on redesign/inner-pages. DO NOT push. Run the homepage fingerprint check after the
commit and paste the result.

Conventional-commit style, matching the existing log, e.g.:
    redesign(insights): rebuild the article template as a short-note page


## REPORT BACK WITH

  1. The homepage fingerprint after your final commit, pasted verbatim. State plainly
     whether it matched.
  2. What you built and why, especially the layout decision that replaced the empty-right-
     column two-column shell.
  3. Screenshots of all THREE article URLs at 1440 / 768 / 390.
  4. The paragraph segmentation, shown as a before/after word-for-word comparison against
     the original `body` for all three entries, proving nothing was added or reworded.
  5. Every piece of copy you wrote yourself, quoted, so it can be checked against the
     no-invention rule.
  6. Your evidence for the dead-link fix: the rendered markup for the Institute post's
     venture reference, plus proof it is not focusable.
  7. Anything in this brief that turned out to be WRONG when you looked at the real files.
     Say so rather than working around it silently.
  8. Anything you could not do without inventing content.
```
