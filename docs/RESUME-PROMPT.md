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

One more thing before you touch anything: I was frustrated by the end of the last session — a lot of
back-and-forth that didn't land, and I told the assistant the site "still looks like trash." The
"Quick state" section below has an honest diagnosis of why, agreed with me before the session ended.
Read it, and do NOT jump into another isolated section-by-section patch. I asked for one coherent
redesign pass, not more reactive tweaks — start there.
```

---

## Quick state (keep this current — last updated 2026-08-25)

**Phase:** The hero section was rebuilt from scratch this session against an explicit visual
reference the user supplied (screenshots, not a written spec) and iterated through many rounds of
direct pixel-level comparison — "compare this to that" — rather than abstract feedback. It's now
committed in two commits on `redesign/hero-globe-light-bg`, both still **local, nothing pushed to
origin**:

- `8b4dec2` — the main rebuild: full-bleed split hero (photo as an absolute layer, not a boxed
  panel), eyebrow pill re-added, dot-grid globe motif, a large translucent Admizz-chevron
  watermark over the photo, a curved SVG transition into a new navy value band (Global Reach /
  Student First / Future Ready) with a soft diagonal light-sweep layer, hero-scoped heading scale,
  and extensive spacing tightened so the whole hero fits without scrolling.
- `be61c0a` — a follow-up fix: the photo layer used to extend behind the fixed nav for an
  edge-to-edge look, but that let the thrown caps near the top of the source photo end up hidden
  under the nav pill depending on viewport size. Now the photo starts just below the nav's
  measured bottom edge (93.5px, consistent at every width) instead — structural fix, not another
  crop-percentage guess.

**Dev server was stopped when this session ended** (killed mid-session, not by user request at
the very end) — start fresh with `npm run dev`, don't assume a background task survived.

### The methodology that actually worked, after a lot of failed guessing
Early in this session, fixes were applied by eyeballing screenshots and guessing at CSS values
(`object-position` percentages especially) — this produced repeated wrong fixes and visible user
frustration ("are you kidding me?", "can you even replicate a small thing"). **What actually
worked, and should be the default approach going forward for any pixel-level visual claim:**
- **Measure, don't estimate.** Use Playwright (`node` script + `page.evaluate()`) to get real
  `getBoundingClientRect()` / `naturalWidth`/`naturalHeight` values instead of guessing container
  or image dimensions from a screenshot. Several rounds of wrong `object-position` tuning were
  traced to wrong mental math about container aspect ratios — actual measurement resolved it in
  one pass every time it was used.
- **Test at the user's actual reported viewport, not a round number.** The user's real browser
  content area (after tabs/address bar/bookmarks) is **≈1280×722** on their main machine — a
  screenshot they share of "the full window" (address bar visible) is the way to get this
  precisely; do the arithmetic from the image's pixel dimensions ÷ likely DPR (2x on their
  machine) rather than assuming 1440×900 or similar is representative.
- **Verify claims with a real screenshot before stating them as fact.** Several early "this is
  fixed" claims turned out wrong because they were asserted without a fresh screenshot at the
  specific viewport in question. Screenshot → crop the specific claimed region → look, every time,
  before telling the user something is resolved.
- **Real wheel-scroll, not `window.scrollTo()`**, for anything Lenis/GSAP-driven — still true, see
  below.
- **When two constraints fight** (this session: "caps must have visible margin below the nav" vs.
  "the whole hero must fit with zero scroll" at a 722px-tall viewport), don't keep silently
  re-tuning spacing forever — find the actual structural fix (here: stop the photo from extending
  behind the nav at all) rather than a percentage that only works at one specific size.

### Open items carried forward, unresolved
- **Blue palette is still not reverted to navy/gold.** This was flagged as an open question at the
  end of the *previous* session and never got a yes/no this session either — the whole hero rebuild
  this session was done in the current blue (`navy.DEFAULT: #3D5AFE`), matching what the user's
  reference screenshots themselves showed in blue. Don't assume this settles the navy/gold
  question — it was simply never revisited. Confirm explicitly before changing the palette either
  direction.
- **The "repeated formula" critique from the previous session's diagnosis still applies to
  everything below the hero** — ventures/timeline/insights sections were not touched this session,
  only the hero was. If asked to continue the "one coherent pass," that work is still pending.
