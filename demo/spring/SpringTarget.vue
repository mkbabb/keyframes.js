<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         A standard, NON-cartoon glass `<Card>` (the protagonist plate;
         `tier="resting" surface="glass"`, rounded-card by construction → I4 for
         free). The control PANELS stay cartoon+quiet (W2/W9). Dock-band
         containment is the surviving [stage]-track `.stage-cell` PRIMITIVE (the
         G8 LAYOUT half survives; the surface half reverses). `shadow={false}`:
         the plate reads cleaner without a nested shadow (FORK I5-shadow). The
         `max-w-3xl` rides the content column as an optical reading measure. -->
    <Card
        :shadow="false"
        class="flex flex-col items-center justify-center gap-8 h-full w-full px-6 lg:px-8 overflow-hidden"
    >
        <!-- Header readout -->
        <div class="flex w-full max-w-3xl items-center justify-between gap-3 shrink-0">
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
        <div class="flex w-full max-w-3xl flex-col items-center justify-center gap-6">
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
                @dblclick="demo.derby"
            >
                <div class="progress-rail"></div>
                <!-- Ghost target marker (where the spring is chasing) — a
                     DISCRETE position (re-seat events), so it stays reactive. -->
                <div
                    class="spring-target-marker"
                    :style="{ left: `calc(${demo.target.value * 100}% )` }"
                ></div>
                <!-- The live spring ball — positioned IMPERATIVELY by the
                     registered spring painter (J.W2 S5: direct style writes off
                     the Vue render graph; no reactive :style on the hot path). -->
                <div ref="liveBallEl" class="progress-ball spring-ball"></div>
            </div>
            <p class="text-small text-muted-foreground text-center">
                Tap or drag the rail &mdash; the ball springs to the new target. Adjust
                <span class="code-token">response</span> /
                <span class="code-token">dampingFraction</span> in the panel.
            </p>
        </div>

        <!-- springTimingFunction sweep -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between mb-2">
                <span class="text-small text-foreground">springTimingFunction sweep</span>
                <span class="text-mono-caption text-muted-foreground tabular-nums">{{ demo.sampled.value.toFixed(3) }}</span>
            </div>
            <div class="sampler-track relative h-9">
                <div class="progress-rail"></div>
                <!-- The sampler ball — painter-positioned (J.W2 S5, as above). -->
                <div ref="samplerBallEl" class="progress-ball sampler-ball"></div>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { inject, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { useDragScrub } from "@composables/useDragScrub";
import { SPRING_DEMO_KEY } from "./springKeys";

const demo = inject(SPRING_DEMO_KEY)!;

const railEl = useTemplateRef<HTMLElement>("railEl");
const liveBallEl = useTemplateRef<HTMLElement>("liveBallEl");
const samplerBallEl = useTemplateRef<HTMLElement>("samplerBallEl");

// The sweep can overshoot past 1 (underdamped) — clamp the *marker* position
// so the ball stays inside the track even though the read-out shows >1.
const clampSweep = (v: number) => Math.max(0, Math.min(1, v));

// ── J.W2 S5 (DS-3) — the spring painters: DIRECT non-reactive `style` writes ──
// Registered with the demo's loop seam; called imperatively each frame with the
// live snapshot. The hot positional path leaves the Vue render graph (the
// former 17-refs/frame reactive storm is gone — the balls move, nothing
// re-renders); the readout numerals above stay reactive at the few-Hz cadence.
let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const live = demo.springLive;
        if (liveBallEl.value) {
            liveBallEl.value.style.left = `${live.value * 100}%`;
        }
        if (samplerBallEl.value) {
            samplerBallEl.value.style.left = `${clampSweep(live.sampled) * 100}%`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

// The shared drag-scrub seam (H.W12.S1 / I8). Spring's `project` is the bare
// rect-ratio (`demo.reseat` owns the clamp); no pause/resume hooks — the spring
// chases the live target continuously.
const { onPointerDown } = useDragScrub({
    el: railEl,
    project: (e) => {
        const el = railEl.value;
        if (!el) return demo.target.value;
        const rect = el.getBoundingClientRect();
        return (e.clientX - rect.left) / rect.width;
    },
    onScrub: (ratio) => demo.reseat(ratio),
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
