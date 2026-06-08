<template>
    <GlassPanel
        variant="wash"
        class="easing-curve-canvas-wrapper w-full overflow-hidden rounded-card p-2"
    >
        <svg
            ref="svgEl"
            class="easing-curve-canvas w-full touch-none select-none"
            :viewBox="`0 ${viewBox.minY} 1 ${viewBox.height}`"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            @pointerdown="startDragging"
            @pointermove="onDrag"
            @pointerup="stopDragging"
            @pointercancel="stopDragging"
        >
            <!-- Background grid -->
            <rect x="0" y="0" width="1" height="1" class="bounding-box" />
            <line x1="0" y1="1" x2="1" y2="0" class="diagonal-ref" />
            <line
                v-for="v in [0.25, 0.5, 0.75]"
                :key="'gx' + v"
                :x1="v"
                y1="0"
                :x2="v"
                y2="1"
                class="grid-line"
            />
            <line
                v-for="v in [0.25, 0.5, 0.75]"
                :key="'gy' + v"
                x1="0"
                :y1="v"
                x2="1"
                :y2="v"
                class="grid-line"
            />

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

            <!-- Curve path -->
            <path
                v-if="editable && bezierPoints"
                :d="bezierPathD"
                class="bezier-path"
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

const props = defineProps<{
    easingFn: (t: number) => number;
    svgPath: string;
    progress?: number;
    bezierPoints?: [number, number, number, number];
    editable?: boolean;
}>();

const emit = defineEmits<{ (e: "update:bezierPoints", points: [number, number, number, number]): void }>();

const svgEl = useTemplateRef<SVGSVGElement>("svgEl");

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

const isDragging = ref(false);
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

    isDragging.value = true;
    currentHandleIndex.value = closestIndex;
    smoothedY = null;

    try {
        svgEl.value?.setPointerCapture(event.pointerId);
    } catch { /* iOS may throw */ }
};

const stopDragging = (event?: PointerEvent) => {
    if (event && isDragging.value) {
        try {
            svgEl.value?.releasePointerCapture(event.pointerId);
        } catch { /* iOS may throw */ }
    }
    isDragging.value = false;
    currentHandleIndex.value = null;
    smoothedY = null;
};

const onDrag = (event: PointerEvent) => {
    if (!isDragging.value || currentHandleIndex.value === null || !props.bezierPoints) return;

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

.diagonal-ref {
    stroke: var(--muted-foreground);
    stroke-width: 0.008;
    stroke-dasharray: 0.02 0.015;
    opacity: 0.3;
}

.grid-line {
    stroke: var(--border);
    stroke-width: 0.008;
    opacity: 0.4;
}

.handle-line {
    stroke: var(--muted-foreground);
    stroke-width: 0.025;
    stroke-dasharray: 0.03 0.02;
    opacity: 0.5;
}

.bezier-path {
    /* The curve carries the design-system accent in all modes; pp-mode can
       still retint via the --ppmycota-primary cascade when it is defined. */
    stroke: var(--ppmycota-primary, var(--primary));
    stroke-width: 0.04;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
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

.control-point.handle {
    fill: var(--foreground);
    stroke: var(--background);
    stroke-width: 0.025;
}

.control-point.handle:hover {
    r: 0.055;
}

.traveling-dot {
    fill: var(--ppmycota-primary, var(--primary));
    opacity: 0.9;
    transition: none;
}

.axis-label {
    font-family: var(--font-mono);
    font-size: 0.055px;
    fill: var(--muted-foreground);
    opacity: 0.5;
    user-select: none;
    pointer-events: none;
}
</style>
