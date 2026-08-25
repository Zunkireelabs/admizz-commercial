# 03 — Content verification map

Reference for the `/verify-admizz-content` skill. Not a living doc that gets rewritten each run —
update it only when `src/_data/*.json` gains/loses a field sourced from admizz.com, or when
admizz.com's own page structure changes (new page, removed page, restructured nav).

**Purpose:** admizz.com is the *only* source this build is allowed to draw from (see `CLAUDE.md`
§2, non-negotiable #1). This doc maps every field in `src/_data/*.json` that claims to be sourced
from admizz.com back to the exact live page it came from, so a drift check knows what to compare
against what — and, just as important, what *not* to compare (our own written copy, tagged
`"source": "written"`, is never "drift" against a live page because it was never a quote of one).

---

## 1. The known-good URL set (per `docs/01-AUDIT.md` §1)

admizz.com is a 4-real-page holding site. Only these count as content sources:

| URL | Feeds |
|---|---|
| `https://admizz.com/` | `site.json` (top-level + `founder`), `ventures.json` (all 3), `timeline.json` (2015/2020/2021 entries) |
| `https://admizz.com/navigating-your-path-to-global-opportunities/` | `insights.json[0]` |
| `https://admizz.com/empowering-careers-through-lifelong-learning/` | `insights.json[1]` |
| `https://admizz.com/ace-your-exams-unlock-your-future/` | `insights.json[2]` |

Plus two discovery checks (not content sources, just "has anything changed"):

| Check | What it's for |
|---|---|
| `https://admizz.com/robots.txt` | Disallow rules changing; any hint of a new sitemap path |
| `https://admizz.com/page-sitemap.xml` (or `firecrawl_map` with `sitemap: "include"` on the root) | New pages appearing, or the 4 known pages disappearing. Baseline junk pages that are known and NOT worth flagging: `/maintenance-mode/`, `/hello-world/`, `/category/uncategorized/`, `/author/admizzdotcom2020gmail-com/` — per audit §1, these were already live and indexed at audit time. |

Anything in the sitemap outside {the 4 known real pages, the 4 known junk pages} is new — surface it,
don't silently ignore it.

---

## 2. Field-level source map

Only fields listed here are in scope for the diff. Everything else in these JSON files is either
our own written copy (safe — nothing to drift-check) or a cross-reference (e.g. `ventureHref`)
rather than a quote.

### `site.json` — homepage `/`

| Field | Live source on `/` | Notes |
|---|---|---|
| `founder.name`, `founder.title`, `founder.quote` | Founder/about section | `source: "admizz"` tagged in JSON |
| `legalName` | Footer copyright line | **Unconfirmed per audit §9 P0-#3** — admizz.com itself doesn't clearly state a single legal entity name. Treat a mismatch here as "still unresolved," not a new problem. |
| `founded` (2015), `address` (Denver, Colorado, USA), `phone`, `phoneHref`, `email` | `#ourStory` anchor / footer | Per audit §2 table |
| `tagline`, `description` | Homepage hero copy | Compare wording, not just presence — this is close-paraphrase territory |

### `ventures.json` — homepage, "Our Portfolios" + "Our Verticals" sections

All 3 entries (`institute`, `education`, `workforce`) are tagged `"source": "admizz"` in full.
Compare `description` and `verticalLine` against the corresponding homepage section copy.
`institute.exams` (IELTS/PTE/SAT/GRE/GMAT) should be checked against whatever exam list currently
appears on the homepage — audit §6 already flags the exam list as unreconciled across properties,
so a mismatch here may reflect the *site itself* changing, which is exactly what this check exists
to catch.

### `timeline.json` — homepage `#ourStory`

Only the entries tagged `"source": "admizz"` are in scope: **2015, 2020, 2021**. The `"Today"`
entry is tagged `"source": "written"` — it's our own copy, never claimed to be a quote, and must
**never** be diffed against the live page.

### `insights.json` — the 3 article pages

All 3 entries are `"source": "admizz"` in full. Compare `title` against the page's actual title/H1
and `body` against the article's main content. `deck` is a summary we wrote from the article, not
a verbatim quote — check it for continued accuracy (does it still describe what the article says)
rather than for exact wording match. `venture` / `ventureHref` are cross-references into
`ventures.json`, not quotes — only worth flagging if the article's own venture attribution changed.

---

## 3. What counts as drift worth reporting

- **Changed**: wording, numbers, or facts differ from what's live now.
- **Removed**: the field's source text (or the page/section itself) is no longer present.
- **New**: the live page has content in a mapped section that isn't reflected in the JSON at all
  (e.g. a new venture, a new timeline entry, a 4th "portfolio").
- **Unchanged**: no action, just confirms the file is still accurate — still worth stating in the
  report so silence never gets misread as "not checked."

Cosmetic-only differences (whitespace, straight vs. curly quotes, a trailing period) are not drift —
note them if trivially observed, but don't let them dominate the report.
