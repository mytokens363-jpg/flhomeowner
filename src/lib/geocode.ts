/**
 * Free geocoding via OpenStreetMap Nominatim.
 * Usage policy: max 1 req/sec, set User-Agent, cache results.
 * https://operations.osmfoundation.org/policies/nominatim/
 *
 * For production scale, swap to:
 *   - Google Geocoding ($5 / 1k after free tier)
 *   - Mapbox ($0.50 / 1k)
 *   - PositionStack ($0.10 / 1k)
 */

export type GeocodeResult = {
  lat: number;
  lon: number;
  display: string;
};

export async function geocode(address: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: `${address}, Florida, USA`,
    format: "json",
    limit: "1",
    countrycodes: "us",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "User-Agent": "flhomeowner.com / contact@flhomeowner.com" },
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    display: data[0].display_name,
  };
}
