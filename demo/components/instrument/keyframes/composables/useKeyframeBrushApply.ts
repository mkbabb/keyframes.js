import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import { useApplyCSS } from "./useApplyCSS";

interface KeyframeBrushApplyOptions {
    animation: KeyframesAnimation<any>;
    styleId: string;
    getCSSString: () => string;
    templateRef: string;
}

/**
 * The Apply control's seat: one brush glyph per editor surface, wiggling while
 * the identity is applied, over the SHARED apply identity.
 *
 * KF-KE-62 (X.KF.W12.c), the prose C-B2's remediator needed, re-stated at the
 * lifted bytes: the identity (`styleId` = the class = the emitted selector,
 * KF-KE-4) is DELIBERATELY shared by every surface over one animation, and the
 * state that goes with it — the sheet, `isApplied`, the saved pause state — is
 * held at that altitude by `useApplyCSS`/`useHighlightCSS` (KF-KE-6, refcounted),
 * so this composable owns nothing but its own glyph's motion. Two brushes over
 * one animation read one `cssApplied`.
 *
 * KF-KE-51: the engine is read at SETUP scope, not module scope. A module-scope
 * `kfEngine()` turned a swallowed warm failure (`main.ts` `.catch(() => undefined)`)
 * into a chunk-evaluation throw for the whole scene the moment this module was
 * imported; the component's own setup-scope read is the model.
 */
export function useKeyframeBrushApply(options: KeyframeBrushApplyOptions) {
    const { CSSKeyframesAnimation } = kfEngine();
    const brush = useTemplateRef<HTMLElement>(options.templateRef);
    // KF-KE-8 (D-5, cure map as corrected at the bank: M-6 reversed) — the
    // brush is a STANDALONE animation, and the standalone play path reads
    // `options.respectReducedMotion` (up-front gate + live re-consult per
    // tick), so the opt-in lives in its own options bag. It is the one INFINITE
    // animation on this surface; under the preference it snaps to its final
    // frame instead of wiggling forever. The delete choreography arms through
    // the group's own default (`AnimationGroup.respectReducedMotion = true`,
    // KF.W5) and the two progress sweeps through their bags (KAD-11); the
    // MECHANISM unification across the demo is KF.W9's, not re-derived here.
    const brushAnimation = new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "linear",
        iterationCount: "infinite",
        direction: "alternate",
        respectReducedMotion: true,
    }).fromString(/*css*/ `@keyframes keyframeBrushApply {
        0%, 100% { transform: rotate(0deg); }
        20%, 30%, 40% { transform: rotate(30deg); }
        60%, 70%, 80% { transform: rotate(-90deg); }
    }`);

    // KF-KE-12 ≡ N-5: `clear()` is wired into the identity's OWN lifetime
    // (`useApplyCSS`, refcount-aware), not destructured-and-dropped here.
    const { isApplied, toggle } = useApplyCSS({
        getAnimation: () => options.animation,
        styleId: options.styleId,
        getCSSString: options.getCSSString,
        getClassName: () => options.styleId,
    });

    const applyCSSStyles = () => {
        toggle();
        if (isApplied.value) void brushAnimation.play();
        else brushAnimation.pause();
    };

    onMounted(() => {
        const glyph = brush.value;
        if (glyph !== null) brushAnimation.setTargets(glyph);
    });
    onUnmounted(() => brushAnimation.pause());

    return { applyCSSStyles, cssApplied: isApplied };
}
