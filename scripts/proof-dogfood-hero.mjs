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
    "demo/@/components/custom/editor-shell/TypingDots.vue",
);
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

// The dogfood symbol: a kf ENGINE CLASS sourced from the engine's own light/
// heavy surface. Mirror proof-dogfood.mjs's IMPORTS_* shape (a named import from
// `@src/animation/<module|index>`) — AND, since L.W8's publish/dogfood completion
// migrated the demo to consume the PUBLISHED `@mkbabb/keyframes.js`, ALSO accept
// the sanctioned heavy-surface access the published demo uses: a CSSKeyframesAnimation
// destructured out of `await loadAnimationEngine()` (the documented dynamic boundary
// in CLAUDE.md — the heavy class is NOT a static named export; only `import type` is).
// Either path proves the dots loop on the kf engine itself; the BITE (a hero with NO
// kf engine class at all) is unchanged. The hero's dots loop on a per-dot
// CSSKeyframesAnimation (the PRIMARY path, WV-W6-HIGH-2 — NumericAnimation cannot
// loop); NumericAnimation is accepted as a co-witness for completeness.
const IMPORTS_CSS_KEYFRAMES =
    /import\s*\{[^}]*\bCSSKeyframesAnimation\b[^}]*\}\s*from\s*["']@src\/animation\/(engine|index)["']/;
const IMPORTS_NUMERIC =
    /import\s*\{[^}]*\bNumericAnimation\b[^}]*\}\s*from\s*["']@src\/animation\/(numeric|index)["']/;
// L.W8 publish-surface dogfood path: `loadAnimationEngine()` is imported from the
// published `@mkbabb/keyframes.js`, and the engine class is destructured from its
// resolved value (`const { CSSKeyframesAnimation } = await loadAnimationEngine()`).
// This IS the inv-ζ dogfood on the published surface (the heavy class reaches the
// demo ONLY through loadAnimationEngine — the static/dynamic boundary).
const IMPORTS_LOAD_ENGINE =
    /import\s*\{[^}]*\bloadAnimationEngine\b[^}]*\}\s*from\s*["']@mkbabb\/keyframes\.js["']/;
const DESTRUCTURES_ENGINE_CLASS =
    /\{[^}]*\b(?:CSSKeyframesAnimation|NumericAnimation)\b[^}]*\}\s*=\s*await\s+loadAnimationEngine\s*\(/;

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

    // ── Clause 1 — the kf-engine class dogfood (the dogfood proof) ────────────
    // Either the @src static import (pre-L.W8) OR the published-surface
    // loadAnimationEngine() destructure (L.W8 publish/dogfood completion) proves
    // the dots loop on the kf engine itself.
    const hasCss = IMPORTS_CSS_KEYFRAMES.test(src);
    const hasNumeric = IMPORTS_NUMERIC.test(src);
    const hasLoadEngine =
        IMPORTS_LOAD_ENGINE.test(src) && DESTRUCTURES_ENGINE_CLASS.test(src);
    if (hasCss || hasNumeric || hasLoadEngine) {
        const which = [
            hasCss && "CSSKeyframesAnimation (@src)",
            hasNumeric && "NumericAnimation (@src)",
            hasLoadEngine &&
                "CSSKeyframesAnimation/NumericAnimation (via loadAnimationEngine() — the published heavy-surface boundary)",
        ]
            .filter(Boolean)
            .join(" + ");
        ok(
            `${rel(TYPING_DOTS)} sources the kf engine class ${which} — the dots ` +
                `loop on the engine itself (the CopyButton/typingCursor/spinner template)`,
        );
    } else {
        fail(
            `${rel(TYPING_DOTS)} sources NO kf engine class — the hero dots are ` +
                `NOT dogfooded (inv ζ violated). Either import CSSKeyframesAnimation ` +
                `from "@src/animation/engine" OR destructure it from ` +
                `\`await loadAnimationEngine()\` of "@mkbabb/keyframes.js" (the per-dot ` +
                `infinite blink, WV-W6-HIGH-2) — NOT steppedEase alone (a value.js ` +
                `curve is not the dogfood symbol, WV-W6-MED-1).`,
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
        "(CSSKeyframesAnimation/NumericAnimation from @src OR via loadAnimationEngine() " +
        "of the published @mkbabb/keyframes.js — the heavy-surface boundary); steppedEase " +
        "is the value.js curve, not the dogfood. inv ζ holds.",
);
