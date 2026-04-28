import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/geocode";
import { lookupFloodZone } from "@/lib/fema";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const debug = req.nextUrl.searchParams.get("debug") === "1";

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const errors: string[] = [];

  try {
    let geo;
    try {
      geo = await geocode(address);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`geocode: ${msg}`);
      throw new Error(`Geocoder failed: ${msg}`);
    }

    if (!geo) {
      return NextResponse.json(
        {
          error: "Could not locate that address. Try adding a ZIP code.",
          ...(debug ? { debug: { errors, address } } : {}),
        },
        { status: 404 }
      );
    }

    let result;
    try {
      result = await lookupFloodZone(geo.lat, geo.lon);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`fema: ${msg}`);
      throw new Error(`FEMA lookup failed: ${msg}`);
    }

    return NextResponse.json({
      ...result,
      coords: { lat: geo.lat, lon: geo.lon },
      matchedAddress: geo.display,
      ...(debug ? { debug: { geocoder: geo.source, errors } } : {}),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("flood-zone route error:", msg, errors);
    return NextResponse.json(
      {
        error: msg,
        ...(debug ? { debug: { errors, address } } : {}),
      },
      { status: 500 }
    );
  }
}
