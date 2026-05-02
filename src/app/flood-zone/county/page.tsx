import { Metadata } from "next";
import Link from "next/link";
import ToolPageLayout from "@/components/ToolPageLayout";
import LeadCTA from "@/components/LeadCTA";
import FAQ from "@/components/FAQ";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import rawData from "@/data/flood-county-data.json";
import type { CoastalRegion } from "@/data/fl-coastal-counties";

type CountyEntry = {
  slug: string;
  name: string;
  countySeat: string;
  population: number;
  isCoastal: boolean;
  region: CoastalRegion;
  stormSurgeRisk: "low" | "moderate" | "high" | "extreme";
};

const REGION_ORDER: { key: CoastalRegion; label: string; blurb: string }[] = [
  {
    key: "southeast",
    label: "Southeast Florida (Atlantic)",
    blurb: "Densest population, extreme storm surge exposure on the Atlantic coast.",
  },
  {
    key: "southwest",
    label: "Southwest Florida (Gulf)",
    blurb: "Cape Coral / Naples corridor — extreme surge from Gulf hurricanes (Charley, Ian, Helene, Milton).",
  },
  {
    key: "keys",
    label: "Florida Keys",
    blurb: "Low elevation islands; entire chain is in evacuation zones during hurricanes.",
  },
  {
    key: "big-bend",
    label: "Big Bend (Gulf)",
    blurb: "Sparse coast from Pasco up to Wakulla — recent landfall corridor for Idalia and Helene.",
  },
  {
    key: "panhandle",
    label: "Florida Panhandle (Gulf)",
    blurb: "Pensacola to Panama City — Ivan, Michael, Sally impact zone.",
  },
  {
    key: "northeast",
    label: "Northeast Florida (Atlantic)",
    blurb: "Jacksonville south to Brevard — moderate surge, significant rain flooding from St. Johns River basin.",
  },
  {
    key: "inland",
    label: "Inland Florida",
    blurb: "No coast, low storm surge risk — flooding driven by rainfall, lakes, and river systems.",
  },
];

const data = rawData as Record<string, CountyEntry>;

const byRegion: Record<CoastalRegion, CountyEntry[]> = {
  southeast: [],
  southwest: [],
  keys: [],
  "big-bend": [],
  panhandle: [],
  northeast: [],
  inland: [],
};
for (const slug of Object.keys(data).sort()) {
  const c = data[slug];
  byRegion[c.region].push(c);
}

export const metadata: Metadata = pageMetadata({
  title: "Florida Flood Zones by County — All 67 Counties",
  description:
    "Browse FEMA flood-zone profiles for all 67 Florida counties. Population, hurricane history, storm surge risk, and per-address FEMA zone lookup.",
  path: "/flood-zone/county",
});

const faqs = [
  {
    q: "How many Florida counties have a flood-zone profile here?",
    a: "All 67 Florida counties. Each page combines authoritative data — US Census population and major cities, OpenFEMA disaster declarations, FDEP coastal-county classification — with a per-address FEMA zone lookup tool.",
  },
  {
    q: "Which Florida counties have the highest flood risk?",
    a: "Coastal counties in Southeast Florida (Miami-Dade, Broward, Palm Beach), Southwest Florida (Lee, Collier, Sarasota), and the Florida Keys (Monroe) face extreme storm-surge risk. Inland counties have lower surge but still moderate rainfall flood risk.",
  },
  {
    q: "Which counties are coastal vs inland?",
    a: "Florida has 35 coastal counties (per FDEP) and 32 inland counties. Coastal counties touch either the Atlantic Ocean, the Gulf of Mexico, or the Florida Keys.",
  },
  {
    q: "How current is this data?",
    a: "Population from US Census ACS5 2023, city populations from US Census SUB-EST 2024, hurricane impact lists from OpenFEMA Disaster Declarations Summaries (live API). FEMA flood zone lookups are queried live from FEMA's National Flood Hazard Layer.",
  },
];

export default function CountyIndexPage() {
  const total = Object.keys(data).length;
  const coastal = Object.values(data).filter((c) => c.isCoastal).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Flood Zone Lookup", url: "/flood-zone" },
            { name: "All Counties", url: "/flood-zone/county" },
          ]),
        }}
      />
      <ToolPageLayout
        title="Florida Flood Zones by County"
        subtitle={`Browse flood-risk profiles for all ${total} Florida counties (${coastal} coastal, ${total - coastal} inland). Each page has a per-address FEMA lookup, hurricane history, and demographic data.`}
        belowTool={
          <div className="space-y-10">
            <FAQ items={faqs} />
            <LeadCTA
              variant="statewide"
              context="Buying or selling property anywhere in Florida? A local agent can tell you how flood zone affects price, insurance, and closing."
            />
          </div>
        }
      >
        <div className="space-y-10">
          {REGION_ORDER.map((region) => {
            const counties = byRegion[region.key];
            if (!counties.length) return null;
            return (
              <section key={region.key}>
                <h2 className="font-display text-2xl text-deep mb-1">
                  {region.label}
                </h2>
                <p className="text-deep/60 text-sm mb-4">{region.blurb}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {counties.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/flood-zone/county/${c.slug}`}
                        className="block rounded-lg border border-deep/10 bg-white px-4 py-3 hover:border-coral hover:bg-coral/5 transition"
                      >
                        <span className="font-medium text-deep">
                          {c.name} County
                        </span>
                        <span className="block text-xs text-deep/50 mt-0.5">
                          {c.countySeat} · {c.population.toLocaleString()} residents
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </ToolPageLayout>
    </>
  );
}
