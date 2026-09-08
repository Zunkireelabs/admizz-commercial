# BRIEF C — Produce the content request for Admizz

**Run after Brief B.** B's report ends with "anything you could not do without inventing
content" — that list feeds directly into this document.

This is a documentation deliverable, not a build. No site code changes.

Paste everything inside the fence into a fresh Claude Code session in this repo.

---

```
Before doing anything, read ./CLAUDE.md in full, then ./docs/RESUME-PROMPT.md.

Two things about CLAUDE.md that matter immediately:
  - It OVERRIDES the global ~/CLAUDE.md, which describes a completely different project
    (a Next.js/Supabase CRM). None of that applies here.
  - DO NOT auto-invoke /project-pm. The global file tells you to. This repo countermands it.

## Task

Produce ./docs/04-CONTENT-REQUEST.md — the precise list of what Admizz must supply before the
site can go further. No site code changes in this brief.

## Why this document exists

CLAUDE.md non-negotiable #1 bans inventing business facts, and this project keeps hitting the
same wall: pages that should have depth cannot get it, because the source content does not exist.
Dedicated venture detail pages were scoped and then dropped for exactly this reason — there are
only 20-34 words of real prose per venture in the entire repo.

Rather than that blocking silently every session, it becomes one document the client can act on.
This is the actual unblock for the next phase of the project.

## Ground it in the repo, don't write it from imagination

Before drafting, read and cross-reference:
  - docs/01-AUDIT.md — especially §9, which already holds a P0 content-request list. This new
    document SUPERSEDES it. Carry forward anything still unanswered; drop what has since been
    resolved. Note 01-AUDIT.md carries a stale-SCOPE banner — its factual findings stand, its
    original strategic framing does not (see CLAUDE.md §4).
  - docs/RESUME-PROMPT.md — "Open items carried forward, still unresolved".
  - Every file in src/_data/ — the actual shape of what we hold. Empty/missing fields are the
    spec for what to ask for.
  - The Brief B report, if you have it — its "could not do without inventing content" list.

Every ask must trace to a real gap you verified in the repo. If you cannot point at the gap,
do not ask for it.

## What the document must cover

**1 · Per-venture content, for the three ventures in src/_data/ventures.json.**
   Enough to justify a dedicated detail page per venture. We currently hold, per venture, only:
   index, id, stage, name, vertical, a 20-34 word description, a one-line verticalLine, exams
   (Institute only), href, hrefLabel, cta. Missing entirely: any second paragraph, services or
   programmes, how it actually works, locations, named people, founding date, logo or mark.
   Ask for specific named fields, not "more information".

**2 · The statistics problem — the single most important ask.**
   docs/01-AUDIT.md found published student counts spanning 1,000+ / 1,500+ / 1K+ / 2,000+ /
   25,000+ — a 25× spread — and success rate published as both 95% and 98%. The standing rule
   (01-AUDIT.md §139-140) is that NO statistic appears on the rebuilt site until Admizz supplies
   one authoritative figure per metric, with a definition and a measurement period.
   Spell out exactly that: for each metric, we need the number, what it counts, and over what
   window. Explain plainly why conflicting figures are worse than no figures — a partner or
   journalist who finds both loses trust in everything else on the page.

**3 · Admizz Institute — an existential question, asked diplomatically.**
   It has no website (admizzinstitute.com/.org/.com.np all fail to resolve), no course list, no
   pricing, no schedule, no named trainers, and on the live admizz.com its "Explore Admizz
   Institute" link points at admizzworks.com — the wrong venture. Its only real content sits
   inside admizzeducation.com/test-prep, branded as Admizz Education.
   The question for the client: is Institute a distinct operating business, or is test
   preparation a capability of Admizz Education? We can present either honestly, but we need
   to know which is true. docs/02-DIRECTION.md §80-87 has the background.

**4 · The Workforce positioning question.**
   docs/01-AUDIT.md established Admizz Workforce Solutions is US vocational rehabilitation —
   supported employment, pre-employment transition, non-medical assessment, job coaching for
   individuals with disabilities, working with the state department. That is a different
   business serving a different population from a study-abroad consultancy, which is why the
   "three stages of one journey" framing was corrected in Brief B.
   Ask the client how they see the relationship between the three businesses, so the site's
   connective story is theirs and accurate rather than ours and convenient.

**5 · Photography.**
   src/assets/images/ecosystem/ holds three photos that are all flagged in code as
   user-confirmed exceptions to this project's own no-stock rule: institute.jpg carries
   unrelated third-party ABB Robotics branding on a projector screen; education.jpg and
   workforce.jpg read as stock/AI-generated and are only ~600px wide, below the rest of the
   site's imagery. Ask for real photography, and state the minimum useful resolution and the
   crops the site needs (check the {% image %} shortcode's widths in .eleventy.js for the
   real numbers rather than guessing).

**6 · Accreditations and credentials.**
   ICEF for Admizz Education (IAS 6499, valid to 2027-04-15) is the ONLY verified credential
   in the repo, and it belongs to Education alone. AIRC, British Council, NAFSA, PIER and ISO
   were searched for and NOT FOUND. Ask whether any others exist, for which entity, with
   certificate numbers and validity dates so they can be independently verified.

**7 · Brand and organisational facts still unresolved.**
   - site.json.legalName is "Admizz Group"; the live admizz.com og:site_name says "Admizz
     Consulting Group". Which is the legal entity name?
   - site.json.description — its wording and source are unconfirmed.
   - site.json.social.twitter / linkedin / github are ALL empty strings. base.njk's schema.org
     block has no sameAs as a result. Ask for real profile URLs, or confirmation none exist.
   - Offices and addresses: the site currently claims only Denver, CO. 01-AUDIT.md found five
     office addresses but sourced from the sister sites, which CLAUDE.md §4 puts off-limits.
     Ask Admizz to confirm which offices should appear, with full postal addresses, so
     base.njk's PostalAddress schema can be correct per office.
   - Leadership beyond the founder: we hold one founder name, title and quote. 01-AUDIT.md
     mentions a President (Pushpa Rauniyar) but from an off-limits source. Ask directly.

**8 · Lead capture.**
   CLAUDE.md §7: /contact/ is front-end complete but not wired. The plan is to post into the
   Zunkiree Labs CRM's existing Admizz Education tenant (slug `admizz`) via
   POST /api/public/submit/[tenantSlug]/[formSlug]. Blocked on three specifics: the exact
   endpoint contract, a form-category Bearer API key, and the allowed CORS origin. List them
   as concrete asks. Also ask who should receive and own inbound enquiries per venture.

## How to write it

- **It must be sendable to the client as-is.** Assume the reader is a busy non-technical
  executive at Admizz, not a developer. No repo paths, no template names, no Tailwind, no
  Eleventy in the body of the asks.
- **Priority-tier it.** P0 = blocks work already scoped. P1 = unlocks planned depth. P2 = nice
  to have. Be honest about which is which; if everything is P0, nothing is.
- **Make every ask concretely answerable.** "Please describe Admizz Institute" is a bad ask.
  "For Admizz Institute: is it a separate legal entity? Does it have its own premises, and
  where? Who teaches — names and credentials? Which of the five exams do you currently run
  classes for, and on what schedule?" is a good one.
- **Say why each ask matters**, in one line, in terms the client cares about — what the site
  can show once they answer, or what it cannot show until they do.
- **Include a short opening section** explaining the standing rule: this site publishes nothing
  that cannot be verified, which is why these questions exist. Frame it as the reason the site
  will be trustworthy, not as a limitation.
- Keep it tight. A 3-page document that gets answered beats a 12-page one that doesn't.

## Also update

- docs/01-AUDIT.md §9 — add a pointer that its content-request list is superseded by
  docs/04-CONTENT-REQUEST.md. Do not delete the original; it's part of the audit record.
- docs/RESUME-PROMPT.md — note the new document and what it blocks/unblocks.
- CLAUDE.md §8 (the documents table) — add the new file with a one-line description.

## Commit

Commit on the current branch. Do not push.
Message: `docs: add 04-CONTENT-REQUEST — what Admizz must supply to unblock depth`

## Report back with

1. The full document, so I can read it before it goes anywhere near the client.
2. Which asks you carried forward from 01-AUDIT.md §9, which you dropped, and why.
3. Any gap you found in the repo that I did not list above.
4. Your honest read on whether the P0 list is genuinely achievable for the client, or whether
   it is so long they will bounce off it.
```
