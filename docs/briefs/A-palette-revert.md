# BRIEF A — Palette revert

Run first. Brief B depends on the palette being final.

---

```
Read ./CLAUDE.md first. Ignore the global ~/CLAUDE.md — it describes a different project
(a Next.js/Supabase CRM). Do not invoke /project-pm. This is a static Eleventy site.

## Task

In tailwind.config.js, change the values in the `colors` block to these. Token NAMES stay the
same, so no .njk template should need editing — if you think one does, stop and tell me why.

| Token           | From    | To          |
|-----------------|---------|-------------|
| paper.DEFAULT   | #F4F5FB | **#F6F6F3** |
| paper.sunk      | #EAEBF6 | **#EDEDE7** |
| ink.DEFAULT     | #151833 | **#10192B** |
| ink.muted       | #4A5068 | **#454E60** |
| ink.faint       | #868DA6 | **#666E80** |
| navy.DEFAULT    | #3D5AFE | **#002856** |
| navy.deep       | #161B4D | **#001B3B** |
| navy.soft       | #2B3FA0 | **#1B4A7A** |
| navy.on         | #EDEFFC | **#EAF0F6** |
| navy.on-muted   | #AEB4E8 | **#A9BDD1** |
| navy.accent     | #7C93FF | **#FDD63F** |
| gold.text       | #8A5E10 | **#8A6200** |
| gold.sunk       | #FFF3DC | **#FBF0D2** |
| rule.DEFAULT    | #E1E2ED | **#E2E1DA** |
| rule.strong     | #C7C9DC | **#C9C7BD** |

Leave paper.raised, gold.DEFAULT, good.*, crit.*, white, black, transparent, current alone.

All contrast pairs were pre-computed and pass WCAG AA or better. ink.faint is the one fix, not
just a tone change: the current value measures 3.03:1 on paper and is failing AA today on 10px
mono labels. #666E80 is 4.72:1.

## Then

1. `npm run build` — must be clean.
2. Grep `dist/assets/main-*.css` for each new hex and confirm every one is actually present.
   Tailwind has silently emitted no CSS for a valid-looking class in this repo before, so a
   clean build is not proof it compiled.
3. Screenshot all 8 pages at 1440px and 390px: /, /ventures/, /about/, /insights/, the three
   /insights/<slug>/ posts, /contact/. Do not use fullPage screenshots — this site has a fixed
   header and a sticky section, and full-page composites render them wrong. Use bounded
   viewport scroll checkpoints.
4. Replace the comment block above `colors` in tailwind.config.js with one explaining this
   revert: the previous #3D5AFE was Material Design's Indigo A400, a framework default, which
   conflicts with this project's anti-template rule (CLAUDE.md §2). #002856 and #FDD63F are
   both recovered from real brand assets.
5. Commit on the current branch, do not push:
   `revert(palette): restore documented navy/gold, retire invented Indigo A400 blue`

## Two things to watch

- **navy.accent becomes gold.** Italic em-phrases inside headlines on navy sections will turn
  gold, and .btn-primary is already gold. If a navy band ends up with too much gold, screenshot
  it and tell me — don't change it yourself.
- **Gold is never text on a light background** (1.30:1, fails badly). If you find `text-gold`
  on a paper or white ground anywhere, that's a bug — report it. `text-gold-text` is the correct
  token for gold-toned text on light.

## Report back

Files changed, the grep results, the screenshots, and anything you deviated from and why.
Don't claim anything is verified that you didn't actually measure.
```
