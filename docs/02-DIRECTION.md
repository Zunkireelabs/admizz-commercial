> **⚠️ SUPERSEDED (2026-08-19):** this document's positioning, IA and roadmap were built for a
> **student-facing education-consultancy** version of the site, pulling destinations/pathway/
> credibility content from admizzeducation.com. That direction was rejected — this is the
> **Admizz Group corporate site**, audience is partners/institutions/press (not students),
> content is **admizz.com only**. The Option A/B/C fork, the "route diagram" hero, the
> "credibility without statistics" plan (§7, built on the ICEF cert and named counsellors) and
> most of the IA in §6 no longer apply. What DOES still apply and was carried forward: the
> anti-template rules in §4, the repo/tech findings, the recovered navy+gold palette in §8 minus
> the route-diagram specifics. The actual current direction is: three ventures presented as an
> indexed register (not cards), reframed as Prepare → Study → Work using ONLY admizz.com's own
> "Our Portfolios"/"Our Verticals" copy. See `CLAUDE.md` and the live build in `src/pages/`.

# 02 — Strategic direction

Everything here follows from `01-AUDIT.md`. Published client-facing version:
https://claude.ai/code/artifact/a36c6d3b-be98-443b-8c16-3f013921f395

---

## 1. Positioning

The brief wants Admizz repositioned as "a global platform for education, skills and opportunity."
The audit says the honest, defensible version of that is sharper:

> ## Admizz opens doors for people the elite pipeline never counts.

**Why this is the right position, and not a softer one:**

- **It matches the real partner list.** Buckinghamshire New, Sunderland, Herzing, Dakota State,
  Northwest Missouri State — regional publics and career-focused privates. These are the
  institutions that genuinely take these students and serve them well. That is not a weakness in
  the story; that *is* the story.
- **It matches the real source markets.** Nepal, Bangladesh, Zambia, Somalia, India — not the
  Beijing/Mumbai elite that IDP and ApplyBoard fight over.
- **It matches the second business.** Workforce Solutions serves Americans with disabilities
  entering supported employment. Same underlying idea: people the system overlooks.
- **It survives the content crisis.** It requires zero invented statistics.
- **It is differentiated.** Every competitor sells scale and prestige. Nobody sells honest matching.

**The competitive moat is physical presence.** Competitors run call centres. Admizz has staffed
offices in Kathmandu, Bogra, Bengaluru and Lusaka — in the cities where the students actually are.
This is mentioned nowhere on the current site.

**What Admizz must NOT claim:** "we get you into Oxford." The truthful and more powerful promise is
**"we get you *there* — and there is real, good, and achievable."**

---

## 2. Two tensions to design against

**The fake-product trap.** The brief asks the site to feel like software. Admizz sells human
judgement. The failure mode is simulated software — an "explore 500+ universities" filter with no
database, a pathway quiz returning generic output, a globe that spins meaninglessly. A visitor who
pokes it finds nothing there, which is the same broken promise as an invented statistic.

> **The product feeling comes from pacing, hierarchy, motion and the clarity of decision-making —
> not from widgets that pretend to compute.** Every interactive element must navigate content that
> actually exists.

**"User is the hero" is an IA decision, not a copy tweak.** Rewording "We provide" to "You can" is
cosmetic. Doing it properly means the navigation is organised around user intent, not Admizz's org
chart. The three divisions still exist — but as *answers*, reached after the user says what they
want.

---

## 3. The A/B/C fork — ⚠️ AWAITING DECISION

The brief's user journey is a *student* journey. admizz.com is a *holding company*. Students convert
on admizzeducation.com. So which site are we building?

| | Approach | Trade-off |
|---|---|---|
| **A** | **Group site.** Parent brand story, ecosystem, leadership, insights. Sends students onward. | Premium but not a conversion engine. Smallest build. Leaves the brief's emotional target largely unmet. |
| **B** | **Unified platform.** admizz.com absorbs everything; sister sites redirect. | Matches the brief most literally. ~200-page migration with real SEO risk to ~150 ranking posts including current 2026 visa content. |
| **C** ✅ | **Group site with a real Education front door.** admizz.com becomes the premium experience *and* the primary student entry point; deep application flows hand off to admizzeducation.com. Workforce gets its own separated track. | **Recommended.** Delivers the brief's target without the migration risk, and the content model can grow into B later without a rebuild. |

