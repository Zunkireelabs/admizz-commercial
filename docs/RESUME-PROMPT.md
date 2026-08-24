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

## Quick state (keep this current — last updated 2026-08-24, end of day)

**Phase:** Homepage hero + nav + ventures section went through a very long, reactive iteration
cycle this session (globe removed, nav redesigned, hero rebuilt ~6 times, ventures section rebuilt
3 times). It ends with the user explicitly frustrated ("this site still look like trash"), an
**honest, agreed diagnosis of why**, and a **standing request for one coherent redesign pass**
next session — not more isolated section patches. Read "The core diagnosis" below before touching
anything; it's the most important section in this file.

### The core diagnosis — read this first, it's what the next session is actually for
Asked directly why the site still felt bad despite lots of individually-reasonable fixes, three
real causes were named and the user agreed with them:

1. **The whole session was reactive patches, never one coherent pass.** Every change was
   "user points at one thing → fix that one thing → verify → move on." The hero alone went through
   ~6 distinct treatments (globe → no globe → photo → wave mask → no mask → mask back → tightened
   spacing). Each pivot was locally reasonable given what was asked in the moment, but the result
   is a page assembled from fragments, not authored as one idea. **The fix is a single, decisive,
   top-to-bottom pass — pick one direction, apply it everywhere in one continuous effort — not
   another round of one-section-at-a-time requests.**
2. **The blue palette is a live open question, not settled.** `tailwind.config.js`'s `navy`/`gold`
   token *values* still render blue (`navy.DEFAULT: #3D5AFE`) instead of the original
   recovered/verified navy (`#002856`)/gold (`#FDD63F`) identity — that swap was a deliberate
   override from an earlier session. Looking at the whole page together this session, the
   assessment was that this blue reads as generic-SaaS (the single most oversaturated color in
   tech right now) and actively works against the site looking distinctive, and the **recommendation
   was to revert toward the real navy/gold identity as the likely highest-leverage single change**.
   The user had not yet said "yes, revert it" when the session ended — **confirm this explicitly
   before touching the palette**, don't assume the recommendation was accepted.
3. **Every section repeats the identical formula** — small-caps label → serif heading → paragraph
   → link, section after section (ventures, timeline, insights), all at the same scale and rhythm.
   Real content presented with no variation in pacing or visual weight reads as templated
   regardless of how good any one section looks alone.

**What NOT to do next session:** don't start with another single-element fix in response to a new
screenshot. Start by asking whether to execute the redesign pass (color revert + one consistent
pass across the whole homepage), and if yes, do it as one continuous effort with a clear direction
stated up front, not a return to the screenshot-react-fix loop.

### Impeccable — a design-quality tool got installed this session, now active
`https://impeccable.style` — a Claude Code plugin/skill that flags AI-generated design "slop"
patterns — was installed project-scoped via `npx impeccable install` (lives in
`.claude/skills/impeccable/`, plus `.github/agents/`, `.github/hooks/`, `.github/skills/`, all
currently **untracked**, not yet committed). Its `/impeccable` skill is available via the Skill
tool. **A PostToolUse hook now auto-scans CSS/UI file edits** and reports findings inline (seen
throughout the second half of this session as `[impeccable@1] Design hook scanned...` messages).

Two real findings it caught and fixed this session, both still in effect:
- **No eyebrow/kicker above the hero H1** — "a kicker above a heading... no brief earns it back,
  delete the label." Removed from the hero specifically; other sections' eyebrows were untouched
  (out of scope of that finding, not yet audited elsewhere).
- The wave `clip-path` mask on the hero photo was flagged as a banned "geometric mask standing in
  for an organic contour," was removed once, but **the user explicitly asked for it back**
  ("i dont want curve to be removeddddd") — it's a confirmed, deliberate override of that specific
  Impeccable finding, not an oversight. Don't remove it again without asking.

Impeccable's own craft-floor doc also explicitly bans "same-size cards of icon+heading+text" as
page structure — the user asked for exactly that pattern on the ventures section anyway
("make them as the card"), it was built, then walked back to a card-less "connected sequence"
based on real web research (see below), landing on the current state. Cards are not currently
in use anywhere on the homepage.

