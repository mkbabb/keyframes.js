<template>
    <!-- Q.WC1 (DM-2 build-in) — the curve-editor control-point handle over the
         LIGHT `drag2D` primitive. The DM-2 chronic (GlassControlPoint →
         DemoControlPoint, born E, the NINTH carry, declared ABSOLUTE-FINAL at
         O.W5 AND P.W7, never built) EXITS here as a kf-side build-in over the
         published `drag2D` export (index.ts:88), critically damped, with NO
         glass-ui component import (the BC ASK#5 = NO ask is WITHDRAWN).

         The handle KEEPS the `.control-point.handle` + `data-index` markup the
         existing live gate selects (proof:easing-editor-live clause (b)), so the
         consolidation is class-preserving. The gesture physics is the library's
         (`drag2D` → SpringProgress); the component owns ONLY the SVG ↔ curve
         coordinate map (the per-axis inverse-CTM `transform`), the normalized
         emit, and the keyboard a11y. -->
    <g data-demo-control-point>
        <!-- The control-line from the anchor (endpoint) to the handle. Optional —
             a host that wants the bare handle omits the anchor prop. -->
        <line
            v-if="anchor"
            :x1="anchor.x"
            :y1="toSvgY(anchor.y)"
            :x2="modelValue.x"
            :y2="toSvgY(modelValue.y)"
            class="handle-line"
        />
        <circle
            ref="handleEl"
            :cx="modelValue.x"
            :cy="toSvgY(modelValue.y)"
            :r="radius"
            class="control-point handle"
            :data-index="index"
            tabindex="0"
            role="slider"
            :aria-label="ariaLabel"
            aria-valuemin="0"
            aria-valuemax="1"
            :aria-valuenow="Number(modelValue.x.toFixed(3))"
            @keydown="onKeydown"
        />
    </g>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onScopeDispose, useTemplateRef, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { drag2D, type Drag2DHandle } from "@mkbabb/keyframes.js";
import {
    acquireSelectSuppression,
    releaseSelectSuppression,
} from "@composables/gestureSelectSuppression";

/**
 * A normalized `(x, y)` point in curve space (`x ∈ [0,1]`; `y` permits the
 * declared overshoot band so back/elastic handles can pull past `[0,1]`).
 */
export interface ControlPointValue {
    x: number;
    y: number;
}

const props = withDefaults(
    defineProps<{
        /** The normalized `(x, y)` curve-space position (v-model). */
        modelValue: ControlPointValue;
        /** The parent SVG the gesture geometry resolves against (its
         *  `getScreenCTM()` is the client-px ↔ curve-[0,1] map). */
        svg: SVGSVGElement | null;
        /** This handle's index (drives the `data-index` the live gate selects). */
        index: number;
        /** An optional anchor (endpoint) the control-line draws from, in curve
         *  space (bezier-Y, 0=bottom). Omitted → no control-line. */
        anchor?: ControlPointValue;
        /** The lower y-bound (curve space) the drag clamps to. Default −0.6 (the
         *  anticipation band). */
        minY?: number;
        /** The upper y-bound (curve space). Default 1.6 (the overshoot band). */
        maxY?: number;
        /** The rendered handle radius (SVG user units). */
        radius?: number;
        /** Coarse arrow-key nudge step (curve units). Default 0.01. */
        coarseStep?: number;
        /** Fine arrow-key nudge step (Shift+Arrow). Default 0.001. */
        fineStep?: number;
        /** The accessible label for this handle. */
        ariaLabel?: string;
    }>(),
    {
        anchor: undefined,
        minY: -0.6,
        maxY: 1.6,
        radius: 0.04,
        coarseStep: 0.01,
        fineStep: 0.001,
        ariaLabel: "Curve control point",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: ControlPointValue): void;
    (e: "dragstart"): void;
    (e: "dragend"): void;
}>();

const handleEl = useTemplateRef<SVGCircleElement>("handleEl");

// Convert bezier Y (0=bottom, 1=top) to SVG Y (0=top, increases downward) — the
// SAME inversion EasingCurveCanvas / the hero projection use.
const toSvgY = (y: number) => 1 - y;

// The shared control-surface select-suppression token (the global
// `body.is-dragging` — the SAME token `useDragScrub`/`useDragCapture` arm, so a
// drag that sweeps off the handle onto the dock/chrome never highlights it). We
// drive the token DIRECTLY (acquire on pointerdown, release on up/cancel) rather
// than composing `useDragCapture`'s full capture machinery — `drag2D`'s
// `Draggable` ALREADY owns the pointer CAPTURE + the move/up listeners (the
// gesture physics); a second `setPointerCapture` from `useDragCapture` would race
// the Draggable's capture and starve its `pointermove` stream. So this owns ONLY
// the token + the drag-start/end emit; the capture is the library's alone.
const onHandlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    acquireSelectSuppression();
    emit("dragstart");
    // Emit the live TARGET on every pointermove during the drag (NOT only on the
    // spring's rAF-gated tick): `drag2D`'s `handleMove` sets `spring.target` to
    // the pointer-mapped value synchronously, and `Drag2DHandle.value` reads that
    // target while dragging — so the model (the curve) follows the pointer with
    // ZERO rAF lag. The spring still owns the post-release settle; this only makes
    // the in-drag follow immediate (the feel a curve editor needs — the handle is
    // exactly under the cursor — AND robust to a fast synthetic sweep). The token
    // release on up/cancel tears these listeners down.
    const onMove = () => {
        if (!handle || syncing) return;
        emit("update:modelValue", { x: handle.value.x, y: handle.value.y });
    };
    let stopMove: (() => void) | null = null;
    let stopUp: (() => void) | null = null;
    let stopCancel: (() => void) | null = null;
    const release = () => {
        releaseSelectSuppression();
        emit("dragend");
        stopMove?.();
        stopUp?.();
        stopCancel?.();
        stopMove = stopUp = stopCancel = null;
    };
    stopMove = useEventListener(window, "pointermove", onMove);
    stopUp = useEventListener(window, "pointerup", release);
    stopCancel = useEventListener(window, "pointercancel", release);
    onScopeDispose(release);
};

