/**
 * One-off harvest: pull the partner-university logos Admizz Education already
 * publishes (admizzeducation.com/images/universities/<country>/<file>) into this
 * repo, and emit src/_data/universities.json from the same manifest so the two
 * can't drift.
 *
 * These are a sister property of the same group (Admizz Group). Sourcing them
 * with an explicit provenance tag is not the same as inventing a partner —
 * every name here is published by Admizz themselves. See CLAUDE.md §2 #1.
 *
 * Re-run: `node scripts/harvest-university-logos.mjs`
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "https://admizzeducation.com/images/universities";
const OUT_IMG = "src/assets/images/universities";
const OUT_DATA = "src/_data/universities.json";

// country -> [ [display name, source filename], ... ]
// Compiled from the /universities and /about partner walls (2026-08-30 scrape).
const MANIFEST = {
  uk: {
    label: "United Kingdom", flag: "🇬🇧",
    items: [
      ["Buckinghamshire New University", "uk/Buckinghamshire-New-University.webp"],
      ["BPP University", "uk/BPP-University.webp"],
      ["Coventry University", "uk/Coventry-University.webp"],
      ["Health Sciences University", "uk/Health-Sciences-University.webp"],
      ["Ravensbourne University London", "uk/Ravensbourne-University-London.webp"],
      ["University of Sunderland", "uk/University-of-Sunderland.webp"],
      ["University of East London", "uk/University-of-East-London.webp"],
      ["Ulster University", "uk/Ulster-University.webp"],
      ["University of Greenwich", "uk/University-of-Greenwich.webp"],
      ["The University of Law", "uk/The-University-of-Law.webp"],
      ["University of Roehampton", "uk/University-of-Roehampton.webp"],
      ["University of Worcester", "uk/University-of-Worcester.webp"],
      ["University of West London", "uk/University-of-West-London.webp"],
      ["University of the West of Scotland", "uk/University-of-the-West-of-Scotland.webp"],
      ["York St John University", "uk/York-St-John-University.webp"],
    ],
  },
  usa: {
    label: "United States", flag: "🇺🇸",
    items: [
      ["Colorado State University", "usa/COLORADO.webp"],
      ["Webster University", "usa/webster-1.webp"],
      ["Avila University", "usa/AVILA.webp"],
      ["Concordia University", "usa/CONCORDIA.webp"],
      ["Southeast Missouri State University", "usa/SOUTHEAST-MISSOURI.webp"],
      ["Herzing University", "usa/HERZING.webp"],
      ["Wright State University", "usa/WRIGHT-STATE.webp"],
      ["Washington University", "usa/WASHINGTON.webp"],
      ["Texas State University", "usa/TEXAS.webp"],
      ["Murray State University", "usa/MURRAY.webp"],
      ["Youngstown State University", "usa/YOUNGSTOWN.webp"],
      ["University of Central Arkansas", "usa/CENTRAL-ARKANSAS.webp"],
      ["Dakota State University", "usa/DAKOTA-STATE.webp"],
      ["University of South Dakota", "usa/UNIVERSITY-F-SOUTH-DAKOTA.webp"],
      ["Pacific Oaks College", "usa/PACIFIC.webp"],
      ["Bethesda University", "usa/BETHESDA.webp"],
      ["St. Cloud State University", "usa/ST-CLOUD.webp"],
      ["South Dakota State University", "usa/South.webp"],
      ["Post University", "usa/POST.webp"],
      ["Northwest Missouri State University", "usa/NORTHWEST.webp"],
      ["University of Central Missouri", "usa/university-f.webp"],
      ["Minnesota State University", "usa/MINNESOTA-STATE.webp"],
    ],
  },
  australia: {
    label: "Australia", flag: "🇦🇺",
    items: [
      ["Western Sydney University", "australia/western-sydney-university.webp"],
      ["La Trobe University", "australia/la-trobe-university.webp"],
      ["Victoria University", "australia/victoria-university.webp"],
      ["University of Queensland", "australia/university-of-queensland.webp"],
      ["Monash University", "australia/monash-university.webp"],
      ["Kaplan Business School", "australia/kaplan-business-school.webp"],
      ["Southern Cross University", "australia/southern-cross-university.webp"],
      ["RMIT University", "australia/rmit-university.webp"],
      ["Macquarie University", "australia/macquarie-university.webp"],
      ["University of Tasmania", "australia/university-of-tasmania.webp"],
    ],
  },
  canada: {
    label: "Canada", flag: "🇨🇦",
    items: [
      ["University of Toronto", "canada/university-of-toronto.webp"],
      ["University of British Columbia", "canada/university-of-british-columbia.webp"],
      ["McGill University", "canada/mcgill-university.webp"],
      ["University of Alberta", "canada/university-of-alberta.webp"],
      ["McMaster University", "canada/mcmaster-university.webp"],
      ["University of Waterloo", "canada/university-of-waterloo.webp"],
      ["Western University", "canada/western-university.webp"],
      ["Queen's University", "canada/queens-university.webp"],
      ["Simon Fraser University", "canada/simon-fraser-university.webp"],
      ["Dalhousie University", "canada/dalhousie-university.webp"],
    ],
  },
  france: {
    label: "France", flag: "🇫🇷",
    items: [
      ["Sorbonne University", "france/sorbonne-university.webp"],
      ["Université PSL", "france/universite-psl.svg"],
      ["Université Grenoble Alpes", "france/universite-grenoble-alpes.webp"],
      ["Aix-Marseille University", "france/aix-marseille-university.webp"],
      ["Université de Strasbourg", "france/universite-de-strasbourg.webp"],
      ["Université de Bordeaux", "france/universite-de-bordeaux.webp"],
      ["Sciences Po", "france/sciences-po.webp"],
      ["École Polytechnique", "france/ecole-polytechnique.webp"],
      ["Université de Lille", "france/universite-de-lille.webp"],
      ["University of Paris-Saclay", "france/university-of-paris-saclay.webp"],
    ],
  },
  germany: {
    label: "Germany", flag: "🇩🇪",
    items: [
      ["Technical University of Munich", "germany/technical-university-of-munich.webp"],
      ["Ludwig-Maximilians-Universität München", "germany/ludwig-maximilians-universitat.webp"],
      ["Heidelberg University", "germany/heidelberg-university.webp"],
      ["Freie Universität Berlin", "germany/freie-universitat-berlin.webp"],
      ["Karlsruhe Institute of Technology", "germany/karlsruhe-institute-of-technology.webp"],
      ["RWTH Aachen University", "germany/rwth-aachen-university.webp"],
      ["Technische Universität Berlin", "germany/technische-universitat-berlin.webp"],
      ["University of Hamburg", "germany/university-of-hamburg.webp"],
      ["University of Freiburg", "germany/university-of-freiburg.webp"],
      ["Humboldt-Universität zu Berlin", "germany/humboldt-universitat-berlin.webp"],
    ],
  },
  "new-zealand": {
    label: "New Zealand", flag: "🇳🇿",
    items: [
      ["University of Auckland", "newzealand/university-of-auckland.webp"],
      ["University of Otago", "newzealand/university-of-otago.webp"],
      ["Victoria University of Wellington", "newzealand/victoria-university-of-wellington.webp"],
      ["University of Canterbury", "newzealand/university-of-canterbury.webp"],
      ["Massey University", "newzealand/massey-university.webp"],
      ["Auckland University of Technology", "newzealand/auckland-university-of-technology.webp"],
      ["Lincoln University", "newzealand/lincoln-university.webp"],
      ["Unitec Institute of Technology", "newzealand/unitec-institute-of-technology.webp"],
      ["Eastern Institute of Technology", "newzealand/eastern-institute-of-technology.webp"],
      ["Southern Institute of Technology", "newzealand/southern-institute-of-technology.webp"],
    ],
  },
  india: {
    label: "India", flag: "🇮🇳",
    items: [
      ["Vellore Institute of Technology (VIT)", "india/vit.webp"],
      ["University of Delhi", "india/university-of-delhi.webp"],
      ["Jawaharlal Nehru University", "india/jawaharlal-nehru-university.webp"],
      ["Banaras Hindu University", "india/banaras-hindu-university.webp"],
      ["Anna University", "india/anna-university.webp"],
      ["Manipal Academy of Higher Education", "india/manipal-academy.webp"],
      ["Kalinga Institute of Technology", "india/kalinga-institute.webp"],
      ["RK University", "india/rk-university.webp"],
      ["IISc Bangalore", "india/iisc-bangalore.webp"],
      ["Delhi Technological University (DTU)", "india/delhi-technological-university.webp"],
      ["Symbiosis International University", "india/symbiosis-international-university.webp"],
    ],
  },
  finland: {
    label: "Finland", flag: "🇫🇮",
    items: [
      ["Haaga-Helia University of Applied Sciences", "finland/haaga-helia.webp"],
      ["South-Eastern Finland University of Applied Sciences", "finland/south-eastern-finland.webp"],
      ["LAB University of Applied Sciences", "finland/lab-university.webp"],
      ["Satakunta University of Applied Sciences", "finland/satakunta-university.webp"],
      ["Vaasa University of Applied Sciences", "finland/vaasa-university.webp"],
      ["Karelia University of Applied Sciences", "finland/karelia-university.webp"],
    ],
  },
};

// The UK source files sit at the images/universities/ root, not images/universities/uk/.
const srcPathFor = (country, file) =>
  file.includes("/") ? `${SRC}/${file}` : `${SRC}/${file}`;

const slug = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let ok = 0, fail = 0;
const data = [];

for (const [country, group] of Object.entries(MANIFEST)) {
  await mkdir(path.join(OUT_IMG, country), { recursive: true });
  const outItems = [];
  for (const [name, file] of group.items) {
    const ext = file.split(".").pop();
    const localName = `${slug(name)}.${ext}`;
    const url = srcPathFor(country, file);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(OUT_IMG, country, localName), buf);
      ok++;
      outItems.push({ name, logo: `/assets/images/universities/${country}/${localName}` });
    } catch (e) {
      fail++;
      console.warn(`  ✗ ${name}  (${url})  — ${e.message}`);
    }
  }
  data.push({ country: group.label, code: country, flag: group.flag, universities: outItems });
}

await writeFile(OUT_DATA, JSON.stringify({
  _note: "Harvested from admizzeducation.com (Admizz Group sister property), 2026-08-30. source: admizzeducation. Re-run scripts/harvest-university-logos.mjs to refresh.",
  source: "admizzeducation",
  status: "draft",
  totalCount: data.reduce((n, g) => n + g.universities.length, 0),
  groups: data,
}, null, 2) + "\n");

console.log(`\nLogos: ${ok} ok, ${fail} failed.  universities.json: ${data.reduce((n, g) => n + g.universities.length, 0)} entries across ${data.length} countries.`);
