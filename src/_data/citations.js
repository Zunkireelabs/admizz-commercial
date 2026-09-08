import fs from "node:fs";
import path from "node:path";

// Source register for /sources/ — ASSEMBLED, not hand-maintained.
//
// The page used to hardcode its own <li> list, which meant every new
// citation had to be added in two places (the data file it came from, and
// the register) and the two could silently drift apart. This reads the
// real data files instead, so the register and the counts on that page are
// always exactly what the site actually cites.
//
// The three tiers are the page's whole argument and are kept structurally
// separate, not just styled differently:
//   independent  — third-party research, verifiable at the link
//   accreditation — the one independently verified credential
//   selfReported — Admizz's own published figures (status:draft in the
//                  source data), real and attributed but not audited
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/_data", file), "utf8"));

export default function () {
  const marketContext = read("marketContext.json");
  const universities = read("universities.json");
  const destinations = read("destinations.json");

  const ventureNames = {
    institute: "Admizz Institute",
    education: "Admizz Education",
    workforce: "Admizz Workforce Solutions",
  };

  const independent = [];

  for (const [id, mc] of Object.entries(marketContext)) {
    if (!mc || typeof mc !== "object" || !mc.stats) continue; // skips _note
    if (mc.intro) {
      independent.push({
        value: null,
        label: mc.intro.text,
        publisher: mc.intro.publisher,
        year: mc.intro.year,
        href: mc.intro.href,
        venture: ventureNames[id] || id,
      });
    }
    for (const stat of mc.stats) {
      independent.push({
        value: stat.value,
        label: stat.label,
        publisher: stat.publisher,
        year: stat.year,
        href: stat.href,
        venture: ventureNames[id] || id,
      });
    }
  }

  // Cited inline in marketContext `analysis` prose rather than as stat
  // cards, so they don't appear in the loop above — but they are real
  // citations on the site and belong in the register.
  independent.push(
    {
      value: "$433B",
      label: "projected size of the global international-education market by 2030, from $196B",
      publisher: "HolonIQ",
      year: "2024",
      href: "https://www.holoniq.com/notes/196b-international-education-market-set-to-reach-433b-by-2030",
      venture: "Admizz Education",
    },
    {
      value: "22.8%",
      label: "employment rate for people with a disability, against 8.3% unemployment",
      publisher: "US Bureau of Labor Statistics",
      year: "2025",
      href: "https://www.bls.gov/news.release/disabl.nr0.htm",
      venture: "Admizz Workforce Solutions",
    }
  );

  const accreditation = [
    {
      value: "IAS 6499",
      label:
        "ICEF Accredited Agency. Held by Admizz Education specifically — it does not extend to Admizz Institute or Admizz Workforce Solutions.",
      publisher: "ICEF",
      href: "https://www.icef.com/",
      venture: "Admizz Education",
    },
  ];

  const selfReported = [
    {
      value: String(universities.totalCount),
      label: `Partner institutions across ${destinations.countries.length} countries, indexed by country on /ventures/.`,
      publisher: "Published by Admizz Education",
      venture: "Admizz Education",
    },
    {
      value: String(destinations.countries.length),
      label: `Study destinations served: ${destinations.countries.map((c) => c.name).join(", ")}.`,
      publisher: "Published by Admizz Education",
      venture: "Admizz Education",
    },
    {
      value: null,
      label:
        "Enrollment, visa approval-rate and scholarship figures shown on the homepage, attributed there as published by Admizz Education, as of 2026.",
      publisher: "Published by Admizz Education",
      venture: "Admizz Education",
    },
  ];

  const publishers = new Set(independent.map((s) => s.publisher));

  return {
    independent,
    accreditation,
    selfReported,
    counts: {
      independent: independent.length,
      publishers: publishers.size,
      total: independent.length + accreditation.length + selfReported.length,
    },
  };
}
