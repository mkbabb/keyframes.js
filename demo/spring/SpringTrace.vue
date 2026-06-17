<template>
    <!-- ── L.W11 S6 — the linear() 26-stop PLOT (the curve drawn, beside its
         string) — the springLinearStops() output the Fira block in the sidebar
         emits, finally PLOTTED: the position trace crests OVER the y=1 target
         line (the overshoot is `y > 1`, right there in the data) and rings back
         for ζ<1. The two readings of one curve — numeral (sidebar) + trace
         (here) — the math made beautifully visible. Colocated sub-unit of
         SpringTarget (the natural concern seam: the plot parse + draw). -->
    <div class="w-full max-w-3xl shrink-0">
        <div class="flex items-center justify-between mb-1">
            <span class="text-small text-foreground">linear() &mdash; {{ linearPlot.length }} stops plotted</span>
            <span class="text-mono-caption text-muted-foreground tabular-nums">
                &zeta; {{ dampingFraction.toFixed(2) }}
            </span>
        </div>
        <svg
            class="spring-linear-plot"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <!-- the y=1 target line every trace is measured against -->
            <line x1="0" y1="20" x2="100" y2="20" class="plot-target-line" />
            <!-- baseline (value 0) -->
            <line x1="0" y1="56" x2="100" y2="56" class="plot-baseline" />
            <!-- the spring's linear() trace (crosses above the target for ζ<1) -->
            <path :d="linearPlotPath" class="plot-trace" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useSpringLinearStops } from "./useSpringLinearStops";

const props = defineProps<{ response: number; dampingFraction: number }>();

// The same `linear(0, 0.234 4.17%, …, 1)` string the copy-pasteable Fira block
// emits, parsed into (x=pct, y=value) points and drawn as an SVG trace BESIDE
// its string (the springLinearStops() dogfood — the engine's own emitter).
const linearStops = useSpringLinearStops(
    () => props.response,
    () => props.dampingFraction,
);

// Parse "linear(0, 0.234 4.17%, …, 1)" → [{x, y}] in the plot's unit space.
// Stops without an explicit % are distributed evenly (the CSS linear() rule);
// the FIRST/LAST implicit stops anchor 0% / 100%.
const linearPlot = computed(() => {
    const s = linearStops.value;
    const inner = s.replace(/^linear\(/, "").replace(/\)$/, "");
    const raw = inner.split(",").map((p) => p.trim()).filter(Boolean);
    const pts: { v: number; pct: number | null }[] = raw.map((p) => {
        const m = p.match(/^(-?[\d.]+)\s*(?:([\d.]+)%)?$/);
        if (!m) return { v: 0, pct: null };
        return { v: parseFloat(m[1]!), pct: m[2] != null ? parseFloat(m[2]!) : null };
    });
    // Fill implicit positions evenly across any run lacking a percent.
    const n = pts.length;
    let lastPct = 0;
    for (let i = 0; i < n; i++) {
        if (pts[i]!.pct == null) {
            let j = i;
            while (j < n && pts[j]!.pct == null) j++;
            const nextPct = j < n ? pts[j]!.pct! : 100;
            const span = j - i + 1;
            for (let k = i; k < j; k++) {
                pts[k]!.pct = lastPct + ((nextPct - lastPct) * (k - i + 1)) / span;
            }
            i = j - 1;
        } else {
            lastPct = pts[i]!.pct!;
        }
    }
    if (n > 0) {
        pts[0]!.pct = pts[0]!.pct ?? 0;
        pts[n - 1]!.pct = pts[n - 1]!.pct ?? 100;
    }
    // Map to a 100×60 viewBox: x = pct, y flips (value 0 → bottom, the y=1
    // target line at 1/3 from the top so overshoot has room to cross above it).
    const Y_TARGET = 20; // y px of the value=1 line (overshoot crosses above)
    const Y_ZERO = 56; // y px of value=0
    const toY = (v: number) => Y_ZERO + (Y_TARGET - Y_ZERO) * v;
    return pts.map((p) => ({ x: p.pct ?? 0, y: toY(p.v) }));
});

const linearPlotPath = computed(() => {
    const pts = linearPlot.value;
    if (!pts.length) return "";
    return pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ");
});
</script>

<style scoped>
/* ── L.W11 S6 — the linear() 26-stop plot ──
   The spring's position trace drawn from its linear() stops; crosses ABOVE the
   y=1 target line for ζ<1 (the overshoot). The trace wears the scene's red
   identity (the curve drawn against the paper graticule). */
.spring-linear-plot {
    width: 100%;
    height: 4.5rem;
    display: block;
    overflow: visible;
}
.plot-target-line {
    stroke: color-mix(in srgb, var(--color-progress) 45%, transparent);
    stroke-width: 1;
    stroke-dasharray: 3 2;
    vector-effect: non-scaling-stroke;
}
.plot-baseline {
    stroke: var(--border);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    opacity: 0.5;
}
.plot-trace {
    fill: none;
    stroke: var(--color-progress);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 3px color-mix(in srgb, var(--color-progress) 45%, transparent));
}
</style>