- **Mobile was explicitly deferred by the user** ("not that imp right now... figure that later")
  — the hero rebuild this session targeted desktop only; mobile hasn't been re-verified against
  any of this session's changes and may need a separate pass.
- Inner pages (`/about/`, `/insights/`, `/contact/`) still haven't had the line-by-line content
  grounding the homepage got.
- Two open content-provenance questions from before, still unresolved: `site.json.legalName`
  ("Admizz Group" vs. live `og:site_name` "Admizz Consulting Group"), and `site.json.description`'s
  wording/source tag.
- The lookalike-silhouette test (non-negotiable #4) has still never been run on any page.

### Impeccable — installed, still untracked
`https://impeccable.style` was installed project-scoped last session (`.claude/skills/impeccable/`,
`.github/agents/`, `.github/hooks/`, `.github/skills/` — still **untracked**, deliberately not
committed alongside content changes). Its PostToolUse hook auto-scans CSS/UI edits. Not actively
referenced during this session's hero work, but still active/installed.

### Deliberate overrides still standing — confirm before reverting
- **Blue palette** — see "Open items" above; still an open question, not resolved either way.
- **Floating pill nav** (`rounded-full`, centered links) — against `CLAUDE.md` §5's radius scale
  rule, approved in an earlier session, widened slightly this session (`max-w-5xl` → `max-w-6xl`),
  not otherwise revisited.
- **No 3D globe** — removed in an earlier session per explicit instruction ("no earth"); this
  session's "globe" is a flat dot-grid pattern, not a reintroduction of the 3D one. Don't confuse
  the two.
- **Hero no longer uses the wave `clip-path` photo mask** from two sessions ago — that technique
  was fully superseded this session by the new full-bleed-photo-plus-curved-value-band design. The
  curve now caps the hero→navy transition below the content, not the photo itself.

### Hero photo — still the same placeholder, watermark handling changed
`src/assets/images/insights/global-opportunities.jpg` is still the hero image — real,
Admizz-branded, not purpose-shot for this placement, with an **"admizz" watermark baked into the
pixels, top-left corner**. This session's crop (`object-position: 60% 0%` plus a `scale-110` on
the image) keeps it out of frame at every viewport width tested (1280/1440/1996) — verified more
rigorously than previous sessions' attempts, including specifically re-checking wide viewports
after a horizontal-crop change let it creep back into frame once already. Still fragile in
principle if the container's aspect ratio changes again; the permanent fix (crop the source file
itself with `sharp`, save as a dedicated hero asset with the watermark physically removed) still
doesn't exist on disk.

### Content/infra facts carried forward, unchanged
- `/verify-admizz-content` skill still exists (`.claude/skills/verify-admizz-content/SKILL.md`),
  read-only, re-checks `src/_data/*.json` against live admizz.com.
- CI/CD (`stage` → `dev-web.admizz.com` auto-deploy), the public-repo decision, and the
  `ssh vps` (`manjila`) vs. pipeline `VPS_USER` (`zunkireelabs`) distinction are all unchanged.

## If you only remember five things

1. **Measure, don't guess, for any pixel-level claim.** Playwright + `getBoundingClientRect()` /
   `page.evaluate()` beats eyeballing a screenshot every time — this session wasted many rounds on
   `object-position` guesses that real measurement would have resolved in one pass.
2. **Test at the user's actual reported viewport (≈1280×722 content area), not a round number
   like 1440×900.** Several "this is fixed" claims failed because they were verified at a
   comfortably large synthetic size instead of the user's real, tighter window.
3. **When two layout constraints genuinely conflict at a given viewport, find the structural
   fix, not another spacing tweak.** The nav/caps-overlap bug was only actually fixed by stopping
   the photo from extending behind the nav — not by yet another crop percentage.
4. **Never invent business facts** — still true, unchanged. No fabricated stats or social proof;
   the new value-band taglines (Global Reach / Student First / Future Ready) are generic,
   user-supplied copy, not invented claims.
5. **Nothing has been pushed to origin.** Two new commits (`8b4dec2`, `be61c0a`) sit locally ahead
   of whatever `stage` currently has. Don't assume anything from this session is live on
   `dev-web.admizz.com`.
