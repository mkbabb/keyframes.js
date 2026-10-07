<template>
    <!-- OA-61 (X.KF.W13W.e) → X-DS pass 1 (KF-P1-01) — the ball preview's
         hide/show BODY. The eye that toggles it no longer floats over the
         preview's corner (the owner's "floating meaninglessly", 2026-10-06):
         it is a labelled control seated beside Reverse in PlaybackRibbon's
         transport row, and this wrapper keeps only the fade. Hidden is NOT
         absent — the preview stays mounted (visibility, not display/v-if).
         X-DS pass 1, C1 (KF-C1-04) — but its ROW collapses: the wrapper is a
         one-row grid whose track springs 1fr → 0fr, so a hidden preview no
         longer leaves a ~70px empty slab at the bottom of the transport card.
         The hide and the show are a cross-fade + scale + the row's collapse
         on the keyframes engine's own spring (`springTimingFunction(...).css`,
         the same `linear()` the engine hands WAAPI). Reduced motion toggles
         instantly. -->
    <div
        class="preview-toggle"
        :data-state="state ?? 'shown'"
        :style="{ '--preview-ease': PREVIEW_EASE }"
    >
        <div class="preview-toggle__body">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { springTimingFunction } from "@mkbabb/keyframes.js";

/** The engine's own spring, serialized once as its CSS `linear()` twin. The
 *  ribbon's eye cross-fades its glyphs on the same curve. */
export const PREVIEW_EASE = springTimingFunction({ response: 0.3, dampingFraction: 0.72 }).css;
</script>

<script setup lang="ts">
const { state } = defineProps<{
    /** The preview's visibility; the mount owns (and persists) it. */
    state?: "shown" | "hidden" | undefined;
}>();
</script>

<style scoped>
.preview-toggle {
    position: relative;
    /* The spring's span: its `linear()` is normalized over this duration. */
    --preview-toggle-ms: 420ms;
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--preview-toggle-ms) var(--preview-ease);
}

.preview-toggle[data-state="hidden"] {
    grid-template-rows: 0fr;
}

/* The preview's own rungs (its ball rides --z-bar) stay inside its box. The
   body may shrink with the row (min-block-size 0); while hidden it is
   invisible, so what overflows the collapsed row paints nothing. */
.preview-toggle__body {
    min-block-size: 0;
    isolation: isolate;
    transition:
        opacity var(--preview-toggle-ms) var(--preview-ease),
        transform var(--preview-toggle-ms) var(--preview-ease),
        visibility 0s linear 0s;
}

.preview-toggle[data-state="hidden"] .preview-toggle__body {
    opacity: 0;
    transform: scale(0.9);
    visibility: hidden;
    /* The body stays mounted; visibility drops only once the fade has run. */
    transition-delay: 0s, 0s, var(--preview-toggle-ms);
}

@media (prefers-reduced-motion: reduce) {
    .preview-toggle,
    .preview-toggle__body,
    .preview-toggle[data-state="hidden"] .preview-toggle__body {
        transition: none;
    }
}
</style>
