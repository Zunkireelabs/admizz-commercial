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
```

---

## Quick state (keep this current — last updated 2026-08-20, end of day)

**Phase:** CI/CD is fixed and working. A large UI/UX redesign pass just happened, including two
**deliberate, explicit overrides** of this project's own documented rules (color palette, and a
hero globe) — see the "Deliberate overrides" section below before touching either. The latest
round of that redesign is **uncommitted, not yet pushed** — see "Git state right now."

### CI/CD — fixed this session, confirmed working end to end
- `stage` branch exists, pushes to it auto-deploy to `dev-web.admizz.com`, verified live
  (`curl` returned 200 with a fresh `last-modified` matching the deploy time).
- Two real bugs found and fixed:
  1. The VPS's SSH identity had no access to clone the repo (it was private) →
     **the repo was made public** as the fix (`Zunkireelabs/admizz-commercial` is now
     **PUBLIC**, not private). This was a deliberate, explicit decision the user made after
     being warned of the tradeoff (repo history/docs become scrapable) — don't flip it back to
     private without checking with the user first, and don't assume it was an oversight.
  2. The deploy script's bootstrap only checked "does the directory exist," so a failed first
     attempt left a non-git directory that made every retry fail differently. Fixed by making
     the bootstrap self-healing (checks for `$DIR/.git`, wipes+re-clones if broken) — committed
     (`fix(ci): make deploy bootstrap self-heal a broken/partial clone`) and verified.
- The old manual container (`admizz-commercial-dev`, hand-built via SSH, mentioned in the prior
  version of this doc) **has been torn down** — `admizz-commercial-web-stage` (the real
  CI/CD-deployed container) now owns `dev-web.admizz.com` alone. No more Traefik collision.
- `VPS_USER` for the pipeline is `zunkireelabs` — still distinct from `ssh vps` (which connects
  as `manjila` on this Mac). Still don't conflate the two.
- Production (`main` branch, `admizz.com`) deploy remains deliberately gated — `PROD_DOMAIN`,
  DNS, and the production environment are still not decided. Nothing changed here.

### Deliberate overrides made this session — NOT oversights, do not "fix" without asking
This project's own docs (`CLAUDE.md` §5, `docs/02-DIRECTION.md` §4) document navy/gold as the
verified brand palette and explicitly ban a spinning-globe hero as a generic-template tell. Both
were overridden this session, on the user's explicit, informed instruction, after being told what
each rule was for:

1. **Color palette — full swap.** `tailwind.config.js`'s `navy`/`gold` token *values* now render
   a blue-led palette (`navy.DEFAULT: #3D5AFE`, etc.) instead of the old recovered navy
   (`#002856`)/gold (`#FDD63F`) identity. Token *keys* are unchanged, so most templates needed no
   edits. Gold is demoted to exactly two deliberate spots: the ventures-register connecting line,
   and the contact-form success checkmark. **`CLAUDE.md` §5's hex values are now stale/wrong
   relative to the actual code** — it still documents the old navy/gold as "verified... do not
   re-derive." Needs a correction banner (matching the pattern already used in
   `01-AUDIT.md`/`02-DIRECTION.md`) or a rewrite — not yet done.
2. **A real 3D rotating Earth in the hero.** `src/assets/js/hero-globe.js` — Three.js,
   `MeshStandardMaterial` + a real texture (NASA "Blue Marble" equirectangular imagery, public
   domain, self-hosted at `src/assets/images/globe/earth-day.jpg`), a directional light + ambient
   fill for real shading, a soft atmosphere rim-glow, slow rotation, GSAP-driven mouse parallax.
   Explicitly excluded even under this override: no country pins, no flight-path arcs, no
   "50K+ students" or any fabricated stat, no sister-site nav/copy — the user asked for those too
   at one point and was told no; that line held.
3. **The hero background flipped from dark to light** (`bg-navy-deep` → a `paper`→`navy-on`
   gradient) — this was *not* part of the original color-swap ask; it took a frustrated
   "the background still isn't right" round to catch that "full color swap" hadn't actually
   touched the hero's dark-canvas *structure*, only its accent colors. All hero text flipped
   light-on-dark → dark-on-light to match. The old `facet-field` SVG texture and a Canvas2D
   particle effect (`hero-field.js`, since deleted) were both calibrated for a dark background and
   were removed from the hero rather than adapted.

**Why this matters for a fresh session:** if you read `CLAUDE.md` §5 or `docs/02-DIRECTION.md` §4
cold, you'll see rules the live site currently violates. That's not drift to silently correct —
it's this session's explicit direction. Confirm with the user before reverting any of it.

