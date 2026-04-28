/**
 * FEMA National Flood Hazard Layer (NFHL) client.
 *
 * Data source: Esri-hosted "USA Flood Hazard Reduced Set" FeatureServer.
 * This is the same FEMA NFHL data but served from Esri's ArcGIS Online
 * infrastructure, which doesn't block Cloudflare datacenter IPs the way
 * hazards.fema.gov (IBM WebSEAL) does.
 *
 * Fields available: FLD_ZONE, ZONE_SUBTY (no BFE/panel in the reduced set).
 */

const NFHL_BASE =
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Flood_Hazard_Reduced_Set_gdb/FeatureServer";

const FLOOD_ZONE_LAYER = 0;

export type FloodZoneResult = {
  zone: string | null;
  zoneSubtype: string | null;
  bfe: number | null;
  panel: string | null;
  panelDate: string | null;
  insuranceRequired: boolean;
  description: string;
};

type NFHLAttributes = {
  FLD_ZONE?: string;
  ZONE_SUBTY?: string;
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
    outFields: "FLD_ZONE,ZONE_SUBTY",
    returnGeometry: "false",
    f: "json",
  });

  const url = `${NFHL_BASE}/${FLOOD_ZONE_LAYER}/query?${params}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`FEMA NFHL responded ${res.status}`);
  }

  // FEMA sometimes returns HTML on errors. Guard against it.
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("json")) {
    const text = await res.text();
    throw new Error(`FEMA returned non-JSON: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    features?: { attributes: NFHLAttributes }[];
    error?: { code: number; message: string };
  };

  if (data.error) {
    throw new Error(`FEMA error ${data.error.code}: ${data.error.message}`);
  }

  const feat = data.features?.[0];
  if (!feat) {
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
    bfe: null,
    panel: null,
    panelDate: null,
    insuranceRequired,
    description: describeZone(zone),
  };
}

function isHighRiskZone(zone: string): boolean {
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
