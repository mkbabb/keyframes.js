/**
 * lib/agent-surface — the K.W12 ED-1 agent-surface SOURCE OF TRUTH.
 *
 * The ONE place the agent index is derived from the published surface. The
 * generator (`gen-agent-surface.mjs`) EMITS the artifacts from here, so the
 * agent surface cannot drift from the `docs/published-surface.md` manifest.
 *
 * THE INVARIANT: every export the index LINKS is a real published export
 * (∈ the manifest roster), and every cited check is a focused Vitest file or
 * the package-boundary command. The curated index is a sub-selection of the
 * FULL roster — the 13 headline
 * primitives — but the FULL export roster (the llms-full.txt tail) names EVERY
 * published export, so the union of the two artifacts covers the surface.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
);

const MANIFEST = path.join(REPO, "docs/published-surface.md");
const README_URL =
    "https://github.com/mkbabb/keyframes.js/blob/master/README.md";

/**
 * The published-export roster — every backticked export-name row in
 * `docs/published-surface.md`, with its tier (LIGHT/HEAVY). This is the SAME
 * roster the publish-boundary suite machine-checks against the barrel, so the
 * agent index is anchored to the verified surface.
 */
export function parseManifestRoster() {
    const text = fs.readFileSync(MANIFEST, "utf8");
    const rows = [];
    for (const line of text.split("\n")) {
        // | `Export` | TIER | … |  — the first two cells.
        const m = line.match(
            /^\|\s*`([A-Za-z_$][\w$]*)`\s*\|\s*(LIGHT|HEAVY)\s*\|/,
        );
        if (m) rows.push({ name: m[1], tier: m[2] });
    }
    // De-dup (a name appears once); preserve first-seen order.
    const seen = new Set();
    return rows.filter((r) => (seen.has(r.name) ? false : seen.add(r.name)));
}

/**
 * THE CURATED INDEX — the 13 headline primitives the agent reads first. Each
 * row: the primitive name, a one-line intent, the published EXPORTS it links
 * (every one ∈ the manifest roster — gate-asserted), the README anchor, and the
 * focused check that verifies it. This is a
 * curated SELECTION; the full roster (llms-full.txt) names every export.
 *
 * The "ONLY kf does this" axes are flagged: [axis-1] round-trippable CSS,
 * [axis-2] perceptual color, [axis-3] the static/dynamic boundary.
 */
