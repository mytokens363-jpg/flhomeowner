import { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms governing use of FL Homeowner. Tools are estimates, not professional advice.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ProsePage
      title="Terms of Use"
      subtitle="The rules of using flhomeowner.com."
      updated="April 26, 2026"
    >
      <h2 className="font-display text-2xl text-deep mt-8">Acceptance</h2>
      <p>
        By using flhomeowner.com (the &quot;Site&quot;), you agree to these
        Terms of Use. If you don&apos;t agree, don&apos;t use the Site.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Tools are estimates, not advice
      </h2>
      <p>
        The calculators and lookup tools on this Site are provided for general
        informational purposes only. <strong>They are estimates, not
        professional advice.</strong> Property tax, flood zones, evacuation
        zones, and similar data depend on official sources that change over
        time and vary by individual circumstances.
      </p>
      <p>
        Before making any financial, real estate, insurance, legal, or
        emergency-preparedness decision, verify the result with the appropriate
        official source:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Your county property appraiser (for property values, tax bills, and
          exemptions)
        </li>
        <li>FEMA and your county floodplain manager (for flood zone status)</li>
        <li>
          Your county emergency management office (for evacuation zones and
          orders)
        </li>
        <li>A licensed insurance agent (for coverage requirements and quotes)</li>
        <li>A licensed real estate professional and a licensed attorney</li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">
        No professional relationship
      </h2>
      <p>
        Use of this Site does not create a real estate, insurance, legal,
        financial, or fiduciary relationship between you and FL Homeowner or any
        of its operators. We are not your real estate agent, insurance agent,
        attorney, accountant, or financial advisor.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Third-party data and links
      </h2>
      <p>
        The Site retrieves data from third-party sources (FEMA, county GIS
        services, OpenStreetMap, Florida Department of Revenue) and links to
        third-party websites. We don&apos;t control those sources and aren&apos;t
        responsible for their accuracy, availability, content, or privacy
        practices. Data may be outdated, incomplete, or temporarily unavailable.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Acceptable use
      </h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Scrape, copy, or systematically download content from the Site beyond
          what a normal browser does
        </li>
        <li>
          Submit automated requests, bots, or load-test traffic without our
          written permission
        </li>
        <li>
          Reverse-engineer, attempt to bypass any rate limits, or interfere with
          Site operations
        </li>
        <li>
          Use the Site for any illegal purpose or in violation of any applicable
          law
        </li>
        <li>
          Resell, repackage, or commercially redistribute Site content without
          permission
        </li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">Intellectual property</h2>
      <p>
        Original content on the Site (design, code, written text, calculators)
        is owned by FL Homeowner and protected by applicable laws. Public data
        (FEMA flood zones, county GIS data, etc.) belongs to its respective
        government source.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Disclaimers
      </h2>
      <p className="uppercase text-xs tracking-wider">
        The site, content, and tools are provided &quot;as is&quot; and
        &quot;as available&quot; without warranty of any kind, either express
        or implied, including but not limited to merchantability, fitness for a
        particular purpose, accuracy, or non-infringement. We do not warrant
        the site will be uninterrupted, error-free, or secure.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Limitation of liability
      </h2>
      <p className="uppercase text-xs tracking-wider">
        To the maximum extent permitted by law, FL Homeowner, its operators,
        and contributors are not liable for any indirect, incidental, special,
        consequential, or punitive damages arising out of or related to your
        use of the site, including but not limited to lost profits, lost data,
        property damage, personal injury, missed deadlines, or insurance,
        evacuation, or transaction decisions made in reliance on tool output.
      </p>
      <p>
        Some jurisdictions don&apos;t allow the exclusion of certain warranties
        or limitation of liability, so some of the above may not apply to you.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Indemnification</h2>
      <p>
        You agree to indemnify and hold FL Homeowner harmless from any claim or
        demand, including reasonable attorneys&apos; fees, made by any third
        party arising out of your use of the Site or violation of these Terms.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Governing law
      </h2>
      <p>
        These Terms are governed by the laws of the State of Florida, without
        regard to its conflict of law principles. Any dispute will be resolved
        in the state or federal courts located in Broward County, Florida, and
        you consent to the personal jurisdiction of those courts.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Changes</h2>
      <p>
        We may update these Terms at any time. Material changes will be marked
        by an updated date. Continued use after changes means you accept them.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:contact@flhomeowner.com" className="text-coral underline">
          contact@flhomeowner.com
        </a>
        .
      </p>
    </ProsePage>
  );
}
