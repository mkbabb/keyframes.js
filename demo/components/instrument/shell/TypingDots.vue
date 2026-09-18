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
    <span
        class="typing-dots"
        aria-hidden="true"
        :style="{ '--typing-dot-rest': REST_OPACITY }"
    >
        <span v-for="i in dotCount" :key="i" ref="dotEls" class="typing-dot">{{
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
import {
    AnimationOptionError,
    loadAnimationEngine,
    stagger,
} from "@mkbabb/keyframes.js";

const props = withDefaults(
    defineProps<{
        /**
         * How many dots to render + drive (the "..." is three). READ ONCE, at
         * setup: this is a MOUNT-ONCE contract, not a reactive dial — see
         * `dotCount`.
         */
        count?: number;
        /** The static glyph each dot renders (never interpolated — S3). */
        glyph?: string;
    }>(),
    {
        count: 3,
        glyph: ".",
    },
);

// KF-TD-3 + KF-EST-18 — ONE CONTRACT MOTION, and the arm taken is VALIDATE +
// MOUNT-ONCE (never two of the three arms half-done).
//
// VALIDATE, because the prop is public and numeric and its ONLY guard was
// Vue's dev-only `renderList` branch: in the production bundle a fractional,
// negative, NaN or Infinite `count` reached `new Array(n)` and threw a bare
// `RangeError: Invalid array length` from inside the LCP `<h1>`'s render, with
// no `app.config.errorHandler` and no `onErrorCaptured` ancestor to catch it.
// The refusal below is the same fail-explicit posture the engine's own
// `stagger` takes on an option it cannot honour, raised through the same error
// type, so the failure names the option, the value and the contract instead of
// an array-length internal.
//
// MOUNT-ONCE, because the engine wiring already was: `delays` is distributed
// at setup and the per-dot animations are constructed in `onMounted`, so a
// later `count` change re-rendered spans that no animation drove and left the
// animations of removed dots running against detached nodes. Freezing the
// count at the door makes the contract the code already had the contract the
// template states, and it collapses the `delays[i]` tail: the distribution and
// the span list are the same length by construction.
const dotCount = ((n: number): number => {
    if (!Number.isInteger(n) || n < 1) {
        throw new AnimationOptionError(
            "count",
            n,
            "TypingDots renders one engine-driven span per dot: count must be a positive integer, and it is read once at mount.",
        );
    }
    return n;
})(props.count);

// A FIXED short cycle — NOT text.length-derived (the headline bug was a
// title-sized 2.6s duration mis-applied to a 3-glyph ellipsis). 1.2s total
// holds under the ≤1.6s ceiling with margin — asserted by
// `test/demo/instrument/typing-dots-engine-seam.test.ts`.
//
// KF-TD-9 — THE PHASE LOCK, RECORDED (it was a coincidence documented in
// neither file): the two ornaments in the LCP `<h1>` beat 3:1 — the sibling
// glyph wave runs on `--wave-cycle: 3600ms` (`AnimatedText.vue`'s own root
// token) against this 1200 ms, so the dots complete exactly three cycles per
// wave. Nothing enforces it and nothing renders wrong if it breaks;
// perceptibility is not claimed here. It is written down so an edit to either
// clock is an edit made KNOWINGLY — change one and the beat is gone.
const CYCLE_MS = 1200;
// The per-dot stagger increment — the left-to-right cadence step. ~0.16s gives
// a `. → ·· → ···` march; with 3 dots the spread is 2·160 = 320ms, well inside
// the cycle.
const STEP_MS = 160;
// Rest opacity NEVER 0 (the perceptual fix + the ≥0.15 floor the seam spec
// asserts): the dots dim to 0.2 and pulse to 1, never blanking out.
//
// KF-TD-6 — ONE AUTHORITY, and the CSS floor SURVIVES: this constant and the
// scoped rule's resting paint are the same load-bearing number, and they used
// to be two unbound copies of it — a desync would have rendered perfectly,
// which is what made it a defect rather than a bug. The floor is the designed
// resting frame (the dots are readable before the first engine frame and under
// reduced motion, where the engine snaps to the 0%/100% keyframe), so the bind
// runs the only direction that keeps it: the constant is published onto the
// container as `--typing-dot-rest` and the rule READS it. Deleting the rule
// would delete the resting paint; there is now nothing to desync.
const REST_OPACITY = 0.2;

const dotEls = useTemplateRef<HTMLElement[]>("dotEls");

// The per-dot delays are the `stagger` distribution — `from: "first"` is the
// monotone left-to-right ramp (0, STEP, 2·STEP, …) the reader's eye expects.
// `stagger` is the library's own delay-distribution
// primitive (the same one the sequence scene seats its rows with).
const delays = stagger(dotCount, { each: STEP_MS, from: "first" }).delays(
    dotCount,
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
    /* KF-TD-7 — the former `display: inline-block` is gone: these are flex
       items of the `inline-flex` container above (the file's only markup), and
       flex items are blockified, so the declaration named a box the element
       could never have. */

    /* The engine paints `opacity` each frame; the rest value is the starting
       paint so the dots are visible (not invisible) before the first frame
       and under prefers-reduced-motion (the engine snaps to the resting
       frame, which the keyframe's 0%/100% sets to REST_OPACITY → readable).
       KF-TD-6: the value is the script's `REST_OPACITY`, published on the
       container — ONE authority, and this floor stays. */
    opacity: var(--typing-dot-rest);
}
</style>
