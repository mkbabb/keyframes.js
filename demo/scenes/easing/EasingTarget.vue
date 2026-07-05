<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         The four stage scenes converge to ONE standard, NON-cartoon glass
         `<Card>` (the protagonist plate; `tier="resting" surface="glass"`,
         rounded-card by construction → I4 closes FOR FREE). The control PANELS
         stay cartoon+quiet (W2/W9) — two altitudes. The card sits in the
         [stage] track, dock-contained by the surviving `.stage-cell` PRIMITIVE
         (the G8 LAYOUT half survives; the surface half reverses). `shadow={false}`:
         the protagonist plate reads cleaner without a nested drop-shadow inside
         the dock-band-reserved cell (FORK I5-shadow, MEASURE-FIRST default).
         The `max-w-3xl` measure rides ONLY the comparison list (an optical
         reading width for many rows); the singular hero ball uses the full
         stage width. -->
    <Card
        :shadow="false"
        class="easing-target flex flex-col items-center justify-center gap-6 h-full w-full px-6 lg:px-8 overflow-hidden"
    >
        <!-- Header: easing name + readout + view mode dropdown.
             J.W7a S2 (D7 / TYP-2, E3) — the curve name lifts from text-heading
             native-sans to the Instrument-Serif `text-display` rung: the brand
             face carries inward from the doorway (cross-typography §3, "the
             highest-leverage single change"); the scene earns a poster title
             proportionate to its stage.
             J.W7a S2 (D8 / C3) + S3 (D14 / CP-4) — the live readout promotes
             from a 12px muted caption to a confident mono display: the eased
             VALUE rides the published AnimatedDigit (damped tabular-nums — the
             6 Hz readout cadence smooths into a continuous display) at the
             mono-prose rung and wears the scene accent (.readout-accent →
             --ball-tone); the f(t)= notation stays the small muted label. The
             NUMBER wins; the label recedes. -->
        <!-- The header rows WRAP (flex-wrap): a long curve name (easeInOutElastic)
             beside the promoted readout must reflow at phone widths instead of
             starving the serif title (the D8 responsive behaviour). -->
        <div class="flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 gap-y-1 shrink-0">
            <div class="flex flex-wrap items-baseline gap-3 gap-y-1 min-w-0">
                <span class="text-display text-foreground truncate">
                    {{ demo.currentEasingName.value }}
                </span>
                <span class="flex items-baseline gap-1 text-mono-small text-muted-foreground tabular-nums whitespace-nowrap shrink-0">
                    f(<AnimatedDigit :value="demo.progress.value" :format="fmt2" />)&nbsp;=
                    <AnimatedDigit
                        class="readout-accent text-mono-prose font-semibold"
                        :value="easedValue"
                        :format="fmt3"
                    />
                </span>
            </div>
            <!-- U3-D2 (J.W7c LANE E) — the view-mode select gets REAL dropdown
                 chrome. It FORMERLY wore a dock-tier <DockSelectTrigger> with the
                 `dock-label` utility: outside a `.glass-dock` that trigger paints a
                 TRANSPARENT background and `dock-label` falls back to the oversized
                 `--type-subheading` (20.4px) rung — so it read as a big BARE-TEXT
                 word with a faint chevron, no resting affordance that it's a control
                 (the audit's "reads as bare text"). The standard glass <SelectTrigger>
                 is the idiomatic primitive for a select on a RESTING glass surface:
                 it paints the `glass-wash` resting fill + `rounded-pill` + the
                 governed `text-dropdown` (14px) scale + a built-in animated chevron.
                 `size="sm"` keeps the control header-proportionate; `w-auto` lets it
                 hug "Singular"/family names instead of stretching full-width. -->
            <Select
                :model-value="viewMode"
                @update:model-value="onViewModeChange"
            >
                <SelectTrigger
                    aria-label="View mode"
                    size="sm"
                    class="w-auto min-w-[7.5rem] shrink-0"
                >
                    <SelectValue placeholder="Singular" />
                </SelectTrigger>
                <SelectContent class="min-w-40 text-small">
                    <SelectItem value="singular">Singular</SelectItem>
                    <SelectSeparator />
                    <SelectItem
                        v-for="group in EASING_GROUPS"
                        :key="group.family"
                        :value="group.family"
                    >
                        {{ group.family }}
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem value="all">All</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <!-- The `singular` hero stage — ONE large engine-driven ball on the
             lower-third rail under its projected live bezier (G4; J.W7a D4
             D16 D17). Extracted as the colocated EasingHeroStage sub-component
             (markup + painter + projected-curve CSS travel together; the
             J.W7a fix-round proof:demo-no-oversize seam — ZERO appearance
             delta). It injects the same EASING_DEMO_KEY demo and owns its
             dot-painter lifecycle (mounted ⇔ registered). -->
        <EasingHeroStage v-if="viewMode === 'singular'" />

        <!-- Multi-track mode: scrollable comparison list (genuinely additive —
             many curves at once; the optical max-measure rides this list). -->
        <div
            v-else
            ref="trackContainerEl"
            class="w-full max-w-3xl flex-1 min-h-0 overflow-y-auto"
        >
            <div class="grid gap-3">
                <div
                    v-for="curve in visibleCurves"
                    :key="curve.name"
                    class="track-row"
                >
                    <!-- T.D4 — the curve NAME is a CSS identifier (genuine data):
                         mono survives, data-register-marked for the census. -->
                    <span
                        data-register="code"
                        :class="[
                            'track-label text-mono-caption shrink-0 w-36 text-right pr-3 truncate',
                            curve.name === demo.currentEasingName.value
                                ? 'track-label--active'
                                : 'text-muted-foreground',
                        ]"
                        :title="curve.name"
                    >{{ curve.name }}</span>
                    <div ref="trackEls" class="track-container relative flex-1 h-10">
                        <div class="progress-rail"></div>
                        <!-- I.W4 D4 — the comparison dots are ALSO positioned by a
                             direct non-reactive write inside the rAF loop (the
                             registered painter walks these refs). `data-curve`
                             tags each ball so the painter resolves its easing fn. -->
                        <div
                            ref="trackBallEls"
                            :data-curve="curve.name"
                            :class="[
                                'progress-ball track-ball',
                                curve.name === demo.currentEasingName.value
                                    ? 'track-ball--active'
                                    : 'track-ball--muted',
                            ]"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject, ref, useTemplateRef, onMounted, onScopeDispose, watch, nextTick } from "vue";
