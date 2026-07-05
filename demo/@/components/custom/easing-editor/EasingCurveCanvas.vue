<template>
    <GlassPanel
        variant="wash"
        class="easing-curve-canvas-wrapper rounded-card w-full overflow-hidden
            p-2"
    >
        <!-- J.W2 S1 (W4-3): ONLY pointer-down lives here — the move/up/cancel
             lifecycle (and `setPointerCapture` + the global select-suppression
             token) is owned by the shared `useDragCapture` seam. -->
        <!-- L.W11 S5 — the instrument masthead (the canvas reads as a device).
             T.D4 — "EASE · f(t)" is math notation (data), data-register-marked
             for the census mono contract. -->
        <span class="easing-instrument-label" data-register="code" aria-hidden="true"
            >EASE · f(t)</span
        >
        <svg
            ref="svgEl"
            class="easing-curve-canvas w-full touch-none select-none"
            :viewBox="`0 ${viewBox.minY} 1 ${viewBox.height}`"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <!-- Background graticule — L.W11 S5 (PAPER): the flat uniform grid
                 promoted to the demo's OWN two-tier graticule (faint minor + bold
                 major + brightest centre crosshair), the --graph-pitch/--graph-major
                 hierarchy brought INSIDE the plate. Built from one `gridLines`
                 array (vertical + horizontal at each tier). -->
            <rect x="0" y="0" width="1" height="1" class="bounding-box" />
            <line
                v-for="(g, i) in gridLines"
                :key="'grid' + i"
                :x1="g.x1"
                :y1="g.y1"
                :x2="g.x2"
                :y2="g.y2"
                :class="['grid-line', g.cls]"
            />
            <!-- the f(t)=t null line, tinted toward the trace -->
            <line x1="0" y1="1" x2="1" y2="0" class="diagonal-ref" />

            <!-- Axis labels (inside the graph) -->
            <text
                x="0.06"
                y="0.94"
                class="axis-label"
                dominant-baseline="auto"
                text-anchor="start"
            >
                0
            </text>
            <text
                x="0.94"
                y="0.1"
                class="axis-label"
                dominant-baseline="hanging"
                text-anchor="end"
            >
                1
            </text>
            <text
                x="0.94"
                y="0.94"
                class="axis-label"
                dominant-baseline="auto"
                text-anchor="end"
            >
                t
            </text>
            <text
                x="0.06"
                y="0.1"
                class="axis-label"
                dominant-baseline="hanging"
                text-anchor="start"
            >
                f(t)
            </text>

            <!-- Q.WC2 S2 — the comparison-DIFF ghost (Q.WC2): a low-opacity path
                 carrying the ORIGINAL named curve's `d` behind the edited one, so
                 `f(t)=` reads as a delta from ease-out. Present ONLY on a
                 named→custom edit (no baseline for a from-scratch custom); a static
                 path, no per-frame cost. -->
            <path
                v-if="editable && ghostPathD"
                :d="ghostPathD"
                class="bezier-path--ghost"
                data-ghost
            />

            <!-- Curve path — L.W11 S5: the `trace-smear` marker is the egg's
                 editor-side hook (the drag-bend SMEAR). While a handle is being
                 dragged the trace gains a faint directional motion-blur (a CSS
                 state, not a rAF); the engine-driven decay-on-release smear lives
                 on the hero-stage projection (useEasingDemo's SmoothProgress). -->
            <path
                v-if="editable && bezierPoints"
                :d="bezierPathD"
                class="bezier-path trace-smear"
                :class="{ 'trace-smear--active': draggingIndex !== null }"
            />
            <path v-else :d="svgPath" class="bezier-path" />

            <!-- Q.WC1 S2 — the two bespoke `<circle class="control-point handle">`
                 + the colocated `useEasingCurveDrag` CTM handler are RETIRED onto
                 two `<DemoControlPoint>` over the LIGHT `drag2D` (critically
                 damped) — ONE gesture path: DemoControlPoint → drag2D →
                 SpringProgress, with `useDragCapture` the shared select-suppression
                 seam. The endpoints stay fixed display circles. -->
            <template v-if="editable && controlPointsSvg">
                <!-- Endpoints (fixed) -->
                <circle cx="0" cy="1" r="0.02" class="control-point endpoint" />
                <circle cx="1" cy="0" r="0.02" class="control-point endpoint" />
                <!-- Draggable handles over the LIGHT drag2D primitive -->
                <DemoControlPoint
                    :model-value="cp0"
                    :svg="svgEl"
                    :index="0"
                    :anchor="{ x: 0, y: 0 }"
                    aria-label="Curve control point 1"
                    @update:model-value="onControlPoint(0, $event)"
                    @dragstart="draggingIndex = 0"
                    @dragend="draggingIndex = null"
                />
                <DemoControlPoint
                    :model-value="cp1"
                    :svg="svgEl"
                    :index="1"
                    :anchor="{ x: 1, y: 1 }"
                    aria-label="Curve control point 2"
                    @update:model-value="onControlPoint(1, $event)"
                    @dragstart="draggingIndex = 1"
                    @dragend="draggingIndex = null"
                />
            </template>

            <!-- Traveling dot -->
            <circle
                v-if="progress != null"
                :cx="progress"
                :cy="1 - easingFn(progress)"
                r="0.035"
                class="traveling-dot"
            />
        </svg>
    </GlassPanel>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { GlassPanel } from "@mkbabb/glass-ui/glass-panel";
import DemoControlPoint from "@components/custom/easing-editor/DemoControlPoint.vue";
import type { ControlPointValue } from "@components/custom/easing-editor/DemoControlPoint.vue";

const props = defineProps<{
    easingFn: (t: number) => number;
    svgPath: string;
    progress?: number;
    bezierPoints?: [number, number, number, number];
    editable?: boolean;
    /** Q.WC2 S2 — the ORIGINAL named curve's `d` for the comparison-DIFF ghost
     *  (present only on a named→custom edit; absent → no ghost). */
    ghostPathD?: string;
}>();

const emit = defineEmits<{
    (e: "update:bezierPoints", points: [number, number, number, number]): void;
}>();

const svgEl = useTemplateRef<SVGSVGElement>("svgEl");

// Q.WC1 S2 — which handle is mid-drag (the `trace-smear--active` state), set by
// the DemoControlPoint @dragstart/@dragend (the retired `currentHandleIndex`).
const draggingIndex = ref<number | null>(null);

// L.W11 S5 (PAPER) — the two-tier graticule lines: minor (0.125 grid) + major
// (0.25/0.75) + the brightest centre crosshair, each as a vertical + horizontal.
const gridLines = (() => {
    const lines: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        cls: string;
    }[] = [];
    const add = (vals: number[], cls: string) => {
        for (const v of vals) {
            lines.push({ x1: v, y1: 0, x2: v, y2: 1, cls }); // vertical
            lines.push({ x1: 0, y1: v, x2: 1, y2: v, cls }); // horizontal
        }
    };
    add([0.125, 0.375, 0.625, 0.875], "grid-line--minor");
    add([0.25, 0.75], "grid-line--major");
    add([0.5], "grid-line--center");
    return lines;
})();

