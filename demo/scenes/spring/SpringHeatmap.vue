<template>
    <!-- ── FIFTY-FOURTH (owner, 23 Nov 2026, of Spring's "Peak overshoot"
         chart: "rediesng this") — PEAK OVERSHOOT AGAINST DAMPING ───────────
         The figure was a (response × damping) field tinted by the peak
         overshoot in hard horizontal bands. Its tint varies with damping
         alone (response sets the tempo, never the peak), so one of its two
         axes carried nothing, the bands read as a dark slab with a faint
         violet foot, and four region tags and four names crowded its box.
         It is now the curve itself: the exact analytic peak overshoot
         `exp(-ζπ/√(1-ζ²))` drawn over damping ζ, falling to nothing at
         ζ = 1 and flat beyond. The live spring is a ball ON the curve (the
         demo's one ball-on-curve idiom: the easing tiles, the dock's easing
         icon); the four presets are hollow marks on it, named; a press or a
         drag across the chart sets the damping, the arrow keys step it, and
         the response stays with its slider above. A change glides the ball
         along the curve, never across it. -->
    <!-- X-DS pass 15 (KF-C15-01) — the figure is a DISCLOSURE where the rail
         cannot hold it: the app's one chevron-row idiom, here 'Peak overshoot'.
         Closed by default where the facet overflows the rail's scroll body,
         open where it fits. -->
    <!-- The figure's words are its ticks and one reading: true captions (13 px). -->
    <Collapsible ref="sectionEl" v-model:open="figureOpen" class="spring-heatmap-section grid gap-2" data-type-role="caption">
        <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 whitespace-nowrap">
            <CollapsibleTrigger as-child>
                <Button
                    emphasis="quiet"
                    size="sm"
                    class="button-text-flush"
                    data-figure-title
                >
                    <ChevronRight class="disclosure-chevron size-4" aria-hidden="true" />
                    <span class="text-[length:var(--control-label)] leading-(--type-leading-small) text-foreground">Peak overshoot</span>
                </Button>
            </CollapsibleTrigger>
            <!-- owner-1112 hover law — ONE caption slot holds the live reading
                 AND the hover reading, stacked in one grid cell and cross-faded,
                 so hovering the chart moves no box. At rest it reads the live
                 spring's peak ('smooth · ζ 0.86 → 1 %', quiet ink); a hover
                 reads what a press there would write, in the foreground ink. -->
            <span
                v-if="figureOpen"
                class="spring-heatmap-caption min-w-0"
                :data-reading="hoverZeta !== null ? '' : undefined"
            >
                <span class="spring-heatmap-legend text-caption kf-caption text-muted-foreground tabular-nums" data-figure-legend>{{ reading(dampingFraction) }}</span>
                <span
                    class="spring-heatmap-readout text-caption kf-caption text-foreground tabular-nums"
                    data-heatmap-hover
                    aria-hidden="true"
                >{{ reading(readoutZeta) }}</span>
            </span>
            <span :id="readoutId" class="sr-only">
                {{ formatSeconds(response) }} / ζ {{ formatNumber(dampingFraction) }}
            </span>
        </div>

        <CollapsibleContent>
            <div class="spring-heatmap-plot">
                <!-- The overshoot axis: its two ticks at their true heights. -->
                <div class="spring-heatmap-y text-caption kf-caption text-muted-foreground tabular-nums" aria-hidden="true">
                    <span v-for="tick in Y_TICKS" :key="tick.label" :style="{ top: tick.top }">{{ tick.label }}</span>
                </div>

                <!-- The chart is the damping control: a slider over ζ (its value
                     and what that value means, read out), so the arrow keys,
                     Page Up / Down, Home and End step it and a press or a drag
                     sets it. The readout above is its description; the live
                     region inside announces the writes this chart makes. -->
                <div
                    ref="fieldEl"
                    class="spring-heatmap kf-focus-ring relative select-none cursor-crosshair rounded-md"
                    role="slider"
                    :aria-label="FIELD_LABEL"
                    aria-orientation="horizontal"
                    :aria-valuemin="DAMPING_AXIS.min"
                    :aria-valuemax="DAMPING_AXIS.max"
                    :aria-valuenow="dampingFraction"
                    :aria-valuetext="valueText(dampingFraction)"
                    :aria-describedby="readoutId"
                    tabindex="0"
                    data-overshoot-chart
                    @pointerdown="onPointerDown"
                    @pointermove="onPointerMove"
                    @pointerup="onPointerRelease"
                    @pointercancel="onPointerRelease"
                    @lostpointercapture="onPointerRelease"
                    @pointerleave="onPointerLeave"
                    @keydown="onKeydown"
                >
                    <span class="sr-only" aria-live="polite">{{ announced }}</span>

                    <!-- The 50 % rule and the baseline; ζ = 1, where the
                         overshoot ends, as a dashed upright. -->
                    <span class="spring-heatmap-rule" :style="{ top: HALF_TOP }" aria-hidden="true"></span>
                    <span class="spring-heatmap-baseline" aria-hidden="true"></span>
                    <span class="spring-heatmap-critical" :style="{ left: CRITICAL_LEFT }" aria-hidden="true"></span>

                    <svg class="spring-heatmap-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
                        <path class="spring-heatmap-area" :d="AREA_D" :style="{ fill: AREA_FILL }" />
                        <path class="spring-heatmap-curve" :d="CURVE_D" vector-effect="non-scaling-stroke" />
                    </svg>

                    <!-- The hovered damping: a hairline from the baseline up to
                         the curve, where a press would put the ball. -->
                    <span
                        class="spring-heatmap-guide"
                        :class="{ 'is-shown': hoverZeta !== null }"
                        :style="guideStyle"
                        aria-hidden="true"
                    ></span>

                    <!-- The four presets on the curve, where the physics puts
                         them. Each name sits on the side of its mark that the
                         curve and its neighbours leave clear. -->
                    <span
                        v-for="pip in PRESET_PIPS"
                        :key="pip.name"
                        class="spring-heatmap-pip"
                        :class="[`is-${pip.side}`, { 'is-current': pip.name === currentPipName }]"
                        :style="{ left: pip.left, top: pip.top }"
                        aria-hidden="true"
                    >
                        <span class="text-caption kf-caption">{{ pip.name }}</span>
                    </span>

                    <!-- The live spring: a ball on the curve at its damping. -->
                    <span
                        ref="markerEl"
                        class="spring-heatmap-marker"
                        :style="markerStyle"
                        aria-hidden="true"
                    ></span>
                </div>

                <!-- The damping axis: its ticks at their true places, and its name. -->
                <div class="spring-heatmap-x text-caption kf-caption text-muted-foreground tabular-nums" aria-hidden="true">
                    <span v-for="tick in X_TICKS" :key="tick.label" :class="tick.cls" :style="{ left: tick.left }">{{ tick.label }}</span>
                </div>
            </div>
        </CollapsibleContent>
    </Collapsible>
