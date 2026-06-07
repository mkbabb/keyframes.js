#!/usr/bin/env node
/**
 * proof:engine — the D.W4 engine-transposition source gate.
 *
 * A re-runnable, BITING source instrument for the transpositions whose proof is
 * structural (the behavioral proofs live in `npm test`:
 * `zero-alloc`/`snap-symmetry`/`frame-compiler`/`group` pause-honest). Each
 * clause reds on the exact regression it forbids — verified, not asserted.
 *
 *   D-2  tick-canon          — no driver-layer `tick(` survives in engine/group
 *   D-4  engine-seam         — FrameCompiler exists + is run-state-free; the
 *                              Animation class stays ≤ its declared ceiling
 *   D-5  pause-honest        — no "backward compatibility" toggle docstring; the
 *                              honest pause/resume/toggle triad is present
 *   D-6a snap-symmetry       — BOTH steppers' `_snapSettled` stop the playback
 *   D-6b/c no-legacy         — no `| any` in leaves; no value.js lerp/formatCSS
 *                              path-compat re-exports
 *
 * Mirrors `proof:boundary`/`proof:dogfood`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── D-2 tick-canon — no driver-layer `tick(` in engine.ts / group.ts ─────────
for (const f of ["src/animation/engine.ts", "src/animation/group.ts"]) {
    const src = read(f);
    const hits = [...src.matchAll(/\btick\s*\(/g)];
    if (hits.length > 0) {
        fail("tick-canon", `${f} still carries ${hits.length} \`tick(\` — the absolute-clock advance must be \`advanceTo(\``);
    } else {
        ok("tick-canon", `${f}: zero driver-layer \`tick(\` (advanceTo is the one absolute-clock advance)`);
    }
}

// ── D-4 engine-seam — FrameCompiler extracted, run-state-free; core ≤ ceiling ─
// Guards against the god-object REGROWING by re-absorbing the compile half
// (re-inlining the FrameCompiler is ~+236 — the regression this bites). D-close
// was 847; E added two genuine FEATURE methods to the base class — E.W7's
// zero-alloc `processFrame` lift + `_interpOut` buffer, and E.W9's live-PRM
// `_snapToReducedMotion` + per-tick re-consult (~+67 total). F added ~95 more
// of cohesive, gated, MEASURED feature (NOT compile re-absorption): F.W4's
// stable-key buffer mechanism (`clearBuffer` + `computeStableKeys` + the
// single-frame alias branch in `interpFrames` — the headline ~3× perf fold) and
// F.W8's style-rule `animation`-shorthand apply (`_ctorOptions` + the
// CSS→engine option translation). G adds two cohesive ADDITIVE one-method
// landings on the same `this`-bound seam — G.W13's `get finished()` over the
// held play promise and G.W19's `adoptCompiled()` + the `compiler` field→get-only
// accessor (~+25). This is the gated DECISION F.md NEW-3 / a-engine-post-e
// F-ENG-5, re-affirmed by G.W5 (a-deferred-ledger C-6, P-invariant: decide, do
// not re-defer; a-backend-godmodules G-GM-1, re-verified post-G growth): the
// class is at its cohesive gestalt — a split would be the legacy-shaped
// "extract-for-line-count" the §Mandate forbids — so the ceiling is EXTENDED
// with rationale to 1100, NOT the class reflexively split. It still bites HARD on
// a compile re-inline (the regression that actually matters: re-absorbing the
// FrameCompiler is ~+236 → ~1311 ≫ 1100). The sibling file-level cap lives in
// proof:decomposition (LIBRARY_CEILING_OVERRIDE engine.ts: 1400); both guards
// carry the SAME G.W5 decision.
const ANIMATION_CLASS_CEILING = 1100;
const compiler = read("src/animation/frame-compiler.ts");
if (!/export class FrameCompiler/.test(compiler)) {
    fail("engine-seam", "src/animation/frame-compiler.ts does not export `FrameCompiler`");
} else {
    const runState = [...compiler.matchAll(/\b(paused|started|done|playback)\b/g)];
    if (runState.length > 0) {
        fail("engine-seam", `FrameCompiler references run-state ${runState.length}× (${[...new Set(runState.map((m) => m[1]))].join(", ")}) — it must be a pure compile unit`);
    } else {
        ok("engine-seam", "FrameCompiler is run-state-free (no paused/started/done/playback)");
    }
}
{
    const engine = read("src/animation/engine.ts").split("\n");
    const start = engine.findIndex((l) => /^export class Animation</.test(l));
    const end = engine.findIndex((l) => /^export class CSSKeyframesAnimation/.test(l));
    if (start === -1 || end === -1 || end <= start) {
        fail("engine-seam", "could not locate the Animation class body in engine.ts");
    } else {
        const size = end - start; // lines from `export class Animation` to the class above CSSKeyframesAnimation
        if (size > ANIMATION_CLASS_CEILING) {
            fail("engine-seam", `Animation class is ${size} lines > ceiling ${ANIMATION_CLASS_CEILING} — the god-object is regrowing`);
        } else {
            ok("engine-seam", `Animation class is ${size} lines ≤ ceiling ${ANIMATION_CLASS_CEILING} (FrameCompiler holds the compile half)`);
        }
    }
}

// ── D-5 pause-honest — no toggle docstring; honest triad present ──────────────
{
    const group = read("src/animation/group.ts");
    if (/backward compatibility/i.test(group) || /Toggle pause state/.test(group)) {
        fail("pause-honest", "group.ts still carries the legacy toggle-`pause` docstring");
    } else {
        ok("pause-honest", "group.ts: no legacy toggle-`pause` docstring");
    }
    const hasTriad = /\bpause\(\)\s*{/.test(group) && /\bresume\(\)\s*{/.test(group) && /\btoggle\(\)\s*{/.test(group);
    if (!hasTriad) {
        fail("pause-honest", "group.ts is missing the honest pause()/resume()/toggle() triad");
    } else {
        ok("pause-honest", "group.ts: honest pause()/resume()/toggle() triad present");
    }
}

// ── D-6a snap-symmetry — both steppers stop the playback on snap ─────────────
for (const f of ["src/animation/smooth.ts", "src/animation/spring.ts"]) {
    const src = read(f);
    // Match the METHOD DEFINITION body, not a call site.
    const m = src.match(/_snapSettled\s*\([^)]*\)\s*:\s*void\s*{([\s\S]*?)\n    }/);
    const snapBody = m ? m[1] : "";
    if (!/this\._playback\.stop\(\)/.test(snapBody)) {
        fail("snap-symmetry", `${f} _snapSettled does not call this._playback.stop() — the reduced-motion snap leaves a scheduled frame`);
    } else {
        ok("snap-symmetry", `${f}: _snapSettled stops the playback (symmetric reduced-motion snap)`);
    }
}

// ── D-6b/c no-legacy — no `| any`, no path-compat re-exports ─────────────────
{
    const leaves = read("src/animation/internal/leaves.ts");
    if (/:\s*[^,)\n]*\|\s*any\b/.test(leaves)) {
        fail("no-legacy", "leaves.ts still widens a type with `| any`");
    } else {
        ok("no-legacy", "leaves.ts: no `| any` widening");
    }
    const utils = read("src/animation/utils.ts");
    if (/export\s*{[^}]*lerp(Color|Computed|Numeric)?Value/.test(utils) || /New code should import from/.test(utils)) {
        fail("no-legacy", "utils.ts still re-exports value.js lerp primitives (path-compat shim)");
    } else {
        ok("no-legacy", "utils.ts: no value.js lerp path-compat re-export");
    }
    const format = read("src/animation/format.ts");
    if (/export\s*{\s*formatCSS\s*}/.test(format)) {
        fail("no-legacy", "format.ts still re-exports `formatCSS` (convenience shim)");
    } else {
        ok("no-legacy", "format.ts: no `formatCSS` convenience re-export");
    }
}

// ── E.W5 BOOK — the managed-child lifecycle contract is documented in ONE place
// (a NOTE, not code), with a group.ts cross-link. `tryParseCache` eviction stays
// recorded-WITHHELD (measure-first, the D-3 / E.W5 posture: an unbounded memo with
// a small working set is not a measured cost — an LRU would be speculative
// complexity). Both BITE: stub the note → reds; drop the cross-link → reds.
{
    const claude = read("src/animation/CLAUDE.md");
    const hasContract =
        /Managed-child lifecycle/.test(claude) &&
        /last(\s|-)*rAF/i.test(claude) &&
        /never\s+`?child\.resume\(\)`?|not\s+via\s+`?child\.resume/i.test(claude);
    if (!hasContract) {
        fail("managed-pause-doc", "src/animation/CLAUDE.md is missing the consolidated managed-child lifecycle contract (loop-owned; last-rAF-clock pausedTime; resume un-pauses directly, never child.resume())");
    } else {
        ok("managed-pause-doc", "CLAUDE.md states the managed-child lifecycle contract in one place");
    }
    const group = read("src/animation/group.ts");
    if (!/managed-child lifecycle contract/i.test(group)) {
        fail("managed-pause-doc", "group.ts is missing the cross-link comment to the CLAUDE.md managed-child lifecycle contract");
    } else {
        ok("managed-pause-doc", "group.ts cross-links the lifecycle contract above pause/resume");
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:engine — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:engine — PASS: the D.W4 transposition holds at the source — tick\n" +
        "canonicalized to advanceTo, the FrameCompiler seam extracted run-state-free,\n" +
        "pause/resume/toggle honest, the snap symmetric, every legacy re-export retired.",
);