// Convert bezier Y (0=bottom, 1=top) to SVG Y (0=top, increases downward)
const toSvgY = (y: number) => 1 - y;

// SVG-space control points for the two draggable handles (kept as the
// render-gate for the endpoints + the bezier path).
const controlPointsSvg = computed(() => {
    if (!props.bezierPoints) return null;
    const [x1, y1, x2, y2] = props.bezierPoints;
    return [
        { x: x1, y: toSvgY(y1) },
        { x: x2, y: toSvgY(y2) },
    ];
});

// Q.WC1 S2 — the two DemoControlPoint v-models in CURVE space (bezier-Y), read
// off the `[x1,y1,x2,y2]` tuple; `onControlPoint` writes the moved pair back.
const cp0 = computed<ControlPointValue>(() => ({
    x: props.bezierPoints?.[0] ?? 0,
    y: props.bezierPoints?.[1] ?? 0,
}));
const cp1 = computed<ControlPointValue>(() => ({
    x: props.bezierPoints?.[2] ?? 1,
    y: props.bezierPoints?.[3] ?? 1,
}));

const onControlPoint = (index: number, value: ControlPointValue) => {
    const pts = props.bezierPoints;
    if (!pts) return;
    const next: [number, number, number, number] = [...pts];
    next[index * 2] = value.x;
    next[index * 2 + 1] = value.y;
    emit("update:bezierPoints", next);
};

// Proper SVG cubic bezier path — single smooth C command
const bezierPathD = computed(() => {
    if (!controlPointsSvg.value) return "";
    const [c1, c2] = controlPointsSvg.value;
    return `M 0 1 C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, 1 0`;
});

// Compute viewBox — clamped to prevent unbounded growth for extreme curves.
// Max overshoot: 0.6 units beyond [0,1] in either direction (covers ease-*-back).
const VIEW_PAD = 0.1;
const MAX_OVERSHOOT = 0.6;

