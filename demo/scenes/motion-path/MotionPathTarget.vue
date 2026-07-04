<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 (H.W11.S1) — the STAGE-CARD register. The former bare-class
             `glass-resting cartoon-surface` div (border-radius 0 — the I4 square
             defect the user caught: "motion-path's card is NOT rounded — it
             should be impossible") SWAPS to a standard, NON-cartoon glass
             `<Card>` — the protagonist plate, rounded-card by construction (I4
             closes FOR FREE). `shadow={false}` (FORK I5-shadow). All four stage
             scenes converge to ONE register. -->
        <Card :shadow="false" class="mp-target w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- J.W7a S2 (D7 / TYP-2, MP-H2) — the scene name lifts to the
                 Instrument-Serif `text-display` rung (the display voice carried
                 inward; cross-typography §3).
                 J.W7a S2 (D8 / MP-OPP5) + S3 (D14) — the traversal's live math
                 promotes to the published MetricBadge register: the headline
                 offset-distance at the size="xl" poster rung wearing the scene
                 accent (--ball-tone, the icon cyan), the tangent as the quieter
                 lg sibling. The amplification stays in the HEADER + the NUMBER —
                 the path canvas below keeps the math live, never ornamented
                 (the §S4 anti-goal). -->
            <!-- The header rows WRAP (flex-wrap): at 375w an unwrappable row
                 starved the serif title and slid the xl badge under the Reset
                 control — the reflow keeps every member legible (the D8
                 responsive behaviour; the strip grows DOWN into the card). -->
            <div class="flex flex-wrap items-center justify-between gap-3 gap-y-1 px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex flex-wrap items-baseline gap-3 gap-y-1 min-w-0">
                    <span class="text-display text-foreground truncate">MotionPath</span>
                    <MetricBadge
                        size="xl"
                        label="offset-distance"
                        label-position="inline"
                        :value="(distance * 100).toFixed(0)"
                        unit="%"
                        color="var(--ball-tone, var(--color-progress))"
                        class="shrink-0"
                    />
                    <MetricBadge
                        size="lg"
                        label="tangent"
                        label-position="inline"
                        :value="Math.round(tangentDeg)"
                        unit="&deg;"
                        class="shrink-0"
                    />
                </div>
                <!-- Revert the edited control net to the default figure loop.
                     The accessible name STARTS WITH the visible "Reset path"
                     (WCAG 2.5.3 Label in Name / axe label-content-name-mismatch:
                     "Reset THE path…" broke the visible-text containment). -->
                <Button
                    variant="outline"
                    class="h-7 gap-1.5 text-small btn-interactive shrink-0"
                    aria-label="Reset path to the default figure"
                    @click="demo.resetPath()"
                >
                    <RotateCcw class="w-3.5 h-3.5" />
                    <span>Reset path</span>
                </Button>
            </div>

            <!-- The viewport: the author path drawn as an SVG guide, with a
                 traveller element the engine moves via offset-distance. Drag the
                 traveller ALONG the path to scrub offset-distance; drag a control
                 HANDLE to re-shape the path (the editable F4 elevation). -->
            <!-- J.W7c LANE-D (U7 / MP-PROP-2) — the stage-viewport padding drops
                 from the heavier `p-6` (24px) to `p-4` (16px), aligning the
                 motion-path stage band to the sibling stage rhythm
                 (SequenceTarget's `px-4 py-4` storyboard) AND letting the
                 height-bound square grow to fill more of its band now that it is
                 sized FROM the slot (MP-PROP). -->
            <div class="flex-1 min-h-0 flex items-center justify-center p-4">
                <div ref="stageEl" class="mp-stage relative">
                    <svg
                        class="mp-guide"
                        :viewBox="`0 0 ${VIEW} ${VIEW}`"
                    >
                        <!-- The guide path: re-reads the SINGLE-source pathD; an
                             editable-control-point drag re-emits it and BOTH this
                             d AND the traveller's offset-path change in lockstep. -->
                        <!-- L.W11 S8 — `guide-draw`: the path the engine's DrawSVG
                             self-draws on mount (then the marching-ants take over);
                             `handle-deform`: the curve deforms under a handle drag. -->
                        <path
                            ref="guidePathEl"
                            :d="demo.pathD.value"
                            class="mp-guide-path guide-draw handle-deform"
                            :class="{ 'is-self-building': selfBuilding }"
                            fill="none"
                            aria-hidden="true"
                        />
                        <!-- Control-net tethers: faint lines from each anchor to
                             its control points, so the cubic structure reads. -->
                        <line
                            v-for="tether in tethers"
                            :key="tether.id"
                            :x1="tether.x1"
                            :y1="tether.y1"
                            :x2="tether.x2"
                            :y2="tether.y2"
                            class="mp-tether"
                            aria-hidden="true"
                        />
                        <!-- The draggable control handles (H.W12.S6 / I3). Each is
                             a slider-posture node; dragging re-authors the path.
                             role="slider" REQUIRES aria-valuenow; a 2D thumb
                             carries valuenow on the x axis over the [0, VIEW]
                             user-unit space + aria-valuetext announcing BOTH
                             coordinates (the 2D-thumb slider idiom, mirroring
                             the traveller's valuenow/min/max posture below). -->
                        <!-- L.W11 S8 — author-the-curve, the-creature-obeys: each
                             control node carries `handle-deform` — dragging it
                             re-authors the cubic, the ants keep flowing on the NEW
                             shape, and the traveller banks into the new tangent. -->
                        <circle
                            v-for="pt in demo.points.value"
                            :key="pt.id"
                            :cx="pt.x"
                            :cy="pt.y"
                            :r="pt.kind === 'anchor' ? 9 : 7"
                            class="mp-handle handle-deform"
                            :class="[
                                pt.kind === 'anchor' ? 'mp-handle--anchor' : 'mp-handle--control',
                                { 'mp-handle--active': activeHandle === pt.id },
                            ]"
                            role="slider"
                            :aria-label="`Drag ${pt.kind} point ${pt.id} to reshape the path`"
                            :aria-valuenow="Math.round(pt.x)"
                            aria-valuemin="0"
                            :aria-valuemax="VIEW"
                            :aria-valuetext="`x ${Math.round(pt.x)}, y ${Math.round(pt.y)}`"
                            tabindex="0"
                            @pointerdown="onHandlePointerDown(pt.id, $event)"
                            @keydown="onHandleKeydown(pt.id, $event)"
                        />
                    </svg>
                    <!-- The traveller: the engine sets offset-path + sweeps
                         offset-distance on THIS element (fromMotionPath). Slider
                         posture — pointer-drag scrubs the distance along the path,
                         the engine resumes its sweep on release. -->
                    <!-- L.W11 S8 — `handle-deform`: the traveller OBEYS a handle
                         deform — it banks into the new tangent as you re-author the curve. -->
                    <div
                        ref="travellerEl"
                        class="progress-ball mp-traveller handle-deform"
                        :class="{ 'mp-traveller--dragging': dragging, 'mp-traveller--winking': winking }"
                        :style="{ '--tangent': `${tangentDeg}deg` }"
                        role="slider"
                        aria-label="Drag the traveller along the path"
                        :aria-valuenow="Math.round(distance * 100)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        tabindex="0"
                        @pointerdown="onPointerDown"
                        @keydown="onKeydown"
                    >
                        <!-- L.W11 S8 — THE CREATURE BANKS: the kept 🙂↔️ glyph leans
                             into the LIVE tangent (`rotate(var(--tangent))`) as it
                             walks AND as you deform a handle; `.mp-traveller-bank`
                             damps the rotation so it banks smoothly.
                             EE-MP-2: a full-lap drag winks (😎) + spins. -->
                        <span class="mp-traveller-bank">
                            <span class="mp-traveller-glyph">{{ winking ? "\u{1F60E}" : "\u{1F642}\u{200D}\u{2194}\u{FE0F}" }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- The copy-paste artifact: the live offset-path declaration
                 (H.W12.S6 / I3 / proof:motion-path-copy — the second copy
                 artifact beside Discrete's linear()). Re-reads the SAME single
                 source the guide + traveller ride, so what you copy IS what you
                 shaped. -->
            <div class="px-4 pb-3 pt-1 shrink-0">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-small text-foreground">offset-path</span>
                    <CopyButton class="shrink-0 w-4 h-4" :text="demo.copyablePath.value" />
                </div>
                <code class="artifact text-mono-caption text-muted-foreground block w-full overflow-x-auto whitespace-nowrap">{{ demo.copyablePath.value }}</code>
            </div>

            <p class="px-6 pb-5 text-small text-muted-foreground text-center">
                A WAAPI-eligible
                <span class="code-token">offset-distance: 0% &rarr; 100%</span>
                over an author
                <span class="code-token">offset-path</span> &mdash; the browser owns
                the geometry. Drag the traveller to scrub, or a handle to reshape the path.
            </p>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, useTemplateRef } from "vue";
import { Button, Card } from "@mkbabb/glass-ui";
// J.W7a S2 (D8) — the published poster-metric primitive (glass-ui 3.9.0); the
// MetricHeader abstraction over the four stage headers stays a W7b handoff edge.
import { MetricBadge } from "@mkbabb/glass-ui/metric-badge";
import { RotateCcw } from "@lucide/vue";
import CopyButton from "@components/custom/CopyButton.vue";

import { MOTION_PATH_DEMO_KEY } from "./motionPathKeys";
import { VIEW } from "./motionPathGeometry";
import { useMotionPathGesture } from "./useMotionPathGesture";

// The shared playback-button skin (the same partial the standard ribbon +
// EasingScene/SpringScene import) — the Reset-path button rides .btn-interactive
// from here for cross-scene posture parity.
import "@components/custom/animation-transport/controls/playback-button.css";

const demo = inject(MOTION_PATH_DEMO_KEY)!;

// The Target holds ONLY refs + markup; the GESTURE ENGINE (projection + the
// ManualTimeline scrub-seam + the fromMotionPath build + the editable-path
// control-handle drags, all on the shared `useDragScrub` seam) lives in
// `useMotionPathGesture` (H.W12.S2 / I9 — the W-MP-5 lift: the composable owns
// the engine, matching sequence/spring).
const stageEl = useTemplateRef<HTMLElement>("stageEl");
const travellerEl = useTemplateRef<HTMLElement>("travellerEl");
const guidePathEl = useTemplateRef<SVGPathElement>("guidePathEl");

const {
    distance,
    tangentDeg,
    dragging,
    activeHandle,
    winking,
    selfBuilding,
    onPointerDown,
    onKeydown,
    onHandlePointerDown,
} = useMotionPathGesture(demo, { stageEl, guidePathEl, travellerEl });

// The control-net tethers: a faint line from each anchor to the control points
// of the segment it begins, so the cubic structure reads (pure view derivation
// over the single-source control net). The net walks
// [a0, c0, c1, a1, c2, c3, a2, c4, c5] — each anchor tethers to the two controls
// of its outgoing segment.
const tethers = computed(() => {
    const p = demo.points.value;
    if (p.length < 9) return [];
    const link = (anchor: number, ctrl: number) => ({
        id: `${p[anchor]!.id}-${p[ctrl]!.id}`,
        x1: p[anchor]!.x,
        y1: p[anchor]!.y,
        x2: p[ctrl]!.x,
        y2: p[ctrl]!.y,
    });
    return [
        // segment a0→a1 controls c0,c1
        link(0, 1),
        link(3, 2),
        // segment a1→a2 controls c2,c3
        link(3, 4),
        link(6, 5),
        // segment a2→a0 controls c4,c5
        link(6, 7),
        link(0, 8),
    ];
});

// Keyboard parity for the control handles: arrows nudge the point by a small
// user-unit step (the slider posture, like the traveller's keyboard scrub).
const HANDLE_STEP = 6;
const onHandleKeydown = (id: string, e: KeyboardEvent) => {
    const pt = demo.points.value.find((p) => p.id === id);
    if (!pt) return;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowRight") dx = HANDLE_STEP;
    else if (e.key === "ArrowLeft") dx = -HANDLE_STEP;
    else if (e.key === "ArrowDown") dy = HANDLE_STEP;
    else if (e.key === "ArrowUp") dy = -HANDLE_STEP;
    else return;
    e.preventDefault();
    demo.movePoint(id, pt.x + dx, pt.y + dy);
};
</script>

<style scoped>
/* J.W7a S3 (D11 / CP-1, MP-OPP4) — the scene's ONE colour consumer: the
   traveller keeps its icon's promise (motion-path.svg draws the cyan dashed
   track + cyan node). Cascades from the stage root to the shared
   .progress-ball traveller, the guide path, the control net, and the readout
   accent — one token, the whole editor reads cyan (cross-color-pops §5.1). */
.mp-target {
    --ball-tone: var(--rainbow-cyan);
}

/* J.W7a S4 (D17) — a CLEAN designed field: an OPAQUE scene-tinted cyan plate
   seats the subject on its own ground (no raw global crosshatch beat).
   J.W7c LANE-D (U7 / MP-PROP) — STAGE PROPORTION FIX: sized from its OWN flex
   slot, not the viewport — `block-size` fills the (min-h-0) height, `aspect-ratio:1`
   DERIVES the width (the square invariant clientToUserUnits depends on is PRESERVED),
   `max-inline-size:100%` bounds a tall-narrow card by width; --mp-stage-max caps it. */
.mp-stage {
    --mp-stage-max: 26rem;
    block-size: min(100%, var(--mp-stage-max));
    inline-size: auto;
    max-inline-size: 100%;
    aspect-ratio: 1;
    /* L.W11 S8 — the BLUEPRINT GROUND: the kept D17 cyan wash stays the base tone;
       over it we LAYER the demo's own two-tier graph (crosshair datum + major + fine)
       tinted from --ball-tone (cyan) end-to-end + an inner-vignette depth. --c = cyan. */
    --c: var(--ball-tone, var(--color-progress));
    background-color: color-mix(in srgb, var(--c) var(--stage-field-tint, 4%), var(--background));
    background-image:
        linear-gradient(to right, transparent calc(50% - 0.5px), color-mix(in srgb, var(--c) 12%, transparent) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
        linear-gradient(to bottom, transparent calc(50% - 0.5px), color-mix(in srgb, var(--c) 12%, transparent) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
        repeating-linear-gradient(to right, color-mix(in srgb, var(--c) 8%, transparent) 0 1px, transparent 1px var(--graph-major, 5rem)),
        repeating-linear-gradient(to bottom, color-mix(in srgb, var(--c) 8%, transparent) 0 1px, transparent 1px var(--graph-major, 5rem)),
        repeating-linear-gradient(to right, color-mix(in srgb, var(--c) 4%, transparent) 0 1px, transparent 1px var(--graph-pitch, 1rem)),
        repeating-linear-gradient(to bottom, color-mix(in srgb, var(--c) 4%, transparent) 0 1px, transparent 1px var(--graph-pitch, 1rem));
    border-radius: var(--radius-card);
    box-shadow: inset 0 0 32px color-mix(in srgb, var(--c) 6%, transparent);
    cursor: crosshair; /* the whole field reads as a drawing canvas */
}

.mp-guide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    /* The guide path + tethers are a passive backdrop (the traveller above owns
       the scrub pointer); the control HANDLES re-enable pointer events so they
       can receive the reshape drag (H.W12.S6 / I3). */
    pointer-events: none;
}

/* The author path drawn as a dashed guide so the traversal reads against it —
   tinted from the scene's tone seam (J.W7a S3 / D11: the icon cyan), so guide,
   net, and traveller read as ONE coloured voice. */
.mp-guide-path {
    stroke: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 35%, transparent);
    stroke-width: 2.5;
    stroke-dasharray: 6 7;
    stroke-linecap: round;
    /* L.W11 S8 — MARCHING ANTS: a slow stroke-dashoffset loop (one `6 7` cycle = 13
       units) so the track reads as a live conveyor, flowing on the NEW shape as you
       deform. PRM holds it static; suppressed while the guide self-builds. */
    animation: mp-ants 3s linear infinite;
}
/* The marching-ants loop is held off while DrawSVG self-builds (same dash prop). */
.mp-guide-path.is-self-building {
    animation: none;
}

/* L.W11 S8 instrument-egg markers (proof:design-refinement domMarker, owned here
   so they resolve under proof:styling-idioms): `guide-draw` = the DrawSVG self-draw
   path; `handle-deform` = every author-the-curve participant (guide/nodes/traveller).
   The will-change keeps the compositor warm; PRM drops the hint. */
.guide-draw { will-change: stroke-dashoffset; }
.handle-deform { will-change: transform; }
@media (prefers-reduced-motion: reduce) {
    .guide-draw,
    .handle-deform { will-change: auto; }
}
@keyframes mp-ants {
    to { stroke-dashoffset: -13; }
}

/* ── Editable control net (H.W12.S6 / I3 — the F4 elevation) ──────────────────
   The faint anchor→control tethers show the cubic structure; the handles are the
   draggable nodes that re-author the single-source path. Tinted from the shared
   --ball-tone seam (D11) so the editor reads as one with the guide. */
.mp-tether {
    stroke: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 22%, transparent);
    stroke-width: 1;
    stroke-dasharray: 3 4;
}

.mp-handle {
    fill: var(--background);
    stroke: var(--ball-tone, var(--color-progress));
    stroke-width: 2;
    cursor: grab;
    pointer-events: auto;
    transition:
        r 120ms ease,
        fill 120ms ease;
}
.mp-handle:hover,
.mp-handle:focus-visible {
    fill: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 30%, var(--background));
    outline: none;
}
/* Anchors (ON the path) read solid; controls (OFF the path) read hollow + a
   softer tint — the GSAP-editor convention (square-ish anchors, round controls;
   here a fill/tint delta keeps the SVG simple). */
.mp-handle--anchor {
    fill: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 55%, var(--background));
}
.mp-handle--control {
    stroke-dasharray: 2.5 2.5;
}
.mp-handle--active {
    cursor: grabbing;
    fill: var(--ball-tone, var(--color-progress));
}

