<template>
    <!-- P.W7 — the curve PHYSICS readout. A bezier/named curve is opaque:
         the numbers (x1,y1,x2,y2) say WHERE the handles are, not what the
         curve DOES. This strip samples the live `currentEasingFn` and
         reveals its character — peak velocity (the steepest slope = the
         "snap"), overshoot (how far past 1 it springs — back/elastic),
         and anticipation (how far below 0 it pulls back first). A flat
         `ease-out` reads "no overshoot"; `ease-out-back` reveals its
         spring. Read-only telemetry (no per-frame cost — recomputes only
         when the curve changes), styled with the editor's own tokens. -->
    <!-- EASTER EGG — "name that curve" (P.W7, the REVEAL egg): double-click
         the physics block and it identifies the nearest NAMED easing to the
         live curve (an RMS match across the catalogue), revealing what a
         hand-dragged bezier "is" (e.g. a pulled curve resolves to
         "≈ ease-out-back, 96% match"). Distinct from the canvas "Gallery"
         dblclick (a different surface) — it teaches the named catalogue the
         custom curve lives among. The badge auto-clears after a beat. -->
    <!-- S.A0 a11y (axe `definition-list`): only properly-ordered dt/dd
         groups (or divs wrapping them) may be direct <dl> children — the
         identity-egg badge and the character line are NOT term/value
         pairs, so they live on the group wrapper AROUND the <dl>. The
         wrapper keeps the dblclick affordance + label (role="group"
         permits aria-label; a bare div does not). -->
    <div
        class="curve-physics"
        role="group"
        aria-label="Curve physics — double-click to identify the nearest named easing"
        @dblclick="identifyCurve"
    >
        <div v-if="nearestName" class="curve-physics-egg readout-accent text-mono-caption normal-case tabular-nums">
            ≈ {{ nearestName }}
        </div>
        <dl class="curve-physics-list">
            <div class="curve-physics-row">
                <dt class="text-mono-small text-muted-foreground">peak velocity</dt>
                <dd class="readout-accent text-mono-small tabular-nums">{{ physics.peakVel }}×</dd>
            </div>
            <div class="curve-physics-row">
                <dt class="text-mono-small text-muted-foreground">overshoot</dt>
                <dd
                    class="text-mono-small tabular-nums"
                    :class="physics.overshoot !== '0%' ? 'readout-accent' : 'text-muted-foreground'"
                >{{ physics.overshoot }}</dd>
            </div>
            <div class="curve-physics-row">
                <dt class="text-mono-small text-muted-foreground">anticipation</dt>
                <dd
                    class="text-mono-small tabular-nums"
                    :class="physics.anticipation !== '0%' ? 'readout-accent' : 'text-muted-foreground'"
                >{{ physics.anticipation }}</dd>
            </div>
        </dl>
        <p class="curve-physics-character text-mono-caption normal-case italic text-muted-foreground">
            {{ physics.character }}
        </p>
    </div>
</template>