### The Institute problem

Admizz Institute has **no website** (`admizzinstitute.com`/`.org`/`.com.np` all fail to resolve), no
address, no course list, no pricing, no schedule, no named trainers, and a footer link that goes
nowhere. Its only real content sits inside `admizzeducation.com/test-prep`, branded as Admizz
Education.

> **Recommendation: present two operating businesses honestly, with test preparation as a named
> capability of Education**, until Institute has real content. Reversible the moment it does. Do not
> build a three-pillar ecosystem where one pillar is a logo.

---

## 4. ⛔ The template we must not build

Thirty study-abroad consultancy sites were inspected forensically. They are structurally the same
website:

> hero + "Book Free Consultation" + WhatsApp → animated stat counter bar → 6–9 icon services grid →
> 6–8 country flag cards → 4–6 numbered process steps → university logo wall → testimonial carousel
> → accreditation badge strip → exactly 3 blog teasers → FAQ accordion → lead form → footer SEO city
> list

**⚠️ The first draft of this project's own homepage proposal mapped onto five of those slots** —
flag cards, numbered steps, logo wall, badge strip, three teasers. Good palette and good type do not
save a structurally templated page. **This is the category's default gravity; avoiding it requires a
deliberate check, not good taste.**

### The gate: the lookalike test

Reduce the page to a **200px-wide black-on-white silhouette** and place it beside five competitors'.
**If you cannot identify ours, it is templated.** Run it before and after every page. This is a gate
in Phase 4, not an opinion.

### Category tells found in the wild

- **"Your Gateway to Global Education"** — used *verbatim* by three unrelated companies. "One Stop
  Solution" by four more. "Dream" in eight hero headlines.
- **Counters shipped as literal zeroes** — `<p class="counter" data-target="30000">0</p>`.
- **Implausible visa claims** — 99%, 98%, 99.8% against a measured ~55% real approval rate. Genuine
  regulatory exposure. *Admizz's own conflicting 95%/98% is already halfway into this.*
- **Typos in production headings** — "Guidence", "Jounalism". *Admizz already ships "Test
  Prepration" and "Cheif Executive Officer".*
- **A flag for a continent** (`europe-flag.png`). Globes, planes, graduation-cap tosses.
- **Ten font families in one Google Fonts call.** *Admizz currently ships four and 407 `@font-face`.*
- **Four near-identical reds on one site** — no colour system. *Admizz runs five blues.*

### The WhatsApp correction — important for this market

The instinct to strip the floating WhatsApp button is a **Western-market aesthetic judgement applied
against your actual users**. In Nepal, India, Bangladesh and the Gulf, WhatsApp is primary
communication infrastructure, not a widget, and it converts.

What signals cheapness is **stacking** — templated sites run three or more floating affordances at
once (WhatsApp + chat widget + sticky call bar + enquiry modal); one carries 31 separate `wa.me`
references.

> **Keep exactly one WhatsApp affordance, give it the navy/gold system, the 8px radius and the
> signature easing — and remove everything else that floats.** One considered affordance reads as
> service design; three read as desperation.

---

## 5. The hero concept — the route

**Not a spinning globe.** The most emotionally powerful true thing about this business is the
improbability of the line it draws: a student in Janakpur and a university in South Dakota, and the
fact that somebody made that connection real.

**A schematic route diagram.** Origin nodes are Admizz's **real offices** (Kathmandu, Bogra,
Bengaluru, Lusaka, Denver); destination nodes are Admizz's **real 11 countries**. Fine navy arcs on
paper, gold nodes. Reads as a flight-path or transit diagram — which lands in the same material
world as passports, transcripts and visa decisions.

