import Link from "next/link";

const tools = [
  {
    href: "/flood-zone",
    title: "Flood Zone Lookup",
    blurb: "Check if any Florida address is in a FEMA flood zone. Live data from the National Flood Hazard Layer.",
    tag: "FEMA",
  },
  {
    href: "/property-tax",
    title: "Property Tax Calculator",
    blurb: "Estimate annual property tax for any Florida county. Real millage rates, homestead, Save Our Homes.",
    tag: "67 counties",
  },
  {
    href: "/evacuation-zone",
    title: "Hurricane Evacuation Zone",
    blurb: "Find your evac zone before the next storm. Per-county data direct from FL emergency management.",
    tag: "Storm-ready",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="mb-16">
        <h1 className="font-display text-5xl md:text-6xl text-deep leading-tight">
          Florida property questions,<br />
          <span className="text-coral">answered in seconds.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-deep/80">
          Free tools for Florida homeowners and buyers. No signup, no fluff,
          just the answer you came for.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group block rounded-2xl border border-deep/10 bg-white p-6 hover:border-coral hover:shadow-lg transition"
          >
            <div className="text-xs uppercase tracking-widest text-coral mb-3">
              {t.tag}
            </div>
            <h2 className="font-display text-2xl text-deep group-hover:text-coral transition">
              {t.title}
            </h2>
            <p className="mt-3 text-sm text-deep/70">{t.blurb}</p>
            <div className="mt-6 text-sm text-deep group-hover:text-coral">
              Open tool →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
