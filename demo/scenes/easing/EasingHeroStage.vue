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
         relationship visible.
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
            <!-- Q.WC2 S1 — the HERO is now the demo's PRIMARY direct-manipulation
                 instrument: two DemoControlPoint handles (over the LIGHT drag2D,
                 critically damped — Q.WC1) are promoted onto the hero projection,
                 sharing the SAME bezier model as the sidebar editor (a hero drag
                 and a sidebar drag are the SAME edit). This overlay SVG carries
                 the SAME geometry as the decorative trace (viewBox 0 0 1 1 +
                 `preserveAspectRatio="none"` non-uniform scale — the per-axis CTM
                 decouples cleanly), but is NOT aria-hidden / pointer-events:none
                 on its handles: grab the curve where it is largest, watch the ball
                 re-time in real time. The trace path above stays decorative; this
                 is the editable handle layer. -->
            <div
                v-if="demo.isBezierEditable.value && heroBezierPoints"
                class="easing-stage-handles-box"
            >
                <svg
                    ref="heroHandlesEl"
                    class="easing-stage-handles"
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                >
                    <DemoControlPoint
                        :model-value="heroCp0"
                        :svg="heroHandlesEl"
                        :index="0"
                        :anchor="{ x: 0, y: 0 }"
                        :radius="0.022"
                        aria-label="Hero curve control point 1"
                        @update:model-value="onHeroControlPoint(0, $event)"
                    />
                    <DemoControlPoint
                        :model-value="heroCp1"
                        :svg="heroHandlesEl"
                        :index="1"
                        :anchor="{ x: 1, y: 1 }"
                        :radius="0.022"
                        aria-label="Hero curve control point 2"
                        @update:model-value="onHeroControlPoint(1, $event)"
                    />
                </svg>
            </div>
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
import { computed, inject, onMounted, onScopeDispose, ref, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

import { kfEngine } from "@utils/kfEngine";
import DemoControlPoint from "@components/custom/instrument/easing/DemoControlPoint.vue";
import type { ControlPointValue } from "@components/custom/instrument/easing/DemoControlPoint.vue";
import { EASING_DEMO_KEY } from "./easingKeys";

const demo = inject(EASING_DEMO_KEY)!;

// ── Q.WC2 S1 — the hero control-point handles (the PRIMARY edit surface) ──
// The handles overlay SVG (its own getScreenCTM is the per-axis client-px ↔
// curve-[0,1] map) + the two DemoControlPoint v-models in CURVE space, read off
// the shared bezier model. A hero drag writes back through `demo.updateBezier
// Points` — the SAME seam the sidebar uses, so both hosts edit one model.
const heroHandlesEl = useTemplateRef<SVGSVGElement>("heroHandlesEl");
const heroBezierPoints = computed(() => demo.bezierControlPoints.value);
const heroCp0 = computed<ControlPointValue>(() => ({
    x: heroBezierPoints.value[0],
    y: heroBezierPoints.value[1],
}));
const heroCp1 = computed<ControlPointValue>(() => ({
    x: heroBezierPoints.value[2],
    y: heroBezierPoints.value[3],
}));
const onHeroControlPoint = (index: number, value: ControlPointValue) => {
    const pts: [number, number, number, number] = [...heroBezierPoints.value];
    pts[index * 2] = value.x;
    pts[index * 2 + 1] = value.y;
    demo.updateBezierPoints(pts);
};

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

/* Q.WC2 S1 — the EDITABLE handle overlay: the SAME geometry frame as the
   decorative `.easing-stage-curve` trace (so the handles register exactly on the
   rendered curve), but interactive — NOT aria-hidden / pointer-events:none. An
   SVG's EMPTY regions (no painted fill) are click-through BY DEFAULT, so leaving
   the SVG at the default `pointer-events: auto` makes only the painted handles +
   control-lines capture the pointer while the bare curve field passes the gesture
   through — the stage is not blocked, and the handles stay hittable (a
   `pointer-events:none` SVG would, under `preserveAspectRatio="none"`, drop the
   children from the box-level hit-test). The scope-local --trace tokens supply
   the handle specular (inherited by DemoControlPoint). */
/* Q.WC2 S1 — the handle box. A POSITIONED DIV establishes a DETERMINISTIC px box
   (an inline `<svg>` with only `top/bottom/left/right` falls back to its 1:1
   viewBox aspect → a 768² square that overflows the visible stage and drops the
   lower handles below the fold; a div parent with a real height fixes the SVG
   sizing so the handles hit-test at their rendered position). The box matches the
   trace's intended curve region (top 0.5rem → the rail line at 5rem). */
.easing-stage-handles-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0.5rem;
    bottom: 5rem;
    z-index: var(--z-content);
    pointer-events: none;
    --trace: var(--ppmycota-primary, var(--primary));
    --trace-glow: color-mix(
        in srgb,
        var(--ppmycota-primary, var(--primary)) 55%,
        transparent
    );
}
.easing-stage-handles {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
}
/* The box + the SVG are click-through; only the painted handles + their
   control-lines capture the pointer (so the bare curve field passes the gesture
   through and the stage is not blocked). The box now being a real px rectangle,
   the handles hit-test at their rendered position (no preserveAspectRatio="none"
   box-level distortion). */
.easing-stage-handles :deep(.control-point.handle),
.easing-stage-handles :deep(.handle-line) {
    pointer-events: auto;
}
/* The hero handle reads larger than the sidebar's (the stage is the protagonist
   surface) and carries a brighter specular so it invites the grab. */
.easing-stage-handles :deep(.control-point.handle) {
    stroke-width: 0.012;
    filter: drop-shadow(0 0 0.012px var(--trace-glow));
}
.easing-stage-handles :deep(.control-point.handle:hover),
.easing-stage-handles :deep(.control-point.handle:focus-visible) {
    r: 0.03;
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
