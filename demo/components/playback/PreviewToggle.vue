<template>
    <!-- OA-61 (X.KF.W13W.e) — THE ONE ball-preview hide/show toggle, in every
         view that carries the preview (every PlaybackRibbon mount).
         The eye floats in the preview's top-right corner, absolutely
         positioned: it never takes part in the layout's flow. Hidden is NOT
         absent — the preview keeps its box (visibility, not display/v-if), so
         a toggle moves no other element by a pixel. The hide and the show are
         a cross-fade + scale on the keyframes engine's own spring
         (`springTimingFunction(...).css`, the same `linear()` the engine
         hands WAAPI); the glyph swap is the same cross-fade + scale. Reduced
         motion toggles instantly. One stable name, pressed = hidden (the
         Reverse cell's pressed-toggle idiom). -->
    <div
        class="preview-toggle"
        :data-state="state ?? 'shown'"
        :style="{ '--preview-ease': PREVIEW_EASE }"
    >
        <div class="preview-toggle__body">
            <slot />
        </div>
        <Button
            v-if="state !== undefined"
            size="xs"
            emphasis="quiet"
            icon-only
            class="preview-toggle__eye"
            aria-label="Hide ball preview"
            :aria-pressed="state === 'hidden'"
            @click="emit('update:state', state === 'hidden' ? 'shown' : 'hidden')"
        >
            <span class="preview-toggle__glyphs" aria-hidden="true">
                <Eye class="preview-toggle__glyph" data-glyph="eye" />
                <EyeOff class="preview-toggle__glyph" data-glyph="eye-off" />
            </span>
        </Button>
    </div>
</template>

<script lang="ts">
import { springTimingFunction } from "@mkbabb/keyframes.js";

/** The engine's own spring, serialized once as its CSS `linear()` twin. */
const PREVIEW_EASE = springTimingFunction({ response: 0.3, dampingFraction: 0.72 }).css;
</script>

<script setup lang="ts">
import { Button } from "@mkbabb/glass-ui/button";
import { Eye, EyeOff } from "@lucide/vue";

const { state } = defineProps<{
    /** The preview's visibility; the mount owns (and persists) it. Unbound,
     *  there is no state to toggle: the preview shows and no eye is offered. */
    state?: "shown" | "hidden" | undefined;
}>();
const emit = defineEmits<{ (e: "update:state", next: "shown" | "hidden"): void }>();
</script>

<style scoped>
.preview-toggle {
    position: relative;
    /* The spring's span: its `linear()` is normalized over this duration. */
    --preview-toggle-ms: 420ms;
}

.preview-toggle__eye {
    position: absolute;
    top: 0;
    right: 0;
    z-index: var(--z-controls);
}

/* The preview's own rungs (its ball rides --z-bar) stay inside its box, so the
   eye, an in-scene control, always paints over it. */
.preview-toggle__body {
    isolation: isolate;
}

.preview-toggle__body,
.preview-toggle__glyph {
    transition:
        opacity var(--preview-toggle-ms) var(--preview-ease),
        transform var(--preview-toggle-ms) var(--preview-ease),
        visibility 0s linear 0s;
}

.preview-toggle[data-state="hidden"] .preview-toggle__body {
    opacity: 0;
    transform: scale(0.9);
    visibility: hidden;
    /* The box stays; visibility drops only once the fade has run. */
    transition-delay: 0s, 0s, var(--preview-toggle-ms);
}

/* The glyph cross-fade: eye while shown, eye-off while hidden, stacked. */
.preview-toggle__glyphs {
    display: grid;
}

.preview-toggle__glyph {
    grid-area: 1 / 1;
    width: 1rem;
    height: 1rem;
}

.preview-toggle[data-state="shown"] [data-glyph="eye-off"],
.preview-toggle[data-state="hidden"] [data-glyph="eye"] {
    opacity: 0;
    transform: scale(0.6);
}

@media (prefers-reduced-motion: reduce) {
    .preview-toggle__body,
    .preview-toggle__glyph,
    .preview-toggle[data-state="hidden"] .preview-toggle__body {
        transition: none;
    }
}
</style>
