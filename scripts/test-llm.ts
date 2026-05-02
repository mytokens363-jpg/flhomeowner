/**
 * 30-second sanity check for the Rivet3 llama.cpp endpoint.
 * Verifies: endpoint reachable, model responds, content parses as JSON.
 *
 *   LLM_MODEL=... LLM_ENDPOINT=... npx tsx scripts/test-llm.ts
 */

const ENDPOINT =
  process.env.LLM_ENDPOINT ?? "http://10.0.0.21:8000/v1/chat/completions";
const MODEL =
  process.env.LLM_MODEL ??
  "/home/rivet3/models/Qwen3.5-122B-A10B-IQ4_KSS.gguf";

async function main() {
  console.log(`endpoint: ${ENDPOINT}`);
  console.log(`model:    ${MODEL}\n`);

  const t0 = Date.now();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Output only a single JSON object. No commentary, no fences." },
        { role: "user", content: 'Reply with exactly: {"ok": true, "model_says": "hello"}' },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  console.log(`HTTP ${res.status} ${res.statusText} in ${Date.now() - t0}ms`);
  if (!res.ok) {
    console.error("body:", await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const msg = data?.choices?.[0]?.message;
  const content = msg?.content;
  const reasoning = msg?.reasoning_content;
  const tokens = data?.usage?.completion_tokens;
  console.log(`completion_tokens: ${tokens}`);
  console.log(`reasoning_chars: ${(reasoning ?? "").length}`);
  console.log(`content: ${JSON.stringify(content)}\n`);

  if (typeof content !== "string") {
    console.error("FAIL: no string content in response");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const cleaned = content.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) {
    console.error("FAIL: no JSON object in content");
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(first, last + 1));
  } catch (e) {
    console.error("FAIL: content is not parseable JSON:", e);
    process.exit(1);
  }
  console.log("parsed JSON:", parsed);
  console.log("\nOK — endpoint and model are working.");
}

main().catch((e) => {
  console.error("FAIL:", e);
  process.exit(1);
});
