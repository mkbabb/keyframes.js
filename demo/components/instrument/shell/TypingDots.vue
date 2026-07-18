<template>
    <!-- H.W6.S1/S2/S3 — the typing-indicator dots, dogfooded onto the engine.
         The hero's first-paint "..." is no longer a hand-rolled CSS @keyframes
         (the old AnimatedText `.dot-fade` was ONE span fading as a unit, on a
         title-sized 2.6s clock, blanking to opacity:0 for 43% of every cycle).

         This is a dedicated substrate that CAN stagger: N explicit dot <span>s,
         each driven by its OWN engine animation — the inv-ζ seam (the demo's
         signature animation IS the library, not pure CSS). The "..." glyphs are
         STATIC <span> text content (S3) — only numeric opacity is interpolated,
         so no string ever reaches a `_lerp` value position. Carries NEITHER
         `.lift-down` NOR `.dot-fade` (the cascade collision dies with the split:
         no node carries two `animation` shorthands). -->
    <span class="typing-dots" aria-hidden="true">
        <span v-for="i in count" :key="i" ref="dotEls" class="typing-dot">{{
            glyph
        }}</span>
    </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
// The inv-ζ dogfood seam: the dots loop on the kf ENGINE itself
// (mirrors CopyButton.vue:24 / typingCursor / spinner — a per-dot
// CSSKeyframesAnimation with iterationCount: Infinity). `steppedEase` is the
// value.js CURVE for the discrete dot cadence, NOT the dogfood symbol.
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine, stagger } from "@mkbabb/keyframes.js";

const props = withDefaults(
    defineProps<{
        /** How many dots to render + drive (the "..." is three). */
        count?: number;
        /** The static glyph each dot renders (never interpolated — S3). */
        glyph?: string;
    }>(),
    {
        count: 3,
        glyph: ".",
    },
);

// A FIXED short cycle — NOT text.length-derived (the headline bug was a
// title-sized 2.6s duration mis-applied to a 3-glyph ellipsis). 1.2s total
// holds under proof:typing-dots (d)'s ≤1.6s ceiling with margin.
const CYCLE_MS = 1200;
// The per-dot stagger increment — the left-to-right cadence step. ~0.16s gives
// a `. → ·· → ···` march; with 3 dots the spread is 2·160 = 320ms, well inside
// the cycle.
const STEP_MS = 160;
// Rest opacity NEVER 0 (the perceptual fix + proof:typing-dots (c)'s ≥0.15
// floor): the dots dim to 0.2 and pulse to 1, never blanking out.
const REST_OPACITY = 0.2;

const dotEls = useTemplateRef<HTMLElement[]>("dotEls");

// The per-dot delays are the `stagger` distribution — `from: "first"` is the
// monotone left-to-right ramp (0, STEP, 2·STEP, …) the reader's eye expects
// (proof:typing-dots (b)). `stagger` is the library's own delay-distribution
// primitive (the same one the sequence scene seats its rows with).
const delays = stagger(props.count, { each: STEP_MS, from: "first" }).delays(
    props.count,
);

const anims: CSSKeyframesAnimation<{ opacity: number }>[] = [];

// Guards a late engine resolve against an early unmount: if the component tore
// down while loadAnimationEngine() was in flight, do not play/leak any anim.
let unmounted = false;

onMounted(async () => {
    const els = dotEls.value;
    if (!els) return;

    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    if (unmounted) return;

    els.forEach((el, i) => {
        // PRIMARY loop path: a per-dot CSSKeyframesAnimation with
        // iterationCount: "infinite" (→ Infinity). NOT a NumericAnimation —
        // NumericAnimation.play() is single-pass and an infinite blink would
        // need a forbidden hand-rolled rAF re-loop (WV-W6-HIGH-2). The engine
        // owns the loop; respectReducedMotion routes the PRM resting frame
        // through the shared withReducedMotion authority (replacing the old
        // hand-mirrored @media block).
        const anim = new CSSKeyframesAnimation<{ opacity: number }>({
            duration: CYCLE_MS,
            delay: delays[i] ?? 0,
            iterationCount: "infinite",
            timingFunction: "steps(4, jump-none)",
            respectReducedMotion: true,
        }).fromKeyframes({
            "0%": { opacity: REST_OPACITY },
            "50%": { opacity: 1 },
            "100%": { opacity: REST_OPACITY },
        });
        anim.setTargets(el);
        anim.play();
        anims.push(anim);
    });
});

onBeforeUnmount(() => {
    unmounted = true;
    for (const anim of anims) anim.stop();
    anims.length = 0;
});
</script>

<style scoped>
.typing-dots {
    display: inline-flex;
    /* Tracks the surrounding type so the dots sit on the hero's baseline. */
    align-items: baseline;
}

.typing-dot {
    display: inline-block;
    /* The engine paints `opacity` each frame; the rest value is the starting
       paint so the dots are visible (not invisible) before the first frame
       and under prefers-reduced-motion (the engine snaps to the resting
       frame, which the keyframe's 0%/100% sets to REST_OPACITY → readable). */
    opacity: 0.2;
}
</style>
