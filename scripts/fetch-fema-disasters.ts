/**
 * Pull hurricane disaster declarations for every Florida county from OpenFEMA.
 * Each FEMA-declared disaster has a designatedArea (county name) and incidentType.
 * Authoritative record of which named storms officially impacted each county.
 *
 *   npx tsx scripts/fetch-fema-disasters.ts
 *
 * Output: src/data/fl-county-hurricanes.json — slug → [{name,year,disasterNumber}]
 */

import fs from "node:fs";
import path from "node:path";
import { FL_COUNTIES } from "../src/data/counties";

const OUT_PATH = path.join(process.cwd(), "src/data/fl-county-hurricanes.json");

const BASE = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries";
// Florida hurricane and tropical storm declarations only.
// $filter is OData-style. designatedArea is per-county for "DR" (major disaster) decls.
const FILTER = "state eq 'FL' and (incidentType eq 'Hurricane' or incidentType eq 'Tropical Storm')";
const PAGE_SIZE = 1000;

type FemaRow = {
  disasterNumber: number;
  declarationDate: string;
  incidentType: string;
  declarationTitle: string;
  fyDeclared: number;
  incidentBeginDate: string;
  designatedArea: string;
  state: string;
};

async function fetchPage(skip: number): Promise<FemaRow[]> {
  const url = `${BASE}?$filter=${encodeURIComponent(FILTER)}&$top=${PAGE_SIZE}&$skip=${skip}&$orderby=disasterNumber asc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { DisasterDeclarationsSummaries: FemaRow[] };
  return data.DisasterDeclarationsSummaries;
}

function nameToSlug(designatedArea: string): string | null {
  // designatedArea looks like "Broward (County)" or "Miami-Dade (County)"
  const trimmed = designatedArea.replace(/\s*\(County\)\s*$/i, "").trim();
  const norm = (s: string) => s.toLowerCase().replace(/[\s.\-]/g, "");
  for (const c of FL_COUNTIES) {
    if (norm(c.name) === norm(trimmed)) return c.slug;
  }
  return null;
}

function extractStormName(title: string): string | null {
  // Examples:
  //   "HURRICANE IAN" → "Ian"
  //   "TROPICAL STORM FAY" → "Fay" (we'll prefix later)
  //   "HURRICANE IDALIA" → "Idalia"
  //   "TROPICAL STORM DEBBY (DR-4806)" → "Debby"
  const m = title.match(/(?:HURRICANE|TROPICAL STORM)\s+([A-Z][A-Z\-]+)/i);
  if (!m) return null;
  const name = m[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function main() {
  const all: FemaRow[] = [];
  let skip = 0;
  while (true) {
    const page = await fetchPage(skip);
    if (!page.length) break;
    all.push(...page);
    if (page.length < PAGE_SIZE) break;
    skip += PAGE_SIZE;
    console.log(`fetched ${all.length} rows so far...`);
  }
  console.log(`total: ${all.length} FL hurricane/TS declarations`);

  // Group: slug → unique [{name, year, disasterNumber}]
  const byCounty: Record<string, { name: string; year: number; disasterNumber: number; type: string }[]> = {};
  let unmatched = 0;
  let noStormName = 0;

  for (const r of all) {
    const slug = nameToSlug(r.designatedArea);
    if (!slug) {
      unmatched++;
      continue;
    }
    const stormName = extractStormName(r.declarationTitle);
    if (!stormName) {
      noStormName++;
      continue;
    }
    const year = new Date(r.incidentBeginDate || r.declarationDate).getFullYear();
    const list = (byCounty[slug] ??= []);
    // Dedup on (name, year)
    if (!list.some((x) => x.name === stormName && x.year === year)) {
      list.push({
        name: stormName,
        year,
        disasterNumber: r.disasterNumber,
        type: r.incidentType,
      });
    }
  }

  // Sort each county's storms newest first
  for (const slug of Object.keys(byCounty)) {
    byCounty[slug].sort((a, b) => b.year - a.year || b.disasterNumber - a.disasterNumber);
  }

  console.log(
    `\nunmatched designatedAreas: ${unmatched} (likely tribes/non-county zones)`
  );
  console.log(`rows with no storm name in title: ${noStormName}`);
  const counties = Object.keys(byCounty).length;
  console.log(`counties with at least one declaration: ${counties}/${FL_COUNTIES.length}`);

  fs.writeFileSync(OUT_PATH, JSON.stringify(byCounty, null, 2));
  console.log(`\n→ ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
