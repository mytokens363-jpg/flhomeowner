import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/geocode";
import { getEvacSource } from "@/data/evac-sources";
import { getCounty } from "@/data/counties";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const countySlug = req.nextUrl.searchParams.get("county");
  const debug = req.nextUrl.searchParams.get("debug") === "1";

  if (!address || !countySlug) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const county = getCounty(countySlug);
  const source = getEvacSource(countySlug);

  if (!county) {
    return NextResponse.json({ error: "Unknown county" }, { status: 404 });
  }

  if (!source?.serviceUrl || source.layerId === null || !source.zoneField) {
    return NextResponse.json({
      zone: null,
      county: county.name,
      publicMap: source?.publicMap || "",
      fallback: true,
    });
  }

  const errors: string[] = [];

  try {
    let geo;
    try {
      geo = await geocode(address);
    } catch (err) {
      errors.push(`geocode: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }

    if (!geo) {
      return NextResponse.json(
        { error: "Could not locate address" },
        { status: 404 }
      );
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

    const url = `${source.serviceUrl}/${source.layerId}/query?${params}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });

    if (!res.ok) {
      errors.push(`gis http ${res.status}`);
      throw new Error(`GIS service responded ${res.status}`);
    }

    const data = (await res.json()) as {
      features?: { attributes: Record<string, unknown> }[];
      error?: { message: string };
    };

    if (data.error) {
      errors.push(`gis error: ${data.error.message}`);
      throw new Error(data.error.message);
    }

    const zone = data.features?.[0]?.attributes?.[source.zoneField] ?? null;

    return NextResponse.json({
      zone: zone ? String(zone) : null,
      county: county.name,
      publicMap: source.publicMap,
      matchedAddress: geo.display,
      ...(debug ? { debug: { geocoder: geo.source, errors } } : {}),
    });
  } catch (err) {
    console.error("evac-zone route error:", err, errors);
    return NextResponse.json({
      zone: null,
      county: county.name,
      publicMap: source.publicMap,
      fallback: true,
      ...(debug
        ? {
            debug: {
              errors,
              error: err instanceof Error ? err.message : String(err),
            },
          }
        : {}),
    });
  }
}
