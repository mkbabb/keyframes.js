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
        <!-- X.KF.W13V.y (OA-51; DESIGN-NOTE N-5) — ONE title line, and the y
             axis named beside it (the ζ ticks run down the plot's left edge).
             The live (response, ζ) is NOT restated here — the param rows above
             show it; it stays the field's accessible description (sr-only). -->
        <div class="flex items-baseline justify-between gap-2 whitespace-nowrap">
            <span class="text-small font-medium text-foreground" data-figure-title>Peak overshoot</span>
            <span class="text-caption text-muted-foreground" aria-hidden="true">damping ζ ↕</span>
            <span :id="readoutId" class="sr-only">
                {{ response.toFixed(2) }} s / ζ {{ dampingFraction.toFixed(2) }}
            </span>
        </div>

        <div class="spring-heatmap-plot">
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
                <span
                    class="spring-heatmap-regime spring-heatmap-regime--under text-caption text-muted-foreground"
                    :style="{ top: CRITICAL_TOP }"
                    aria-hidden="true"
                >
                    underdamped · rings
                </span>

                <!-- The four presets, plotted where they live (the Chips below
                     stay the ONE preset surface; these are marks, not controls;
                     the name sits above the dot). -->
                <span
                    v-for="pip in PRESET_PIPS"
                    :key="pip.name"
                    class="spring-heatmap-pip"
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

        <!-- The legend — ONE line (N-5): the ramp, its scale, and what it
             varies with. -->
        <div class="flex items-center gap-1.5 min-w-0 text-caption text-muted-foreground whitespace-nowrap" data-figure-legend>
            <span class="spring-heatmap-swatch shrink-0" aria-hidden="true"></span>
            <span class="truncate tabular-nums" title="Peak overshoot varies with damping ζ only; response sets the tempo, not the peak">0 → {{ OVERSHOOT_MAX_PERCENT }} % overshoot · set by damping alone</span>
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

const accentMix = (mix: number): string =>
    `color-mix(in oklab, var(--color-progress) ${mix}%, var(--background))`;

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
}));

/** ζ = 1 — the critical line's y, from the top. */
export const CRITICAL_TOP = `${((1 - axisFraction(1, DAMPING_AXIS)) * 100).toFixed(3)}%`;

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
const streaming = ref(false);
let glideMs = 0;
let lastWriteAt = Number.NEGATIVE_INFINITY;
onMounted(() => {
    const marker = markerEl.value;
    if (!marker) return;
    glideMs = (Number.parseFloat(getComputedStyle(marker).transitionDuration) || 0) * 1000;
});
watch([response, dampingFraction], () => {
    const now = performance.now();
    streaming.value = now - lastWriteAt < glideMs;
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
    write(r, d);
}

function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || !e.isPrimary || activePointer !== null) return;
    activePointer = e.pointerId;
    fieldEl.value?.setPointerCapture(e.pointerId);
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
}

function onPointerRelease(e: PointerEvent): void {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
}

function onPointerLeave(): void {
    if (activePointer === null) hoverCell.value = null;
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
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 0.375rem;
    row-gap: 0.125rem;
}
.spring-heatmap-x {
    grid-column: 2;
}
.spring-heatmap-section {
    --spring-field-block: 12rem;
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
    background-color: var(--background);
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
.spring-heatmap-tag {
    position: absolute;
    left: 0.5rem;
    bottom: 0.1875rem;
    line-height: 1;
    white-space: nowrap;
}
/* Top-left names the calm end; the ringing end is named right under the line,
   right-aligned — the pips' names sit ABOVE their dots, so the two never meet. */
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
    margin-top: 0.3125rem;
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
    margin-bottom: 0.1875rem;
    line-height: 1;
    white-space: nowrap;
    color: var(--foreground);
}

/* ── The hover cell — the lattice, surfaced. ── */
.spring-heatmap-cell {
    position: absolute;
    outline: 1px solid color-mix(in srgb, var(--foreground) 55%, transparent);
    outline-offset: -1px;
    pointer-events: none;
}

/* ── The marker — a ringed dot on the live (response, ζ); lifts above the
   field with a soft glow so it stays legible over the saturated bands. Anchored
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
    box-shadow:
        0 0 0 1.5px color-mix(in srgb, var(--color-progress) 70%, transparent),
        0 0 8px color-mix(in srgb, var(--color-progress) 55%, transparent);
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
