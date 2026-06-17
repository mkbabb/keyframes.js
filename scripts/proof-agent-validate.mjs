#!/usr/bin/env node
/**
 * proof:agent-validate — L.W6 THE AGENT-AUTHORING VERB (born-RED).
 *
 * The kf moat is bi-directional CSS: INGEST → ANIMATE → COMPILE. L.W6 adds the
 * VALIDATION layer over the compile surface — the first question an LLM agent
 * asks before it decides whether to suggest kf at all: "will this `@keyframes`
 * block ship faithfully?" The verb is a READ-ONLY projection over three already-
 * gate-proven typed channels (`ResolvedKeyframes.diagnostics` /
 * `CompiledCSS.{eligible,refusals}` / `WAAPIEligibility`) onto ONE agent-shaped
 * envelope (`ValidateResult`) the LLM can branch on without scraping a message.
 *
 * NO new engine code: `validate`/`explain` are a pure JOIN. The distinction
 * from the existing channels is ALTITUDE — a consumer today must call
 * `resolveKeyframes` + `compileToCSS` + `isWAAPIEligible` independently and
 * merge the results by hand; the verb does the join, validates parse-safety
 * before compiling, and returns a flat result.
 *
 * BOUNDARY: `validate.ts` is HEAVY (it imports adapter/compile/waapi — all
 * carry static `@mkbabb/value.js` edges). It is reached ONLY via
 * `loadAnimationEngine()`; the barrel re-exports only its erased TYPES
 * (`import type`). `proof:boundary` STAYS GREEN — this gate ASSERTS that
 * (clause (a) heavy-boundary), it does not relax it.
 *
 * ── THE born-RED witness (today's tree → GREEN path) ─────────────────────────
 * `src/animation/validate.ts` does NOT exist, `loadAnimationEngine().validate`
 * is `undefined`, and `gen-agent-surface.mjs` emits no LOOP section. So EVERY
 * clause below reds by construction today. Each greens only when its named cure
 * lands.
 *
 * CLAUSES (each BITES):
 *
 *   (a) verb-exists      — `src/animation/validate.ts` exists and EXPORTS
 *       `validate` + `explain`, both wired onto `loadAnimationEngine()`'s
 *       returned object in the barrel (the dynamic surface) AND only as erased
 *       TYPES on the LIGHT static barrel (heavy-boundary). The runtime presence
 *       on the dynamic surface is asserted by the behaviour half
 *       (`test/agent-validate.test.ts`); this clause asserts the wiring is
 *       SOURCE-present + boundary-clean. BITE: drop the export, or leak the
 *       runtime onto the LIGHT barrel → reds.
 *       RED-TODAY WITNESS: `validate.ts` absent → `loadAnimationEngine().validate
 *       === undefined`.
 *
 *   (b) loop-heading     — the on-disk `/llms.txt` carries a
 *       `## Agent authoring loop` heading. RED today: `gen-agent-surface.mjs`
 *       emits none (no `validate` row in the manifest). FIX: S1+S2 add the
 *       export rows; `node scripts/gen-agent-surface.mjs` emits the section.
 *       BITE: the LOOP section is removed from the generator or the index → reds.
 *
 *   (c) important-property-honest (BEHAVIOUR — rides the .test.ts) — `validate`
 *       over the `@property` + keyframe-`!important` fixture projects the
 *       SPEC-FAITHFUL post-cure verdict: `parseable:true` (the rest parses), the
 *       `@property` block is `eligible:true` and round-trips (L.W1 S2), and there
 *       is NO keyframe-`!important` drop-row in `diagnostics`. (L.W1 S1
 *       CORRECTION: keyframe `!important` is SPEC-INVALID per CSS Animations §3;
 *       value.js 0.13.0 DROPS the whole declaration at the AST level, mirroring
 *       the browser. kf does NOT honor/emit it — the gate asserts the spec-
 *       faithful reality, NOT that `!important` is honored.) The behaviour proof
 *       rides `vitest run test/agent-validate.test.ts`; this script asserts the
 *       test LOCKS the clause (the .test.ts imports `validate` + carries the
 *       @property/!important fixture asserts).
 *
 *   (d) multi-color-refusal (BEHAVIOUR — rides the .test.ts) — `validate` over a
 *       2-stop multi-color track (under a tight ΔE-ε) projects the L.W2 refusal:
 *       `eligible:false` + `refusals[0].reason === "perceptual-oklab"`. GREEN-able
 *       now (L.W2 CC-3.5 closed the silent densify). This script asserts the test
 *       LOCKS the clause.
 *
 *   (e) loop-not-stale   — the on-disk `/llms.txt`'s `## Agent authoring loop`
 *       section is BYTE-IDENTICAL to a fresh `buildLlmsTxt()` generation (the
 *       same no-drift mechanism `proof:agent-surface` (a.4) uses, scoped to the
 *       LOOP section). This is the (a.5) clause the L.W6 spec names for
 *       `proof:agent-surface`, authored here so `proof:agent-surface` /
 *       `gen-agent-surface.mjs` / `package.json` are untouched by the gate-author
 *       step. RED today: the section does not exist (no fresh-gen LOOP to match).
 *       BITE: hand-edit the LOOP away from the generator's output → reds.
 *
 * BUDGET 0 — the gate asserts POSITIVE product properties (the verb exists, the
 * LOOP teaches the loop, the projection is honest), not an error count.
 *
 * RUN: npm run proof:agent-validate
 *      (chains `node scripts/proof-agent-validate.mjs && vitest run test/agent-validate.test.ts`)
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildLlmsTxt } from "./lib/agent-surface.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:agent-validate — L.W6 THE AGENT-AUTHORING VERB (validate/explain · born-RED)",
);

const VALIDATE = "src/animation/validate.ts";
const BARREL = "src/animation/index.ts";
const LLMS = "llms.txt";
const TEST = "test/agent-validate.test.ts";

/** The heading the LOOP section opens with (clause (b)/(e) anchor). */
const LOOP_HEADING = "## Agent authoring loop";

