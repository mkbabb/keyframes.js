<template>
    <!-- ── L.W11 S4 — the draughtsman's instrument layer (colocated) ──
         The square is a true 2-axis space (nx,ny ∈ [-1,1]); this sub-unit draws
         the coordinate field (a centred crosshair + quarter-tick frame), the
         rubber-band TETHER (spring math made physical — an SVG line home→box
         bowed by the live deflection, in the motion-authority VIOLET), the
         telemetry strip (serif title + accent x/y readout + settled/tracking
         badge), and the axis legend. All are DERIVED READS of the spring state
         SquareScene feeds as props — no second writer, no second rAF. -->
    <!-- X.KF.W13X · UIA-KF-088 — ONE IDIOM CLASS PER LAYER. Both classes write
         `background-image`, so on one element the later rule (`-x`) won and the
         "2-axis" field drew only its vertical lines. Two stacked layers compose
         the published idiom as it is, both axes drawn. UIA-KF-090 — and the
         field IS the travel envelope, so its quarter lines are the [-1,1]
         coordinates the legend names, not quarters of the plate. -->
    <div class="square-field stage-field-x" aria-hidden="true"></div>
    <div class="square-field stage-field-y" aria-hidden="true"></div>

    <svg
        class="square-tether"
        :class="{ 'square-tether--active': tetherActive }"
        :style="{ '--tether-travel': travel }"
        aria-hidden="true"
    >
        <path class="square-tether-line" :d="tetherPath" />
    </svg>

    <!-- X-DS pass 16 (KF-C20-01) — the telemetry strip (the ONE
         SceneStageHeader) left this layer for the plate's own header row
         (SquareScene.vue), so the field is measured below it. -->

    <!-- X-DS pass 15 (KF-C19-03) — the caption is a RESTING instruction, so
         it shows only while the scene reads settled: on a tour leg toward
         y = +1 the box overhangs the field by half its size and ran under these
         lines, muted text printed across the subject's fill. -->
    <div class="square-legend" :data-resting="settled ? '' : undefined" aria-hidden="true">
        <!-- T.A13 + T.B3 (fold row 69) — the stage caption naming the live
             interaction. The G2 collapse is CURED: Play now drives the box's
             honest four-corner tour (the editor panel RETURNED, editing a LIVE
             anim), while a drag hands the box to the springs (a jump-free
             takeover). This mono caption names those verbs. -->
        <span class="text-caption text-muted-foreground"
            >spring-chased &middot; drag the box, or press Play to tour it</span
        >
        <!-- X-DS pass 9 (KF-C9-01) — the case-preserving mono rung, so the
             legend's x · y match the header readout's (an eyebrow rung printed
             'X · Y'). -->
        <span class="text-mono-small text-muted-foreground tabular-nums">x &middot; y &isin; [-1, 1]</span>
        <!-- D-12/D-17 — "double-CLICK" named a mouse-only verb for a recogniser
             (`useDoubleTap`) that exists BECAUSE dblclick was touch-unreachable.
             C-6 — and each hint now has its own flag: one `tumbleHintShown`
             gated both eggs, so its name was false for the keyboard one and
             neither could disclose on its own modality's first settle. -->
        <span
            v-if="tumbleHintShown"
            class="text-caption text-muted-foreground square-legend-hint"
        >double-tap to tumble</span>
        <!-- P.W6 — the envelope-tour egg's discoverability whisper, disclosed on
             the first KEYBOARD settle (D-5: it used to ride a pointer-only flag,
             so the audience that can perform it never saw it). Focus the box,
             press C → the spring tours the [-1,1]² travel envelope. -->
        <span
            v-if="tourHintShown"
            class="text-caption text-muted-foreground square-legend-hint"
        >press C to trace the field</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * C-9 — THE DROP IS DECLARED NOW. This component has FOUR root nodes (the two
 * field layers · tether · legend; the telemetry left for the plate header,
 * X-DS pass 16), so Vue has no single element to fall attributes
 * through to and silently discards any the parent passes — latent today (the
 * sole call site passes declared props only) but silent, and Vue dev-warns the
 * moment it stops being latent. `inheritAttrs: false` states the behaviour
 * instead of leaving it to the fragment: the drop is intentional, and a future
 * consumer that needs an attribute on a specific root must bind `$attrs` to the
 * root it means rather than discovering the loss at runtime.
 *
 * D-9 (core) ≡ C-7 — `.square-live-caption` is GONE from the caption span above.
 * LAW A census before the delete: ONE occurrence tree-wide (that call site), no
 * rule in either producer's cascade, and — per the adjudication's own git
 * archaeology — no rule in ANY revision: the class was born orphaned at
 * `021f0eba`. No gate reads it (the `proof:square-honest` script that K-12
 * hypothesised as a reader no longer exists). The span keeps the two live
 * utilities that actually paint it (`text-caption text-muted-foreground`).
 */