/* The traveller rides the engine-set offset-path (position = swept
   offset-distance). It consumes the shared .progress-ball idiom; only per-site
   variation lives here: offset-path positioning (top/left:0, not margin-centered),
   --ball-size 2.75rem (the largest ball), --ball-glow 40% (a NAMED cohesion delta
   over the 35% default), grid place-items:center for the glyph, and grab +
   touch-action:none for the S4a drag affordance. */
.mp-traveller {
    top: 0;
    left: 0;
    margin-top: 0;
    display: grid;
    place-items: center;
    --ball-size: 2.75rem;
    --ball-glow: 40%;
    will-change: offset-distance;
    cursor: grab;
    touch-action: none;
    /* The shared .progress-ball idiom is `pointer-events: none` (a decorative
       scrubber ball riding a rail). The traveller is the S4a DRAG affordance
       (role="slider", @pointerdown) — re-enable pointer events so it can
       actually receive the drag the handler is wired for. */
    pointer-events: auto;
}

.mp-traveller--dragging {
    cursor: grabbing;
    --ball-glow: 55%;
}

/* L.W11 S8 — THE BANKING WRAPPER: the kept 🙂↔️ glyph tilts to the LIVE tangent,
   damped (`transition: rotate`); a separate wrapper so the wink spin + bank don't fight. */
