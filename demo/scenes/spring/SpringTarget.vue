<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         A standard, NON-cartoon glass `<Card>` (the protagonist plate;
         `tier="resting" surface="glass"`, rounded-card by construction → I4 for
         free). The control PANELS stay cartoon+quiet (W2/W9). Dock-band
         containment is the surviving [stage]-track `.stage-cell` PRIMITIVE (the
         G8 LAYOUT half survives; the surface half reverses). `shadow={false}`:
         the plate reads cleaner without a nested shadow (FORK I5-shadow). The
         `max-w-3xl` rides the content column as an optical reading measure. -->
    <!-- D-11 — THE COLUMN HAD NO OVERFLOW STRATEGY AT ALL: inline padding,
         `overflow-hidden`, and `justify-center`, which under compression clips at
         BOTH ends and leaves neither recoverable — the readout and the plot go
         first, and no scroll can reach them. The vertical axis becomes scrollable
         and the horizontal stays clipped (a legal, non-degenerate pairing: the
         `visible` computes-to-`auto` rule needs one side to be `visible`, and
         neither is). `justify-content: safe center` is the other half: plain
         `center` is what makes an overflowing flex column unreachable at its
         start edge. Horizontal clipping stays ON deliberately — the value axis
         now reserves its own overshoot room, so nothing legitimately paints
         outside this box.
         X-DS pass 1 (KF-P1-18) — `py-4`: the stage header takes a top inset
         (the Transform stage's own); with the figure filling the card's free
         height the title sat flush against the card's top border. -->
    <Card
        :shadow="false"
        class="spring-target relative flex flex-col items-center gap-8 h-full w-full px-6 lg:px-8 py-4 overflow-x-hidden overflow-y-auto"
        :class="{ 'spring-target--live': isLive, 'spring-target--sweeping': demo.isPlaying.value }"
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
        <!-- D-6 — THE SCENE HAD NO HEADING, NO LANDMARK AND NO ACCESSIBLE NAME
             ANYWHERE (a grep for one returned zero across all seven files), while
             the sibling at the identical structural rung is fully semantic —
             `<header>` + `<h2>` on the same utilities (EasingTarget). That is an
             intra-repo divergence, not a house style, so the house's own shape is
             adopted: the scene name was already rendered at the display rung in a
             bare `<span>`; it becomes the heading it was drawn as. -->
        <!-- X.KF.W13X.sections (A2-KE-L1-8) — the stage header is the ONE
             SceneStageHeader: the title is its glass section title, the badge
             (D-14: the region that publishes settled ↔ tracking, flipping only
             on a discrete transition) is its `status`, authored once there. -->
        <SceneStageHeader
            title="Spring"
            :status="stateLabel"
            class="spring-header flex w-full max-w-3xl flex-wrap items-end justify-between gap-3 gap-y-2 shrink-0"
            title-class="whitespace-nowrap leading-none"
            id-class="flex flex-col gap-1 min-w-0"
            aside-class="flex flex-col items-end gap-1 shrink-0"
        >
            <template #readouts>
                <!-- X.KF.W13V.y (OA-51; DESIGN-NOTE N-3 · N-6) — the title is the
                     thing measured in plain words; the ball's position is the
                     stage's ONE primary readout, everything else is muted. -->
                <div class="flex items-baseline gap-2">
                    <span class="text-small text-muted-foreground">position</span>
                    <span class="spring-readout-primary tabular-nums" data-readout="primary">{{ demo.liveValue.value.toFixed(3) }}</span>
                </div>
            </template>
            <template #aside>
                <!-- X-DS pass 4 (KF-C4-08) — position's peer readout wears the
                     same anatomy: a sans muted label and a Fira Code tabular
                     value, one rung below position (it was one fused mono
                     string, so the pair read as a headline and a footnote).
                     N-2 — the label is lowercase and transform-free, so it
                     never renders as "V". -->
                <div class="flex items-baseline gap-2">
                    <span class="text-small text-muted-foreground">velocity</span>
                    <span class="spring-readout-secondary">{{ demo.liveVelocity.value.toFixed(2) }}</span>
                </div>
            </template>
        </SceneStageHeader>

        <!-- X.KF.W13X.sq+dh (§0dz, addendum (e)) — THE SUBJECT: the spring's
             response as ONE figure (the target rail it chases on, then the
             plotted trace its balls ride), filling the card's remaining height.
             It was four stacked equal-weight blocks (rail, verbs, a stray
             sweep-readout row, a 128 px plot), so a reading eye found no
             primary; the sweep readout now sits in the trace's one legend
             line, subordinate. -->
        <figure class="spring-figure m-0 flex w-full max-w-3xl min-h-0 flex-1 flex-col gap-6" data-subject>
        <!-- The rail: tap/drag to re-seat the live target -->
        <div class="flex w-full flex-col items-center justify-center gap-6">
            <!-- J.W7a S4 (D17 / C2) — the displacement rail carries the shared
                 `.stage-field-x` coordinate frame: vertical quarter ticks at
                 0.25/0.5/0.75 of the target axis (the curve canvas's --border
                 hairline language), so the re-seat gesture reads against a
                 graduated field, not blank glass. -->
            <div
                ref="railEl"
                class="spring-rail kf-focus-ring relative w-full h-12 cursor-pointer select-none"
                :class="{
                    'spring-rail--derby': demo.derbyActive.value,
                    'spring-rail--dragging': dragging,
                }"
                role="slider"
                aria-label="Spring target"
                :aria-valuenow="Number(demo.target.value.toFixed(2))"
                aria-valuemin="0"
                aria-valuemax="1"
                :aria-valuetext="targetValueText"
                aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight PageUp PageDown Home End Enter Space"
                aria-describedby="spring-rail-hint"
                tabindex="0"
                @pointerdown="onRailPointerDown"
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
                    <!-- X.KF.W13W.b (OA-56) — the rail keeps only a SUBORDINATE
                         progress cue: the live displacement as a quiet fill from
                         value 0 (painter-scaled, `scaleX(value)`). The spring's
                         ball no longer sits here — it rides the plotted trace
                         below, at sim time. -->
                    <div ref="liveFillEl" class="spring-fill" aria-hidden="true"></div>
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

                <!-- ── L.W11 S6 EGG — the four-lane DERBY overlay ──────────────
                     Double-click the rail and four SpringProgress solvers race
                     four RAINBOW LANES over a shared target line: bouncy (ζ=0.45)
                     rings PAST it, gentle (ζ=1.0) never crosses. Each lane wears
                     its sanctioned --spring-lane-* tone; the balls ride the live
                     `springLive.trackValues` (the engine's physics, painter-
                     positioned — inv ζ, no second rAF). Shown ONLY during the
                     race (`derbyActive`); the page rests as one calm red spring. -->
                <!-- N-1 — THE EXIT IS A REAL EXIT NOW. The overlay used to leave
                     on a bare `v-if` with no <Transition> anywhere, against three
                     prose cells asserting a fade that did not exist: the lanes
                     simply stopped being there, one frame, on the scene's
                     headline delight. A named transition gives the leave the
                     treatment the enter always had. -->
                <Transition name="derby" @after-leave="onDerbyAfterLeave">
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
                    <!-- X.KF.W13X.spring (KFA-41) — ONE value axis: each lane spans
                         the rail's own box, so a lane ball at value v sits where the
                         live marks put v (the same `railPct` over the same width);
                         the tag gutter that shortened every lane by 6.25rem (every
                         finish ~87 px left of the target) is gone, and the target
                         the derby races to is drawn across the lanes. -->
                    <div class="derby-lane-stack">
                        <span class="derby-target-tick" :style="{ left: `${railPct(1)}%` }"></span>
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
                        </div>
                    </div>
                    <!-- X.KF.W13X.spring (KFA-40 · UIA-KF-094) — the lane names are
                         ONE legend line beneath the lanes, each tag unbroken and
                         keyed by its lane's tone; in a 100 px gutter they wrapped to
                         two lines on a 14 px lane and printed over each other. -->
                    <div class="derby-legend text-mono-caption tabular-nums">
                        <span
                            v-for="lane in demo.derbyLanes"
                            :key="lane.name"
                            class="derby-lane-tag"
                            :style="{ '--ball-tone': lane.tone }"
                        >{{ lane.name }} · ζ{{ lane.zeta.toFixed(2) }}</span>
                    </div>
                </div>
                </Transition>
            </div>
            <!-- C-1 — this sentence is TRUE NOW. It promised that a tap or drag
                 springs the ball to the new target; in the scene's own documented
                 entry state it did not, and the promise is the reason the broken
                 state reads as broken rather than idle. The chase-intent contract
                 is what earns the copy back, and the copy is left exactly as the
                 owner wrote it. (KF-SS-38's surviving question — that "Re-seat",
                 the ribbon's verb for the same act, is jargon this copy never
                 teaches — is a user-facing COPY decision this wave does not hold;
                 it stays written down and unacted, as its home record directs.)
                 D-6/N-4 — and it is the rail's `aria-describedby` target, so the
                 instruction reaches a screen reader as a DESCRIPTION instead of
                 masquerading as the control's name. -->
            <!-- X.KF.W13X.spring (A2-KE-L3-8) — Re-seat, the rail's own verb
                 (flip the chase target), sits BESIDE the rail it acts on as a
                 compact control; it was a full-width third row in the ribbon. -->
            <!-- KFA-40 — while the derby runs, its lane legend overlays this
                 row, so the row steps back (opacity only: its box, its
                 description role and the layout all stay; Re-seat is inert
                 during a derby anyway — `reseat` refuses while it runs). -->
            <div
                class="spring-rail-verbs flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
                :class="{ 'spring-rail-verbs--veiled': demo.derbyActive.value }"
            >
                <p id="spring-rail-hint" class="text-small text-muted-foreground text-center text-pretty">
                    Tap or drag the rail &mdash; the ball springs to the new target. Tune
                    response and damping in the Physics pane.
                </p>
                <Button emphasis="quiet" size="sm" class="spring-reseat" @click="demo.toggleTarget()">
                    <Shuffle aria-hidden="true" />
                    <span>Re-seat</span>
                </Button>
            </div>
        </div>

        <!-- ── L.W11 S6 — the linear() 26-stop PLOT (the curve drawn, beside its
             string). The parse + draw lives in the colocated SpringTrace sub-unit
             (the natural concern seam); it reads the live (response, ζ) so the
             trace re-plots as the sliders move. -->
        <!-- X.KF.W13W.b (OA-56) — THE BALLS RIDE THE TRACE. Both carriages
             span the trace's plot box and are painter-placed by the trace's OWN
             plot (`SpringTrace`'s exposed `plot`, the shared curvePlot): the
             live simulator ball at sim time since its target was set, the sweep
             sampler at its leg's normalized time. Neither sits on a rail. -->
        <!-- X-DS pass 3 · KF-C3-05 — ONE horizontal origin for the figure: the
             trace is inset by the rail's overshoot band (the same `railPct` map
             the track reads), so value 0 on the rail and t = 0 on the plot
             share an x, and the horizon sits under the value-1 tick. -->
        <SpringTrace
            ref="traceEl"
            :style="figureInset"
            :response="demo.response.value"
            :damping-fraction="demo.dampingFraction.value"
            :sweep="demo.sampled.value"
        >
            <span ref="samplerCarriageEl" class="curve-carriage sampler-carriage">
                <span class="curve-ball sampler-ball"></span>
            </span>
            <span ref="liveCarriageEl" class="curve-carriage spring-carriage">
                <span class="curve-ball spring-ball"></span>
            </span>
        </SpringTrace>
        </figure>
    </Card>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { computed, inject, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { Button } from "@mkbabb/glass-ui/button";
import { Shuffle } from "@lucide/vue";
import SceneStageHeader from "../SceneStageHeader.vue";
import { clamp } from "@mkbabb/value.js/math";
import { useDragScrub } from "@composables/useDragScrub";
import { useDoubleTap } from "@composables/useDoubleTap";
import { SPRING_DEMO_KEY } from "./springKeys";
import SpringTrace, { springHorizonMs } from "./SpringTrace.vue";
import { DOUBLE_TAP_MS } from "./useSpringDemo";
import { overshoot } from "./SpringHeatmap.vue";
import { SPRING_PRESETS } from "./springPresets";

const demo = inject(SPRING_DEMO_KEY)!;

// ── THE A11Y ONE-EDIT FAMILY (D-6 · D-14 · N-4) ──────────────────────────────
//
// N-4 / KF-SS-32 — TWO SCALARS, ONE UNLABELLED ANNOUNCEMENT, AND A NAME THAT WAS
// AN INSTRUCTION. The rail's accessible name was "Drag to re-seat the spring
// target": it named a MODALITY (drag) to users who may have no pointer, and it
// was a sentence where a noun phrase belongs. Its `aria-valuenow` announced
// `round(target * 100)` — a 0-100 scale that appears NOWHERE in the visual UI,
// which is [0, 1] everywhere — while the hero numeral 20 px away shows the LIVE
// displacement, so two different scalars were reaching a user as one bare number.
// The name is a noun phrase; the range is the space the UI actually shows; and
// `aria-valuetext` says WHICH scalar it is. Unlike the banked N-14 case no domain
// decision blocks this — there is one honest reading and this is it.
//
// The valuetext deliberately does NOT carry the live displacement: that changes
// at the readout cadence and would turn a slider into a 6 Hz announcement storm.
// Settling — the one discrete fact — is published by the status region instead.
const targetValueText = computed(() => `target ${demo.target.value.toFixed(2)} of 1`);

/** i-16 — the one state that means "the SOLVER's marks are about to move": the
 *  field is still travelling, or the derby is up. It gates the compositor
 *  promotion of the live ball, the fill and the lanes, which used to be
 *  unconditional. X.KF.W13X.spring (KFA-211) — it read the sweep transport too,
 *  so the live ball kept `will-change` and `--live` through a whole Sweep
 *  playback while the badge read "settled" and nothing on the rail moved; the
 *  sweep's own moving mark (the sampler) is gated by `--sweeping` instead. */
const isLive = computed(() => !demo.liveSettled.value || demo.derbyActive.value);

/** X.KF.W13X.spring (KFA-213) — the badge's SKIN reads the same state its
 *  words do. It read `liveSettled` while the words read `stateLabel`, so across
 *  a derby (label 'derby' throughout) the live ball's launch and settle flipped
 *  the pill between the plain and the filled skin mid-race: hard frame cuts on
 *  a constant label. A derby is motion, so it wears the tracking skin. */
/** The instrument's one discrete, high-salience state (D-14), and the derby's
 *  only announcement channel (gesture spec 6 — the lane overlay is aria-hidden
 *  decoration by design). */
const stateLabel = computed(() =>
    demo.derbyActive.value
        ? "derby"
        : demo.liveSettled.value
          ? "settled"
          : "tracking",
);

// S.G3 S2 — the derby is POINTER-based double-tap now (touch parity; never native
// `dblclick`, which mobile browsers do not synthesize reliably). A discovered
// double-tap gesture egg (the on-stage legend layer was retired at T.M — VERDICT #8).

const railEl = useTemplateRef<HTMLElement>("railEl");
const liveFillEl = useTemplateRef<HTMLElement>("liveFillEl");
const traceEl = useTemplateRef<InstanceType<typeof SpringTrace>>("traceEl");
const liveCarriageEl = useTemplateRef<HTMLElement>("liveCarriageEl");
const samplerCarriageEl = useTemplateRef<HTMLElement>("samplerCarriageEl");

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
//
// X.KF.W13X.spring (KFA-102) — "above the engine's worst documented peak" was
// false: the literal was 0.18, the bouncy preset peaks at ≈1.205, so the bouncy
// derby lane sat pinned at the rail end for 5 frames at its peak (and 0 cqw at
// its trough). The allowance is now DERIVED from the marks the rail actually
// carries — the four preset trackers the lanes paint — as their largest analytic
// peak overshoot (the heatmap's own `overshoot(ζ)`), so no lane can clamp. The
// live ball and the sweep sampler ride the trace (OA-56), whose plot bounds hold
// any ζ down to the slider floor; the live fill is a subordinate cue.
const OVERSHOOT_ALLOWANCE = Math.max(...SPRING_PRESETS.map((p) => overshoot(p.dampingFraction)));
const RAIL_SPAN = 1 + 2 * OVERSHOOT_ALLOWANCE;

/** Value space → the rail's own 0-100 axis. The ONE map; nothing paints without it. */
const railPct = (v: number): number =>
    ((clamp(v, -OVERSHOOT_ALLOWANCE, 1 + OVERSHOOT_ALLOWANCE) + OVERSHOOT_ALLOWANCE) /
        RAIL_SPAN) *
    100;

/** The rail's 0-1 pointer ratio → value space (`railPct`'s inverse). */
const railValue = (ratio: number): number => ratio * RAIL_SPAN - OVERSHOOT_ALLOWANCE;

/** KF-C3-05 — the trace's inline inset: the rail's overshoot band, both ends. */
const figureInset = { paddingInline: `${railPct(0)}% ${100 - railPct(1)}%` };
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
// i-15 — A MAP, NOT A NEVER-SHRINKING ARRAY. The array was only ever appended to:
// after the first derby it held four entries FOREVER, and the painter then paid
// four null-checks per frame, for the lifetime of the scene, for an overlay that
// is mounted for about two seconds of it — in the one file whose stated posture
// is "zero cost at rest". The map empties when the lanes are GONE — at the
// overlay's `after-leave` — so the painter's derby loop costs nothing when there
// are no lanes. X.KF.W13X.spring (KFA-153): it used to empty on the ref
// callback's `null`, which Vue sends as the leave BEGINS, so the lane balls froze
// through the 220 ms exit fade while the field was still settling (the live ball
// kept moving, ~2-3 px apart).
const derbyBallEls = new Map<number, HTMLElement>();
const setDerbyBallEl = (i: number, el: Element | ComponentPublicInstance | null) => {
    // m-10 — `el as HTMLElement` turned the file's only cast from known-narrow
    // into unchecked: a future component-ref edit here would throw INSIDE the
    // 60 Hz painter. `instanceof` is the honest narrowing and costs one check
    // per ref callback, not per frame.
    if (el instanceof HTMLElement) derbyBallEls.set(i, el);
};
const onDerbyAfterLeave = (): void => derbyBallEls.clear();

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
        // X.KF.W13W.b (OA-56) — the rail's subordinate cue: the displacement
        // as a fill from value 0, on the SAME `railPct` map (the fill spans the
        // track, value 0 → 1, so its scale is the value clamped by the allowance).
        if (liveFillEl.value) {
            liveFillEl.value.style.transform = `scaleX(${(railPct(live.value) - railPct(0)) / (railPct(1) - railPct(0))})`;
        }
        // X.KF.W13W.b (OA-56) — THE BALLS RIDE THE TRACE, placed by the trace's
        // OWN plot (the function that draws the stroke). The simulator's ball is
        // at its sim time over the trace's horizon (4 × response); settled, it
        // rests at the trace's end (PRM snaps and settles on the first frame,
        // so a reduced-motion re-seat rests there at once). The sweep sampler is
        // at its leg's normalized time: the sweep plays the timing function
        // 0 → 1 then 1 → 0, and each leg is f(u) over u ∈ [0, 1).
        const plot = traceEl.value?.plot;
        if (plot && liveCarriageEl.value) {
            const t = live.settled ? 1 : live.simMs / springHorizonMs(demo.response.value);
            liveCarriageEl.value.style.transform = plot.place(t);
        }
        if (plot && samplerCarriageEl.value) {
            samplerCarriageEl.value.style.transform = plot.place((live.phase * 2) % 1);
        }
        // L.W11 S6 — position the four derby-lane balls from the live tracker
        // values (the live lanes remain relaxed so the bouncy lane visibly rings
        // PAST the target line — the overshoot is the point). Painter-positioned,
        // the SAME hot path; no second writer, no second rAF (inv ζ).
        const trackValues = live.trackValues;
        for (const [i, el] of derbyBallEls) {
            el.style.transform = `translateX(${railPct(trackValues[i] ?? 0)}cqw)`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

// The shared drag-scrub seam (H.W12.S1 / I8). Spring's `project` is the bare
// rect-ratio (`demo.reseat` owns the clamp); no pause/resume hooks — the spring
// chases the live target continuously.
// ── THE RAIL'S GESTURE SPEC (D-5 · m-11 · i-18 · N-3) — ONE SPEC, NOT FOUR
//    PATCHES ─────────────────────────────────────────────────────────────────
//
// The four rows are one question — what does this surface afford, and does it
// say so — so they are answered once, here, and the answer is written down.
//
//  1. VOCABULARY. The rail shows three states: rest, hover, dragging. N-1's
//     sibling defect N-3: the component's only interactive element had no hover,
//     no active and no drag styling whatsoever, and `dragging` — returned by
//     `useDragScrub` all along — was never destructured. A surface that responds
//     to nothing until it has already acted is why C-1's paused-entry state read
//     as broken rather than idle.
//  2. DRAG / TAP re-seats the target. Unchanged; it is the primary action.
//  3. DOUBLE-TAP launches the derby, and Enter/Space does the same on the focused
//     rail. D-5: the egg was reachable by exactly ONE pointer gesture — no Enter,
//     no Space, no registry shortcut — so keyboard-only users could not trigger
//     it and AT users could neither trigger nor perceive it. The on-stage
//     discovery affordance was DELIBERATELY retired (T.M, VERDICT #8), and this
//     does not reinstate it: a key is parity for a gesture that already exists,
//     not a new advertisement for it.
//  4. WHILE THE DERBY OWNS THE FIELD the rail refuses a re-seat (m-11 — the
//     refusal lives in `demo.reseat`, where every entry point meets it).
//  5. THE DERBY RESTORES THE POSE it interrupted (i-18 — in `useSpringDemo`).
//  6. The overlay stays `aria-hidden` (it is decoration), and the race is
//     announced through the rail's own status region instead — D-5's aria-hidden
//     half, answered by the a11y family rather than by narrating four moving
//     balls to a screen reader.
const { dragging, onPointerDown } = useDragScrub({
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
// KFA-42 — every press first lets the demo snapshot the pre-gesture pose (the
// first press of a gesture), THEN scrubs; a derby restores that pose.
const onRailPointerDown = (e: PointerEvent): void => {
    demo.beginRailPress();
    onPointerDown(e);
};

useDoubleTap({
    el: railEl,
    windowMs: DOUBLE_TAP_MS,
    onDoubleTap: () => {
        demo.derby();
    },
});

const onKeydown = (e: KeyboardEvent) => {
    // KF-SS-30 — the keys this slider claims are claimed AGAIN by the global
    // transport registry, and the glass dispatcher's exemption list does not
    // exempt `div[role=slider]`. `preventDefault` alone never stopped the second
    // handler: a focused rail's Arrow/Home/End were reaching both. A slider that
    // has taken a key owns it for that keypress.
    const claim = () => {
        e.preventDefault();
        e.stopPropagation();
    };

    // KF-SS-32 — the APG step ladder the rail was missing. One step was 0.1, a
    // tenth of the whole range, with no finer grain and no Page keys, so a
    // keyboard user could not place the target anywhere a pointer user could.
    const step = e.shiftKey ? 0.01 : 0.1;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        demo.reseat(demo.target.value + step);
        claim();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        demo.reseat(demo.target.value - step);
        claim();
    } else if (e.key === "PageUp") {
        demo.reseat(demo.target.value + 0.25);
        claim();
    } else if (e.key === "PageDown") {
        demo.reseat(demo.target.value - 0.25);
        claim();
    } else if (e.key === "Home") {
        demo.reseat(0);
        claim();
    } else if (e.key === "End") {
        demo.reseat(1);
        claim();
    } else if (e.key === "Enter" || e.key === " ") {
        // Gesture spec 3 — keyboard parity for the double-tap egg.
        demo.derby();
        claim();
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
    /* D-11 — see the template note: `safe center` keeps a compressed column
       reachable, plain `center` does not. */
    justify-content: safe center;
}

/* ── X-DS pass 3 · KF-C3-04 — the PRIMARY readout, a value in the value face ──
   The live position stays the stage's one primary readout and keeps the scene's
   violet ink (the cascaded --ball-tone, §0dm), but it is a VALUE, so it is set
   in the mono face (tabular) at the subheading rung: the same register as its
   twin, velocity, one step up, and below the "Spring" title. It had been the
   body sans at display size (clamp 2.25-3.25rem, 600), the largest and heaviest
   thing on the stage, outranking the scene's own name (K.W4 U-K18's audacious
   re-tier, superseded by the canon: display numerals belong to the display
   face, values to Fira Code). The header's query container existed only for
   that clamp and goes with it. */
.spring-readout-primary {
    font-family: var(--font-mono);
    font-size: var(--type-subheading);
    font-weight: var(--font-weight-medium, 500);
    line-height: 1;
    color: var(--ball-tone, var(--color-progress));
    font-variant-numeric: tabular-nums;
}

.spring-readout-secondary {
    font-family: var(--font-mono);
    font-size: var(--type-body);
    line-height: 1;
    color: var(--muted-foreground);
    font-variant-numeric: tabular-nums;
}

.spring-rail {
    /* T.G4 — the balls ride `translateX(<cqw>)`; `cqw` resolves against the nearest
       inline-size container, so the rail/track ARE that container (the value axis
       stays rail-relative with no per-frame width read).
       m-7 — the `display: flex; align-items: center` that used to head this rule
       is GONE. Every child of both elements is absolutely positioned with both
       axes resolved (`.progress-rail` top/left/width, `.progress-ball` top +
       margin-top, `.spring-target-marker` top + margin-top, `.spring-track`
       inset, `.derby-lanes` inset) — a flex container with no in-flow children
       lays nothing out. Only `container-type` was ever load-bearing here.
       X.KF.W13X.spring (UIA-KF-305) — the rail's `kf-focus-ring` is a
       box-shadow on THIS 48 px gesture box, so the box carries the field rung's
       radius: the ring is a rounded well around the track, never a sharp
       rectangle that matches no drawn shape. */
    container-type: inline-size;
    border-radius: var(--radius-field);
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

/* X-DS pass 4 (KF-C4-11) — the track's own gridlines start at the FIRST
   quarter: its left edge is the origin, and the shared recipe's line at value 0
   bisected the resting target ring into a ⦶. The groove takes the ticks' ink,
   so the rail is one tone (it was a violet tint between tan ticks). */
.spring-track.stage-field-x {
    background-image: repeating-linear-gradient(
        to right,
        transparent 0 calc(100% / 4 - 1px),
        var(--border) calc(100% / 4 - 1px) calc(100% / 4)
    );
}
.spring-track .progress-rail {
    background: var(--border);
}

/* The rail + ball geometry now come from the shared .progress-rail /
   .progress-ball idiom (design-idioms.css). The consolidation adopts
   EasingTarget's canonical lineage (rail-tint 8%; the ball glow is deleted,
   X-DS KF-P1-04) — so the former 12% rail became the canonical default (a named befitting motion-
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
       fixed target line instead. N-1 — `opacity` joins it here, on the BASE rule,
       so the derby's recede and its return both animate. */
    transition:
        border-color var(--duration-fast) ease,
        opacity var(--duration-fast) ease;
}

/* X.KF.W13W.b (OA-56) — the rail's SUBORDINATE progress cue: the live
   displacement as a quiet 2px fill along the groove from value 0, scaled by the
   painter (`scaleX`, compositor-only). It is a cue, not a marker: no ball sits on
   the rail — the spring's ball rides the plotted trace. */
.spring-fill {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    margin-top: -1px;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 45%, transparent);
    transform: scaleX(0);
    transform-origin: left center;
    pointer-events: none;
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
.derby-lane-ball {
    left: 0;
    margin-left: calc(var(--ball-size, 36px) / -2);
}

/* i-16 — `will-change: transform` USED TO SIT ON THE RULE ABOVE, unconditionally,
   which held two permanent compositor layers alive in the file whose own posture
   is "zero cost at rest" and whose loop is designed to run zero frames until a
   user acts. A promotion hint that is always on is not a hint. It is bound to the
   one state that means "these are about to move": the transport is playing, the
   field is still travelling, or the derby is up. */
.spring-target--live .spring-carriage,
.spring-target--live .spring-fill,
.spring-target--live .derby-lane-ball,
.spring-target--sweeping .sampler-carriage {
    will-change: transform;
}

/* X.KF.W13W.b (OA-56) — the two balls that ride the trace (`.curve-ball`, the
   shared placement idiom): the live simulator ball is the protagonist (the
   scene accent + full glow), the sweep sampler the quiet translucent sibling.
   Sized for the trace's plot box rather than the 3rem rail they used to ride. */
.spring-ball {
    --ball-size: 1.5rem;
}
.sampler-ball {
    --ball-size: 1rem;
    /* the sweep sampler is a quiet translucent marker */
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 65%, transparent);
}

/* ── N-3 (gesture spec 1) — THE SURFACE ANSWERS THE POINTER ──
   The component's ONE interactive element had no hover, no active and no drag
   state at all; `dragging` came back from `useDragScrub` and went nowhere. These
   three rules are the whole vocabulary: the ghost marker brightens under the
   pointer so the target you are about to move is the thing that lights up, and
   the rail's own groove lifts while a drag is live so the gesture has a held
   state. Compositor-safe (colour + opacity only) and no new element. */
.spring-rail:hover .spring-target-marker,
.spring-rail--dragging .spring-target-marker {
    border-color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 85%, transparent);
}
.spring-rail--dragging {
    cursor: grabbing;
}
.spring-rail--dragging .progress-rail {
    --rail-tint: 18%;
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
    /* D-13 — the LAST rule in this file that read `--color-progress` past the
       seam. The file declares "the scene's ONE colour consumer" at the top and
       then bypassed it here, so setting `--ball-tone` would have half-recoloured
       the instrument: the balls and the marker would move hue and the value=1
       reference would not. The seam is either the one consumer or it is not a
       seam. (The inverted-fallback twin — every `var(--ball-tone, …)` fallback in
       this file being dead under the unconditional declaration above — is
       deliberately NOT touched: design-idioms.css documents that fallback form as
       the multi-scene idiom, and the row folds to its banked home rather than
       being re-decided here.) */
    /* X-DS pass 3 · KF-C3-05 — the scale's end is a plain hairline tick in the
       --border ink (the quarter ticks' language), so the ONE dashed violet mark
       on the rail is the target. Same dash, same hue, it read as a second
       target, and at rest (target 1) the two sat on one another. */
    border-right: 1px solid var(--border);
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
   shown; the live rail recedes slightly so the lanes read as the foreground).

   N-1 — THE TRANSITION LIVES ON THE BASE RULES, NOT IN THE STATE CLASS. It used
   to sit here, inside the modifier, which is the classic modifier-only asymmetry:
   adding the class faded (0.2s), removing it SNAPPED, because after the change
   there was no opacity transition left on the element to run. The file already
   modelled the correct pattern twice elsewhere. Declared once on the base rules
   below, both directions animate — and the derby's own exit, which is when a
   human is actually looking, stops being a jump cut. */
.spring-rail .progress-rail,
.spring-fill {
    transition: opacity var(--duration-fast) ease;
}
.spring-rail--derby .progress-rail,
.spring-rail--derby .spring-fill,
.spring-rail--derby .spring-target-marker {
    opacity: 0.35;
}

/* The overlay's own enter/leave (N-1's second half — the `v-if` had neither). */
.derby-enter-active,
.derby-leave-active {
    transition: opacity 220ms var(--ease-standard, ease);
}
.derby-enter-from,
.derby-leave-to {
    opacity: 0;
}
/* X-DS pass 1 (KF-P1-09) — the settle pulse is a border-colour step only; its
   drop-shadow flash is deleted. */
@keyframes spring-settle-pulse {
    0% {
        border-color: var(--ball-tone, var(--color-progress));
    }
    100% {
        border-color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent);
    }
}

/* ── L.W11 S6 — the four-lane DERBY overlay ──
   Four stacked rainbow lanes that appear ONLY during the race (derbyActive). Each
   lane wears its sanctioned --spring-lane-* tone (consumed via --ball-tone — the
   .progress-ball idiom keys on it), with a small ζ tag. The bouncy lane's ball
   rings PAST the target line (the painter's relaxed clamp); the gentle lane never
   crosses. Absolutely overlaid on the rail region.

   N-1 — "fades in/out" stood here while the overlay had an enter-only keyframe
   animation and a bare `v-if` for its exit, so the second half of the claim was
   simply untrue and the C axis inherited it verbatim into its own read. It is
   true now, and it is true because the <Transition> above exists — the cure is
   what earns the sentence, never the other way round. */
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
}
/* KFA-41 — the stack is the lanes' shared box (the rail's width), and the one
   target tick crosses every lane at value 1. */
