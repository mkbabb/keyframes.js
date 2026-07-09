/**
 * svg/handle.ts — the abstract SVG animation-handle base (S.B4 / a20 F1+F2; fold
 * row 59).
 *
 * The three SVG factory classes (`MotionPath`, `DrawSVG`, `MorphSVG`) each wrap a
 * `CSSKeyframesAnimation` control handle and expose the SAME `.play()` / `.pause()`
 * / `.stop()` / `.finished` delegation. Before S.B4 that delegation was
 * hand-duplicated per class — the DRY drift by which the `.finished` getter was
 * added to `DrawSVG`/`MorphSVG` but MISSED on `MotionPath` (a silent `undefined`
 * for a consumer who learned the family on a sibling). Lifting the delegation to
 * this base closes the `MotionPath.finished` asymmetry BY CONSTRUCTION: a subclass
 * that constructs the base HAS the full family, and a new handle joins it by
 * `extends`, not by re-typing four one-liners.
 *
 * The subclass passes its constructed animation up via `super(fromX(...))`; the
 * base holds it as the `readonly animation` control handle. HEAVY (the `animation`
 * is a `CSSKeyframesAnimation`, an `import type` erased under
 * `verbatimModuleSyntax` — this base carries no runtime engine edge of its own;
 * the subclasses ride `loadAnimationEngine()` through their `fromX` factories).
 */
import type { CSSKeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

export abstract class SVGAnimationHandle<V extends Vars = Vars> {
    /**
     * The underlying animation — the control handle. Set by the subclass through
     * `super(fromX(...))` (the `fromX` factory is the canonical construction).
     */
    constructor(readonly animation: CSSKeyframesAnimation<V>) {}

    /** Start (or re-enter) the play loop. Resolves when the animation completes. */
    play(): Promise<void> {
        return this.animation.play();
    }

    /** Pause the play loop, retaining the playhead. Chainable. */
    pause(): this {
        this.animation.pause();
        return this;
    }

    /** Halt and rewind the play loop. Chainable. */
    stop(): this {
        this.animation.stop();
        return this;
    }

    /** Resolve once the animation completes — the {@link Animation.finished}
     * completion front-door, uniform across every SVG handle. */
    get finished(): Promise<void> {
        return this.animation.finished;
    }
}
