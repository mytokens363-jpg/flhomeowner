import Link from "next/link";
import { Metadata } from "next";
import { FL_COUNTIES } from "@/data/counties";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Florida Property Tax Calculator — All 67 Counties",
  description:
    "Estimate your Florida property tax by county. Real millage rates, homestead exemption, Save Our Homes cap. Pick your county to start.",
  path: "/property-tax",
});

export default function PropertyTaxIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-10">
        <h1 className="font-display text-5xl text-deep">
          Florida Property Tax Calculator
        </h1>
        <p className="mt-4 text-lg text-deep/70 max-w-2xl">
          67 counties, real millage rates, homestead and Save Our Homes built
          in. Pick your county.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {FL_COUNTIES.map((c) => (
          <Link
            key={c.slug}
            href={`/property-tax/${c.slug}`}
            className="rounded-lg border border-deep/10 bg-white p-4 hover:border-coral hover:shadow transition"
          >
            <div className="font-medium text-deep">{c.name} County</div>
            <div className="text-xs text-deep/50">
              {c.seat} · {c.millage} mills
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