// The per-axis client-px → curve-[0,1] map, read against the parent SVG's
// screen CTM. For an axis-aligned SVG (scale + translate only — the case for
// `preserveAspectRatio` curve plates) the inverse CTM is diagonal, so each axis
// decouples: x reads `inv.a * clientX + inv.e`, y reads `inv.d * clientY +
// inv.f`. This holds under the non-uniform `preserveAspectRatio="none"` hero
// scale too (the per-axis scalars differ; the cross-terms stay zero). The map
// returns CURVE-space y (bezier-Y, un-inverted) so the emitted value is the
// model's own space.
const clientXToCurve = (clientX: number): number => {
    const ctm = props.svg?.getScreenCTM();
    if (!ctm) return props.modelValue.x;
    const inv = ctm.inverse();
    return inv.a * clientX + inv.e;
};
const clientYToCurve = (clientY: number): number => {
    const ctm = props.svg?.getScreenCTM();
    if (!ctm) return props.modelValue.y;
    const inv = ctm.inverse();
    const svgY = inv.d * clientY + inv.f;
    return 1 - svgY; // SVG-Y → bezier-Y
};

let handle: Drag2DHandle | undefined;
// Guard the feedback loop: a spring emission caused by an EXTERNAL model sync
// (`spring.reset` in the watch below) must NOT echo back as `update:modelValue`
// — only a genuine pointer drag (or its post-release settle) emits.
let syncing = false;

