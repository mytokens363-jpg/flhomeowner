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
    countySlug: "broward",
    serviceUrl:
      "https://gis.broward.org/arcgis/rest/services/EvacuationZones/MapServer",
    layerId: 0,
    zoneField: "ZONE",
    publicMap: "https://www.broward.org/Hurricane/Pages/EvacuationZones.aspx",
  },
  {
    countySlug: "miami-dade",
    serviceUrl:
      "https://gisweb.miamidade.gov/arcgis/rest/services/Hurricane/MapServer",
    layerId: 0,
    zoneField: "ZONE",
    publicMap: "https://www.miamidade.gov/global/emergency/hurricane/evacuation-zones.page",
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
  // ... extend to all 67 counties as endpoints are confirmed
];

export const getEvacSource = (countySlug: string) =>
  EVAC_SOURCES.find((s) => s.countySlug === countySlug);