**Why it beats a globe:**
- Schematic rather than decorative
- Honest — a globe implies coverage Admizz does not claim
- A few KB of inline SVG rather than a 3D library
- Reads instantly at 320px
- **Earns its interaction** — selecting an origin filters the routes. Real navigation of real
  content, not an animation pretending to be software.

This is the **one bespoke, brand-meaningful interaction** the motion system allows. A working
prototype exists in the published strategy artifact (§09).

---

## 6. Information architecture

Organised around user intent. **Pages are generated from structured data in `src/_data/`, not
hand-authored.**

| Route | Generated from | Job |
|---|---|---|
| `/` | — | Thesis, ecosystem, routes, pathway, proof, story |
| `/study-abroad/` | — | Education front door; the primary student journey |
| `/destinations/` | `destinations.json` | Index of 11 real destinations |
| `/destinations/<country>/` | pagination | 11 generated pages — adding a country is a data edit |
| `/pathway/` | `pathway.json` | The seven chapters |
| `/pathway/<stage>/` | pagination | Visa checklists, fee schedules, honest durations |
| `/counsellors/` | `counsellors.json` | Named people — replaces the stat bar |
| `/fees/` | — | Who pays, and where incentives could conflict |
| `/test-prep/` | `exams.json` | IELTS, PTE, SAT, GRE — Institute capability, honestly framed |
| `/workforce/` | — | Separate track, separate audience, separate CTA language |
| `/about/story/` | `timeline.json` | The eleven-year timeline, finally on the group site |
| `/about/offices/` | `offices.json` | Five real offices — the moat, made visible |
| `/partners/` | `universities.json` | Institutions + recruitment partners. **Verified list only.** |
| `/insights/` | Markdown collection | Editorial |
| `/contact/` | `offices.json` | A working form → the CRM |

### The spine: seven chapters, not a services grid

> **Explore → Shortlist → Prepare → Apply → Fund → Visa → Arrive**

Numbering here **encodes state** — the visitor is somewhere on this line. A site that knows that is
a product; a site that lists nine services is a brochure.

**Each chapter must pay out twice:** it explains the stage, *and* it hands over something genuinely
useful — the UK visa document checklist, real cost-of-living figures, the scholarship deadline
calendar. **For an education company, teaching is the product demonstration.**

> **The content model is the real architecture.** The framework choice is not the important
> decision. Get the data modelling right and "where could you go" becomes real and scalable; get it
> wrong and every new country is a copy-pasted HTML file, and the site rots exactly the way the
> current one did.

---

## 7. Credibility without statistics

The content crisis in `01-AUDIT.md` §3 looks like a blocker. **It is actually the strategy** — the
highest-value trust signals in this sector cost nothing to produce, and nobody in the category uses
them.

Outcome claims are unverifiable and everyone inflates them. **Process detail is verifiable, free,
and unclaimed.**

| Replaces | With |
|---|---|
| "98% visa success" | **Process transparency** — the real UK Student visa document checklist, the real fee schedule with real deadlines, an honest timeline of how long each stage takes *including the parts that go wrong* |
| The stat counter bar | **Named counsellors** — 6–12 real people with photo, destinations, experience, qualification, LinkedIn. It is what students actually choose on |
| The accreditation badge strip | **Verification links** — the credential *plus* its membership number *plus* a link to the issuer's verification tool. Admizz's ICEF IAS 6499 is publicly checkable. Almost nobody does this, because almost nobody can |
| "Free Services" | **Fee transparency** — who pays the consultancy and where incentives could conflict. Unclear fees are a leading source of student complaints |
| Stock photography | **Real photography of your own offices and staff**, consistently graded |
| The services grid | **Editorial content** — the guides *are* the proof |

**Two free changes worth having on day one:**
- **Bound the CTA.** "Book a free *20-minute* call" beats "Book Free Counselling".
- **End the journey at the outcome, not the admission.** The category stops at the visa. Carrying
  the story to what happens *after* graduation is the differentiating chapter — and the only honest
  bridge between Admizz's two businesses.

