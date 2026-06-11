<template>
    <!-- G4 (H.W10.S3) — the `singular` stage is ONE large engine-driven ball,
         NOT a second copy of the curve editor (the duplicate
         EasingCurveCanvas is DELETED; the editable curve lives in the sidebar
         ONLY). The ball traverses under the SELECTED easing: its x-position
         is `fn(progress) * maxX` over the shared `.progress-rail`/
         `.progress-ball` idiom (the same `getBallX` math the comparison rows
         use, at hero size) — the curve in MOTION (the inv ζ dogfood: the
         ball's position IS the timing function applied to the engine's
         progress sweep). One transport, one ball, all engine.
         Extracted as the colocated hero-stage sub-component (markup + painter
         + projected-curve CSS travel together; the J.W7a fix-round
         proof:demo-no-oversize seam — ZERO appearance delta, the DOM and
         every class are byte-identical to the pre-split tree). -->
    <!-- J.W7a S1 (D4 / E2) — the hero rail anchors at the LOWER THIRD of
         the stage (`items-end` + the pb rung), not dead-center: the ball
         rides the stage FLOOR with open sky above — a deliberate
         compositional choice (the ball rises as the curve accelerates),
         replacing the accidental dead-centering in ~90% empty glass. The
         freed upper field is where the projected ghost curve lives (E1,
         the S4 math band). -->
    <!-- J.W7a S4 (D16 / E1 + C1) — the stage projects its OWN bezier across
         the floor: the signature curve was exiled to a ~300px sidebar while
         the protagonist stage showed a ball on a flat line. The ghost is a
         scaled-up low-opacity projection of the SAME single-source
         `demo.svgPath` the sidebar canvas renders (the live computed — a
         handle drag re-emits it and the projected `d` MUTATES in lockstep,
         the §Hard-gate clause-d oracle), drawn in the curve's own
         --ppmycota-primary at the lane-named 6–8% presence. The ball's
         x already equals fn(progress)·maxX — the curve behind it makes the
         relationship visible. The motion-path stage (C7) is the reference
         pattern this now matches.
         J.W7a S4 (D17 / C2) — the floor carries the `.stage-field-y`
         coordinate frame (value gridlines at 0.25/0.5/0.75 + the t-axis
         baseline, the curve canvas's own --border hairline treatment) so
         the projected specimen reads against the SAME graph language as
         the sidebar editor. -->
    <div class="flex w-full flex-1 min-h-0 justify-center">
        <div class="stage-floor stage-field-y relative flex w-full max-w-3xl items-end pb-12">
            <svg
                class="easing-stage-curve"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path class="easing-stage-curve-path" :d="demo.svgPath.value" />
            </svg>
            <div ref="heroTrackEl" class="hero-track relative w-full h-16">
                <div class="progress-rail"></div>
                <!-- I.W4 D4 — the hero dot is positioned by a DIRECT non-reactive
                     `style.transform` write inside the rAF loop (the registered
                     dot painter below), NOT a per-frame reactive `:style` binding.
                     This is the dot that drove the 243-node SVG re-render storm. -->
                <div
                    ref="heroBallEl"
                    class="progress-ball hero-ball"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onScopeDispose, ref, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

import { EASING_DEMO_KEY } from "./easingKeys";

const demo = inject(EASING_DEMO_KEY)!;

// Owned refs (W3.S1 — no string-class DOM walks): the hero track the geometry
// is measured off + the hero dot the rAF painter positions imperatively.
const heroTrackEl = useTemplateRef<HTMLElement>("heroTrackEl");
const heroBallEl = useTemplateRef<HTMLElement>("heroBallEl");
const heroTrackWidth = ref(0);

// ── G4 — the singular hero ball's x = `fn(progress) * maxX` ─────
// The selected easing function applied to the engine's linear `progress` sweep:
// the curve in MOTION (the inv ζ dogfood). The ball traverses the full hero
// track; the SIZE constant matches the CSS --ball-size below.
const HERO_BALL_SIZE = 56;

// Pure geometry at a raw sweep value (NO reactive read — the painter is called
// with the loop's live phase). `currentEasingFn(phase)` is the curve in motion,
// resolved LIVE so a sidebar handle drag re-shapes the traversal at once.
const heroBallXAt = (phase: number): number => {
    const maxX = heroTrackWidth.value - HERO_BALL_SIZE;
    if (maxX <= 0) return 0;
    return demo.currentEasingFn.value(phase) * maxX;
};

// I.W4 D4 — the dot painter: a DIRECT non-reactive `style.transform` write,
// registered with the demo's loop seam and called imperatively each frame (the
// hot path lives OFF the Vue render graph).
const paintHeroDot = (phase: number) => {
    const el = heroBallEl.value;
    if (!el) return;
    el.style.transform = `translateX(${heroBallXAt(phase)}px)`;
};

const measureHeroTrackWidth = () => {
    if (heroTrackEl.value) {
        heroTrackWidth.value = heroTrackEl.value.clientWidth;
    }
    // A width change moves the dot's max-x → repaint at the live phase so the
    // paused/steady position is correct without waiting for the next frame.
    demo.repaintDots();
};

// The hero stage mounts ONLY in the `singular` view mode (the parent v-if), so
// the painter's lifecycle IS the component's: register on mount (the demo
// paints once on register, so a paused scene shows the correct rest position),
// unregister on dispose.
let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    measureHeroTrackWidth();
    unregisterPainter = demo.registerDotPainter(paintHeroDot);
});
onScopeDispose(() => unregisterPainter?.());

// vueuse owns the observer lifecycle (tryOnScopeDispose cleanup).
useResizeObserver(heroTrackEl, () => measureHeroTrackWidth());
</script>

<style scoped>
/* ── J.W7a S4 (D16 / E1) — the projected stage-floor bezier ──
   The ghost of the LIVE curve (demo.svgPath, unit space, y already inverted)
   stretched across the freed sky above the lower-third rail. Spans from the
   frame top down to the RAIL LINE (the pb-12 gutter + half the h-16 track =
   5rem), so the curve's t-axis lands on the rail the ball rides.
   --ppmycota-primary at 8% (the lane-named 6–8% presence): the curve colour,
   barely there — "the purple curve SHAPES the path; the green-family ball
   FOLLOWS it" (E7), the math visible without rivaling the subject. */
.easing-stage-curve {
    position: absolute;
    left: 0;
    right: 0;
    top: 0.5rem;
    bottom: 5rem;
    pointer-events: none;
    overflow: visible;
}
.easing-stage-curve-path {
    fill: none;
    stroke: var(--ppmycota-primary, var(--primary));
    stroke-width: 3px;
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    opacity: 0.08;
}

/* ── G4 (H.W10.S3) — the singular hero ball ──
   ONE large engine-driven ball, the curve in MOTION. Rides the shared
   `.progress-rail`/`.progress-ball` idiom (EasingTarget is the canonical
   rail-tint 8% / ball-glow 35% lineage; the scene's --ball-tone (D11)
   cascades in from the `.easing-target` stage root). The per-site delta is
   only the hero SIZE (matched to the JS HERO_BALL_SIZE constant the x-math
   reads) and the transform-positioning perf hint. */
.hero-track {
    display: flex;
    align-items: center;
}
.hero-ball {
    --ball-size: 56px;
    left: 0;
    will-change: transform;
}
</style>
