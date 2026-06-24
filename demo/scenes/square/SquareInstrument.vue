<template>
    <!-- ── L.W11 S4 — the draughtsman's instrument layer (colocated) ──
         The square is a true 2-axis space (nx,ny ∈ [-1,1]); this sub-unit draws
         the coordinate field (a centred crosshair + quarter-tick frame), the
         rubber-band TETHER (spring math made physical — an SVG line home→box
         bowed by the live deflection, in the red motion-authority), the telemetry
         strip (serif title + accent x/y readout + settled/tracking badge), and
         the axis legend. All are DERIVED READS of the spring state SquareScene
         feeds as props — no second writer, no second rAF. -->
    <div class="square-field" aria-hidden="true"></div>

    <svg
        class="square-tether"
        :class="{ 'square-tether--active': tetherActive }"
        aria-hidden="true"
        preserveAspectRatio="none"
    >
        <path class="square-tether-line" :d="tetherPath" />
    </svg>

    <div class="square-telemetry" aria-hidden="true">
        <span class="text-display square-telemetry-title leading-none">Transform</span>
        <div class="square-telemetry-axes">
            <span class="text-mono-small text-muted-foreground">x</span>
            <span class="readout-accent text-mono-small tabular-nums">{{ readoutX }}</span>
            <span class="text-mono-small text-muted-foreground">y</span>
            <span class="readout-accent text-mono-small tabular-nums">{{ readoutY }}</span>
        </div>
        <span
            class="status-badge text-admin-label px-2 py-0.5 rounded-full"
            :class="settled ? 'settled-badge' : 'tracking-badge'"
        >{{ settled ? "settled" : "tracking" }}</span>
    </div>

    <div class="square-legend" aria-hidden="true">
        <span class="text-mono-caption text-muted-foreground">x · y ∈ [-1, 1]</span>
        <span
            v-if="tumbleHintShown"
            class="text-mono-caption text-muted-foreground square-legend-hint"
        >double-click to tumble</span>
        <!-- P.W6 — the envelope-tour egg's discoverability whisper (revealed on
             the same first-settle disclosure as the tumble hint). Focus the box,
             press C → the spring tours the [-1,1]² travel envelope. -->
        <span
            v-if="tumbleHintShown"
            class="text-mono-caption text-muted-foreground square-legend-hint"
        >press C to trace the field</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    /** The live normalized deflection (-1..1) per axis. */
    deflX: number;
    deflY: number;
    /** The spring's settled state (drives the telemetry badge). */
    settled: boolean;
    /** Whether the tether is visible (a drag in flight / springs un-settled). */
    tetherActive: boolean;
    /** The formatted x/y readouts (the aria-coupled telemetry numerals). */
    readoutX: string;
    readoutY: string;
    /** Whether the progressive tumble hint has been disclosed. */
    tumbleHintShown: boolean;
}>();

// The home crosshair → box-centre tether, bowed by the live deflection. The SVG
// user space is 0..100 (preserveAspectRatio="none"); home is the centre (50,50)
// and the box centre deflects by ±TETHER_REACH user units at full travel. The
// control point bows the line perpendicular to the pull (a slingshot, not a
// ruler). PRM snaps the FADE off in CSS; the geometry is unchanged.
const TETHER_REACH = 38;
const tetherPath = computed(() => {
    const hx = 50;
    const hy = 50;
    const bx = 50 + props.deflX * TETHER_REACH;
    const by = 50 + props.deflY * TETHER_REACH;
    const mx = (hx + bx) / 2;
    const my = (hy + by) / 2;
    const dx = bx - hx;
    const dy = by - hy;
    const len = Math.hypot(dx, dy) || 1;
    const bow = Math.min(len * 0.18, 8);
    const cx = mx + (-dy / len) * bow;
    const cy = my + (dx / len) * bow;
    return `M ${hx} ${hy} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`;
});
</script>

<style scoped>
/* ── L.W11 S4 — the draughtsman's coordinate field (the missing axes) ──
   A centred crosshair (the (0,0) home) + faint quarter-tick frame, drawn in the
   shared --border hairline language. Pure background-image gradients — the static
   structure the glass plate finally refracts against on THIS stage. */
.square-field {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(
            to right,
            transparent calc(50% - 0.5px),
            color-mix(in srgb, var(--border) 70%, transparent) calc(50% - 0.5px),
            color-mix(in srgb, var(--border) 70%, transparent) calc(50% + 0.5px),
            transparent calc(50% + 0.5px)
        ),
        linear-gradient(
            to bottom,
            transparent calc(50% - 0.5px),
            color-mix(in srgb, var(--border) 70%, transparent) calc(50% - 0.5px),
            color-mix(in srgb, var(--border) 70%, transparent) calc(50% + 0.5px),
            transparent calc(50% + 0.5px)
        );
}
.square-field::before {
    content: "";
    position: absolute;
    inset: 12.5%;
    background-image:
        repeating-linear-gradient(
            to right,
            color-mix(in srgb, var(--border) 30%, transparent) 0 1px,
            transparent 1px 25%
        ),
        repeating-linear-gradient(
            to bottom,
            color-mix(in srgb, var(--border) 30%, transparent) 0 1px,
            transparent 1px 25%
        );
}

/* ── L.W11 S4 — the rubber-band TETHER (spring math made physical) ──
   An SVG line home-crosshair → box-centre, bowed by the live deflection, drawn
   in the red motion-authority at low alpha. Hidden at rest; fades in while the
   gesture is live / the springs un-settled. */
.square-tether {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--duration-fast, 160ms) var(--ease-standard, ease);
    overflow: visible;
}
.square-tether--active {
    opacity: 1;
}
.square-tether-line {
    fill: none;
    stroke: var(--color-progress);
    stroke-width: 0.8;
    stroke-linecap: round;
    opacity: 0.45;
    vector-effect: non-scaling-stroke;
}

/* ── L.W11 S4 — the instrument telemetry strip (TYPOGRAPHY register) ──
   Top-left: serif title + accent x/y readout + settled/tracking badge. Asymmetric
   chrome around the centred subject — the instrument-plate composition. */
.square-telemetry {
    position: absolute;
    top: 1rem;
    left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    pointer-events: none;
    z-index: var(--z-content);
}
.square-telemetry-title {
    color: var(--foreground);
    opacity: 0.92;
}
.square-telemetry-axes {
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0.15rem 0.45rem;
    align-items: baseline;
}

.square-legend {
    position: absolute;
    bottom: 1rem;
    right: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.15rem;
    pointer-events: none;
    z-index: var(--z-content);
}
.square-legend-hint {
    opacity: 0.8;
}

@media (prefers-reduced-motion: reduce) {
    .square-tether {
        transition: none;
    }
}
</style>