---

## 8. Technical architecture

Keep the stack. Add the four things it lacks. Full design-system values are in the root
`CLAUDE.md` §5.

| Add | Detail |
|---|---|
| **Image pipeline** | `@11ty/eleventy-img` over the installed `sharp`. AVIF + WebP, responsive `srcset`, blur placeholders, lazy below the fold. Direct fix for the current 1.5 MB mobile PNG. |
| **Motion layer** | GSAP + ScrollTrigger + Lenis, behind a `prefers-reduced-motion` gate — **structurally skipped**, not merely reduced, so those users get a complete static page. |
| **Font pipeline** | Self-hosted, axis-instanced, `latin-ext`. See `CLAUDE.md` §5. |
| **Sitemap + real metadata** | Sitemap template (the Vite plugin already expects one), real `site.json`, `EducationalOrganization` schema with `PostalAddress` per office and `sameAs` for the six real social profiles. |

### Lead capture → the CRM you already own

Post directly into the Zunkiree Labs Lead Gen CRM (*Admizz Education* tenant, slug `admizz`) rather
than adding Formspree or Netlify Forms. Endpoint shape
`POST /api/public/submit/[tenantSlug]/[formSlug]`, Bearer API key, CORS-enabled.
**Confirm contract, key and allowed origin before building.**

This makes the site a real lead engine wired to a real pipeline — and it is the strongest argument
that this is a product surface, not a brochure.

### Performance budget

| Metric | Current site | Target |
|---|---|---|
| Homepage weight | ~4,400 KB | **< 500 KB** |
| JavaScript | ~122 KB jQuery alone | **< 90 KB** |
| Font payload | 407 `@font-face` | **6 files** |
| Largest single asset | 1,509 KB | **< 180 KB** |
| Lighthouse a11y | `alt=""` × 11 | **100** |

---

## 9. Risks

1. **Content, not design, is the critical path.** The design system can be finished in days. One
   authoritative number per metric, a defensible partner list and real photography cannot. Without
   them we ship a beautiful site full of grey boxes.
2. **Legal exposure in existing copy.** "Guaranteed Score Improvement"; ~21 students' full names
   published without visible consent, with UK destinations → live UK GDPR question.
3. **SEO regression on the sister site.** Anything that redirects or cannibalises
   admizzeducation.com risks ~150 ranking posts. Option C is chosen partly to avoid this.
4. **Photography.** One photo of a person exists group-wide. A photography-led editorial site and a
   typography-led graphic site are different websites — commit to the one that can be filled.
5. **Identity ambiguity.** Four entity names in circulation; the founder's surname spelled two ways.
6. **Scope drift toward Option B.** "While we're here, let's move the blog across" is how this
   becomes a six-month migration.

---

## 10. Roadmap

| Phase | Work | Gate |
|---|---|---|
| **0** ✅ | **Audit** — repository, live estate, three domains, brand recovery, contrast verification | Done |
| **1** ⏸ | **Direction sign-off** — A/B/C decision, positioning approval, Institute question resolved, content request issued | **Needs the user** |
| **2** | **Design system** — tokens, fluid type scale, motion primitives, component library. Built in code, not Figma | Gate: Phase 1 |
| **3** | **Content model** — data schemas for destinations, offices, timeline, exams, universities, counsellors, insights. Generated routes proven end to end | Parallel to 2 |
| **4** | **Homepage** — establishes the entire visual language. Route diagram, ecosystem, pathway, proof, story. **Must pass the §4 lookalike test** | Gate: Phase 2 |
| **5** | **Inner pages** — destinations, pathway, test prep, workforce, story, offices, partners, insights, contact. Same system, distinct narratives | Gate: Phase 4 |
| **6** | **Quality pass** — responsive from 320px, keyboard + screen reader, reduced motion, performance budget, schema, sitemap, real metadata | Gate: Phase 5 |

**Update this table and `CLAUDE.md` §4 whenever a phase closes.**
