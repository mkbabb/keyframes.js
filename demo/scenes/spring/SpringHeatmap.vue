<template>
    <!-- ── P.W6 S3 — THE SPRING PARAMETER FIELD ──────────────────────────────
         A (response × damping) field the designer navigates: click, sweep or
         arrow across it and the live spring takes that (response, ζ). The tint
         is the EXACT closed-form peak overshoot of the damped harmonic
         oscillator, `exp(-ζπ / √(1-ζ²))` — a function of ζ ALONE (response sets
         ω₀ = 2π/response and scales the time axis, never the peak), so the field
         SAYS so: the tint is painted as horizontal bands, one per damping node,
         and the legend states what varies with what. The four canonical presets
         are plotted where they live. KISS: one CSS background + one pointer
         gesture + one marker — no canvas, no rAF, no object lifecycle.

         X.KF.W11.f — the field decision (kf-SpringHeatmap D-B1 · D-B2 · D-M8 ·
         D-M1) is written in the wave's evidence BEFORE this file was touched;
         this header describes what ships, the evidence says why. -->
    <div class="spring-heatmap-section grid gap-2">
        <!-- X.KF.W13V.y (OA-51; DESIGN-NOTE N-5) — ONE title line, and the
             field's legend beside it (X-DS pass 3; the y axis is named on its
             own ticks, below).
             The live (response, ζ) is NOT restated here — the param rows above
             show it; it stays the field's accessible description (sr-only). -->
        <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 whitespace-nowrap">
            <span class="text-small font-medium text-foreground" data-figure-title>Peak overshoot</span>
            <!-- X.KF.W13X.spring (UIA-KF-308) — while the pointer hovers the
                 field, the legend yields to what a click there would
                 write: '(r, ζ) → peak %'. It reverts on leave. -->
            <span
                v-if="hoverNode"
                class="text-caption text-foreground tabular-nums"
                data-heatmap-hover
                aria-hidden="true"
            >{{ hoverNode.r.toFixed(2) }} s · ζ {{ hoverNode.d.toFixed(2) }} → {{ Math.round(overshoot(hoverNode.d) * 100) }} %</span>
            <!-- X-DS pass 3 · KF-C3-06 — the legend rides the caption row (it
                 was the scroller's last row at rest, so the rail's end fade
                 ate it to ~1.7:1); KF-C3-11 — the ζ axis title went to its
                 axis, so this slot was free. -->
            <span v-else class="flex items-center gap-1.5 min-w-0 text-caption text-muted-foreground" data-figure-legend>
                <span class="spring-heatmap-swatch shrink-0" aria-hidden="true"></span>
                <span class="min-w-0 tabular-nums" title="Peak overshoot varies with damping ζ only; response sets the tempo, not the peak">0 → {{ OVERSHOOT_MAX_PERCENT }} % overshoot · set by damping alone</span>
            </span>
            <span :id="readoutId" class="sr-only">
                {{ response.toFixed(2) }} s / ζ {{ dampingFraction.toFixed(2) }}
            </span>
        </div>

        <div class="spring-heatmap-plot">
            <!-- KF-C3-11 — the y axis's title sits ON its axis, read along it
                 (the x axis's "response (s) →" is seated the same way); the
                 axis shows its own direction, so no arrow. -->
            <span class="spring-heatmap-y-title text-caption text-muted-foreground" aria-hidden="true">damping ζ</span>
            <!-- The ζ axis — ticks at their true positions (the top is calm,
                 the bottom rings). -->
            <div class="spring-heatmap-zeta text-caption text-muted-foreground tabular-nums" aria-hidden="true">
                <span v-for="tick in ZETA_TICKS" :key="tick.label" :style="{ top: tick.top }">
                    {{ tick.label }}
                </span>
            </div>

            <!-- The field. `role="application"` keeps the arrow keys with the
                 widget in screen-reader browse mode; the readout above is its
                 accessible description, and the live region inside announces
                 the writes THIS field makes (the sliders announce their own).
                 The demo-owned `kf-focus-ring` draws the keyboard ring; the
                 scoped `:focus` arm below draws the SAME ring after a pointer
                 grants focus, because a widget that swallows the arrow keys
                 while focused must show that it has focus. -->
            <div
                ref="fieldEl"
                class="spring-heatmap kf-focus-ring relative select-none cursor-crosshair rounded-md"
                role="application"
                :aria-label="FIELD_LABEL"
                :aria-describedby="readoutId"
                tabindex="0"
                :style="{ backgroundImage: FIELD_RAMP }"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerRelease"
                @pointercancel="onPointerRelease"
                @lostpointercapture="onPointerRelease"
                @pointerleave="onPointerLeave"
                @keydown="onKeydown"
            >
                <span class="sr-only" aria-live="polite">{{ announced }}</span>

                <!-- The critical line — the boundary between the two regimes,
                     drawn at ζ = 1's true y; the regime labels sit ON the
                     vertical axis they describe, either side of it. -->
                <span class="spring-heatmap-critical" :style="{ top: CRITICAL_TOP }" aria-hidden="true">
                    <span class="spring-heatmap-tag text-caption text-muted-foreground">ζ = 1 · critical</span>
                </span>
                <span class="spring-heatmap-regime spring-heatmap-regime--over text-caption text-muted-foreground" aria-hidden="true">
                    overdamped · no overshoot
                </span>
                <!-- X-DS pass 10 (KF-C10-05b) — the ringing regime is named IN
                     its field (right, at the underdamped band's middle), not
                     under the rule, where it sat beside gentle's pip on ζ = 1
                     and read as a second name for that dot. -->
                <span
                    class="spring-heatmap-regime spring-heatmap-regime--under text-caption text-muted-foreground"
                    :style="{ top: UNDER_TAG_TOP }"
                    aria-hidden="true"
                >
                    underdamped · rings
                </span>

                <!-- The four presets, plotted where they live (the Chips below
                     stay the ONE preset surface; these are marks, not controls).
                     X-DS pass 4 (KF-C4-10) — each name sits on the side of its dot
                     AWAY from the critical line: above for ζ ≥ 1, below for an
                     underdamped preset, so no name is ever crossed by the rule. -->
                <span
                    v-for="pip in PRESET_PIPS"
                    :key="pip.name"
                    class="spring-heatmap-pip"
                    :class="{ 'is-current': pip.name === currentPipName, 'is-under': pip.under }"
                    :style="{ left: pip.left, top: pip.top }"
                    aria-hidden="true"
                >
                    <span class="text-caption">{{ pip.name }}</span>
                </span>

                <!-- The lattice cell under the pointer — the node a click would
                     write, shown before it is written. -->
                <span
                    v-if="hoverCell"
                    class="spring-heatmap-cell"
                    :style="hoverCell"
                    aria-hidden="true"
                ></span>

                <!-- The live marker — the current (response, ζ). An isolated
                     write glides; a STREAM of writes (a slider drag, a key-repeat,
                     this field's own sweep) is tracked 1:1, so the tracker never
                     trails the gesture. -->
                <span
                    ref="markerEl"
                    class="spring-heatmap-marker"
                    :class="{ 'is-streaming': streaming }"
                    :style="markerStyle"
                    aria-hidden="true"
                ></span>
            </div>

            <!-- The response axis. -->
            <div class="spring-heatmap-x flex items-baseline justify-between gap-2 text-caption text-muted-foreground tabular-nums" aria-hidden="true">
                <span>{{ RESPONSE_AXIS.min.toFixed(1) }} s</span>
                <span>response (s) →</span>
                <span>{{ RESPONSE_AXIS.max.toFixed(1) }} s</span>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
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

/** The ramp's SCALE — linear in overshoot, normalised to the field's own
 *  maximum: 0 % of the accent at no overshoot, 100 % at the bottom edge. */
export function rampMix(zeta: number): number {
    return Math.round((overshoot(zeta) / OVERSHOOT_MAX) * 100);
}

/** The damping nodes, TOP → BOTTOM (ζ 1.5 → 0.2): one band each. */
export function dampingNodesTopDown(): number[] {
    const n = axisNodes(DAMPING_AXIS);
    return Array.from({ length: n + 1 }, (_, j) => nodeValue(n - j, DAMPING_AXIS));
}

// X.KF.W13X.spring (UIA-KF-307) — the ramp mixes into the glass well tint
// `--surface-tint-4`, never `--background`: the page ground painted a
// near-black slab on the warm card in dark.
const accentMix = (mix: number): string =>
    `color-mix(in oklab, var(--color-progress) ${mix}%, var(--surface-tint-4))`;

/**
 * The field's paint — ONE `linear-gradient` of hard-stopped bands, one per
 * damping node, each spanning ± half a pitch around its node (the end bands are
 * half-height). The band IS the lattice row: the tint under the pointer is the
 * overshoot of the value a click writes. The tokens resolve in the cascade, so
 * a theme flip re-tints for free — nothing to re-bake, no race to lose.
 */
export function buildFieldRamp(): string {
    const nodes = dampingNodesTopDown();
    const n = nodes.length - 1;
    const boundary = (j: number): number => clamp(((j + 0.5) / n) * 100, 0, 100);
    const stops = nodes.map((zeta, j) => {
        const from = j === 0 ? 0 : boundary(j - 1);
        const to = j === n ? 100 : boundary(j);
        return `${accentMix(rampMix(zeta))} ${from.toFixed(3)}% ${to.toFixed(3)}%`;
    });
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export const FIELD_RAMP = buildFieldRamp();

/** The four presets' positions on the field, as CSS percentages. */
export const PRESET_PIPS = SPRING_PRESETS.map((preset) => ({
    name: preset.name,
    left: `${(axisFraction(preset.response, RESPONSE_AXIS) * 100).toFixed(3)}%`,
    top: `${((1 - axisFraction(preset.dampingFraction, DAMPING_AXIS)) * 100).toFixed(3)}%`,
    /** Underdamped (ζ < 1): the dot sits below the critical line. */
    under: preset.dampingFraction < 1,
}));

/** ζ = 1 — the critical line's y, from the top. */
export const CRITICAL_TOP = `${((1 - axisFraction(1, DAMPING_AXIS)) * 100).toFixed(3)}%`;

/** X-DS pass 10 (KF-C10-05b) — the ringing regime's tag: the middle of the
 *  underdamped band (between ζ = 1 and the axis floor), a region's centre,
 *  clear of the rule and of gentle's pip on it. */
export const UNDER_TAG_TOP = `${((1 - axisFraction(1, DAMPING_AXIS) / 2) * 100).toFixed(3)}%`;

const ZETA_TICKS = [
    { label: DAMPING_AXIS.max.toFixed(1), top: "0%" },
    { label: "1.0", top: CRITICAL_TOP },
    { label: DAMPING_AXIS.min.toFixed(1), top: "100%" },
];

const FIELD_LABEL =
    `Spring parameter field — response ${RESPONSE_AXIS.min} to ${RESPONSE_AXIS.max} s across, ` +
    `damping ζ ${DAMPING_AXIS.max} at the top to ${DAMPING_AXIS.min} at the bottom. ` +
    `Click, sweep or use the arrow keys to move by ${LATTICE.pitch}; the sliders above set exact values.`;
</script>

<script setup lang="ts">
import { computed, onMounted, ref, useId, useTemplateRef, watch } from "vue";

// ── The contract — two models, the same two refs the facet's sliders write
// through their own declared `@update:model-value`. Instantiable with two
// numbers; nothing else of the scene is read. ──────────────────────────────────
const response = defineModel<number>("response", { required: true });
const dampingFraction = defineModel<number>("dampingFraction", { required: true });

const fieldEl = useTemplateRef<HTMLElement>("fieldEl");
const markerEl = useTemplateRef<HTMLElement>("markerEl");
const readoutId = useId();

/** What this field announces after a write it made (the sliders announce theirs). */
const announced = ref("");

/** Write both params (only the ones that changed) and announce the result. */
function write(r: number, d: number): void {
    if (r !== response.value) response.value = r;
    if (d !== dampingFraction.value) dampingFraction.value = d;
    announced.value = `${r.toFixed(2)} s, ζ ${d.toFixed(2)}`;
}

// ── The marker — positioned by `transform: translate(<cqw>, <cqh>)` against the
// field (`container-type: size`); the same content box the pointer reads and the
// background paints. Compositor-only, so the glide never touches layout. ───────
const markerStyle = computed(() => {
    const x = axisFraction(response.value, RESPONSE_AXIS) * 100;
    const y = (1 - axisFraction(dampingFraction.value, DAMPING_AXIS)) * 100;
    return { transform: `translate(${x}cqw, ${y}cqh)` };
});

// ── Streams vs isolated writes (N-SH-3) — a write that lands within one glide
// of the previous one is part of a gesture (a slider drag, a key-repeat, this
// field's own sweep) and is tracked 1:1; an isolated write glides. The glide's
// duration is read ONCE from the marker's own computed style — the token's
// value, never a duplicated literal. ────────────────────────────────────────────
// X.KF.W13X.spring (KFA-154) — this field's OWN sweep is a stream from its
// pointerdown to its release, declared by the gesture rather than inferred from
// the clock: inferred, the sweep's first write glided (no previous write to be
// within a glide of), the next switched to 1:1 and the marker jumped ~240 px,
// and a stall mid-drag could flip it back to a glide.
const streaming = ref(false);
let gestureStreaming = false;
let glideMs = 0;
let lastWriteAt = Number.NEGATIVE_INFINITY;
onMounted(() => {
    const marker = markerEl.value;
    if (!marker) return;
    glideMs = (Number.parseFloat(getComputedStyle(marker).transitionDuration) || 0) * 1000;
});
watch([response, dampingFraction], () => {
    const now = performance.now();
    streaming.value = gestureStreaming || now - lastWriteAt < glideMs;
    lastWriteAt = now;
});

// ── ONE coordinate space — the field's CONTENT box: the box `cqw`/`cqh` resolve
// against, the box the background paints, and (rect + clientLeft/Top, clientWidth/
// Height) the box the pointer is read in. ──────────────────────────────────────
function fieldFractions(clientX: number, clientY: number): { fx: number; fy: number } | null {
    const field = fieldEl.value;
    if (!field) return null;
    const w = field.clientWidth;
    const h = field.clientHeight;
    if (w <= 0 || h <= 0) return null;
    const rect = field.getBoundingClientRect();
    return {
        fx: clamp((clientX - rect.left - field.clientLeft) / w, 0, 1),
        fy: clamp((clientY - rect.top - field.clientTop) / h, 0, 1),
    };
}

/** The lattice node under a field position: (response, ζ), both on nodes. */
function nodeAt(fx: number, fy: number): { r: number; d: number } {
    return {
        r: snapToAxis(fx, RESPONSE_AXIS),
        d: snapToAxis(1 - fy, DAMPING_AXIS),
    };
}

// ── The hover cell — the lattice cell around the node a click would write,
// clipped at the field's edges. ────────────────────────────────────────────────
const hoverCell = ref<{ left: string; top: string; width: string; height: string } | null>(null);
/** UIA-KF-308 — the node under the pointer, read out in the header. */
const hoverNode = ref<{ r: number; d: number } | null>(null);

/** UIA-KF-308 — the preset the live params sit on: the marker covers its pip,
 *  so that pip's name steps aside rather than print under the marker. */
const currentPipName = computed(
    () =>
        SPRING_PRESETS.find(
            (p) =>
                Math.abs(p.response - response.value) < 1e-6 &&
                Math.abs(p.dampingFraction - dampingFraction.value) < 1e-6,
        )?.name,
);

function cellStyle(r: number, d: number) {
    const cols = axisNodes(RESPONSE_AXIS);
    const rows = axisNodes(DAMPING_AXIS);
    const k = nodeIndex(r, RESPONSE_AXIS);
    const j = rows - nodeIndex(d, DAMPING_AXIS); // from the top
    const x0 = clamp((k - 0.5) / cols, 0, 1);
    const x1 = clamp((k + 0.5) / cols, 0, 1);
    const y0 = clamp((j - 0.5) / rows, 0, 1);
    const y1 = clamp((j + 0.5) / rows, 0, 1);
    return {
        left: `${(x0 * 100).toFixed(3)}%`,
        top: `${(y0 * 100).toFixed(3)}%`,
        width: `${((x1 - x0) * 100).toFixed(3)}%`,
        height: `${((y1 - y0) * 100).toFixed(3)}%`,
    };
}

// ── The gesture — one primary pointer, latched by id, captured for the sweep.
// `touch-action: none` (the scoped block) declares the pan as this gesture, so a
// touch that begins on the field navigates and never scrolls the panel. ────────
let activePointer: number | null = null;

function navigate(e: PointerEvent): void {
    const f = fieldFractions(e.clientX, e.clientY);
    if (!f) return;
    const { r, d } = nodeAt(f.fx, f.fy);
    hoverCell.value = cellStyle(r, d);
    hoverNode.value = { r, d };
    write(r, d);
}

function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || !e.isPrimary || activePointer !== null) return;
    activePointer = e.pointerId;
    fieldEl.value?.setPointerCapture(e.pointerId);
    gestureStreaming = true;
    streaming.value = true;
    navigate(e);
    fieldEl.value?.focus();
}

function onPointerMove(e: PointerEvent): void {
    if (activePointer !== null) {
        if (e.pointerId === activePointer) navigate(e);
        return;
    }
    const f = fieldFractions(e.clientX, e.clientY);
    if (!f) return;
    const { r, d } = nodeAt(f.fx, f.fy);
    hoverCell.value = cellStyle(r, d);
    hoverNode.value = { r, d };
}

function onPointerRelease(e: PointerEvent): void {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    gestureStreaming = false;
}

function onPointerLeave(): void {
    if (activePointer === null) {
        hoverCell.value = null;
        hoverNode.value = null;
    }
}

// ── The keys — a bare arrow steps ONE pitch along one axis and is CLAIMED for
// that keypress (`preventDefault` + `stopPropagation` — the KF-SS-30 precedent:
// a widget that has taken a key owns it; the window shortcut registry never
// checks `defaultPrevented`). A modified arrow is NOT handled: Alt/Meta/Ctrl/
// Shift+Arrow reach the browser and the registry exactly as from any other
// element, so history-back, word-nav and the transport's own large scrub keep
// their meanings. ─────────────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent): void {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    let r = response.value;
    let d = dampingFraction.value;
    switch (e.key) {
        case "ArrowRight":
            r = stepOnAxis(r, 1, RESPONSE_AXIS);
            break;
        case "ArrowLeft":
            r = stepOnAxis(r, -1, RESPONSE_AXIS);
            break;
        case "ArrowUp":
            d = stepOnAxis(d, 1, DAMPING_AXIS); // up = more damping, toward the calm top
            break;
        case "ArrowDown":
            d = stepOnAxis(d, -1, DAMPING_AXIS);
            break;
        default:
            return;
    }
    e.preventDefault();
    e.stopPropagation();
    write(r, d);
}
</script>

<style scoped>
/* ── The plot: a ζ gutter, the field, the response axis under it. ── */
.spring-heatmap-plot {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    column-gap: 0.375rem;
    row-gap: 0.125rem;
}
.spring-heatmap-x {
    grid-column: 3;
}
/* KF-C3-11 — the y-axis title, read bottom-to-top along the ζ ticks. */
.spring-heatmap-y-title {
    writing-mode: vertical-rl;
    rotate: 180deg;
    align-self: center;
    line-height: 1;
    white-space: nowrap;
}
.spring-heatmap-section {
    --spring-field-block: 12rem;
}
/* X-DS pass 11 (KF-C11-05) — THE FIGURE TAKES A SHARE OF THE RAIL, as the
   easing plot does (KF-C9-10). The 12rem field ran the pane's scroll fold
   through its own axis at 1440x900 (the ζ tick '0.2' halved, the response
   axis hidden), so the figure read as cropped. The pane's scroll body is the
   rail less 15rem (the transport and the frame; measured 240-241 px at five
   laptop sizes), and the facet's chrome above the field plus the response
   axis under it and a half-rung of clearance is 18.5rem (260-265 + 21 + 8 px).
   12rem stays the cap (the regime tags and pips were sized for it); 8rem is
   the floor, where the rail is too short to hold the figure whole. */
@media (min-width: 1024px) {
    .spring-heatmap-section {
        --spring-field-block: clamp(8rem, calc(var(--rail-block, 100dvh) - 33.5rem), 12rem);
    }
}

/* X.KF.W13V.y (OA-49 "space used by the subject, not by chrome"; R-c-1) — the
   field's block size is the facet's largest single spend: 12rem keeps every
   regime tag, pip and the critical line legible while the facet's params,
   figure and presets share the bounded rail. The tick column mirrors it. */
.spring-heatmap-zeta {
    position: relative;
    inline-size: 1.5rem;
    block-size: var(--spring-field-block);
}
.spring-heatmap-zeta > span {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    line-height: 1;
}

/* ── The field ──
   Its size is a LAYOUT choice, stated as one: the rail's content width by 16rem.
   Seconds and a dimensionless ratio share no unit, so no aspect is "true" and
   none is claimed. The tint rides `--color-progress` — the motion accent — mixed
   into `--background` (the ramp is the inline `background-image`; the colour
   here is the 0 % band, so the box is painted before the gradient resolves).
   The boundary is a foreground mix that clears 3:1 against BOTH the field's own
   0 % fill and the card in both themes (WCAG 1.4.11; the battery is in the
   wave's evidence). `container-type: size` cannot collapse a box whose block
   AND inline sizes are definite. `touch-action: none` declares the sweep. */
.spring-heatmap {
    block-size: var(--spring-field-block);
    border: 1px solid color-mix(in srgb, var(--foreground) 50%, transparent);
    /* UIA-KF-307 — the 0 % band is the well tint, not the page ground. */
    background-color: var(--surface-tint-4);
    container-type: size;
    touch-action: none;
}
/* Pointer-granted focus is disclosed with the same ring the keyboard gets:
   this widget swallows the arrow keys while focused, and must say so. */
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

/* ── The critical line and the regime labels — the vertical legend. ── */
.spring-heatmap-critical {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed color-mix(in srgb, var(--foreground) 45%, transparent);
    pointer-events: none;
}
/* X-DS pass 4 (KF-C4-10) — the tag stands clear of its rule: bottom-anchored
   to the line with a descender's clearance (`ζ` descends below the baseline). */
.spring-heatmap-tag {
    position: absolute;
    left: 0.5rem;
    bottom: 0.375rem;
    line-height: 1;
    white-space: nowrap;
}
/* Top-left names the calm end; the ringing end is named right-aligned at the
   middle of its band (X-DS pass 10, KF-C10-05b: it was anchored right under
   the critical line, beside gentle's pip). Each tag labels a REGION, on the
   side no underdamped preset occupies (their responses sit left of 0.6 s). */
.spring-heatmap-regime {
    position: absolute;
    white-space: nowrap;
    line-height: 1;
    pointer-events: none;
}
.spring-heatmap-regime--over {
    top: 0.375rem;
    left: 0.5rem;
}
.spring-heatmap-regime--under {
    right: 0.5rem;
    transform: translateY(-50%);
}

/* ── The preset pips — a hollow dot on the point, the name above it. ── */
.spring-heatmap-pip {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    margin: -0.2rem 0 0 -0.2rem;
    border-radius: var(--radius-pill, 9999px);
    border: 1.5px solid var(--foreground);
    background: var(--background);
    pointer-events: none;
}
.spring-heatmap-pip > span {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.375rem;
    line-height: 1;
    white-space: nowrap;
    color: var(--foreground);
}
.spring-heatmap-pip.is-under > span {
    bottom: auto;
    top: 100%;
    margin-bottom: 0;
    margin-top: 0.25rem;
}
/* X-DS pass 10 (KF-C10-05a) — the current preset KEEPS its name, in the
   foreground ink every pip name wears (UIA-KF-308 hid it, so the selected
   point was the one unnamed preset). The violet marker (0.9rem) sits on the
   pip, so the name clears the marker's radius instead of the pip's. */
.spring-heatmap-pip.is-current > span {
    margin-bottom: 0.5rem;
}
.spring-heatmap-pip.is-current.is-under > span {
    margin-bottom: 0;
    margin-top: 0.5rem;
}

/* ── The hover cell — the lattice, surfaced. ── */
.spring-heatmap-cell {
    position: absolute;
    outline: 1px solid color-mix(in srgb, var(--foreground) 55%, transparent);
    outline-offset: -1px;
    pointer-events: none;
}

/* ── The marker — a solid dot on the live (response, ζ), ringed in the page
   ground so it stays legible over the saturated bands (X-DS pass 1, KF-P1-09:
   the 8px glow is deleted; C1, KF-C1-18: the tinted 1.5px outer ring, the
   halo's leftover, is deleted too — one disc, one separating edge). Anchored
   at the field's top-left; `translate(<cqw>, <cqh>)` carries the position and
   the negative margins centre the 0.9rem dot on it. The glide rides
   `transform` (compositor-only) and is switched OFF during a stream. ── */
.spring-heatmap-marker {
    position: absolute;
    top: 0;
    left: 0;
    width: 0.9rem;
    height: 0.9rem;
    margin-left: -0.45rem;
    margin-top: -0.45rem;
    border-radius: var(--radius-pill, 9999px);
    border: 2px solid var(--background);
    background: var(--color-progress);
    pointer-events: none;
    transition: transform var(--duration-fast) var(--ease-standard);
    will-change: transform;
    z-index: var(--z-content);
}
.spring-heatmap-marker.is-streaming {
    transition: none;
}

@media (prefers-reduced-motion: reduce) {
    .spring-heatmap-marker {
        transition: none;
    }
}

/* ── The legend swatch — the same two colours, the same interpolation space:
   the exact continuous form of the banded field. ── */
.spring-heatmap-swatch {
    display: inline-block;
    inline-size: 3rem;
    block-size: 0.5rem;
    border-radius: var(--radius-pill, 9999px);
    border: 1px solid color-mix(in srgb, var(--foreground) 30%, transparent);
    background: linear-gradient(
        in oklab to right,
        color-mix(in oklab, var(--color-progress) 0%, var(--background)),
        color-mix(in oklab, var(--color-progress) 100%, var(--background))
    );
}
</style>
