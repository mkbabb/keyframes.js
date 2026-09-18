<template>
    <!-- ── L.W11 S6 — the linear() 26-stop PLOT. `useSpringLinearStops()` (the
         engine's own `springLinearStops()` emitter) is parsed and drawn as a
         trace: the position crests OVER the y=1 target line (the overshoot is
         `y > 1`, right there in the data) and rings back for ζ<1. Colocated
         sub-unit of SpringTarget (the natural concern seam: parse + draw).
         SpringTrace L-4/C-8 (KF.W6): the header used to say the curve is drawn
         "beside its string" in a side panel. No such file exists at any path, and
         the string itself is rendered by StartingStyleTarget on the Entry
         channel, a separate view from the Sweep view this plot lives in — the
         two are never on screen together. This plot stands alone; the shared
         emitter is the only thing the two readings have in common. -->
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

// The `linear(0, 0.234 4.17%, …, 1)` string from the shared emitter (the
// springLinearStops() dogfood — the engine's own), parsed into (x=pct, y=value)
// points and drawn as an SVG trace. StartingStyleTarget consumes the same
// emitter for its `starting-style` text on the Entry channel; nothing here
// renders that string.
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
   y=1 target line for ζ<1 (the overshoot).

   KF-SS-6 (W6-N, re-homed from KF.W5) — THE TRACE IS VIOLET, NOT RED, and the
   comment said red. Both declarations below read `--color-progress`, which
   `style.css` points at `--accent-kf` = `light-dark(oklch(0.56 0.17 295),
   oklch(0.74 0.13 305))` — hue 295/305, the brand violet, in both themes.
   "Red" is a leftover from the Lane-B era the token re-point retired, and a
   colour word in a comment is the kind of claim a reader trusts without
   checking; this file's own paint is the correction. PRESERVATION LOCK, held:
   nothing here touches the token-level lane pairing (gentle = `--color-progress`,
   bouncy = `--rainbow-violet` — the two physics extremes on the two nearest
   hues), which is a real design decision and survives the prose fix untouched.
   Whether those two hues PERCEPTUALLY collapse stays UNPROVEN and is KF.W9 /
   SS-13's (ΔE_OK 0.15–0.19 ≈ 7–9× JND); this row is the false comment, and it
   is kin to KF-ES-43 / KF-ET-37, never an identity with them. */
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