export const CURATED = [
    {
        name: "CSSKeyframesAnimation",
        intent:
            "parse author CSS @keyframes → animate any element/object; the round-trippable source-of-truth axis [axis-1]",
        exports: ["CSSKeyframesAnimation", "loadAnimationEngine"],
        anchor: "csskeyframesanimation",
        check: "test/compile/roundtrip-fidelity.test.ts",
    },
    {
        name: "AnimationGroup",
        intent:
            "composite many animations with replace/add/weighted layer blending (spatial composition)",
        exports: ["AnimationGroup", "defaultLayerConfig"],
        anchor: "animationgroup",
        check: "test/group/blend.test.ts",
    },
    {
        name: "Sequence",
        intent:
            "master-playhead temporal orchestration beside AnimationGroup's spatial blend",
        exports: ["Sequence"],
        anchor: "sequence",
        check: "test/orchestration/sequence.test.ts",
    },
    {
        name: "compileToCSS",
        intent:
            "the round-trip's BACKWARD half: an orchestration graph → a pure zero-runtime CSS artifact (the parser run backward; GSAP/Motion cannot do this) [axis-1]",
        exports: ["compileToCSS"],
        anchor: "the-dynamic-engine--loadanimationengine",
        check: "test/compile/compile-roundtrip.test.ts",
    },
    {
        name: "fromStyleSheets",
        intent:
            "INGEST: read the live web's own CSS @keyframes back into kf animations (CSSOM → CSSKeyframesAnimation), CORS-skip diagnostics never a silent drop [axis-1]",
        exports: ["fromStyleSheets", "fromLiveAnimations", "adoptRunning"],
        anchor: "the-dynamic-engine--loadanimationengine",
        check: "test/ingest/ingest.test.ts",
    },
    {
        name: "ScrollScene",
        intent:
            "scroll-driven animation as CSS: parse animation-timeline/-range, drive on the compositor where eligible and shipped physics where not, serialize back to valid CSS [axis-1]",
        exports: ["ScrollScene", "createScrollScene", "roundTripScrollCSS"],
        anchor: "timeline",
        check: "test/scroll/scroll-scene.test.ts",
    },
    {
        name: "SpringProgress",
        intent:
            "closed-form spring physics tracker; reseatToSpring for velocity-continuous interruption; the linear() twin is round-trippable",
        exports: ["SpringProgress", "reseatToSpring", "probeVelocity"],
        anchor: "springprogress",
        check: "test/group/spring-blend-weight.test.ts",
    },
    {
        name: "springTimingFunction",
        intent:
            "spring physics → a typed Easing ({ fn, css }) / a CSS linear() stops string — a spring you can hand to native CSS [axis-1]",
        exports: ["springTimingFunction", "springLinearStops"],
        anchor: "springlinearstops--springtimingfunction",
        check: "test/compile/roundtrip-easing.test.ts",
    },
    {
        name: "stagger",
        intent:
            "pure construction-time per-index delay distribution (materializes into the compiled CSS)",
        exports: ["stagger"],
        anchor: "stagger",
        check: "test/orchestration/stagger.test.ts",
    },
    {
        name: "Timeline",
        intent:
            "progress driver (sample → clamp → easing → boundary-snap → smoothing); ScrollTimeline/ManualTimeline/createNativeTimeline variants — the caller owns the loop",
        exports: [
            "Timeline",
            "ManualTimeline",
            "createNativeTimeline",
        ],
        anchor: "timeline",
        check: "test/physics/sync-step.test.ts",
    },
    {
        name: "NumericAnimation",
        intent:
            "zero-alloc keyframe interpolation over { key: number } objects — animate any plain object, no DOM",
        exports: ["NumericAnimation"],
        anchor: "numericanimation",
        check: "test/engine/zero-alloc.test.ts",
    },
    {
        name: "loadAnimationEngine",
        intent:
            "the one gateway to the HEAVY tier: an awaited dynamic import that carries the CSS parser + value.js; light-only consumers never pay it [axis-3]",
        exports: ["loadAnimationEngine"],
        anchor: "the-dynamic-engine--loadanimationengine",
        check: "npm run proof:publish",
    },
];

/** The canonical round-trip recipe — kf's axis-1, the thing only kf does. */
export const ROUNDTRIP_RECIPE = `// THE ROUND-TRIP (kf's unique axis: author CSS is the source format).
// PARSE  author CSS @keyframes  → an animation object
// ANIMATE that object over any element / plain object / scroll
// SERIALIZE it BACK to valid CSS (the parser run backward — compileToCSS)
//
// The agent's INPUT format IS the library's SOURCE format: every other
// library makes the agent TRANSLATE CSS into a bespoke tween syntax; kf
// does not. This is why kf has an agent surface no competitor can write.

import { loadAnimationEngine } from "@mkbabb/keyframes.js";

// ONE await loads the CSS engine (and value.js with it); cached thereafter.
const { CSSKeyframesAnimation, compileToCSS } = await loadAnimationEngine();

// PARSE — feed it the SAME CSS @keyframes a stylesheet would carry:
const anim = new CSSKeyframesAnimation({ duration: 2000 }).fromString(\`
    @keyframes slide {
        from { transform: translateX(-100%); background-color: #C462D8; }
        100% { transform: translateX(50%);   background-color: #E85252; }
    }
\`);

// ANIMATE — colors interpolate in perceptual oklab by default [axis-2]:
anim.setTargets(document.getElementById("box"));
anim.play();

// SERIALIZE — back to a pure, zero-runtime CSS artifact (the backward half):
const { css, eligible, refusals } = compileToCSS(anim);
// \`css\` is a @keyframes block + animation shorthand; \`refusals\` names what
// cannot round-trip faithfully (never a silent approximation).`;

