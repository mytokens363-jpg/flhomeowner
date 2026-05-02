import { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageLayout from "@/components/ToolPageLayout";
import LeadCTA from "@/components/LeadCTA";
import FAQ from "@/components/FAQ";
import FloodZoneTool from "@/app/flood-zone/FloodZoneTool";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import rawData from "@/data/flood-county-data.json";
import rawCopy from "@/data/flood-county-copy.json";
import type { CoastalRegion } from "@/data/fl-coastal-counties";

type CountyProfile = {
  slug: string;
  name: string;
  countySeat: string;
  population: number;
  populationVintage: string;
  isCoastal: boolean;
  region: CoastalRegion;
  majorCities: { name: string; population: number }[];
  hurricaneHistory: {
    name: string;
    year: number;
    type: string;
    disasterNumber: number;
  }[];
  stormSurgeRisk: "low" | "moderate" | "high" | "extreme";
  rainFloodRisk: "low" | "moderate" | "high";
  uniqueLocalContext: string;
};

const data = rawData as Record<string, CountyProfile>;
const copy = rawCopy as Record<string, string>;

type Params = Promise<{ county: string }>;

export function generateStaticParams() {
  return Object.keys(data).map((county) => ({ county }));
}

const REGION_LABEL: Record<CoastalRegion, string> = {
  southeast: "Southeast Florida (Atlantic)",
  southwest: "Southwest Florida (Gulf)",
  northeast: "Northeast Florida (Atlantic)",
  "big-bend": "Florida Big Bend (Gulf)",
  panhandle: "Florida Panhandle (Gulf)",
  keys: "Florida Keys",
  inland: "Inland Florida",
};

const RISK_STYLE: Record<
  string,
  { word: string; tone: string }
> = {
  extreme: { word: "Extreme", tone: "bg-red-100 text-red-800 border-red-300" },
  high: { word: "High", tone: "bg-coral/15 text-coral border-coral/40" },
  moderate: {
    word: "Moderate",
    tone: "bg-amber-100 text-amber-800 border-amber-300",
  },
  low: { word: "Low", tone: "bg-ocean/15 text-deep border-ocean/40" },
};

function subtitleFor(c: CountyProfile): string {
  const seat = `County seat: ${c.countySeat}.`;
  const pop = `${c.population.toLocaleString()} residents.`;
  const geo = c.isCoastal
    ? c.region === "keys"
      ? "Florida Keys."
      : `Coastal county — ${REGION_LABEL[c.region]}.`
    : "Inland county.";
  return `${seat} ${pop} ${geo}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { county: slug } = await params;
  const c = data[slug];
  if (!c) return {};

  const riskWord =
    c.stormSurgeRisk === "extreme"
      ? "extreme"
      : c.stormSurgeRisk === "high"
        ? "high"
        : c.rainFloodRisk === "high"
          ? "elevated"
          : "moderate";

  return pageMetadata({
    title: `${c.name} County Flood Zones — Risk Map, FEMA Lookup & Hurricane History`,
    description: `${c.name} County, FL flood-risk profile: ${riskWord} risk, ${c.isCoastal ? "coastal" : "inland"}. Look up FEMA zones by address and see hurricane impact history.`,
    path: `/flood-zone/county/${slug}`,
  });
}

function RiskBadge({ label, level }: { label: string; level: string }) {
  const r = RISK_STYLE[level] ?? RISK_STYLE.moderate;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${r.tone}`}
    >
      {label}: {r.word}
    </span>
  );
}

