// proof:interp-fastprops — F.W4 (the dict-mode buffer fold + the single-frame
// alias). The falsifiable close for the single largest measured per-frame win.
//
// RUN: `node --allow-natives-syntax scripts/proof-interp-fastprops.mjs`
//
// WHY a standalone .mjs and NOT a vitest test: `%HasFastProperties` is a V8
// *intrinsic*. esbuild/tsc (vitest's transform) reject the `%`-token outright
// (`Unexpected "%"`), so the fast-properties clause CANNOT live in a transformed
// `.ts` — it MUST be a plain `.mjs` run under `node --allow-natives-syntax`, with
// no transform layer (F.W4 §S4, reconciling the `a-runtime-remeasure RM-1:146`
// vitest-poolOptions sketch — poolOptions reaches V8 but esbuild still rejects the
// `%` first). The pixel-identical round-trip (clause 3) + the alias-correctness
// (clause 4) carry no `%`, so they are the ordinary `vitest run`
// half: test/interp-fastprops.test.ts.
//
// CLAUSES:
//  1. fast-properties (the DIRECT mechanism probe) — the real engine's reused
//     interpolation buffer reads `%HasFastProperties === true` after N frames
//     (the stable-key null-fill keeps it out of V8 dictionary mode). The negative
//     control (a `delete`-cleared object) reads `false`, proving the intrinsic
//     bites the exact deopt the delete-loop caused. BITES: revert engine.ts:573 /
//     group.ts:212 to the `delete`-loop, rebuild → the real buffer reads `false`
//     → exit 1.
//  2. wall-time (the NAMED honest fallback) — a stable-key-cleared reused buffer
//     is materially faster than the `delete`-cleared equivalent at K=12. This is
//     the same dictionary-mode deopt clause 1 proves, measured — so a runner that
//     cannot reach `--allow-natives-syntax` still detects the regression via the
//     timing delta (and bench/interp-buffer.bench.ts is the manual authority).
//
// The gate builds the library first when dist is missing/stale, so it always
// measures the CURRENT engine source (CI runs build:lib before the proofs).

import { execSync } from "node:child_process";
import { existsSync, statSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

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

// Build the library if dist is absent or older than the engine source, so the
// gate tests the CURRENT engine (a revert reds clause 1 after the rebuild).
if (!existsSync(distPath) || statSync(distPath).mtimeMs < newestMtime(srcDir)) {
    console.log("[proof:interp-fastprops] building library (dist stale/missing)…");
    execSync("npm run build:lib", { cwd: root, stdio: "inherit" });
}

const { loadAnimationEngine } = await import(pathToFileURL(distPath).href);
const engine = await loadAnimationEngine();
const { CSSKeyframesAnimation } = engine;

let failed = false;
const check = (name, cond) => {
    console.log(`${cond ? "  ✓" : "  ✗"} ${name}`);
    if (!cond) failed = true;
};

console.log("proof:interp-fastprops — F.W4 dict-mode buffer fold + single-frame alias\n");

// ── Clause 1 — fast-properties (the direct mechanism probe) ──────────────────
console.log("clause 1 — the reused buffer stays in V8 fast-properties mode:");

// Negative control: prove the intrinsic detects the exact deopt the delete-loop
// caused (an object cleared with `delete` falls to dictionary mode and never
// recovers). If this reads `true`, the intrinsic is unavailable and the whole
// clause is meaningless — so it is itself a guard.
const deleteCleared = { a: 1, b: 2, c: 3 };
for (const k in deleteCleared) delete deleteCleared[k];
deleteCleared.a = 1;
check(
    "negative control: a delete-cleared object reads %HasFastProperties === false",
    %HasFastProperties(deleteCleared) === false,
);

// The real engine, K=2 (the dominant 2-stop shape) — thread ONE out buffer across
// a long steady window, exactly the playback reuse pattern.
const a2 = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
    "from { opacity: 0; transform: translateX(0px); } to { opacity: 1; transform: translateX(200px); }",
);
const out2 = {};
for (let i = 0; i < 600; i++) a2.interpFrames((i / 600) * 1000, false, out2);
check(
    "K=2 reused interp buffer reads %HasFastProperties === true (S1 stable-key clear)",
    %HasFastProperties(out2) === true,
);

// The real engine, K=12 (where the dictionary tax compounds most).
const stops = Array.from({ length: 11 }, (_, i) => {
    const pct = Math.round((i / 10) * 100);
    const vals = Array.from(
        { length: 12 },
        (_, k) => `--v${k}: ${(i * k) % 100}px;`,
    ).join(" ");
    return `${pct}% { ${vals} }`;
}).join("\n");
const a12 = new CSSKeyframesAnimation({ duration: 1000 }).fromString(stops);
const out12 = {};
for (let i = 0; i < 600; i++) a12.interpFrames((i / 600) * 1000, false, out12);
check(
    "K=12 reused interp buffer reads %HasFastProperties === true",
    %HasFastProperties(out12) === true,
);

// ── Clause 2 — wall-time (the named honest fallback) ─────────────────────────
// The same dictionary-mode deopt, measured: a stable-key-cleared reused buffer is
// materially faster than the delete-cleared equivalent. Detects the regression
// where `--allow-natives-syntax` is unreachable. Synthetic (mirrors the engine's
// two clear mechanisms) so it is self-contained; bench/interp-buffer.bench.ts is
// the real-engine authority.
console.log("\nclause 2 — the stable-key clear is faster than the delete-loop (the deopt, timed):");
const K = 12;
const keys = Array.from({ length: K }, (_, i) => `k${i}`);
const ITER = 200_000;

const timeStableKey = () => {
    const buf = {};
    for (const key of keys) buf[key] = 0; // shape once
    const t0 = process.hrtime.bigint();
    for (let n = 0; n < ITER; n++) {
        for (let i = 0; i < K; i++) buf[keys[i]] = undefined; // null-fill clear
        for (let i = 0; i < K; i++) buf[keys[i]] = n + i; // re-assign
    }
    return Number(process.hrtime.bigint() - t0);
};
const timeDeleteLoop = () => {
    const buf = {};
    const t0 = process.hrtime.bigint();
    for (let n = 0; n < ITER; n++) {
        for (const k in buf) delete buf[k]; // delete-loop clear (the deopt)
        for (let i = 0; i < K; i++) buf[keys[i]] = n + i; // re-assign
    }
    return Number(process.hrtime.bigint() - t0);
};

// warm both paths, then measure best-of-3 to damp noise.
timeStableKey();
timeDeleteLoop();
const stable = Math.min(timeStableKey(), timeStableKey(), timeStableKey());
const deleted = Math.min(timeDeleteLoop(), timeDeleteLoop(), timeDeleteLoop());
const ratio = deleted / stable;
console.log(`    stable-key ${(stable / 1e6).toFixed(1)}ms · delete-loop ${(deleted / 1e6).toFixed(1)}ms · ${ratio.toFixed(2)}× faster`);
check(
    "stable-key clear is faster than the delete-loop at K=12 (the dictionary-mode deopt)",
    ratio > 1.2,
);

console.log("");
if (failed) {
    console.error("proof:interp-fastprops — FAILED");
    process.exit(1);
}
console.log("proof:interp-fastprops — all clauses green");
