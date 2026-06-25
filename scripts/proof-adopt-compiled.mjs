#!/usr/bin/env node
/**
 * proof:adopt-compiled — the G.W19 `adoptCompiled()` engine-seam gate.
 *
 * `Animation.adoptCompiled(source)` transplants a throwaway's already-compiled
 * state as ONE atomic motion: the compiler, the live-options reference RE-BOUND
 * off the adopted compiler (`this.options === this.compiler.options` — the
 * `6e29236` invariant), and `_stableKeys` recomputed. It replaces the demo's
 * three-field cross-boundary reach-in. The `compiler` field tightens to a
 * get-only accessor so the reach-in is no longer expressible (a compile error).
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path`: each clause reds on the
 * exact regression it forbids. The value proof (reference identity, the re-bind +
 * the dynamic 6e29236 witness, the recomputed key-set) lives in the chained
 * `vitest run test/adopt-compiled.test.ts` (the lead wires the combined
 * `"proof:adopt-compiled"` script — see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   verb-exists       — `engine.ts` defines `adoptCompiled(source:
 *       KeyframesAnimation<V>): this` (the core class, renamed from `Animation`
 *       in PKG-3 / L.W8 §S4). BITE: rename/drop it → reds.
 *
 *   transplant        — the verb adopts the compiler whole (`this._compiler =
 *       source.compiler`), NOT a fresh re-compile. BITE: `new FrameCompiler(...)`
 *       inside adoptCompiled → reds.
 *
 *   options-rebind    — the verb re-binds `this.options = this.compiler.options`
 *       (off the ADOPTED compiler, true by construction). BITE: drop the re-bind,
 *       or source it from `source.options` independently → reds (and the test's
 *       desync witness reds).
 *
 *   recompute-keys    — the verb calls `computeStableKeys()` so flatKeys reflects
 *       the adopted frames. BITE: drop it → reds (and the flatKeys test reds).
 *
 *   compiler-readonly — `compiler` is a get-only accessor over a backing
 *       `_compiler`; the field is written ONLY by the constructor + adoptCompiled.
 *       BITE: a public-writable `compiler!: FrameCompiler` → the demo reach-in
 *       compiles again (and tsc would not catch the external write).
 *
 *   demo-collapsed    — `useKeyframeOps.ts` calls `animation.adoptCompiled(
 *       compiled)` — NOT the three-field reach-in (`animation.compiler = …`).
 *       BITE: restore any of the three internal-field writes → reds.
 *
 *   test-locks        — `test/adopt-compiled.test.ts` carries the three value
 *       clauses (a: compiler identity, b: options re-bind + dynamic witness, c:
 *       recomputed key-set). BITE: delete a lock → reds.
 *
 * Mirrors `proof:motion-path`: exits 1 on any residual.
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

console.log("proof:adopt-compiled — G.W19 (the adoptCompiled engine seam)");

const ENGINE = "src/animation/engine/animation.ts";
// R.W2 — the `adoptCompiled` BODY (the transplant statements) was carved out of
// the `KeyframesAnimation` god-class into the colocated `./compile-bridge` free
// function (the same "gate follows code to its new home" co-edit as the rest of
// the R.W2 carve). The `adoptCompiled` PUBLIC verb stays on the class (the
// delegate); the transplant/options-rebind/recompute-keys STATEMENTS are greped
// at their new home, in their free-function form (`anim.`-prefixed; the backing
// `_compiler` write goes through the sanctioned `_setCompiler` accessor).
const COMPILE_BRIDGE = "src/animation/engine/compile-bridge.ts";
const DEMO =
    "demo/@/components/custom/animation-controls/keyframes/composables/useKeyframeOps.ts";
const TEST = "test/adopt-compiled.test.ts";

// ── verb-exists + transplant + options-rebind + recompute-keys ────────────────
requireAll("verb-exists", ENGINE, [
    {
        // PKG-3 (L.W8 §S4): the core class was renamed `Animation` →
        // `KeyframesAnimation`; the adoptCompiled source-param anchor follows it.
        name: "defines `adoptCompiled(source: KeyframesAnimation<V>): this`",
        re: /adoptCompiled\s*\(\s*source\s*:\s*KeyframesAnimation<V>\s*\)\s*:\s*this\b/,
    },
]);

requireAll("transplant", COMPILE_BRIDGE, [
    {
        name: "adopts the compiler whole (anim._setCompiler(source.compiler))",
        re: /anim\._setCompiler\(\s*source\.compiler\s*\)/,
    },
]);

requireAll("options-rebind", COMPILE_BRIDGE, [
    {
        name: "re-binds options off the adopted compiler (anim.options = anim.compiler.options)",
        re: /anim\.options\s*=\s*anim\.compiler\.options\b/,
    },
]);

requireAll("recompute-keys", COMPILE_BRIDGE, [
    {
        name: "recomputes the stable key-set (computeStableKeys(anim))",
        re: /adoptCompiled[\s\S]*?computeStableKeys\(anim\)/,
    },
]);

// ── compiler-readonly — get-only accessor over a backing _compiler ────────────
{
    const src = read(ENGINE);
    const backingField = /private\s+_compiler!?\s*:\s*FrameCompiler<V>/.test(src);
    const getter = /get\s+compiler\s*\(\s*\)\s*:\s*FrameCompiler<V>/.test(src);
    // A public-writable field would be `compiler!: FrameCompiler<V>` (no
    // `private`, no getter) — the reach-in vector. Reject it.
    const publicWritable = /^\s*compiler!?\s*:\s*FrameCompiler<V>/m.test(src);
    if (!backingField || !getter || publicWritable) {
        fail(
            "compiler-readonly",
            `${ENGINE}: backing _compiler=${backingField}, get compiler accessor=${getter}, public-writable compiler field (forbidden)=${publicWritable} — \`compiler\` must be a get-only accessor over a private _compiler, so an external \`animation.compiler = …\` reach-in is a compile error.`,
        );
    } else {
        ok(
            "compiler-readonly",
            `compiler is a get-only accessor over a private _compiler (the reach-in is a compile error)`,
        );
    }
}

// ── demo-collapsed — the demo calls the verb, NOT the three-field reach-in ─────
{
    const src = read(DEMO);
    const callsVerb = /animation\.adoptCompiled\(\s*compiled\s*\)/.test(src);
    const reachIn =
        /animation\.compiler\s*=/.test(src) ||
        /animation\.options\s*=\s*compiled\.options/.test(src) ||
        /animation\.unflatten\s*=\s*compiled\.unflatten/.test(src);
    if (!callsVerb || reachIn) {
        fail(
            "demo-collapsed",
            `${DEMO}: calls adoptCompiled(compiled)=${callsVerb}, still has a three-field reach-in (forbidden)=${reachIn} — the demo must use the verb, not assign into the engine's internals.`,
        );
    } else {
        ok(
            "demo-collapsed",
            `the demo calls animation.adoptCompiled(compiled) — no cross-boundary reach-in`,
        );
    }
}

// ── test-locks — the three value clauses are present and biting ────────────────
requireAll("test-locks", TEST, [
    {
        name: "(a) compiler reference identity (a.compiler).toBe(b.compiler)",
        re: /expect\(a\.compiler\)\.toBe\(b\.compiler\)/,
    },
    {
        name: "(b) the live-options re-bind (a.options).toBe(a.compiler.options)",
        re: /expect\(a\.options\)\.toBe\(a\.compiler\.options\)/,
    },
    {
        name: "(b) the dynamic 6e29236 witness (setDuration → parse → time.stop 2000)",
        re: /setDuration\(2000\)[\s\S]*?\.parse\(\)[\s\S]*?time\.stop\)\.toBe\(2000\)/,
    },
    {
        name: "(c) the recomputed key-set (flatKeys contains b's extra `transform` key)",
        re: /flatKeys[\s\S]*?toContain\("transform"\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:adopt-compiled — FAIL: the adoptCompiled seam is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  adoptCompiled transplants the compiler whole, re-binds\n" +
            "  this.options = this.compiler.options (the 6e29236 invariant, by\n" +
            "  construction), and recomputes computeStableKeys(); `compiler` is a\n" +
            "  get-only accessor; the demo calls the verb. Restore the clause each\n" +
            "  anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:adopt-compiled — PASS: adoptCompiled transplants the compiled\n" +
        "compiler, re-binds the live-options reference off the adopted compiler\n" +
        "(this.options === this.compiler.options, by construction), and recomputes\n" +
        "the stable key-set; `compiler` is get-only (the reach-in is a compile\n" +
        "error); the demo calls the verb. The value proof rides\n" +
        "`vitest run test/adopt-compiled.test.ts`.",
);
