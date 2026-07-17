/**
 * `engine/compile-bridge.ts` — the compile/recompile bridge between the
 * `KeyframesAnimation` class and its composed `FrameCompiler`, lifted off the
 * god-object (R.W2 — "Concern B"). The class delegates `parse`/`adoptCompiled`
 * to these free functions; they drive the compiler and re-derive the two
 * compile-stable caches (`_stableKeys`, `_hasComposition` + the per-run
 * composition base/fallback) that the interpolation hot path reads.
 *
 * Compiler identity lives in the engine-private WeakMap store, so adoption can
 * transfer it atomically without adding implementation fields to public d.ts.
 */
import {
    computeHasComposition as computeHasCompositionImpl,
    resetCompositionCaches,
} from "./composition";
import type { Vars } from "../constants";
import type { KeyframesAnimation } from "./animation";
import { bindInterpSlotTarget, type CompiledAnimationFrame } from "../compile/frame";
import { compilerFor, setCompilerFor } from "./compiler-state";

/**
 * Compile the template frames into the sampled `frames[]`, then re-derive the
 * compile-stable caches. The class's `parse()` delegates here. Binds the live
 * targets so computed-unit resolution reads the box.
 */
export function parse<V extends Vars>(anim: KeyframesAnimation<V>): void {
    compilerFor<V>(anim).parse(anim.targets);
    computeStableKeys(anim);
    computeHasComposition(anim);
}

/**
 * Set `_hasComposition` (K.W7 S1) — true iff ANY compiled frame carries a
 * non-`replace` `animation-composition` operator (the hot-path branch reads this
 * ONE per-animation constant; a pure-`replace` animation never pays for the
 * composition work) — and reset the per-run base/fallback caches so a re-parse
 * re-snapshots the underlying base. See `./composition`.
 */
export function computeHasComposition<V extends Vars>(
    anim: KeyframesAnimation<V>,
): void {
    anim._hasComposition = computeHasCompositionImpl(anim.frames);
    resetCompositionCaches(
        anim._compositionBase,
        anim._compositionFallbackSeen,
        anim._compositionPose,
    );
}

/**
 * Recompute `_stableKeys` — the union of every compiled frame's `flatVars` keys
 * — after a (re)compile. The maximal key-set the `clearBuffer` null-fill resets,
 * so a reused interpolation buffer stays in V8 fast-properties mode without ever
 * calling `delete` (F.W4 S1).
 */
export function computeStableKeys<V extends Vars>(
    anim: KeyframesAnimation<V>,
): void {
    const seen = new Set<string>();
    for (const frame of anim.frames) {
        for (const key in frame.flatVars) seen.add(key);
    }
    anim._stableKeys = [...seen];
}

/**
 * Adopt another animation's ALREADY-COMPILED state as ONE atomic motion (G.W19)
 * — the first-class verb for the "single-compile, then transplant" pattern
 * (E.W8 S0): a throwaway animation is built + compiled ONCE off the new
 * keyframes, and the live animation adopts that compiled state without a second
 * compile.
 *
 * The transplant moves the `{ compiler, options, unflatten }` triad together and
 * re-binds the live-options reference BY CONSTRUCTION — `options` is read OFF the
 * adopted compiler, so the live options identity holds without
 * relying on the caller's assignment order. This is the invariant the demo
 * formerly held by a comment + three ordered field writes; here it is the
 * method's contract, enforced by `proof:adopt-compiled`. A `compiler` adopted
 * WITHOUT re-binding `options` would leave the setters mutating one object while
 * the compiler reads another — the exact desync the `6e29236` live-options lock
 * guards against.
 *
 * Recomputes `_stableKeys` so `flatKeys` (the buffer-sizing contract) reflects
 * the adopted compiled frames, not the pre-adopt key-set.
 *
 * @param source an animation whose `compiler` is already compiled.
 */
export function adoptCompiled<V extends Vars>(
    anim: KeyframesAnimation<V>,
    source: KeyframesAnimation<V>,
): void {
    // Transplant the compiled compiler whole (its `frames`/`templateFrames`/
    // `parsedVars` come with it) into the engine-private ownership store.
    const compiler = compilerFor<V>(source);
    setCompilerFor(anim, compiler);
    // Re-bind the live-options reference OFF the adopted compiler.
    anim.options = compiler.options;
    anim.unflatten = source.unflatten;
    // The compiler is transferred as a whole, but computed slots belong to the
    // receiving animation's target set. Rebind only those slots and invalidate
    // their caches; compiled frame/sink identity remains intact.
    const target = anim.targets[0];
    const frames = anim.frames as CompiledAnimationFrame<V>[];
    for (const frame of frames) {
        for (const value of Object.values(frame.interpVars)) {
            for (const slot of value.slots) bindInterpSlotTarget(slot, target);
        }
    }
    // The adopted frames may carry a different key-set / composition operators —
    // recompute the stable-key union + re-derive the honoring flag (K.W7).
    computeStableKeys(anim);
    computeHasComposition(anim);
}