defineOptions({ inheritAttrs: false });

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
    /** C-6 — one flag per egg. `tumbleHintShown` gated BOTH the pointer tumble
     *  and the keyboard envelope tour, so the prop name was false for one of
     *  them and neither could disclose on its own modality's first settle. */
    tumbleHintShown: boolean;
    tourHintShown: boolean;
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
/* ── D-7 + N-SQ-2 + N-SQ-3 — THE FIELD CONSUMES THE DEMO'S OWN IDIOM ──
   The coordinate field is the component's stated thesis ("the missing axes") and
   it was drawn at 1.19–1.95:1 against a 3:1 WCAG 1.4.11 floor — the crosshair at
   70 % of `--border`, the quarter ticks at 30 %.

   N-SQ-2 names the root cause: the file HAND-ROLLED a structure the demo already
   publishes. `.stage-field-x` / `.stage-field-y` (design-idioms.css) draw exactly
   this — 1 px quarter-mark gridlines on both axes, at FULL `var(--border)` — and
   already have three live consumers (SequenceAxis, SpringTarget ×2). The square
   re-authored them diluted, which is both a shadow duplication and the proximate
   cause of D-7's worst numbers. The cure the row orders is to consume the idiom,
   not to re-tune invented ones — so the field wears the two published classes
   (one per layer, X.KF.W13X · UIA-KF-088) and this file declares NO background
   of its own. (The idiom's own bare-`--border`
   contrast is banked at kf-SequenceAxis D-4, a shared-idiom row, and is not
   re-tuned per-site here.)

   N-SQ-3 dissolves with the duplicate: the tick frame was a
   `repeating-linear-gradient(… 0 1px, transparent 1px 25%)` on an `inset: 12.5%`
   pseudo-element, which ticked the OPENING edge of each quarter and clipped the
   closing one (asymmetric on both axes), and whose symmetric inset landed the
   50 % tick on the exact pixel of the parent's own crosshair — one of four ticks
   invisible under a stronger line. There is ONE authority (the idiom) for every
   line — one layer per axis: the idiom's 50 % marks ARE the (0,0) home
   crosshair, so nothing can swallow anything. */
.square-field {
    /* X.KF.W13X · UIA-KF-090 — the [-1,1]² envelope the box's centre travels
       (`--square-travel`, the registered length the springs read), centred on
       home, rather than the whole plate. */
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(2 * var(--square-travel, 110px));
    height: calc(2 * var(--square-travel, 110px));
    transform: translate(-50%, -50%);
    pointer-events: none;
}
/* X-DS pass 2 · KF-C2-05 — the field CLOSES on the right. `.stage-field-x`
   rules its quarter lines at 0/25/50/75% only (the idiom's opening-edge ticks;
   the spring rail, its other consumer, ends on its own dashed value-1 target,
   so the idiom itself stays open), and the y layer has its closing baseline:
   the square's x = +1 edge is this hairline, in the same `--border` ink.
   The quarters still divide the WHOLE envelope (border-box origin), so the
   50% line stays the home crosshair to the pixel. */
.square-field.stage-field-x {
    border-inline-end: 1px solid var(--border);
    background-origin: border-box;
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

/* X-DS pass 6 (KF-C6-06) — THE LEGEND IS THE FIELD'S CAPTION. It was
   end-aligned to the plate's corner, ~75 px below and ~200 px right of the
   field it describes, an unanchored line of text. It now stands directly under
   the field (`.square-field`: the [-1,1]² envelope, 2 × --square-travel,
   centred on home), spanning the field's inline edges and starting on its
   left edge, the way a figure's caption sits under its figure. */
.square-legend {
    position: absolute;
    top: calc(50% + var(--square-travel, 110px) + 0.75rem);
    left: calc(50% - var(--square-travel, 110px));
    width: calc(2 * var(--square-travel, 110px));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* D-15 — `0.15rem`/`0.45rem` are on NO published step, in a file consuming
       the Tailwind scale one line away. Both routed to the 0.25rem grid. (The
       row's other limb — a 1.67x "vertical rhythm" ratio — was killed at
       adjudication: the axes grid has four children in four explicit columns,
       so its row-gap never applied at all, and that half of the pair is gone
       with the shorthand.) */
    gap: 0.25rem;
    /* X-DS pass 16 (KF-C20-01) — the field narrowed below the header (312 px
       at 1440), so the caption balances its two lines rather than orphaning
       "tour it". */
    text-wrap: balance;
    pointer-events: none;
    z-index: calc(var(--z-content, 1) + 1);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-standard);
}
.square-legend[data-resting] {
    opacity: 1;
}
/* D-3 ≡ kf-SquareScene D-11 — the hint opacity is GONE. `opacity: 0.8` on
   `text-caption` (italic, 400, the 12 px floor) composited the light arm to
   ≈3.47–3.98:1 against a 4.5 floor, and NO plate luminance restores AA — the
   derivative runs the other way, so the failure is unconditional on plate tone.
   The single declaration was the whole failure: the sibling caption in the same
   colour at full opacity passes everywhere. */

@media (prefers-reduced-motion: reduce) {
    .square-tether,
    .square-legend {
        transition: none;
    }
}
</style>
