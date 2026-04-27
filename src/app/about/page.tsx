import { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About FL Homeowner",
  description:
    "Florida-specific property tools built by a Broward County real estate professional. What we build, why, and who's behind it.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage
      title="About FL Homeowner"
      subtitle="Free Florida property tools, built by someone who works in Florida real estate every day."
    >
      <h2 className="font-display text-2xl text-deep mt-8">
        Why this site exists
      </h2>
      <p>
        Florida is its own animal. Homestead exemptions. Save Our Homes caps.
        Wind mitigation discounts. Citizens versus the private market.
        Evacuation zones that change every few years. FEMA flood maps that
        decide whether you need an extra $3,000/year in insurance. Permit fees
        that vary block by block.
      </p>
      <p>
        Most online calculators are generic — they treat Florida like Ohio.
        The official county sites have the right data but bury it under PDFs
        and broken search forms. Buyers, sellers, and homeowners end up
        guessing or paying someone to look it up.
      </p>
      <p>
        FL Homeowner is the resource we wanted to send our own clients to. One
        clean URL per question, real Florida-specific math, no signup, no
        spam, no &quot;please call us for a quote&quot; gating.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">What you&apos;ll find here</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Flood Zone Lookup</strong> — the FEMA flood zone for any
          Florida address, with plain-English explanation of what it means.
        </li>
        <li>
          <strong>Property Tax Calculator</strong> — estimated annual property
          tax for any Florida county, with homestead and Save Our Homes
          factored in.
        </li>
        <li>
          <strong>Hurricane Evacuation Zone Lookup</strong> — your evac zone
          before the next storm forms.
        </li>
        <li>
          <strong>More tools coming</strong> — wind mitigation discounts,
          permit fees, portability calculator, and others as we ship them.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">Who&apos;s behind it</h2>
      <p>
        FL Homeowner is operated by a Broward County, Florida real estate
        professional and technology builder. The site grew out of years of
        answering the same questions for buyers and sellers in the South
        Florida luxury market. If a tool helps you, that&apos;s the goal. If
        you eventually need a real estate referral in Broward County, we can
        help with that too.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Our data sources
      </h2>
      <p>
        We pull data from authoritative public sources and cite them where
        relevant:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Flood zones:</strong> FEMA National Flood Hazard Layer (NFHL)
        </li>
        <li>
          <strong>Property tax rates:</strong> Florida Department of Revenue
          and individual county property appraisers
        </li>
        <li>
          <strong>Evacuation zones:</strong> Florida county emergency
          management GIS services
        </li>
        <li>
          <strong>Geocoding:</strong> OpenStreetMap Nominatim
        </li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">
        How we make money
      </h2>
      <p>
        Display advertising via Google AdSense and occasional referrals to
        licensed Florida professionals (real estate agents, insurance agents)
        when a user explicitly asks for an introduction. We never sell your
        information, and we don&apos;t put data behind a paywall. The tools
        stay free.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Important caveat
      </h2>
      <p>
        Every tool on this site is an <strong>estimate</strong>. We do our
        best to use authoritative data, but rates change, maps update, and
        every property has its own specifics. Before making a financial,
        insurance, or evacuation decision, verify with the appropriate
        official source or licensed professional. See our{" "}
        <a href="/terms" className="text-coral underline">
          Terms of Use
        </a>{" "}
        for more.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Contact</h2>
      <p>
        Have a tool idea? Spotted a bug? Want to suggest a county data source
        we&apos;re missing? Email{" "}
        <a href="mailto:contact@flhomeowner.com" className="text-coral underline">
          contact@flhomeowner.com
        </a>{" "}
        — we read every message.
      </p>
    </ProsePage>
  );
}
