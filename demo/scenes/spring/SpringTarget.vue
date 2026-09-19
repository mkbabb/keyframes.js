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
        class="spring-target relative flex flex-col items-center justify-center gap-8 h-full w-full px-6 lg:px-8 overflow-hidden"
    >
        <!-- Header readout.
             J.W7a S2 (D7 / TYP-2, SP-2) — the scene name lifts to the
             Instrument-Serif `text-display` rung (the display voice carried
             inward; cross-typography §3).
             J.W7a S2 (D8 / C3) + S3 (D14) — the live solver state promotes from
             one 12px muted caption to the published MetricBadge register: the
             headline x at the size="xl" audacious-poster rung wearing the scene
             accent (color → --ball-tone), the velocity as the quieter lg
             sibling. The NUMBER wins; the labels stay small muted mono. -->
        <!-- The header rows WRAP (flex-wrap): at 375w an unwrappable row would
             starve the serif title against the two metric badges — the reflow
             keeps every member legible (the D8 responsive behaviour). -->
        <!-- K.W4 S5 (U-K18) — the readout RE-TIERED: the PRIMARY datum (x, the
             live displacement that proves the engine runs) is promoted to the
             display-tier `.spring-readout-primary` audacious number wearing the
             scene accent; the SECONDARIES (v, settled) are DEMOTED to a quiet
             caption row. The former flat row gave x + v the SAME small MetricBadge
             size (the equal-weight inversion the user named); the re-tier moves
             the display weight to the one number that matters. -->
        <div class="flex w-full max-w-3xl flex-wrap items-end justify-between gap-3 gap-y-2 shrink-0">
            <div class="flex flex-col gap-1 min-w-0">
                <span class="text-display text-foreground truncate leading-none">
                    SpringProgress
                </span>
                <div class="flex items-baseline gap-2">
                    <span class="text-mono-small text-muted-foreground tabular-nums">x</span>
                    <span class="spring-readout-primary tabular-nums">{{ demo.liveValue.value.toFixed(3) }}</span>
                </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
                <span
                    class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                    :class="demo.liveSettled.value ? 'settled-badge' : 'tracking-badge'"
                >{{ demo.liveSettled.value ? "settled" : "tracking" }}</span>
                <span class="text-mono-caption text-muted-foreground tabular-nums">
                    v {{ demo.liveVelocity.value.toFixed(2) }}
                </span>
            </div>
        </div>

        <!-- The rail: tap/drag to re-seat the live target -->
        <div class="flex w-full max-w-3xl flex-col items-center justify-center gap-6">
            <!-- J.W7a S4 (D17 / C2) — the displacement rail carries the shared
                 `.stage-field-x` coordinate frame: vertical quarter ticks at
                 0.25/0.5/0.75 of the target axis (the curve canvas's --border
                 hairline language), so the re-seat gesture reads against a
                 graduated field, not blank glass. -->
            <div
                ref="railEl"
                class="spring-rail focus-ring relative w-full h-12 cursor-pointer select-none"
                :class="{ 'spring-rail--derby': demo.derbyActive.value }"
                role="slider"
                aria-label="Drag to re-seat the spring target"
                :aria-valuenow="Math.round(demo.target.value * 100)"
                aria-valuemin="0"
                aria-valuemax="100"
                tabindex="0"
                @pointerdown="onPointerDown"
                @keydown="onKeydown"
            >
                <!-- D-7/C-8 + D-16 — THE VALUE TRACK, inset inside the rail.
                     The rail is the GESTURE surface and the container-query
                     container; the TRACK is the value axis. It spans exactly
                     value 0 → value 1, so `.stage-field-x`'s quarter gridlines
                     mark TRUE value quarters and the groove's right edge IS the
                     target — the invariant the deleted comment below asserted
                     and the old geometry could not honour. The band either side
                     of the track is the reserved overshoot room. -->
                <div class="spring-track stage-field-x" :style="trackStyle">
                    <div class="progress-rail"></div>
                    <!-- The value=1 reference: the track's own right edge, a
                         quiet dashed rule. It marks the SCALE, and the record
                         that it is a scale is why it no longer carries the
                         settle pulse (D-2 — the pulse belongs on the thing that
                         actually settled, which is the marker below). -->
                    <div class="spring-target-line" aria-hidden="true"></div>
                </div>
                <!-- Ghost target marker (where the spring is chasing) — a
                     DISCRETE position (re-seat events), so it stays reactive.
                     C-5/N-8 — it rides `translateX(<cqw>)` like every other mark
                     on this rail (T.G4) instead of animating `left`: the drag
                     path wrote `left` on every pointermove and then READ
                     `getBoundingClientRect()` to project the next one, a forced
                     read-after-write reflow pair per pointer sample in the file
                     whose own painter law is "NO per-frame width read".
                     D-2 — and it carries the settle pulse, because the settle it
                     confirms is this marker's. -->
                <div
                    class="spring-target-marker settle-pulse"
                    :class="{ 'settle-pulse--fire': demo.liveSettled.value }"
                    :style="{ transform: `translateX(${railPct(demo.target.value)}cqw)` }"
                ></div>
                <!-- The live spring ball — positioned IMPERATIVELY by the
                     registered spring painter (J.W2 S5: direct style writes off
                     the Vue render graph; no reactive :style on the hot path). -->
                <div ref="liveBallEl" class="progress-ball spring-ball"></div>

                <!-- ── L.W11 S6 EGG — the four-lane DERBY overlay ──────────────
                     Double-click the rail and four SpringProgress solvers race
                     four RAINBOW LANES over a shared target line: bouncy (ζ=0.45)
                     rings PAST it, gentle (ζ=1.0) never crosses. Each lane wears
                     its sanctioned --spring-lane-* tone; the balls ride the live
                     `springLive.trackValues` (the engine's physics, painter-
                     positioned — inv ζ, no second rAF). Shown ONLY during the
                     race (`derbyActive`); the page rests as one calm red spring. -->
                <div
                    v-if="demo.derbyActive.value"
                    class="derby-lanes"
                    aria-hidden="true"
                >
                    <!-- m-6 — the `spring-lane-${lane.name}` class is GONE. It
                         matched no selector in either tree (LAW A census at this
                         seat: `grep -rn 'spring-lane-' demo` → the four TOKEN
                         names in useSpringDerby.ts and nothing else), while
                         reading exactly like the mechanism that delivers the lane
                         hue. The tone is, and only ever was, the inline
                         `--ball-tone` binding beside it. -->
                    <div
                        v-for="lane in demo.derbyLanes"
                        :key="lane.name"
                        class="derby-lane"
                        :style="{ '--ball-tone': lane.tone }"
                    >
                        <span class="derby-lane-rail"></span>
                        <span
                            :ref="(el) => setDerbyBallEl(lane.index, el)"
                            class="progress-ball derby-lane-ball"
                        ></span>
                        <span class="derby-lane-tag text-mono-caption tabular-nums">
                            {{ lane.name }} · ζ{{ lane.zeta.toFixed(2) }}
                        </span>
                    </div>
                </div>
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
                <!-- J.W7a S3 (D14 / CP-4) — the live sampled value wears the
                     scene accent; the label stays muted. -->
                <span class="readout-accent text-mono-caption tabular-nums">{{ demo.sampled.value.toFixed(3) }}</span>
            </div>
            <div class="sampler-track relative h-9">
                <!-- The sampler rides the SAME value axis as the rail above (one
                     map, one reading): its track is inset by the same reserved
                     overshoot band, so a sampled value of 1 lands under the rail's
                     value-1 rule rather than at a different x. -->
                <div class="spring-track stage-field-x" :style="trackStyle">
                    <div class="progress-rail"></div>
                </div>
                <!-- The sampler ball — painter-positioned (J.W2 S5, as above). -->
                <div ref="samplerBallEl" class="progress-ball sampler-ball"></div>
            </div>
        </div>

        <!-- ── L.W11 S6 — the linear() 26-stop PLOT (the curve drawn, beside its
             string). The parse + draw lives in the colocated SpringTrace sub-unit
             (the natural concern seam); it reads the live (response, ζ) so the
             trace re-plots as the sliders move. -->
        <SpringTrace
            :response="demo.response.value"
            :damping-fraction="demo.dampingFraction.value"
        />
    </Card>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { inject, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { clamp } from "@mkbabb/value.js/math";
import { useDragScrub } from "@composables/useDragScrub";
import { useDoubleTap } from "@composables/useDoubleTap";
import { SPRING_DEMO_KEY } from "./springKeys";
import SpringTrace from "./SpringTrace.vue";

const demo = inject(SPRING_DEMO_KEY)!;

// S.G3 S2 — the derby is POINTER-based double-tap now (touch parity; never native
// `dblclick`, which mobile browsers do not synthesize reliably). A discovered
// double-tap gesture egg (the on-stage legend layer was retired at T.M — VERDICT #8).

const railEl = useTemplateRef<HTMLElement>("railEl");
const liveBallEl = useTemplateRef<HTMLElement>("liveBallEl");
const samplerBallEl = useTemplateRef<HTMLElement>("samplerBallEl");

// ── M-2 · D-7/C-8 — THE RAIL'S VALUE AXIS, ONE MAP FOR EVERY MARK ────────────
//
// The banked defects, and why one geometry answers both.
//
//   M-2: the PROTAGONIST ball was painted UNCLAMPED —
//   `translateX(${live.value * 100}cqw)` — while both its siblings in the very
//   same closure clamped. The engine documents the overshoot it was painting
//   (peak ≈ 1.205 at ζ 0.45) and ζ is user-writable to 0.2 from the facet
//   slider and to 0.45 by one preset click, so this was not a theoretical tail.
//
//   D-7/C-8: and a clamp alone would have been the WRONG cure, because the
//   overshoot is the scene's thesis. The old axis mapped value 0→1 onto the
//   rail's full inline size, so ANY ring past 1 travelled off the plate.
//
// D-19 GEOMETRY RE-DERIVATION at this unit's open sha (`ba12b2ba`), before the
// cure, because the banked figures are not this clock's:
//   · 375w: viewport 375 − SpringScene's own px-6 (48) = 327 Card border box;
//     Card content box = 327 − its own px-6 (48) = **279** (ruling 14's frame).
//   · the ball is 36px anchored `left: 0; margin-left: -18px`, so at value v its
//     box is [279v − 18, 279v + 18]; `overflow-hidden` clips at the Card's
//     PADDING edge, 279 + 24 = 303.
//   · v = 1 → [261, 297]: fits. v = 1.18 → [311, 347]: **44px off the plate.**
//   · and the failure is width-dependent in the wrong direction: at the lg
//     measure (max-w-3xl, 768) the same 1.18 is **124px** off the plate, so no
//     fixed px reserve can hold a FRACTIONAL overshoot. The axis has to carry it.
//
// THE DECISION (written before the patch): the rail RESERVES the overshoot band
// at both ends of its own inline size, and every mark on the rail reads value
// space through ONE map. The clamp is then an explicit ALLOWANCE — the same
// 0.18 the derby lanes already declare, above the engine's worst documented peak
// — and not the silent [0, 1] truncation M-2 convicts. A clamped ball is inside
// the plate at EVERY width by construction, so the clip limb dies with it.
const OVERSHOOT_ALLOWANCE = 0.18;
const RAIL_SPAN = 1 + 2 * OVERSHOOT_ALLOWANCE;

/** Value space → the rail's own 0-100 axis. The ONE map; nothing paints without it. */
const railPct = (v: number): number =>
    ((clamp(v, -OVERSHOOT_ALLOWANCE, 1 + OVERSHOOT_ALLOWANCE) + OVERSHOOT_ALLOWANCE) /
        RAIL_SPAN) *
    100;

/** The rail's 0-1 pointer ratio → value space (`railPct`'s inverse). */
const railValue = (ratio: number): number => ratio * RAIL_SPAN - OVERSHOOT_ALLOWANCE;

/** The value TRACK: value 0 → value 1, inset inside the rail by the reserved
 *  band. `.stage-field-x`'s quarter gridlines ride this element, so they mark
 *  true value quarters (D-16's field stays honest under the new axis). */
const trackStyle = {
    left: `${railPct(0)}%`,
    right: `${100 - railPct(1)}%`,
};

// ── L.W11 S6 — the four DERBY LANE balls (painter-positioned) ────────────────
// Each lane ball reads the live `springLive.trackValues[index]` directly (the
// engine's physics, off the Vue render graph) and rides the SAME `railPct` map,
// so "bouncy rings PAST the line, gentle never crosses" is a reading of one axis
// rather than four separately-bounded ones.
const derbyBallEls: (HTMLElement | null)[] = [];
const setDerbyBallEl = (i: number, el: Element | ComponentPublicInstance | null) => {
    // m-10 — `el as HTMLElement` turned the file's only cast from known-narrow
    // into unchecked: a future component-ref edit here would throw INSIDE the
    // 60 Hz painter. `instanceof` is the honest narrowing and costs one check
    // per ref callback, not per frame.
    derbyBallEls[i] = el instanceof HTMLElement ? el : null;
};

// ── J.W2 S5 (DS-3) — the spring painters: DIRECT non-reactive `style` writes ──
// Registered with the demo's loop seam; called imperatively each frame with the
// live snapshot. The hot positional path leaves the Vue render graph (the
// former 17-refs/frame reactive storm is gone — the balls move, nothing
// re-renders); the readout numerals above stay reactive at the few-Hz cadence.
let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const live = demo.springLive;
        // T.G4 — position by `transform: translateX(<cqw>)`, NEVER `left`. Animating
        // `left` re-LAYS-OUT every frame (the born-RED spring layout thrash); a
        // `translateX` composites on the GPU with zero layout. `cqw` = 1% of the
        // nearest container's inline size (the rail/track/lane carry
        // `container-type: inline-size`), so the value axis stays rail-relative with
        // NO per-frame width read (the AnimationVisualizer/easing transform idiom).
        // M-2 — the protagonist rides the SAME map as its siblings. `railPct`
        // carries the clamp, so the allowance is stated once and the three balls
        // can no longer disagree about what the axis means.
        if (liveBallEl.value) {
            liveBallEl.value.style.transform = `translateX(${railPct(live.value)}cqw)`;
        }
        if (samplerBallEl.value) {
            samplerBallEl.value.style.transform = `translateX(${railPct(live.sampled)}cqw)`;
        }
        // L.W11 S6 — position the four derby-lane balls from the live tracker
        // values (the live lanes remain relaxed so the bouncy lane visibly rings
        // PAST the target line — the overshoot is the point). Painter-positioned,
        // the SAME hot path; no second writer, no second rAF (inv ζ).
        const trackValues = live.trackValues;
        for (let i = 0; i < derbyBallEls.length; i++) {
            const el = derbyBallEls[i];
            if (el) {
                el.style.transform = `translateX(${railPct(trackValues[i] ?? 0)}cqw)`;
            }
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
        // The projector inverts the ONE axis map: a pointer in either reserved
        // band reads as −0.18 / 1.18 and `demo.reseat` clamps it to [0, 1]. The
        // bands are overshoot ROOM, not target space, and the valuetext says so.
        return railValue((e.clientX - rect.left) / rect.width);
    },
    onScrub: (ratio) => demo.reseat(ratio),
});

