/**
 * presets/ — the preset catalog barrel (R.W1; lib-animations F1). The substance
 * is `catalog.ts` — the `PRESET_SPECS` factory table (the cubic-bezier/stepped +
 * spring-eased presets) plus the enter/exit/attention/loop taxonomy — built over
 * the `classic-data.ts` keyframe data table. HEAVY — each factory returns a
 * `CSSKeyframesAnimation`, so the catalog rides `loadAnimationEngine()` as the
 * `presets` namespace. This barrel re-exports the full preset surface by name.
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
} from "./catalog";
export {
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
} from "./catalog";
export {
    enterPresets,
    exitPresets,
    attentionPresets,
    loopPresets,
    presetTaxonomy,
} from "./catalog";
