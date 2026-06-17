<template>
    <GlassPanel
        variant="wash"
        class="easing-curve-canvas-wrapper w-full overflow-hidden rounded-card p-2"
    >
        <!-- J.W2 S1 (W4-3): ONLY pointer-down lives here — the move/up/cancel
             lifecycle (and `setPointerCapture` + the global select-suppression
             token) is owned by the shared `useDragCapture` seam. -->
        <!-- L.W11 S5 — the instrument masthead (the canvas reads as a device). -->
        <span class="easing-instrument-label text-admin-label" aria-hidden="true">EASE · f(t)</span>
        <svg
            ref="svgEl"
            class="easing-curve-canvas w-full touch-none select-none"
            :viewBox="`0 ${viewBox.minY} 1 ${viewBox.height}`"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            @pointerdown="startDragging"
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
            <text x="0.06" y="0.94" class="axis-label" dominant-baseline="auto" text-anchor="start">0</text>
            <text x="0.94" y="0.1" class="axis-label" dominant-baseline="hanging" text-anchor="end">1</text>
            <text x="0.94" y="0.94" class="axis-label" dominant-baseline="auto" text-anchor="end">t</text>
            <text x="0.06" y="0.1" class="axis-label" dominant-baseline="hanging" text-anchor="start">f(t)</text>

            <!-- Handle lines (bezier mode only) -->
            <template v-if="editable && controlPointsSvg">
                <line
                    :x1="0"
                    :y1="1"
                    :x2="controlPointsSvg[0].x"
                    :y2="controlPointsSvg[0].y"
                    class="handle-line"
                />
                <line
                    :x1="1"
                    :y1="0"
                    :x2="controlPointsSvg[1].x"
                    :y2="controlPointsSvg[1].y"
                    class="handle-line"
                />
            </template>

            <!-- Curve path — L.W11 S5: the `trace-smear` marker is the egg's
                 editor-side hook (the drag-bend SMEAR). While a handle is being
                 dragged the trace gains a faint directional motion-blur (a CSS
                 state, not a rAF); the engine-driven decay-on-release smear lives
                 on the hero-stage projection (useEasingDemo's SmoothProgress). -->
            <path
                v-if="editable && bezierPoints"
                :d="bezierPathD"
                class="bezier-path trace-smear"
                :class="{ 'trace-smear--active': currentHandleIndex !== null }"
            />
            <path v-else :d="svgPath" class="bezier-path" />

            <!-- Control point handles (bezier mode only) -->
            <template v-if="editable && controlPointsSvg">
                <!-- Endpoints (fixed) -->
                <circle cx="0" cy="1" r="0.02" class="control-point endpoint" />
                <circle cx="1" cy="0" r="0.02" class="control-point endpoint" />
                <!-- Draggable handles -->
                <circle
                    :cx="controlPointsSvg[0].x"
                    :cy="controlPointsSvg[0].y"
                    r="0.04"
                    class="control-point handle"
                    data-index="0"
                />
                <circle
                    :cx="controlPointsSvg[1].x"
                    :cy="controlPointsSvg[1].y"
                    r="0.04"
                    class="control-point handle"
                    data-index="1"
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
import { ref, computed, useTemplateRef } from "vue";
import { GlassPanel } from "@mkbabb/glass-ui/glass-panel";
import { useDragCapture } from "@components/custom/animation-controls/controls/composables/useDragCapture";

const props = defineProps<{
    easingFn: (t: number) => number;
    svgPath: string;
    progress?: number;
    bezierPoints?: [number, number, number, number];
    editable?: boolean;
}>();

const emit = defineEmits<{ (e: "update:bezierPoints", points: [number, number, number, number]): void }>();

const svgEl = useTemplateRef<SVGSVGElement>("svgEl");

// L.W11 S5 (PAPER) — the two-tier graticule lines: minor (0.125 grid) + major
// (0.25/0.75) + the brightest centre crosshair, each as a vertical + horizontal.
const gridLines = (() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; cls: string }[] = [];
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

// SVG-space control points for the two draggable handles
const controlPointsSvg = computed(() => {
    if (!props.bezierPoints) return null;
    const [x1, y1, x2, y2] = props.bezierPoints;
    return [
        { x: x1, y: toSvgY(y1) },
        { x: x2, y: toSvgY(y2) },
    ];
});

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

const viewBox = computed(() => {
    const ys: number[] = [0, 1];

    if (controlPointsSvg.value) {
        ys.push(controlPointsSvg.value[0].y, controlPointsSvg.value[1].y);
    }

    // Sample the easing function to detect overshoot
    for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        ys.push(1 - props.easingFn(t));
    }

    // Clamp to prevent extreme curves from blowing up the viewBox
    const rawMin = Math.min(...ys);
    const rawMax = Math.max(...ys);
    const minY = Math.max(rawMin, 0 - MAX_OVERSHOOT) - VIEW_PAD;
    const maxY = Math.min(rawMax, 1 + MAX_OVERSHOOT) + VIEW_PAD;
    return { minY, height: maxY - minY };
});