</template>

<script lang="ts">
import { formatNumber, formatSeconds } from "@utils/formatNumber";
// ── The field's MODEL — pure, exported, the gate witness ──────────────────────
// The coordinate space the field and the facet's sliders share (one home for the
// ranges: the sliders read their bounds from HERE), the lattice both input paths
// snap to, and the overshoot ramp the bands paint. Nothing below touches the DOM.
import { clamp } from "@mkbabb/value.js/math";

import { SPRING_PRESETS } from "./springPresets";

/** A parameter axis: its range and the lattice pitch the field navigates by. */
export interface ParamAxis {
    readonly min: number;
    readonly max: number;
    readonly pitch: number;
}

/** The sliders' step — the hundredths grid every lattice node lies on. */
export const PARAM_STEP = 0.01;

/** The one lattice: pitch 0.05 on BOTH axes, tolerance = half a pitch. Every
 *  node is on the hundredths grid, so a snap is EXACT — no re-quantisation. */
export const LATTICE = { pitch: 0.05, tolerance: 0.025 } as const;

export const RESPONSE_AXIS: ParamAxis = { min: 0.1, max: 1.2, pitch: LATTICE.pitch };
export const DAMPING_AXIS: ParamAxis = { min: 0.2, max: 1.5, pitch: LATTICE.pitch };

/** Integer hundredths — the arithmetic every write is done in, so that a step
 *  taken is a step that can be taken back. */
const hundredths = (v: number): number => Math.round(v * 100);
const fromHundredths = (h: number): number => h / 100;

/** The number of lattice pitches an axis spans (22 for response, 26 for ζ). */
export function axisNodes(axis: ParamAxis): number {
    return Math.round((hundredths(axis.max) - hundredths(axis.min)) / hundredths(axis.pitch));
}

/** The lattice node nearest to `v` on `axis`, as an index from the axis minimum. */
export function nodeIndex(v: number, axis: ParamAxis): number {
    const raw = (hundredths(v) - hundredths(axis.min)) / hundredths(axis.pitch);
    return clamp(Math.round(raw), 0, axisNodes(axis));
}

/** The value at lattice node `k` of `axis` — exact on the hundredths grid. */
export function nodeValue(k: number, axis: ParamAxis): number {
    return fromHundredths(hundredths(axis.min) + k * hundredths(axis.pitch));
}

