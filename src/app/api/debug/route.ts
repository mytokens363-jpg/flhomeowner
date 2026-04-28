import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Ping each upstream from Cloudflare's edge.
 * Visit /api/debug to see what's reachable and what isn't.
 * Delete this route once flood/evac tools are confirmed working.
 */
export async function GET() {
  const tests: Record<string, unknown> = {};

  // 1. US Census geocoder
  try {
    const r = await fetch(
      "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1600+pennsylvania+ave+washington+dc&benchmark=Public_AR_Current&format=json"
    );
    tests.census = {
      status: r.status,
      contentType: r.headers.get("content-type"),
      ok: r.ok,
    };
  } catch (err) {
    tests.census = { error: err instanceof Error ? err.message : String(err) };
  }

  // 2. OpenStreetMap Nominatim
  try {
    const r = await fetch(
      "https://nominatim.openstreetmap.org/search?q=miami+fl&format=json&limit=1",
      { headers: { "User-Agent": "flhomeowner.com" } }
    );
    tests.nominatim = {
      status: r.status,
      contentType: r.headers.get("content-type"),
      ok: r.ok,
    };
  } catch (err) {
    tests.nominatim = { error: err instanceof Error ? err.message : String(err) };
  }

  // 3. FEMA NFHL with a known Florida coordinate (downtown Miami)
  try {
    const params = new URLSearchParams({
      geometry: JSON.stringify({
        x: -80.1918,
        y: 25.7617,
        spatialReference: { wkid: 4326 },
      }),
      geometryType: "esriGeometryPoint",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "FLD_ZONE",
      returnGeometry: "false",
      f: "json",
    });
    const r = await fetch(
      `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?${params}`
    );
    tests.fema = {
      status: r.status,
      contentType: r.headers.get("content-type"),
      ok: r.ok,
    };
  } catch (err) {
    tests.fema = { error: err instanceof Error ? err.message : String(err) };
  }

  // 4. Broward evac GIS
  try {
    const r = await fetch(
      "https://gis.broward.org/arcgis/rest/services/EvacuationZones/MapServer/0?f=json"
    );
    tests.browardEvac = {
      status: r.status,
      contentType: r.headers.get("content-type"),
      ok: r.ok,
    };
  } catch (err) {
    tests.browardEvac = {
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return NextResponse.json({ timestamp: new Date().toISOString(), tests });
}
