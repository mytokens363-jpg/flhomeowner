/**
 * Pull all Florida incorporated places + their county from the Census SUB-EST
 * (Subcounty Population Estimates) file. SUMLEV=162 rows are place-within-county.
 * Authoritative and includes population estimates through 2024.
 *
 *   npx tsx scripts/fetch-major-cities.ts
 *
 * Output: src/data/fl-county-cities.json — slug → [{name, population}], top 5 by pop.
 */

import fs from "node:fs";
import path from "node:path";
import { FL_COUNTIES } from "../src/data/counties";

const OUT_PATH = path.join(process.cwd(), "src/data/fl-county-cities.json");
const SUB_EST_URL =
  "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv";
const TOP_N = 5;
const FL_FIPS = "12";

// Reverse map county FIPS → slug. We use the FIPS values captured in the
// Census population step (fl-county-population.json) since FL FIPS aren't
// strictly alphabetical (Miami-Dade=086, gap at 085 from former Dade County;
// St. Johns/St. Lucie come before Santa Rosa in FIPS order but not alphabet).
function buildFipsMap(): Record<string, string> {
  const popPath = path.join(process.cwd(), "src/data/fl-county-population.json");
  if (!fs.existsSync(popPath)) {
    throw new Error(`Run fetch-census-population.ts first — needed for FIPS map.`);
  }
  const pop = JSON.parse(fs.readFileSync(popPath, "utf-8")) as Record<
    string,
    { countyFips: string }
  >;
  const out: Record<string, string> = {};
  for (const [slug, v] of Object.entries(pop)) {
    out[v.countyFips] = slug;
  }
  return out;
}

function cleanPlaceName(raw: string): string {
  // "Fort Lauderdale city" → "Fort Lauderdale"; "Aventura city" → "Aventura"
  return raw.replace(/\s+(city|town|village|CDP|borough)$/i, "").trim();
}

// Parse a single CSV line that may contain quoted commas.
function splitCsv(line: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  out.push(buf);
  return out;
}

async function main() {
  console.log(`fetching SUB-EST 2024...`);
  const res = await fetch(SUB_EST_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsv(lines[0]);
  const idx = (col: string) => header.indexOf(col);
  const iSumlev = idx("SUMLEV");
  const iState = idx("STATE");
  const iCounty = idx("COUNTY");
  const iName = idx("NAME");
  const iPop = idx("POPESTIMATE2024");
  const iFunc = idx("FUNCSTAT");
  if ([iSumlev, iState, iCounty, iName, iPop].some((x) => x < 0)) {
    throw new Error(`unexpected SUB-EST header: ${header.join("|")}`);
  }

  const fipsMap = buildFipsMap();
  const byCounty: Record<string, { name: string; population: number }[]> = {};
  let placeRows = 0;
  let unmatchedFips = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsv(lines[i]);
    if (cols[iState] !== FL_FIPS) continue;
    if (cols[iSumlev] !== "157") continue; // 157 = place within a county
    // Skip "Balance of X County" rows (PLACE FIPS 99990, FUNCSTAT F)
    if (cols[iName].startsWith("Balance of")) continue;
    if (iFunc >= 0 && (cols[iFunc] === "I" || cols[iFunc] === "F")) continue;
    placeRows++;
    const slug = fipsMap[cols[iCounty]];
    if (!slug) {
      unmatchedFips.add(cols[iCounty]);
      continue;
    }
    const name = cleanPlaceName(cols[iName]);
    const pop = parseInt(cols[iPop], 10);
    if (!Number.isFinite(pop) || pop <= 0) continue;
    const list = (byCounty[slug] ??= []);
    if (!list.some((p) => p.name === name)) {
      list.push({ name, population: pop });
    }
  }

  console.log(`  ${placeRows} FL place×county rows`);
  if (unmatchedFips.size) {
    console.warn(`  unmatched FIPS: ${[...unmatchedFips].sort().join(",")}`);
  }

  const out: Record<string, { name: string; population: number }[]> = {};
  for (const slug of Object.keys(byCounty)) {
    out[slug] = byCounty[slug]
      .sort((a, b) => b.population - a.population)
      .slice(0, TOP_N);
  }

  for (const c of FL_COUNTIES) {
    if (!out[c.slug] || out[c.slug].length === 0) {
      console.warn(`  no places for ${c.slug}, falling back to seat: ${c.seat}`);
      out[c.slug] = [{ name: c.seat, population: 0 }];
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`\nwrote ${Object.keys(out).length} counties → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