/** Where `v` sits along `axis`, as a fraction 0 → 1 (clamped). */
export function axisFraction(v: number, axis: ParamAxis): number {
    return clamp((v - axis.min) / (axis.max - axis.min), 0, 1);
}

/** The pointer path: a fraction 0 → 1 along `axis` snaps to the nearest node.
 *  The error is ≤ `LATTICE.tolerance` by construction — the published number. */
export function snapToAxis(fraction: number, axis: ParamAxis): number {
    const k = Math.round(clamp(fraction, 0, 1) * axisNodes(axis));
    return nodeValue(k, axis);
}

/** The arrow path: one pitch along `axis`, in integer hundredths, clamped to
 *  the range. Every unclamped step is exactly invertible; a clamped step lands
 *  on the range end, which is itself a node. */
export function stepOnAxis(v: number, direction: -1 | 1, axis: ParamAxis): number {
    const next = hundredths(v) + direction * hundredths(axis.pitch);
    return fromHundredths(clamp(next, hundredths(axis.min), hundredths(axis.max)));
}

/**
 * The EXACT closed-form peak overshoot of a damped harmonic oscillator's
 * unit-step response:
 *
 *     overshoot(ζ) = exp(-ζπ / √(1 - ζ²))   for 0 < ζ < 1  (underdamped — rings)
 *     overshoot(ζ) = 0                       for ζ ≥ 1      (critical / overdamped)
 *
 * A derived control-theory expression — the library exports no peak/settle
 * helper, so it is computed here. It is INDEPENDENT of `response` (which sets
 * ω₀ = 2π/response and scales the time axis, not the peak height): the field's
 * tint therefore varies with the damping axis only, and the legend says so.
 * The `ζ ≤ 0` arm is the function's totality guard; the field's axis starts at
 * 0.2, so no caller reaches it (the test asserts the domain).
 */
export function overshoot(zeta: number): number {
    if (zeta >= 1) return 0;
    if (zeta <= 0) return 1;
    return Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
}

/** The field's strongest ring — the overshoot at the damping axis's minimum. */
export const OVERSHOOT_MAX = overshoot(DAMPING_AXIS.min);
export const OVERSHOOT_MAX_PERCENT = Math.round(OVERSHOOT_MAX * 100);

/** The chart's overshoot ceiling: a round 60 %, just above the strongest
 *  ring the damping axis reaches (53 % at ζ 0.2). */
export const OVERSHOOT_CEILING = 0.6;

/** Where a damping sits across the chart, 0 → 1. */
export const chartX = (zeta: number): number => axisFraction(zeta, DAMPING_AXIS);
/** Where an overshoot sits down the chart, 0 at the top → 1 on the baseline. */
export const chartY = (peak: number): number => 1 - clamp(peak / OVERSHOOT_CEILING, 0, 1);

/** The curve as chart points, one per hundredth of damping (131 points, each
 *  on the sliders' grid), in the 0 → 1000 square the SVG draws in. */
export function overshootCurve(): { zeta: number; x: number; y: number }[] {
    const lo = Math.round(DAMPING_AXIS.min * 100);
    const hi = Math.round(DAMPING_AXIS.max * 100);
    return Array.from({ length: hi - lo + 1 }, (_, i) => {
        const zeta = (lo + i) / 100;
        return { zeta, x: chartX(zeta) * 1000, y: chartY(overshoot(zeta)) * 1000 };
    });
}
export const CURVE_D = overshootCurve()
    .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
/** The curve closed down to the baseline: the overshoot's own area. */
export const AREA_D = `${CURVE_D} L 1000 1000 L 0 1000 Z`;

// X.KF.W13X.spring (UIA-KF-307) — the accent mixes into a surface tint or into
// nothing, never into `--background`: the page ground painted a near-black
// slab on the warm card in dark.
const accentMix = (mix: number): string => `color-mix(in oklab, var(--color-progress) ${mix}%, transparent)`;
/** The area under the curve: a light wash of the accent, so the amount reads
 *  as an amount and the curve stays the line that says it. */
export const AREA_FILL = accentMix(14);

/** The four presets on the curve. A name sits above and after its mark,
 *  unless the next preset along the curve is closer than 0.2 of damping and
 *  near its height: then above and centred, leaving the after side clear for
 *  that neighbour's name (smooth beside gentle). */
