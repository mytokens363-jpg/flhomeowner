type QA = { q: string; a: string };

export default function FAQ({ items }: { items: QA[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-display text-2xl text-deep mb-4">FAQ</h2>
      <div className="divide-y divide-deep/10">
        {items.map((it) => (
          <details key={it.q} className="py-4 group">
            <summary className="cursor-pointer font-medium text-deep marker:text-coral">
              {it.q}
            </summary>
            <p className="mt-2 text-deep/70 text-sm leading-relaxed">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