function buildFaqs(c: CountyProfile) {
  const items: { q: string; a: string }[] = [];

  items.push({
    q: `What flood zones are in ${c.name} County?`,
    a: `${c.name} County contains a mix of FEMA flood zones. ${
      c.isCoastal
        ? "Coastal and low-lying areas typically fall in Special Flood Hazard Areas (zones AE, A, VE)"
        : "Areas near rivers, lakes, and low-elevation drainage typically fall in Special Flood Hazard Areas (zones A, AE, AH)"
    }, while higher-elevation areas are usually Zone X. Use the lookup tool above to check any specific address against the live National Flood Hazard Layer.`,
  });

  if (c.hurricaneHistory.length) {
    const recent = c.hurricaneHistory.slice(0, 5);
    items.push({
      q: `What hurricanes have impacted ${c.name} County recently?`,
      a: `Storms that triggered FEMA disaster declarations covering ${c.name} County since ${recent[recent.length - 1].year}: ${recent.map((s) => `${s.name} (${s.year})`).join(", ")}. Federal disaster declarations cover both direct landfall counties and surrounding counties eligible for federal assistance.`,
    });
  }

  items.push({
    q: `Is flood insurance required in ${c.name} County?`,
    a: `Flood insurance is federally required for any property in a Special Flood Hazard Area (zones beginning with A or V) that has a federally backed mortgage. In Zone X it is optional but often inexpensive. The lookup tool above tells you whether a specific address falls in an SFHA.`,
  });

  if (c.isCoastal) {
    items.push({
      q: `How does storm surge affect ${c.name} County?`,
      a: `As a ${REGION_LABEL[c.region]} county, ${c.name} faces ${RISK_STYLE[c.stormSurgeRisk].word.toLowerCase()} storm surge risk during tropical systems. Storm surge is separate from rainfall flooding and is not always reflected in FEMA flood zone designations — check your county's evacuation zone as well.`,
    });
  }

  items.push({
    q: `What is the population of ${c.name} County?`,
    a: `${c.population.toLocaleString()} residents (${c.populationVintage}, US Census). The county seat is ${c.countySeat}.`,
  });

  return items;
}

export default async function CountyFloodPage({ params }: { params: Params }) {
  const { county: slug } = await params;
  const c = data[slug];
  if (!c) notFound();

  const localCopy = copy[slug];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Flood Zone Lookup", url: "/flood-zone" },
            { name: c.name, url: `/flood-zone/county/${slug}` },
          ]),
        }}
      />
      <ToolPageLayout
        title={`${c.name} County Flood Zones`}
        subtitle={subtitleFor(c)}
        belowTool={
          <div className="space-y-10">
            {localCopy && (
              <section>
                <h2 className="font-display text-2xl text-deep mb-3">
                  Flood risk in {c.name} County
                </h2>
                <p className="text-deep/80 leading-relaxed">{localCopy}</p>
              </section>
            )}

            <section>
              <h2 className="font-display text-2xl text-deep mb-4">
                Risk profile
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <RiskBadge label="Storm surge" level={c.stormSurgeRisk} />
                <RiskBadge label="Rain flooding" level={c.rainFloodRisk} />
              </div>
              {c.uniqueLocalContext && (
                <p className="text-deep/80 leading-relaxed">
                  {c.uniqueLocalContext}
                </p>
              )}
            </section>

            {c.hurricaneHistory.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-deep mb-3">
                  Recent FEMA-declared storms
                </h2>
                <p className="text-deep/70 text-sm mb-3">
                  Tropical systems that triggered federal disaster declarations
                  covering {c.name} County (most recent first):
                </p>
                <ul className="flex flex-wrap gap-2">
                  {c.hurricaneHistory.map((h) => (
                    <li
                      key={`${h.name}-${h.year}`}
                      className="rounded-full bg-coral/10 text-coral border border-coral/30 px-3 py-1 text-sm"
                    >
                      {h.type === "Hurricane" ? "Hurricane" : "TS"} {h.name} ({h.year})
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-deep/50 mt-3">
                  Source: OpenFEMA Disaster Declarations Summaries.
                </p>
              </section>
            )}

            {c.majorCities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-deep mb-3">
                  Major cities in {c.name} County
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {c.majorCities.map((city) => (
                    <li
                      key={city.name}
                      className="rounded-lg border border-deep/10 bg-white px-3 py-2 text-sm text-deep flex items-baseline justify-between"
                    >
                      <span>{city.name}</span>
                      {city.population > 0 && (
                        <span className="text-xs text-deep/50">
                          {city.population.toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-deep/50 mt-3">
                  Source: US Census SUB-EST 2024.
                </p>
              </section>
            )}

            <LeadCTA
              variant={slug === "broward" ? "broward" : "statewide"}
              context={`Buying or selling in ${c.name} County? A local Florida agent can tell you how flood zone affects price, insurance, and closing.`}
            />

            <FAQ items={buildFaqs(c)} />

            <p className="text-xs text-deep/50">
              Sources: FEMA National Flood Hazard Layer, OpenFEMA Disaster
              Declarations, US Census Bureau (ACS 5-year, SUB-EST 2024), Florida
              Department of Environmental Protection. Flood zone designations
              and risk profiles change over time — always verify with the
              official lookup before making property decisions.
            </p>
          </div>
        }
      >
        <FloodZoneTool />
      </ToolPageLayout>
    </>
  );
}
