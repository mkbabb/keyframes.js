import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import { useApplyCSS } from "./useApplyCSS";

interface KeyframeBrushApplyOptions {
    animation: KeyframesAnimation<any>;
    styleId: string;
    getCSSString: () => string;
    /**
     * D-5 / L-M-4 / C-4 (X.KF.W12.e) — OPTIONAL, and the locus of the defect.
     *
     * The glyph is the brush this seat wiggles while the identity is applied.
     * Requiring it made a surface whose Apply control lives somewhere else
     * (`KeyframesStringControls`, whose toggle is the ribbon's) fabricate a
     * `class="hidden"` decoy just to satisfy the contract — and the seat then
     * ran a 700 ms `iterationCount: "infinite"` animation, indefinitely, over
     * an element nobody could see, in a pane that never unmounts. Omit it and
     * the seat owns no motion at all: no glyph, no engine read, no parse, no
     * loop. Pass it only where a real brush is rendered.
     */
    templateRef?: string;
}

/**
 * Build the brush glyph's motion and bind it to its element. Called ONLY when a
 * consumer names a real glyph (D-5): the engine read, the `fromString` parse
 * and the mount hooks are all costs of having a brush, not of applying CSS.
 */
function useBrushGlyph(templateRef: string) {
    // KF-KE-51: the engine is read at SETUP scope, not module scope. A
    // module-scope `kfEngine()` turned a swallowed warm failure (`main.ts`
    // `.catch(() => undefined)`) into a chunk-evaluation throw for the whole
    // scene the moment this module was imported; the setup-scope read is the
    // model, and this helper runs inside its caller's setup.
    const { CSSKeyframesAnimation } = kfEngine();
    const brush = useTemplateRef<HTMLElement>(templateRef);

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

    onMounted(() => {
        const glyph = brush.value;
        if (glyph !== null) brushAnimation.setTargets(glyph);
    });
    onUnmounted(() => brushAnimation.pause());

    return brushAnimation;
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
 * The glyph is OPTIONAL (D-5): a surface whose Apply control is rendered
 * elsewhere owns no motion here, and pays for none.
 */
export function useKeyframeBrushApply(options: KeyframeBrushApplyOptions) {
    const brushAnimation =
        options.templateRef === undefined
            ? undefined
            : useBrushGlyph(options.templateRef);

    // KF-KE-12 ≡ N-5: `clear()` is wired into the identity's OWN lifetime
    // (`useApplyCSS`, refcount-aware), not destructured-and-dropped here.
    const { isApplied, toggle, clear } = useApplyCSS({
        getAnimation: () => options.animation,
        styleId: options.styleId,
        getCSSString: options.getCSSString,
        getClassName: () => options.styleId,
    });

    const applyCSSStyles = () => {
        toggle();
        if (isApplied.value) void brushAnimation?.play();
        else brushAnimation?.pause();
    };

    /**
     * RB-6 (X.KF.W12.e) — THE STATE AND ITS AFFORDANCE GET ONE LIFETIME.
     *
     * The Apply toggle is not this pane's: it lives in `RibbonBar.vue`, behind
     * `v-if="selectedControl === 'keyframes'"`. This pane is force-mounted by
     * the controls wrapper and never unmounts, so `useApplyCSS`'s own
     * `beforeUnmount` teardown (KF-KE-12) does not fire on a tab switch — and
     * the applied residue (the forced pause, the injected sheet, the class on
     * every target) outlived the only control that could undo it. The user's
     * only way back was to remember which tab it had been on.
     *
     * The seat therefore publishes the teardown the affordance's own lifetime
     * needs. It is `clear()`, not `toggle()`: an idempotent take-down that
     * restores the PRIOR pause state (S-6-as-corrected — the `prevPaused`
     * mechanism is the right one and is kept whole) and does nothing at all
     * when nothing is applied.
     */
    const clearApplied = () => {
        clear();
        brushAnimation?.pause();
    };

    return { applyCSSStyles, clearApplied, cssApplied: isApplied };
}