// ──────────────────────────────────────────────────────────────────────────────
// The artifact builders.
// ──────────────────────────────────────────────────────────────────────────────

function tierOf(roster, name) {
    return roster.find((r) => r.name === name)?.tier ?? "?";
}

/**
 * The L.W6 agent-authoring LOOP teaching — emitted IFF `validate` AND `explain`
 * are present in the published-surface manifest roster. The
 * section teaches the validate→fix→compile LOOP as a STRUCTURED code block an LLM
 * follows, not a narrative. Generated (never hand-maintained), so it cannot drift
 * from the actual exports.
 *
 * Returns the section lines (heading + body), or `[]` when the verb is absent.
 */
export function buildAgentLoopSection(roster) {
    const names = new Set(roster.map((r) => r.name));
    if (!names.has("validate") || !names.has("explain")) return [];
    return [
        "## Agent authoring loop",
        "",
        "kf validates + compiles; the LLM generates and fixes. The forward",
        "direction of the moat — the first question to ask before suggesting kf:",
        '"will this `@keyframes` block ship faithfully?" `validate(css)` answers',
        "it as one flat envelope (no message-scraping); `explain(css)` formats the",
        "SAME verdict human/LLM-readable. Both ride `loadAnimationEngine()` (HEAVY).",
        "",
        "```ts",
        "const { validate, explain } = await loadAnimationEngine();",
        "",
        "const result = await validate(css);",
        "if (!result.parseable) {",
        "    // fix parse errors — inspect result.diagnostics (stable .code, never scrape)",
        "}",
        "if (!result.eligible) {",
        "    // inspect result.refusals (named reason per child); offer JS playback",
        "}",
        "if (!result.waapi.eligible) {",
        "    // note result.waapi.reason; the animation runs on rAF, still correct",
        "}",
        "// if result.eligible: offer the compileToCSS output (zero-runtime CSS)",
        "",
        "// explain(css) returns the same verdict as deterministic human-readable text:",
        "console.log(await explain(css));",
        "```",
        "",
        "check: `test/compile/agent-validate.test.ts`",
        "",
    ];
}

/** /llms.txt — the curated INDEX (the 13 primitives, one line each). */
export function buildLlmsTxt() {
    const roster = parseManifestRoster();
    const L = [];
    L.push("# keyframes.js — the agent index (llms.txt)");
    L.push("");
    L.push(
        "> CSS keyframe animations for anything in JavaScript. Parse author",
    );
    L.push(
        "> `@keyframes`, animate any object or DOM element, and round-trip it",
    );
    L.push(
        "> BACK to CSS. Every capability below is backed by a focused test or",
    );
    L.push(
        "> package check. This index is GENERATED from the machine-checked",
    );
    L.push(
        "> published surface (`docs/published-surface.md`) and cannot drift",
    );
    L.push("> from it.");
    L.push("");
    L.push(
        "The three axes only kf has: [axis-1] author CSS is the source format",
    );
    L.push(
        "(round-trippable — parse AND serialize); [axis-2] perceptual color",
    );
    L.push(
        "(oklab lerp, ΔE-conformant — see the color-fidelity harness); [axis-3]",
    );
    L.push(
        "a static/dynamic boundary (a value.js-free LIGHT tier + a `loadAnimationEngine()`",
    );
    L.push("HEAVY tier).");
    L.push("");
    L.push(`Install: \`npm i @mkbabb/keyframes.js\` · README: ${README_URL}`);
    L.push("");
    L.push("## Primitives (each backed by a runnable check)");
    L.push("");
    for (const p of CURATED) {
        const tiers = [...new Set(p.exports.map((e) => tierOf(roster, e)))];
        const tier = tiers.length === 1 ? tiers[0] : tiers.join("+");
        L.push(`### ${p.name}  (${tier})`);
        L.push(`- intent: ${p.intent}`);
        L.push(
            `- exports: ${p.exports.map((e) => `\`${e}\``).join(", ")}`,
        );
        L.push(`- docs: ${README_URL}#${p.anchor}`);
        L.push(`- check: \`${p.check}\``);
        L.push("");
    }
    // L.W6 — the agent-authoring LOOP teaching (emitted IFF validate+explain are
    // in the manifest).
    for (const line of buildAgentLoopSection(roster)) L.push(line);
    L.push("## The full export roster + the round-trip recipe");
    L.push("");
    L.push(
        "See `/llms-full.txt` for the inline round-trip recipe (parse → animate",
    );
    L.push(
        "→ serialize) and the COMPLETE export roster (every LIGHT + HEAVY",
    );
    L.push("export, the surface a `npm i` consumer reaches).");
    L.push("");
    return L.join("\n");
}