### What's actually in the working tree right now (uncommitted)
Last commit is `9643599` ("redesign: floating pill nav, photo hero with wave mask, real ICEF
trust badge") on branch `redesign/hero-globe-light-bg` — **still local, nothing pushed to origin
this entire session.** Since that commit, uncommitted changes:
- `src/pages/index.njk`, `src/_includes/partials/ventures-register.njk`: the ventures section
  rebuilt from an indexed-row list → cards → **a card-less "connected sequence"** (current state):
  no borders/boxes, bigger venture-name type (`text-h2`, up from `text-h3`), a gold connecting
  line that's scroll-scrubbed (not a one-shot reveal), and the row currently centered in viewport
  holds full opacity while the other two dim to 40% — real scroll feedback about progress through
  Prepare → Study → Work, not decoration. Used on both `/` and `/ventures/` (shared partial).
- `src/assets/js/main.js`: **a real, previously-unnoticed bug was found and fixed** — Lenis
  (smooth-scroll) was running on its own independent `requestAnimationFrame` loop, never telling
  GSAP's ScrollTrigger that a scroll happened. This affected every scroll-scrubbed effect on the
  site (header progress bar, facet-field parallax), not just the new ventures work — it just
  wasn't visible until a precise scroll-linked effect was added. Fixed by driving Lenis from
  `gsap.ticker` and wiring `lenis.on('scroll', ScrollTrigger.update)`. **Verify this is still
  correct with real wheel-scroll simulation (not `page.evaluate(() => window.scrollTo(...))`,
  which bypasses Lenis and can hide a desync) if you touch any scroll-driven code.**
- `src/assets/css/main.css`: `.index-num`/old `.grow-line`/`.register-row`-in-ventures rules
  removed as dead code across the cards→sequence churn; `.sequence-row`/`.sequence-num` added.
  `.register-row` itself is still used elsewhere (insights lists) — don't remove it globally.
- Untracked, not yet committed: the Impeccable install (above), `temp_ss/` (scratch — includes an
  **unrelated** IELTS-workshop marketing email HTML file that has nothing to do with this site,
  don't confuse the two if it's still sitting there).

**Dev server was not running when this session ended** — start it fresh (`npm run dev`), don't
assume a background task survived.

### Hero photo — still the placeholder, still has a known defect
`src/assets/images/insights/global-opportunities.jpg` (graduation cap-toss photo) is reused as the
hero image — real, Admizz-branded, but not purpose-shot for this placement, and it has an
**"admizz" watermark baked into the pixels, top-left corner**. It's currently cropped out of view
via `object-position: center 35%`, but that's fragile — if the crop/object-position or the photo
container's aspect ratio changes again, the watermark can reappear in frame. A prior attempt this
session to fix this properly (crop the source file with `sharp`, save as a dedicated hero asset)
was built, verified working, then **fully reverted** at the user's request along with an unrelated
two-column layout change it was bundled with — so the watermark crop fix does not exist on disk
right now. Worth redoing in isolation if the hero photo comes up again.

### Deliberate overrides still standing from earlier sessions — confirm before reverting
- **Blue palette** — see "core diagnosis" above; open question, not yet resolved either way.
- **Floating pill nav** (`rounded-full`, centered links) — against `CLAUDE.md` §5's radius scale
  rule, explicitly approved earlier this session, not revisited since.
- **No 3D globe** — Three.js globe, its texture asset, and the `three` dependency were fully
  removed this session per explicit instruction ("no earth"). Don't reintroduce without asking.
- **Wave `clip-path` hero mask** — see Impeccable section above; explicitly restored after removal.

### Content/infra facts carried forward, unchanged this session
- `/verify-admizz-content` skill still exists (`.claude/skills/verify-admizz-content/SKILL.md`),
  read-only, re-checks `src/_data/*.json` against live admizz.com.
- Two open content-provenance questions from before, still unresolved: `site.json.legalName`
  ("Admizz Group" vs. live `og:site_name` "Admizz Consulting Group"), and `site.json.description`'s
  wording/source tag.
- Inner pages (`/about/`, `/insights/`, `/contact/`) still haven't had the line-by-line content
  grounding the homepage got.
- CI/CD (`stage` → `dev-web.admizz.com` auto-deploy), the public-repo decision, and the
  `ssh vps` (`manjila`) vs. pipeline `VPS_USER` (`zunkireelabs`) distinction are all unchanged from
  before this session and still accurate.
- The lookalike-silhouette test (non-negotiable #4) has still never been run on any page.

## If you only remember five things

1. **Start with the redesign-pass question, not a new patch.** The user asked for one coherent
   pass next session, not a return to reactive single-section fixes. Confirm direction (color
   revert + consistent pass) before writing code.
2. **Never invent business facts.** Still true, still held all session — no fabricated stats, no
   fake social-proof widgets, even when reference screenshots showed them; real facts (ICEF cert,
   real ventures) were substituted instead every time.
3. **Verify scroll/motion work with real interaction, not just a screenshot.** The Lenis/ScrollTrigger
   desync bug this session was invisible to `window.scrollTo()`-based checks and only showed up
   under real wheel-scroll simulation. Assume other scroll-driven code deserves the same scrutiny.
4. **Impeccable is now active and will comment on CSS/UI edits automatically** — take its findings
   seriously, but the user can and does override specific bans on purpose (the wave mask, cards).
   Don't silently "fix" a deliberate override because a detector flagged it.
5. **Nothing has been pushed to origin this entire session.** Everything is local — one commit
   ahead of `stage` plus the uncommitted ventures/Lenis work above. Don't assume anything is live
   on `dev-web.admizz.com` beyond what was true before this session started.
