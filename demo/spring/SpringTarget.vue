<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">
        <!-- Live interactive spring tracker -->
        <div class="glass-card w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">
                        SpringProgress
                    </span>
                    <span class="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                        x = {{ demo.liveValue.value.toFixed(3) }} &middot; v = {{ demo.liveVelocity.value.toFixed(2) }}
                    </span>
                </div>
                <span
                    class="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-0.5 rounded-full"
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
                    <div class="spring-rail-line"></div>
                    <!-- Ghost target marker (where the spring is chasing) -->
                    <div
                        class="spring-target-marker"
                        :style="{ left: `calc(${demo.target.value * 100}% )` }"
                    ></div>
                    <!-- The live spring ball -->
                    <div
                        class="spring-ball"
                        :style="{ left: `calc(${demo.liveValue.value * 100}%)` }"
                    ></div>
                </div>
                <p class="text-small text-muted-foreground text-center">
                    Tap or drag the rail &mdash; the ball springs to the new target. Adjust
                    <span class="font-mono text-xs">response</span> /
                    <span class="font-mono text-xs">dampingFraction</span> in the panel.
                </p>
            </div>

            <!-- springTimingFunction sweep -->
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-small text-foreground">springTimingFunction sweep</span>
                    <span class="font-mono text-xs text-muted-foreground tabular-nums">{{ demo.sampled.value.toFixed(3) }}</span>
                </div>
                <div class="sampler-track relative h-9">
                    <div class="spring-rail-line"></div>
                    <div
                        class="sampler-ball"
                        :style="{ left: `calc(${clampSweep(demo.sampled.value) * 100}%)` }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, useTemplateRef } from "vue";
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
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
};

const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    demo.reseat(positionFromEvent(e));
};

const onPointerUp = () => {
    dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
};

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

.spring-rail-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-progress) 12%, transparent);
    pointer-events: none;
}

.spring-target-marker {
    position: absolute;
    top: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    border-radius: 9999px;
    border: 2px dashed color-mix(in srgb, var(--color-progress) 50%, transparent);
    pointer-events: none;
    transition: border-color var(--duration-fast) ease;
}

.spring-ball {
    position: absolute;
    top: 50%;
    width: 1.75rem;
    height: 1.75rem;
    margin-left: -0.875rem;
    margin-top: -0.875rem;
    border-radius: 9999px;
    background: var(--color-progress);
    box-shadow: 0 2px 12px color-mix(in srgb, var(--color-progress) 40%, transparent);
    pointer-events: none;
    will-change: left;
}

.sampler-ball {
    position: absolute;
    top: 50%;
    width: 1.25rem;
    height: 1.25rem;
    margin-left: -0.625rem;
    margin-top: -0.625rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-progress) 65%, transparent);
    pointer-events: none;
    will-change: left;
}

.settled-badge {
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    /* AA contrast on the light-green tint: push the green text toward the
       foreground (dark in light mode, light in dark mode) so it reads ≥4.5:1
       against the badge tint in BOTH themes — the bare --color-progress green
       on its own 14% tint was 1.97:1 (the C.W2 a11y leaf, lighthouse
       color-contrast). The green hue survives the mix; only the lightness
       moves to meet AA. */
    color: color-mix(in srgb, var(--color-progress) 50%, var(--foreground));
}

.tracking-badge {
    background: color-mix(in srgb, var(--muted) 60%, transparent);
    color: var(--muted-foreground);
}
</style>