export const PRESET_PIPS = [...SPRING_PRESETS]
    .sort((a, b) => a.dampingFraction - b.dampingFraction)
    .map((preset, i, all) => {
        const next = all[i + 1];
        const crowded =
            next !== undefined &&
            next.dampingFraction - preset.dampingFraction < 0.2 &&
            Math.abs(overshoot(next.dampingFraction) - overshoot(preset.dampingFraction)) < 0.05;
        return {
            name: preset.name,
            zeta: preset.dampingFraction,
            left: `${(chartX(preset.dampingFraction) * 100).toFixed(3)}%`,
            top: `${(chartY(overshoot(preset.dampingFraction)) * 100).toFixed(3)}%`,
            side: crowded ? ("above" as const) : ("after" as const),
        };
    });

export const HALF_TOP = `${(chartY(0.5) * 100).toFixed(3)}%`;
export const CRITICAL_LEFT = `${(chartX(1) * 100).toFixed(3)}%`;
const Y_TICKS = [
    { label: "50 %", top: HALF_TOP },
    { label: "0", top: "100%" },
];
const X_TICKS = [
    { label: formatNumber(DAMPING_AXIS.min), left: "0%", cls: "is-start" },
    { label: "damping ζ", left: `${(chartX((DAMPING_AXIS.min + 1) / 2) * 100).toFixed(3)}%`, cls: "is-title" },
    { label: "1", left: CRITICAL_LEFT, cls: "" },
    { label: formatNumber(DAMPING_AXIS.max), left: "100%", cls: "is-end" },
];

/** What a damping means here: its value and its peak, and its preset's name
 *  where it is one. */
export function reading(zeta: number): string {
    const preset = SPRING_PRESETS.find((p) => Math.abs(p.dampingFraction - zeta) < 1e-6);
    const peak = `ζ ${formatNumber(zeta)} → ${formatNumber(overshoot(zeta) * 100, 0)} %`;
    return preset ? `${preset.name} · ${peak}` : peak;
}
const valueText = (zeta: number): string =>
    `damping ${formatNumber(zeta)}, ${formatNumber(overshoot(zeta) * 100, 0)} % overshoot`;

const FIELD_LABEL =
    `Peak overshoot by damping: damping ζ ${DAMPING_AXIS.min} to ${DAMPING_AXIS.max} across, ` +
    `the overshoot it gives up the chart. Press or drag to set the damping, or use the arrow keys ` +
    `to move by ${LATTICE.pitch}; the response stays on its slider.`;
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { ChevronRight } from "@lucide/vue";
import { Button } from "@mkbabb/glass-ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mkbabb/glass-ui/collapsible";
import { NumericAnimation } from "@mkbabb/keyframes.js";
import { easeOutCubic } from "@mkbabb/value.js/easing";
import { landStart } from "@components/instrument/pane/composables/useFoldLanding";

// ── The contract — two models, the same two refs the facet's sliders write
// through their own declared `@update:model-value`. Instantiable with two
// numbers; nothing else of the scene is read. The chart writes the damping
// only; the response rides along for the readout. ────────────────────────────
const response = defineModel<number>("response", { required: true });
const dampingFraction = defineModel<number>("dampingFraction", { required: true });

const fieldEl = useTemplateRef<HTMLElement>("fieldEl");
const sectionEl = useTemplateRef<{ $el: HTMLElement }>("sectionEl");

