import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import floodCountyData from "@/data/flood-county-data.json";
import ToolPageLayout from "@/components/ToolPageLayout";
import LeadCTA from "@/components/LeadCTA";
import FAQ from "@/components/FAQ";
import PropertyTaxTool from "./PropertyTaxTool";
import { FL_COUNTIES, getCounty } from "@/data/counties";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

type Params = Promise<{ county: string }>;

export function generateStaticParams() {
  return FL_COUNTIES.map((c) => ({ county: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { county: slug } = await params;
  const county = getCounty(slug);
  if (!county) return {};
  return pageMetadata({
    title: `${county.name} County Property Tax Calculator (FL)`,
    description: `Estimate property tax in ${county.name} County, Florida. Current millage rate ${county.millage}, homestead and Save Our Homes included.`,
    path: `/property-tax/${county.slug}`,
  });
}

export default async function CountyPropertyTaxPage({ params }: { params: Params }) {
  const { county: slug } = await params;
  const county = getCounty(slug);
  if (!county) notFound();

  const faqs = [
    {
      q: `What is the property tax rate in ${county.name} County?`,
      a: `${county.name} County's average total millage rate is approximately ${county.millage} mills, which equals $${county.millage.toFixed(2)} per $1,000 of taxable value. This blends county, school, and special district levies.`,
    },
    {
      q: "How does the Florida homestead exemption work?",
      a: `Florida homeowners using the property as their primary residence can claim a $25,000 exemption that applies to all taxes, plus an additional $25,000 for non-school taxes on values between $50,000 and $75,000 — up to $50,000 total in this calculator.`,
    },
    {
      q: "What is Save Our Homes?",
      a: "Once homestead is established, the assessed value can rise no more than 3% per year (or CPI, whichever is less). The difference between market and assessed value is the SOH benefit, which is portable to a new homestead within 3 years.",
    },
    {
      q: `When are property taxes due in ${county.name} County?`,
      a: "Florida property tax bills are mailed November 1 each year. Discounts apply for early payment: 4% in November, 3% December, 2% January, 1% February. Taxes are delinquent April 1.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Property Tax", url: "/property-tax" },
            { name: county.name, url: `/property-tax/${county.slug}` },
          ]),
        }}
      />
      <ToolPageLayout
        title={`${county.name} County Property Tax Calculator`}
        subtitle={`Average millage: ${county.millage} mills. County seat: ${county.seat}.`}
        belowTool={
          <div className="space-y-10">
            {county.slug in (floodCountyData as Record<string, unknown>) && (
              <Link
                href={`/flood-zone/county/${county.slug}`}
                className="block rounded-xl border border-deep/15 bg-white px-5 py-4 hover:border-coral hover:bg-coral/5 transition"
              >
                <span className="text-xs uppercase tracking-widest text-deep/50">
                  Related tool
                </span>
                <span className="block mt-1 font-medium text-deep">
                  Flood zones in {county.name} County →
                </span>
                <span className="block text-sm text-deep/60 mt-1">
                  FEMA flood-zone lookup, hurricane history, and storm-surge
                  risk profile.
                </span>
              </Link>
            )}
            <LeadCTA
              variant={county.slug === "broward" ? "broward" : "statewide"}
              context={`Considering buying or selling in ${county.name} County? Talk to a local FL agent.`}
            />
            <FAQ items={faqs} />
          </div>
        }
      >
        <PropertyTaxTool county={county} />
      </ToolPageLayout>
    </>
  );
}