import { useResizeObserver } from "@vueuse/core";
// J.W7a S2 (D8) — the published damped tabular-nums display (glass-ui 3.9.0):
// the live readout's confident-mono promotion consumes the primitive, never a
// hand-rolled size (the MetricHeader abstraction stays a W7b handoff edge).
import { AnimatedDigit } from "@mkbabb/glass-ui/animated-digit";
import {
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";

import { EASING_DEMO_KEY } from "./easingKeys";
import { EASING_GROUPS, getFamilyForCurve } from "./easingGroups";
import EasingHeroStage from "./EasingHeroStage.vue";
import { camelCaseToHyphen, timingFunctions } from "@mkbabb/value.js";
import type { TimingFunction } from "@mkbabb/keyframes.js";

const demo = inject(EASING_DEMO_KEY)!;

// "singular" = ONE large engine-driven hero ball (G4); family names = comparison,
// "all" = everything. The editable curve lives in the sidebar ONLY — the stage
// shows the curve in MOTION, not a second copy of the editor.
const viewMode = ref("singular");

// Auto-follow: when singular, stay singular. Otherwise track family.
watch(() => demo.currentEasingName.value, () => {
    if (viewMode.value !== "singular" && viewMode.value !== "all") {
        viewMode.value = getFamilyForCurve(demo.currentEasingName.value);
    }
});

const onViewModeChange = (v: unknown) => {
    viewMode.value = String(v);
};

// Comparison-track ball sizes — read once after mount so JS measurement
// stays in sync with the CSS custom properties (see <style> block).
const ballSizes = ref({ active: 36, muted: 24 });
const BALL_SIZE_ACTIVE = computed(() => ballSizes.value.active);
const BALL_SIZE_MUTED = computed(() => ballSizes.value.muted);

const readBallSizes = () => {
    // The `--track-ball-size-*` tokens live on the `.easing-target` <Card> root
    // (I5, H.W11.S1) and CASCADE to every descendant. Read them off a real DOM
    // descendant ref — the stage root is now a glass-ui `<Card>` whose template
    // ref resolves to the component proxy, not an HTMLElement — so we read the
    // cascaded value from a mounted comparison track (the tokens size the
    // comparison balls ONLY; the hero stage owns its own size constant).
    const root: HTMLElement | null =
        trackEls.value?.[0] ?? trackContainerEl.value;
    if (!root) return;
    const styles = getComputedStyle(root);
    const toPx = (v: string): number => {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    };
    const active = toPx(styles.getPropertyValue("--track-ball-size-active"));
    const muted = toPx(styles.getPropertyValue("--track-ball-size-muted"));
    if (active) ballSizes.value.active = active;
    if (muted) ballSizes.value.muted = muted;
};

const easedValue = computed(() => demo.currentEasingFn.value(demo.progress.value));

// J.W7a S2 (D8) — the AnimatedDigit formatters (the readout's fixed-precision
// display forms; the primitive owns the damping + tabular-nums register).
const fmt2 = (v: number) => v.toFixed(2);
const fmt3 = (v: number) => v.toFixed(3);

// Build the resolved function lookup
const resolvedFunctions: Record<string, TimingFunction> = {};
for (const [k, v] of Object.entries(timingFunctions)) {
    if (typeof v !== "function") continue;
    const key = camelCaseToHyphen(k);
    if (key === "steps") continue; // parameterized, skip
    if (v.length === 0) {
        const result = (v as () => TimingFunction)();
        if (typeof result === "function") {
            resolvedFunctions[key] = result;
        }
    } else if (v.length <= 1) {
        resolvedFunctions[key] = v as TimingFunction;
    }
}

interface VisibleCurve {
    name: string;
    fn: TimingFunction;
}

const visibleCurves = computed<VisibleCurve[]>(() => {
    const mode = viewMode.value;
    if (mode === "singular") return [];
    if (mode === "all") {
        return EASING_GROUPS.flatMap((group) =>
            group.items
                .filter((item) => !item.isDetail)
                .map((item) => ({
                    name: item.name,
                    fn: resolvedFunctions[item.name] ?? ((t: number) => t),
                })),
        );
    }
    const group = EASING_GROUPS.find((g) => g.family === mode);
    if (!group) return [];
    return group.items
        .filter((item) => !item.isDetail)
        .map((item) => ({
            name: item.name,
            fn: resolvedFunctions[item.name] ?? ((t: number) => t),
        }));
});

// ── Track measurement (comparison tracks; the hero stage measures itself) ──

const trackContainerEl = useTemplateRef<HTMLElement>("trackContainerEl");
// Owned refs replace the former `.closest(".easing-target")` /
// `.querySelector(".track-container")` string-class DOM walks (W3.S1): the
// component owns these elements, so it reads their computed vars / width off
// refs that survive a class rename rather than a brittle selector match.
// (The former `easingTargetEl` root ref retired with I5/H.W11.S1 — the stage
// root is now a glass-ui `<Card>` whose ref is a component proxy, not an
// HTMLElement; the cascaded `--track-ball-size-*` tokens are read off the
// real DOM descendant refs below.)
const trackEls = useTemplateRef<HTMLElement[]>("trackEls");
// I.W4 D4 — the moving-dot elements the rAF loop positions imperatively (NO
// per-frame reactive `:style`): every comparison dot. (The hero dot's painter
// lives in the colocated EasingHeroStage.)
const trackBallEls = useTemplateRef<HTMLElement[]>("trackBallEls");
const trackWidth = ref(0);

// Pure geometry: the comparison ball x at a raw sweep value (NO reactive
// read — the painter calls this with the loop's live phase). `fn(phase)` is the
// curve in motion.
const trackBallXAt = (fn: TimingFunction, isActive: boolean, phase: number): number => {
    const size = isActive ? BALL_SIZE_ACTIVE.value : BALL_SIZE_MUTED.value;
    const maxX = trackWidth.value - size;
    if (maxX <= 0) return 0;
    return fn(phase) * maxX;
};

// The curve-fn lookup the comparison painter resolves each ball's `data-curve`
// against (active = the selected curve, which uses the live `currentEasingFn`).
const fnForCurve = (name: string): TimingFunction => {
    if (name === demo.currentEasingName.value) return demo.currentEasingFn.value;
    return resolvedFunctions[name] ?? ((t: number) => t);
};

type BallEntry = { el: HTMLElement; fn: TimingFunction; curveName: string };
let ballSnapshot: BallEntry[] = [];

// ── I.W4 D4 — the dot painter: DIRECT non-reactive `style.transform` writes ──
// Registered with the demo's loop seam; called imperatively each frame with the
// live raw sweep value. This is the hot path moved OFF the Vue render graph (the
// 243-node SVG re-render storm is gone — the dots move, nothing re-renders).
const paintTrackDots = (phase: number) => {
    if (!ballSnapshot.length) return;
    const activeName = demo.currentEasingName.value;
    for (const { el, fn, curveName } of ballSnapshot) {
        const isActive = curveName === activeName;
        el.style.transform = `translateX(${trackBallXAt(fn, isActive, phase)}px)`;
    }
};

// Register the comparison painter while a comparison mode is mounted (the
// `singular` hero stage owns ITS painter — mounted ⇔ registered, inside
// EasingHeroStage). Re-registered when the mode / visible-curve set changes so
// the loop always drives the live DOM. The demo paints once on register (so a
// paused scene shows the correct rest position).
let unregisterPainter: (() => void) | null = null;
const wirePainter = async () => {
    await nextTick(); // the new mode's balls must be in the DOM first
    unregisterPainter?.();
    unregisterPainter = null;
    if (viewMode.value === "singular") return;
    readBallSizes();
    measureTrackWidth();
    ballSnapshot = (trackBallEls.value ?? []).map((el, i) => ({
        el,
        curveName: visibleCurves.value[i]?.name ?? "",
        fn: fnForCurve(visibleCurves.value[i]?.name ?? ""),
    }));
    unregisterPainter = demo.registerDotPainter(paintTrackDots);
};

const measureTrackWidth = () => {
    // The comparison tracks are uniform width (each is `flex-1`); read the
    // first owned track ref rather than a string-class querySelector.
    const trackEl = trackEls.value?.[0];
    if (trackEl) {
        trackWidth.value = trackEl.clientWidth;
    }
    // A width change moves the dots' max-x → repaint at the live phase so the
    // paused/steady position is correct without waiting for the next frame.
    demo.repaintDots();
};

onMounted(() => wirePainter());

onScopeDispose(() => unregisterPainter?.());

// Re-wire the painter when the mounted dot set changes (mode switch) or when the
// visible comparison curves change (the v-for refs are recreated). The selected
// curve changing does NOT need a re-wire — the painter resolves `currentEasingFn`
// live — but the dots should repaint to the new curve at once while paused
// (repaintDots walks EVERY registered painter, the hero stage's included).
watch(viewMode, () => wirePainter());
watch(visibleCurves, () => wirePainter());
watch(
    () => demo.currentEasingName.value,
    () => demo.repaintDots(),
);

// vueuse owns the observer lifecycle (tryOnScopeDispose cleanup) — re-measure
// on resize off the owned ref.
useResizeObserver(trackContainerEl, () => measureTrackWidth());
</script>

<style scoped>
/* Comparison-track ball sizing tokens — read by JS via getComputedStyle so
   CSS is the single source of truth. Values are intentionally in px (not rem)
   because JS reads computed lengths. Scoped to the component's own
   `.easing-target` root (the I5/H.W11.S1 STANDARD GLASS `<Card>` stage — the
   protagonist plate, rounded-card by construction; the tokens cascade to the
   hero/comparison tracks the JS reads). */
.easing-target {
    --track-ball-size-active: 36px;
    --track-ball-size-muted: 24px;
    /* J.W7a S3 (D11 / CP-1) — the scene's ONE colour consumer: the easing
       subject keeps its icon's promise (easing.svg draws the violet curve).
       Cascades from the stage root to the shared .progress-rail/.progress-ball
       idiom, the readout accent, and the active track label — one token, the
       whole scene agrees (cross-color-pops §5.1). */
    --ball-tone: var(--rainbow-violet);
}

/* The singular hero stage's projected-bezier + hero-ball rules (J.W7a D16 /
   G4) live in the colocated EasingHeroStage.vue — markup + painter + CSS
   travel together (the J.W7a fix-round proof:demo-no-oversize seam). */

.track-row {
    display: flex;
    align-items: center;
}

.track-container {
    display: flex;
    align-items: center;
}

/* The rail + ball geometry now comes from the shared .progress-rail /
   .progress-ball idiom (design-idioms.css). EasingTarget is the CANONICAL
   lineage (rail-tint 8% + ball-glow 35% are the idiom defaults), so the active
   ball needs no override beyond mapping its JS-read size token onto --ball-size.
   The track-ball modifiers carry only the per-site variation: the transform-
   positioning perf hint, the active/muted SIZE (still sourced from the
   getComputedStyle-read --track-ball-size-* tokens above), and the muted ball's
   reduced-presence tint + suppressed glow. */
.track-ball {
    left: 0;
    will-change: transform;
}

.track-ball--active {
    --ball-size: var(--track-ball-size-active);
}

.track-ball--muted {
    --ball-size: var(--track-ball-size-muted);
    --ball-glow: 0%; /* the muted comparison balls carry no glow */
    /* J.W7a S3 (D11) — the muted tint reads the cascaded scene tone (the same
       20% presence, the seam hue). */
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 20%, transparent);
}

.track-label {
    line-height: 1;
    /* camelCase curve identifiers (easeInOutQuad …) read as-cased — the
       mono-caption rung uppercases; this keeps the label legible (isomorphic
       guard, not a register change). */
    text-transform: none;
}

.track-label--active {
    /* J.W7a S3 (D11) — the active label matches the subject's tone seam. */
    color: var(--ball-tone, var(--color-progress));
    font-weight: 600;
}
</style>
