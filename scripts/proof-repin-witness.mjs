// proof:repin-witness — G.W2 S4a (the C1 resolve-count witness; the biting
// close for the −94% computed-endpoint memo on KF's path).
//
// RUN: node scripts/proof-repin-witness.mjs
//
// WHY a standalone .mjs and NOT a vitest bench: the witness must run on the
// PRODUCTION consume path (the built `dist/keyframes.js` resolving value.js
// through its `import`/`default` → `dist/` arm), exactly as `proof:interp-
// fastprops` runs its `%HasFastProperties` probe outside the vitest transform.
// It loads the real engine via `loadAnimationEngine()` and stands up a jsdom so
// a computed endpoint has a DOM target to bind to.
//
// THE CLAUSE — C1 endpoint-memo resolve count drops O(frames)→O(1):
//   A `calc(100% - …px)` endpoint bound to a target produces an
//   `InterpolatedVar` with `computed: true` whose per-frame `iv._lerp` is
//   value.js's `lerpComputedValue`. On `0.10.0` that re-resolved both endpoints
//   via `getComputedValue` EVERY frame (O(frames)); on `0.11.0` it memoizes the
//   resolved `(startN, stopN)` in `iv._computedCache`, keyed on `(target,
//   layoutEpoch)`, so a steady 600-frame window pays the resolve ONCE — the
//   `iv._computedCache` reference is freshly written exactly 1×, then reused.
//
//   The witness counts `iv._computedCache` fresh-writes across a 600-frame
//   steady window. PASS ⇒ exactly 1 (O(1) — the memo is on kf's path). A bare
//   re-pin onto a value.js WITHOUT the C1 memo would re-resolve every frame ⇒
//   600 fresh writes (O(frames)) ⇒ the witness reds — the finding
//   `a-deferred-ledger §0 RP-2` names ("the memo isn't on kf's path").
//
//   NEGATIVE CONTROL (the instrument bites): the FLAT numeric leaf carries NO
//   `_computedCache` and `computed === false` — proving the witness measures the
//   computed path specifically, not an artifact of frame iteration.
//
// The gate builds the library first when dist is missing/stale, so it always
// measures the CURRENT engine source against the CURRENTLY-PINNED value.js
// (a re-pin BACK to a memo-less value.js reds clause 1 after the rebuild).

import { execSync } from "node:child_process";
import { existsSync, statSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distPath = join(root, "dist", "keyframes.js");
const srcDir = join(root, "src", "animation");

function newestMtime(dir) {
    let newest = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        const m = entry.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs;
        if (m > newest) newest = m;
    }
    return newest;
}

if (!existsSync(distPath) || statSync(distPath).mtimeMs < newestMtime(srcDir)) {
    console.log("[proof:repin-witness] building library (dist stale/missing)…");
    execSync("npm run build:lib", { cwd: root, stdio: "inherit" });
}

// Stand up a jsdom realm so a computed endpoint has a DOM target + layout APIs.
const dom = new JSDOM(`<!DOCTYPE html><body></body>`, { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(0), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const { loadAnimationEngine } = await import(pathToFileURL(distPath).href);
const { CSSKeyframesAnimation } = await loadAnimationEngine();

let failed = false;
const check = (name, cond, detail) => {
    console.log(`${cond ? "  ✓" : "  ✗"} ${name}${detail ? ` — ${detail}` : ""}`);
    if (!cond) failed = true;
};

console.log(
    "proof:repin-witness — G.W2 S4a · the C1 endpoint-memo resolve-count witness\n",
);

const FRAMES = 600;

// Reach the compiled frames + the computed InterpolatedVar.
const computedAnim = () => {
    const host = document.createElement("div");
    host.style.cssText = "container-type: inline-size; width: 1000px;";
    const box = document.createElement("div");
    host.appendChild(box);
    document.body.appendChild(host);
    const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
        "0% { width: calc(100% - 10px); } 100% { width: calc(100% - 200px); }",
    );
    anim.setTargets(box);
    return anim;
};

// ── Clause 1 — the steady-state resolve count is O(1) ────────────────────────
console.log(
    "clause 1 — the computed endpoint resolves O(1) over a 600-frame steady window:",
);

const a = computedAnim();
const frames = a.frames;
const iv0 = frames?.[0]?.allInterpVars?.[0];

check(
    "the calc() leaf is a COMPUTED InterpolatedVar (computed === true, computed _lerp)",
    Boolean(iv0) && iv0.computed === true && typeof iv0._lerp === "function",
    iv0 ? `start.unit=${iv0.start?.unit}, targets=${iv0.start?.targets?.length}` : "no iv",
);

// Count `_computedCache` fresh-writes across the steady window: a new reference
// on `iv._computedCache` is one endpoint (re)resolution (it stores the freshly
// `getComputedValue`-resolved startN/stopN). O(1) ⇒ written once; O(frames) ⇒
// written every frame.
let writes = 0;
let prev;
const out = {};
for (let f = 0; f < FRAMES; f++) {
    a.interpFrames((f / FRAMES) * 1000, false, out);
    const cache = frames[0].allInterpVars[0]._computedCache;
    if (cache !== prev) {
        writes++;
        prev = cache;
    }
}

check(
    `_computedCache fresh-writes over ${FRAMES} frames === 1 (O(1), the C1 memo on kf's path)`,
    writes === 1,
    `measured ${writes} (O(frames) would be ${FRAMES}; the −94% / O(frames)→O(1) drop)`,
);

// ── Negative control — the instrument bites the computed path specifically ───
console.log(
    "\nnegative control — a NUMERIC leaf carries no _computedCache (the witness is specific):",
);
const numeric = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
    "0% { opacity: 0; } 100% { opacity: 1; }",
);
const nIv = numeric.frames?.[0]?.allInterpVars?.[0];
check(
    "numeric leaf reads computed === false and never writes _computedCache",
    Boolean(nIv) && nIv.computed === false && nIv._computedCache === undefined,
    nIv ? `computed=${nIv.computed}` : "no iv",
);

console.log("");
if (failed) {
    console.error(
        "proof:repin-witness — FAILED: the C1 endpoint memo is NOT collapsing " +
            "the resolve count on kf's path (a-deferred-ledger §0 RP-2).",
    );
    process.exit(1);
}
console.log(
    `proof:repin-witness — PASS: the computed endpoint resolves O(1) (1 fresh ` +
        `resolve over ${FRAMES} steady frames). The value.js 0.11.0 C1 memo is ` +
        `live on kf's path through the lerpValue → iv._lerp seam.`,
);
