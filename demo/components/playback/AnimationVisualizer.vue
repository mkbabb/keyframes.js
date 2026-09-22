<template>
    <!-- aria-hidden: this big ball is a decorative VISUAL twin of the real
         reka <Slider> in PlaybackRibbon (same scrub value, same range). One
         AT slider per scrub value — the <Slider> is it; this is sighted-only
         flair, so it is hidden from the accessibility tree (the spec's
         "redundant twin → aria-hidden" disposition). -->
    <div class="p-2 w-full h-full" aria-hidden="true">
        <div
            ref="trackEl"
            class="w-full h-12 relative"
            :style="{ touchAction: gate.isActive.value || !gate.isTouchDevice ? 'none' : 'pan-y' }"
        >
            <!-- The rail + ball ADOPT the demo's promoted `.progress-rail` /
                 `.progress-ball` idiom (design-idioms.css) instead of
                 hand-rolling a seventh, divergent authoring of it (KF-AV-10,
                 against DESIGN.md §5): the 2px rail with its 8% tint, the pill
                 radius, the tone fill and the 35% glow all come from the one
                 definition, and this scene retints it the sanctioned way — by
                 setting `--ball-tone`, exactly as SpringTarget's derby lanes and
                 SequenceTarget do. Two things are deliberately NOT taken from
                 the idiom: `transform`, which it leaves unclaimed BY DESIGN
                 (kf-EasingTarget P-2 — this ball is its own painter, writing
                 `translateX` every frame), and the rail's INSET, which is this
                 scene's own geometry (the rail spans the ball's centre travel,
                 not the container) and is therefore declared where it is true. -->
            <div
                ref="containerEl"
                class="visualizer-stage w-full h-full relative container-inline-size"
            >
                <div
                    class="progress-rail"
                    :style="{
                        left: 'calc(var(--visualizer-track-gutter) / 2)',
                        width: 'calc(100% - var(--visualizer-track-gutter))',
                    }"
                ></div>

                <div
                    ref="ball"
                    :class="[
                        'progress-ball visualizer-ball z-bar will-change-transform touch-gate-target',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                        gate.isActive.value ? 'touch-gate-active' : '',
                    ]"
                    @pointerdown="gatedPointerDown"
                    @touchmove="gate.handleScrollCheck"
                    @touchend="gate.handleTouchEnd"
                ></div>

                <div
                    class="absolute top-0 left-0 rounded-full z-content h-full aspect-square bg-accent-kf/30 shadow-sm pointer-events-none"
                ></div>

                <div
                    class="absolute top-0 translate-x-[calc(100cqw_-_100%)] rounded-full z-content h-full aspect-square bg-accent-kf/15 border-2 border-dashed border-accent-kf/40 pointer-events-none"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onScopeDispose, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { bumpLayoutEpoch } from "@src/animation/resolve/browser";
import { clamp } from "@mkbabb/value.js/math";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { SmoothProgress } from "@mkbabb/keyframes.js";
import { SpringProgress } from "@mkbabb/keyframes.js";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import { useRafLoop } from "@components/instrument/transport/composables/useRafLoop";
import { useDragCapture } from "@components/instrument/transport/composables/useDragCapture";
import { useTouchGate } from "@mkbabb/glass-ui";

const props = defineProps<{
    animation: KeyframesAnimation<any>;
    isPlaying: boolean;
    /**
     * R-e-2 — the playhead the ribbon displays (effective ms). The twin paints
     * from `animation.effectiveT` (`markRaw`, so unobservable); this reactive
     * value is what tells it the clock was seated while its frame loop is idle.
     */
    currentT: number;
}>();

const emit = defineEmits<{
    (e: "scrub", t: number): void;
    (e: "dragStart"): void;
    (e: "dragEnd"): void;
}>();

const ballEl = useTemplateRef<HTMLElement>('ball');
const trackEl = useTemplateRef<HTMLElement>("trackEl");
const containerEl = useTemplateRef<HTMLElement>("containerEl");

// G.W3 — bust the C1 endpoint cache on a CONTAINER resize the auto-
// `window.resize` listener cannot see. The dashed twin animates to
// `calc(100cqw - 100%)` resolved against this `container-inline-size` box, and
// THIS repo's own `src/animation/resolve/browser.ts` caches the resolved px
// keyed by a monotonic `layoutEpoch` — it also installs the `window.resize`
// listener that bumps it. The cache, the epoch and the listener are keyframes'
// (`bumpLayoutEpoch` is exported there); value.js's part on this path is the
// unit classifier `isLayoutTrackingUnit`, and nothing else. A panel/split-pane
// re-layout that changes the container width WITHOUT a viewport resize never
// bumps the epoch → the ball serves the stale pre-resize target. Feed the
// genuine signal `bumpLayoutEpoch` exists for (the demo OWNS its container; the
// eviction policy stays ONCE in browser.ts — DRY). useResizeObserver
// auto-cleans on scope dispose.
useResizeObserver(containerEl, () => bumpLayoutEpoch());

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
    const x = clamp(clientX - rect.left - ballW / 2 - grabOffset, 0, maxX);
    return x / maxX;
};

