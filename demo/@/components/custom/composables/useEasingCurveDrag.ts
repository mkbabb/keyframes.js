import { ref } from "vue";
import type { Ref } from "vue";
import { useDragCapture } from "@components/custom/animation-controls/controls/composables/useDragCapture";

/**
 * L.W11 — the "drag the bezier handles" gesture unit, extracted COLOCATED from
 * EasingCurveCanvas.vue (the W11 instrument/trace-smear refinement pushed the
 * component past the 500L demo ceiling; this is the natural pointer/drag seam).
 *
 * J.W2 S1 (W4-3) — the handle drag rides the SHARED control-surface drag seam
 * (`useDragCapture`, the same family as the timeline diamonds): the composable
 * owns `setPointerCapture` on the SVG, the move/up/cancel listener lifecycle,
 * AND the global `body.is-dragging` select-suppression token — so a drag that
 * sweeps off the bezier handle onto the dock/control chrome can never highlight
 * it (B6-a inherited, not re-authored per surface). `startDragging` keeps ONLY
 * the hit-test (which handle, if any) and then hands the gesture to the seam.
 */
export interface EasingCurveDragOptions {
    /** The SVG element ref the gesture geometry is resolved against. */
    svgEl: Readonly<Ref<SVGSVGElement | null>>;
    /** Whether the handles are editable (no-op drag otherwise). */
    editable: () => boolean | undefined;
    /** The current bezier control points (x1,y1,x2,y2), or undefined. */
    bezierPoints: () => [number, number, number, number] | undefined;
    /** Emit an updated bezier-points tuple. */
    onUpdate: (points: [number, number, number, number]) => void;
}

const RUBBER_K = 0.5;
const RUBBER_MAX = 2;
const SMOOTH_FACTOR = 0.35;

function rubberBand(value: number, lo: number, hi: number): number {
    if (value >= lo && value <= hi) return value;
    if (value > hi) {
        const over = value - hi;
        return hi + over / (1 + over * RUBBER_K);
    }
    const under = lo - value;
    return lo - under / (1 + under * RUBBER_K);
}

export function useEasingCurveDrag(options: EasingCurveDragOptions) {
    const { svgEl, editable, bezierPoints, onUpdate } = options;

    // Exposed for the template's `trace-smear--active` state (drag-bend smear).
    const currentHandleIndex = ref<number | null>(null);
    let smoothedY: number | null = null;

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

    const startDragging = (event: PointerEvent) => {
        const pts4 = bezierPoints();
        if (!editable() || !pts4) return;
        event.preventDefault();

        const { x, y } = pointerToSVG(event);
        const hitRadius = event.pointerType === "touch" ? 0.15 : 0.08;

        const pts = [
            { x: pts4[0], y: pts4[1] },
            { x: pts4[2], y: pts4[3] },
        ];

        let closestIndex: number | null = null;
        let closestDist = Infinity;
        for (let i = 0; i < 2; i++) {
            const dist = Math.hypot(pts[i]!.x - x, pts[i]!.y - y);
            if (dist < hitRadius && dist < closestDist) {
                closestDist = dist;
                closestIndex = i;
            }
        }

        if (closestIndex === null) return;

        currentHandleIndex.value = closestIndex;
        smoothedY = null;

        // Hand the gesture to the shared seam: it captures the pointer on the SVG
        // (the event's currentTarget), arms the global select-suppression token,
        // and drives onDrag/stopDragging for the gesture's lifetime.
        onPointerDown(event);
    };

    const stopDragging = () => {
        currentHandleIndex.value = null;
        smoothedY = null;
    };

    const onDrag = (event: PointerEvent) => {
        const pts4 = bezierPoints();
        if (currentHandleIndex.value === null || !pts4) return;

        const { x, y } = pointerToSVG(event);
        const clampedX = Math.max(0, Math.min(1, x));
        const dampedY = Math.max(
            -RUBBER_MAX,
            Math.min(RUBBER_MAX, rubberBand(y, 0, 1)),
        );

        if (smoothedY === null) smoothedY = dampedY;
        else
            smoothedY = smoothedY + (dampedY - smoothedY) * (1 - SMOOTH_FACTOR);

        const newPoints: [number, number, number, number] = [...pts4];
        const idx = currentHandleIndex.value;
        newPoints[idx * 2] = clampedX;
        newPoints[idx * 2 + 1] = smoothedY;

        onUpdate(newPoints);
    };

    // The shared seam (gesture-in-flight authority): owns capture + the global
    // select-suppression token; `onDrag` is the move body, `stopDragging` the end.
    const { onPointerDown } = useDragCapture({
        onMove: onDrag,
        onEnd: stopDragging,
    });

    return { currentHandleIndex, startDragging };
}
