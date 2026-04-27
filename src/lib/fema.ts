/**
 * FEMA National Flood Hazard Layer (NFHL) client.
 * Public REST API, no auth, no rate limit worth worrying about.
 * Docs: https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS
 */

const NFHL_BASE =
  "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer";

// Layer 28 = Flood Hazard Zones
const FLOOD_ZONE_LAYER = 28;

export type FloodZoneResult = {
  zone: string | null;
  zoneSubtype: string | null;
  bfe: number | null;          // Base Flood Elevation, ft
  panel: string | null;        // FIRM panel ID
  panelDate: string | null;    // FIRM effective date
  insuranceRequired: boolean;  // mandatory purchase trigger
  description: string;         // plain-English summary
};

export async function lookupFloodZone(
  lat: number,
  lon: number
): Promise<FloodZoneResult | null> {
  const params = new URLSearchParams({
    geometry: JSON.stringify({
      x: lon,
      y: lat,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "FLD_ZONE,ZONE_SUBTY,STATIC_BFE,FIRM_PAN,EFF_DATE",
    returnGeometry: "false",
    f: "json",
  });

  const url = `${NFHL_BASE}/${FLOOD_ZONE_LAYER}/query?${params}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`NFHL ${res.status}`);
  const data = await res.json();

  const feat = data.features?.[0];
  if (!feat) {
    // No feature returned = unmapped or out of NFHL coverage (rare in FL)
    return {
      zone: null,
      zoneSubtype: null,
      bfe: null,
      panel: null,
      panelDate: null,
      insuranceRequired: false,
      description: "No FEMA flood zone data for this location.",
    };
  }

  const a = feat.attributes;
  const zone: string = a.FLD_ZONE ?? "";
  const insuranceRequired = isHighRiskZone(zone);

  return {
    zone: zone || null,
    zoneSubtype: a.ZONE_SUBTY || null,
    bfe: a.STATIC_BFE && a.STATIC_BFE !== -9999 ? a.STATIC_BFE : null,
    panel: a.FIRM_PAN || null,
    panelDate: a.EFF_DATE
      ? new Date(a.EFF_DATE).toISOString().slice(0, 10)
      : null,
    insuranceRequired,
    description: describeZone(zone),
  };
}

function isHighRiskZone(zone: string): boolean {
  // Special Flood Hazard Areas (SFHA) - federally backed mortgages require insurance
  return /^(A|AE|AH|AO|AR|A99|V|VE)/.test(zone);
}

function describeZone(zone: string): string {
  const map: Record<string, string> = {
    X: "Minimal flood hazard area. Outside the 0.2% annual chance floodplain.",
    AE: "High-risk zone. 1% annual chance flood (100-year flood). BFE determined.",
    AH: "High-risk zone with shallow flooding (1-3 ft, ponding). BFE determined.",
    AO: "High-risk zone with shallow sheet flow flooding. Depth shown.",
    A: "High-risk zone. 1% annual chance flood, no BFE determined.",
    VE: "High-risk coastal zone with wave action. BFE determined.",
    V: "High-risk coastal zone with wave action, no BFE.",
    D: "Possible but undetermined flood hazard. No analysis performed.",
  };
  return map[zone] || `Zone ${zone || "unmapped"}.`;
}
