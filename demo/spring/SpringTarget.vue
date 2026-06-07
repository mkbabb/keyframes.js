<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">
        <!-- Live interactive spring tracker -->
        <div class="glass-card w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">
                        SpringProgress
                    </span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        x = {{ demo.liveValue.value.toFixed(3) }} &middot; v = {{ demo.liveVelocity.value.toFixed(2) }}
                    </span>
                </div>
                <span
                    class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                    :class="demo.liveSettled.value ? 'settled-badge' : 'tracking-badge'"
                >{{ demo.liveSettled.value ? "settled" : "tracking" }}</span>
            </div>

            <!-- The rail: tap/drag to re-seat the live target -->
            <div class="flex-1 min-h-0 flex flex-col items-center justify-center px-8 py-6 gap-6">
                <div
                    ref="railEl"
                    class="spring-rail relative w-full h-12 cursor-pointer select-none"
                    role="slider"
                    aria-label="Drag to re-seat the spring target"
                    :aria-valuenow="Math.round(demo.target.value * 100)"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    tabindex="0"
                    @pointerdown="onPointerDown"
                    @keydown="onKeydown"
                >
                    <div class="progress-rail"></div>
                    <!-- Ghost target marker (where the spring is chasing) -->
                    <div
                        class="spring-target-marker"
                        :style="{ left: `calc(${demo.target.value * 100}% )` }"
                    ></div>
                    <!-- The live spring ball -->
                    <div
                        class="progress-ball spring-ball"
                        :style="{ left: `calc(${demo.liveValue.value * 100}%)` }"
                    ></div>
                </div>
                <p class="text-small text-muted-foreground text-center">
                    Tap or drag the rail &mdash; the ball springs to the new target. Adjust
                    <span class="code-token">response</span> /
                    <span class="code-token">dampingFraction</span> in the panel.
                </p>
            </div>

            <!-- springTimingFunction sweep -->
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-small text-foreground">springTimingFunction sweep</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums">{{ demo.sampled.value.toFixed(3) }}</span>
                </div>
                <div class="sampler-track relative h-9">
                    <div class="progress-rail"></div>
                    <div
                        class="progress-ball sampler-ball"
                        :style="{ left: `calc(${clampSweep(demo.sampled.value) * 100}%)` }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { SPRING_DEMO_KEY } from "./springKeys";

const demo = inject(SPRING_DEMO_KEY)!;

const railEl = useTemplateRef<HTMLElement>("railEl");

// The sweep can overshoot past 1 (underdamped) — clamp the *marker* position
// so the ball stays inside the track even though the read-out shows >1.
const clampSweep = (v: number) => Math.max(0, Math.min(1, v));

const positionFromEvent = (e: PointerEvent): number => {
    const el = railEl.value;
    if (!el) return demo.target.value;
    const rect = el.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
};

let dragging = false;

const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    railEl.value?.setPointerCapture(e.pointerId);
    demo.reseat(positionFromEvent(e));
};

// vueuse owns the lifecycle (auto-cleanup on scope dispose); the handlers stay
// registered and early-return unless a drag is in flight — the idiomatic form.
useEventListener(window, "pointermove", (e: PointerEvent) => {
    if (!dragging) return;
    demo.reseat(positionFromEvent(e));
});

useEventListener(window, "pointerup", () => {
    dragging = false;
});

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        demo.reseat(demo.target.value + 0.1);
        e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        demo.reseat(demo.target.value - 0.1);
        e.preventDefault();
    } else if (e.key === "Home") {
        demo.reseat(0);
        e.preventDefault();
    } else if (e.key === "End") {
        demo.reseat(1);
        e.preventDefault();
    }
};
</script>

<style scoped>
.spring-rail,
.sampler-track {
    display: flex;
    align-items: center;
}

/* The rail + ball geometry now come from the shared .progress-rail /
   .progress-ball idiom (design-idioms.css). The consolidation adopts
   EasingTarget's canonical lineage (rail-tint 8%, ball-glow 35%) — so the former
   12% rail + 40% glow become the canonical defaults (a named befitting motion-
   cohesion delta, the same class as the W11 --spring-snappy reconcile). These
   scoped modifiers carry only the per-site variation: the left-positioned
   horizontal centering (the idiom centers vertically via margin-top; these balls
   ride `left:`), the live-ball SIZE, and the sampler ball's translucent fill +
   suppressed glow.
   The spring-target-marker is the dashed GHOST target (where the spring is
   chasing) — a distinct primitive, NOT a rail/ball, so it stays scoped. */
.spring-target-marker {
    position: absolute;
    top: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    border-radius: var(--radius-pill);
    border: 2px dashed color-mix(in srgb, var(--color-progress) 50%, transparent);
    pointer-events: none;
    transition: border-color var(--duration-fast) ease;
}

.spring-ball {
    --ball-size: 1.75rem;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}

.sampler-ball {
    --ball-size: 1.25rem;
    --ball-glow: 0%; /* the sweep sampler is a quiet translucent marker, no glow */
    margin-left: calc(var(--ball-size) / -2);
    background: color-mix(in srgb, var(--color-progress) 65%, transparent);
    will-change: left;
}
</style>