const buildHandle = () => {
    const el = handleEl.value;
    if (!el) return;
    handle?.dispose();
    // The precision contract (S1): critically damped (no ring past the drop
    // point) AND a near-instant `response` (the iOS-canonical 0.15s) so the
    // handle tracks the pointer TIGHTLY — a slow default response (0.5s) lags a
    // fast drag, making the curve you authored not where you dropped the handle.
    const SPRING = { response: 0.15, dampingFraction: 1 } as const;
    handle = drag2D(el as unknown as HTMLElement, {
        x: {
            transform: clientXToCurve,
            // `x ∈ [0,1]` HARD (rubberBand 0 = clamp, no overshoot on the time axis).
            bounds: { min: 0, max: 1 },
            rubberBand: 0,
            springOptions: SPRING,
        },
        y: {
            transform: clientYToCurve,
            // `y` permits the declared overshoot/anticipation band.
            bounds: { min: props.minY, max: props.maxY },
            rubberBand: 0,
            springOptions: SPRING,
        },
    });
    // Every spring emission (live drag-follow + the critically-damped settle)
    // writes the normalized point back to the model — EXCEPT a reset-driven
    // emission from an external SYNC (guarded by `syncing`). We read `handle.value`
    // (NOT the raw spring `(x,y)` arg): while an axis is DRAGGING, `Drag2DHandle.
    // value` is the spring's TARGET (the live pointer, pinned 1:1), so the model
    // follows the pointer with NO perceptible lag during the drag; only on the
    // post-release settle does it read the spring's own coasting value. (The
    // `syncing` guard stops a sibling-handle move / preset switch — which re-seats
    // this spring via the watch below — from echoing back as a spurious user edit,
    // e.g. flipping a named curve to custom on selection: the diff-ghost false-fire.)
    handle.subscribe(() => {
        if (syncing || !handle) return;
        emit("update:modelValue", { x: handle.value.x, y: handle.value.y });
    });
};

// Keyboard a11y (S1 + Q.WC2 S3 fine/coarse): arrow keys nudge the normalized
// point; Shift = fine. A focused handle that drags but cannot be keyboard-driven
// is a regression the gate's a11y corroborator reds.
const onKeydown = (e: KeyboardEvent) => {
    const step = e.shiftKey ? props.fineStep : props.coarseStep;
    let dx = 0;
    let dy = 0;
    switch (e.key) {
        case "ArrowLeft":
            dx = -step;
            break;
        case "ArrowRight":
            dx = step;
            break;
        case "ArrowUp":
            dy = step;
            break;
        case "ArrowDown":
            dy = -step;
            break;
        default:
            return;
    }
    e.preventDefault();
    const nx = Math.min(1, Math.max(0, props.modelValue.x + dx));
    const ny = Math.min(props.maxY, Math.max(props.minY, props.modelValue.y + dy));
    emit("update:modelValue", { x: nx, y: ny });
};

onMounted(() => {
    buildHandle();
    useEventListener(handleEl, "pointerdown", onHandlePointerDown);
});

// External model changes (a sibling handle move, a numeric-readout edit, a
// keyboard nudge, a preset switch) must re-seat the spring so the rendered
// position + the gesture origin stay coherent. The re-seat is wrapped in
// `syncing` so the reset-driven spring emission does NOT echo back as a user
// edit (the feedback-loop guard). A live drag owns the spring, so skip then.
watch(
    () => props.modelValue,
    (v) => {
        if (!handle || handle.x.dragging || handle.y.dragging) return;
        // Already at the target (our own drag-emit round-trip) → no re-seat.
        if (
            Math.abs(handle.x.spring.value - v.x) < 1e-6 &&
            Math.abs(handle.y.spring.value - v.y) < 1e-6
        ) {
            return;
        }
        syncing = true;
        handle.x.spring.reset(v.x, 0);
        handle.y.spring.reset(v.y, 0);
        syncing = false;
    },
    { deep: true },
);

onBeforeUnmount(() => {
    handle?.dispose();
    handle = undefined;
});
</script>

<style scoped>
/* The handle + control-line ride the editor's scope-local glass `--trace` /
   `--trace-glow` specular tokens (inherited from the host `.easing-curve-canvas
   -wrapper` / the hero stage). NO `GlassControlPoint` component import, NO new
   glass-ui peer obligation (inv-16) — the polish is published CSS tokens only. */
.control-point {
    transition:
        r var(--duration-fast) var(--ease-standard),
        opacity var(--duration-fast) var(--ease-standard);
    cursor: grab;
}

.control-point.handle {
    fill: var(--foreground);
    stroke: var(--trace, var(--primary));
    stroke-width: 0.02;
    filter: drop-shadow(0 0 0.02px var(--trace-glow));
}

.control-point.handle:hover {
    r: 0.055;
    filter: drop-shadow(0 0 0.04px var(--trace-glow));
}
.control-point.handle:active {
    cursor: grabbing;
}
/* Keyboard focus ring — the handle is focusable + arrow-nudgeable (a11y). */
.control-point.handle:focus-visible {
    outline: none;
    r: 0.055;
    filter: drop-shadow(0 0 0.05px var(--trace, var(--primary)));
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
</style>
