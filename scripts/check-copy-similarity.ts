/**
 * Cheap n-gram similarity check across county copy paragraphs.
 * Flags pairs sharing too many 5-word shingles — a sign of templated/duplicate prose.
 *
 *   npx tsx scripts/check-copy-similarity.ts
 *
 * No deps. Jaccard over 5-word shingles. Threshold 0.35 = "look at these by hand."
 */

import fs from "node:fs";
import path from "node:path";

const COPY_PATH = path.join(process.cwd(), "src/data/flood-county-copy.json");
const SHINGLE_N = 5;
const THRESHOLD = 0.35;

if (!fs.existsSync(COPY_PATH)) {
  console.error(`Missing ${COPY_PATH}.`);
  process.exit(1);
}

const copy: Record<string, string> = JSON.parse(
  fs.readFileSync(COPY_PATH, "utf-8")
);

function shingles(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + SHINGLE_N <= tokens.length; i++) {
    out.add(tokens.slice(i, i + SHINGLE_N).join(" "));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

const slugs = Object.keys(copy);
const sets = new Map(slugs.map((s) => [s, shingles(copy[s])]));

const flagged: { a: string; b: string; sim: number }[] = [];
for (let i = 0; i < slugs.length; i++) {
  for (let j = i + 1; j < slugs.length; j++) {
    const sim = jaccard(sets.get(slugs[i])!, sets.get(slugs[j])!);
    if (sim >= THRESHOLD) flagged.push({ a: slugs[i], b: slugs[j], sim });
  }
}

flagged.sort((x, y) => y.sim - x.sim);
console.log(`${slugs.length} paragraphs. ${flagged.length} pairs above ${THRESHOLD}.\n`);
for (const f of flagged) {
  console.log(`  ${f.sim.toFixed(2)}  ${f.a}  ↔  ${f.b}`);
}

const lengths = slugs.map((s) => copy[s].length).sort((a, b) => a - b);
const min = lengths[0];
const max = lengths[lengths.length - 1];
const median = lengths[Math.floor(lengths.length / 2)];
console.log(`\nlengths (chars): min=${min} median=${median} max=${max}`);

if (flagged.length > 5) {
  console.log("\n>5 pairs flagged — consider raising temperature and re-running offenders.");
  process.exit(0);
}
