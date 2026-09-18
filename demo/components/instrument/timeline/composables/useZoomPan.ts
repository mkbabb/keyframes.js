import { computed, ref } from "vue";
import type { Ref } from "vue";
import { clamp } from "@mkbabb/value.js/math";

export function useZoomPan(trackEl: Ref<HTMLElement | null>) {
    const zoomLevel = ref(1);
    const panOffset = ref(0); // percent units (0-100 range)

    const percentToPosition = (pct: number): number => {
        return (pct - panOffset.value) * zoomLevel.value;
    };

    const positionToPercent = (pos: number): number => {
        return pos / zoomLevel.value + panOffset.value;
    };

    const clampPan = () => {
        const maxPan = 100 - 100 / zoomLevel.value;
        panOffset.value = clamp(panOffset.value, 0, maxPan);
    };

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 10;

    /**
     * Set the zoom while holding ONE point of the rail still: `anchor` is that
     * point as a fraction of the visible window (0 = left edge, 0.5 = middle,
     * 1 = right edge). The wheel anchors on the pointer; the keyboard route
     * anchors on the middle, because a keyboard user has no pointer to anchor
     * on. Both go through here so the recentring math exists once.
     */
    const setZoomAround = (nextZoom: number, anchor: number) => {
        const z = clamp(nextZoom, ZOOM_MIN, ZOOM_MAX);
        const anchorPercent = positionToPercent(anchor * 100);
        panOffset.value = anchorPercent - (anchor * 100) / z;
        zoomLevel.value = z;
        clampPan();
    };

    /** The keyboard zoom route (D-11): `+` / `-` with the rail focused. */
    const zoomBy = (factor: number) => setZoomAround(zoomLevel.value * factor, 0.5);

    /** The keyboard pan route (M-7 + RR-B missed-4): the readout is operable. */
    const panBy = (deltaPercent: number) => {
        panOffset.value += deltaPercent;
        clampPan();
    };

    /** Jump the window so `percent` sits at `anchor` of it (drag/click to pan). */
    const panTo = (percent: number, anchor = 0.5) => {
        panOffset.value = percent - (anchor * 100) / zoomLevel.value;
        clampPan();
    };

    // Dynamic tick marks based on zoom level. The ladder's rungs are 2/5/10/25
    // — never 1 (D-4): at z = 7.99 a step of 5 puts the ticks 39.9% of the rail
    // apart, and the old `1` rung dropped that to 8% on a 0.01 increment, a 5×
    // collapse mid-gesture. `2` gives 16%. The labels carry the information, so
    // the rung is re-tuned and the mechanism kept.
    const visibleTicks = computed(() => {
        let step: number;
        if (zoomLevel.value >= 8) step = 2;
        else if (zoomLevel.value >= 5) step = 5;
        else if (zoomLevel.value >= 3) step = 10;
        else step = 25;

        const ticks: number[] = [];
        const visibleStart = panOffset.value;
        const visibleEnd = panOffset.value + 100 / zoomLevel.value;

        for (let t = 0; t <= 100; t += step) {
            if (t >= visibleStart - step && t <= visibleEnd + step) {
                ticks.push(t);
            }
        }
        return ticks;
    });

    // --- The wheel, inside ONE policy: PREVENT ONLY ON CONSUMED EVENTS ---
    //
    // This handler says whether it CONSUMED the event; the caller cancels the
    // page's scroll only when it did. The track used to declare `@wheel.prevent`,
    // which cancels before the handler runs: a plain wheel matched neither
    // branch and was swallowed anyway, turning a 48–128px full-width band inside
    // a scrollable pane into a scroll trap.
    const onWheel = (event: WheelEvent): boolean => {
        if (event.ctrlKey || event.metaKey) {
            // `trackEl` is genuinely nullable (its sole caller passes a
            // `useTemplateRef`), so it is GUARDED, never asserted (L-m-10):
            // the old `trackEl.value!` was a real unguarded dereference.
            const rect = trackEl.value?.getBoundingClientRect();
            if (!rect || rect.width === 0) return false;
            const anchor = (event.clientX - rect.left) / rect.width;
            setZoomAround(
                zoomLevel.value * (event.deltaY < 0 ? 1.05 : 1 / 1.05),
                anchor,
            );
            return true;
        }
        if (event.shiftKey && zoomLevel.value > 1) {
            // WHICHEVER AXIS THE ENGINE DELIVERS (M-7 + RR-B missed-4): a
            // shift-wheel arrives as `deltaX` on some engines and `deltaY` on
            // others, and reading only `deltaY` left the sole pan gesture dead
            // on the ones that translate the axis for you.
            const delta = event.deltaX || event.deltaY;
            if (delta === 0) return false;
            panBy((delta * 0.1) / zoomLevel.value);
            return true;
        }
        return false;
    };

    // Touch pinch zoom
    let initialPinchDist = 0;
    let initialPinchZoom = 1;

    const getTouchDist = (touches: TouchList): number => {
        if (touches.length < 2) return 0;
        const dx = touches[1]!.clientX - touches[0]!.clientX;
        const dy = touches[1]!.clientY - touches[0]!.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 2) {
            initialPinchDist = getTouchDist(event.touches);
            initialPinchZoom = zoomLevel.value;
        }
    };

    const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 2 && initialPinchDist > 0) {
            const dist = getTouchDist(event.touches);
            const scale = dist / initialPinchDist;
            zoomLevel.value = Math.max(
                1,
                Math.min(10, initialPinchZoom * scale),
            );
            clampPan();
        }
    };

    const onTouchEnd = () => {
        initialPinchDist = 0;
    };

    return {
        zoomLevel,
        panOffset,
        percentToPosition,
        positionToPercent,
        clampPan,
        setZoomAround,
        zoomBy,
        panBy,
        panTo,
        visibleTicks,
        onWheel,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
