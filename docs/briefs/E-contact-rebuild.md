# BRIEF E — `/contact/` full rebuild

One page. The user's verdict on the current version: *"looks like AI slop."* They are right, and
this brief names exactly why so the rebuild doesn't reproduce it.

Hand the whole fenced block below to the Sonnet session.

---

```
Read ./CLAUDE.md in full before anything else. It OVERRIDES the global ~/CLAUDE.md, which
describes a completely different project (a Next.js/Supabase multi-tenant CRM) and applies
to NOTHING in this repo. In particular: do NOT invoke /project-pm. Do not look for
docs/SESSION-LOG.md, STATUS-BOARD.md, FEATURE-ROADMAP.md or FEATURE-CATALOG.md — they do not
exist here. This is a static Eleventy + Vite + Tailwind + Alpine site.

Branch: redesign/inner-pages. Already checked out. Commit here; DO NOT push.

## The job

Rebuild ONE page, completely:

    src/pages/contact/index.njk   →   /contact/

Nothing else is in scope. Not the homepage, not /ventures/, /about/ or /insights/.


## WHY THIS PAGE IS BEING REBUILT — the brief's whole point

The user looked at the current page and said it looks like AI slop. That is an accurate
read. Here are the nine specific tells, measured and named. Your rebuild is judged on
whether these are gone — not on whether it "looks nicer".

 1. **The headline is "Let's talk."** The single most generic contact headline in existence.
 2. **The intro is a textbook AI tricolon**: "Whether you're a student, a partner
    institution, or exploring a career move — ...". Three parallel clauses then an em dash.
    That cadence is a fingerprint. Do not write another one anywhere on this page.
 3. **The form is a bordered box floating on the right** — `border border-rule rounded-lg
    p-8` — i.e. a card. THE template contact layout. CLAUDE.md bans cards on this site and a
    card grid was already rejected outright by the user once ("looks so crap").
 4. **Four identical fields.** Same width, same radius, same padding. A name field and a
    message field are not the same object and must not be drawn as the same object.
 5. **Doubled labelling.** A mono label AND a placeholder saying the same thing
    ("Full name" / "Your name"). Pick one job per element.
 6. **A full-bleed gold "Send message" button.** Generic to the point of invisible.
 7. **The page has NO visual anchor at all.** No photograph, no diagram, no texture, nothing.
    Every other page has one — the homepage has photography, /ventures/ has the field
    diagram, /about/ has the founder portrait. Contact has literally zero.
    **This is the biggest single gap and the user explicitly asked for it to be fixed.**
 8. **The page is short and empty.** Measured: 1278px tall at 1440px viewport, with content
    stopping around 800px. The bottom third and the whole right side below the form are dead.
 9. **A dead link dressed as a real one.** Admizz Institute renders as `<a href="#">`,
    keyboard-focusable, going nowhere. Verified: tag `A`, href `#`, tabIndex 0.

Plus one behavioural bug, verified in a real browser:

10. **The form submits completely empty.** It has `novalidate` AND `required` with nothing
    replacing the validation `novalidate` turns off. I clicked submit with every field blank
    and it went straight to the confirmation state. It has no error states at all.

11. **The confirmation SVG hardcodes `#8A5E10`** (index.njk ~lines 107–108) instead of using
    the `gold-text` design token.

And three more found by measuring the built page at 1440 / 1728 / 1920 / 2560px. All four
widths produce IDENTICAL numbers, so these are structural, not a wide-screen edge case:

12. **120px of dead space inside the form card, below the submit button.** The card is a
    grid item that stretches to the row height (659px) while its content is ~120px shorter,
    so it ships a visible empty tail. This is the dangling gap at the bottom of the box.
    Do not "fix" it by adding filler — the card itself is going away (see tell #3).

13. **The contact rows tear apart.** `.data-row` is
    `flex ... justify-between` with nothing constraining it, so the label and its value sit
    at opposite edges of the column. Measured label→value gaps: **326px, 399px, 374px**.
    "ADDRESS" and "Denver, Colorado, USA" stop reading as a pair — they read as two
    unrelated fragments. `.data-row` is contact-only (verified), so you may rewrite it
    freely. A label/value pair must remain visually bound at every width.

14. **The submit button is 450px wide.** That is a bar, not a button. Width should come from
    the control's own purpose, not from `w-full` inside whatever box contains it.

Note the shell is capped at 1240px, so beyond ~1440px the page just centres and the outer
margins grow. The problems above are INSIDE the columns and are therefore present at every
width — fix them structurally, not with a wide-viewport media query.


## THE CONCEPT — build this, don't invent a different one

The page has a real job no other page does: **it routes an enquiry to one of three
businesses with genuinely different audiences.** Admizz Institute (test prep), Admizz
Education (study abroad), Admizz Workforce Solutions (US vocational rehabilitation — NOT
the careers arm of a study-abroad company; see docs/01-AUDIT.md). That routing job is the
page's identity and it is what the design should express.

### Required page structure — three sections

**Section 1 · Masthead (paper ground).**
Statement: eyebrow, h1, one short intro paragraph. This page must NOT open on a navy
full-bleed band — /ventures/ and /insights/<slug>/ both already do, and a third navy opener
makes the site read as one template with recolours. Consequently **do NOT add
`navyHeader: true` to this page's front matter.** (That flag is only valid when the first
section is a full-bleed navy band; setting it on a paper page gives light header text on a
light ground — illegible.)

**Section 2 · The desk — the heart of the page.**
Two columns at desktop:
  - LEFT: the routing illustration (see below) with the destination register directly
    beneath it — a real radio group of 4 options (a general/group option + the 3 ventures),
    styled as rule-lined register rows, NOT as cards or chips. Each row shows the venture
    name, its vertical, and its real route.
  - RIGHT: the form. NOT in a card. No border box.
Keep the illustration and the register that controls it in the SAME viewport region so the
feedback loop is actually visible. Number the two halves as steps (destination, then
message) so the page reads as a sequence rather than two unrelated blocks.

**Section 3 · Direct lines.**
Address, phone, email as a proper ledger, plus the three venture routes handled honestly
(see `hrefLabel` below). This is what fills the dead bottom third of the page. Use real data
from site.json and ventures.json only.

### The illustration — what the user asked for

Build a **bespoke inline SVG routing diagram**: one enquiry entering, branching to three
destinations. It must be **wired to the destination register** — selecting a destination
highlights that branch. That is what satisfies CLAUDE.md non-negotiable #3 (interactivity
must navigate real content): it reflects real state and real venture data instead of being a
decorative shape.