<script setup lang="ts">
// The curve-physics telemetry instrument (S.A0: split out of EasingSidebar.vue
// at its natural concern seam — the sidebar crossed the 500L demo ceiling when
// the a11y content-model fix landed; this block is a self-contained read-only
// instrument over `demo.currentEasingFn` + the P.W7 identity egg, so it is the
// colocated sub-unit the ceiling gate prescribes).
import { computed, onBeforeUnmount, ref } from "vue";
import type { EasingDemoContext } from "./easingKeys";

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// P.W7 — the curve-PHYSICS readout. Samples the live `currentEasingFn` to reveal
// the curve's CHARACTER (what it DOES), not its parameters (where its handles
// are). Pure derived read off the reactive `currentEasingFn` — recomputes ONLY
// when the curve changes, never per animation frame (no hot-path cost).
//
//   • peak velocity — the steepest slope max|f'(t)| (a finite-difference scan).
//     A linear curve is 1.0×; a snappy ease-out peaks high early then coasts.
//   • overshoot     — max(0, max_t f(t) − 1): how far the value springs PAST its
//     target (the back/elastic spring), as a percentage of the travel.
//   • anticipation  — max(0, −min_t f(t)): how far it pulls BELOW 0 first (the
//     wind-up before the throw), as a percentage.
// The 65-sample scan is exact enough for a readout (the curve is C¹ on [0,1]);
// it is plenty cheap as a once-per-curve-change computed.
const SAMPLES = 64;
const physics = computed(() => {
    const fn = demo.currentEasingFn.value;
    let maxY = 1;
    let minY = 0;
    let peakVel = 0;
    let prevY = fn(0);
    const dt = 1 / SAMPLES;
    for (let i = 1; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const y = fn(t);
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;
        const v = Math.abs((y - prevY) / dt);
        if (v > peakVel) peakVel = v;
        prevY = y;
    }
    const overshootPct = Math.max(0, maxY - 1);
    const anticipationPct = Math.max(0, -minY);
    const fmtPct = (v: number) => (v < 0.005 ? "0%" : `${Math.round(v * 100)}%`);

    // A one-line character read — the curve's "story" in plain language.
    let character: string;
    if (overshootPct >= 0.005 && anticipationPct >= 0.005) {
        character = "anticipates, then overshoots — a full spring";
    } else if (overshootPct >= 0.005) {
        character = "springs past the target, then settles back";
    } else if (anticipationPct >= 0.005) {
        character = "winds up below zero before the throw";
    } else if (peakVel >= 2.4) {
        character = "snaps hard, then eases to rest";
    } else if (peakVel <= 1.05 && peakVel >= 0.95) {
        character = "constant velocity — a straight line";
    } else {
        character = "stays within bounds — no overshoot";
    }

    return {
        peakVel: peakVel.toFixed(2),
        overshoot: fmtPct(overshootPct),
        anticipation: fmtPct(anticipationPct),
        character,
    };
});

// EASTER EGG — "name that curve" (P.W7). Identify the nearest NAMED easing to the
// live curve by sampling both across [0,1] and ranking by RMS error. Reveals what
// a hand-dragged custom bezier "is" in the catalogue's language. Pure read off
// the already-present `demo.timingFunctionsAnd` registry (no new data, no engine
// call); fired on demand (a dblclick), never on the hot path.
const nearestName = ref<string | null>(null);
let nearestTimer: ReturnType<typeof setTimeout> | null = null;
const identifyCurve = () => {
    const cur = demo.currentEasingFn.value;
    let best: { name: string; err: number } | null = null;
    for (const [name, fn] of Object.entries(demo.timingFunctionsAnd)) {
        if (typeof fn !== "function" || name === "cubic-bezier") continue;
        let sse = 0;
        for (let i = 0; i <= 32; i++) {
            const t = i / 32;
            const d = (fn as (t: number) => number)(t) - cur(t);
            sse += d * d;
        }
        const err = Math.sqrt(sse / 33);
        if (!best || err < best.err) best = { name, err };
    }
    if (best) {
        const match = Math.max(0, Math.round((1 - best.err) * 100));
        nearestName.value = `${best.name}, ${match}% match`;
        if (nearestTimer) clearTimeout(nearestTimer);
        nearestTimer = setTimeout(() => {
            nearestName.value = null;
            nearestTimer = null;
        }, 3200);
    }
};

onBeforeUnmount(() => {
    if (nearestTimer) clearTimeout(nearestTimer);
});
</script>

<style scoped>
/* P.W7 — the curve-physics telemetry block. A compact three-row instrument
   readout (label-left, accent-numeral-right) beneath the controls, separated by
   a hairline divider in the shared --border language (the same divider the
   instrument plates use). The accent numerals consume the demo-wide
   `.readout-accent` (--ball-tone) so they read as "the engine's live numbers",
   exactly like the square's telemetry strip. The character line is a quiet
   italic caption — the curve's story in one sentence. */
.curve-physics {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0;
    padding-top: 0.55rem;
    border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
}
/* The dt/dd rows' own <dl> (split out of .curve-physics for the a11y content
   model — see the template note): same column rhythm as the wrapper so the
   visual layout is unchanged. */
.curve-physics-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0;
}
.curve-physics-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
}
.curve-physics-character {
    margin: 0.15rem 0 0;
    opacity: 0.85;
    line-height: 1.3;
}
/* The double-click identity badge (the egg) — a quiet accent chip that names the
   nearest catalogue curve, sitting above the rows. */
.curve-physics-egg {
    align-self: flex-start;
    padding: 0.05rem 0.4rem;
    margin-bottom: 0.1rem;
    border-radius: var(--radius-sm, 0.375rem);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 12%, transparent);
}
.curve-physics {
    /* The whole block is the dblclick target — hint it's interactive. */
    cursor: default;
    user-select: none;
}
</style>
