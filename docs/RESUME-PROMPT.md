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
  - After ANY structural CSS edit, re-screenshot the WHOLE page, not just the piece you were
    working on. A find/replace that matched a nested selector silently deleted two entire rule
    blocks last session; the build stayed green (valid CSS, just less of it) and the homepage
    guard passed (the homepage didn't use those classes). The user found it, not the tooling.
  - A green build is not evidence the CSS you wrote survived. Check the compiled output for the
    literal class, and assert the page's styled classes exist in both the HTML and the CSS.
```

---

## Quick state (keep this current — last updated 2026-08-27)

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
