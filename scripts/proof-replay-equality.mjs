#!/usr/bin/env node
/**
 * proof:replay-equality — the L.W1 Replay-equality FLOOR (Band A). The
 * round-trip's full-surface honesty law: every parsed field round-trips
 * correctly OR refuses with a named reason — never a silent drop
 * (`inv-L-totality`, elevating the `serializeEasing` THROW idiom from easing to
 * the whole parsed surface).
 *
 * K's Band II established replay-equality for a well-defined SUBSET (structural
 * + easing + computed-unit axes — gated by `proof:roundtrip-fidelity` +
 * `proof:compile-replay`). FIVE parity holes remain in the SHIPPED 4.3.0
 * surface — all SILENTLY pass today because no fixture exercises any of them
 * (Lane 33, audit W89). value.js 0.13.0 already exposes the required symbols
 * (`Declaration.important`, `PropertyDescriptor` + `serializeStylesheetItem`,
 * `KeyframeRule.composition`, `KeyframeSelector { kind:"named" }`,
 * `CSSAnimationOptions.composition`); the gap is that none are CONSUMED on the
 * serialize/round-trip path. This gate enforces their consumption, born-RED on
 * the breach inputs.
 *
 * Structure (the `proof:compile-replay` pattern): a SOURCE-GREP half (the five
 * cure-only wiring anchors that do NOT exist on today's tree) CHAINED in
 * package.json with the BEHAVIOUR half (`vitest run test/replay-equality.test.ts`
 * — the five breach round-trips). It does NOT re-implement the round-trip
 * (that lives in the .test.ts); it asserts the cure is wired, and BITES on a
 * deleted lock. The anchors are POST-CURE-ONLY: each names a symbol/literal
 * absent from the uncured source (a breach comment that NAMES the field is not
 * matched), so the gate is RED today by construction and false-passes on
 * NOTHING.
 *
 * CLAUSES (each BITES — one per breach S-clause):
 *
 *   important-honor      — S1 (viol31/W116). `declaredKeyframeBody` (`format.ts`)
 *       must EMIT `!important` when the stored declaration is important. The
 *       `!important` token does not exist anywhere in today's `format.ts`. BITE:
 *       drop the emit → a parse–format–reparse of `opacity: 0 !important` loses
 *       the priority flag → a cascaded override breaks on re-ship → reds.
 *
 *   property-backward    — S2 (viol15/W75). `format.ts` must IMPORT
 *       `serializeStylesheetItem` from `@mkbabb/value.js` (the published
 *       `@property` backward path, not yet imported) so `CSSKeyframesToString`
 *       can prepend `@property` blocks from `animation.propertyRegistry`. BITE:
 *       drop the import edge → a compiled artifact loses its `@property` typing
 *       block on re-ship (`--custom` falls back to `<universal>`) → reds.
 *
 *   composition-per-stop — S3 (viol16/W76). `declaredKeyframeBody` is
 *       asymmetric: it emits per-stop `animation-timing-function` but never
 *       per-stop `animation-composition`. The cure reads
 *       `templateFrame.composition` IN the body emitter — a read that does not
 *       exist in today's `format.ts`. BITE: drop the per-stop composition emit →
 *       a round-tripped `add` stop re-parses as silent `replace` → the declared
 *       layering is discarded → reds.
 *
 *   named-selector       — S4 (viol17/W118). `frame-compiler.ts`'s selector
 *       guard (`SELECTOR_KEYWORD_RE = /^(?:from|to)$/i`) THROWS on the four
 *       value.js `kind:"named"` scroll-range tokens (`entry`/`exit`/`cover`/
 *       `contain`). The cure extends the grammar to accept them. The token
 *       `entry` does not appear in today's guard. BITE: revert the guard → a
 *       scroll-driven `@keyframes` with `entry`/`exit` THROWS instead of
 *       animating (a K.W9 ScrollScene regression) → reds.
 *
 *   composite-floor      — S5 Band A (W117). `AnimationOptions` (`constants.ts`)
 *       does not carry `composite` (the layer-level `animation-composition` that
 *       value.js 0.13.0's `extractAnimationOptions` DOES surface as
 *       `CSSAnimationOptions.composition`). The cure adds `composite?:
 *       CompositeOperator` — a FIELD declaration (`composite?:`) that does not
 *       exist today (only the per-keyframe `composition?:` and prose mentions of
 *       "composite" do). BITE: drop the field → a layer-level
 *       `animation-composition: add` shorthand/longhand drops on re-ship → the
 *       engine sits in the wrong layer-level mode → reds.
 *       (The `playState` half is value.js-Tranche-O dispatch-blocked — NOT a
 *       clause of this gate; see `KF-TO-VALUEJS-O-ASKS.md`.)
 *
 * Mirrors `proof:compile-replay` / `proof:roundtrip-fidelity`: exits 1 on any
 * residual. The behaviour proof rides `vitest run test/replay-equality.test.ts`
 * (chained in package.json).
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
    "proof:replay-equality — L.W1 the Replay-equality FLOOR (five Band-A breach round-trips)",
);

const FORMAT = "src/animation/compile/backward/format.ts";
const FRAME_COMPILER = "src/animation/compile/frame-compiler.ts";
// R.W2b carved the keyframe-SELECTOR grammar (the named-range regexes,
// `NAMED_SELECTOR_SUPERTYPE`, the `namedSelectorToFraction` resolver) off
// frame-compiler.ts into the colocated selector.ts; the named-selector clause
// reads the compile-SELECTOR surface (both files) so its anchors stay asserted.
const SELECTOR = "src/animation/compile/selector.ts";
const ENGINE = "src/animation/engine/animation.ts";
// R.W2 — `bindTimeline` (the named-selector attach-time resolution) lives in the
// carved `engine/css/css-animation.ts` CSS subclass; the play-time guard
// (`assertNoUnresolvedNamedSelector`) stays on the base class as a delegate.
const CSS_ANIMATION = "src/animation/engine/css/css-animation.ts";
// S.B1 — the constants monolith carved into constants/{types,defaults}.ts; the
// composite-floor anchor (`AnimationOptions.composite?: CompositeOperator`) is a
// TYPE declaration and lives on the LIGHT-pure types module.
const CONSTANTS = "src/animation/constants/types.ts";
const TEST = "test/replay-equality.test.ts";

/** Assert every anchor is present in `file`; the clause reds on any missing. */
const requireAll = (clause, file, anchors) => {
    // `file` may be a single path or an array of paths whose concatenation is the
    // surface (R.W2b — a carve can split a clause's anchors across sibling files).
    const files = Array.isArray(file) ? file : [file];
    const label = files.join(" + ");
    const missingFiles = files.filter((f) => !existsSync(join(root, f)));
    if (missingFiles.length > 0) {
        fail(clause, `${missingFiles.join(", ")} does not exist.`);
        return;
    }
    const src = files.map((f) => read(f)).join("\n");
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${label} is missing: ${missing.map((m) => m.name).join("; ")} — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${label} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

// ── S1 — !important — CORRECTED (the audit premise was factually wrong) ─────────
// The original S1 clause asserted format.ts must EMIT `!important` inside a
// `@keyframes` block. That is SPEC-INVALID: per CSS Animations §3 (L1 AND the L2
// draft) a declaration in a keyframe qualified `!important` is INVALID and the
// whole declaration is IGNORED — value.js 0.13.0's `liftKeyframeMetadata` drops
// it at the AST level, exactly as a browser does. So "kf silently drops keyframe
// !important" was never a kf breach; kf mirroring the platform drop is CORRECT.
// Re-emitting it would make kf ship invalid CSS AND animate a frame a browser
// ignores — breaking replay-equality. The honest position (inv-L-totality + inv ε):
//   • there is NO source cure to lock — the SPEC-FAITHFUL behaviour (no keyframe
//     `!important` ever emitted) is the regression-lock, asserted BEHAVIOURALLY in
//     test/replay-equality.test.ts S1 (`not.toContain("!important")`), not by a
//     source-grep anchor here;
//   • the no-silent-drop LAW (surface the spec-mandated drop as a DIAGNOSTIC) is a
//     value.js-Tranche-O dispatch dep — value.js must SURFACE the dropped invalid
//     decl before kf can emit the diagnostic without re-parsing. Booked in
//     KF-TO-VALUEJS-O-ASKS.md; the kf-side consume opens Band-B (L.W9), exactly the
//     S5 `playState` split. NOT a clause of this Band-A gate.

// ── property-backward — S2: the `serializeStylesheetItem` import edge ───────────
// Cure-only: today's format.ts value.js import block does NOT carry
// `serializeStylesheetItem`. Read the import block specifically — a comment that
// names the symbol must not false-pass the clause.
{
    const formatSrc = existsSync(join(root, FORMAT)) ? read(FORMAT) : "";
    const m = /import\s*\{([\s\S]*?)\}\s*from\s*["']@mkbabb\/value\.js["']/.exec(
        formatSrc,
    );
    const valueImports = m ? m[1] : "";
    if (/\bserializeStylesheetItem\b/.test(valueImports)) {
        ok(
            "property-backward",
            "format.ts IMPORTS serializeStylesheetItem (the @property backward-serialize path is wired)",
        );
    } else {
        fail(
            "property-backward",
            "format.ts does not IMPORT serializeStylesheetItem from @mkbabb/value.js — `CSSKeyframesToString` cannot prepend the @property typing blocks from `animation.propertyRegistry`; the typing block is silently lost on re-ship.",
        );
    }
}

// ── composition-per-stop — S3: the per-stop `animation-composition` emit ────────
// Cure-only: `templateFrame.composition` is NOT read in today's format.ts (the
// existing `animationComposition()` helper takes a `composition` ARGUMENT and is
// the layer-level longhand — a DIFFERENT path; matching the per-stop body's read
// of `templateFrame.composition` avoids that pre-existing symbol).
requireAll("composition-per-stop", FORMAT, [
    {
        name: "declaredKeyframeBody reads templateFrame.composition (the per-stop composition emit — symmetric with per-stop easing)",
        re: /templateFrame\.composition/,
    },
]);

// ── named-selector — S4: RE-TARGETED off the source-shape proxy onto the
//    DEFERRED-RESOLUTION cure shape (Q.WD1 — DM-22 proper cure) ─────────────────
// The OLD S4 clause was a blind source-shape regex (`/entry|exit|cover|contain/`
// appears in the guard) — GREEN when "the token set appears", BLIND to whether the
// frame times are NaN (the inv-M-observable-truth proxy failure DM-22 escaped for
// 4 tranches). Q.WD1 RE-TARGETS it onto the cure SHAPE: (1) the opaque-ingest floor
// holds (NO parse-time throw — the reverted Path-A trap); (2) the `bindTimeline`
// attach-time resolver seam exists (`namedSelectorToFraction`); (3) the play-time
// `NAMED_SELECTOR_NO_TIMELINE` guard exists. The LIVE behavioural witness (the
// round-trip verbatim + no-NaN-at-play + play-throws-no-timeline RUNTIME
// observables) is `proof:nan-frame` — the durable standing proof; this clause
// locks the cure is the deferred-resolution shape, NOT a parse-throw relapse.
requireAll("named-selector", [FRAME_COMPILER, SELECTOR], [
    {
        name: "the named selectors ingest OPAQUELY (NAMED_SELECTOR_SUPERTYPE), NOT a parse-time throw (the L.W1 S4 floor — fromString must not throw)",
        re: /NAMED_SELECTOR_SUPERTYPE/,
    },
    {
        name: "the attach-time deferred-resolution seam: namedSelectorToFraction (named phase → numeric % at bindTimeline)",
        re: /export\s+const\s+namedSelectorToFraction\b/,
    },
]);
requireAll("named-selector", CSS_ANIMATION, [
    {
        name: "bindTimeline resolves named selectors to numeric % at attach (the deferred-resolution seam — Q.WD1-bind S2)",
        re: /bindTimeline\s*\(\s*timeline\s*:\s*Timeline\s*\)/,
    },
]);
requireAll("named-selector", ENGINE, [
    {
        name: "the play-time NAMED_SELECTOR_NO_TIMELINE guard (assertNoUnresolvedNamedSelector) — fires at play/at, NEVER at parse",
        re: /assertNoUnresolvedNamedSelector|NAMED_SELECTOR_NO_TIMELINE/,
    },
]);

// ── composite-floor — S5 (Band A): `composite` on `AnimationOptions` ────────────
// Cure-only: the FIELD declaration `composite?:` does NOT exist today (only the
// per-keyframe `composition?:` field + prose mentions of the word "composite").
// Anchor on the `composite?:` field syntax so the prose/`composition?:` near-misses
// cannot false-pass it.
requireAll("composite-floor", CONSTANTS, [
    {
        name: "AnimationOptions carries `composite?: CompositeOperator` (the layer-level animation-composition round-trip field)",
        re: /\bcomposite\?\s*:\s*CompositeOperator\b/,
    },
]);

// ── no-source-edit (behaviour seam) — the round-trip rides the real engine ──────
// The five breach round-trips must exercise the REAL serialize surfaces, not a
// shim: the test imports the engine + the format module (the same edges
// `compile-roundtrip` / `roundtrip-easing` use).
{
    const src = existsSync(join(root, TEST)) ? read(TEST) : "";
    const importsEngine = /from "\.\.\/src\/animation\/engine"/.test(src);
    const importsFormat = /from "\.\.\/src\/animation\/compile\/backward\/format"/.test(src);
    if (importsEngine && importsFormat) {
        ok(
            "no-source-edit",
            "the breach round-trips ride the unchanged engine + format surfaces (TEST-ONLY)",
        );
    } else {
        fail(
            "no-source-edit",
            `${TEST} no longer imports BOTH the engine (CSSKeyframesAnimation) and the format module (CSSKeyframesToString) — the round-trip must exercise the real serialize surfaces, not a shim.`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:replay-equality — FAIL: the full-surface replay-equality floor is not fully locked:\n" +
            failures.join("\n") +
            "\n\n  inv-L-totality: every parsed field round-trips correctly OR refuses\n" +
            "  with a NAMED reason — never a silent drop. Five Band-A holes remain in\n" +
            "  the shipped surface (`!important`, `@property`, per-stop composition,\n" +
            "  named scroll selectors, the layer-level `composite` option). Restore the\n" +
            "  wiring each anchor names. The behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:replay-equality — PASS: the Band-A breach classes round-trip honestly —\n" +
        "`@property` blocks re-emit via serializeStylesheetItem, per-stop\n" +
        "`animation-composition` is symmetric with per-stop easing, the value.js\n" +
        "`kind:\"named\"` scroll selectors ingest without throw, and the layer-level\n" +
        "`animation-composition` rides `options.composite`. S1 keyframe `!important`\n" +
        "is SPEC-FAITHFULLY dropped (CSS Animations §3 — invalid in a keyframe; the\n" +
        "test locks `not.toContain(\"!important\")`); the no-silent-drop diagnostic is a\n" +
        "value.js-O dispatch (KF-TO-VALUEJS-O-ASKS.md #12), consumed Band-B (L.W9).\n" +
        "The behaviour proof rides `vitest run " +
        TEST +
        "`.",
);