// S.G3 S2 — the reliable-primitive double-tap on the rail launches the derby (the
// touch parity for the former `@dblclick`; drag-disjoint — a scrub never triggers
// it). The SAME path serves mouse, pen, and touch.
useDoubleTap({
    el: railEl,
    onDoubleTap: () => {
        demo.derby();
    },
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
/* J.W7a S3 (D11 / CP-1) — the scene's ONE colour consumer. The spring icon's
   rest dot IS the progress green (spring.svg → --rainbow-green family), so the
   tone seam binds EXPLICITLY to the canonical --color-progress: the already-
   consistent identity is now a declared fact the clause-a oracle reads, not an
   accident of the idiom default (cross-color-pops §5.1). */
.spring-target {
    --ball-tone: var(--color-progress);
}

/* ── K.W4 S5 (U-K18) — the PRIMARY readout, display-tier ──
   The live displacement x is the one number that proves the engine runs; it
   gets the audacious-poster register (the missing display-type IN the pane),
   wearing the scene accent (the cascaded --ball-tone), while v + the settled
   badge demote to a quiet caption column. The former flat row gave x and v the
   SAME small MetricBadge size (the equal-weight inversion U-K18 named). */
.spring-readout-primary {
    font-size: clamp(2.25rem, 6cqi, 3.25rem);
    /* T.D2 (RULED #24) — the `650` magic weight dies: weights step the ladder
       (100-multiples only); the readout numeral reads the semibold token. */
    font-weight: var(--font-weight-semibold, 600);
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--ball-tone, var(--color-progress));
    font-variant-numeric: tabular-nums;
}

.spring-rail,
.sampler-track {
    /* T.G4 — the balls ride `translateX(<cqw>)`; `cqw` resolves against the nearest
       inline-size container, so the rail/track ARE that container (the value axis
       stays rail-relative with no per-frame width read).
       m-7 — the `display: flex; align-items: center` that used to head this rule
       is GONE. Every child of both elements is absolutely positioned with both
       axes resolved (`.progress-rail` top/left/width, `.progress-ball` top +
       margin-top, `.spring-target-marker` top + margin-top, `.spring-track`
       inset, `.derby-lanes` inset) — a flex container with no in-flow children
       lays nothing out. Only `container-type` was ever load-bearing here. */
    container-type: inline-size;
}

/* ── D-7/C-8 · D-16 — THE VALUE TRACK ──
   The rail element is the gesture surface and the container-query container; THIS
   is the value axis, inset by the reserved overshoot band at both ends (its inline
   offsets are bound from the one `railPct` map, so the band is stated in exactly
   one place). Value 1 is therefore the track's own right edge — which is what the
   scene's prose claimed all along and the old full-width geometry could not
   deliver — and `.stage-field-x`'s quarter gridlines, riding this element, mark
   true value quarters. */
.spring-track {
    position: absolute;
    top: 0;
    bottom: 0;
    pointer-events: none;
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
    /* C-5/N-8 — the marker is ANCHORED at the rail's left edge and carried by
       `translateX(<cqw>)` like every other mark (T.G4). It used to animate `left`
       on the every-pointermove drag path — three lines below the file's own law
       against exactly that — and the projector then read `getBoundingClientRect()`
       on the next sample, a forced read-after-write reflow pair per pointer event. */
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    border-radius: var(--radius-pill);
    /* J.W7a S3 (D11) — the ghost marker reads the tone seam (a no-op for
       spring, whose tone IS the canonical green; the rule stays seam-coherent). */
    border: 2px dashed color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent);
    pointer-events: none;
    /* N-3 — this transition finally has a WRITER: the settle pulse below moves
       this border's colour. It was dead CSS (no rule, state class or binding ever
       changed the marker's border colour) for as long as the pulse lived on the
       fixed target line instead. */
    transition: border-color var(--duration-fast) ease;
}

