/**
 * Pull population for every Florida county from the US Census ACS 5-year API.
 * No API key needed for low-volume requests.
 *
 *   npx tsx scripts/fetch-census-population.ts
 *
 * Output: src/data/fl-county-population.json keyed by our county slug.
 */

import fs from "node:fs";
import path from "node:path";
import { FL_COUNTIES } from "../src/data/counties";

const OUT_PATH = path.join(process.cwd(), "src/data/fl-county-population.json");

// ACS 5-year is the most stable. Variable B01003_001E = total population.
// State FIPS for Florida = 12. Try most recent vintage; fall back if unavailable.
const VINTAGES = ["2023", "2022", "2021"];

// Census returns county NAME like "Broward County, Florida" — we need to map
// that to our slug. Build a name→slug index from FL_COUNTIES.
function nameToSlug(censusName: string): string | null {
  const trimmed = censusName.replace(/ County, Florida$/, "").trim();
  for (const c of FL_COUNTIES) {
    if (c.name.toLowerCase() === trimmed.toLowerCase()) return c.slug;
    // Handle "St. Johns" vs "St Johns" / "DeSoto" vs "Desoto" / "Miami-Dade" vs "Miami Dade"
    const norm = (s: string) => s.toLowerCase().replace(/[\s.\-]/g, "");
    if (norm(c.name) === norm(trimmed)) return c.slug;
  }
  return null;
}

async function tryVintage(year: string) {
  const url = `https://api.census.gov/data/${year}/acs/acs5?get=NAME,B01003_001E&for=county:*&in=state:12`;
  console.log(`trying ACS5 ${year}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = (await res.json()) as string[][];
  // [["NAME","B01003_001E","state","county"], ["Alachua County, Florida", "278468", "12", "001"], ...]
  const [header, ...rows] = data;
  const nameIdx = header.indexOf("NAME");
  const popIdx = header.indexOf("B01003_001E");
  const fipsIdx = header.indexOf("county");
  return rows.map((r) => ({
    name: r[nameIdx],
    population: parseInt(r[popIdx], 10),
    countyFips: r[fipsIdx],
  }));
}

async function main() {
  let raw: { name: string; population: number; countyFips: string }[] = [];
  let usedYear = "";
  for (const y of VINTAGES) {
    try {
      raw = await tryVintage(y);
      usedYear = y;
      break;
    } catch (e) {
      console.warn(`  ${y} failed: ${(e as Error).message}`);
    }
  }
  if (!raw.length) throw new Error("no Census vintage worked");

  console.log(`got ${raw.length} county rows from ACS5 ${usedYear}\n`);

  const out: Record<string, { population: number; countyFips: string; vintage: string }> = {};
  const unmatched: string[] = [];
  for (const r of raw) {
    const slug = nameToSlug(r.name);
    if (!slug) {
      unmatched.push(r.name);
      continue;
    }
    out[slug] = {
      population: r.population,
      countyFips: r.countyFips,
      vintage: `ACS5 ${usedYear}`,
    };
  }

  if (unmatched.length) {
    console.warn(`unmatched county names from Census:\n  ${unmatched.join("\n  ")}`);
  }
  const missing = FL_COUNTIES.filter((c) => !(c.slug in out)).map((c) => c.slug);
  if (missing.length) {
    console.warn(`our slugs with no Census data:\n  ${missing.join("\n  ")}`);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`\nwrote ${Object.keys(out).length} counties → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
