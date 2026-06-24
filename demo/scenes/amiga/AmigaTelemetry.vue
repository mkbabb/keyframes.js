<template>
    <!-- Q.WC5 S1 — the amiga decay() telemetry: a small readout overlay that
         surfaces the already-tracked angular velocity so the engine's analytic
         `decay()` glide is VISIBLE. Drag the sphere (the readout climbs) → release
         (it decays exponentially to zero — the visible `decay()` coast). The
         "engine drives a non-DOM Three.js target" dogfood is finally witnessed
         beside the CRT egg (they coexist). A pure CONSUMER of the velocity the
         composable already tracks (`Math.hypot(velX, velY)` during a drag, the
         decay() sampler's velocity during the glide) — never a second integrator.
         pointer-events:none so the spin/orbit gesture is untouched. -->
    <div class="amiga-telemetry" role="status" aria-live="off">
        <span class="amiga-telemetry-label">ω</span>
        <span class="amiga-telemetry-value tabular-nums">{{ display }}</span>
        <span class="amiga-telemetry-unit">rad/s</span>
        <!-- A small bar that tracks the velocity magnitude (the decay() coast made
             legible at a glance — fills on a flick, drains as the glide settles). -->
        <span class="amiga-telemetry-bar" aria-hidden="true">
            <span
                class="amiga-telemetry-bar-fill"
                :style="{ transform: `scaleX(${barFraction})` }"
            ></span>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    /** The live angular speed (rad/s) — the composable's already-tracked value,
     *  sampled at a few Hz into a reactive ref by the scene (no second writer). */
    angularVelocity: number;
}>();

// The readout is a fixed-precision digit; the decay() coast bleeds it to 0.
const display = computed(() => props.angularVelocity.toFixed(2));

// The bar fills toward a calibrated full-scale (a confident hard flick lands
// ~12–20 rad/s; full-scale 20 keeps the bar legible across the range).
const FULL_SCALE = 20;
const barFraction = computed(() =>
    Math.min(1, Math.max(0, props.angularVelocity / FULL_SCALE)),
);
</script>

<style scoped>
/* A quiet instrument readout pinned to the stage corner, in the demo's mono
   telemetry register (the same idiom as the easing curve-physics + the square's
   telemetry strip). pointer-events:none — the gesture passes through. */
.amiga-telemetry {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: var(--z-content, 2);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-sm, 0.375rem);
    background: color-mix(in srgb, var(--background) 70%, transparent);
    backdrop-filter: blur(4px);
    border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    font-family: var(--font-mono);
    font-size: var(--type-admin-label, 0.75rem);
    color: var(--muted-foreground);
    pointer-events: none;
    user-select: none;
}
.amiga-telemetry-label {
    color: var(--ball-tone, var(--rainbow-red, var(--primary)));
    font-weight: 600;
}
.amiga-telemetry-value {
    color: var(--foreground);
    min-inline-size: 3.2ch;
    text-align: right;
}
.amiga-telemetry-unit {
    opacity: 0.7;
}
.amiga-telemetry-bar {
    inline-size: 3rem;
    block-size: 0.35rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--foreground) 10%, transparent);
    overflow: hidden;
}
.amiga-telemetry-bar-fill {
    display: block;
    block-size: 100%;
    inline-size: 100%;
    transform-origin: left center;
    background: var(--ball-tone, var(--rainbow-red, var(--primary)));
    /* The fill follows the engine's decay() value via the reactive scaleX; a
       short transition smooths the few-Hz sample into a continuous drain. */
    transition: transform 0.12s linear;
}
@media (prefers-reduced-motion: reduce) {
    .amiga-telemetry-bar-fill {
        transition: none;
    }
}
</style>
