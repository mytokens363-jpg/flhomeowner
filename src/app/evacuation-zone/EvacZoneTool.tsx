"use client";

import { useState } from "react";
import { FL_COUNTIES } from "@/data/counties";

type Result = {
  zone: string | null;
  county: string;
  publicMap: string;
  matchedAddress?: string;
  fallback?: boolean;
};

export default function EvacZoneTool() {
  const [address, setAddress] = useState("");
  const [countySlug, setCountySlug] = useState("broward");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({ address, county: countySlug });
      const res = await fetch(`/api/evacuation-zone?${params}`);
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="Address"
          className="rounded-full border border-deep/20 px-5 py-3 focus:outline-none focus:border-coral"
        />
        <select
          value={countySlug}
          onChange={(e) => setCountySlug(e.target.value)}
          className="rounded-full border border-deep/20 px-4 py-3 bg-white"
        >
          {FL_COUNTIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={lookup}
          disabled={loading}
          className="rounded-full bg-deep text-sand px-6 py-3 font-medium hover:bg-coral transition disabled:opacity-50"
        >
          {loading ? "Checking…" : "Find zone"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {result && <ResultPanel r={result} />}
    </div>
  );
}

function ResultPanel({ r }: { r: Result }) {
  if (r.fallback) {
    return (
      <div className="mt-6 rounded-xl bg-sand border border-deep/10 p-5">
        <div className="text-sm text-deep/70">
          Live lookup isn&apos;t available for {r.county} County yet. Use the
          official county map below.
        </div>
        <a
          href={r.publicMap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-full bg-coral text-white px-5 py-2 text-sm"
        >
          Open {r.county} official map →
        </a>
      </div>
    );
  }

  const isInZone = !!r.zone;
  return (
    <div
      className={`mt-6 rounded-xl p-5 ${
        isInZone
          ? "bg-coral/10 border border-coral"
          : "bg-ocean/10 border border-ocean"
      }`}
    >
      <div className="text-xs uppercase tracking-widest text-deep/60">
        Evacuation Zone — {r.county}
      </div>
      <div className="mt-1 font-display text-5xl text-deep">
        {r.zone ?? "Outside zones"}
      </div>
      <p className="mt-3 text-deep/80 text-sm">
        {isInZone
          ? `Your address is in Zone ${r.zone}. When officials order evacuation for Zone ${r.zone}, leave promptly. Save the route now — bridges, highways, and shelters fill fast.`
          : "Your address is outside the surge-evacuation zones. You may still need to leave for a manufactured home or substandard structure."}
      </p>
      {r.publicMap && (
        <a
          href={r.publicMap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm underline text-deep"
        >
          See official county map
        </a>
      )}
    </div>
  );
}
