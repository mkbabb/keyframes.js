<template>
    <!-- F.W16.S2 — the LCP hero's accessible + typographic substrate.
         (a) A single visually-hidden mirror carries the whole word to AT, so a
             screen reader reads "Select an animation", not the "S…e…l…e…c…t"
             per-glyph stream the per-character split produced.
         (b) The decorative visual layer is aria-hidden — the stagger is now
             WORD-granular (not per-character), so the text run is NOT shredded
             into per-glyph inline-blocks and glass-ui's `.text-display-*`
             `text-wrap: balance` can balance the rag (the run wraps at the real
             spaces between words). The lift-down motion is preserved at the new
             granularity (a befitting motion-granularity delta). -->
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
        <template v-for="(word, index) in words" :key="`${index}-${word}`">
            <!-- The inter-word gap is a per-word margin-inline-end, NOT a
                 whitespace text node: a whitespace-only node between two
                 inline-block boxes is collapsed by HTML, so the LCP rendered
                 "Selectananimation" (0px gap, X-5). A margin survives the
                 inline-block boxing and preserves the word-split substrate that
                 lets text-wrap: balance + the sr-only a11y mirror work. The last
                 word carries no trailing margin (it is not a separator). -->
            <span
                class="lift-down"
                v-bind="$attrs"
                :style="{
                    animationDelay: `${index * offset}s`,
                    animationDuration: duration,
                    marginInlineEnd:
                        index < words.length - 1 ? '0.25em' : undefined,
                }"
                >{{ word }}</span
            >
        </template>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

// $attrs (e.g. the `dot-fade depth-text` classes the hero passes) bind to the
// per-word visual spans, not the host — so the decorative classes still apply to
// the animated layer while the host stays a clean inline.
defineOptions({ inheritAttrs: false });

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    offset: {
        type: Number,
        default: 0.2,
    },
});

// Split into WORDS (whitespace-separated). Word-granular spans let the browser
// wrap + `text-wrap: balance` the run at real space boundaries — the per-CHARACTER
// split defeated `balance` (it had nothing to balance once the run was shredded).
// No `useWindowSize` / `width < 768` JS line-break any more: CSS owns wrapping
// (the JS media query driving layout was a pre-container-query anti-pattern).
const words = computed(() =>
    props.text.split(/\s+/).filter((w) => w.length > 0),
);

const duration = computed(
    () => `${props.text.length * props.offset + props.offset * 10}s`,
);
</script>

<style scoped>
.lift-down {
    display: inline-block;
    animation: liftDown 3s var(--ease-standard) infinite;
    animation-fill-mode: forwards;
}

@keyframes liftDown {
    0% {
        transform: translateY(0);
    }
    5% {
        transform: translateY(-10px);
    }
    10% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(0);
    }
}

.dot-fade {
    display: inline-block;
    animation: dotFade v-bind("duration") var(--ease-standard) infinite;
    animation-fill-mode: forwards;
}

@keyframes dotFade {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

/* PRM guard: the hero is the LCP node and runs perpetual infinite decorative
   motion. Under prefers-reduced-motion the words settle to their resting frame
   (no lift, fully opaque) — the engine's withReducedMotion authority mirrored at
   the CSS layer for this template-only hero. */
@media (prefers-reduced-motion: reduce) {
    .lift-down,
    .dot-fade {
        animation: none;
    }
    .dot-fade {
        opacity: 1;
    }
}
</style>
