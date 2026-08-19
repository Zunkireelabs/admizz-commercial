> **⚠️ SCOPE CORRECTION (2026-08-19):** this audit still contains material pulled from
> **admizzeducation.com** and **admizzworks.com** — destinations, offices, timeline detail,
> testimonials, partner universities, the ICEF certification. **None of that is usable.** The
> project was rescoped to the **Admizz Group corporate site, built ONLY from what admizz.com
> itself publishes** — no sister-site content, no invented sector. See `CLAUDE.md` for the
> current rules and `src/_data/*.json` for what's actually in the build. Sections below are kept
> for the historical record of the original 3-domain audit; treat anything sourced from
> admizzeducation.com/admizzworks.com as reference-only, not usable content.

# 01 — Audit findings

**Audited 2026-08-18** across three domains, ICEF's public API, and forensic inspection of 30
competitor sites. Everything below is verified. Where something is inferred or unconfirmed, it says
so explicitly.

> **Treat this file as evidence, not prose.** Do not summarise away the specifics — the exact
> numbers and verbatim quotes are the whole value. If you need a fact for the site, take it from
> here, and if it isn't here, it isn't verified.

---

## 1. The estate — three domains, not one

`admizz.com` is a **four-page holding site**, confirmed against its own `page-sitemap.xml` and the
WordPress REST API. Nothing was hidden.

| URL | What it is |
|---|---|
| `/` | Single page; every nav item is an `#anchor` |
| `/navigating-your-path-to-global-opportunities/` | 76-word blurb |
| `/empowering-careers-through-lifelong-learning/` | ~70-word blurb |
| `/ace-your-exams-unlock-your-future/` | ~75-word blurb |
| `/maintenance-mode/` | Orphan page, publicly indexable, in the sitemap |
| `/hello-world/` | **Default WordPress demo post, still live**, with an open comment form |
| `/category/uncategorized/` | WP archive |
| `/author/admizzdotcom2020gmail-com/` | **Leaks the admin email** in URL slug, H1 and `<title>` |

**There is no About, Contact, Team, Services, Careers or Privacy page. None exist.**

Total substantive content: **~900 words, one statistic, one photograph of a person, zero named
partners, zero testimonials, zero destinations.**

### The operating business lives elsewhere

| Domain | Stack | Scale | What it is |
|---|---|---|---|
| **admizzeducation.com** | Next.js | ~200 URLs | The real operating brand. 11 destinations, ~106 named universities, ~150 blog posts, full timeline, testimonials, careers, contact. |
| **admizzworks.com** | WordPress | ~26 URLs | **US vocational rehabilitation** — supported employment, pre-employment transition, non-medical assessment, job coaching. |
| `admizzedu.com` | — | — | 301 → admizzeducation.com |

> **Strategic consequence:** Workforce Solutions is *not* the careers arm of a study-abroad company.
> Corroborated by the group's own 2024 milestone: *"Launched Admizz Workforce Solutions in the USA,
> assisting individuals with disabilities and others in pursuing education and training. Working with
> the state department."* Any "one ecosystem, one journey" story is factually strained.

---

## 2. Verified company facts — safe to use

| Fact | Source |
|---|---|
| Founded **2015** | admizz.com #ourStory |
| HQ **Denver, Colorado, USA** | admizz.com footer |
| Phone **720-505-3611** | admizz.com footer (href is `tel:+720-505-3611` — **malformed**, parses as country code +720; correct is `tel:+17205053611`) |
| Email **info@admizz.com** | admizz.com footer |
| Also **hello@admizz.com**, **hr@admizz.com** | admizzeducation.com |
| Founder & CEO **Manish K Sah** | admizz.com — ⚠️ spelled **"Manish K Shah"** on admizzworks.com, including the URL. LinkedIn vanity is `/in/manishksah/`, so "Sah" is likely correct. **Must be confirmed.** |
| President **Pushpa Rauniyar** | admizzworks.com only — appears nowhere on admizz.com |

### Offices — five, verbatim from admizzeducation.com/contact

| Country | Address | Phone |
|---|---|---|
| 🇺🇸 USA | "Denver, Colorado, USA" | — |
| 🇮🇳 India | "2nd Floor, Jayaram Building, Kanakapura Main Road, Bengaluru, Karnataka 560062, India" | — |
| 🇿🇲 Zambia | "Plot number 12A, Lusaka, Zambia" | — |
| 🇧🇩 Bangladesh | "Rajagalli, Bogra, Bangladesh" | — |
| 🇳🇵 Nepal | "Sita Ram Square (4th Floor), Putalisadak, Kathmandu 44600, Nepal (Opp. to Nabil Bank)" | +977-01-5328444, +977-9856100444 |

