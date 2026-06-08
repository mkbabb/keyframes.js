<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 (H.W11.S1) — the STAGE-CARD register. The former bare-class
             `glass-resting cartoon-surface` div (border-radius 0 — the I4 square
             defect the user caught: "motion-path's card is NOT rounded — it
             should be impossible") SWAPS to a standard, NON-cartoon glass
             `<Card>` — the protagonist plate, rounded-card by construction (I4
             closes FOR FREE). `shadow={false}` (FORK I5-shadow). All four stage
             scenes converge to ONE register. -->
        <Card :shadow="false" class="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">MotionPath</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        offset-distance = {{ (distance * 100).toFixed(0) }}%
                        &middot; tangent {{ Math.round(tangentDeg) }}&deg;
                    </span>
                </div>
                <!-- Revert the edited control net to the default figure loop. -->
                <Button
                    variant="outline"
                    class="h-7 gap-1.5 text-small btn-interactive shrink-0"
                    aria-label="Reset the path to the default figure"
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
            <div class="flex-1 min-h-0 flex items-center justify-center p-6">
                <div ref="stageEl" class="mp-stage relative">
                    <svg
                        class="mp-guide"
                        :viewBox="`0 0 ${VIEW} ${VIEW}`"
                    >
                        <!-- The guide path: re-reads the SINGLE-source pathD; an
                             editable-control-point drag re-emits it and BOTH this
                             d AND the traveller's offset-path change in lockstep. -->
                        <path
                            ref="guidePathEl"
                            :d="demo.pathD.value"
                            class="mp-guide-path"
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
                             a slider-posture node; dragging re-authors the path. -->
                        <circle
                            v-for="pt in demo.points.value"
                            :key="pt.id"
                            :cx="pt.x"
                            :cy="pt.y"
                            :r="pt.kind === 'anchor' ? 9 : 7"
                            class="mp-handle"
                            :class="[
                                pt.kind === 'anchor' ? 'mp-handle--anchor' : 'mp-handle--control',
                                { 'mp-handle--active': activeHandle === pt.id },
                            ]"
                            role="slider"
                            :aria-label="`Drag ${pt.kind} point ${pt.id} to reshape the path`"
                            tabindex="0"
                            @pointerdown="onHandlePointerDown(pt.id, $event)"
                            @keydown="onHandleKeydown(pt.id, $event)"
                        />
                    </svg>
                    <!-- The traveller: the engine sets offset-path + sweeps
                         offset-distance on THIS element (fromMotionPath). Slider
                         posture — pointer-drag scrubs the distance along the path,
                         the engine resumes its sweep on release. -->
                    <div
                        ref="travellerEl"
                        class="progress-ball mp-traveller"
                        :class="{ 'mp-traveller--dragging': dragging, 'mp-traveller--winking': winking }"
                        role="slider"
                        aria-label="Drag the traveller along the path"
                        :aria-valuenow="Math.round(distance * 100)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        tabindex="0"
                        @pointerdown="onPointerDown"
                        @keydown="onKeydown"
                    >
                        <!-- EE-MP-2: a full-lap drag winks the glyph (😎) + spins. -->
                        <span class="mp-traveller-glyph">{{ winking ? "\u{1F60E}" : "\u{1F642}\u{200D}\u{2194}\u{FE0F}" }}</span>
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
import { RotateCcw } from "@lucide/vue";
import CopyButton from "@components/custom/CopyButton.vue";

import { MOTION_PATH_DEMO_KEY } from "./motionPathKeys";
import { VIEW } from "./motionPathGeometry";
import { useMotionPathGesture } from "./useMotionPathGesture";