.derby-lane-stack {
    position: relative;
    display: grid;
    gap: 0.35rem;
}
.derby-target-tick {
    position: absolute;
    top: -0.2rem;
    bottom: -0.2rem;
    width: 0;
    border-left: 1px dashed color-mix(in srgb, var(--foreground) 45%, transparent);
    pointer-events: none;
}
.derby-lane {
    position: relative;
    height: 0.9rem;
    /* D-7/C-8 put the tag in a trailing gutter so a winning ball could not cover
       it; X.KF.W13X.spring (KFA-41 · KFA-40) — that gutter shortened the lane's
       value axis against the rail's (every finish and rest ~87 px left of the
       target line) and was too narrow for its tag. The tags are the legend below
       now, so the lane is the rail's full width and nothing sits in a ball's path.
       T.G4 — the lane ball rides `translateX(<cqw>)`; the lane is its inline-size
       container. (No flex here: every child is absolutely positioned.) */
    container-type: inline-size;
}
.derby-lane-rail {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 22%, transparent);
}
.derby-lane-ball {
    --ball-size: 0.8rem;
    position: absolute;
    top: 50%;
    margin-top: calc(var(--ball-size) / -2);
    /* the T.G4 anchor (left / margin-left / will-change) rides the shared rule above */
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
/* KFA-40 — the hint + Re-seat row steps back under the derby's legend. */
.spring-rail-verbs {
    transition: opacity var(--duration-fast) ease;
}
.spring-rail-verbs--veiled {
    opacity: 0;
}
/* KFA-40 · UIA-KF-094 — one legend line; each tag keeps its name and ζ on one
   line and the row wraps between tags, never inside one. */
.derby-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.15rem 0.9rem;
    text-transform: none;
    letter-spacing: normal;
}
.derby-lane-tag {
    white-space: nowrap;
    color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, var(--foreground));
    /* N-2 / MM-29 — the `text-transform: none` patch was known and incomplete:
       `text-mono-caption` also carries `letter-spacing: var(--type-tracking-caps)`
       (0.1em), so 0.1em CAPS tracking rode on lowercase lane names. Both halves
       of the utility are answered now, in one place. */
    text-transform: none;
    letter-spacing: normal;
}

/* N-1 — `@keyframes derby-fade-in` is DELETED with its one consumer. It was the
   enter half of an asymmetry; the <Transition> above owns both halves now, so a
   one-way keyframe animation beside it would be a second authority for the same
   motion. LAW A census at this seat before the delete —
   ⟨cmd⟩ `grep -rn derby-fade-in demo` → the declaration and the single
   `.derby-lanes` reference, both in this file, nothing else in either tree. */

@media (prefers-reduced-motion: reduce) {
    .settle-pulse--fire {
        animation: none;
    }
    /* D-3 / K-6 — this declaration is NOT redundant and is not deleted: the
       installed a11y-overrides' universal PRM rule constrains `animation-
       duration` and `iteration-count`, never `animation-name`, so removing the
       local `none` would leave a 0.01ms pulse still firing its events. The
       overlay's opacity TRANSITION has no entry here on purpose — that same
       universal rule forces `transition-property: opacity … 0.1s !important`, so
       any local declaration would be dead CSS, which is the very class this
       packet is clearing out. (It is also the recorded PRM irony: the override
       accidentally gives reduced-motion users a smoother exit than the default
       path had, and that is a fact about the override, not about this file.) */
    .derby-lanes {
        animation: none;
    }
}
</style>
