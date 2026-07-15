#!/usr/bin/env node
/**
 * proof:scroll-roundtrip — K.W9 SCROLL-AS-CSS (the field's #1 named gap, closed
 * the only-kf way): PARSE + ROUND-TRIP + DISPATCH the scroll grammar the platform
 * is still shipping. The scroll round-trip oracle — the engine reads the scroll-
 * driven CSS, drives it (native where eligible, JS where not), and emits it BACK
 * as valid CSS, faithful BOTH ways (the replay-equality invariant), OR refuses
 * with a named reason (the dispatch's queryable `ineligibleReason`).
 *
 * BORN-RED WITNESS (DOUBLE-rooted; the source half lands against the recorded
 * absence, the consume edge LIT on value.js 0.13.0's publish):
 *   (1) the FRONTIER sense — kf had ZERO scroll-parse surface and no
 *       `ScrollScene` (the two-comments-only grep). Before `scroll-scene.ts`,
 *       every source-lock clause below reds (the file does not exist).
 *   (2) value.js-GATED — the typed scroll-VALUE extractor + `CSSTimelineOptions`
 *       were ABSENT ≤ 0.12.0. value.js 0.13.0 PUBLISHES them; the replay-equality
 *       round-trip clause (b) below EXECUTES the consumed grammar (greens on the
 *       publish; reds against the recorded absence).
 *
 * CLAUSES (each BITES — the §Hard gate, source-shape locks in the
 * proof:composition-honored style + an EXECUTABLE replay-equality round-trip):
 *
 *   (b-parse)   — scroll-scene.ts CONSUMES value.js's typed scroll-grammar
 *       (`extractTimelineOptions` / `parseAnimationTimeline` / `parseAnimationRange`
 *       / `serializeTimelineOptions`) — NEVER a kf-local parser (the no-workaround
 *       prohibition). BITE: a kf-local parser breaches the acyclic spine → reds.
 *
 *   (b-roundtrip) — THE REPLAY-EQUALITY ORACLE (executed): a scroll-driven
 *       stylesheet parses to a typed `CSSTimelineOptions` and re-serializes to
 *       valid CSS that re-parses CANONICAL-FORM-EQUAL. BITE: a lossy round-trip
 *       (a dropped range phase, a scroll()→view() collapse, a <dashed-ident>
 *       named-timeline ref silently lost) reds even though it "parsed".
 *
 *   (a-driver)  — the JS ScrollScene driver COMPOSES the SHIPPED primitives
 *       (SmoothProgress scrub, decayRest+SpringProgress snap) — it invents no
 *       physics. BITE: a novel snap math / a coupled vector spring → reds.
 *
 *   (c-dispatch) — the dispatch is conservative-correct with a queryable reason
 *       (the WAAPI-eligibility seam pointed at the scroll clock; the
 *       `waapiIneligibleReason` honesty idiom generalized). BITE: a silent native
 *       dispatch of an ineligible animation, or no reason → reds.
 *
 *   (d-pin)     — SO-3 the pin is `position:sticky` synthesis, NEVER transform-
 *       tracking (SO-4 KILLED — cross-thread jitter). BITE: a `transform:
 *       translateY` pin primitive → reds (the anti-jitter assert).
 *
 *   (boundary)  — scroll-scene.ts is HEAVY: it rides loadAnimationEngine (the
 *       value.js edge is intentional + dynamic), NOT the LIGHT static barrel.
 *       BITE: a runtime (non-type) scroll-scene export on the light barrel →
 *       proof:boundary would red; this clause locks the additive shape early.
 *
 *   (test-locks) — test/scroll/scroll-scene.test.ts carries the value clauses
 *       (a)-(e). BITE: delete a lock → reds.
 *
 * Mirrors proof:composition-honored / proof:motion-path: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

const requireAll = (clause, file, anchors) => {
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log(
    "proof:scroll-roundtrip — K.W9 (the scroll grammar round-trips + dispatches)",
);

const SCROLL = "src/animation/scroll/scene.ts";
// The K close decomposition split the scroll module at the natural concern seam:
// scroll-scene.ts owns the TIME driver (and re-exports the grammar surface), and
// the colocated scroll-grammar.ts owns the GRAMMAR — the value.js CONSUME edge
// (parseAnimationTimeline / parseAnimationRange / serializeTimelineOptions). The
// (b-parse) source-shape clause therefore checks the scroll module SET (the union
// of both files); the value.js-grammar consume must live in EXACTLY ONE of them,
// never as a kf-local re-derived parser in EITHER. (Relocation, not weakening.)
const GRAMMAR = "src/animation/scroll/grammar.ts";
// R.W2b carved the `animation-range` → [0,1] mapping (resolveRange + the phase
// fractions) off scene.ts into the colocated range.ts; the scroll module SET is
// the three colocated files (driver + grammar + range mapping).
const RANGE = "src/animation/scroll/range.ts";
// T.F22 — the per-zone cohesion carve split the native-vs-JS backend dispatch +
// the `position:sticky` pin synthesis OFF the TIME driver into the colocated
// `dispatch.ts` (dispatchScrollBackend / pinCSS). The (c-dispatch)/(d-pin)
// clauses anchor there; `scene.ts` keeps only the ScrollScene driver.
const DISPATCH = "src/animation/scroll/dispatch.ts";
const SCROLL_SET = [SCROLL, GRAMMAR, RANGE];
const INDEX = "src/animation/index.ts";
const TEST = "test/scroll/scroll-scene.test.ts";

// ── (b-parse) — the scroll module SET CONSUMES value.js's typed scroll-grammar ─
// Check the UNION of scroll-scene.ts + scroll-grammar.ts (wherever the K-split
// landed the consume). Each anchor must be satisfied by SOME file in the set; the
// value.js-grammar import must be a RUNTIME import (NOT a type-only `import type`
// — a kf-local re-derived parser would carry no value.js runtime edge at all, so
// the runtime-import requirement is what makes this clause BITE).
{
    const clause = "b-parse";
    const sources = SCROLL_SET.map((f) => ({ file: f, src: read(f) }));
    const union = sources.map((s) => s.src).join("\n");
    const setLabel = SCROLL_SET.join(" ∪ ");

    // The RUNTIME value.js-grammar import: a non-`type` import specifier from
    // @mkbabb/value.js that brings in extractTimelineOptions. `import type {…}`
    // (erased) does NOT satisfy this — the consume must be a real runtime edge.
    const runtimeGrammarImport = sources.some(({ src }) =>
        /import\s*\{[\s\S]*?\bextractTimelineOptions\b[\s\S]*?\}\s*from\s*["']@mkbabb\/value\.js\/parsing["']/.test(
            src,
        ),
    );

    const anchors = [
        {
            name: "the typed extractor is imported (RUNTIME, not `import type`) from @mkbabb/value.js (NOT a kf-local parser)",
            present: runtimeGrammarImport,
        },
        {
            name: "consumes parseAnimationTimeline (the VALUE grammar, value.js's)",
            present: /parseAnimationTimeline/.test(union),
        },
        {
            name: "consumes parseAnimationRange (the range VALUE grammar)",
            present: /parseAnimationRange/.test(union),
        },
        {
            name: "consumes serializeTimelineOptions (the inverse serializer — round-trip)",
            present: /serializeTimelineOptions/.test(union),
        },
    ];
    const missing = anchors.filter((a) => !a.present);
    if (missing.length > 0) {
        fail(
            clause,
            `the scroll module set (${setLabel}) is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the value.js scroll-grammar consume is not locked in either split half.`,
        );
    } else {
        ok(
            clause,
            `the scroll module set (${setLabel}) consumes value.js's typed scroll-grammar (runtime import of extractTimelineOptions + parse/serialize), never a kf-local parser`,
        );
    }
}
// A kf-local re-derivation of the scroll grammar is the named no-workaround
// breach. There must be NO hand-rolled scroll() / view() token tokenizer in
// EITHER split half — the parse is value.js's. (We grep each file in the set for
// the FORBIDDEN shape: a local regex that tokenizes `scroll(`/`view(` instead of
// calling value.js.)
{
    let anyLocalParser = false;
    for (const file of SCROLL_SET) {
        const src = read(file);
        const localParser =
            /(?:RegExp|\.match|\.exec|\.test)\([^)]*scroll\\?\(|new RegExp\([^)]*view/.test(
                src,
            );
        if (localParser) {
            anyLocalParser = true;
            fail(
                "b-parse",
                `${file}: a kf-local scroll()/view() tokenizer detected — the scroll VALUE grammar is value.js's (the acyclic-spine no-workaround). Consume parseAnimationTimeline, never re-derive.`,
            );
        }
    }
    if (!anyLocalParser) {
        ok(
            "b-parse",
            "no kf-local scroll-grammar parser in either split half — the VALUE grammar is consumed from value.js",
        );
    }
}

// ── (b-roundtrip) — THE REPLAY-EQUALITY ORACLE (EXECUTED) ─────────────────────
// The round-trip is the parser run BACKWARD over the SAME data model: parse a
// scroll-driven stylesheet → serialize the typed options → re-parse → assert
// CANONICAL-FORM-EQUAL. value.js is pure (no DOM), so the oracle executes here.
{
    const clause = "b-roundtrip";
    try {
        const vjs = await import("@mkbabb/value.js");
        const {
            parseCSSStylesheet,
            extractTimelineOptions,
            parseAnimationTimeline,
            parseAnimationRange,
            serializeTimelineOptions,
        } = vjs;

        // The exemplar from the §Hard gate clause (b), plus a scroll() form + a
        // <dashed-ident> named ref (the silently-lossy cases the oracle catches).
        const cases = [
            ".card { animation-timeline: view(); animation-range: entry 0% cover 40%; }",
            ".hero { animation-timeline: scroll(root block); animation-range: entry 0% exit 100%; }",
            ".named { animation-timeline: --hero-scroll; }",
            ".contain { animation-timeline: view(block 10% 20%); animation-range: contain; }",
        ];

        let allFaithful = true;
        for (const css of cases) {
            const opts = extractTimelineOptions(parseCSSStylesheet(css));
            const ser = serializeTimelineOptions(opts);

            // Re-parse the serialized longhands → must be canonical-equal.
            if (opts.timeline != null) {
                const re = parseAnimationTimeline(ser["animation-timeline"]);
                if (JSON.stringify(re) !== JSON.stringify(opts.timeline)) {
                    allFaithful = false;
                    fail(
                        clause,
                        `LOSSY timeline round-trip for \`${css}\`: parsed ${JSON.stringify(opts.timeline)} but serialize→re-parse gave ${JSON.stringify(re)}`,
                    );
                }
            }
            if (opts.range != null) {
                const re = parseAnimationRange(ser["animation-range"]);
                if (JSON.stringify(re) !== JSON.stringify(opts.range)) {
                    allFaithful = false;
                    fail(
                        clause,
                        `LOSSY range round-trip for \`${css}\`: parsed ${JSON.stringify(opts.range)} but serialize→re-parse gave ${JSON.stringify(re)}`,
                    );
                }
            }
        }
        if (allFaithful) {
            ok(
                clause,
                `the replay-equality oracle PASSES: serialize(parse(s)) re-parses canonical-form-equal across ${cases.length} scroll-driven stylesheets (view/scroll/named/contain)`,
            );
        }
    } catch (e) {
        // The consume edge is DARK (value.js < 0.13.0 — the recorded born-RED) OR
        // the grammar is absent — the clause reds against the recorded absence.
        fail(
            clause,
            `the scroll-grammar consume edge is DARK (value.js's typed scroll extractor unavailable): ${e?.message ?? e}. The PARSE born-RED-gates on value.js's 0.13.0 publish.`,
        );
    }
}

// ── (a-driver) — the ScrollScene driver COMPOSES the shipped primitives ───────
requireAll("a-driver", SCROLL, [
    {
        name: "scrub composes the SHIPPED SmoothProgress (the native lane lacks it)",
        re: /new\s+SmoothProgress\(/,
    },
    {
        name: "snap composes the SHIPPED decayRest (the projected idle rest point)",
        re: /decayRest\(/,
    },
    {
        name: "snap settles via the SHIPPED SpringProgress (PHYS-D snapDecay)",
        re: /new\s+SpringProgress\(/,
    },
    {
        name: "the enter/leave threshold detector is DERIVED from the parsed range",
        re: /fire\(\s*["']enter["']/,
    },
]);

// ── (c-dispatch) — conservative-correct backend choice with a queryable reason ─
requireAll("c-dispatch", DISPATCH, [
    {
        name: "the dispatch consults the SHIPPED isWAAPIEligible gate",
        re: /isWAAPIEligible\(/,
    },
    {
        name: "native is reached via the SHIPPED attachNativeScrollTimeline bridge",
        re: /attachNativeScrollTimeline\(/,
    },
    {
        name: "feature-detects the native global (createNativeTimeline → null fallback)",
        re: /createNativeTimeline\(/,
    },
    {
        name: "the JS verdict carries a queryable `reason` (the honesty surface)",
        re: /backend:\s*["']js["']\s*,\s*reason:/,
    },
    {
        name: "scrub forces JS (native scroll has no SmoothProgress smoother)",
        re: /if\s*\(\s*scrub\s*\)/,
    },
]);

// ── (d-pin) — SO-3 the pin is position:sticky, never transform-tracking ───────
{
    const clause = "d-pin";
    const src = read(DISPATCH);
    // Strip comments + JSDoc (the module RECORDS the SO-4 kill by NAMING the
    // forbidden `transform: translateY(...)` primitive in prose — that recording
    // must NOT trip the anti-jitter assert; only an actual EMIT does). Drop
    // `//`-lines, `/* … */` blocks, and `*`-prefixed JSDoc body lines.
    const code = src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .split("\n")
        .filter((l) => !/^\s*(?:\/\/|\*)/.test(l))
        .join("\n");
    const emitsSticky = /position:\s*sticky/.test(code);
    // The anti-jitter assert: NO transform-tracking pin primitive EMITTED. SO-4
    // is KILLED — a `transform: translateY(...)` pin would jitter against the
    // compositor. Checked over CODE (comments/JSDoc stripped above).
    const transformPin = /transform:\s*translate[YX]?\(/.test(code);
    if (!emitsSticky) {
        fail(
            clause,
            `${DISPATCH}: pinCSS does NOT emit \`position: sticky\` — SO-3 requires sticky synthesis (kf authors the platform's pin).`,
        );
    } else if (transformPin) {
        fail(
            clause,
            `${SCROLL}: a \`transform: translate*()\` PIN primitive detected — SO-4 transform-pinning is KILLED (cross-thread jitter). The pin MUST be position:sticky.`,
        );
    } else {
        ok(
            clause,
            "the pin is position:sticky synthesis — SO-4 transform-pinning KILLED (no transform-tracking primitive)",
        );
    }
    // The KILL must be RECORDED in the module (so the impl never re-litigates it).
    if (!/SO-4[\s\S]{0,200}KILL/i.test(src)) {
        fail(
            clause,
            `${SCROLL}: the SO-4 transform-pinning KILL is not RECORDED in the module doc — record it so the kill is not re-litigated.`,
        );
    } else {
        ok(clause, "the SO-4 transform-pinning KILL is recorded in the module doc");
    }
}

