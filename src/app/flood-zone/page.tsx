import { Metadata } from "next";
import ToolPageLayout from "@/components/ToolPageLayout";
import LeadCTA from "@/components/LeadCTA";
import FAQ from "@/components/FAQ";
import FloodZoneTool from "./FloodZoneTool";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Florida Flood Zone Lookup — Free FEMA Zone Check by Address",
  description:
    "Check the FEMA flood zone of any Florida address in seconds. Live data from the National Flood Hazard Layer. Find out if flood insurance is required.",
  path: "/flood-zone",
});

const faqs = [
  {
    q: "How do I know if I'm in a flood zone?",
    a: "Enter your address above. We query FEMA's National Flood Hazard Layer at your exact coordinates and return the official zone designation (X, AE, VE, etc.).",
  },
  {
    q: "Which zones require flood insurance?",
    a: "Federally backed mortgages require flood insurance for properties in Special Flood Hazard Areas (SFHAs) — zones starting with A or V (A, AE, AH, AO, AR, A99, V, VE).",
  },
  {
    q: "What does Zone X mean?",
    a: "Zone X is a minimal-risk area outside the 0.2% annual chance floodplain. Flood insurance is not federally required, though optional preferred-risk policies are often inexpensive.",
  },
  {
    q: "What's a Base Flood Elevation (BFE)?",
    a: "The BFE is the elevation, in feet, that floodwaters are expected to reach during a 1% annual chance flood event. New construction in SFHAs typically must be built above the BFE.",
  },
  {
    q: "Is this data current?",
    a: "We pull live data from FEMA's NFHL service. FEMA periodically updates flood maps; the panel effective date is shown with each result.",
  },
];

export default function FloodZonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Flood Zone Lookup", url: "/flood-zone" },
          ]),
        }}
      />
      <ToolPageLayout
        title="Florida Flood Zone Lookup"
        subtitle="Live FEMA data. Type any FL address and see the official flood zone in seconds."
        belowTool={
          <div className="space-y-10">
            <LeadCTA
              variant="statewide"
              context="Buying or selling a home in a flood zone? Talk to a Florida agent who knows how it affects price, insurance, and closing."
            />
            <FAQ items={faqs} />
          </div>
        }
      >
        <FloodZoneTool />
      </ToolPageLayout>
    </>
  );
}
