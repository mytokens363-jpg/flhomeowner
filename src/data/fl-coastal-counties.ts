/**
 * Florida coastal counties + region tags for deterministic risk scoring.
 *
 * Source: Florida Department of Environmental Protection — 35 counties have
 * Atlantic, Gulf, or Florida Keys coastline.
 * https://floridadep.gov/water/coastal-construction-control-line/content/coastal-counties
 *
 * Region buckets are used to derive stormSurgeRisk in build-county-data.ts:
 *   southeast / southwest / keys → extreme
 *   big-bend / panhandle         → high
 *   northeast                    → high
 *   inland                       → low
 */

export type CoastalRegion =
  | "southeast"
  | "southwest"
  | "northeast"
  | "big-bend"
  | "panhandle"
  | "keys"
  | "inland";

export const COUNTY_REGION: Record<string, CoastalRegion> = {
  // Atlantic SE
  "miami-dade": "southeast",
  broward: "southeast",
  "palm-beach": "southeast",
  martin: "southeast",
  "st-lucie": "southeast",
  "indian-river": "southeast",

  // Atlantic central / NE
  brevard: "northeast",
  volusia: "northeast",
  flagler: "northeast",
  "st-johns": "northeast",
  duval: "northeast",
  nassau: "northeast",

  // Florida Keys
  monroe: "keys",

  // Gulf SW
  collier: "southwest",
  lee: "southwest",
  charlotte: "southwest",
  sarasota: "southwest",
  manatee: "southwest",
  hillsborough: "southwest",
  pinellas: "southwest",

  // Big Bend
  pasco: "big-bend",
  hernando: "big-bend",
  citrus: "big-bend",
  levy: "big-bend",
  dixie: "big-bend",
  taylor: "big-bend",
  jefferson: "big-bend",
  wakulla: "big-bend",

  // Panhandle
  franklin: "panhandle",
  gulf: "panhandle",
  bay: "panhandle",
  walton: "panhandle",
  okaloosa: "panhandle",
  "santa-rosa": "panhandle",
  escambia: "panhandle",
};

export function isCoastal(slug: string): boolean {
  return slug in COUNTY_REGION;
}

export function regionOf(slug: string): CoastalRegion {
  return COUNTY_REGION[slug] ?? "inland";
}

export function stormSurgeRiskFor(
  slug: string
): "low" | "moderate" | "high" | "extreme" {
  const r = regionOf(slug);
  if (r === "inland") return "low";
  if (r === "southeast" || r === "southwest" || r === "keys") return "extreme";
  return "high";
}
