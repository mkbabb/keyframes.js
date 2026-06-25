/**
 * presets/taxonomy.ts — the enter / exit / attention / loop grouping over the
 * preset library (R.W1; lib-animations). Pure organization: every value is an
 * existing exported factory from `./classic` or `./spring`, so the taxonomy adds
 * no new pixels — it makes the library DISCOVERABLE by intent ("show me the
 * entrances") without re-implementing a single preset.
 */
import {
    fadeIn,
    fadeOut,
    slideIn,
    slideInLeft,
    slideInRight,
    slideOutLeft,
    slideOutRight,
    rotateIn,
    blurIn,
    blurOut,
    warpLeft,
    warpRight,
    jumpUp,
    jumpDown,
    pulse,
    shake,
    bounce,
    flipPreset,
    notificationBounce,
    heartbeat,
    glow,
    spinner,
    rainbowText,
    skeletonLoading,
    gradientBackground,
    parallaxScroll,
    hover,
    typingCursor,
} from "./classic";
import {
    springScaleIn,
    springSlideIn,
    springPop,
    springWobble,
} from "./spring";

/** Entrance animations — bring an element INTO view. */
export const enterPresets = {
    fadeIn,
    slideIn,
    slideInLeft,
    slideInRight,
    rotateIn,
    blurIn,
    springScaleIn,
    springSlideIn,
    jumpUp,
} as const;

/** Exit animations — take an element OUT of view. */
export const exitPresets = {
    fadeOut,
    slideOutLeft,
    slideOutRight,
    blurOut,
    warpLeft,
    warpRight,
    jumpDown,
} as const;

/** Attention animations — a one-shot nudge to draw the eye. */
export const attentionPresets = {
    pulse,
    shake,
    bounce,
    // The taxonomy key stays `flip` (a nested property — no top-level
    // collision); the factory is the renamed `flipPreset` (PKG-3, L.W8 §S4).
    flip: flipPreset,
    notificationBounce,
    springPop,
    springWobble,
} as const;

/** Looping animations — run continuously (`iterationCount: Infinity`). */
export const loopPresets = {
    heartbeat,
    glow,
    spinner,
    rainbowText,
    skeletonLoading,
    gradientBackground,
    parallaxScroll,
    hover,
    typingCursor,
} as const;

/**
 * The full preset taxonomy, grouped by intent. Each leaf is one of the
 * existing exported factory functions — the taxonomy is a discovery index over
 * the library, not a second copy of it.
 */
export const presetTaxonomy = {
    enter: enterPresets,
    exit: exitPresets,
    attention: attentionPresets,
    loop: loopPresets,
} as const;
