/**
 * Free geocoding via US Census Bureau Geocoding API.
 * No API key, no rate limits worth worrying about, .gov — works from
 * Cloudflare Workers edge runtime (Nominatim blocks datacenter IPs).
 * https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf
 */

export type GeocodeResult = {
  lat: number;
  lon: number;
  display: string;
};

export async function geocode(address: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  });

  const res = await fetch(
    `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`
  );

  if (!res.ok) return null;
  const data = await res.json();
  const match = data?.result?.addressMatches?.[0];
  if (!match) return null;

  return {
    lat: match.coordinates.y,
    lon: match.coordinates.x,
    display: match.matchedAddress,
  };
}