// ── X-DS pass 15 (KF-C15-01) — the figure's disclosure. Open by default; closed
// at mount where the rail's scroll body (`.controls-surface`, the pane's one
// scroller) cannot hold the facet whole, so the pane ends on the whole
// 'Peak overshoot' row instead of a sliced figure. Read once from layout (the
// facet's own overflow, not a restated rem budget); the reader's toggle is
// theirs after that. Outside the rail (the phone sheet, a test mount) there is
// no such scroller and the figure stays open. ─────────────────────────────────
// X-DS r7 pass 5 (KF-C5-02) — THE FIT IS READ ONCE THE RAIL HAS LANDED, not at
// mount. At mount the scroller had not taken its final box (the work band, the
// fonts and the rail's own fold landing settle later), so the one read found
// no overflow, the figure stayed open, and at 1440x900 the pane ended on the
// open row's legend with the field wholly under the fold. The scroller and the
// section are now observed: while the reader has not touched the pane, any
// size at which the facet overflows closes the figure (a closed row is whole
// at the fold). The decision is the reader's from their first press, key or
// wheel in the pane, or their own toggle; and it latches once it closes.
const figureOpen = ref(true);
let fitWatch: ResizeObserver | undefined;
let fitBody: HTMLElement | undefined;
const FIT_SETTLERS = ["pointerdown", "keydown", "wheel"] as const;
const settleFit = (): void => {
    fitWatch?.disconnect();
    fitWatch = undefined;
    for (const type of FIT_SETTLERS) fitBody?.removeEventListener(type, settleFit, true);
    fitBody = undefined;
};
onMounted(() => {
    const section = sectionEl.value?.$el;
    // r8 pass 7 (KF-C7-01) — the facet's own port (`data-fold-key`), the
    // bounded body under its title, or the pane's surface scroller.
    const body = section?.closest?.("[data-fold-key]");
    if (!section || !(body instanceof HTMLElement)) return;
    fitBody = body;
    fitWatch = new ResizeObserver(() => {
        if (body.clientHeight === 0) return;
        if (body.scrollHeight - body.clientHeight > 1) figureOpen.value = false;
    });
    fitWatch.observe(body);
    fitWatch.observe(section);
    for (const type of FIT_SETTLERS) body.addEventListener(type, settleFit, { capture: true, passive: true });
});
onBeforeUnmount(settleFit);
// X-DS r5 pass 4 (KF-C4-02) — a figure the reader OPENS comes into the rail's
// view. It opens under the row that discloses it; where that row is the last
// one above the fold, the figure opened wholly below it and the press showed
// nothing. Once its reveal has run (the producer's height animation ends) the
// section is scrolled to the nearest edge of its scroller; off the top, the
// scroller's end fade is the cue again.
// X-DS r5 pass 5 (KF-C5-01) — and the fold lands on content there too. The
// nearest edge left the scroller 17 px short of its end at 1440x900, so the
// response axis' labels lay across the fold and under the end fade. The figure
// is the facet's last row: where the scroller can hold it whole, the scroller
// rests at its END (the axis row whole above the fold, the producer's end fade
// off at the limit); where it cannot, the figure starts at the scroller's top.
// X-DS r8 pass 6 (KF-C6c-01) — the rail's own landing (useFoldLanding, which
// re-caps the scroller when its content resizes) runs after this and keeps an
// end-pinned scroller at its end, so the pin holds whichever runs first.
// X-DS r8 pass 7 (KF-C7-01) — and the port's TOP edge is placed too
// (`landStart`): the pin no longer stops through a line of text at the top.
const revealFigure = (): void => {
    const section = sectionEl.value?.$el;
    if (!section) return;
    const scroller = section.closest?.("[data-fold-key]");
    if (!(scroller instanceof HTMLElement)) {
        section.scrollIntoView?.({ block: "nearest" });
        return;
    }
    if (section.offsetHeight <= scroller.clientHeight) {
        scroller.scrollTop = scroller.scrollHeight;
        landStart(scroller);
    } else section.scrollIntoView?.({ block: "start" });
};
watch(figureOpen, (open) => {
    settleFit();
    const section = sectionEl.value?.$el;
    if (!open || !section) return;
    requestAnimationFrame(() => {
        const running = section.getAnimations?.({ subtree: true }) ?? [];
        if (running.length === 0) revealFigure();
        else void Promise.allSettled(running.map((a) => a.finished)).then(revealFigure);
    });
});
const markerEl = useTemplateRef<HTMLElement>("markerEl");
const readoutId = useId();
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

/** What this chart announces after a write it made (the sliders announce theirs). */
const announced = ref("");

/** Write the damping (when it changed) and announce the result. */
function write(d: number): void {
    if (d !== dampingFraction.value) dampingFraction.value = d;
    announced.value = valueText(d);
}

// ── The ball — where it is DRAWN (`shown`) follows the live damping. An
// isolated write glides the drawn damping to the new one, so the ball travels
// along the curve, never across it; a STREAM of writes (a slider drag, a key
// repeat, this chart's own drag) is tracked 1:1, so the ball never trails the
// hand. Placed by `transform: translate(<cqw>, <cqh>)` against the chart's
// content box (`container-type: size`): compositor-only. Reduced motion: the
// ball fades out where it stood and in where it lands, never a cut. ──────────
const GLIDE_MS = 260;
const shown = ref(dampingFraction.value);
const glide = new NumericAnimation<{ z: number }>([{ z: 0 }, { z: 1 }], {
    duration: GLIDE_MS,
    timingFunction: easeOutCubic,
});
let glideRun = 0;
let gestureStreaming = false;
let lastWriteAt = Number.NEGATIVE_INFINITY;
watch(dampingFraction, (to) => {
    const now = performance.now();
    const stream = gestureStreaming || now - lastWriteAt < GLIDE_MS;
    lastWriteAt = now;
    glide.stop();
    const run = ++glideRun;
    if (stream) {
        shown.value = to;
        return;
    }
    if (reducedMotion.value) {
        const marker = markerEl.value;
        if (!marker?.animate) {
            shown.value = to;
            return;
        }
        void marker
            .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 70, fill: "forwards" })
            .finished.then(() => {
                if (run !== glideRun) return;
                shown.value = to;
                for (const a of marker.getAnimations()) a.cancel();
                marker.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 110 });
            })
            .catch(() => undefined);
        return;
    }
    const from = shown.value;
    void glide.play(({ z }) => {
        if (run === glideRun) shown.value = from + (to - from) * z;
    });
});
onBeforeUnmount(() => glide.stop());

