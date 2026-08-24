---
name: verify-admizz-content
description: Re-check admizz.com against src/_data/*.json and report drift. Read-only — never edits src/_data.
---

# Verify Admizz content

A drift detector, not a live pipeline. admizz.com is the only permitted content source for this
build (`CLAUDE.md` non-negotiable #1) — this skill re-checks that `src/_data/*.json` still matches
what's actually live, and reports the difference for a human to review. It never writes to
`src/_data/` under any circumstance, regardless of what it finds.

Read `docs/03-CONTENT-VERIFICATION.md` first — it has the exact URL list and the field-by-field
source map this procedure runs against. If that doc and this skill ever disagree, the doc wins;
update this skill to match it rather than the reverse.

## Procedure

**1. Sitemap/discovery check.**
Use `firecrawl_map` on `https://admizz.com` (`sitemap: "include"`) and `firecrawl_scrape` on
`https://admizz.com/robots.txt`. Compare the returned URL set against §1 of the verification doc:
flag anything that isn't one of the 4 known real pages or the 4 known junk pages as a possible new
page. Flag any of the 4 known real pages that's missing as possibly removed/moved.

**2. Re-scrape the 4 real content pages.**
For each of the 4 URLs in §1 of the verification doc, call `firecrawl_scrape` with
`formats: ["markdown"]`, `onlyMainContent: true`, and **`maxAge: 0`** — the whole point is a live
fetch, not Firecrawl's cache.

**3. Read the current local data.**
`Read` `src/_data/site.json`, `ventures.json`, `timeline.json`, `insights.json`.

**4. Diff field by field, using §2 of the verification doc as the map.**
Only compare fields listed there. Skip anything tagged `"source": "written"` in the JSON — that's
our own copy, never a quote, and comparing it against a live page is a category error. For each
mapped field, classify as: **unchanged**, **changed** (show old → new), **removed**, or note
**new** content on the live page with no JSON counterpart. Judgment call, not string-equality: a
rewritten sentence that says the same thing is different from a genuinely new fact or number.
Ignore purely cosmetic differences (whitespace, curly vs. straight quotes) — note in passing if
you notice one, don't let it read as a real finding.

**5. Write the report.**
Create `scripts/output/drift-reports/<YYYY-MM-DD>.md` (gitignored — this is scratch output, not
committed content) with one section per JSON file, each field's verdict, and a one-line summary at
the top (e.g. "3 unchanged, 1 changed, 0 removed, 1 new page found"). Then post the same findings
directly in the chat response — the file is for later reference, the chat message is what the user
actually reads to decide whether to act.

**6. Never touch `src/_data/*.json`.**
This skill's job ends at reporting. Even an obviously-correct-looking fix (e.g. a typo now
corrected on the live site) goes in the report as a finding for the user to apply themselves, per
`CLAUDE.md` non-negotiable #1 — no business fact gets written without a human reviewing it first.

## When something looks structurally different, not just textually

If step 1 finds a genuinely new page (a 5th real page, a new venture, a new blog post beyond the
3 known ones), that's a bigger deal than a wording tweak — say so plainly at the top of both the
report and the chat summary, since it may mean `docs/01-AUDIT.md` and `docs/03-CONTENT-VERIFICATION.md`
themselves need a human to revisit and extend them, not just the JSON.
