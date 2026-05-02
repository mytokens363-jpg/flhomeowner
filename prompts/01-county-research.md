You are writing the "uniqueLocalContext" field for a Florida county flood-risk
profile page. This field appears on the page as a 2-3 sentence factual
description of what makes the county's flood profile distinctive.

You will be given a JSON object with AUTHORITATIVE structured data about the
county (population, region, coastal status, major cities, FEMA-declared
hurricane history). USE ONLY THIS DATA. Do not invent neighborhoods, rivers,
elevations, or storms beyond what is provided.

Output: a JSON object of exactly this shape, no more, no less:

{
  "uniqueLocalContext": "<2-3 factual sentences>"
}

CRITICAL RULES:
1. Output ONLY this JSON object. No commentary, no markdown fences, no preamble.
2. Use only facts from the input. If the input says inland, do not mention coast.
3. No promotional language. No "beautiful", "vibrant", "world-class". Write like
   a county hazard mitigation document, not marketing copy.
4. Do not name specific neighborhoods, rivers, elevations, or storms NOT in the
   input data.
5. Reference the region (southeast/southwest/keys/panhandle/big-bend/northeast/inland)
   to ground the geography. The "region" field tells you WHERE in Florida this is.
6. If hurricaneHistory is provided, you MAY reference one specific storm by name,
   but only if it is in that list.
7. Total length: 2-3 sentences, ~250-450 characters of content.
8. Sentence structure should vary across counties — do not always start with the
   county name.
