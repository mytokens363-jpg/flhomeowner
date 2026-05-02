/**
 * Phase 5 — generate the unique 150-250 word "local context" paragraph per county
 * using the validated structured data as input. Higher temperature for prose variety.
 * Resumable: skips counties already in output.
 *
 *   npx tsx scripts/write-county-copy.ts
 */

import fs from "node:fs";
import path from "node:path";

const ENDPOINT =
  process.env.LLM_ENDPOINT ?? "http://10.0.0.21:8000/v1/chat/completions";
const MODEL =
  process.env.LLM_MODEL ??
  "/home/rivet3/models/Qwen3.5-122B-A10B-IQ4_KSS.gguf";

const ROOT = process.cwd();
const PROMPT_PATH = path.join(ROOT, "prompts/02-county-copy.md");
const DATA_PATH = path.join(ROOT, "src/data/flood-county-data.json");
const OUT_PATH = path.join(ROOT, "src/data/flood-county-copy.json");

const SYSTEM = fs.readFileSync(PROMPT_PATH, "utf-8");

if (!fs.existsSync(DATA_PATH)) {
  console.error(`Missing ${DATA_PATH}. Run enrich-counties.ts first.`);
  process.exit(1);
}
const allData: Record<string, Record<string, unknown>> = JSON.parse(
  fs.readFileSync(DATA_PATH, "utf-8")
);

function cleanProse(s: string): string {
  return s
    .trim()
    .replace(/^```(?:text|markdown)?\s*|\s*```$/g, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

async function writeCopy(county: object): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(county, null, 2) },
      ],
      temperature: 0.75,
      max_tokens: 2500,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error(`no content: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return cleanProse(content);
}

async function main() {
  const existing: Record<string, string> = fs.existsSync(OUT_PATH)
    ? JSON.parse(fs.readFileSync(OUT_PATH, "utf-8"))
    : {};

  const slugs = Object.keys(allData).filter((s) => !("error" in (allData[s] ?? {})));
  let done = 0;
  let failed = 0;

  for (const slug of slugs) {
    if (existing[slug]) {
      done++;
      continue;
    }
    const t0 = Date.now();
    process.stdout.write(`[${done + failed + 1}/${slugs.length}] ${slug}... `);
    try {
      const para = await writeCopy(allData[slug]);
      existing[slug] = para;
      fs.writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2));
      done++;
      console.log(`OK ${para.length}c (${Date.now() - t0}ms)`);
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAIL: ${msg.slice(0, 120)}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. ${done}/${slugs.length} written, ${failed} failed. → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
