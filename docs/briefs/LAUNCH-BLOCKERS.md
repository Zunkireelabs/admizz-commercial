# Launch blockers

Things that are acceptable **only** while the site is not publicly indexable, and
that MUST be resolved before `public/robots.txt` flips from `Disallow: /`.

Today the site is not indexed: `robots.txt` disallows everything and `base.njk`
emits `noindex, nofollow` outside `ELEVENTY_ENV=production`. Nobody is currently
misled by anything below. That stops being true the day the site goes public.

---

## 1. `/contact/` confirms enquiries that are never sent

`src/pages/contact/index.njk` — the form has **no backend**. `submitEnquiry()` in
the inline component resolves immediately without POSTing anywhere. A valid submit
opens a dialog that currently says, plainly, that the form is not connected and
gives the real routes (`info@admizz.com` / `720-505-3611`).

**Before launch, one of:**
- Wire `submitEnquiry()` to the CRM — `POST /api/public/submit/admizz/<formSlug>`
  with a Bearer form-category key and the contact page's origin allowed in CORS
  (CLAUDE.md §7). This is a change to that **one function**; the seam is marked
  `// TODO: POST to CRM`.
- **Then** rewrite the dialog copy (heading, body) to a real confirmation. The
  current "This form isn't connected yet" wording is a placeholder and there is a
  `{# ... #}` note at the top of the template saying so.

Do not flip robots.txt with the form still disconnected and the dialog still
claiming an enquiry was "filled in but not delivered" — a public visitor reading
that has no way to know it will ever reach anyone.

## 2. `public/robots.txt` is `Disallow: /`

Correct for now. Must become a real allow rule (plus a `Sitemap:` line once a
sitemap template exists — none does yet) at launch. `base.njk` also needs
`ELEVENTY_ENV=production` set on the production build so the `noindex` meta tag
stops being emitted.

## 3. `src/_data/site.json` still has demo values

`url` is `https://admizz.com` now (good), but `social` is all empty strings and
`legalName` ("Admizz Group") vs. the live `og:site_name` ("Admizz Consulting
Group") is an unresolved content-provenance question. Confirm before these feed
public meta tags and schema.org.
