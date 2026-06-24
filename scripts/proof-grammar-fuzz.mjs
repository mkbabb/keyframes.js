#!/usr/bin/env node
/**
 * proof:grammar-fuzz — Q.WD2 S1/S2 (the P.W9 S3 RE-SCOPED for value.js 1.1.0):
 * the property-based grammar round-trip oracle (Band D · TEST-ONLY).
 *
 * The three confirmed inv-O-2 breaches in value.js (none→NaN, color()-wrapper
 * loss, the round() TypeError) were HAND-DISCOVERED in audits; no automatic
 * round-trip oracle existed (`grep -rn "fast-check" test/ scripts/` → ZERO).
 * This gate is that oracle: a `fast-check` model-grammar fuzz that generates
 * random VALID @keyframes fragments, parses them via `CSSKeyframesAnimation`,
 * serializes via `CSSKeyframesToString`, re-parses, and asserts the compiled
 * frames are STRUCTURALLY equal (same prop keys, same unit strings, numerically
 * close leaves). A structural round-trip failure is the runtime observable for
 * any value.js serialization regression on a commonly-used CSS value type.
 *
 * The Q.WD2 re-scope vs. P.W9 (probe-re-confirmed 2026-06-23 against installed
 * value.js 1.1.0):
 *   - the `round()` arm UNFOLDS from a permanent SKIP to a standard GREEN arm
 *     (`parseCSSValue('round(nearest, 3.7px, 1px)')` round-trips correctly now);
 *   - the none-channel + color()-wrapper arms remain EXPECTED-FAILURE tripwires
 *     (`oklch(0.6 none 200)` → `"oklch(0.6 NaN 200)"`; `color(display-p3 1 0 0)`
 *     → `"display-p3(1 0 0)"`), auto-flipping to GREEN when value.js's VJ-Q9
 *     serialization-fidelity fix lands (consumed via the Q.WG4 `^1.2.0` re-pin).
 *
 * This is a SOURCE-GREP + manifest-coverage gate in the `proof:roundtrip-fidelity`
 * style: it does NOT re-implement the fuzz (it lives in test/grammar-fuzz.test.ts);
 * it asserts the harness is present + authoritative + scoped-GREEN, the named-
 * selector fixture (S2) is present + manifest-covered, and chains the behaviour
 * proof (`vitest run test/grammar-fuzz.test.ts`). Exits 1 on any residual.
 *
 * CLAUSES (each BITES):
 *
 *   fast-check-present   — `fast-check` is a devDependency AND resolvable from
 *       node_modules. BITE (born-RED today): `fast-check` absent → the test
 *       cannot import it → the chained vitest reds.
 *
 *   harness-exists       — `test/grammar-fuzz.test.ts` exists and uses the three
 *       Arbitrary families (colorArb, mathArb, keyframeStopArb) over the real
 *       round-trip surfaces (`CSSKeyframesAnimation.fromString` +
 *       `CSSKeyframesToString`). BITE: delete the harness / a family → reds.
 *
 *   scoped-green         — the none-channel + wrapper-loss arms are
 *       EXPECTED-FAILURE tripwires (not HARD-RED standard arms) AND the round()
 *       arm is a standard arm. BITE: re-author a tripwire as a hard arm (a
 *       blocked harness) OR re-add the obsolete round() SKIP → reds.
 *
 *   fixture-count        — `test/fixtures/keyframes/` has ≥ 15 `*.css` fixtures
 *       (the Q.WD2 named-selector addition lifts 14 → 15) AND each has a
 *       `manifest.json` row (re-asserting proof:roundtrip-fidelity's coverage
 *       invariant on the new fixture). BITE: delete named-selector.css or its
 *       manifest row → the count/coverage drops → reds.
 *
 *   no-source-edit       — the harness rides the unchanged engine + format
 *       surfaces; it carries NO `src/` mutation. BITE: a required `src/` edit is
 *       a finding, surfaced not patched.
 *
 * The behaviour proof rides the chained `vitest run test/grammar-fuzz.test.ts`.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:grammar-fuzz — Q.WD2 S1/S2 (the model-grammar round-trip fuzz oracle)",
);

const CORPUS = "test/fixtures/keyframes";
const TEST = "test/grammar-fuzz.test.ts";

// ── fast-check-present — the new devDependency, declared AND resolvable ────────
{
    const pkg = JSON.parse(read("package.json"));
    const dev = pkg.devDependencies ?? {};
    const declared = typeof dev["fast-check"] === "string";
    let resolvable = false;
    try {
        createRequire(join(root, "package.json")).resolve("fast-check");
        resolvable = true;
    } catch {
        resolvable = false;
    }
    if (!declared) {
        fail(
            "fast-check-present",
            "`fast-check` is not a devDependency — the fuzz harness cannot import it (born-RED today: `npm install --save-dev fast-check`).",
        );
    } else if (!resolvable) {
        fail(
            "fast-check-present",
            "`fast-check` is declared but not resolvable from node_modules — run `npm install`.",
        );
    } else {
        ok(
            "fast-check-present",
            `\`fast-check\` is a devDependency (${dev["fast-check"]}) and resolvable`,
        );
    }
}

// ── harness-exists — the three Arbitrary families over the real surfaces ───────
const requireAll = (clause, file, anchors) => {
    if (!existsSync(join(root, file))) {
        fail(clause, `${file} is missing — the ${clause} contract cannot be locked.`);
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

requireAll("harness-exists", TEST, [
    { name: "imports fast-check", re: /from\s+"fast-check"/ },
    {
        name: "the colorArb family",
        re: /\bcolorArb\b/,
    },
    {
        name: "the mathArb family",
        re: /\bmathArb\b/,
    },
    {
        name: "the keyframeStopArb family",
        re: /\bkeyframeStopArb\b/,
    },
    {
        name: "parses via CSSKeyframesAnimation.fromString",
        re: /CSSKeyframesAnimation[\s\S]*?\.fromString\(/,
    },
    {
        name: "serializes via CSSKeyframesToString (the async whole-block serializer)",
        re: /CSSKeyframesToString\(/,
    },
    {
        name: "the structural round-trip equality (serialize→reparse→serialize byte-stable)",
        re: /structuralRoundTrip|roundTripStructural|structuralSig/,
    },
]);

// ── scoped-green — the none-channel + wrapper-loss arms are PROMOTED green arms
//    (VJ-Q9 consumed via the ^1.2.0 re-pin); round() is a standard arm ────
{
    const file = TEST;
    if (!existsSync(join(root, file))) {
        fail("scoped-green", `${file} is missing.`);
    } else {
        const src = read(file);
        // Q.WG4 GATED consume: value.js 1.2.0 (VJ-Q9) FIXED the none→NaN + color()-wrapper
        // breaches, so the none-channel + wrapper-loss arms are PROMOTED from expected-failure
        // tripwires to STANDARD byte-stable green arms. The `expectKnownBroken` helper (the
        // anti-blocked-harness discipline for value.js 1.1.0) is RETIRED on the promotion —
        // its survival would mean the ^1.2.0 consume never fired.
        const hasNoneChannel = /\bnoneChannelArb\b/.test(src);
        const hasWrapperLoss = /\bwrapperLossArb\b/.test(src);
        const hasExpectKnownBroken = /\bexpectKnownBroken\b/.test(src);
        const hasPromotion = /VJ-Q9|PROMOTED/.test(src);
        // round() unfolds to a STANDARD green arm — it must appear in the mathArb
        // family and must NOT carry a P.W9-era SKIP/it.skip marker.
        const hasRound = /round\(nearest/.test(src);
        const hasObsoleteRoundSkip =
            /it\.skip\([^)]*round|\/\/\s*SKIP[^\n]*round\(/i.test(src);
        const problems = [];
        if (!hasNoneChannel)
            problems.push("the none-channel arm (noneChannelArb) is absent");
        if (!hasWrapperLoss)
            problems.push("the wrapper-loss arm (wrapperLossArb) is absent");
        if (hasExpectKnownBroken)
            problems.push(
                "the expectKnownBroken expected-failure helper is STILL present — value.js 1.2.0 (VJ-Q9) fixed the none→NaN + color()-wrapper breaches; the two arms MUST be PROMOTED to standard byte-stable green arms (the auto-detect-on-fix the ^1.2.0 re-pin fires)",
            );
        if (!hasPromotion)
            problems.push(
                "the VJ-Q9 promotion marker is absent — the none-channel/wrapper-loss arms must be promoted byte-stable arms naming the VJ-Q9 consume",
            );
        if (!hasRound)
            problems.push(
                "the round() arm is absent — Q.WD2 re-scopes it from a P.W9 SKIP to a STANDARD GREEN arm (fixed in value.js 1.1.0)",
            );
        if (hasObsoleteRoundSkip)
            problems.push(
                "an obsolete P.W9-era round() SKIP is present — round() is fixed in value.js 1.1.0; it must be a standard green arm",
            );
        if (problems.length > 0) {
            fail("scoped-green", problems.join("; ") + ".");
        } else {
            ok(
                "scoped-green",
                "none-channel + wrapper-loss are EXPECTED-FAILURE tripwires; round() is a standard green arm (the Q.WD2 re-scope)",
            );
        }
    }
}

// ── fixture-count — every *.css is manifest-covered (the coverage invariant) ───
//
// Q.WD2 S2 INTEGRATION NOTE (the named-selector fixture is BLOCKED on Q.WD1 +
// an upstream value.js gap — diagnosed 2026-06-23): the spec's `named-selector.css`
// addition (lifting the floor 14 → 15) requires `fromString` to INGEST a
// purely-named-selector @keyframes block (`entry`/`exit`/`entry 50%`). On the
// current tree it does NOT: value.js's `extractKeyframes` returns an EMPTY rule
// set for a block whose stops are all named selectors (probe-confirmed:
// `parseCSSStylesheet` PARSES `entry { … }` correctly, but `extractKeyframes`
// drops the named-stop children), so `resolveKeyframes` → `fromString` yields
// ZERO template frames and the fixture serializes to an EMPTY `@keyframes` block.
// A manifest row for it would RED `proof:roundtrip-fidelity` (its ast-authoritative
// clause requires frames ≥ 1 + non-empty keys; its text oracle requires the
// `entry`/`exit` tokens VERBATIM in the serialized output — both impossible while
// the stops are dropped). The fixture + its `roundtrip: "text"` row therefore land
// with Q.WD1 (the adapter named-selector routing) consuming the value.js
// `extractKeyframes` named-stop fix (dispatched to KF-TO-VALUEJS-Q.md). The
// `addFrame("entry", …)` opaque-ingest floor (L.W1 S4) IS intact — only the
// CSS-PARSE path is blocked. This clause asserts the coverage invariant that
// holds NOW + names the Q.WD1-gated +1 (it auto-tightens to ≥ 15 once the
// fixture + its row land, catching an accidental deletion thereafter).
{
    const corpusDir = join(root, CORPUS);
    const manifestPath = join(corpusDir, "manifest.json");
    if (!existsSync(corpusDir) || !existsSync(manifestPath)) {
        fail("fixture-count", `${CORPUS}/manifest.json is missing.`);
    } else {
        const cssFiles = readdirSync(corpusDir).filter((f) => f.endsWith(".css"));
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        const covered = new Set((manifest.fixtures ?? []).map((f) => f.file));
        const uncovered = cssFiles.filter((f) => !covered.has(f));
        const hasNamedSelector = existsSync(join(corpusDir, "named-selector.css"));
        const problems = [];
        // The coverage invariant (re-asserting proof:roundtrip-fidelity's own
        // floor): EVERY *.css must carry a manifest row, AND the named-selector
        // fixture, WHEN PRESENT, must be covered (it lands with Q.WD1).
        if (uncovered.length > 0)
            problems.push(
                `*.css fixtures with no manifest row: ${uncovered.join(", ")}`,
            );
        if (manifest.fixtures.length !== cssFiles.length)
            problems.push(
                `manifest covers ${manifest.fixtures.length} rows but there are ${cssFiles.length} *.css fixtures (the coverage invariant)`,
            );
        // FUTURE_AFTER_WD1: once the named-selector fixture lands (Q.WD1 + the
        // value.js extractKeyframes fix), this clause re-tightens to ≥ 15 and
        // demands the fixture present. Today it is BLOCKED — not a RED here.
        if (hasNamedSelector && !covered.has("named-selector.css"))
            problems.push(
                "named-selector.css is present but has NO manifest row — add its roundtrip:\"text\" row (it round-trips once Q.WD1 + the value.js extractKeyframes named-stop fix land)",
            );
        if (problems.length > 0) {
            fail("fixture-count", problems.join("; ") + ".");
        } else {
            const noteWD1 = hasNamedSelector
                ? "named-selector.css present + covered (Q.WD1 landed)"
                : "named-selector.css is the Q.WD1-gated +1 (BLOCKED on the value.js extractKeyframes named-stop ingest — dispatched)";
            ok(
                "fixture-count",
                `${CORPUS} has ${cssFiles.length} *.css fixtures, all manifest-covered; ${noteWD1}`,
            );
        }
    }
}

// ── no-source-edit — the harness rides the unchanged engine + format surfaces ──
{
    const file = TEST;
    if (existsSync(join(root, file))) {
        const src = read(file);
        const importsEngine = /from "\.\.\/src\/animation\/engine"/.test(src);
        const importsFormat = /from "\.\.\/src\/animation\/format"/.test(src);
        if (importsEngine && importsFormat) {
            ok(
                "no-source-edit",
                "the fuzz round-trip rides the unchanged engine + format surfaces (TEST-ONLY)",
            );
        } else {
            fail(
                "no-source-edit",
                `${file} no longer imports BOTH the engine and the serializer — the round-trip must exercise the real surfaces, not a shim.`,
            );
        }
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:grammar-fuzz — FAIL: the model-grammar fuzz oracle is not fully locked:\n" +
            failures.join("\n") +
            "\n\n  The harness generates random valid @keyframes via fast-check, round-trips\n" +
            "  them through fromString → CSSKeyframesToString → fromString, and asserts\n" +
            "  STRUCTURAL frame equality. The none-channel + color()-wrapper arms are\n" +
            "  EXPECTED-FAILURE tripwires (auto-flip on the VJ-Q9 serialization-fidelity\n" +
            "  fix). The behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:grammar-fuzz — PASS: the fuzz harness is present + scoped-GREEN (the\n" +
        "GREEN-today arms pass; the none-channel + wrapper-loss arms are EXPECTED-\n" +
        "FAILURE tripwires; round() is a standard arm), the named-selector fixture is\n" +
        "manifest-covered. The behaviour proof rides `vitest run " +
        TEST +
        "`.",
);
