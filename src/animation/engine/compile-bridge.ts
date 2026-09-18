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
import { NOOP_TRANSFORM, type TransformFunction, type Vars } from "../constants";
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

/** What an animation's compiled frames say about the renderer it owns. */
interface OwnedRenderer<V extends Vars> {
    /**
     * The renderer the animation itself SUPPLIED — a transform that is neither
     * this instance's default DOM renderer nor the compile seam's no-op default.
     * `undefined` when it supplied none, in which case every transform it
     * carries is instance identity rather than consumer intent.
     */
    declared: TransformFunction<V> | undefined;
    /**
     * That renderer, else this instance's OWN default DOM renderer, recovered
     * through the same reference test (`_defaultTransform` itself is protected).
     * `undefined` only when the animation has never compiled a frame — there is
     * then nothing of its own to keep.
     */
    own: TransformFunction<V> | undefined;
}

/**
 * Read an animation's renderer off its compiled frames, through the class's own
 * reference test ({@link KeyframesAnimation.usesDefaultRenderer}) — the
 * comparison `engine/css/animation.ts`'s `resolveTransform` comment already
 * names as the one way to ask "did the consumer supply a transform?".
 */
function rendererOf<V extends Vars>(
    anim: KeyframesAnimation<V>,
): OwnedRenderer<V> {
    let own: TransformFunction<V> | undefined;
    for (const frame of anim.frames) {
        const transform = frame.transform;
        if (anim.usesDefaultRenderer(transform)) {
            own ??= transform;
        } else if (transform !== NOOP_TRANSFORM) {
            return { declared: transform, own: transform };
        }
    }
    return { declared: undefined, own };
}

/**
 * Adopt another animation's ALREADY-COMPILED state as ONE atomic motion (G.W19)
 * — the first-class verb for the "single-compile, then transplant" pattern
 * (E.W8 S0): a throwaway animation is built + compiled ONCE off the new
 * keyframes, and the live animation adopts that compiled state without a second
 * compile.
 *
 * The transplant moves the `compiler` and `options` together and re-binds the
 * live-options reference BY CONSTRUCTION — `options` is read OFF the adopted
 * compiler, so the live options identity holds without relying on the caller's
 * assignment order. This is the invariant the demo formerly held by a comment +
 * three ordered field writes; here it is the method's contract, enforced by
 * `proof:adopt-compiled`. A `compiler` adopted WITHOUT re-binding `options`
 * would leave the setters mutating one object while the compiler reads another —
 * the exact desync the `6e29236` live-options lock guards against.
 *
 * THE RENDERER IS THE RECEIVER'S (X.KF.W5 C-1 / G-RENDERER). `unflatten` and the
 * frames' `transform` used to ride along with the compiled state, so adopting a
 * throwaway compiled with NO transform — the editor's own recompile shape,
 * `new CSSKeyframesAnimation(options, ...targets).fromKeyframes(edited)` —
 * silently and permanently replaced a receiver's custom renderer with the
 * throwaway's, and even a receiver on the DEFAULT renderer ended up holding a
 * FOREIGN instance's default, which closes over the SOURCE's target set and
 * answers `usesDefaultRenderer` false (the WAAPI fast lane then refuses an
 * animation for a renderer nobody supplied). Only a source that DECLARED a
 * renderer of its own carries one worth adopting; otherwise the receiver's own
 * renderer is re-pointed onto the adopted template AND compiled frames — the
 * templates too, so the next `parse()` cannot re-derive the loss — and the
 * `unflatten` flag that says how that renderer is called stays with it.
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
    // The renderer belongs to the RECEIVER. Read it BEFORE the transplant,
    // while `anim.frames` is still the receiver's own.
    const receiver = rendererOf(anim);
    const sourceDeclared = rendererOf(source).declared;

    // Transplant the compiled compiler whole (its `frames`/`templateFrames`/
    // `parsedVars` come with it) into the engine-private ownership store.
    const compiler = compilerFor<V>(source);
    setCompilerFor(anim, compiler);
    // Re-bind the live-options reference OFF the adopted compiler.
    anim.options = compiler.options;

    // The receiver keeps its renderer unless the SOURCE declared one of its own
    // (then the renderer is part of the compiled state the caller built, and it
    // is adopted with it — `unflatten` included).
    const keptRenderer = sourceDeclared === undefined ? receiver.own : undefined;
    if (keptRenderer !== undefined) {
        for (const frame of anim.templateFrames) frame.transform = keptRenderer;
        for (const frame of anim.frames) frame.transform = keptRenderer;
    }
    // `unflatten` travels WITH the renderer: it is the flag that says whether
    // the renderer is handed the nested `vars` or the flat projection. A
    // receiver keeping a renderer it DECLARED keeps its own flag; in every other
    // case the adopted state's flag is the honest one.
    if (keptRenderer === undefined || receiver.declared === undefined) {
        anim.unflatten = source.unflatten;
    }

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