Plus Nepal sub-locations **Birgunj** and **Janakpur** with landing pages but no street address.

⚠️ A Google-indexed snippet cites a *different* Kathmandu address ("Ground Floor, Putalisadak, Opp.
to Raymond Tailor") — the office appears to have moved. **Confirm before publishing.**

### ✅ The one independently verified credential

Queried against ICEF's public API, not taken from the site:

```
Agency:   Admizz Education
Status:   Certified · "Valid IAS" · Active
Country:  USA
IAS:      6499   (cert ref IAS-16482)
Validity: 2026-04-15 → 2027-04-15
Verify:   https://accreditations.icef.com/certificate?id=c8a7212a-a25c-469f-8a7b-2b2f047e8c0c
```

**This is the group's strongest trust asset and it appears nowhere on admizz.com** — it is a footer
badge on a sister site. **No other accreditation exists.** AIRC, British Council, NAFSA, PIER and
ISO: NOT FOUND on any property.

### Other unused assets

- **"we take pride in being a women-owned and Asian minority-owned business"** — stated exactly once,
  on admizzworks.com/about. Real differentiator + US public-contracting advantage. Ask whether formal
  WBE/MBE/WOSB certification exists.
- **An 11-entry timeline 2015–2025** on admizzeducation.com/about. The admizz.com version has three
  entries and stops at 2021.
- **~150 blog posts** with current 2026 visa content — invisible from admizz.com.
- **"Working with the state department"** — implied US government relationship, never explained.
  Potentially the most credible credential the group has.

---

## 3. 🔴 The statistics contradiction — the #1 blocker

The same organisation publishes these simultaneously across pages of the same site:

| Metric | Published values | |
|---|---|---|
| Students | **1,000+** · **1,500+** · **1K+** · **2,000+** · **25,000+** | 25× spread |
| Partner universities | **100+** · **200+** | 2× |
| Years operating | **7+** · **10+** | founded 2015 = **11**; both wrong |
| Study destinations | **10+** · **11** · **12+** | reconcilable |
| Success rate | **95%** · **98%** | conflicting |
| Scholarships | **$2M+** | single source |

**"95%" does three different jobs:** visa approval rate · satisfaction rate (2018 milestone) ·
"admitted in less than 14 days" (indexed snippet).

### 🚨 The "Source Markets" data is almost certainly fabricated

On admizzeducation.com/universities: India 42% · 10,500 / Nepal 28% · 7,000 / Bangladesh 14% · 3,500
/ Vietnam 8% · 2,000 / Sri Lanka 5% · 1,250 / Pakistan 3% · 750, with growth arrows ▲24%, ▲31%.

These sum to **exactly 25,000** and **exactly 100%**, and introduce Vietnam, Sri Lanka and Pakistan
as source markets appearing nowhere else in the group. **Do not carry this forward.**

> **Rule: no statistic appears on the rebuilt site until Admizz supplies one authoritative figure
> per metric, with a definition and a measurement period.**

---

## 4. Timeline — verbatim, admizzeducation.com/about

| Year | Title | Description (verbatim) |
|---|---|---|
| 2015 | Founded with Purpose | "Admizz Education was founded as a platform for college admissions, helping students pursue higher education within their country or across borders." |
| 2016 | First Student Success | "Helped our first batch of students secure admissions to top universities in India." |
| 2017 | Strengthening Our Network | "Broadened our partnerships with universities and educational institutions across India." |
| 2018 | Building Trust | "Achieved a 95% satisfaction rate among students, parents, and associates…" |
| 2019 | Expanding Reach | "Increased student success rates and expanded operations in Nepal…" |
| 2020 | Breaking Borders | "Successfully guided students in navigating cross-border college admissions…" |
| 2021 | Scaling Globally | "Surpassed 1,000 students supported through personalized consulting…" |
| 2022 | Expanding Our Impact | "Expanded services across Bangladesh…" |
| 2023 | Strengthening Partnerships | "Formed strategic alliances with leading institutions and universities…" |
| 2024 | Transforming Lives | "Launched Admizz Workforce Solutions in the USA, assisting individuals with disabilities… Working with the state department." |
| 2025 | Today: Expanding Our Reach | "Strengthening our network with top universities and recruitment partners worldwide…" |

**Gaps:** no 2026 entry; never mentions the India office opening, the Zambia office, the Admizz
Institute launch, or the ICEF certification (2025).

**Origin story:** the company began as an **India-inbound** admissions business (2016–17 milestones
are India-only; the old blog archive is India-heavy) and pivoted outbound to UK/USA/Australia later.
**No stated reason for the pivot exists** — worth commissioning, it's a genuine story.

---

## 5. Partner universities — split verdict

~106 named institutions on admizzeducation.com/about and /universities, badged "100+ Institutions —
Verified Partners".

### ✅ Credible (read as genuine agent rosters — regional publics and career-focused privates)

**UK (15):** Buckinghamshire New · BPP · Coventry · Health Sciences University · Ravensbourne ·
Sunderland · East London · Ulster · Greenwich · The University of Law · Roehampton · Worcester ·
West London · West of Scotland · York St John

**USA (22):** Colorado State · Webster · Avila · Concordia · Southeast Missouri State · Herzing ·
Wright State · Washington University · Texas State · Murray State · Youngstown State · Central
Arkansas · Dakota State · South Dakota · Pacific Oaks · Bethesda · St. Cloud State · South Dakota
State · Post · Northwest Missouri State · Central Missouri · Minnesota State

### 🚨 Not credible — verify or remove

**Canada, France, Germany, India, Australia, New Zealand** lists contain **exactly ten institutions
each**, and the names are McGill, Toronto, UBC, Sorbonne, Sciences Po, École Polytechnique, TU
Munich, Heidelberg, IISc Bangalore, JNU, Monash, University of Queensland, RMIT.

These read as *"top 10 universities in [country]"* ranking lists, not signed agreements — and these
institutions broadly **do not work through commission-based recruitment agents at all**.

> **Publishing an unearned McGill or Sorbonne partnership is a real legal and reputational exposure.
> Only institutions under signed agreement go on the site.**

Also: "Washington University" and "Concordia University" are ambiguous (multiple institutions share
each name). **Weber State University** appears in a testimonial but is absent from the partner list.

---

## 6. Destinations, exams, testimonials

**11 destinations:** USA · UK · Australia · Canada · New Zealand · Nepal · India · France · Germany
· Finland · South Korea.
⚠️ The nav dropdown lists 10 (includes Germany, excludes South Korea); the `/study-destinations` page
lists 10 (includes South Korea, excludes Germany). Union = 11.

**Exams:** IELTS · PTE · SAT · GRE (all sites agree). **GMAT** appears only on admizz.com; **TOEFL**
and **Duolingo** only on admizzeducation.com. **Confirm the real list.**

**Testimonials — 4, real, with names, universities and routes:**

| Student | University | Route |
|---|---|---|
| Niraj Bhattarai | University of West of Scotland | Nepal → UK |
| Basant Khadka | Weber State University | Nepal → USA |
| Yousuf Abdirahman Mohamed | Kalinga Institute of Industrial Technology | Somalia → India |
| Satyam Jaiswal | University of Greenwich | Nepal → UK |

**⚠️ Flagged as likely placeholder:** three employee testimonials on `/careers` (Srijana Sharma,
Rajesh Adhikari, Anisha Poudel) read as AI/template copy — generic phrasing, tidy tenure increments
(3 / 2 / 1.5 years), no photos, and none appear anywhere else. **Verify before reuse.**

**⚠️ Privacy risk:** ~21 students' full names are published on a "Visa Granted" wall with no visible
consent notice. Destinations are mostly UK → **live UK GDPR question**, not theoretical.

**⚠️ Legal risk:** admizzeducation.com/test-prep advertises **"Guaranteed Score Improvement"**
(elsewhere the same site says "Proven"). Advertising-risk claim — flag for legal review.

---

## 7. Technical state of admizz.com

**Stack:** WordPress 7.0.4 · Astra 4.13.0 · Elementor 4.2.2 · ElementsKit Lite 4.0.1 · Yoast ·
Google Site Kit 1.185.0 (GA4 `GT-55NSWNDZ`) · Hostinger Reach · PHP 8.2.31 · LiteSpeed · Hostinger
CDN (Mumbai edge). Built by "Simplifycodes".

**Weight:** HTML **200,269 bytes** + subresources **4,203,738 bytes** ≈ **4.4 MB** (excluding font
binaries).

| Bytes | Asset | Problem |
|---|---|---|
| **1,509,398** | `admizz-hero-image.png` | Loaded **only** at `≤767px`, rendered at `background-size: 223px auto`. Mobile downloads 1.5 MB for a 223px graphic. |
| 668,999 | `Admizz-founder-915x1024.png` | Unoptimised PNG portrait. Should be ~40 KB WebP. |
| 201,699 | ElementsKit `common.css` | 197 KB of CSS for header/footer widgets. |
| 205,512 | 4 self-hosted font CSS files | **407 `@font-face` declarations** across Roboto (162), Inter (126), Roboto Slab (63), Plus Jakarta Sans (56) — for a site that visually uses **one** family. |
| 122,594 | jQuery + UI + migrate | Legacy JS on a static brochure page. |

Delivery is fine (`x-litespeed-cache: hit`, TTFB 0.46s). **The payload is the problem.**

**Broken / wrong:**
- **9 of 28 CTAs are dead `#` links**, including both "Get in Touch" buttons and all three "Learn
  More" buttons in Our Verticals.
- "Explore Admizz Institute" links to **admizzworks.com** (wrong venture).
- **No mobile navigation exists.** Grepped for `offcanvas`, `hamburger`, `elementskit-navbar-nav`,
  `popup` — zero occurrences. Tablet/mobile get a logo and a dead button.
- **No `<form>`, `<input>` or `<textarea>` anywhere.** The "newsletter" is an Elementor heading
  rendered as `<p>` ("Enter you email" *sic*) plus an `<a href="#">Submit</a>`. **Zero lead capture.**
- Live Elementor placeholder in production: **"Add Your Heading Text Here"**.
- Two copyright lines with two different years (2025 and 2026) on every page.

**SEO:**
- **No `<h1>` on any of the five real pages.** All start at `<h2>`.
- **Identical meta description on all five pages.**
- All 11 homepage images have `alt=""`.
- `og:image` is a **6571×1975** logo (should be ~1200×630) — and it's the *Education* logo, not the
  Group's.
- `/hello-world/`, `/maintenance-mode/`, the uncategorized archive and the author archive are all
  live, indexable and in the sitemap.
- No `sameAs`, no `PostalAddress`, no `ContactPoint`, no `Article` schema.

**Security/privacy:** admin Gmail `admizzdotcom2020@gmail.com` publicly exposed via author archive.
Only security header is `upgrade-insecure-requests`.

**Social:** **zero social links on admizz.com.** The group actually runs six —
facebook.com/admizz · linkedin.com/company/admizzofficial · instagram.com/admizz_official ·
twitter.com/admizz_official · tiktok.com/@admizz_official · youtube.com/c/Admizz_official

---

## 8. Brand assets recovered

**Elementor's global colour kit was never customised** — it still carries factory defaults
(`#6EC1E4`, `#54595F`, `#7A7A7A`, `#61CE70`). Every real colour is hard-coded per widget.

Extracted by occurrence count across `post-32.css`, `post-122.css`, `post-314.css`:

| Hex | Uses | Role |
|---|---|---|
| **#002856** | 14 | **Primary brand navy** |
| **#FDD63F** | 14 | **Accent gold** |
| #FFFFFF | 23 | White |
| #161616 | 18 | Near-black text |
| #F2F2F2 | 15 | Off-white / dividers |
| #0F1941 | 6 | Secondary navy |
| #464646 | 6 | Muted grey |
| #F4F4F4 | 5 | Light section bg |
| #256D85 | 4 | Tertiary blue |
| #8CB1FF | 3 | Light blue |
| #3C60AD · #06283D · #FFFBEA | 1 each | One-offs |

> **Five different blues and three near-blacks** for one small site — no token discipline.
> The intended pair is clearly **navy #002856 + gold #FDD63F**.

**Typeface:** **Plus Jakarta Sans** is the de facto brand face (57 declarations). Inter appears once.
Roboto and Roboto Slab load *only* because nobody changed Elementor's defaults.

**Logos** (all verified to exist): header `admizz-aligned-1-1024x308.png` · footer white
`admizz-aligned-white-1024x308.png` · plus mono and colour marks for each of the three sub-brands.
⚠️ **The favicon and the schema.org Organization logo are both `Admizz-Workforce-Logo-Icon.webp`** —
the Workforce mark standing in for the Group's identity. Likely unintentional.

**Photography:** exactly **one** image of a person exists group-wide (the founder portrait,
`Admizz-founder-915x1024.png`). No team, office, student or event photography anywhere.

---

## 9. 📋 Content request list for Admizz

Hand this to the client. Grouped by whether it blocks the build.

### 🔴 P0 — blocks the build

1. **One authoritative figure per metric** — students placed to date, contracted partner
   institutions, offices, destinations offered, visa approval rate (**with definition and
   measurement period**), scholarships secured, years in operation, headcount.
2. **Correct founder name spelling** — "Manish K Sah" or "Manish K Shah"?
3. **Correct legal entity name(s)** — "Admizz Consulting Group" / "Admizz Education Inc." /
   "Admizz Group" / "Admizz Education Nepal Pvt. Ltd." Which goes in the footer?
4. **Verified partner list** — signed agreements only, with permission to display names and logos.
   Explicitly confirm or remove: McGill, Toronto, UBC, Sorbonne, Sciences Po, École Polytechnique,
   TU Munich, Heidelberg, IISc, JNU, Monash, UQ, RMIT.
5. **Canonical division names** — "Admizz Institute" or "Test Preparation"? "Admizz Education" or
   "Higher Education"? Three naming systems currently appear on one page.
6. **Is Admizz Institute a live business?** No website, no address, no course list, no pricing, no
   schedule, no named trainers. Commission real content or restructure the story.
7. **Verified exam list** — GMAT vs TOEFL/Duolingo do not reconcile across sites.
8. **Confirm the current Kathmandu address** — two conflicting addresses are indexed.

### 🟠 P1 — high value, does not exist anywhere

9. **Group-level founder bio.** The only bio in existence is on admizzworks.com, first-person, and
   framed entirely around Workforce.
10. **Leadership/team page.** Pushpa Rauniyar is President and appears nowhere on admizz.com.
11. **Founding narrative** — why founded, what problem was seen, the India-inbound → global-outbound
    pivot, why Denver.
12. **Timeline entries for 2026**, plus milestones for the India office, Zambia office, Institute
    launch and ICEF certification.
13. **Photography** — team, offices, students, events. Currently one photo exists.
14. **Testimonials at scale**, with photos, dates, courses and **documented consent** — plus written
    consent for the ~21 named students already published.
15. **Case studies** — zero exist.
16. **What does the Zambia office actually do?** Source market or destination?
17. **Named counsellors** — 6–12 people with photo, destinations covered, experience, qualification,
    LinkedIn. High conversion value, free to produce.
18. **Fee transparency** — who pays the consultancy, and where incentives could conflict.

### 🟡 P2 — standard pages that simply don't exist

19. Privacy policy (legally required given EU/UK student data) · terms · cookie policy
20. Contact page with a working form
21. Social links (six profiles exist, none linked)
22. Press / media kit / brand assets
23. Group-level careers content

### ⚫ P3 — defects not to carry over

Typos: "Test Prepration" · "Enter you email" · "Cheif Executive Officer" · "businesss" · "Austalia".
Live: `/hello-world/`, `/maintenance-mode/`, "Add Your Heading Text Here", exposed admin Gmail,
mixed-protocol `http://` link, card title ≠ page H1, duplicated footers, conflicting copyright years.

---

## 10. Tone of voice — what to move away from

The current admizz.com copy is **corporate-aspirational and almost entirely abstract**: a repeating
three-noun rhythm ("education, empowerment, and opportunity"), gerund-led transformation verbs
(Transforming, Empowering, Pioneering, Driving, Shaping), and unearned superlatives ("a leading…",
"a global leader…"). Concrete detail is nearly absent — no student names, no place names beyond
Denver, no dates beyond three, one number. It reads as an investor deck, not a service business
talking to students.

Representative, verbatim:

> "Admizz is a visionary corporate entity dedicated to transforming the education landscape."
> "From vision to reality, shaping futures through innovation, collaboration, and a commitment to quality education."
> "Get to know us through our insights and the impact we make together."

**There is a clear voice split across the group.** admizz.com is grandiose and impersonal;
admizzeducation.com is markedly warmer and more concrete ("we're with you at every step", "Still
deciding?"); admizzworks.com is mission-driven and uses **first person** for leadership bios.
**The rebuild needs an explicit decision on which voice the group speaks in.**

The group's two strongest existing lines, both from admizzeducation.com:

> "We Are Not Just An Education Consultancy — We Are the Future of International Student Recruitment."
>
> "Every Student Deserves A Chance To Shine. From Asia To Africa And Beyond, We Open Doors To
> World-Class Universities In The USA, UK, Europe, And More, Turning Dreams Into Reality."
> — Manish K Sah
