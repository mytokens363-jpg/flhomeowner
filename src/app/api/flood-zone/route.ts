import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/geocode";
import { lookupFloodZone } from "@/lib/fema";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const geo = await geocode(address);
  if (!geo) {
    return NextResponse.json(
      { error: "Could not locate that address." },
      { status: 404 }
    );
  }

  const result = await lookupFloodZone(geo.lat, geo.lon);
  return NextResponse.json({
    ...result,
    coords: { lat: geo.lat, lon: geo.lon },
    matchedAddress: geo.display,
  });
}