const markerStyle = computed(() => ({
    transform: `translate(${(chartX(shown.value) * 100).toFixed(3)}cqw, ${(chartY(overshoot(shown.value)) * 100).toFixed(3)}cqh)`,
}));

/** The preset the live damping sits on: its mark is under the ball, its name
 *  stays (it names the ball's place). */
const currentPipName = computed(
    () => SPRING_PRESETS.find((p) => Math.abs(p.dampingFraction - dampingFraction.value) < 1e-6)?.name,
);

// ── ONE coordinate space — the chart's CONTENT box: the box `cqw`/`cqh`
// resolve against and (rect + clientLeft, clientWidth) the box the pointer is
// read in. ─────────────────────────────────────────────────────────────────────
function chartFraction(clientX: number): number | null {
    const field = fieldEl.value;
    if (!field) return null;
    const w = field.clientWidth;
    if (w <= 0) return null;
    const rect = field.getBoundingClientRect();
    return clamp((clientX - rect.left - field.clientLeft) / w, 0, 1);
}

// ── The hover — the damping a press would write, shown before it is written. ──
const hoverZeta = ref<number | null>(null);
/** The readout keeps the last damping it read, so it fades out on its value. */
const lastHover = ref<number | null>(null);
watch(hoverZeta, (z) => {
    if (z !== null) lastHover.value = z;
});
const readoutZeta = computed(() => hoverZeta.value ?? lastHover.value ?? dampingFraction.value);
const guideStyle = computed(() => {
    const z = readoutZeta.value;
    return {
        left: `${(chartX(z) * 100).toFixed(3)}%`,
        "--guide-top": `${(chartY(overshoot(z)) * 100).toFixed(3)}%`,
    };
});

// ── The gesture — one primary pointer, latched by id, captured for the drag.
// `touch-action: pan-y` (the scoped block): a vertical swipe over the chart
// still scrolls the pane; a horizontal one sets the damping. ─────────────────
let activePointer: number | null = null;

function hoverAt(e: PointerEvent): number | null {
    const f = chartFraction(e.clientX);
    if (f === null) return null;
    const d = snapToAxis(f, DAMPING_AXIS);
    hoverZeta.value = d;
    return d;
}

function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || !e.isPrimary || activePointer !== null) return;
    activePointer = e.pointerId;
    fieldEl.value?.setPointerCapture?.(e.pointerId);
    gestureStreaming = true;
    const d = hoverAt(e);
    if (d !== null) write(d);
    fieldEl.value?.focus({ preventScroll: true });
}

function onPointerMove(e: PointerEvent): void {
    if (activePointer !== null) {
        if (e.pointerId !== activePointer) return;
        const d = hoverAt(e);
        if (d !== null) write(d);
        return;
    }
    if (e.pointerType !== "touch") hoverAt(e);
}

function onPointerRelease(e: PointerEvent): void {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    gestureStreaming = false;
    if (e.pointerType === "touch") hoverZeta.value = null;
}

function onPointerLeave(): void {
    if (activePointer === null) hoverZeta.value = null;
}

// ── The keys — the slider's own: a bare arrow steps ONE pitch (right and up
// add damping), Page Up / Page Down five, Home and End go to the ends. A
// handled key is CLAIMED for that keypress (`preventDefault` +
// `stopPropagation` — the KF-SS-30 precedent: a widget that has taken a key
// owns it). A modified key is NOT handled: Alt/Meta/Ctrl/Shift+Arrow reach the
// browser and the registry exactly as from any other element. ────────────────
function onKeydown(e: KeyboardEvent): void {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    let d = dampingFraction.value;
    const steps = (n: number, dir: -1 | 1) => {
        for (let i = 0; i < n; i++) d = stepOnAxis(d, dir, DAMPING_AXIS);
    };
    switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
            steps(1, 1);
            break;
        case "ArrowLeft":
        case "ArrowDown":
            steps(1, -1);
            break;
        case "PageUp":
            steps(5, 1);
            break;
        case "PageDown":
            steps(5, -1);
            break;
        case "Home":
            d = DAMPING_AXIS.min;
            break;
        case "End":
            d = DAMPING_AXIS.max;
            break;
        default:
            return;
    }
    e.preventDefault();
    e.stopPropagation();
    write(d);
}
</script>

