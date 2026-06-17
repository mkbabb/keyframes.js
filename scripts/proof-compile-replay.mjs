#!/usr/bin/env node
/**
 * proof:compile-replay — the K.W10 THE COMPILE replay-equality gate (the
 * round-trip's BACKWARD direction · Band II · the XL anchor).
 *
 * `compileToCSS` (`src/animation/compile.ts`) walks an orchestration graph
 * (`AnimationGroup` / `Sequence` / a stagger cohort) → a ZERO-RUNTIME CSS
 * artifact (`@keyframes` + `animation-*` longhands + `animation-composition`
 * layering + `linear()` springs + materialized stagger delays + perceptual
 * `oklab()` densify). The MOAT is the FAITHFULNESS — the compiler is the parser
 * run BACKWARD over the SAME data model (`format.ts` is `keyframes.ts` run
 * backward), NOT a re-derived lossy emitter; what cannot round-trip faithfully
 * is REFUSED with a NAMED reason (CC-3 — the four refusals), never silently
 * approximated.
 *
 * This gate is the falsifiable instrument, in the `proof:roundtrip-fidelity`
 * style: a SOURCE-GREP half (the compiler exists, consumes the RIPE value.js
 * symbols `reverseAnimationShorthand`/`sampleColorRamp`/`deltaEOK`, is HEAVY —
 * reached only via `loadAnimationEngine`, NOT the LIGHT barrel — and the four
 * refusals are NAMED in the source) CHAINED with the BEHAVIOUR half
 * (`vitest run test/compile-roundtrip.test.ts` — the replay-equality + densify
 * ΔE-ε + the four refusals). It does NOT re-implement the replay (that lives in
 * the .test.ts), it asserts the compiler is wired + faithful + honest, and BITES
 * on a deleted lock.
 *
 * Born-RED in the FRONTIER sense: before K.W10 NO compiler existed
 * (`grep -rn reverseAnimationShorthand src/` → ZERO). The capability is net-new.
 *
 * CLAUSES (each BITES):
 *
 *   compiler-exists      — `src/animation/compile.ts` exists and EXPORTS
 *       `compileToCSS`. BITE: delete the module / the export → the round-trip's
 *       backward half does not exist → reds.
 *
 *   parser-run-backward  — the compiler consumes the RIPE value.js inverse
 *       primitives (`reverseAnimationShorthand` for the `animation` shorthand,
 *       `sampleColorRamp` + `deltaEOK` for the oklab densify + its ΔE proof). It
 *       is the parser run BACKWARD over value.js's OWN grammar, not a bespoke
 *       re-derivation. BITE: drop a consume → the emit is re-derived (lossy) →
 *       reds.
 *
 *   four-refusals-named  — CC-3's four refusal reasons (`weighted-blend`,
 *       `custom-renderer`, `perceptual-oklab`, `computed-unit-drift`) are NAMED
 *       in the source (the trust surface — `waapiIneligibleReason` generalized).
 *       BITE: drop a refusal reason → a non-round-trippable input silently emits
 *       (wrong) CSS → reds.
 *
 *   heavy-boundary       — the compiler is HEAVY: reached ONLY via
 *       `loadAnimationEngine()` (it carries a static `@mkbabb/value.js` edge), and
 *       the LIGHT barrel re-exports ONLY its erased TYPES — never the runtime
 *       `compileToCSS` as a static value export. BITE: add `export { compileToCSS }`
 *       to the barrel → the LIGHT surface gains a value.js edge → proof:boundary
 *       (and this clause) reds.
 *
 *   replay-equality      — the test body asserts the compiled `@keyframes`
 *       RE-PARSES into a fresh animation whose interpolation is numerically EQUAL
 *       to the JS playback it emitted from (the dist-level numeric-sample
 *       equality the headless tier permits — a pixel-equality stand-in). BITE:
 *       weaken the `toEqual(numericSnapshot(...))` lock → a lossy emit slips → reds.
 *
 *   densify-delta-proof  — the test body asserts CC-2 ships the densify ONLY
 *       under ΔE-ε (the emitted `oklab()` stops track kf's perceptual lerp) and
 *       REFUSES on a tight ε. BITE: delete the ΔE assert → a drifting densify
 *       ships silently → reds.
 *
 *   no-source-edit       — the replay flows through the unchanged compile +
 *       format + engine surfaces; the test carries NO `src/` mutation. BITE: a
 *       required `src/` edit to make a clause bite is a finding, surfaced not
 *       patched.
 *
 * Mirrors `proof:roundtrip-fidelity` / `proof:motion-path`: exits 1 on any residual.
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:compile-replay — K.W10 THE COMPILE (the round-trip's BACKWARD half · replay-equality)",
);

const COMPILE = "src/animation/compile.ts";
const COMPILE_COLOR = "src/animation/compile-color.ts";
const FORMAT = "src/animation/format.ts";
const BARREL = "src/animation/index.ts";
const TEST = "test/compile-roundtrip.test.ts";

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

// ── compiler-exists — the module + the compileToCSS export ─────────────────────
requireAll("compiler-exists", COMPILE, [
    {
        name: "export async function compileToCSS",
        re: /export\s+async\s+function\s+compileToCSS\b/,
    },
    {
        name: "the CompiledCSS result shape (css + eligible + refusals)",
        re: /interface\s+CompiledCSS[\s\S]*?css:\s*string[\s\S]*?eligible:\s*boolean[\s\S]*?refusals:/,
    },
]);

// ── parser-run-backward — the RIPE value.js inverse consumes (the IMPORT, not a
//    mere comment mention) ───────────────────────────────────────────────────
{
    // Read the @mkbabb/value.js import block of each owning module — the
    // consume must be an ACTUAL import edge, not a comment reference (the gate
    // would otherwise false-pass on a docstring that names the symbol).
    const importsOf = (file) => {
        if (!existsSync(join(root, file))) return "";
        const src = read(file);
        const m = /import\s*\{([\s\S]*?)\}\s*from\s*["']@mkbabb\/value\.js["']/.exec(
            src,
        );
        return m ? m[1] : "";
    };
    const formatImports = importsOf(FORMAT);
    const colorImports = importsOf(COMPILE_COLOR);
    const consumes = [
        {
            name: "reverseAnimationShorthand IMPORTED in format.ts (the animation-shorthand inverse — CC-1)",
            ok: /\breverseAnimationShorthand\b/.test(formatImports),
        },
        {
            name: "sampleColorRamp IMPORTED in compile-color.ts (the perceptual densify producer — CC-2)",
            ok: /\bsampleColorRamp\b/.test(colorImports),
        },
        {
            name: "deltaEOK IMPORTED in compile-color.ts (the ΔE-ε ship-vs-refuse proof kernel — CC-2)",
            ok: /\bdeltaEOK\b/.test(colorImports),
        },
    ];
    const missing = consumes.filter((c) => !c.ok);
    if (missing.length > 0) {
        fail(
            "parser-run-backward",
            `the compiler/format seam does not consume: ${missing.map((m) => m.name).join("; ")} — the emit would be a re-derived lossy emitter, NOT the parser run backward.`,
        );
    } else {
        ok(
            "parser-run-backward",
            "the compiler consumes value.js's reverseAnimationShorthand + sampleColorRamp + deltaEOK (the parser run BACKWARD over value.js's own grammar)",
        );
    }
}

// ── four-refusals-named — CC-3's four named refusal reasons ─────────────────────
requireAll("four-refusals-named", COMPILE, [
    { name: '"weighted-blend" refusal (the §3a axis-3 proof)', re: /"weighted-blend"/ },
    { name: '"custom-renderer" refusal (a closure cannot be CSS)', re: /"custom-renderer"/ },
    { name: '"perceptual-oklab" refusal (densify beyond ΔE-ε)', re: /"perceptual-oklab"/ },
    {
        name: '"computed-unit-drift" refusal (the narrow residue)',
        re: /"computed-unit-drift"/,
    },
    {
        name: "the CompileRefusalReason union (the typed trust surface)",
        re: /type\s+CompileRefusalReason/,
    },
]);

// ── heavy-boundary — HEAVY (loadAnimationEngine), NOT a LIGHT value export ──────
{
    const barrelSrc = existsSync(join(root, BARREL)) ? read(BARREL) : "";
    // compileToCSS must ride the dynamic loadAnimationEngine assign…
    const ridesDynamic =
        /compileToCSS:\s*compileMod\.compileToCSS/.test(barrelSrc) &&
        /import\(["']\.\/compile["']\)/.test(barrelSrc);
    // …and must NOT be a static runtime value export on the LIGHT barrel.
    const leaksStatic =
        /export\s*\{[^}]*\bcompileToCSS\b[^}]*\}\s*from\s*["']\.\/compile["']/.test(
            barrelSrc,
        );
    if (!ridesDynamic) {
        fail(
            "heavy-boundary",
            "compileToCSS is not wired through loadAnimationEngine's dynamic import('./compile') — the HEAVY runtime must ride the dynamic boundary.",
        );
    } else if (leaksStatic) {
        fail(
            "heavy-boundary",
            "compileToCSS is re-exported as a STATIC value on the LIGHT barrel — it carries a value.js edge and would redden proof:boundary. Keep it on loadAnimationEngine; export only its TYPES statically.",
        );
    } else {
        ok(
            "heavy-boundary",
            "compileToCSS is HEAVY (rides loadAnimationEngine's dynamic import); only its erased TYPES are on the LIGHT barrel (proof:boundary stays green)",
        );
    }
}

// ── replay-equality — the numeric-sample re-parse equality lock ────────────────
requireAll("replay-equality", TEST, [
    {
        name: "the compiled @keyframes is RE-PARSED into a fresh animation",
        re: /reparse\(keyframesOf\(/,
    },
    {
        name: "the re-parse samples NUMERICALLY-EQUAL to the JS playback (the replay-equality lock)",
        re: /toEqual\(numericSnapshot\(a,\s*t\)\)/,
    },
]);

// ── densify-delta-proof — CC-2 ships-or-refuses on ΔE-ε ────────────────────────
requireAll("densify-delta-proof", TEST, [
    {
        name: "the emitted oklab() stops are asserted within ΔE-ε of kf's perceptual lerp",
        re: /dE\([^)]*\)\)\.toBeLessThan\(DEFAULT_DELTA_E_EPSILON\)/,
    },
    {
        name: "a tight ΔE-ε FORCES the perceptual-oklab refusal",
        re: /deltaEEpsilon:\s*1e-9[\s\S]*?reason\)\.toBe\("perceptual-oklab"\)/,
    },
]);

// ── no-source-edit — the replay rides the unchanged surfaces ───────────────────
{
    const src = existsSync(join(root, TEST)) ? read(TEST) : "";
    const importsCompile = /from "\.\.\/src\/animation\/compile"/.test(src);
    const importsEngine = /from "\.\.\/src\/animation\/engine"/.test(src);
    if (importsCompile && importsEngine) {
        ok(
            "no-source-edit",
            "the replay rides the unchanged compile + engine surfaces (TEST-ONLY)",
        );
    } else {
        fail(
            "no-source-edit",
            `${TEST} no longer imports BOTH the compiler and the engine — the replay must exercise the real surfaces, not a shim.`,
        );
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  L.W2 — Compiler completeness (the four POST-CURE-ONLY clauses).
//
//  The K.W10 gate above is GREEN today; L.W2 closes the four residual compile
//  gaps it does NOT bite. Each clause asserts a CURE-ONLY discriminant — a symbol
//  ABSENT on the 4.3.0 tree — so it REDS today and GREENS iff the matching
//  S-clause cure lands. The anti-vacuous warnings (L.W2.md §The born-RED gate)
//  are honored EXACTLY: a clause that the UNCURED tree could already satisfy is a
//  VACUOUS clause — its anchor is the wrong one.
// ═══════════════════════════════════════════════════════════════════════════════

// ── multi-color-honest (bites S2, ⚠28/⚠29, viol28, W113) ───────────────────────
//
//  S2 breach: `compile-color.ts:190` SILENTLY returns `null` for
//  `colorKeys.length > 1`; the caller ships the verbatim sRGB block with
//  `eligible:true` (the ΔE drift the single-color path REFUSES, here shipped
//  silently). The CURE introduces ONE of two NEW symbols, NEITHER present today:
//    • Option A: a `for (… of colorKeys)` per-key densify loop (the single
//      `colorKeys[0]` densify generalized; the `> 1` early-out DELETED).
//    • Option B: a DISTINCT `"multi-color-perceptual-oklab"` refusal reason.
//  Anti-vacuous: the OLD draft regex scanned forward for `densify` — but the word
//  appears in the BREACH COMMENT at compile-color.ts:188-189 ("multi-color
//  densify is BOOK"), and `perceptual-oklab` (the single-color reason) already
//  exists — so neither is a multi-color discriminant. We require ONLY the new
//  symbols, AND assert the silent early-out is GONE.
requireAll("multi-color-honest", COMPILE_COLOR, [
    {
        name: "multi-color path cures (per-key densify loop OR distinct multi-color refusal reason)",
        re: /multi-color-perceptual-oklab|for\s*\(\s*const\s+\w+\s+of\s+colorKeys\b/,
    },
]);
{
    const ccsrc = existsSync(join(root, COMPILE_COLOR)) ? read(COMPILE_COLOR) : "";
    if (/colorKeys\.length\s*>\s*1\s*\)\s*return\s+null\s*;/.test(ccsrc)) {
        fail(
            "multi-color-honest",
            "compile-color.ts still SILENTLY returns null for colorKeys.length > 1 — densify per-key or refuse with multi-color-perceptual-oklab (the verbatim sRGB block ships with eligible:true, the ΔE drift the single-color path refuses).",
        );
    }
}

// ── scroll-compile-emit (bites S1, CC-6, W12/W119, Lane-33) ────────────────────
//
//  S1 breach: `compileToCSS` emits a `.class { animation: … }` rule with ZERO
//  `animation-timeline`/`animation-range` — a scroll-driven source compiles to a
//  scroll-BLIND artifact the browser plays on the time clock. The CURE threads
//  the parsed scroll options through `serializeScrollOptions` and appends the
//  longhands. NONE of `animation-timeline` / `serializeScrollOptions` /
//  `scrollOptions` exists in compile.ts today (zero hits) → RED today, GREEN when
//  S1's compose wiring lands.
requireAll("scroll-compile-emit", COMPILE, [
    {
        name: "animation-timeline / serializeScrollOptions / scrollOptions emit in compileChild (the scroll grammar EMIT half)",
        re: /animation-timeline|serializeScrollOptions|scrollOptions/,
    },
]);

// ── static-weight-compile (bites S3, CC-5, W36) ────────────────────────────────
//
//  S3 breach: `compile.ts:179` marks a layer `weighted` on
//  `entry.layer.weightSpring != null`, refusing the static-weight case where a
//  pre-multiply-into-`accumulate` is EXACT. The CURE partitions the flag into
//  `springWeighted` / `staticWeighted` (+ a `staticWeight` field on
//  CompileChild). Anti-vacuous: the OLD draft regex's first alternative
//  `weightSpring != null` ALREADY matches compile.ts:179 today — VACUOUS. We
//  require ONLY the cure-only partition names (NONE present today: zero hits for
//  springWeighted|staticWeighted|staticWeight).
requireAll("static-weight-compile", COMPILE, [
    {
        name: "static/spring weight partition (the cure-only variable names — NOT the pre-existing weightSpring != null)",
        re: /springWeighted|staticWeighted|staticWeight/,
    },
]);

// ── no-reverseMs (bites S4, ⚠30, viol30, W115) ─────────────────────────────────
//
//  S4 breach: `compile.ts:241` defines a private `const reverseMs` that diverges
//  from value.js's `reverseCSSTime` (`reverseMs(1000)`="1s" vs
//  `reverseCSSTime(1000)`="1000ms") — two time serializers in one artifact. The
//  CURE deletes `reverseMs` and uses `reverseCSSTime` for the delay emit. The
//  `const reverseMs` definition is PRESENT today → RED; GREEN when it is deleted.
{
    const src = existsSync(join(root, COMPILE)) ? read(COMPILE) : "";
    if (/\bconst\s+reverseMs\b/.test(src)) {
        fail(
            "no-reverseMs",
            "compile.ts still defines its own reverseMs — delete it, use reverseCSSTime (value.js, already imported in format.ts:5); a stagger cohort with 2s delays would emit `2s` while the shorthand emits `2000ms` in the same artifact.",
        );
    } else {
        ok(
            "no-reverseMs",
            "compile.ts no longer defines a divergent reverseMs (the time serializer is unified on value.js's reverseCSSTime)",
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:compile-replay — FAIL: the compile→replay-equality oracle is not fully locked:\n" +
            failures.join("\n") +
            "\n\n  The compiler is the parser run BACKWARD over the SAME data model\n" +
            "  (format.ts is keyframes.ts run backward); the compiled CSS replays equal\n" +
            "  to the JS playback it emitted from, and what cannot round-trip faithfully\n" +
            "  is REFUSED with a named reason (the four CC-3 refusals). Restore the clause\n" +
            "  each anchor names. The behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:compile-replay — PASS: the CSS compiler exists (compileToCSS), is the\n" +
        "parser run BACKWARD over value.js's own grammar (reverseAnimationShorthand +\n" +
        "sampleColorRamp + deltaEOK), names the four CC-3 refusals, is HEAVY (rides\n" +
        "loadAnimationEngine, the LIGHT barrel stays value.js-free), and the compiled\n" +
        "CSS replays numerically-equal to the JS playback (with the oklab densify\n" +
        "shipping-or-refusing on the ΔE-ε proof). The behaviour proof rides\n" +
        "`vitest run " +
        TEST +
        "`.",
);