/* J.W7a S1 (D4 / SP-1) — the live ball IS the scene's protagonist and takes
   the idiom-default --ball-size (36px) + full canonical glow: at the former
   1.75rem it "read as a footnote" against the vast glass plate. The h-12 rail
   row seats the 36px ball with breathing room; the quiet sampler below keeps
   its small translucent rung so the hierarchy (protagonist > sampler) is
   legible at a glance. */
/* THE T.G4 ANCHOR, written ONCE for this scene's balls (m-8, riding KF-AV-10).
   The same three declarations were re-authored at every ball in this file: the
   ball is anchored at the rail's LEFT EDGE and its own painter carries the
   position with `translateX(<cqw>)` — compositor-only, no layout. They are one
   rule now rather than three copies that must be kept in step by hand.

   What the consolidation deliberately does NOT do (kf-EasingTarget P-2): claim
   `transform`. The idiom leaves it unclaimed BY DESIGN — `margin-top` centres
   the ball and `translateY(-50%)` centres the rail that nothing paints — and a
   tidy-up that "unified" the two would drop every ball out of its rail. The
   anchor is the x-half of that same asymmetry, so it is homed and no more. */
.spring-ball,
.sampler-ball,
.derby-lane-ball {
    left: 0;
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: transform;
}

.sampler-ball {
    --ball-size: 1.25rem;
    --ball-glow: 0%; /* the sweep sampler is a quiet translucent marker, no glow */
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 65%, transparent);
}