<style scoped>
/* ── The plot: the overshoot ticks, the chart, the damping axis under it. ── */
.spring-heatmap-plot {
    /* The top tick is centred ON its rule (translateY(-50%)); the plot holds
       the overhang above the chart (glass clips the disclosure's content for
       its height motion). */
    padding-block-start: calc(var(--type-caption) / 2);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 0.375rem;
    row-gap: 0.25rem;
}
.spring-heatmap-x {
    grid-column: 2;
    position: relative;
    block-size: calc(var(--type-caption) * 1.3);
}
.spring-heatmap-x > span {
    position: absolute;
    top: 0;
    line-height: 1.3;
    white-space: nowrap;
    translate: -50% 0;
}
.spring-heatmap-x > .is-start {
    translate: 0 0;
}
.spring-heatmap-x > .is-end {
    translate: -100% 0;
}
/* X.KF.W13X.pc2 (ESC-W13X-pc-1 / PC1i) — the section's one column is the
   rail's width, never its content's min-content. An implicit `auto` track
   takes its minimum from its widest item: the title row's nowrap legend
   sentence, 326 px in a 288 px section at 1024. The plot stretched to that
   track, so the field ran 18 px under the layer's clip and its far-response
   column could not be pointed. `minmax(0, 1fr)` holds every row to the rail,
   and the plot's own `minmax(0, 1fr)` field column takes the squeeze. */
.spring-heatmap-section {
    --spring-field-block: 12rem;
    grid-template-columns: minmax(0, 1fr);
}
/* X-DS pass 11 (KF-C11-05) — THE FIGURE TAKES A SHARE OF THE RAIL, as the
   easing plot does (KF-C9-10). The 12rem field ran the pane's scroll fold
   through its own axis at 1440x900 (the ζ tick '0.2' halved, the response
   axis hidden), so the figure read as cropped. The pane's scroll body is the
   rail less 15rem (the transport and the frame; measured 240-241 px at five
   laptop sizes), and the facet's chrome above the field plus the response
   axis under it and a half-rung of clearance is 18.5rem (260-265 + 21 + 8 px).
   12rem stays the cap (the regime tags and pips were sized for it); 8rem is
   the floor, where the rail is too short to hold the figure whole.
   X-DS pass 12 (KF-C12-01) — the budget also counts the scroller's own end
   fade (--mask-fade, layout.css): the axis ended INSIDE the fade band and
   read at a third of its ink, as if disabled. The axis now sits above
   fold − mask-fade.
   X-DS pass 13 (KF-C13-02) — the presets now ride ABOVE the field
   (SpringPhysicsFacet: the seed before the figure), so the chrome above the
   field grows by the preset grid, its separator and their gaps (181 px served
   at 1440x900 and 1440x1080): 18.5rem + 11.5rem = 30rem, plus the 15rem frame.
   Where the rail cannot hold the figure whole the fold now cuts the figure,
   never the controls.
   X-DS pass 14 (KF-C14-01) — THE FIGURE IS WHOLE AT THE FOLD OR STARTS BELOW
   IT. The C13 order left the fold inside the figure's first 20 px at 1440x900
   (a 15 px strip of field under its heading, the region label cut through its
   x-height), a named section with a sliced body. Where the facet with the field
   at its 8rem floor overflows the rail's scroll body (the facet measures
   37.75rem with the floor field, the transport and frame 15rem: rail < 52.75rem),
   the section's block start moves to the fold (the scroll body, rail − 15rem,
   less the chrome above the section, 24.625rem served at 1440). The pane then
   ends on the presets and their divider, and the heading, legend and field
   scroll in together. Where the facet fits, the step is 0 (the ×1000 term is a
   hard switch, not a ramp). No mask, and the field is not raised.
   X-DS pass 15 (KF-C15-01) — the switch is RETIRED: a margin spacer is
   whitespace in the scroll content at rest and scrolled alike (a 90 px void
   between the presets' divider and the transport, ~100 px above the heading
   once scrolled). Where the facet overflows, the figure is now a closed
   disclosure row (`figureOpen`, the script), so the pane ends on a whole
   'Peak overshoot' row above the fold. */
@media (min-width: 1024px) {
    .spring-heatmap-section {
        --spring-field-block: clamp(
            8rem,
            calc(var(--rail-block, 100dvh) - (45rem + var(--mask-fade, 2.5rem))),
            12rem
        );
    }
}

/* The overshoot ticks, at their true heights beside the chart. */
.spring-heatmap-y {
    position: relative;
    inline-size: 2.25rem;
    block-size: var(--spring-field-block);
}
.spring-heatmap-y > span {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    line-height: 1;
    white-space: nowrap;
}