Requirements:
  - Inline SVG authored by you. No external asset, no icon-library clipart, no stock vector.
  - Brand register: hairline strokes, the rule/navy tokens for line work. Gold may be a
    fill, a mark or a rule — NEVER text on a light ground (1.41:1, fails). The `gold-text`
    token (#8A5E10, 5.23:1) is the only gold-toned text allowed on paper.
  - `aria-hidden="true"` and non-focusable. The register beneath it carries all the real
    semantics; the diagram is a visual echo of state, not a control.
  - **Must render correctly with NO JavaScript** — its base state must be a valid, finished
    state, exactly like the `.fade-up` / `[data-photo="0"]` armed-guard pattern used
    elsewhere in this repo. Content and structure must never depend on JS having run.
  - Must respect `prefers-reduced-motion`.
  - Must NOT reuse /ventures/'s three-overlapping-circles field diagram. Different page,
    different idea, different drawing.

**Banned illustration ideas — every one of these is either a cliché or a factual lie:**
  - ✗ A world map or globe with location pins. This is THE obvious contact-page move and it
    would fabricate offices Admizz does not have. Violates non-negotiable #1. The only
    verified location is "Denver, Colorado, USA".
  - ✗ A paper plane. The definitive AI contact-page cliché.
  - ✗ Envelopes, chat bubbles, telephone handsets, "24/7" badges, headset icons.
  - ✗ Falling back to `education.jpg` / `workforce.jpg` photography. Those two were already
    flagged in this project as reading like stock/AI-generated imagery — using them HERE
    would make the exact problem the user is complaining about worse.
  - ✗ Any number, count, statistic, response-time promise or "trusted by" strip.

### The popup — the user explicitly asked for this

After a VALID submit, open a real modal dialog. Build it properly; most implementations of
this are broken.

  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at its heading.
  - Focus moves INTO the dialog on open, is TRAPPED while open, and RETURNS to the element
    that triggered it on close.
  - Escape closes it. Backdrop click closes it. There is a visible, labelled close control.
  - `x-cloak` so it cannot flash before Alpine boots (base.njk already ships an `[x-cloak]`
    display:none rule).
  - Respects `prefers-reduced-motion`.
  - **Scroll lock: reuse the pattern already in this repo.** header.njk line 8 does
    `x-effect="document.body.classList.toggle('overflow-hidden', open)"` for the mobile nav.
    Use that same approach. Do NOT try to call `lenis.stop()` — the Lenis instance is a
    module-local `const` in main.js (line 54) and is deliberately not exposed on `window`.
    Do not expose it just for this.

**What the popup says — read this carefully.**
The form is NOT wired to any backend. CRM integration is a LATER, separate task the user has
explicitly deferred. So:
  - Isolate the submit action in ONE clearly-named function with an obvious `// TODO: POST to
    CRM` seam, so wiring it later is a one-function change. Do not scatter submit logic.
  - Do NOT invent a ticket/reference number, an ETA, a response-time promise, or a named
    person who will reply.
  - The popup may confirm what the visitor chose and point them at the real, working routes
    (info@admizz.com, 720-505-3611) — those are verified facts in site.json.
  - Add a `{# ... #}` comment at the top of the template stating plainly that the form does
    not submit anywhere yet and that the confirmation copy MUST be revisited before launch.

⚠️ **Add a launch blocker.** Append a short "Launch blockers" note to docs/briefs/ (a new
file is fine) recording that (a) /contact/ confirms submissions that are never sent, and
(b) public/robots.txt is still `Disallow: /`. Both must be resolved before the site goes
public. Today the site is not indexable (robots.txt disallows everything and base.njk emits
`noindex` outside production), so nobody is currently misled — that is what makes shipping
the popup now acceptable, and it stops being true the day robots.txt flips.

### The form itself

  - Kill the card. No border box around the form.
  - Give the fields real hierarchy — a short single-line name field and a multi-line message
    field must not be drawn identically. Vary width and weight with purpose.
  - Remove the doubled labelling. A visible label and a placeholder must not say the same
    thing. Every field keeps a programmatically associated visible label (placeholder-only
    labelling is an accessibility failure — do not "fix" the doubling by deleting labels).
  - The destination is chosen by the register radio group in the left column. Do NOT also
    ship a duplicate `<select>` for the same value.
  - **Real validation.** Implement it properly with visible, accessible error states:
    `aria-invalid` on the field, `aria-describedby` pointing at the message, the message in
    a live region, and focus moved to the FIRST invalid field on a failed submit. Validate
    on submit and on blur-after-first-interaction — do not scold the user mid-first-keystroke.
  - Errors must not rely on colour alone (WCAG 1.4.1) — pair colour with text and/or a mark.
  - Real states, all of them: empty, focused, invalid, submitting (disabled + label change),
    and done. The submit button must not be clickable twice.
  - Replace the hardcoded `#8A5E10` with the `gold-text` token.


## RULE 1 — THE HOMEPAGE MUST NOT CHANGE

This page shares base.njk, header.njk, footer.njk, main.css and main.js with the homepage.
Work ADDITIVELY: new page-scoped CSS classes, new markup.

**Off-limits files:**
    src/pages/index.njk   base.njk   header.njk   footer.njk
    tailwind.config.js    .eleventy.js
    partials/ecosystem-journey.njk   story-journey.njk   facet-field.njk

**Do NOT edit the definitions of these shared classes in src/assets/css/main.css.** You may
USE them freely; you just may not change them:
    .btn-ghost  .btn-ghost-on-navy  .btn-primary  .eyebrow  .eyebrow-on-navy
    .eyebrow-pill  .facet-field  .fade-up  .link-underline  .nav-link  .shell
    .skip-link  .text-balance

Two additions to that list, verified by grep for this brief:
  - **`.data-label` is shared** — used by BOTH /contact/ AND /ventures/. Do NOT edit it.
    (An earlier brief wrongly implied it was contact-only.)
  - **`.data-row` IS contact-only** — verified, only src/pages/contact/index.njk uses it.
    You may change or delete it freely.

`.link-underline` is the one most likely to catch you out — used on this page AND on the
homepage AND in both homepage partials. Want a different underline? Add a NEW class.

**Do NOT edit any EXISTING field in src/_data/*.json.** Every one of those files feeds the
homepage or a partial that renders on it. Adding a NEW field is fine. Any copy you write
belongs in the page template, not in the data files.

### How you prove the homepage didn't change — run after EVERY commit

    npm run build
    sed -E 's/-[A-Za-z0-9_-]{8}\.(css|js|jpeg|jpg|webp|png|svg)/-HASH.\1/g' dist/index.html \
      | shasum | awk '{print $1}'

It MUST print exactly:

    c8f97e30da7b6bed63bbcbd212d5221f6f8b1644

This has held across every commit on this branch. If it changes, you broke the homepage —
stop and fix it, don't note it and move on. Also confirm `git status` never shows
src/pages/index.njk or .eleventy.js as modified.


## RULE 2 — INVENT NOTHING

CLAUDE.md non-negotiable #1, and it is the rule most at risk on a contact page.

Do NOT invent: office locations or a second address, staff names, department names, team
photos, response times ("we reply within 24 hours"), opening hours, statistics, student
numbers, social media links (site.json's `social` object is EMPTY — twitter, linkedin and
github are all `""`; do not fill them in or link to guessed profiles), a support ticket
system, live chat, or a map.

The complete set of verified contact facts, all from src/_data/site.json:
    address    Denver, Colorado, USA
    phone      720-505-3611     (phoneHref: tel:+17205053611)
    email      info@admizz.com
    founded    2015
    founder    Manish K Sah, Founder & CEO

That is everything. If a design element needs a fact not on that list, the element doesn't
ship. A page that is honest and slightly quieter beats a page padded with invented
credibility — that is precisely the "AI slop" failure being corrected here.

### Copy

You are permitted to write the connective copy on this page (headings, labels, the intro,
microcopy). It must claim nothing not in the data above, and it must live in the page
template, NOT in src/_data/.

**Banned phrases** — every one is an AI-contact-page tell:
    "Let's talk"          "We'd love to hear from you"      "Drop us a line"
    "Get in touch" as the H1                                 "Reach out"
    "Whether you're X, Y, or Z" (or any three-part parallel clause + em dash)
    "We're here to help"  "Your journey starts here"        "Let's build something together"

Direction that fits: the page's real job is routing an enquiry to one of three businesses.
"Three businesses, one group" is the framing /ventures/ already established — the contact
page is the door into that. Write something specific to routing. Quote every line you wrote
in your report so it can be checked.


## RULE 3 — DON'T REUSE THE HOMEPAGE'S SIGNATURE TREATMENTS

  - The sticky-photo crossfade (ecosystem-journey.njk) belongs to the homepage.
  - The drag-scrub journey (story-journey.njk) belongs to the homepage.
  - Glassmorphism and 3D exist ONLY inside story-journey.njk as an explicit scoped
    exception. Banned everywhere else — including in your new modal. A frosted-glass
    backdrop is NOT acceptable; use a solid or plainly-tinted scrim.
  - facet-field.njk is restricted to navy "bookend" sections.
  - **No cards.** Hierarchy comes from type, rule lines and whitespace.
  - Do not copy /ventures/'s devices wholesale (index rail, record strip, numbered plates).
    A ledger of contact details is fine — a pixel-copy of the record strip is not.


## DESIGN CONSTRAINTS (CLAUDE.md §5 — measured values, don't re-derive)

  - Palette UNCHANGED. Do not touch tailwind.config.js.
  - Gold is NEVER text on a light ground (1.41:1). `gold-text` (#8A5E10, 5.23:1) is the only
    gold-toned text on paper. Gold as surface / rule / mark is fine.
  - **Avoid `ink-faint` for small or important text on this page.** It measures 3.03:1 on
    paper and FAILS AA at the 10px mono label size. Use `ink-muted` instead. (The real fix
    is a token change in tailwind.config.js, which is frozen — so route around it here.)
  - Radii scale to element size: 4px chips/inputs, 8px cards, 12–16px panels. NEVER uniform
    rounded-2xl — CLAUDE.md calls it the loudest template tell of 2026. Inputs get the small
    end of that scale.
  - One signature easing curve: `cubic-bezier(.23, 1, .32, 1)` (`ease-signature`).
    100ms hover/press/focus (`duration-press`), 300–700ms entrances (`duration-enter`),
    index-staggered — never simultaneous.
  - Body copy 15px with POSITIVE tracking. Negative tracking on display type only.
  - Reveal animations must be VISIBLE BY DEFAULT in CSS; JS only ARMS them into the hidden
    state via `.js-armed`. Never make base visibility depend on JS running. Read the comment
    block above `.fade-up` in main.css before touching this pattern.
  - `prefers-reduced-motion` must FULLY disable Lenis, not shorten it. Already handled in
    main.js — don't regress it.
  - **base.njk has NO block/slot mechanism.** No per-page `<head>` injection. Page-specific
    script/style must be inline in the page template body. An inline non-module `<script>`
    in the body runs BEFORE the deferred module bundle, so defining a global for Alpine's
    `x-data` does work.
  - Mobile gets a plain, natural stack. Never force a desktop interaction onto small
    screens — the routing diagram in particular must degrade sensibly at 390px, and the
    modal must be usable there.
  - New page-scoped CSS goes at the END of main.css following the commented-section pattern
    already used for the `/ventures/` block, with a header comment noting it is page-scoped.


## USE THIS — real material currently unused on the page

  - **`hrefLabel` in src/_data/ventures.json.** Values: "No public site yet" (Institute),
    "admizzeducation.com", "admizzworks.com". This exists specifically to fix the dead-link
    bug honestly: where there is no real URL, render a NON-INTERACTIVE element showing the
    status instead of an anchor. It must not be focusable and must not carry a link
    affordance. /ventures/ already does this correctly at src/pages/ventures/index.njk:290 —
    copy that approach.
  - **`vertical`** on each venture ("Test Preparation" / "Higher Education" / "Workforce
    Solutions") — real, and useful for telling the three routes apart in the register.

Note: the same dead Institute link ALSO exists in the shared footer on all 8 pages. That is
NOT in scope here — the footer is frozen. Leave it.


## TRAPS THAT HAVE ALREADY COST THIS PROJECT REAL TIME

1. **A find/replace matched a NESTED selector and silently deleted two whole rule blocks.**
   Build stayed green (valid CSS, just less of it), homepage guard passed, page visibly
   broken. The user found it, not the tooling. Anchor replacements on something unique;
   prefer appending over rewriting; re-screenshot the WHOLE page after any structural CSS edit.

2. **A green build is NOT evidence your CSS survived.** Assert the literal class name exists
   in the compiled `dist/assets/main-*.css` AND in the built HTML. Tailwind has silently
   emitted no CSS for a valid-LOOKING class in this repo before (`bg-navy-deep/92`).

3. **`npm run dev` overwrites `dist/` with development output.** NEVER verify a production
   build against dist/ while `eleventy --serve` is running — you will get a false homepage
   fingerprint. Protocol: stop dev → `npm run build` → serve dist/ statically → verify.
   (This exact trap produced a false fingerprint mismatch during planning.)

4. **The build reports a MISLEADING error when CSS fails to parse.** A PostCSS "Unclosed
   block" surfaces as `ENOENT ... .11ty-vite/robots.txt`. Grep the build log for the PostCSS
   error before chasing the file it names.

5. **The header is FIXED, ~70px tall at rest (66px mobile).** Any full-bleed opening band
   needs `padding-top` that clears it. Measure; don't guess a symmetric value.

6. **`npm run build` runs Eleventy TWICE on purpose** (see .eleventy.js). Do not "simplify"
   it to one pass.

7. **Alpine is started manually** in main.js (`Alpine.start()` on DOMContentLoaded) with
   `window.Alpine = Alpine`. Don't add a second Alpine or call start() again.


## VERIFY BEFORE YOU REPORT — measure, don't guess

Playwright 1.62.1 resolves from this project's node_modules. Run scripts FROM THE REPO ROOT.
Verification scripts are gitignored by pattern (`.shot.mjs`, `.verify.mjs`, `.check.mjs`…) —
reuse those names; do not commit them.

  - `npm run build` clean.
  - Homepage fingerprint → must be c8f97e30da7b6bed63bbcbd212d5221f6f8b1644.
  - /contact/ screenshotted at 1440px, 768px and 390px — including the modal OPEN at all
    three widths.
  - **Also check 1920px.** The user reviews on a wide display; that is how tells #12–#14 were
    found and how they will be checked. Re-measure the three numbers from #12–#14 after your
    rebuild and report the new values: dead space below the submit control, label→value gap
    on every contact row, and the submit control's width.
  - **Do NOT use fullPage screenshots.** Fixed header + sticky sections render unreliably in
    composites and have already caused one false "it's broken" diagnosis. Use bounded-
    viewport scroll checkpoints with real `page.mouse.wheel` in a loop with waits — NOT
    `window.scrollTo()`, which Lenis does not drive.
  - **Prove the empty-submit bug is fixed**: click submit with all fields blank and assert
    the modal does NOT open and errors ARE announced. This is the specific regression that
    shipped before.
  - **Prove the modal's accessibility**, don't assert it: focus is inside on open, Tab
    cycles within it, Escape closes, focus returns to the trigger.
  - A no-JS + `reducedMotion:'reduce'` probe asserting content renders FINISHED (not stuck
    at opacity 0), and that the routing diagram is in a sensible base state.
  - A CSS contract check: every class you styled exists in both the built HTML and the
    compiled CSS. This exists because trap #1 got past everything else.
  - Keyboard pass: focus order sensible, every control has a discernible name, and the
    Institute non-link is NOT focusable as if it were a link.
  - Confirm no invented fact reached the page — re-read your output against site.json and
    ventures.json.

Do not claim anything is verified that you did not actually measure.


## COMMIT

Commit on redesign/inner-pages. DO NOT push. Run the fingerprint check after committing and
paste the result. Conventional-commit style matching the existing log, e.g.:
    redesign(contact): rebuild as a routing desk with a real form and confirmation dialog


## REPORT BACK WITH

  1. The homepage fingerprint after your final commit, pasted verbatim, stated plainly as
     matched or not.
  2. Screenshots of /contact/ at 1440 / 768 / 390, plus the modal open at each.
  3. A point-by-point response to the 11 numbered problems above — what you did about each.
  4. Every line of copy you wrote, quoted, for checking against the no-invention rule.
  5. Your evidence that the empty-submit bug is fixed and that the modal is accessible —
     actual test output, not assertions.
  6. The rendered markup for the Institute route, plus proof it is not focusable.
  7. Where the CRM submit seam is (file + function name), so wiring it later is trivial.
  8. Anything in this brief that turned out to be WRONG when you looked at the real files.
     Say so rather than silently working around it.
  9. Anything you could not do without inventing content.
```
