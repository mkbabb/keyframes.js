<template>
    <!-- ── L.W11 S4 — the draughtsman's instrument layer (colocated) ──
         The square is a true 2-axis space (nx,ny ∈ [-1,1]); this sub-unit draws
         the coordinate field (a centred crosshair + quarter-tick frame), the
         rubber-band TETHER (spring math made physical — an SVG line home→box
         bowed by the live deflection, in the motion-authority VIOLET), the
         telemetry strip (serif title + accent x/y readout + settled/tracking
         badge), and the axis legend. All are DERIVED READS of the spring state
         SquareScene feeds as props — no second writer, no second rAF. -->
    <div class="square-field" aria-hidden="true"></div>

    <svg
        class="square-tether"
        :class="{ 'square-tether--active': tetherActive }"
        :style="{ '--tether-travel': travel }"
        aria-hidden="true"
    >
        <path class="square-tether-line" :d="tetherPath" />
    </svg>

    <div class="square-telemetry" aria-hidden="true">
        <span class="text-display square-telemetry-title leading-none">Transform</span>
        <div class="square-telemetry-axes">
            <span class="text-mono-small text-muted-foreground tabular-nums">x</span>
            <span class="readout-accent text-mono-small tabular-nums">{{ readoutX }}</span>
            <span class="text-mono-small text-muted-foreground tabular-nums">y</span>
            <span class="readout-accent text-mono-small tabular-nums">{{ readoutY }}</span>
        </div>
        <span
            class="status-badge text-admin-label px-2 py-0.5 rounded-full"
            :class="settled ? 'settled-badge' : 'tracking-badge'"
        >{{ settled ? "settled" : "tracking" }}</span>
    </div>

    <div class="square-legend" aria-hidden="true">
        <!-- T.A13 + T.B3 (fold row 69) — the stage caption naming the live
             interaction. The G2 collapse is CURED: Play now drives the box's
             honest four-corner tour (the editor panel RETURNED, editing a LIVE
             anim), while a drag hands the box to the springs (a jump-free
             takeover). This mono caption names those verbs. -->
        <span class="square-live-caption text-caption text-muted-foreground"
            >spring-chased &middot; drag the box, or press Play to tour it</span
        >
        <span class="text-mono-caption text-muted-foreground tabular-nums">x &middot; y &isin; [-1, 1]</span>
        <span
            v-if="tumbleHintShown"
            class="text-caption text-muted-foreground square-legend-hint"
        >double-click to tumble</span>
        <!-- P.W6 — the envelope-tour egg's discoverability whisper (revealed on
             the same first-settle disclosure as the tumble hint). Focus the box,
             press C → the spring tours the [-1,1]² travel envelope. -->
        <span
            v-if="tumbleHintShown"
            class="text-caption text-muted-foreground square-legend-hint"
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
    /**
     * D-6 — the subject's px travel at full [-1,1] deflection, THE source of the
     * tether's geometry. `TETHER_REACH = 38` used to duplicate it (as a
     * percent-of-stage, with zero coupling) and the parent held `travel` and
     * passed it to nothing.
     */
    travel: number;
    /** The formatted x/y readouts (the aria-coupled telemetry numerals). */
    readoutX: string;
    readoutY: string;
    /** Whether the progressive tumble hint has been disclosed. */
    tumbleHintShown: boolean;
}>();