/* ── The chart ──
   Its block size is a share of the rail (above); its width is the rail's.
   `container-type: size` gives the ball its `cqw`/`cqh` (both sizes are
   definite). It sits on the pane's own surface: no well, no border, and no
   page ground. `touch-action: pan-y` keeps a vertical swipe a scroll. */
.spring-heatmap {
    block-size: var(--spring-field-block);
    container-type: size;
    touch-action: pan-y;
}
/* Pointer-granted focus is disclosed with the same ring the keyboard gets:
   this slider takes the arrow keys while focused, and must say so. */
.spring-heatmap:focus:not(:focus-visible) {
    box-shadow: var(--focus-ring-shadow);
    outline: none;
}
@media (forced-colors: active) {
    .spring-heatmap:focus:not(:focus-visible) {
        outline: 2px solid Highlight;
        outline-offset: 2px;
    }
}

.spring-heatmap-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
}
.spring-heatmap-curve {
    fill: none;
    stroke: var(--color-progress);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* The baseline (0 %), the 50 % rule and the ζ = 1 upright: hairlines in the
   ink's quiet mixes, the baseline the firmest. */
.spring-heatmap-baseline,
.spring-heatmap-rule {
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;
}
.spring-heatmap-baseline {
    bottom: 0;
    border-top: 1px solid color-mix(in srgb, var(--foreground) 40%, transparent);
}
.spring-heatmap-rule {
    border-top: 1px dotted color-mix(in srgb, var(--foreground) 22%, transparent);
}
.spring-heatmap-critical {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 1px dashed color-mix(in srgb, var(--foreground) 30%, transparent);
    pointer-events: none;
}

/* The hover's hairline, from the baseline up to the curve. It fades in and
   out on glass's motion tokens, the readout's clock. */
.spring-heatmap-guide {
    position: absolute;
    top: var(--guide-top, 100%);
    bottom: 0;
    border-left: 1px solid color-mix(in srgb, var(--foreground) 45%, transparent);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-fast) var(--ease-standard);
}
.spring-heatmap-guide.is-shown {
    opacity: 1;
}

/* ── The preset marks — a hollow dot on the curve, the name beside it. ── */
.spring-heatmap-pip {
    position: absolute;
    width: 0.45rem;
    height: 0.45rem;
    margin: -0.225rem 0 0 -0.225rem;
    border-radius: var(--radius-circle);
    border: 1.5px solid var(--foreground);
    background: var(--card, transparent);
    pointer-events: none;
}
.spring-heatmap-pip > span {
    position: absolute;
    bottom: 100%;
    margin-bottom: 0.3rem;
    line-height: 1;
    white-space: nowrap;
    color: var(--foreground);
}
.spring-heatmap-pip.is-after > span {
    left: 0.15rem;
}
.spring-heatmap-pip.is-above > span {
    left: 50%;
    translate: -50% 0;
}
/* The ball (0.9rem) sits on the current preset's mark: its name clears the
   ball's radius instead of the mark's. */
.spring-heatmap-pip.is-current > span {
    margin-bottom: 0.5rem;
}
/* KF-C13-01 — at a short chart (the 8rem floor binds on laptop rails) only
   the CURRENT preset keeps its name: the preset tiles above already name
   every preset, and the hollow marks stay as the marks they are. The query
   reads the chart's own block size. */
@container (max-height: 10rem) {
    .spring-heatmap-pip:not(.is-current) > span {
        display: none;
    }
}

/* ── The ball — the live spring, ON the curve: the demo's ball (violet,
   ringed in the card's ground so it stays legible over the curve and its
   area). Anchored at the chart's top-left; the transform carries it. ── */
.spring-heatmap-marker {
    position: absolute;
    top: 0;
    left: 0;
    width: 0.9rem;
    height: 0.9rem;
    margin-left: -0.45rem;
    margin-top: -0.45rem;
    border-radius: var(--radius-circle);
    border: 2px solid var(--card, var(--surface-tint-4));
    background: var(--color-progress);
    pointer-events: none;
    will-change: transform;
    z-index: var(--z-content);
}

/* ── The caption slot (owner-1112 hover law) — the live reading and the
   hover reading share ONE grid cell and cross-fade; no box moves. ── */
.spring-heatmap-caption {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    justify-items: end;
}
.spring-heatmap-caption > * {
    grid-area: 1 / 1;
    white-space: nowrap;
    transition: opacity var(--duration-fast) var(--ease-standard);
}
.spring-heatmap-readout {
    opacity: 0;
}
.spring-heatmap-caption[data-reading] > .spring-heatmap-legend {
    opacity: 0;
}
.spring-heatmap-caption[data-reading] > .spring-heatmap-readout {
    opacity: 1;
}
</style>
