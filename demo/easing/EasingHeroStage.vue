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
            <!-- L.W11 S5 — the projected trace promoted to a glowing SIGNAL +
                 self-drawing on enter. The path is the SAME single-source
                 demo.svgPath the sidebar canvas renders; the gradient stroke is
                 brightest at the core and falls to the tails (the beam is
                 brightest where the action is). The `trace-smear` filter applies
                 a directional motion-blur read from the demo's SmoothProgress
                 decay (`demo.traceSmearAmount()`) so a handle drag SMEARS the
                 beam, decaying to a crisp trace on release (PRM-snapped). -->
            <svg
                ref="stageCurveEl"
                class="easing-stage-curve trace-smear"
                :style="{ '--trace-smear': smearBlur }"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="easing-trace-grad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" class="trace-grad-tail" />
                        <stop offset="50%" class="trace-grad-core" />
                        <stop offset="100%" class="trace-grad-tail" />
                    </linearGradient>
                </defs>
                <path
                    ref="stageCurvePathEl"
                    class="easing-stage-curve-path self-draw"
                    :d="demo.svgPath.value"
                />
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

import { kfEngine } from "@utils/kfEngine";
import { EASING_DEMO_KEY } from "./easingKeys";

const demo = inject(EASING_DEMO_KEY)!;

// Owned refs (W3.S1 — no string-class DOM walks): the hero track the geometry
// is measured off + the hero dot the rAF painter positions imperatively.
const heroTrackEl = useTemplateRef<HTMLElement>("heroTrackEl");
const heroBallEl = useTemplateRef<HTMLElement>("heroBallEl");
const heroTrackWidth = ref(0);

// L.W11 S5 — the projected-trace SVG + its path (the self-drawing-on-enter +
// drag-smear targets). `smearBlur` is the reactive CSS-var fallback the template
// binds; the live per-frame value is written imperatively below (off the render
// graph) by sampling the demo's SmoothProgress decay.
const stageCurveEl = useTemplateRef<SVGSVGElement>("stageCurveEl");
const stageCurvePathEl = useTemplateRef<SVGPathElement>("stageCurvePathEl");
const smearBlur = ref("0px");

// Whether reduced-motion is requested — the smear + the self-draw boot both snap.
const prefersReducedMotion = (): boolean =>
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

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
//
// L.W11 S5 (the drag-smear egg) — the SAME painter also samples the demo's
// SmoothProgress smear decay (`demo.traceSmearAmount()`) and writes the
// directional motion-blur amount onto the trace SVG as a CSS var, OFF the render
// graph. A handle drag kicks the smear (in useEasingDemo.updateBezierPoints); it
// relaxes to 0 via the engine's SmoothProgress (inv ζ — no hand-rolled rAF). The
// blur is suppressed under reduced-motion (the smear value still decays; we just
// never paint a blur).
let smearReduced = false;
const paintHeroDot = (phase: number) => {
    const el = heroBallEl.value;
    if (el) el.style.transform = `translateX(${heroBallXAt(phase)}px)`;
    const svg = stageCurveEl.value;
    if (svg && demo.traceSmearAmount) {
        const amt = smearReduced ? 0 : demo.traceSmearAmount();
        // Scale to a gentle px blur (the trace lives in unit space, projected to
        // ~the plate width; ~0..3px reads as a beam smear without erasing it).
        svg.style.setProperty("--trace-smear", `${(amt * 3).toFixed(2)}px`);
    }
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
    smearReduced = prefersReducedMotion();
    measureHeroTrackWidth();
    unregisterPainter = demo.registerDotPainter(paintHeroDot);

    // L.W11 S5 (the once-on-enter self-drawing trace) — the projected curve draws
    // itself origin→end via the library's OWN DrawSVG / fromDrawSVG primitive (the
    // inv ζ dogfood — the engine's stroke-dashoffset line-drawing). A delight on
    // first paint; PRM snaps straight to the drawn state. The engine is already
    // warm (kfEngine resolves before any scene mounts), so this is synchronous.
    const path = stageCurvePathEl.value;
    if (path && typeof path.getTotalLength === "function") {
        if (prefersReducedMotion()) {
            // Snap to drawn: clear any dash so the full trace shows immediately.
            path.style.strokeDasharray = "";
            path.style.strokeDashoffset = "";
        } else {
            const { fromDrawSVG } = kfEngine();
            // Draw in over ~620ms with the standard ease — the instrument "powers
            // on" once, then the page is simply the page.
            fromDrawSVG(path, { duration: 620, timingFunction: "ease-out" });
        }
    }
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
    /* L.W11 S5 — scope-local trace tokens (the KEPT --ppmycota-primary, never
       recolored — these are additive aliases for the bloom + smear). */
    --trace: var(--ppmycota-primary, var(--primary));
    --trace-glow: color-mix(in srgb, var(--ppmycota-primary, var(--primary)) 55%, transparent);
    --trace-smear: 0px;
    /* The drag-bend SMEAR — a directional motion-blur read from the demo's
       SmoothProgress decay (written per-frame as --trace-smear). At rest 0px
       (crisp); a fast handle drag blooms it, decaying back to 0 on release. */
    filter: blur(var(--trace-smear, 0px));
    transition: filter 60ms linear;
}
/* L.W11 S5 — the trace promoted to a glowing SIGNAL: a gradient stroke (bright
   violet at the core, falling to the tails) + an emitted-light bloom, so the
   projected curve reads as a beam, not an 8% ghost. The hero ball still FOLLOWS
   the curve; the curve is now a luminous signal rather than barely-there. */
.easing-stage-curve-path {
    fill: none;
    stroke: url(#easing-trace-grad);
    stroke-width: 3px;
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    filter: drop-shadow(0 0 4px var(--trace-glow));
}
.trace-grad-core {
    stop-color: var(--ppmycota-primary, var(--primary));
    stop-opacity: 0.24;
}
.trace-grad-tail {
    stop-color: var(--ppmycota-primary, var(--primary));
    stop-opacity: 0.07;
}

@media (prefers-reduced-motion: reduce) {
    .easing-stage-curve {
        /* Snap: no smear transition, no blur (the self-draw also snaps in JS). */
        filter: none;
        transition: none;
    }
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