// ── (boundary) — scroll-scene is HEAVY (rides loadAnimationEngine, not light) ──
{
    const clause = "boundary";
    const idx = read(INDEX);
    // The L-tranche engine-loader extraction moved the dynamic `import("./scroll-
    // scene")` assign OUT of the barrel and INTO `./load-engine` (the barrel
    // re-exports `loadAnimationEngine` from there). So read the dynamic-import
    // wiring from whichever file the loader currently lives in. The assertion is
    // unchanged: the scroll-scene runtime rides loadAnimationEngine (the dynamic
    // import), NOT a static `export { ScrollScene } from "./scroll-scene"` on the
    // light barrel (which would pull value.js static).
    const loadEngine = read("src/animation/load-engine.ts");
    const wiring = idx + "\n" + loadEngine;
    const ridesDynamic = /import\(\s*["']\.\/public["']\s*\)/.test(wiring);
    // The static-value-export leak is checked on the LIGHT barrel ONLY.
    const staticValueExport =
        /export\s*\{[^}]*\}\s*from\s*["']\.\/scroll(?:\/index)?["']/.test(idx);
    if (!ridesDynamic) {
        fail(
            clause,
            `${INDEX}: the scroll-scene runtime does NOT ride loadAnimationEngine (\`import("./scroll-scene")\`) — it is HEAVY (static value.js edge) and must be dynamic.`,
        );
    } else if (staticValueExport) {
        fail(
            clause,
            `${INDEX}: a STATIC \`export { … } from "./scroll-scene"\` on the light barrel — that pulls value.js static (proof:boundary reds). Only \`export type\` is allowed; the runtime rides loadAnimationEngine.`,
        );
    } else {
        ok(
            clause,
            "scroll-scene rides loadAnimationEngine (HEAVY/dynamic); only its TYPES are on the light barrel (additive, value.js-free)",
        );
    }
}

// ── (test-locks) — the value clauses (a)-(e) are present and biting ───────────
requireAll("test-locks", TEST, [
    {
        name: "(a) the JS driver scrubs THROUGH the smoother (damped lag, not 1:1)",
        re: /toBeLessThan\(1\)/,
    },
    {
        name: "(a) snap settles to the nearest range boundary (0.5)",
        re: /snapTo\([\s\S]*?toBe\(0\.5\)/,
    },
    {
        name: "(b) the replay-equality oracle (serialize→re-parse equal)",
        re: /roundTripScrollCSS\(/,
    },
    {
        name: "(c) the dispatch reason is queryable on the JS path",
        re: /verdict\.reason/,
    },
    {
        name: "(d) the pin is position:sticky, never transform",
        re: /position:\s*sticky[\s\S]*?not\.toMatch\(\/transform\//,
    },
    {
        name: "(e) the JS ScrollTimeline driver is NOT deleted (the ARCH-kill guard)",
        // Q.WE1 dropped the @deprecated `ScrollTimeline` alias → the canonical JS driver
        // class is `KeyframesScrollTimeline` (the renamed export); the (?:Keyframes)? prefix
        // follows that rename while still matching any pre-rename `new ScrollTimeline(`.
        re: /new\s+(?:Keyframes)?ScrollTimeline\(/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:scroll-roundtrip — FAIL: the scroll round-trip oracle is not whole:\n" +
            failures.join("\n") +
            "\n\n  scroll-scene.ts must CONSUME value.js's typed scroll-grammar (never a\n" +
            "  kf-local parser), round-trip a scroll-driven stylesheet faithfully\n" +
            "  (serialize(parse(s)) canonical-form-equal), COMPOSE the shipped\n" +
            "  SmoothProgress/decayRest/SpringProgress primitives, dispatch native-vs-JS\n" +
            "  conservative-correct with a queryable reason, and emit a position:sticky\n" +
            "  pin (SO-4 transform-pinning KILLED). Restore the clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:scroll-roundtrip — PASS: the scroll grammar PARSES (consuming value.js\n" +
        "0.13.0's typed CSSTimelineOptions extractor), ROUND-TRIPS faithfully\n" +
        "(serialize(parse(s)) re-parses canonical-form-equal — the replay-equality\n" +
        "oracle), and DISPATCHES native-vs-JS conservative-correct with a queryable\n" +
        "reason; the JS ScrollScene driver composes the shipped scrub/snap primitives\n" +
        "and the pin is position:sticky synthesis (SO-4 transform-pinning KILLED). The\n" +
        "value proof rides `vitest run test/scroll/scroll-scene.test.ts`.",
);