// Q.WC2 S1.3 — the closed-form viewBox clamp (replaces the 17-sample scan). A
// cubic-bezier path's y-extrema are EXACTLY min/max{0,1,1−y1,1−y2} (the convex-
// hull property), exact AND tighter than sampling. SCOPE GUARD: the hull bound
// holds ONLY in bezier mode (`controlPointsSvg` present); the `steps()` staircase
// has extrema exactly `[0,1]` (no overshoot), so the bound is the trivial `[0,1]`.
const viewBox = computed(() => {
    let rawMin: number;
    let rawMax: number;
    if (controlPointsSvg.value) {
        // Bezier — hull over the SVG-Y control points (`.y` is already `1 − yi`).
        const ys = [0, 1, controlPointsSvg.value[0].y, controlPointsSvg.value[1].y];
        rawMin = Math.min(...ys);
        rawMax = Math.max(...ys);
    } else {
        rawMin = 0; // steps()/non-bezier — bounded staircase, extrema [0,1].
        rawMax = 1;
    }
    const minY = Math.max(rawMin, 0 - MAX_OVERSHOOT) - VIEW_PAD;
    const maxY = Math.min(rawMax, 1 + MAX_OVERSHOOT) + VIEW_PAD;
    return { minY, height: maxY - minY };
});
</script>

<style scoped>
/* H.W4.S2 — DRY the double chrome. The canvas wrapper's `GlassPanel
   variant="wash"` carries its OWN 1px border (`--glass-border-wash`), but the
   canvas always lives INSIDE a framed surface — the TimingFunctionPanel's
   `<Card>` or the EasingSidebar's `glass-resting cartoon-surface` div — so a
   second border on the wash panel is redundant double-framing. Drop the
   wrapper's border (one surface owns the frame); keep the wash background +
   blur (the canvas's own depth tier). The Card/div's border is the single
   frame; the wash IS the inner surface, not a second plate. */
.easing-curve-canvas-wrapper {
    border: none;
    /* L.W11 S5 — scope-local instrument tokens (the KEPT violet, additive aliases). */
    --trace: var(--ppmycota-primary, var(--primary));
    --trace-glow: color-mix(
        in srgb,
        var(--ppmycota-primary, var(--primary)) 60%,
        transparent
    );
    position: relative;
    box-shadow: inset 0 0 2.5rem
        color-mix(in srgb, var(--foreground) 7%, transparent);
}

/* L.W11 S5 — a whisper of phosphor scanline grain (≈2%), scoped to the plate. */
.easing-curve-canvas-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background-image: repeating-linear-gradient(
        to bottom,
        color-mix(in srgb, var(--foreground) 4%, transparent) 0 1px,
        transparent 1px 3px
    );
    opacity: 0.5;
}
/* The radial field tint — the screen glows faintly violet from the origin. */
.easing-curve-canvas-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(
        120% 120% at 15% 100%,
        color-mix(
            in srgb,
            var(--trace) var(--stage-field-tint, 4%),
            transparent
        ),
        transparent 60%
    );
    z-index: var(--z-behind);
}

/* L.W11 S5 — the instrument masthead label. */
.easing-instrument-label {
    /* W11 engraving — own type (verbatim text-admin-label), not that
       sidebar-normalized-away semantic class (proof:easing-sidebar-normalized). */
    position: absolute;
    top: 0.4rem;
    left: 0.6rem;
    z-index: var(--z-content);
    font-family: var(--font-mono);
    font-size: var(--type-admin-label);
    text-transform: uppercase;
    font-weight: 500;
    line-height: 1;
    color: var(--muted-foreground);
    opacity: 0.55;
    letter-spacing: 0.08em;
    pointer-events: none;
}

/* H.W4.S1 — the canvas is now CONTAINER-BOUNDED, not viewport-unbounded.
   The former `aspect-ratio:1` off a `width:100%` SVG in a `max-width:none`
   card grew to a 680×680px square (77% of the panel) with NO block ceiling.
   The editor root (EasingSidebar / the TimingFunctionPanel Card) is now a
   `container-type: inline-size; container-name: easing-editor` context, so
   `38cqi` ties the canvas's block-size to the CONTAINER'S inline size (not
   the viewport); `clamp` holds it in [160px, 280px] — a deliberate bounded
   square regardless of sidebar width. `aspect-ratio:1` keeps the square LAW,
   `margin-inline:auto` centers it. `38cqi` is the ONE φ-derived magic number
   (it lands the canvas at the cube/square scene-target proportion);
   everything else is a token. Baseline-2023 (container queries Widely
   available since 2023-02-14) — no fallback owed. */
