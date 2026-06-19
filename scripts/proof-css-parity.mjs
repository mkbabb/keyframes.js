// proof:css-parity — keyframes.js M.W11 (the consume-confidence gate).
//
// THE REAL OBSERVABLE (inv-M-observable-truth): keyframes.js consumes value.js's
// CSS grammar to ingest @keyframes. Three classes of input USED to fail on the
// value.js 0.13.0 keyframes.js shipped against — they THREW or silently lost
// data, corrupting animations on ingest:
//   (1) @keyframes nested inside @layer/@media/@scope were INVISIBLE to
//       extractKeyframes — CSSKeyframesAnimation.fromString() produced an empty
//       animation (the kf-critical gap closed by value.js O.W4).
//   (2) linear-gradient(red, blue) THREW (the value.js handleGradient P0).
//   (3) CSS Nesting `.a { .b {} }` THREW (the value.js stylesheet P0).
//
// This gate runs the REAL kf engine over the REAL consumed value.js@1.0.0 and
// asserts the CURED behaviour — NOT a source-grep, NOT a version-string check.
// Born-RED on value.js 0.13.0 (the crashes/empties); GREEN on the value.js O
// grammar (comprehensive 2026+ grammar + the extractKeyframes depth-walk).
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../dist/keyframes.js");
if (!existsSync(dist)) {
    console.error("FAIL: dist/keyframes.js missing — run `npm run build:lib` first.");
    process.exit(1);
}

const { loadAnimationEngine } = await import(dist);
const { CSSKeyframesAnimation } = await loadAnimationEngine();
// value.js is the consumed grammar — reach it through the same resolution kf uses.
const { parseCSSValue, parseCSSStylesheet } = await import("@mkbabb/value.js");

let failed = false;
const check = (id, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
    if (!ok) failed = true;
};

// C1 — @layer-nested @keyframes is FOUND via the kf engine (the headline fix).
try {
    const css = "@layer base { @keyframes fade { from { opacity: 0 } to { opacity: 1 } } }";
    const anim = new CSSKeyframesAnimation({}).fromString(css);
    const frameCount = anim.frames?.length ?? 0;
    check("C1-layer-keyframes", frameCount > 0,
        `@layer-nested @keyframes ingests via CSSKeyframesAnimation.fromString — ${frameCount} frame(s)`);
} catch (e) {
    check("C1-layer-keyframes", false, `THREW: ${e.message}`);
}

// C2 — @media>@supports-nested @keyframes also found (depth-walk, not just @layer).
try {
    const css = "@media (min-width: 1px) { @supports (opacity: 0) { @keyframes slide { from { left: 0 } to { left: 10px } } } }";
    const anim = new CSSKeyframesAnimation({}).fromString(css);
    check("C2-deep-nest-keyframes", (anim.frames?.length ?? 0) > 0,
        `@media>@supports-nested @keyframes ingests — ${anim.frames?.length ?? 0} frame(s)`);
} catch (e) {
    check("C2-deep-nest-keyframes", false, `THREW: ${e.message}`);
}

// C3 — linear-gradient value parses (the P0 crash, fixed value.js-side).
try {
    const v = parseCSSValue("linear-gradient(red, blue)");
    check("C3-linear-gradient", v != null && String(v).includes("linear-gradient"),
        `parseCSSValue("linear-gradient(red, blue)") does not throw → ${String(v).slice(0, 40)}`);
} catch (e) {
    check("C3-linear-gradient", false, `THREW: ${e.message}`);
}

// C4 — CSS Nesting does not crash (the P0 stylesheet fix).
try {
    const sheet = parseCSSStylesheet(".a { color: blue; .b { color: red; } }");
    check("C4-css-nesting", Array.isArray(sheet) && sheet.length > 0,
        `parseCSSStylesheet(".a { .b {} }") does not throw → ${sheet.length} item(s)`);
} catch (e) {
    check("C4-css-nesting", false, `THREW: ${e.message}`);
}

// C5 — linear() easing round-trips with space-separated position hints.
try {
    const s = parseCSSValue("linear(0, 0.5 50%, 1)").toString();
    check("C5-linear-spacing", s === "linear(0, 0.5 50%, 1)",
        `linear() position hint space-separated → "${s}"`);
} catch (e) {
    check("C5-linear-spacing", false, `THREW: ${e.message}`);
}

console.log(
    `\nproof:css-parity ${failed ? "FAIL" : "GREEN"} — kf consumes value.js@1.0.0; the P0/nesting/depth-walk cases are cured.`,
);
process.exit(failed ? 1 : 0);
