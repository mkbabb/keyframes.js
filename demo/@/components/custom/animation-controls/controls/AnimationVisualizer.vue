<template>
    <div class="p-2 w-full h-full">
        <div
            ref="trackEl"
            class="w-full h-12 relative"
            :style="{ touchAction: gate.isActive.value || !gate.isTouchDevice ? 'none' : 'pan-y' }"
        >
            <div ref="containerEl" class="w-full h-full relative container-inline-size">
                <div
                    class="absolute top-1/2 left-6 w-[calc(100%-var(--visualizer-track-gutter))] h-1 -translate-y-1/2 rounded-full bg-accent-red/20 pointer-events-none"
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
import { useTemplateRef } from "vue";
import type { Animation } from "@src/animation/engine";
import { SmoothProgress } from "@src/animation/smooth";
import { SpringProgress } from "@src/animation/spring";
import { RAFPlayback } from "@src/animation/playback";
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

// ── Inertia / momentum on release (engine-driven) ────────────────
// The two hand-rolled physics loops are now the engine's two flagship
// light trackers: SmoothProgress (exponential velocity estimator) and
// SpringProgress (analytic decay-to-rest coast), driven by RAFPlayback.

let lastProgress = 0;
let lastMoveTime = 0;

/**
 * Exponentially-smoothed drag velocity, in progress units per ms.
 * SmoothProgress IS the `v = v*α + instantV*(1-α)` recurrence — fed the
 * raw per-sample velocity, its `.current` is the filtered estimate. No
 * clamp (velocity is signed, unbounded), no settle snap during sampling.
 */
const velocityEstimator = new SmoothProgress({ damping: 0.4, clamp: false });

/**
 * Release coast. Seated to the nearest boundary in the fling direction,
 * with the released velocity as the spring's initial velocity — its
 * analytic damped-decay solver carries the momentum to rest. Under
 * reduced-motion it snaps to the boundary in one emit.
 */
const coastSpring = new SpringProgress({
    response: 0.45,
    dampingFraction: 1,
    respectReducedMotion: true,
});
const coastPlayback = new RAFPlayback();

/** Feed each drag sample's instant velocity into the smoother. */
const trackVelocity = (progress: number) => {
    const now = performance.now();
    const dt = now - lastMoveTime;
    if (dt > 0 && dt < 200) {
        velocityEstimator.setTarget((progress - lastProgress) / dt);
        velocityEstimator.tickDt(dt);
    }
    lastProgress = progress;
    lastMoveTime = now;
};

/** Below this release speed (progress/ms) a tap positions without coasting. */
const FLING_THRESHOLD = 0.00002;

/**
 * Seat the coast spring at the release point with the released velocity
 * and let RAFPlayback.drive carry it to the boundary the fling points at,
 * settling itself. `drive` re-arms idempotently and auto-stops on
 * `spring.settled`. A release without a fling has nothing to coast.
 */
const startCoast = () => {
    const velocity = velocityEstimator.current; // progress / ms
    if (Math.abs(velocity) < FLING_THRESHOLD) {
        emit("dragEnd");
        return;
    }

    // Seat at the release point with the released velocity (ms → s for the
    // spring's units/second convention) and aim at the fling-direction
    // boundary; the analytic decay carries the momentum there.
    coastSpring.reset(lastProgress, velocity * 1000);
    coastSpring.target = velocity > 0 ? 1 : 0;

    coastPlayback.drive(coastSpring, () => {
        const p = Math.max(0, Math.min(coastSpring.value, 1));
        lastProgress = p;
        applyProgress(p);
        if (coastSpring.settled) emit("dragEnd");
    });
};

// ── Drag capture ─────────────────────────────────────────────────

const { isDragging, onPointerDown } = useDragCapture({
    onStart: (e) => {
        const ball = ballEl.value;
        if (!ball) return;
        const ballRect = ball.getBoundingClientRect();
        grabOffset = e.clientX - (ballRect.left + ballRect.width / 2);
        gate.suppressDeactivate(true);

        // Reset velocity tracking + cancel any in-flight coast.
        velocityEstimator.reset(0);
        lastMoveTime = performance.now();
        coastPlayback.stop();

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

        // Coast with inertia. The spring settles immediately (and emits
        // dragEnd) when the release velocity is negligible.
        startCoast();
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
    if (!isDragging.value && !coastPlayback.running && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        setBallProgress(progress);
    }
});
startSync();
</script>
