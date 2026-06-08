#!/usr/bin/env node
/**
 * proof:dogfood-hero — the inv-ζ gate for the hero's first-paint animation
 * (H.W6 · WV-W6-MED-1: "the demo's signature animation must BE the engine").
 *
 * keyframes.js is a CSS-keyframe ANIMATION library. Its demo's hero "..." — the
 * one animation literally named after the library's domain — was hand-rolled
 * pure CSS (`@keyframes dotFade`), the sharpest inv-ζ violation in the tree: the
 * shop-window hand-authoring the product it exists to sell. H.W6 routes the dots
 * onto the engine itself — a per-dot `CSSKeyframesAnimation` (the
 * `CopyButton.vue` / `typingCursor` / `spinner` dogfood template).
 *
 * THE BITE. A STATIC source assert: `TypingDots.vue` (the hero's dot substrate)
 * imports a kf ENGINE class — `CSSKeyframesAnimation` and/or `NumericAnimation`
 * — from `@src/animation/(engine|index)` (mirrors proof-dogfood.mjs's `IMPORTS_*`
 * regex shape). BITE: the pre-H tree had ZERO kf-engine imports in the dot path
 * (`AnimatedText.vue` was pure CSS) → reds; routing through the engine greens.
 *
 * THE STEPPEDEASE TRAP (WV-W6-MED-1, the load-bearing distinction). `steppedEase`
 * is a `@mkbabb/value.js` export, NOT a kf `@src` symbol. A `from "@src"` grep
 * would NOT match it, and a `steppedEase` import ALONE does not prove inv-ζ — the
 * curve being a library export is necessary but not the dogfood. So this gate
 * asserts the kf ENGINE CLASS import explicitly; `steppedEase` MAY be used as the
 * cadence curve (and is), but it is NOT accepted as the dogfood symbol. A second
 * clause makes that EXPLICIT: it confirms `steppedEase` (if present) resolves
 * from value.js, not from `@src` — so a future author cannot satisfy this gate by
 * importing `steppedEase` from a (wrong) `@src` path and calling it the dogfood.
 *
 * Mirrors proof:dogfood / proof:engine: a re-runnable static instrument, exits 1
 * on any residual. Browser-free (an import edge is a source fact).
 * Re-runnable: `node scripts/proof-dogfood-hero.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPING_DOTS = path.join(
    REPO,
    "demo/@/components/custom/TypingDots.vue",
);
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

// The dogfood symbol: a kf ENGINE CLASS imported from the engine's own light/
// heavy surface. Mirror proof-dogfood.mjs's IMPORTS_* shape exactly (a named
// import from `@src/animation/<module|index>`). The hero's dots loop on a
// per-dot CSSKeyframesAnimation (the PRIMARY path, WV-W6-HIGH-2 — NumericAnimation
// cannot loop); NumericAnimation is accepted as a co-witness for completeness.
const IMPORTS_CSS_KEYFRAMES =
    /import\s*\{[^}]*\bCSSKeyframesAnimation\b[^}]*\}\s*from\s*["']@src\/animation\/(engine|index)["']/;
const IMPORTS_NUMERIC =
    /import\s*\{[^}]*\bNumericAnimation\b[^}]*\}\s*from\s*["']@src\/animation\/(numeric|index)["']/;

// The value.js curve — `steppedEase` MUST resolve from value.js, never from
// `@src` (it is not a kf symbol). This is the negative half of WV-W6-MED-1.
const STEPPED_EASE_FROM_VALUEJS =
    /import\s*\{[^}]*\bsteppedEase\b[^}]*\}\s*from\s*["']@mkbabb\/value\.js["']/;
const STEPPED_EASE_FROM_SRC =
    /import\s*\{[^}]*\bsteppedEase\b[^}]*\}\s*from\s*["']@src\//;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:dogfood-hero — inv ζ (the hero's first-paint animation IS the engine)",
);

if (!fs.existsSync(TYPING_DOTS)) {
    fail(
        `${rel(TYPING_DOTS)} does not exist — the hero's dot substrate (the ` +
            `inv-ζ dogfood seam) is missing (H.W6 S1).`,
    );
} else {
    const src = fs.readFileSync(TYPING_DOTS, "utf8");

    // ── Clause 1 — the kf-engine class import (the dogfood proof) ─────────────
    const hasCss = IMPORTS_CSS_KEYFRAMES.test(src);
    const hasNumeric = IMPORTS_NUMERIC.test(src);
    if (hasCss || hasNumeric) {
        const which = [
            hasCss && "CSSKeyframesAnimation",
            hasNumeric && "NumericAnimation",
        ]
            .filter(Boolean)
            .join(" + ");
        ok(
            `${rel(TYPING_DOTS)} imports the kf engine class ${which} from ` +
                `@src/animation/(engine|index) — the dots loop on the engine ` +
                `itself (the CopyButton/typingCursor/spinner template)`,
        );
    } else {
        fail(
            `${rel(TYPING_DOTS)} imports NO kf engine class — the hero dots are ` +
                `NOT dogfooded (inv ζ violated). Import CSSKeyframesAnimation ` +
                `from "@src/animation/engine" (the per-dot infinite blink, ` +
                `WV-W6-HIGH-2) — NOT steppedEase alone (a value.js curve is not ` +
                `the dogfood symbol, WV-W6-MED-1).`,
        );
    }

    // ── Clause 2 — steppedEase, if used, is the value.js CURVE (not @src) ─────
    // The explicit WV-W6-MED-1 trap-lock: a `steppedEase` from `@src` would be a
    // category error (it is not a kf symbol) AND an attempt to pass the curve
    // off as the dogfood. If `steppedEase` is imported, it MUST be from value.js.
    const usesSteppedEase = /\bsteppedEase\b/.test(src);
    if (!usesSteppedEase) {
        ok(
            `${rel(TYPING_DOTS)} does not reference steppedEase (the curve is ` +
                `optional; the kf-engine class import is the dogfood)`,
        );
    } else if (STEPPED_EASE_FROM_SRC.test(src)) {
        fail(
            `${rel(TYPING_DOTS)} imports steppedEase from @src/ — steppedEase is ` +
                `a @mkbabb/value.js export, NOT a kf symbol (WV-W6-MED-1). The ` +
                `curve is value.js's; the dogfood is the kf ENGINE CLASS import.`,
        );
    } else if (STEPPED_EASE_FROM_VALUEJS.test(src)) {
        ok(
            `${rel(TYPING_DOTS)} imports steppedEase from @mkbabb/value.js — the ` +
                `discrete-cadence CURVE (NOT the dogfood symbol; the kf-engine ` +
                `class import is the inv-ζ proof)`,
        );
    } else {
        fail(
            `${rel(TYPING_DOTS)} references steppedEase but not via a recognized ` +
                `import (expected \`from "@mkbabb/value.js"\`). Resolve the curve ` +
                `explicitly from value.js so the dogfood symbol stays the ` +
                `kf-engine class.`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:dogfood-hero — FAIL (${failures.length}): the hero's first-paint ` +
            `animation does not run on the engine (inv ζ — the shop-window ` +
            `hand-rolls the one animation named after the library's domain).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:dogfood-hero — PASS: the hero dots loop on a kf engine class " +
        "(CSSKeyframesAnimation/NumericAnimation from @src); steppedEase is the " +
        "value.js curve, not the dogfood. inv ζ holds.",
);
