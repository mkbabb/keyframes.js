/**
 * presets/ — the preset catalog barrel (R.W1; lib-animations F1). The former
 * 886L `animations.ts` god-list split by kind: `classic.ts` (34 cubic-bezier/
 * stepped presets), `spring.ts` (the spring-eased factories), `taxonomy.ts` (the
 * enter/exit/attention/loop discovery index). HEAVY — each factory returns a
 * `CSSKeyframesAnimation`, so the catalog rides `loadAnimationEngine()` as the
 * `presets` namespace. This is a 1:1 re-export of the full former surface.
 */
// S.B4 (a02 F4) — explicit-named barrel policy: `export *` is reserved for the
// leaf tier, so every preset is re-exported by name. A new preset joins the
// `presets` namespace ONLY through a reviewed barrel edit (no silent leakage of
// an accidental `export const` from a member file).
export {
    fadeIn,
    fadeOut,
    pulse,
    shake,
    bounce,
    flipPreset,
    rotateIn,
    slideIn,
    heartbeat,
    glow,
    typewriter,
    rainbowText,
    warpLeft,
    warpRight,
    blurIn,
    blurOut,
    blurInOut,
    progressBar,
    skeletonLoading,
    textFocusBlur,
    gradientBackground,
    rotateScale,
    typingCursor,
    accordionExpand,
    notificationBounce,
    spinner,
    parallaxScroll,
    slideInLeft,
    slideOutLeft,
    slideInRight,
    slideOutRight,
    hover,
    jumpUp,
    jumpDown,
} from "./classic";
export {
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
} from "./spring";
export {
    enterPresets,
    exitPresets,
    attentionPresets,
    loopPresets,
    presetTaxonomy,
} from "./taxonomy";
