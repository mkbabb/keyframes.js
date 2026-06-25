import type { Ref } from "vue";

// ── EASTER EGG — "the Gallery" (H.W12.S6) ────────────────────────────────────
// Double-click the curve canvas → a self-playing tour of the easing library.
// The selected curve cascades through a curated gallery of the most EXPRESSIVE
// named easings (the back/bounce/elastic family) ~520ms apart, so the hero
// canvas MORPHS through the catalogue and the traveling dot traces each in turn
// — a hands-free showcase of the engine's curve set (`selectEasing` re-derives
// `currentEasingFn` + `svgPath` per step, inv ζ). Restores the curve the user
// was on when the tour ends.
//
// The tour names are the HYPHENATED registry keys `timingFunctionsAnd` holds
// (getTimingFunctionsAnd re-keys every easing through camelCaseToHyphen, so
// `selectEasing` + the curve lookup both want the hyphen form). Verified against
// the live value.js set — every entry resolves to a real function.
//
// Colocated sub-unit of useEasingDemo (I.WZ — the natural easter-egg concern
// seam; the host composable keeps the sweep/contract/parse machinery).
const GALLERY_TOUR = [
    "ease-in-out-back",
    "bounce-out-ease",
    "ease-out-expo",
    "ease-in-out-circ",
    "bounce-in-out-ease",
    "ease-out-back",
] as const;
const STEP_MS = 520;

export function useEasingGallery(
    selectEasing: (name: string) => void,
    currentEasingName: Ref<string>,
    timingFunctionsAnd: Record<string, unknown>,
) {
    let galleryRunning = false;
    const galleryTimers: ReturnType<typeof setTimeout>[] = [];

    const gallery = () => {
        if (galleryRunning) return;
        galleryRunning = true;
        galleryTimers.length = 0;
        const restore = currentEasingName.value;

        GALLERY_TOUR.forEach((name, i) => {
            // Only tour curves the registry actually carries (defensive — the
            // tour list is curated against the value.js easing set).
            if (!(name in timingFunctionsAnd)) return;
            galleryTimers.push(setTimeout(() => selectEasing(name), i * STEP_MS));
        });
        galleryTimers.push(
            setTimeout(() => {
                selectEasing(restore);
                galleryRunning = false;
            }, GALLERY_TOUR.length * STEP_MS),
        );
    };

    const disposeGallery = () => galleryTimers.forEach(clearTimeout);

    return { gallery, disposeGallery };
}