/**
 * C·C-1 ≡ KF-AV-16 — THE MACHINE-WRITE POLICY, at this consumer's own seam.
 *
 * `scrub` is not a paint event. It terminates in a scene-machine dispatch whose
 * reducer allocates a fresh context on every call and whose store serialises
 * that context to localStorage synchronously, so each emit costs one
 * `JSON.stringify` + `setItem`. The DECISION is DECOUPLE — the machine's cadence
 * is the animation frame, never the input sample — and the pointer half of it
 * lives in `useDragCapture`, which now delivers at most one move per frame with
 * the terminal sample flushed exactly on release.
 *
 * The COAST reaches this function from inside `RAFPlayback`: one call per frame
 * by construction, so it already obeys that half of the rule. What it did not
 * obey is the other half. A decay-to-rest coast pins to its target boundary for
 * the last frames of its flight and re-dispatched an identical `t` on each of
 * them — and the machine cannot elide them itself, because a fresh context per
 * dispatch defeats its own echo guard. So the seam does not send them: the paint
 * still runs every frame (it is free, and it is what the ball is for) and the
 * machine is written only when the value it holds has actually changed.
 */
let lastEmittedT: number | null = null;

const applyProgress = (progress: number) => {
    const anim = props.animation;
    if (!anim || anim.options.duration <= 0) return;

    setBallProgress(progress);

    const t = progress * anim.options.duration;
    if (t === lastEmittedT) return;
    lastEmittedT = t;
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
        const p = clamp(coastSpring.value, 0, 1);
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

        // Reset velocity tracking + cancel any in-flight coast. The
        // machine-write latch re-arms with the gesture: the clock may have moved
        // under us (the ribbon's own Slider scrubs the same animation), so the
        // press always writes its seat.
        lastEmittedT = null;
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

useRafLoop(() => {
    const anim = props.animation;
    if (!isDragging.value && !coastPlayback.running && anim.options.duration > 0) {
        const progress = Math.max(
            0,
            Math.min(anim.effectiveT / anim.options.duration, 1),
        );
        setBallProgress(progress);
    }
}, { guard: computed(() => props.isPlaying || isDragging.value) });

// ── Paused repaint (R-e-2) ───────────
// The loop above is guarded off while paused, so a PAUSED scrub (the ribbon's
// Slider by pointer or keyboard, or the scene seating its clock) moved the
// thumb but left this ball where the last play put it. The ribbon's displayed
// playhead is the trigger: when it changes and no frame loop is painting (not
// playing, not dragging, not coasting), repaint the ball once from the same
// `effectiveT` the loop paints from. One paint per seat; no loop is armed.
watch(
    () => props.currentT,
    () => {
        const anim = props.animation;
        if (props.isPlaying || isDragging.value || coastPlayback.running) return;
        if (anim.options.duration <= 0) return;
        setBallProgress(clamp(anim.effectiveT / anim.options.duration, 0, 1));
    },
);

// Stop the raw coast RAFPlayback on dispose — the sync loop rides useRafLoop's
// auto-cleanup, but coastPlayback is a second raw playback; unmounting mid-fling
// would otherwise leave it running until the spring settles (a bounded micro-leak).
onScopeDispose(() => coastPlayback.stop());
</script>

<style scoped>
/* The scene's retint of the shared idiom (KF-AV-10): the rail-line and the ball
   read the ONE definition's geometry and take this scene's accent through
   `--ball-tone`, the seam the idiom publishes for exactly this (a per-scene
   ANCESTOR sets it, so nothing is shadowed and every subject keeps its hue).
   `--ball-size` is the 48px this scene's hit target and its projection math
   already assume (`ballEl.clientWidth`), stated once here instead of as an
   `h-12 w-12` pair 40 lines from the ball's own geometry. */
.visualizer-stage {
    --ball-tone: var(--color-accent-kf);
    --ball-size: 3rem;
}

/* The idiom leaves `transform` unclaimed BY DESIGN and this ball is its own
   painter (it writes `translateX` every frame), so the ball opts OUT of the
   idiom's `pointer-events: none` — it is the scene's drag handle, not a
   decorative mark — and keeps its own elevation. Nothing else is overridden. */
.visualizer-ball {
    pointer-events: auto;
    box-shadow:
        0 2px 10px color-mix(in srgb, var(--ball-tone) var(--ball-glow, 35%), transparent),
        var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
}
</style>