.easing-curve-canvas {
    display: block;
    inline-size: 100%;
    aspect-ratio: 1;
    block-size: clamp(160px, 38cqi, 280px);
    max-block-size: 280px;
    margin-inline: auto;
}

.bounding-box {
    fill: none;
    stroke: var(--border);
    stroke-width: 0.015;
}

/* L.W11 S5 — the f(t)=t null line, tinted toward the trace (the "null curve"). */
.diagonal-ref {
    stroke: var(--trace, var(--muted-foreground));
    stroke-width: 0.008;
    stroke-dasharray: 0.02 0.015;
    opacity: 0.22;
}

/* L.W11 S5 (PAPER) — the two-tier graticule: faint minor, bolder major, brightest centre. */
.grid-line {
    stroke: var(--border);
    stroke-width: 0.008;
}
.grid-line--minor {
    opacity: 0.22;
}
.grid-line--major {
    opacity: 0.45;
}
.grid-line--center {
    opacity: 0.55;
    stroke-width: 0.006;
}

.handle-line {
    stroke: var(--muted-foreground);
    stroke-width: 0.025;
    stroke-dasharray: 0.03 0.02;
    opacity: 0.5;
    transition:
        stroke var(--duration-fast) var(--ease-standard),
        opacity var(--duration-fast) var(--ease-standard);
}

/* L.W11 S5 (COLOR) — the trace becomes a luminous SIGNAL: the KEPT violet stroke
   gains an emitted-light bloom (a layered --trace-glow drop-shadow). Hue
   unchanged — only the bloom is added. */
.bezier-path {
    stroke: var(--ppmycota-primary, var(--primary));
    stroke-width: 0.04;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 0.018px var(--trace-glow))
        drop-shadow(0 0 0.045px var(--trace-glow));
    transition: filter var(--duration-fast) var(--ease-standard);
}

/* Q.WC1 S2 — the comparison-DIFF ghost: the ORIGINAL named curve the custom edit
   departed from, rendered behind the live trace at low opacity in the trace's own
   family so `f(t)=` reads as a delta ("you pulled it THIS far from ease-out"). A
   static path (no motion) — carries through reduced-motion unchanged. */
.bezier-path--ghost {
    stroke: var(--trace, var(--muted-foreground));
    stroke-width: 0.025;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 0.03 0.025;
    opacity: 0.32;
    filter: none;
}

/* L.W11 S5 (the drag-bend smear, editor side) — while a handle is grabbed the
   trace flexes with a faint blur (a CSS state; the engine-driven decay-on-release
   lives on the hero-stage projection). PRM suppresses the blur. */
.trace-smear {
    --trace-smear: 0px;
}
.bezier-path.trace-smear--active {
    filter: drop-shadow(0 0 0.018px var(--trace-glow))
        drop-shadow(0 0 0.045px var(--trace-glow)) blur(0.004px);
}
@media (prefers-reduced-motion: reduce) {
    .bezier-path,
    .bezier-path.trace-smear--active {
        transition: none;
        filter: drop-shadow(0 0 0.018px var(--trace-glow))
            drop-shadow(0 0 0.045px var(--trace-glow));
    }
}

.control-point {
    transition:
        r var(--duration-fast) var(--ease-standard),
        opacity var(--duration-fast) var(--ease-standard);
    cursor: move;
}

.control-point.endpoint {
    fill: var(--muted-foreground);
    stroke: none;
    cursor: default;
    opacity: 0.5;
}

/* L.W11 S5 — handles that look ADJUSTABLE at rest: violet accent ring + soft glow. */
.control-point.handle {
    fill: var(--foreground);
    stroke: var(--trace, var(--primary));
    stroke-width: 0.02;
    cursor: grab;
    filter: drop-shadow(0 0 0.02px var(--trace-glow));
}

.control-point.handle:hover {
    r: 0.055;
    filter: drop-shadow(0 0 0.04px var(--trace-glow));
}
.control-point.handle:active {
    cursor: grabbing;
}

/* L.W11 S5 — the probe gets a whiter-hot core + comet glow (the beam's focus). */
.traveling-dot {
    fill: var(--ppmycota-primary, var(--primary));
    opacity: 0.95;
    transition: none;
    filter: drop-shadow(0 0 0.02px white)
        drop-shadow(0 0 0.06px var(--trace-glow));
}

/* J.W2 S1 — the former local `user-select: none` here is DELETED: gesture-time
   select-suppression is the global `body.is-dragging` token's job (inherited
   via useDragCapture), never a per-surface re-author. */
.axis-label {
    font-family: var(--font-mono);
    font-size: 0.055px;
    fill: var(--muted-foreground);
    opacity: 0.5;
    pointer-events: none;
}
</style>