/** Assert every anchor is present in `file`; the clause reds on any missing. */
const requireAll = (clause, file, anchors) => {
    if (!existsSync(join(root, file))) {
        fail(clause, `${file} does not exist.`);
        return;
    }
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ${missing.map((m) => m.name).join("; ")} — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

// ── (a) verb-exists — validate.ts exports validate + explain, wired HEAVY ──────
{
    if (!existsSync(join(root, VALIDATE))) {
        fail(
            "verb-exists",
            `${VALIDATE} does not exist — the agent-authoring verb is absent (loadAnimationEngine().validate === undefined). S1/S2 add it as a HEAVY read-only projection over the diagnostics / compile-refusal / WAAPI-eligibility channels.`,
        );
    } else {
        // The module must EXPORT both verbs. validate joins the three channels;
        // explain formats validate's result as the human/LLM-readable string the
        // llms.txt LOOP links.
        requireAll("verb-exists", VALIDATE, [
            {
                name: "export function validate (the read-only projection verb)",
                re: /export\s+(?:async\s+)?function\s+validate\b/,
            },
            {
                name: "export function explain (the human/LLM-readable projection)",
                re: /export\s+(?:async\s+)?function\s+explain\b/,
            },
            {
                name: "the ValidateResult envelope (parseable + eligible + refusals + diagnostics + waapi)",
                re: /interface\s+ValidateResult[\s\S]*?parseable:\s*boolean[\s\S]*?eligible:\s*boolean[\s\S]*?refusals:[\s\S]*?diagnostics:[\s\S]*?waapi:/,
            },
        ]);
    }

    // heavy-boundary — validate/explain ride loadAnimationEngine's dynamic
    // surface, and are NOT static runtime value exports on the LIGHT barrel
    // (they would carry a value.js edge → proof:boundary reds). Only their erased
    // TYPES may be on the static barrel.
    const barrelSrc = existsSync(join(root, BARREL)) ? read(BARREL) : "";
    const ridesDynamic =
        /validate:\s*\w+Mod\.validate/.test(barrelSrc) &&
        /explain:\s*\w+Mod\.explain/.test(barrelSrc) &&
        /import\(["']\.\/validate["']\)/.test(barrelSrc);
    const leaksStatic =
        /export\s*\{[^}]*\b(?:validate|explain)\b[^}]*\}\s*from\s*["']\.\/validate["']/.test(
            barrelSrc,
        );
    if (!ridesDynamic) {
        fail(
            "verb-exists",
            "validate/explain are not wired through loadAnimationEngine's dynamic import('./validate') — the HEAVY verb must ride the dynamic boundary (loadAnimationEngine().validate must be a function).",
        );
    } else if (leaksStatic) {
        fail(
            "verb-exists",
            "validate/explain are re-exported as STATIC values on the LIGHT barrel — they carry a value.js edge (validate.ts imports adapter/compile/waapi) and would redden proof:boundary. Keep them on loadAnimationEngine; export only their TYPES statically.",
        );
    } else if (existsSync(join(root, VALIDATE))) {
        ok(
            "verb-exists",
            "validate/explain are HEAVY (ride loadAnimationEngine's dynamic import('./validate')); only their erased TYPES are on the LIGHT barrel (proof:boundary stays green)",
        );
    }
}

// ── (b) loop-heading — /llms.txt carries the `## Agent authoring loop` heading ─
{
    if (!existsSync(join(root, LLMS))) {
        fail("loop-heading", `${LLMS} does not exist (run \`node scripts/gen-agent-surface.mjs\`).`);
    } else {
        const llmsTxt = read(LLMS);
        if (!llmsTxt.includes(LOOP_HEADING)) {
            fail(
                "loop-heading",
                `${LLMS} has no \`${LOOP_HEADING}\` heading — gen-agent-surface.mjs emits no LOOP section (no validate row in the manifest yet). S3 teaches the validate→fix→compile loop; regenerate: \`node scripts/gen-agent-surface.mjs\`.`,
            );
        } else {
            ok("loop-heading", `${LLMS} carries the \`${LOOP_HEADING}\` LOOP teaching`);
        }
    }
}

// ── (e) loop-not-stale — the LOOP section matches a fresh generation ───────────
//   The (a.5) clause the L.W6 spec names for proof:agent-surface, authored here
//   (the same buildLlmsTxt() no-drift mechanism proof:agent-surface (a.4) uses,
//   scoped to the LOOP section) so gen-agent-surface.mjs / proof-agent-surface.mjs
//   / package.json are untouched by the gate-author step.
{
    const fresh = buildLlmsTxt();
    const freshHasLoop = fresh.includes(LOOP_HEADING);
    if (!freshHasLoop) {
        fail(
            "loop-not-stale",
            `a fresh \`buildLlmsTxt()\` generation carries no \`${LOOP_HEADING}\` section — gen-agent-surface.mjs (via lib/agent-surface.mjs) does not yet emit the LOOP. S3 adds it; this clause greens once the generator emits the section AND the on-disk llms.txt matches it.`,
        );
    } else if (existsSync(join(root, LLMS))) {
        const sectionOf = (text) => {
            const start = text.indexOf(LOOP_HEADING);
            if (start < 0) return null;
            // The section runs from its heading to the next top-level `## ` (or EOF).
            const next = text.indexOf("\n## ", start + LOOP_HEADING.length);
            return next < 0 ? text.slice(start) : text.slice(start, next);
        };
        const onDisk = sectionOf(read(LLMS));
        const freshSection = sectionOf(fresh);
        if (onDisk == null) {
            fail(
                "loop-not-stale",
                `${LLMS} has no LOOP section to compare (clause (b) names the absence). Regenerate: \`node scripts/gen-agent-surface.mjs\`.`,
            );
        } else if (onDisk !== freshSection) {
            fail(
                "loop-not-stale",
                `${LLMS}'s \`${LOOP_HEADING}\` section is STALE — it does not match \`buildLlmsTxt()\`'s output (the index was hand-edited or the generator changed without regeneration). Fix: \`node scripts/gen-agent-surface.mjs\`.`,
            );
        } else {
            ok(
                "loop-not-stale",
                `${LLMS}'s LOOP section is byte-identical to a fresh generation (the no-drift lock holds — this is proof:agent-surface (a.5))`,
            );
        }
    }
}

// ── (c)/(d) behaviour-locks — the .test.ts carries the projection clauses ──────
//   The RUNTIME assertions ((c) the @property/!important post-cure verdict, (d)
//   the multi-color perceptual-oklab refusal) ride `vitest run TEST`; this script
//   asserts the test LOCKS them (it imports the real `validate` + carries the
//   fixture asserts), in the proof:compile-replay / proof:diagnostics-channel
//   source-lock style. BITE: delete a lock → the behaviour proof no longer bites.
{
    if (!existsSync(join(root, TEST))) {
        fail(
            "behaviour-locks",
            `${TEST} does not exist — the (c)/(d) behaviour proof (the @property/!important post-cure verdict + the multi-color perceptual-oklab refusal) has no home.`,
        );
    } else {
        const src = read(TEST);
        const importsValidate =
            /from\s+["']\.\.\/src\/animation\/validate["']/.test(src);
        if (!importsValidate) {
            fail(
                "behaviour-locks",
                `${TEST} does not import \`validate\` from ../src/animation/validate — the behaviour proof must exercise the real verb, not a shim.`,
            );
        }
        // (c) — the @property/!important fixture projects the spec-faithful verdict.
        requireAll("behaviour-locks", TEST, [
            {
                name: "(c) the @property block round-trips eligible (parseable:true + eligible:true post-L.W1)",
                re: /@property|important/,
            },
            {
                name: "(c) parseable:true is asserted on the honored-surface fixture",
                re: /parseable\b[\s\S]{0,40}?toBe\(true\)/,
            },
            {
                name: "(d) the 2-stop multi-color track refuses with perceptual-oklab (L.W2)",
                re: /reason\b[\s\S]{0,40}?toBe\(["']perceptual-oklab["']\)/,
            },
            {
                name: "(d) eligible:false is asserted on the multi-color fixture",
                re: /eligible\b[\s\S]{0,40}?toBe\(false\)/,
            },
        ]);
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:agent-validate — FAIL: the agent-authoring verb is not fully wired:\n" +
            failures.join("\n") +
            "\n\n  `validate(css)` is a HEAVY read-only projection over the diagnostics /\n" +
            "  compile-refusal / WAAPI-eligibility channels onto one agent-shaped\n" +
            "  envelope; `explain(css)` formats it human/LLM-readable; `/llms.txt`\n" +
            "  teaches the validate→fix→compile LOOP (generated, never hand-edited).\n" +
            "  Land S1/S2 (validate.ts + the barrel wiring), S3 (the LOOP section via\n" +
            "  `node scripts/gen-agent-surface.mjs`), and restore each named lock.\n" +
            "  The behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:agent-validate — PASS: validate/explain exist (HEAVY — ride\n" +
        "loadAnimationEngine; the LIGHT barrel stays value.js-free), /llms.txt\n" +
        "teaches the validate→fix→compile LOOP (byte-identical to a fresh\n" +
        "generation — proof:agent-surface (a.5)), and the (c)/(d) behaviour locks\n" +
        "(the @property/!important spec-faithful verdict + the multi-color\n" +
        "perceptual-oklab refusal) ride `vitest run " +
        TEST +
        "`.",
);