.mp-traveller-bank {
    display: grid;
    place-items: center;
    rotate: var(--tangent, 0deg);
    transition: rotate 120ms ease-out;
}

.mp-traveller-glyph {
    /* H.W4.S4 (L2 leaf-tail sweep) — the raw 1.25rem was eyeballing the √φ
       rung; route it to the named `--type-subheading` (1.272rem) so the
       traveller glyph sits on the φ ladder, not a stray literal. */
    font-size: var(--type-subheading);
    line-height: 1;
    pointer-events: none;
}

/* EE-MP-2 "the emoji winks" + L.W11 S8 crayon-spark. A full-lap drag swaps to 😎 +
   spins; the ONE proportionate crayon-spark is a single warm --rainbow-yellow flash
   (~120ms) — the warm family KEPT, earning its one lap delight. PRM-off.
   IDIOM-CONSUMING: the base ball glow stays the .progress-ball idiom's
   --ball-glow box-shadow (design-idioms.css:584) — the wink only LIFTS --ball-glow
   (40% → 60%); the warm spark rides a SEPARATE filter drop-shadow keyed to
   --rainbow-yellow, so it never re-authors the idiom's --color-progress box-shadow
   (proof:idioms scene-refork:zero). */
.mp-traveller--winking {
    --ball-glow: 60%;
    animation:
        mp-wink-spin 700ms cubic-bezier(0.34, 1.56, 0.64, 1),
        mp-wink-spark 700ms ease-out;
}
@keyframes mp-wink-spark {
    0%, 100% { filter: drop-shadow(0 0 0 transparent); }
    14% {
        filter: drop-shadow(0 0 11px color-mix(in srgb, var(--rainbow-yellow) 70%, transparent));
    }
}
@keyframes mp-wink-spin {
    0% { transform: rotate(0) scale(1); }
    55% { transform: rotate(220deg) scale(1.25); }
    100% { transform: rotate(360deg) scale(1); }
}

/* The copy-paste artifact — the inline-code register the StartingStyle/Discrete
   scenes use for their linear() output; shared visual so the demo's two
   copy-paste artifacts (linear() + offset-path) read identically. */
.artifact {
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-md, 0.5rem);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
}

/* MANDATORY PRM degrade — the wink/spark/marching-ants/banking-ease are decorative;
   under reduced motion the glyph still swaps + the tangent rotation still applies
   (a static state read), but the continuous + transitional motion is held. */
@media (prefers-reduced-motion: reduce) {
    .mp-traveller--winking { animation: none; }
    .mp-handle { transition: none; }
    .mp-guide-path { animation: none; }
    .mp-traveller-bank { transition: none; }
}
</style>
