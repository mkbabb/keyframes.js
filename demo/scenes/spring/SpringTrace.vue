<template>
    <!-- ── L.W11 S6 — the linear() PLOT. `useSpringLinearStops()` (the engine's
         own `springLinearStops()` emitter) is resolved by the CSS linear() rule
         and drawn as a trace: the position crests OVER the y=1 target line (the
         overshoot is `y > 1`, right there in the data) and rings back for ζ<1.
         Colocated sub-unit of SpringTarget (the natural concern seam: resolve +
         draw). The shared emitter is the only thing this plot and
         StartingStyleTarget's `starting-style` artifact have in common; the two
         are never on screen together (KF.W6 L-4/C-8).

         X.KF.W11.e — THE INSTRUMENT-TRUTH CORE (kf-SpringTrace D-1 + N-1 + N-2 +
         C-2/L-3, one family). The x-axis is TIME, in milliseconds: the emitter
         normalizes its stops over `maxDuration = 4 × response`, which is exactly
         why the plotted SHAPE is invariant to `response` (ω·tᵢ = 8πi/25 — response
         cancels) while ζ alone bends it. Labelling the axis in the unit the engine
         samples in is what makes the first slider's effect visible where it acts:
         the terminal label moves, the curve does not. The graticule is labelled
         (D-6): `1` on the target line, `0` on the baseline, `0` and the horizon on
         the time axis. -->
    <div class="w-full max-w-3xl shrink-0">
        <!-- The header row takes the sibling row's `mb-2` (SpringTarget's sweep
             header) — one label-row idiom, one spacing (D-9) — and that 8 px gap is
             also where the trace's glow lands at the ζ floor (D-13): the drawn peak
             sits 0.67 px under the frame's top edge after the half-stroke, so the
             ≤3 px glow extent overruns a 4 px gap and fits inside this one. -->
        <div class="flex items-center justify-between mb-2">
            <!-- D-11 — the primary slot names the plot; it no longer dresses the
                 invariant stop count as a live readout (the count is a fact about
                 the sampling grid and lives on the time axis, below). -->
            <span class="text-small text-foreground">
                <span class="code-token">linear()</span> trace
            </span>
            <!-- D-2/N-4 — `.code-token` is the demo's case-preserving mono register:
                 `text-mono-caption` sets `text-transform: uppercase` at the installed
                 pin and rendered this ζ as Ζ (U+0396). `tabular-nums` stays (the
                 mono contract's clause (b) licence). D-10 — the live readout wears the
                 scene accent, as the sibling row's does; the label stays quieter. -->
            <span class="readout-accent code-token tabular-nums">
                ζ {{ dampingFraction.toFixed(2) }} · peak {{ peak.toFixed(3) }}
            </span>
        </div>
        <!-- One figure for assistive tech: the plot's quantity as a sentence computed
             over the resolved points (never over the mapped {x, y} — K-5), with the
             marks and tick labels presentational beneath it. -->
        <div role="img" :aria-label="figureLabel">
            <div class="plot-frame">
                <!-- Layer 1 — the reference geometry, NEUTRAL (D-3/D-4/N-3, the
                     EasingTarget sparkline precedent): the data hue belongs to the
                     trace alone, both lines clear SC 1.4.11 in both theme arms, and
                     each is named by a tick label so no channel is colour alone. The
                     line geometry is BOUND to the same constants the mapping uses
                     (L-5) — one source of truth for where value 1 and value 0 are. -->
                <svg
                    class="plot-layer"
                    :viewBox="viewBox"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <line
                        x1="0"
                        :y1="PLOT.yTarget"
                        :x2="PLOT.width"
                        :y2="PLOT.yTarget"
                        class="plot-target-line"
                    />
                    <line
                        x1="0"
                        :y1="PLOT.yZero"
                        :x2="PLOT.width"
                        :y2="PLOT.yZero"
                        class="plot-baseline"
                    />
                </svg>
                <!-- Layer 2 — the data alone, so the glow can be declared on THIS
                     element (a CSS box: filter lengths are CSS px) rather than on the
                     path inside a `preserveAspectRatio="none"` user space that is
                     scaled ~7.7× horizontally and ~1.2× vertically at the 768 px
                     measure (L-8). The stroke is pinned to device px by
                     `non-scaling-stroke`; the glow now lives in the same space. -->
                <svg
                    class="plot-layer plot-data"
                    :viewBox="viewBox"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path :d="tracePath" class="plot-trace" />
                </svg>
                <!-- D-6 — the value-axis labels, in HTML (an SVG `<text>` under
                     `preserveAspectRatio="none"` would stretch with the box), placed
                     from the SAME constants as the lines: `1` above the target line at
                     the left, where the trace has not yet risen; `0` above the
                     baseline at the right, where the trace has settled at 1. -->
                <span
                    class="plot-tick plot-tick--value code-token tabular-nums text-muted-foreground"
                    :style="{ top: targetTop, left: 0 }"
                    aria-hidden="true"
                >1</span>
                <span
                    class="plot-tick plot-tick--value code-token tabular-nums text-muted-foreground"
                    :style="{ top: zeroTop, right: 0 }"
                    aria-hidden="true"
                >0</span>
            </div>
            <!-- The time axis (N-1's cure). The horizon is the one figure `response`
                 moves, so it wears the live-readout accent; the origin and the grid
                 caption stay muted. -->
            <div class="flex items-baseline justify-between mt-1" aria-hidden="true">
                <span class="plot-tick code-token tabular-nums text-muted-foreground">0</span>
                <span class="text-caption text-muted-foreground">time · {{ points.length }} stops</span>
                <span class="plot-tick readout-accent code-token tabular-nums">{{ horizonMs }} ms</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * THE PLOT'S DERIVATIONS — pure, exported, and tested against the engine's own
 * samples (`test/demo/scenes/spring-trace-truth.test.ts`; kf-SpringTrace L-10).
 * A plain `<script>` block beside the setup block is how an SFC exports a
 * function without a second file (the TimelineHoverPreview idiom).
 */

/** One resolved `linear()` stop: input position `t ∈ [0, 1]`, output value `v`. */
export interface LinearStopPoint {
    t: number;
    v: number;
}

/** `<number>` then zero, one or two `<percentage>`s — the CSS `<linear-stop>`. */
const LINEAR_STOP =
    /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)((?:\s+[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?%){0,2})$/i;

/**
 * Resolve a CSS `linear(...)` string to its stop points by the CSS rule, in the
 * engine's own phase order (`compile/easing/registry.ts` `resolveLinearStops`):
 * (1) a stop with two positions is two coincident stops; (2) a first stop with no
 * position is at 0 and a last stop with no position is at 1 — BEFORE any run is
 * distributed, which is what keeps the emitter's contract ("passes through (0%, 0)
 * and (100%, 1) exactly") true on the plot (D-1); (3) an authored position below
 * the running maximum is clamped up to it; (4) each run of positionless stops is
 * spread evenly between its neighbours.
 *
 * FAIL-EXPLICIT (D-12/L-6/C-4): a token this function cannot read is a
 * `SyntaxError` naming it — never a silent `0` that draws as a legitimate
 * baseline datum — and an EMPTY token is such a token, never dropped (dropping
 * one renumbers every implicit position and rescales the whole curve while
 * still reporting the right count). The emitter is total over this grammar
 * today; the posture is for the day it is not.
 */
export function resolveLinearStopPoints(css: string): LinearStopPoint[] {
    const source = css.trim();
    if (!source.startsWith("linear(") || !source.endsWith(")")) {
        throw new SyntaxError(
            `SpringTrace: expected a CSS linear() function, got ${JSON.stringify(css)}`,
        );
    }
    const stops: { v: number; t: number | undefined }[] = [];
    source
        .slice("linear(".length, -1)
        .split(",")
        .forEach((token, index) => {
            const stop = token.trim();
            const match = LINEAR_STOP.exec(stop);
            if (match === null) {
                throw new SyntaxError(
                    `SpringTrace: stop ${index} ${JSON.stringify(stop)} is not \`<number> <percentage>{0,2}\``,
                );
            }
            const v = Number(match[1]);
            const positions = match[2]!.trim();
            if (positions === "") {
                stops.push({ v, t: undefined });
                return;
            }
            for (const pct of positions.split(/\s+/)) {
                stops.push({ v, t: Number(pct.slice(0, -1)) / 100 });
            }
        });
    if (stops.length < 2) {
        throw new SyntaxError(
            `SpringTrace: linear() needs at least two stops, got ${stops.length}`,
        );
    }

    // (2) anchors, then (3) the monotone clamp, over the positions that exist.
    const last = stops.length - 1;
    const explicit: { index: number; t: number }[] = [];
    let floor = -Infinity;
    stops.forEach((stop, index) => {
        const authored = stop.t ?? (index === 0 ? 0 : index === last ? 1 : undefined);
        if (authored === undefined) return;
        const t = Math.max(floor, authored);
        explicit.push({ index, t });
        floor = t;
    });

    // (4) even distribution inside every run between two explicit positions.
    // `explicit` starts at index 0 and ends at `last` by construction of (2).
    const resolved = new Array<number>(stops.length);
    for (let k = 0; k < explicit.length - 1; k++) {
        const a = explicit[k]!;
        const b = explicit[k + 1]!;
        resolved[a.index] = a.t;
        for (let i = a.index + 1; i < b.index; i++) {
            resolved[i] = a.t + ((b.t - a.t) * (i - a.index)) / (b.index - a.index);
        }
        resolved[b.index] = b.t;
    }
    return stops.map((stop, index) => ({ t: resolved[index]!, v: stop.v }));
}

/**
 * The plot's geometry — ONE source of truth for the viewBox, the value-1 line
 * and the value-0 line (L-5): the template binds its `<line>`s and tick labels
 * to these, and `plotY` maps values through them. The value-1 line sits at 1/3
 * from the top so the overshoot has room to cross above it.
 */
export const PLOT = { width: 100, height: 60, yTarget: 20, yZero: 56 } as const;

/** Value → viewBox y (value 0 at the baseline, value 1 on the target line). */
export const plotY = (v: number): number =>
    PLOT.yZero + (PLOT.yTarget - PLOT.yZero) * v;

/**
 * The emitter's default sampling horizon — `springLinearStops` spreads its
 * stops over `maxDuration = 4 × response` seconds — in milliseconds. This is
 * the coupling N-1's cure rests on; the unit test binds it to the engine by
 * sampling `sampleNormalizedSpring` at `horizon / 25` and requiring the stop
 * values to match.
 */
export const SPRING_HORIZON_PERIODS = 4;
export const springHorizonMs = (response: number): number =>
    Math.round(response * SPRING_HORIZON_PERIODS * 1000);

/** The trace as an SVG path over the plot's viewBox: `t` → x, `v` → `plotY`. */
export const tracePathOf = (points: readonly LinearStopPoint[]): string =>
    points
        .map(
            (p, i) =>
                `${i === 0 ? "M" : "L"} ${(p.t * PLOT.width).toFixed(2)} ${plotY(p.v).toFixed(2)}`,
        )
        .join(" ");
</script>

<script setup lang="ts">
import { computed } from "vue";

import { useSpringLinearStops } from "./useSpringLinearStops";

const props = defineProps<{ response: number; dampingFraction: number }>();

// The `linear(0, 0.234 4.17%, …, 1)` string from the shared emitter (the
// springLinearStops() dogfood — the engine's own), resolved to (t, value) points
// and drawn as an SVG trace. The string round-trip is the OP-4 minimum: the
// engine does not export its numeric stop resolver (`resolveLinearStops`) or its
// sampler (`sampleNormalizedSpring`) yet; when it does, `resolveLinearStopPoints`
// is the one function that goes (C-2/L-3 → C-3, KF.W5/KF.W8).
const linearStops = useSpringLinearStops(
    () => props.response,
    () => props.dampingFraction,
);

const points = computed(() => resolveLinearStopPoints(linearStops.value));
const tracePath = computed(() => tracePathOf(points.value));
const peak = computed(() => Math.max(...points.value.map((p) => p.v)));
const horizonMs = computed(() => springHorizonMs(props.response));

const viewBox = `0 0 ${PLOT.width} ${PLOT.height}`;
const targetTop = `${(PLOT.yTarget / PLOT.height) * 100}%`;
const zeroTop = `${(PLOT.yZero / PLOT.height) * 100}%`;

const figureLabel = computed(
    () =>
        `Spring position over time, ${points.value.length} linear() stops across ` +
        `${horizonMs.value} ms: rises from 0 to the target 1, peaking at ` +
        `${peak.value.toFixed(3)}, at damping ζ ${props.dampingFraction.toFixed(2)}.`,
);
</script>

<style scoped>
/* ── L.W11 S6 — the linear() plot ──
   The spring's position trace drawn from its linear() stops; crosses ABOVE the
   y=1 target line for ζ<1 (the overshoot).

   KF-SS-6 (W6-N, re-homed from KF.W5) — THE TRACE IS VIOLET, NOT RED, and the
   comment said red. The trace reads `--color-progress`, which `style.css`
   points at `--accent-kf` = `light-dark(oklch(0.56 0.17 295), oklch(0.74 0.13
   305))` — hue 295/305, the brand violet, in both themes. "Red" is a leftover
   from the Lane-B era the token re-point retired, and a colour word in a
   comment is the kind of claim a reader trusts without checking; this file's
   own paint is the correction. PRESERVATION LOCK, held: nothing here touches
   the token-level lane pairing (gentle = `--color-progress`, bouncy =
   `--rainbow-violet` — the two physics extremes on the two nearest hues),
   which is a real design decision and survives the prose fix untouched.
   Whether those two hues PERCEPTUALLY collapse stays UNPROVEN and is KF.W9 /
   SS-13's (ΔE_OK 0.15–0.19 ≈ 7–9× JND); this row is the false comment, and it
   is kin to KF-ES-43 / KF-ET-37, never an identity with them.

   X.KF.W11.e — THE REFERENCE GEOMETRY IS NEUTRAL (D-3 + D-4 + N-3). Both lines
   used to wear the data hue at 45 % alpha — hue doing double duty, the settled
   trace collinear with and occluding the target at ζ ≥ 1, and 1.85:1 / 1.34:1
   light, 2.32:1 / 1.41:1 dark against SC 1.4.11's 3:1 (no chromatic mid-tone at
   that alpha can reach it over either card). The EasingTarget sparklines are the
   precedent: neutral by default, accent reserved for the data. At `--foreground`
   55 % the lines read 3.82:1 light / 4.50:1 dark over the producer's `--card`
   arms (this seat's arithmetic; 45 % reads 2.85 light — 55 % is the first rung
   that clears both). */
.plot-frame {
    position: relative;
    width: 100%;
    height: 4.5rem;
}
.plot-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
}
/* The data layer carries the glow (L-8): declared on the `<svg>` box, the
   `drop-shadow` length is CSS px in every engine — isotropic, like the stroke. */
.plot-data {
    filter: drop-shadow(
        0 0 3px color-mix(in srgb, var(--color-progress) 45%, transparent)
    );
}
.plot-target-line,
.plot-baseline {
    stroke: color-mix(in srgb, var(--foreground) 55%, transparent);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
}
/* N-3 — `non-scaling-stroke` performs stroking, dash pattern INCLUDED, in device
   space, so this dasharray is authored in device px on purpose: a 10 px period
   reads as a dash on a 1 px line at every width (the old `3 2` was a 5 px period
   — near-continuous — and the only pattern channel the line had). */
.plot-target-line {
    stroke-dasharray: 6 4;
}
.plot-trace {
    fill: none;
    stroke: var(--color-progress);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
}
/* The tick labels: the value ticks sit just ABOVE their line (translated up by
   their own height from the line's `top`); `line-height: 1` keeps the `1` inside
   the 24 px headroom above the target line at the caption size. */
.plot-tick {
    line-height: 1;
}
.plot-tick--value {
    position: absolute;
    transform: translateY(calc(-100% - 2px));
    pointer-events: none;
}
</style>
