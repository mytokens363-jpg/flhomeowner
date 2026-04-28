/**
 * Geocoder using the US Census Bureau's free geocoding service.
 *
 * Why Census instead of Nominatim:
 *   - No auth, no API key, no rate limits worth worrying about
 *   - Doesn't block Cloudflare edge IPs (Nominatim does)
 *   - Authoritative US address data
 *   - Built for exactly this kind of civic-data use case
 *
 * Docs: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf
 *
 * Fallback: if Census can't match, fall back to Nominatim with proper headers.
 */

export type GeocodeResult = {
  lat: number;
  lon: number;
  display: string;
  source: "census" | "nominatim";
};

export async function geocode(address: string): Promise<GeocodeResult | null> {
  // Try Census first
  const census = await tryCensus(address);
  if (census) return census;

  // Fall back to Nominatim
  const nominatim = await tryNominatim(address);
  return nominatim;
}

async function tryCensus(address: string): Promise<GeocodeResult | null> {
  try {
    const params = new URLSearchParams({
      address: address,
      benchmark: "Public_AR_Current",
      format: "json",
    });

    const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        addressMatches?: Array<{
          matchedAddress: string;
          coordinates: { x: number; y: number };
        }>;
      };
    };

    const match = data.result?.addressMatches?.[0];
    if (!match) return null;

    return {
      lat: match.coordinates.y,
      lon: match.coordinates.x,
      display: match.matchedAddress,
      source: "census",
    };
  } catch (err) {
    console.error("Census geocode failed:", err);
    return null;
  }
}

async function tryNominatim(address: string): Promise<GeocodeResult | null> {
  try {
    const params = new URLSearchParams({
      q: `${address}, Florida, USA`,
      format: "json",
      limit: "1",
      countrycodes: "us",
    });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "flhomeowner.com (contact@flhomeowner.com)",
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (!data?.[0]) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display: data[0].display_name,
      source: "nominatim",
    };
  } catch (err) {
    console.error("Nominatim geocode failed:", err);
    return null;
  }
}
