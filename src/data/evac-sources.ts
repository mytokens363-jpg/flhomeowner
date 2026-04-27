/**
 * Each FL county runs its own evacuation zone GIS service.
 * Most expose ArcGIS REST endpoints publicly.
 *
 * MVP plan: hit each county's GIS service for live address lookups,
 * fall back to "see your county's official map" for counties without
 * a queryable endpoint.
 *
 * Long-term: ingest all county evac shapefiles, host on our own
 * single GIS service (Cloudflare R2 + tiny worker) for one consistent UX.
 */

export type EvacSource = {
  countySlug: string;
  // ArcGIS MapServer or FeatureServer URL with point-query support
  serviceUrl: string | null;
  // The layer index containing evac zones
  layerId: number | null;
  // Field name returning the zone label (A, B, C, D, E, NEZ, etc.)
  zoneField: string | null;
  // Public-facing official map for fallback
  publicMap: string;
};

export const EVAC_SOURCES: EvacSource[] = [
  {
    // Live lookup via Miami-Dade FDEM ArcGIS service — verified working
    countySlug: "miami-dade",
    serviceUrl:
      "https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/HurricaneEvacZone_gdb/FeatureServer",
    layerId: 0,
    zoneField: "ZONEID",
    publicMap: "https://www.miamidade.gov/global/emergency/hurricane/evacuation-zones.page",
  },
  {
    // Broward live GIS endpoint not confirmed — link to official map
    countySlug: "broward",
    serviceUrl: null,
    layerId: null,
    zoneField: null,
    publicMap: "https://www.broward.org/Hurricane/Pages/EvacuationZones.aspx",
  },
  {
    countySlug: "palm-beach",
    serviceUrl: null,
    layerId: null,
    zoneField: null,
    publicMap: "https://discover.pbcgov.org/publicsafety/dem/Pages/Evacuation-Zones.aspx",
  },
  {
    countySlug: "hillsborough",
    serviceUrl: null,
    layerId: null,
    zoneField: null,
    publicMap: "https://www.hillsboroughcounty.org/en/residents/public-safety/emergency-management/know-your-evacuation-zone",
  },
  {
    countySlug: "pinellas",
    serviceUrl: null,
    layerId: null,
    zoneField: null,
    publicMap: "https://www.pinellascounty.org/emergency/zones.htm",
  },
  // Additional county endpoints added as GIS services are verified
];

export const getEvacSource = (countySlug: string) =>
  EVAC_SOURCES.find((s) => s.countySlug === countySlug);