/** /llms-full.txt — the round-trip recipe inline + the full export roster. */
export function buildLlmsFullTxt() {
    const roster = parseManifestRoster();
    const light = roster.filter((r) => r.tier === "LIGHT");
    const heavy = roster.filter((r) => r.tier === "HEAVY");
    const L = [];
    L.push("# keyframes.js — the agent surface, full (llms-full.txt)");
    L.push("");
    L.push(
        "Generated from `docs/published-surface.md` (the machine-checked",
    );
    L.push(
        "published-export manifest) with focused test references. The index",
    );
    L.push(
        "can never advertise an export the",
    );
    L.push("surface does not publish.");
    L.push("");
    L.push(`README: ${README_URL}`);
    L.push("");
    L.push("## The round-trip recipe (kf's unique axis-1)");
    L.push("");
    L.push("```ts");
    L.push(ROUNDTRIP_RECIPE);
    L.push("```");
    L.push("");
    L.push("## The curated primitive index");
    L.push("");
    for (const p of CURATED) {
        L.push(`- **${p.name}** — ${p.intent}`);
        L.push(
            `  - exports: ${p.exports.map((e) => `\`${e}\``).join(", ")} · check: \`${p.check}\` · docs: ${README_URL}#${p.anchor}`,
        );
    }
    L.push("");
    // L.W6 — the agent-authoring LOOP teaching (emitted IFF validate+explain are
    // in the manifest), inline in the full surface as well as the curated index.
    for (const line of buildAgentLoopSection(roster)) L.push(line);
    L.push("## The full export roster (the npm-i surface)");
    L.push("");
    L.push(
        "### LIGHT — the static barrel (value.js-free, tree-shakeable)",
    );
    L.push("");
    L.push('`import { … } from "@mkbabb/keyframes.js"`');
    L.push("");
    for (const r of light) L.push(`- \`${r.name}\``);
    L.push("");
    L.push(
        "### HEAVY — reached only through `await loadAnimationEngine()` [axis-3]",
    );
    L.push("");
    L.push("`const engine = await loadAnimationEngine()`");
    L.push("");
    for (const r of heavy) L.push(`- \`${r.name}\``);
    L.push("");
    L.push(
        `Total published value exports: ${roster.length} (${light.length} LIGHT + ${heavy.length} HEAVY).`,
    );
    L.push("");
    L.push("## Verification");
    L.push("");
    L.push(
        "The public surface is exercised by the test and package-boundary suites and",
    );
    L.push(
        "is itself a public artifact. Verify the current tree with",
    );
    L.push(
        "`npm test -- --run && npm run proof:publish`. Each retained check is a capability",
    );
    L.push(
        'claim — not "the library claims X" but "the library verifies X, here',
    );
    L.push('is the gate, here is the runnable snippet CI executes".');
    L.push("");
    return L.join("\n");
}
