"use client";

import { useState } from "react";
import type { FloodZoneResult } from "@/lib/fema";

export default function FloodZoneTool() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FloodZoneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/flood-zone?address=${encodeURIComponent(address)}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="123 Main St, Fort Lauderdale, FL"
          className="flex-1 rounded-full border border-deep/20 px-5 py-3 focus:outline-none focus:border-coral"
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="rounded-full bg-deep text-sand px-6 py-3 font-medium hover:bg-coral transition disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check zone"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {result && <ResultPanel result={result} />}
    </div>
  );
}

function ResultPanel({ result }: { result: FloodZoneResult }) {
  const high = result.insuranceRequired;
  return (
    <div className="mt-6 space-y-4">
      <div
        className={`rounded-xl p-5 ${
          high ? "bg-coral/10 border border-coral" : "bg-ocean/10 border border-ocean"
        }`}
      >
        <div className="text-xs uppercase tracking-widest text-deep/60">
          FEMA Zone
        </div>
        <div className="mt-1 font-display text-4xl text-deep">
          {result.zone || "—"}
        </div>
        <div className="mt-3 text-deep/80">{result.description}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Fact label="Insurance required" value={high ? "Yes" : "No"} />
        <Fact label="Base Flood Elevation" value={result.bfe ? `${result.bfe} ft` : "—"} />
        <Fact label="FIRM Panel" value={result.panel || "—"} />
        <Fact label="Effective" value={result.panelDate || "—"} />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-deep/10 p-3">
      <div className="text-xs text-deep/50">{label}</div>
      <div className="mt-0.5 font-medium text-deep">{value}</div>
    </div>
  );
}