// ── D-1 + D-6 + D-16 + N-SQ-4 — THE TETHER IS DRAWN IN A FRAME THAT EXISTS ──
//
// D-1: the `<svg>` carried `preserveAspectRatio="none"` and NO user-space box
// attribute, so per SVG §7.7 the aspect attribute was inert and one user unit
// was one CSS px from
// the element's TOP-LEFT. The documented "0..100 user space" did not exist: home
// (50,50) was 50 px in from the plate's corner and the whole instrument rendered
// as an ≤38 px hairline up there — detached from a subject travelling ±110 px
// through the plate's centre, and buried under the telemetry that lives in that
// same corner. The demo's only SVG that got the idiom wrong.
//
// N-SQ-4 ORDERS THE CURE, and rules out the obvious one: declaring a 0 0 100 100
// user-space box beside the existing `preserveAspectRatio="none"` is a
// NON-CONFORMAL map, so the bow built perpendicular in user space
// (`(-dy/len, dx/len)` below) is
// not perpendicular after it — the mapped dot product is `dx·dy(sy²−sx²) ≠ 0` on
// any non-square stage — and `non-scaling-stroke` pins width, never direction.
// The sound cures are px space or derive-from-travel. This is both:
//
//   • the element is sized BY THE TRAVEL ENVELOPE — `2 × travel` px square,
//     centred on the stage (see `--tether-travel` in the stylesheet) — so with
//     no user-space box declared at all, one user unit is one CSS px,
//     uniformly, by construction. Nothing to measure, nothing to keep in sync.
//   • home is the viewport centre `(travel, travel)`, and full deflection lands
//     the box end exactly `travel` px away — the SAME number the subject moves.
//     D-6's `TETHER_REACH = 38` (a percent-of-stage duplicating a px constant
//     with zero coupling, whose endpoints coincided only at a 289.5 px square
//     stage — a size at which the 192 px box overruns the plate by 61 px, so the
//     agreement was never satisfiable) is gone; the parent's own `travel`, which
//     it already held and passed to nothing, is the prop.
//
// The control point bows the line perpendicular to the pull (a slingshot, not a
// ruler) — and now genuinely perpendicular, because the map is conformal. PRM
// snaps the FADE off in CSS; the geometry is unchanged.
const tetherPath = computed(() => {
    const reach = props.travel;
    const hx = reach;
    const hy = reach;
    const bx = reach + props.deflX * reach;
    const by = reach + props.deflY * reach;
    const mx = (hx + bx) / 2;
    const my = (hy + by) / 2;
    const dx = bx - hx;
    const dy = by - hy;
    const len = Math.hypot(dx, dy) || 1;
    // The bow scales with the pull and caps at a fraction of the envelope, so
    // the slingshot reads the same at any `travel` (the old `8` was 8 of 100
    // arbitrary units).
    const bow = Math.min(len * 0.18, reach * 0.2);
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
   in the motion-authority hue (`--color-progress` → `--accent-kf`, a VIOLET —
   the prose used to call it "the red motion-authority" for a token the demo
   deliberately repointed away from red, D-16). Hidden at rest; fades in while
   the gesture is live / the springs un-settled.

   D-1/N-SQ-4 — THE ELEMENT *IS* THE TRAVEL ENVELOPE. It used to be `inset: 0`
   (the whole plate) with the path drawn in a 0..100 user space that, with no
   user-space box, was just the first 100 px of the plate's corner. It is now a
   `2 × travel` px square centred on the stage, so one user unit is one CSS px
   uniformly and the path's own numbers ARE the subject's px. `--tether-travel`
   is the unitless px figure the component binds from its `travel` prop.

   N-SQ-7's premise is retired by this cure, not deleted: `overflow: visible`
   used to be inert (the element clipped at the same rect the stage did). The
   element is now SMALLER than the stage, so the round linecap at full
   deflection sits exactly on the edge — the declaration is load-bearing. */
.square-tether {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--tether-travel, 110) * 2px);
    height: calc(var(--tether-travel, 110) * 2px);
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--duration-fast, 200ms) var(--ease-standard, ease);
    overflow: visible;
}
.square-tether--active {
    opacity: 1;
}
/* D-16 — the stroke was 0.8 px at 0.45 alpha: a sub-pixel ghost compositing at
   1.85–2.47:1, under the 3:1 WCAG 1.4.11 floor every way round, on the
   component's own headline graphic. At px scale a 2 px stroke is a real
   hairline, and the hue is carried at near-full strength so the composite has
   the token's own contrast to work with (the measured ratio on the resolved
   plate stays an SS-13 pixel question). `vector-effect: non-scaling-stroke` is
   DELETED with the geometry that made it a no-op: nothing scales this element's
   user space any more, so the property described a transform that cannot
   happen. */
.square-tether-line {
    fill: none;
    stroke: var(--color-progress);
    stroke-width: 2;
    stroke-linecap: round;
    opacity: 0.9;
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
