/**
 * Fill the uniqueLocalContext field on each county profile by calling the LLM.
 * The structured data is already authoritative — this only generates the
 * 2-3 sentence summary tying the facts together.
 *
 *   npx tsx scripts/enrich-counties.ts
 *
 *   COUNTIES=broward,lee  npx tsx scripts/enrich-counties.ts   # subset
 *   FORCE=1               npx tsx scripts/enrich-counties.ts   # rewrite all
 */

import fs from "node:fs";
import path from "node:path";

const ENDPOINT =
  process.env.LLM_ENDPOINT ?? "http://10.0.0.21:8000/v1/chat/completions";
const MODEL =
  process.env.LLM_MODEL ??
  "/home/rivet3/models/Qwen3.5-122B-A10B-IQ4_KSS.gguf";

const ROOT = process.cwd();
const PROMPT_PATH = path.join(ROOT, "prompts/01-county-research.md");
const DATA_PATH = path.join(ROOT, "src/data/flood-county-data.json");

if (!fs.existsSync(DATA_PATH)) {
  console.error(`Run build-county-data.ts first — ${DATA_PATH} missing.`);
  process.exit(1);
}

const SYSTEM = fs.readFileSync(PROMPT_PATH, "utf-8");
const profiles: Record<string, Record<string, unknown>> = JSON.parse(
  fs.readFileSync(DATA_PATH, "utf-8")
);

const onlySlugs = process.env.COUNTIES?.split(",").map((s) => s.trim()).filter(Boolean);
const force = process.env.FORCE === "1";

function extractJson(content: string): unknown {
  const cleaned = content.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("no JSON in content");
  return JSON.parse(cleaned.slice(first, last + 1));
}

async function generateContext(profile: object): Promise<string> {
  const inputCopy = { ...(profile as Record<string, unknown>) };
  delete inputCopy.uniqueLocalContext;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(inputCopy, null, 2) },
      ],
      temperature: 0.4,
      max_tokens: 6000,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error(`no content: ${JSON.stringify(data).slice(0, 200)}`);
  }
  const parsed = extractJson(content) as { uniqueLocalContext?: unknown };
  if (typeof parsed.uniqueLocalContext !== "string" || parsed.uniqueLocalContext.length < 50) {
    throw new Error(`bad uniqueLocalContext: ${JSON.stringify(parsed).slice(0, 200)}`);
  }
  return parsed.uniqueLocalContext.trim();
}

async function main() {
  const slugs = onlySlugs?.length
    ? Object.keys(profiles).filter((s) => onlySlugs.includes(s))
    : Object.keys(profiles);
  const todo = slugs.filter((s) => force || !profiles[s].uniqueLocalContext);

  console.log(`${todo.length}/${slugs.length} counties need uniqueLocalContext`);
  if (!todo.length) return;

  let done = 0;
  let failed = 0;
  for (const slug of todo) {
    const t0 = Date.now();
    process.stdout.write(`[${done + failed + 1}/${todo.length}] ${slug}... `);
    try {
      const ctx = await generateContext(profiles[slug]);
      profiles[slug].uniqueLocalContext = ctx;
      fs.writeFileSync(DATA_PATH, JSON.stringify(profiles, null, 2));
      done++;
      console.log(`OK ${ctx.length}c (${Date.now() - t0}ms)`);
    } catch (err) {
      failed++;
      console.log(`FAIL: ${(err as Error).message.slice(0, 120)}`);
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`\nDone. ${done}/${todo.length} succeeded, ${failed} failed.`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