/* ── D-2 — THE VALUE=1 REFERENCE, AND WHAT IT IS NOT ──
   This rule used to carry the settle confirmation, and that was the defect. The
   line is pinned to one end of the axis; the TARGET is user-mutable (`reseat`
   accepts any ratio, the arrow/Home/End keys move it, and the derby used to end
   every race at 0). So the instrument's "locked" flash fired at a coordinate the
   spring may never have visited — on the scene's headline feature, every time.
   The line is now what it can honestly be: the value=1 SCALE reference at the
   track's own right edge. The settle pulse moved to the marker, which is the mark
   that knows where the field actually came to rest. */
.spring-target-line {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0;
    border-right: 2px dashed color-mix(in srgb, var(--color-progress) 35%, transparent);
    pointer-events: none;
}
/* The settle-pulse resting state (no flash); `--fire` plays the one pulse.
   N-7 — the `160ms` fallback is GONE from all three of this file's sites: it
   encoded a figure 25% off the real `--duration-fast` (0.2s at the installed
   pin), so the day the token went missing the file would have silently animated
   at a speed nothing in the system uses. A token this file cannot render without
   is not a place for a guess. */
.settle-pulse {
    transition: border-color var(--duration-fast) ease;
}
.settle-pulse--fire {
    animation: spring-settle-pulse 220ms var(--ease-standard, ease) 1;
}