// The shared playback-button skin (the same partial the standard ribbon +
// EasingScene/SpringScene import) — the Reset-path button rides .btn-interactive
// from here for cross-scene posture parity.
import "@components/custom/animation-controls/controls/playback-button.css";

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
.mp-stage {
    width: min(70vmin, 26rem);
    aspect-ratio: 1;
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
   tinted from the shared progress tone (consistent with the rail idiom's hue). */
.mp-guide-path {
    stroke: color-mix(in srgb, var(--color-progress) 35%, transparent);
    stroke-width: 2.5;
    stroke-dasharray: 6 7;
    stroke-linecap: round;
}

/* ── Editable control net (H.W12.S6 / I3 — the F4 elevation) ──────────────────
   The faint anchor→control tethers show the cubic structure; the handles are the
   draggable nodes that re-author the single-source path. Tinted from the shared
   --color-progress tone so the editor reads as one with the guide. */
.mp-tether {
    stroke: color-mix(in srgb, var(--color-progress) 22%, transparent);
    stroke-width: 1;
    stroke-dasharray: 3 4;
}

.mp-handle {
    fill: var(--background);
    stroke: var(--color-progress);
    stroke-width: 2;
    cursor: grab;
    pointer-events: auto;
    transition:
        r 120ms ease,
        fill 120ms ease;
}
.mp-handle:hover,
.mp-handle:focus-visible {
    fill: color-mix(in srgb, var(--color-progress) 30%, var(--background));
    outline: none;
}
/* Anchors (ON the path) read solid; controls (OFF the path) read hollow + a
   softer tint — the GSAP-editor convention (square-ish anchors, round controls;
   here a fill/tint delta keeps the SVG simple). */
.mp-handle--anchor {
    fill: color-mix(in srgb, var(--color-progress) 55%, var(--background));
}
.mp-handle--control {
    stroke-dasharray: 2.5 2.5;
}
.mp-handle--active {
    cursor: grabbing;
    fill: var(--color-progress);
}

/* The traveller rides the engine-set offset-path; its position is the swept
   offset-distance (the browser resolves geometry from the path). It consumes the
   shared .progress-ball idiom (design-idioms.css) — the recipe it formerly
   hand-rolled with two drifted literals (the glow/blur drift F §1 consolidated
   everywhere else). Only the per-site variation lives here:
     • the offset-path positioning (top:0; left:0 — the engine sweeps
       offset-distance, so the ball is NOT rail-centered via margin-top),
     • --ball-size: 2.75rem (the largest ball in the demo),
     • --ball-glow: 40% — a NAMED per-site motion-cohesion delta (the larger
       traveller earns a brighter glow; the same seam EasingTarget/Spring use),
       over the idiom's 35% default. The 12px blur folds to the idiom's 10px.
     • display: grid; place-items: center — centers the glyph child.
     • cursor: grab + touch-action: none — the slider affordance (S4a drag). */
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

.mp-traveller-glyph {
    /* H.W4.S4 (L2 leaf-tail sweep) — the raw 1.25rem was eyeballing the √φ
       rung; route it to the named `--type-subheading` (1.272rem) so the
       traveller glyph sits on the φ ladder, not a stray literal. */
    font-size: var(--type-subheading);
    line-height: 1;
    pointer-events: none;
}

/* ── EE-MP-2 "the emoji winks" (H.W12.S6 / I3 egg) ────────────────────────────
   A full-lap drag swaps the glyph to 😎 and spins the traveller once + brightens
   the glow. transform/box-shadow only (compositor-friendly per the CSS guide). */
.mp-traveller--winking {
    --ball-glow: 60%;
    animation: mp-wink-spin 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes mp-wink-spin {
    0% {
        transform: rotate(0) scale(1);
    }
    55% {
        transform: rotate(220deg) scale(1.25);
    }
    100% {
        transform: rotate(360deg) scale(1);
    }
}

/* The copy-paste artifact — the inline-code register the StartingStyle/Discrete
   scenes use for their linear() output; shared visual so the demo's two
   copy-paste artifacts (linear() + offset-path) read identically. */
.artifact {
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-md, 0.5rem);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
}

/* MANDATORY PRM degrade — the wink spin is decorative delight; under reduced
   motion the glyph still swaps (the reward), but without the rotation. */
@media (prefers-reduced-motion: reduce) {
    .mp-traveller--winking {
        animation: none;
    }
    .mp-handle {
        transition: none;
    }
}
</style>
