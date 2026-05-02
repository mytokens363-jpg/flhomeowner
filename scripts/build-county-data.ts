/**
 * Combine authoritative source datasets into the canonical CountyProfile JSON.
 *
 *   npx tsx scripts/build-county-data.ts
 *
 * Inputs (must exist):
 *   src/data/fl-county-population.json   — Census ACS5 2023
 *   src/data/fl-county-cities.json       — Census SUB-EST 2024
 *   src/data/fl-county-hurricanes.json   — OpenFEMA disaster declarations
 *   src/data/fl-coastal-counties.ts      — FDEP coastal counties + region tags
 *
 * Output:
 *   src/data/flood-county-data.json — slug → CountyProfile
 *
 * The uniqueLocalContext field is left empty here. enrich-counties.ts
 * fills it with a 2-3 sentence LLM-generated summary, grounded in
 * the authoritative data above.
 */

import fs from "node:fs";
import path from "node:path";
import { FL_COUNTIES } from "../src/data/counties";
import {
  COUNTY_REGION,
  isCoastal,
  regionOf,
  stormSurgeRiskFor,
  type CoastalRegion,
} from "../src/data/fl-coastal-counties";

const ROOT = process.cwd();
const POP_PATH = path.join(ROOT, "src/data/fl-county-population.json");
const CITY_PATH = path.join(ROOT, "src/data/fl-county-cities.json");
const HURR_PATH = path.join(ROOT, "src/data/fl-county-hurricanes.json");
const OUT_PATH = path.join(ROOT, "src/data/flood-county-data.json");

const HURRICANE_HORIZON_YEAR = new Date().getFullYear() - 25; // last 25 years

type CountyProfile = {
  slug: string;
  name: string;
  countySeat: string;
  population: number;
  populationVintage: string;
  isCoastal: boolean;
  region: CoastalRegion;
  majorCities: { name: string; population: number }[];
  hurricaneHistory: { name: string; year: number; type: string; disasterNumber: number }[];
  stormSurgeRisk: "low" | "moderate" | "high" | "extreme";
  rainFloodRisk: "low" | "moderate" | "high";
  uniqueLocalContext: string;
};

function rainFloodRiskFor(region: CoastalRegion): "low" | "moderate" | "high" {
  // Florida-wide baseline is moderate due to high annual rainfall (~50-60 in/yr).
  // Coastal & low-elevation regions face compounding rain+surge events.
  if (region === "inland") return "moderate";
  return "high";
}

function main() {
  const pop = JSON.parse(fs.readFileSync(POP_PATH, "utf-8")) as Record<
    string,
    { population: number; countyFips: string; vintage: string }
  >;
  const cities = JSON.parse(fs.readFileSync(CITY_PATH, "utf-8")) as Record<
    string,
    { name: string; population: number }[]
  >;
  const hurricanes = JSON.parse(fs.readFileSync(HURR_PATH, "utf-8")) as Record<
    string,
    { name: string; year: number; disasterNumber: number; type: string }[]
  >;

  const out: Record<string, CountyProfile> = {};

  for (const c of FL_COUNTIES) {
    const popEntry = pop[c.slug];
    if (!popEntry) {
      console.warn(`SKIP ${c.slug}: no population data`);
      continue;
    }
    const region = regionOf(c.slug);
    // Re-dedup: for same (name, year) prefer Hurricane over Tropical Storm.
    // FEMA often issues both an EM (pre-landfall) and DR (post-landfall)
    // declaration; only the latter carries the final storm classification.
    const stormMap = new Map<string, typeof hurricanes[string][number]>();
    for (const s of hurricanes[c.slug] ?? []) {
      if (s.year < HURRICANE_HORIZON_YEAR) continue;
      const key = `${s.name}|${s.year}`;
      const prev = stormMap.get(key);
      if (!prev || (prev.type !== "Hurricane" && s.type === "Hurricane")) {
        stormMap.set(key, s);
      }
    }
    const displayedStorms = [...stormMap.values()]
      .sort((a, b) => b.year - a.year || b.disasterNumber - a.disasterNumber)
      .slice(0, 8);

    out[c.slug] = {
      slug: c.slug,
      name: c.name,
      countySeat: c.seat,
      population: popEntry.population,
      populationVintage: popEntry.vintage,
      isCoastal: isCoastal(c.slug),
      region,
      majorCities: cities[c.slug] ?? [],
      hurricaneHistory: displayedStorms,
      stormSurgeRisk: stormSurgeRiskFor(c.slug),
      rainFloodRisk: rainFloodRiskFor(region),
      uniqueLocalContext: "", // filled by enrich-counties.ts
    };
  }

  // Preserve any uniqueLocalContext that was already populated by previous LLM runs
  if (fs.existsSync(OUT_PATH)) {
    const prev = JSON.parse(fs.readFileSync(OUT_PATH, "utf-8")) as Record<
      string,
      CountyProfile
    >;
    for (const slug of Object.keys(out)) {
      const oldCtx = prev[slug]?.uniqueLocalContext;
      if (typeof oldCtx === "string" && oldCtx.length > 0) {
        out[slug].uniqueLocalContext = oldCtx;
      }
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`built ${Object.keys(out).length} county profiles → ${OUT_PATH}`);

  const coastal = Object.values(out).filter((p) => p.isCoastal).length;
  console.log(`  coastal: ${coastal}, inland: ${Object.keys(out).length - coastal}`);
  const withCtx = Object.values(out).filter((p) => p.uniqueLocalContext).length;
  console.log(`  uniqueLocalContext populated: ${withCtx}/${Object.keys(out).length}`);
}

main();
