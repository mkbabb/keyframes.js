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

    // Dynamic tick marks based on zoom level
    const visibleTicks = computed(() => {
        let step: number;
        if (zoomLevel.value >= 8) step = 1;
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

    // --- Zoom handlers ---
    const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey || event.metaKey) {
            // Zoom centered on pointer
            const rect = trackEl.value!.getBoundingClientRect();
            const pointerX = (event.clientX - rect.left) / rect.width;
            const pointerPercent = positionToPercent(pointerX * 100);

            const factor = event.deltaY < 0 ? 1.05 : 1 / 1.05;
        const newZoom = clamp(zoomLevel.value * factor, 1, 10);

            // Adjust pan so pointer stays at same percent
            panOffset.value = pointerPercent - (pointerX * 100) / newZoom;
            zoomLevel.value = newZoom;
            clampPan();
        } else if (event.shiftKey && zoomLevel.value > 1) {
            // Horizontal pan
            panOffset.value += (event.deltaY * 0.1) / zoomLevel.value;
            clampPan();
        }
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
        visibleTicks,
        onWheel,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
