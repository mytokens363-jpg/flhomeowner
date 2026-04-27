import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/geocode";
import { getEvacSource } from "@/data/evac-sources";
import { getCounty } from "@/data/counties";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const countySlug = req.nextUrl.searchParams.get("county");
  if (!address || !countySlug) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const county = getCounty(countySlug);
  const source = getEvacSource(countySlug);

  if (!county) {
    return NextResponse.json({ error: "Unknown county" }, { status: 404 });
  }

  // No queryable endpoint configured → fallback response
  if (!source?.serviceUrl || source.layerId === null || !source.zoneField) {
    return NextResponse.json({
      zone: null,
      county: county.name,
      publicMap: source?.publicMap || "",
      fallback: true,
    });
  }

  const geo = await geocode(address);
  if (!geo) {
    return NextResponse.json({ error: "Could not locate address" }, { status: 404 });
  }

  const params = new URLSearchParams({
    geometry: JSON.stringify({
      x: geo.lon,
      y: geo.lat,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: source.zoneField,
    returnGeometry: "false",
    f: "json",
  });

  try {
    const url = `${source.serviceUrl}/${source.layerId}/query?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GIS ${res.status}`);
    const data = await res.json();
    const zone =
      data.features?.[0]?.attributes?.[source.zoneField] ?? null;

    return NextResponse.json({
      zone: zone ? String(zone) : null,
      county: county.name,
      publicMap: source.publicMap,
      matchedAddress: geo.display,
    });
  } catch {
    // GIS down — graceful fallback to the official map link
    return NextResponse.json({
      zone: null,
      county: county.name,
      publicMap: source.publicMap,
      fallback: true,
    });
  }
}