### Git state right now — read carefully, two different states exist
- **Already committed and pushed to `stage`, deployed and verified live:** the CI/CD fix, plus one
  redesign commit (`redesign: dedupe repeated sections, blue rebrand, motion polish`,
  `0db5030`) covering the structural dedup (cut redundant Statement section, replaced the
  homepage's duplicated Founder block with a real-data "At a Glance" band, timeline redesign,
  About's own page-header composition, Contact's data-row treatment), GSAP wired in for real
  motion (was installed and unused before), the first pass of the color rebrand, and a
  since-deleted Canvas2D hero particle effect.
- **NOT yet committed or pushed — local only:** everything from the globe onward. The Three.js
  globe (`hero-globe.js`, the `three` dependency, `src/assets/images/globe/earth-day.jpg`), the
  hero's light-background rewrite, removal of `hero-field.js`/`facet-field` from the hero, removal
  of the `navyHeader` front-matter flag on the homepage, and a headline-color fix on `/about/`.
  **The next obvious step is asking the user whether to commit and push this round** — it hasn't
  been offered/confirmed since the globe work landed.
- Untouched all session, still sitting there from before: `.gitignore` updates,
  `docs/03-CONTENT-VERIFICATION.md`, `.claude/skills/verify-admizz-content/SKILL.md`,
  `.claude/`, `temp_ss/`.

### Content (unchanged this session — carried forward from before)
- A `/verify-admizz-content` skill exists (`.claude/skills/verify-admizz-content/SKILL.md`) —
  re-checks `src/_data/*.json` against live admizz.com via the Firecrawl MCP. Read-only, never
  writes to `src/_data/`.
- Two open content decisions, unresolved: (1) `site.json.legalName` — "Admizz Group" vs. the live
  page's own `og:site_name` meta, "Admizz Consulting Group"; (2) `site.json.description` wording
  differs from the live hero paragraph and isn't tagged `source: written` or `source: admizz` —
  ambiguous provenance, needs a call either way.
- Inner pages (`/about/`, `/ventures/`, `/insights/`, `/contact/`) have NOT had the same
  line-by-line content grounding the homepage got — assumed consistent, not individually verified.

### Infra facts worth knowing before touching the VPS again
- `ssh vps` connects as user `manjila` on this Mac — but the CI/CD pipeline's `VPS_USER` GitHub
  secret is `zunkireelabs`, a different account with no cross-access from `manjila`. Don't conflate
  the two, and don't expect `ssh vps` to reach anything under `/home/zunkireelabs/`.
- The VPS is shared with ~50 other live client containers, including the *unrelated* sister site
  `admizz-edu-web-prod`/`admizz-edu-web-dev` (admizzeducation.com — the same sister site whose
  visual style is now partially adopted per the overrides above — still a different project/repo).

### Stale-doc corrections found this session (not yet fixed in the source docs)
- `CLAUDE.md` §5's navy/gold hex values — see "Deliberate overrides" above. This is the most
  urgent one; it's load-bearing for design-system correctness in any fresh session.
- `CLAUDE.md` §6 lists several "scaffold fixes required" that are actually already done: real
  navy/gold Tailwind tokens (not default blue-600 — though note, per above, navy/gold's *values*
  are now blue anyway), `site.json.url` already the real domain (not localhost), `header.njk`
  already has mobile nav + ARIA, `base.njk` schema.org already uses
  `EducationalOrganization`/`PostalAddress`/`ContactPoint`, and `@11ty/eleventy-img` is already
  wired in `.eleventy.js` (§6 still says "no image pipeline").
- `docs/02-DIRECTION.md` §10 roadmap is stale against the corrected corporate-site scope, and §4/§5
  need a note pointing at the deliberate globe override above so a fresh reader doesn't think it's
  unaddressed feedback.
- The lookalike test (non-negotiable #4 below) still has not been run on any page — now more
  pointed than before, since a globe was deliberately added against the guidance that test is
  meant to catch. Running it honestly, including on the hero, is still outstanding.

## If you only remember five things

1. **Never invent business facts.** If it isn't in `01-AUDIT.md`, it isn't verified. Still true —
   nothing this session added a fabricated stat, and the user was told no when they asked for one.
2. **Don't build ahead of sign-off.** This user asks for a plan overview before large changes —
   standing preference, not a one-off. (In practice this session also moved fast on smaller
   iterative asks without a formal plan each time — read the room.)
3. **Interactivity must navigate real content** — no fake product UI.
4. **Run the lookalike test** (200px silhouette vs. competitors) before calling a page done — not
   yet run on the built pages, and now more urgent given the deliberate globe addition.
5. **Color palette and the hero globe are deliberate, user-approved exceptions to rules #1–4's
   spirit, not violations to silently correct.** See "Deliberate overrides" above before touching
   either.
