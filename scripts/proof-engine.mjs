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
 *   R.W2 no-host-cast        — zero `as unknown as PlaybackHost` anywhere under
 *                              `src/animation/engine/` (the privacy-inversion
 *                              workaround is excised; PlaybackState owns the
 *                              run-state by composition, not by structural cast)
 *   R.W2 no-host-export      — no `export interface/type PlaybackHost` under
 *                              `src/animation/engine/` (the interface is gone —
 *                              not renamed-and-re-exported)
 *
 * Mirrors `proof:boundary`/`proof:dogfood`: exits 1 on any residual.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── D-2 tick-canon — no driver-layer `tick(` in engine / group ───────────────
// R.W1 co-edit: engine.ts → engine/animation.ts, group.ts → group/group.ts
// (the directory partition; challenge-library §1b).
for (const f of [
    "src/animation/engine/animation.ts",
    "src/animation/group/group.ts",
]) {
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
// (re-inlining the FrameCompiler is ~+236 — the regression this bites).
//
// R.W2 (the two god-class carves): the prior ceiling of 1100 was the G.W5
// "cohesive gestalt, extend-don't-split" decision — which the Tranche R audit
// (lib-engine F-1) judged a self-certifying cap that could not bite. R.W2 carves
// the class for real: `CSSKeyframesAnimation` moves to `css-animation.ts`, the
// Phase-2 element-aware resolver moves to `element-resolve.ts`, the play-machine
// run-state moves into the `PlaybackState` struct in `playback.ts`. With those
// lifts the base `KeyframesAnimation` class body lands under 500, so the ceiling
// is LOWERED to 500 (the post-carve target). It still bites HARD on a compile
// re-inline (re-absorbing the FrameCompiler is ~+236) AND now on any regrowth
// past the carved baseline. Sizing was an ESTIMATE (challenge-library §5) — this
// gate VERIFIES it: if the class lands over 500 post-carve, keep carving; do NOT
// raise the ceiling (R.md §5 keystone — the reds ARE the backlog).
const ANIMATION_CLASS_CEILING = 500;
const compiler = read("src/animation/compile/frame-compiler.ts");
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
    const engine = read("src/animation/engine/animation.ts").split("\n");
    // PKG-3 (L.W8 §S4): the core engine class was renamed `Animation` →
    // `KeyframesAnimation` to clear the `globalThis.Animation` d.ts collision;
    // the body-size ceiling check anchors on the renamed class. Measure the
    // class body to its OWN closing brace (the first top-level `}` after the
    // class header) — the faithful "is the class a god-object?" measure — so the
    // ceiling stays on the class itself and excludes the backward-compat
    // `export { KeyframesAnimation as Animation }` alias block that follows it.
    const start = engine.findIndex((l) => /^export class KeyframesAnimation</.test(l));
    let end = -1;
    if (start !== -1) {
        for (let i = start + 1; i < engine.length; i++) {
            if (/^}/.test(engine[i])) {
                end = i;
                break;
            }
        }
    }
    if (start === -1 || end === -1 || end <= start) {
        fail("engine-seam", "could not locate the KeyframesAnimation class body in engine.ts");
    } else {
        const size = end - start; // lines from `export class KeyframesAnimation` to its closing brace
        if (size > ANIMATION_CLASS_CEILING) {
            fail("engine-seam", `KeyframesAnimation class is ${size} lines > ceiling ${ANIMATION_CLASS_CEILING} — the god-object is regrowing`);
        } else {
            ok("engine-seam", `KeyframesAnimation class is ${size} lines ≤ ceiling ${ANIMATION_CLASS_CEILING} (FrameCompiler holds the compile half)`);
        }
    }
}

// ── R.W2 (c) no-host-cast + (d) no-host-export — the PlaybackHost privacy ─────
// inversion is excised. (c): zero `as unknown as PlaybackHost` anywhere under
// `src/animation/engine/` — a stub that removes the `_host` getter but keeps a
// structurally-equivalent cast (even renamed) still reds, because the clause
// scans for the INTERFACE NAME, not the cast syntax alone. (d): no file under
// `engine/` re-exports the interface under ANY export form (the privacy-inversion
// re-instated under a different name reds too). Both scan EVERY `.ts` under the
// directory, so a leak in any carved sub-module bites.
{
    const engineDir = "src/animation/engine";
    const files = readdirSync(join(root, engineDir)).filter((f) =>
        f.endsWith(".ts"),
    );
    let castHit = null;
    let exportHit = null;
    for (const f of files) {
        const src = read(`${engineDir}/${f}`);
        if (/as\s+unknown\s+as\s+PlaybackHost/.test(src)) castHit ??= f;
        if (/export\s+(interface|type)\s+PlaybackHost\b/.test(src)) {
            exportHit ??= f;
        }
    }
    if (castHit) {
        fail(
            "no-host-cast",
            `${engineDir}/${castHit} still carries an \`as unknown as PlaybackHost\` cast — the privacy-inversion workaround survives (PlaybackState must own the run-state by composition)`,
        );
    } else {
        ok(
            "no-host-cast",
            `no \`as unknown as PlaybackHost\` cast under ${engineDir}/ (the structural workaround is excised)`,
        );
    }
    if (exportHit) {
        fail(
            "no-host-export",
            `${engineDir}/${exportHit} still exports \`PlaybackHost\` — the over-exposed run-state interface must be gone, not renamed-and-re-exported`,
        );
    } else {
        ok(
            "no-host-export",
            `no \`export interface/type PlaybackHost\` under ${engineDir}/ (the interface is excised)`,
        );
    }
}

// ── D-5 pause-honest — no toggle docstring; honest triad present ──────────────
{
    const group = read("src/animation/group/group.ts");
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
for (const f of [
    "src/animation/physics/smooth.ts",
    "src/animation/physics/spring/progress.ts",
]) {
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
    const utils = read("src/animation/compile/parse-flatten.ts");
    if (/export\s*{[^}]*lerp(Color|Computed|Numeric)?Value/.test(utils) || /New code should import from/.test(utils)) {
        fail("no-legacy", "utils.ts still re-exports value.js lerp primitives (path-compat shim)");
    } else {
        ok("no-legacy", "utils.ts: no value.js lerp path-compat re-export");
    }
    const format = read("src/animation/compile/format.ts");
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
    const group = read("src/animation/group/group.ts");
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
