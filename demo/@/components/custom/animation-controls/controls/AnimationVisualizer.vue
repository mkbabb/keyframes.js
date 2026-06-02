<template>
    <div class="p-2 w-full h-full">
        <div
            ref="trackEl"
            class="w-full h-12 relative"
            :style="{ touchAction: gate.isActive.value || !gate.isTouchDevice ? 'none' : 'pan-y' }"
        >
            <div ref="containerEl" class="w-full h-full relative container-inline-size">
                <div
                    class="absolute top-1/2 left-6 w-[calc(100%-3rem)] h-1 -translate-y-1/2 rounded-full bg-accent-red/20 pointer-events-none"
                ></div>

                <div
                    ref="ball"
                    :class="[
                        'absolute z-bar rounded-full h-12 w-12 bg-accent-red text-accent-red-foreground shadow-md will-change-transform touch-gate-target',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                        gate.isActive.value ? 'touch-gate-active' : '',
                    ]"
                    @pointerdown="gatedPointerDown"
                    @touchmove="gate.handleScrollCheck"
                    @touchend="gate.handleTouchEnd"
                ></div>

                <div
                    class="absolute top-0 left-0 rounded-full z-content h-full aspect-square bg-accent-red/30 shadow-sm pointer-events-none"
                ></div>

                <div
                    class="absolute top-0 translate-x-[calc(100cqw_-_100%)] rounded-full z-content h-full aspect-square bg-accent-red/15 border-2 border-dashed border-accent-red/40 pointer-events-none"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from "vue";
import type { Animation } from "@src/animation/engine";
import { useRafLoop } from "../composables/useRafLoop";
import { useDragCapture } from "./composables/useDragCapture";
import { useTouchGate } from "@mkbabb/glass-ui";

const props = defineProps<{
    animation: Animation<any>;
    isPlaying: boolean;
}>();

const emit = defineEmits<{
    (e: "scrub", t: number): void;
    (e: "dragStart"): void;
    (e: "dragEnd"): void;
}>();

const ballEl = useTemplateRef<HTMLElement>('ball');
const trackEl = useTemplateRef<HTMLElement>("trackEl");
const containerEl = useTemplateRef<HTMLElement>("containerEl");

const gate = useTouchGate();

let grabOffset = 0;

/** Max translateX in pixels (container width − ball width). */
const getMaxX = () => {
    const container = containerEl.value;
    const ball = ballEl.value;
    if (!container || !ball) return 0;
    return container.clientWidth - ball.clientWidth;
};

/** Set ball position directly via transform — no animation timing curve. */
const setBallProgress = (progress: number) => {
    const ball = ballEl.value;
    if (!ball) return;
    const px = progress * getMaxX();
    ball.style.transform = `translateX(${px}px)`;
};

const progressFromPointerX = (clientX: number): number => {
    const track = trackEl.value;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ballW = ballEl.value?.clientWidth ?? 48;
    const maxX = rect.width - ballW;
    if (maxX <= 0) return 0;
    const x = Math.max(0, Math.min(clientX - rect.left - ballW / 2 - grabOffset, maxX));
    return x / maxX;
};

const applyProgress = (progress: number) => {
    const anim = props.animation;
    if (!anim || anim.options.duration <= 0) return;

    setBallProgress(progress);

    const t = progress * anim.options.duration;
    emit("scrub", t);
};

// ── Inertia / momentum on release ────────────────────────────────

/** Friction coefficient — higher = stops faster. 0.92 gives a nice short coast. */
const FRICTION = 0.92;
/** Minimum velocity (in progress/ms) below which coasting stops. */
const VELOCITY_EPSILON = 0.00002;

let lastProgress = 0;
let lastMoveTime = 0;
/** Exponentially smoothed velocity in progress units per ms. */
let velocity = 0;
let coastRafId: number | null = null;

/** Track velocity from drag movement samples. */
const trackVelocity = (progress: number) => {
    const now = performance.now();
    const dt = now - lastMoveTime;
    if (dt > 0 && dt < 200) {
        // Exponential smoothing — blends new sample with running estimate
        // to filter out jitter while preserving directional intent.
        const instantV = (progress - lastProgress) / dt;
        velocity = velocity * 0.6 + instantV * 0.4;
    }
    lastProgress = progress;
    lastMoveTime = now;
};

/** Cancel any in-flight coast animation. */
const stopCoast = () => {
    if (coastRafId !== null) {
        cancelAnimationFrame(coastRafId);
        coastRafId = null;
    }
};

/**
 * After the user releases the ball, coast with decaying velocity
 * until friction brings it to rest or it hits the [0, 1] boundary.
 */
const startCoast = () => {
    if (Math.abs(velocity) < VELOCITY_EPSILON) return;

    let coastProgress = lastProgress;
    let prevTime = performance.now();

    const coast = () => {
        const now = performance.now();
        const dt = now - prevTime;
        prevTime = now;

        velocity *= FRICTION;
        coastProgress += velocity * dt;

        // Clamp and stop at boundaries
        if (coastProgress <= 0) { coastProgress = 0; velocity = 0; }
        if (coastProgress >= 1) { coastProgress = 1; velocity = 0; }

        applyProgress(coastProgress);
        lastProgress = coastProgress;

        if (Math.abs(velocity) > VELOCITY_EPSILON) {
            coastRafId = requestAnimationFrame(coast);
        } else {
            coastRafId = null;
            emit("dragEnd");
        }
    };

    coastRafId = requestAnimationFrame(coast);
};

// ── Drag capture ─────────────────────────────────────────────────

const { isDragging, onPointerDown } = useDragCapture({
    onStart: (e) => {
        const ball = ballEl.value;
        if (!ball) return;
        const ballRect = ball.getBoundingClientRect();
        grabOffset = e.clientX - (ballRect.left + ballRect.width / 2);
        gate.suppressDeactivate(true);

        // Reset velocity tracking
        velocity = 0;
        lastMoveTime = performance.now();
        stopCoast();

        emit("dragStart");

        const p = progressFromPointerX(e.clientX);
        lastProgress = p;
        applyProgress(p);
    },
    onMove: (e) => {
        const p = progressFromPointerX(e.clientX);
        trackVelocity(p);
        applyProgress(p);
    },
    onEnd: () => {
        grabOffset = 0;
        gate.suppressDeactivate(false);

        // If there's meaningful velocity, coast with inertia.
        // dragEnd is emitted when the coast finishes (or immediately if no coast).
        if (Math.abs(velocity) > VELOCITY_EPSILON) {
            startCoast();
        } else {
            emit("dragEnd");
        }
    },
});

/** Gate pointer-down through touch gate on mobile. */
const gatedPointerDown = (e: PointerEvent) => {
    const ball = ballEl.value;
    if (!ball) return;
    if (!gate.handleTouchStart(ball, e.clientY)) return;
    onPointerDown(e);
};

// ── Playback sync ───────────
// Always poll — the animation's effectiveT changes during playback, slider scrub,
// and visualizer drag. The cost is one progress calc + setBallProgress per frame.

const { start: startSync } = useRafLoop(() => {
    const anim = props.animation;
    if (!isDragging.value && coastRafId === null && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        setBallProgress(progress);
    }
});
startSync();
</script>