// ── Drag interaction (bezier mode only) ─────────────────────────
// J.W2 S1 (W4-3) — the handle drag rides the SHARED control-surface drag seam
// (`useDragCapture`, the same family as the timeline diamonds): the composable
// owns `setPointerCapture` on the SVG, the move/up/cancel listener lifecycle,
// AND the global `body.is-dragging` select-suppression token — so a drag that
// sweeps off the bezier handle onto the dock/control chrome can never highlight
// it (B6-a inherited, not re-authored per surface). The former inline
// `@pointermove`/`@pointerup` handlers + the local `setPointerCapture` call are
// DELETED with the migration; `startDragging` keeps ONLY the hit-test (which
// handle, if any) and then hands the gesture to the seam.

const currentHandleIndex = ref<number | null>(null);

const pointerToSVG = (event: PointerEvent): { x: number; y: number } => {
    const svg = svgEl.value;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    const inv = ctm.inverse();
    const svgX = inv.a * event.clientX + inv.c * event.clientY + inv.e;
    const svgY = inv.b * event.clientX + inv.d * event.clientY + inv.f;

    // Convert SVG Y back to bezier Y
    return { x: svgX, y: 1 - svgY };
};

const RUBBER_K = 0.5;
const RUBBER_MAX = 2;

function rubberBand(value: number, lo: number, hi: number): number {
    if (value >= lo && value <= hi) return value;
    if (value > hi) {
        const over = value - hi;
        return hi + over / (1 + over * RUBBER_K);
    }
    const under = lo - value;
    return lo - under / (1 + under * RUBBER_K);
}

const SMOOTH_FACTOR = 0.35;
let smoothedY: number | null = null;

const startDragging = (event: PointerEvent) => {
    if (!props.editable || !props.bezierPoints) return;
    event.preventDefault();

    const { x, y } = pointerToSVG(event);
    const hitRadius = event.pointerType === "touch" ? 0.15 : 0.08;

    const pts = [
        { x: props.bezierPoints[0], y: props.bezierPoints[1] },
        { x: props.bezierPoints[2], y: props.bezierPoints[3] },
    ];

    let closestIndex: number | null = null;
    let closestDist = Infinity;
    for (let i = 0; i < 2; i++) {
        const dist = Math.hypot(pts[i].x - x, pts[i].y - y);
        if (dist < hitRadius && dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
        }
    }

    if (closestIndex === null) return;

    currentHandleIndex.value = closestIndex;
    smoothedY = null;

    // Hand the gesture to the shared seam: it captures the pointer on the SVG
    // (the event's currentTarget), arms the global select-suppression token, and
    // drives onDrag/stopDragging for the gesture's lifetime.
    onPointerDown(event);
};

const stopDragging = () => {
    currentHandleIndex.value = null;
    smoothedY = null;
};

const onDrag = (event: PointerEvent) => {
    if (currentHandleIndex.value === null || !props.bezierPoints) return;

    const { x, y } = pointerToSVG(event);
    const clampedX = Math.max(0, Math.min(1, x));
    const dampedY = Math.max(-RUBBER_MAX, Math.min(RUBBER_MAX, rubberBand(y, 0, 1)));

    if (smoothedY === null) smoothedY = dampedY;
    else smoothedY = smoothedY + (dampedY - smoothedY) * (1 - SMOOTH_FACTOR);

    const newPoints: [number, number, number, number] = [...props.bezierPoints];
    const idx = currentHandleIndex.value;
    newPoints[idx * 2] = clampedX;
    newPoints[idx * 2 + 1] = smoothedY;

    emit("update:bezierPoints", newPoints);
};

// The shared seam (gesture-in-flight authority): owns capture + the global
// select-suppression token; `onDrag` is the move body, `stopDragging` the end.
const { onPointerDown } = useDragCapture({
    onMove: onDrag,
    onEnd: stopDragging,
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
    --trace-glow: color-mix(in srgb, var(--ppmycota-primary, var(--primary)) 60%, transparent);
    position: relative;
    box-shadow: inset 0 0 2.5rem color-mix(in srgb, var(--foreground) 7%, transparent);
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
        color-mix(in srgb, var(--trace) var(--stage-field-tint, 4%), transparent),
        transparent 60%
    );
    z-index: var(--z-behind, 0);
}

/* L.W11 S5 — the instrument masthead label. */
.easing-instrument-label {
    position: absolute;
    top: 0.4rem;
    left: 0.6rem;
    z-index: var(--z-content, 2);
    font-family: var(--font-mono);
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
    transition: stroke var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard);
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
    filter:
        drop-shadow(0 0 0.018px var(--trace-glow))
        drop-shadow(0 0 0.045px var(--trace-glow));
    transition: filter var(--duration-fast) var(--ease-standard);
}

/* L.W11 S5 (the drag-bend smear, editor side) — while a handle is grabbed the
   trace flexes with a faint blur (a CSS state; the engine-driven decay-on-release
   lives on the hero-stage projection). PRM suppresses the blur. */
.trace-smear {
    --trace-smear: 0px;
}
.bezier-path.trace-smear--active {
    filter:
        drop-shadow(0 0 0.018px var(--trace-glow))
        drop-shadow(0 0 0.045px var(--trace-glow))
        blur(0.004px);
}
@media (prefers-reduced-motion: reduce) {
    .bezier-path,
    .bezier-path.trace-smear--active {
        transition: none;
        filter:
            drop-shadow(0 0 0.018px var(--trace-glow))
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
    filter: drop-shadow(0 0 0.02px white) drop-shadow(0 0 0.06px var(--trace-glow));
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
