import { Metadata } from "next";
import ToolPageLayout from "@/components/ToolPageLayout";
import LeadCTA from "@/components/LeadCTA";
import FAQ from "@/components/FAQ";
import EvacZoneTool from "./EvacZoneTool";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Florida Hurricane Evacuation Zone Lookup by Address",
  description:
    "Find your hurricane evacuation zone before the next storm. Live county data for Florida — type your address, get your zone, see what to do.",
  path: "/evacuation-zone",
});

const faqs = [
  {
    q: "What do evacuation zones (A, B, C, D, E) mean?",
    a: "Florida counties use letter zones (A is highest risk, typically coastal and surge-prone) to phase evacuations based on storm category. Officials issue evacuation orders by zone — Zone A first, then B, and so on as storm intensity demands.",
  },
  {
    q: "When should I evacuate?",
    a: "Evacuate when your zone is ordered to evacuate. Zones are determined by storm-surge risk, not wind. If you live in an evacuation zone, leave when told — don't wait for the storm.",
  },
  {
    q: "Are evacuation zones the same as flood zones?",
    a: "No. FEMA flood zones describe insurance and rainfall/coastal flood risk. Evacuation zones are about storm-surge risk from hurricanes and are set by county emergency management.",
  },
  {
    q: "What if I'm not in any zone?",
    a: "You're outside the surge-evacuation area. You may still need to leave a manufactured home or a structure that can't withstand high winds. Check with your county.",
  },
];

export default function EvacZonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Evacuation Zone Lookup", url: "/evacuation-zone" },
          ]),
        }}
      />
      <ToolPageLayout
        title="Hurricane Evacuation Zone Lookup"
        subtitle="Know your zone before the next storm forms. Florida-wide, address-level lookup."
        belowTool={
          <div className="space-y-10">
            <LeadCTA
              variant="statewide"
              context="Looking for a home outside the evacuation zones? Talk to a Florida agent who knows the inland markets."
            />
            <FAQ items={faqs} />
          </div>
        }
      >
        <EvacZoneTool />
      </ToolPageLayout>
    </>
  );
}