/* `.spring-rail--derby` — the rail's racing state (the four-lane overlay is
   shown; the live rail recedes slightly so the lanes read as the foreground). */
.spring-rail--derby .progress-rail,
.spring-rail--derby .spring-ball,
.spring-rail--derby .spring-target-marker {
    opacity: 0.35;
    transition: opacity var(--duration-fast) ease;
}
@keyframes spring-settle-pulse {
    0% {
        border-color: var(--ball-tone, var(--color-progress));
        filter: drop-shadow(0 0 4px color-mix(in srgb, var(--ball-tone, var(--color-progress)) 60%, transparent));
    }
    100% {
        border-color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent);
        filter: none;
    }
}

/* ── L.W11 S6 — the four-lane DERBY overlay ──
   Four stacked rainbow lanes that appear ONLY during the race (derbyActive). Each
   lane wears its sanctioned --spring-lane-* tone (consumed via --ball-tone — the
   .progress-ball idiom keys on it), with a small ζ tag. The bouncy lane's ball
   rings PAST the target line (the painter's relaxed clamp); the gentle lane never
   crosses. Absolutely overlaid on the rail region; fades in/out. */
.derby-lanes {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    gap: 0.35rem;
    padding: 0.25rem 0;
    pointer-events: none;
    z-index: var(--z-content);
    animation: derby-fade-in 220ms var(--ease-standard, ease) 1;
}
.derby-lane {
    position: relative;
    height: 0.9rem;
    /* D-7/C-8 — THE TAG GETS ITS OWN GUTTER. `.derby-lane-tag` is painted last at
       `right: 0`, which is exactly the region a WINNING ball occupies: the lane's
       payload was occluded by the lane's own label. The lane now reserves a
       trailing gutter, the track ends where the gutter starts, and because
       `container-type: inline-size` measures the CONTENT box the ball's `cqw`
       axis ends there too — the ball cannot reach the tag at any width, rather
       than merely usually missing it. */
    --derby-tag-gutter: 6.25rem;
    padding-inline-end: var(--derby-tag-gutter);
    /* T.G4 — the lane ball rides `translateX(<cqw>)`; the lane is its inline-size
       container. (No flex here: every child is absolutely positioned.) */
    container-type: inline-size;
}
.derby-lane-rail {
    position: absolute;
    left: 0;
    right: var(--derby-tag-gutter);
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 22%, transparent);
}
.derby-lane-ball {
    --ball-size: 0.8rem;
    --ball-glow: 30%;
    position: absolute;
    top: 50%;
    margin-top: calc(var(--ball-size) / -2);
    /* the T.G4 anchor (left / margin-left / will-change) rides the shared rule above */
    /* the phosphor afterglow in the lane hue */
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent));
}
/* KF-SS-5 / D-4 — THE LANE TAGS READ AA. The old mix was 90% lane tone against
   the near-black foreground at `opacity: 0.85`; composited over the light plate
   that is ≈1.92:1 for snappy (this corpus's worst figure) against a 4.5:1 floor,
   with all four lanes failing in light theme. The repo already owns the solved
   form — `.status-badge`'s AA-CONTRAST mix, documented load-bearing and consumed
   correctly by this same file 400 lines above — so this is a regression, not a
   hard problem: adopt the badge's 50% push toward `--foreground` and drop the
   opacity composite, which per the adjudicated arithmetic is the ONLY step in the
   chain that lowered contrast (the mix itself RAISES it). The tag stays tinted;
   it stops being decoration pretending to be a label. Exact in-situ figures over
   the live glass plate remain SS-13's to photograph. */
.derby-lane-tag {
    position: absolute;
    right: 0;
    top: 50%;
    width: var(--derby-tag-gutter);
    transform: translateY(-50%);
    color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, var(--foreground));
    /* N-2 / MM-29 — the `text-transform: none` patch was known and incomplete:
       `text-mono-caption` also carries `letter-spacing: var(--type-tracking-caps)`
       (0.1em), so 0.1em CAPS tracking rode on lowercase lane names. Both halves
       of the utility are answered now, in one place. */
    text-transform: none;
    letter-spacing: normal;
}

@keyframes derby-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .settle-pulse--fire {
        animation: none;
    }
    .derby-lanes {
        animation: none;
    }
}
</style>
