"use client";

import { useState, useMemo } from "react";
import type { County } from "@/data/counties";

export default function PropertyTaxTool({ county }: { county: County }) {
  const [marketValue, setMarketValue] = useState(450000);
  const [homestead, setHomestead] = useState(true);
  const [yearsOwned, setYearsOwned] = useState(0);
  const [annualGrowth, setAnnualGrowth] = useState(5); // % market appreciation

  const calc = useMemo(() => {
    // Approximate assessed value if homesteaded for `yearsOwned` years.
    // Market grows at `annualGrowth`, assessed capped at 3%/yr (Save Our Homes).
    const market = marketValue;
    let assessed = market;
    if (homestead && yearsOwned > 0) {
      // Back-calc: today's market = original × (1+g)^n  →  original = market / (1+g)^n
      const original = market / Math.pow(1 + annualGrowth / 100, yearsOwned);
      assessed = Math.min(market, original * Math.pow(1.03, yearsOwned));
    }

    const exemption = homestead ? county.homestead : 0;
    const taxable = Math.max(0, assessed - exemption);
    const annualTax = (taxable * county.millage) / 1000;
    const sohSavings = market - assessed;

    return { assessed, taxable, annualTax, sohSavings };
  }, [marketValue, homestead, yearsOwned, annualGrowth, county]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <Field label="Market value">
          <NumInput
            value={marketValue}
            onChange={setMarketValue}
            prefix="$"
            step={5000}
          />
        </Field>

        <Field label="Primary residence (homestead)">
          <Toggle value={homestead} onChange={setHomestead} />
        </Field>

        {homestead && (
          <>
            <Field label={`Years owned: ${yearsOwned}`}>
              <input
                type="range"
                min={0}
                max={20}
                value={yearsOwned}
                onChange={(e) => setYearsOwned(+e.target.value)}
                className="w-full accent-coral"
              />
            </Field>
            <Field label={`Avg market appreciation: ${annualGrowth}%/yr`}>
              <input
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={annualGrowth}
                onChange={(e) => setAnnualGrowth(+e.target.value)}
                className="w-full accent-coral"
              />
            </Field>
          </>
        )}
      </div>

      <div className="rounded-xl bg-deep text-sand p-6">
        <div className="text-xs uppercase tracking-widest text-sand/60">
          Estimated annual tax
        </div>
        <div className="mt-2 font-display text-5xl">
          ${Math.round(calc.annualTax).toLocaleString()}
        </div>
        <div className="text-sand/60 text-sm mt-1">
          ≈ ${Math.round(calc.annualTax / 12).toLocaleString()}/mo
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <Row label="Assessed value" value={calc.assessed} />
          <Row label="Taxable value" value={calc.taxable} />
          {calc.sohSavings > 0 && (
            <Row
              label="Save Our Homes savings"
              value={calc.sohSavings}
              accent
            />
          )}
        </div>

        <p className="mt-6 text-xs text-sand/50">
          Estimate using {county.millage} mills (county avg). Actual rate varies
          by city and special districts. Verify with the {county.name} County
          Property Appraiser.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function NumInput({
  value,
  onChange,
  prefix,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  step?: number;
}) {
  return (
    <div className="flex items-center rounded-lg border border-deep/20 px-3 py-2 focus-within:border-coral">
      {prefix && <span className="text-deep/50 mr-1">{prefix}</span>}
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1 bg-transparent focus:outline-none"
      />
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-7 w-12 rounded-full transition ${
        value ? "bg-coral" : "bg-deep/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
          value ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-sand/10 pb-1">
      <span className="text-sand/70">{label}</span>
      <span className={accent ? "text-coral font-medium" : ""}>
        ${Math.round(value).toLocaleString()}
      </span>
    </div>
  );
}
