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
        <!-- Header: easing name + readout + view mode dropdown -->
        <div class="flex w-full max-w-3xl items-center justify-between gap-3 shrink-0">
            <div class="flex items-baseline gap-3 min-w-0">
                <span class="text-heading text-foreground truncate">
                    {{ demo.currentEasingName.value }}
                </span>
                <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                    f({{ demo.progress.value.toFixed(2) }}) = {{ easedValue.toFixed(3) }}
                </span>
            </div>
            <Select
                :model-value="viewMode"
                @update:model-value="onViewModeChange"
            >
                <DockSelectTrigger aria-label="View mode" class="dock-label ml-3">
                    <SelectValue placeholder="Singular" />
                </DockSelectTrigger>
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

        <!-- G4 (H.W10.S3) — the `singular` stage is ONE large engine-driven ball,
             NOT a second copy of the curve editor (the duplicate
             EasingCurveCanvas is DELETED; the editable curve lives in the sidebar
             ONLY). The ball traverses under the SELECTED easing: its x-position
             is `fn(progress) * maxX` over the shared `.progress-rail`/
             `.progress-ball` idiom (the same `getBallX` math the comparison rows
             use, at hero size) — the curve in MOTION (the inv ζ dogfood: the
             ball's position IS the timing function applied to the engine's
             progress sweep). One transport, one ball, all engine. -->
        <div
            v-if="viewMode === 'singular'"
            class="flex w-full flex-1 min-h-0 items-center justify-center"
        >
            <div ref="heroTrackEl" class="hero-track relative w-full max-w-3xl h-16">
                <div class="progress-rail"></div>
                <div
                    class="progress-ball hero-ball"
                    :style="{ transform: `translateX(${heroBallX}px)` }"
                ></div>
            </div>
        </div>

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
                    <span
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
                        <div
                            :class="[
                                'progress-ball track-ball',
                                curve.name === demo.currentEasingName.value
                                    ? 'track-ball--active'
                                    : 'track-ball--muted',
                            ]"
                            :style="{
                                transform: `translateX(${getBallX(curve.fn, curve.name === demo.currentEasingName.value, false)}px)`,
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject, ref, useTemplateRef, onMounted, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { DockSelectTrigger } from "@mkbabb/glass-ui/dock";
import {
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectValue,
} from "@mkbabb/glass-ui";

import { EASING_DEMO_KEY } from "./easingKeys";
import { EASING_GROUPS, getFamilyForCurve } from "./easingGroups";
import { camelCaseToHyphen, timingFunctions } from "@mkbabb/value.js";
import type { TimingFunction } from "@src/animation/constants";

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
    // cascaded value from the hero track (singular) or a comparison track (multi),
    // whichever is mounted. Both inherit the same custom properties.
    const root: HTMLElement | null =
        heroTrackEl.value ?? trackEls.value?.[0] ?? trackContainerEl.value;
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

// ── Track measurement (hero ball + comparison tracks) ──────────

const trackContainerEl = useTemplateRef<HTMLElement>("trackContainerEl");
// Owned refs replace the former `.closest(".easing-target")` /
// `.querySelector(".track-container")` string-class DOM walks (W3.S1): the
// component owns these elements, so it reads their computed vars / width off
// refs that survive a class rename rather than a brittle selector match.
// (The former `easingTargetEl` root ref retired with I5/H.W11.S1 — the stage
// root is now a glass-ui `<Card>` whose ref is a component proxy, not an
// HTMLElement; the cascaded `--track-ball-size-*` tokens are read off the
// real DOM descendant refs below.)
const heroTrackEl = useTemplateRef<HTMLElement>("heroTrackEl");
const trackEls = useTemplateRef<HTMLElement[]>("trackEls");
const trackWidth = ref(0);
const heroTrackWidth = ref(0);

const getBallX = (fn: TimingFunction, isActive: boolean, _isSingular: boolean): number => {
    const size = isActive ? BALL_SIZE_ACTIVE.value : BALL_SIZE_MUTED.value;
    const maxX = trackWidth.value - size;
    if (maxX <= 0) return 0;
    return fn(demo.progress.value) * maxX;
};

// ── G4 — the singular hero ball's x = `fn(progress) * maxX` ─────
// The selected easing function applied to the engine's linear `progress` sweep:
// the curve in MOTION (the inv ζ dogfood). The ball traverses the full hero
// track; the ball SIZE is read off the shared idiom's --ball-size below.
const HERO_BALL_SIZE = 56;
const heroBallX = computed(() => {
    const maxX = heroTrackWidth.value - HERO_BALL_SIZE;
    if (maxX <= 0) return 0;
    return demo.currentEasingFn.value(demo.progress.value) * maxX;
});

const measureTrackWidth = () => {
    // The comparison tracks are uniform width (each is `flex-1`); read the
    // first owned track ref rather than a string-class querySelector.
    const trackEl = trackEls.value?.[0];
    if (trackEl) {
        trackWidth.value = trackEl.clientWidth;
    }
};

const measureHeroTrackWidth = () => {
    if (heroTrackEl.value) {
        heroTrackWidth.value = heroTrackEl.value.clientWidth;
    }
};

onMounted(() => {
    readBallSizes();
    measureTrackWidth();
    measureHeroTrackWidth();
});

// vueuse owns the observer lifecycle (tryOnScopeDispose cleanup) — re-measure
// on resize off the owned refs.
useResizeObserver(trackContainerEl, () => measureTrackWidth());
useResizeObserver(heroTrackEl, () => measureHeroTrackWidth());
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
}

/* ── G4 (H.W10.S3) — the singular hero ball ──
   ONE large engine-driven ball, the curve in MOTION. Rides the shared
   `.progress-rail`/`.progress-ball` idiom (EasingTarget is the canonical
   rail-tint 8% / ball-glow 35% lineage). The per-site delta is only the hero
   SIZE (matched to the JS HERO_BALL_SIZE constant the x-math reads) and the
   transform-positioning perf hint. */
.hero-track {
    display: flex;
    align-items: center;
}
.hero-ball {
    --ball-size: 56px;
    left: 0;
    will-change: transform;
}

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
    background: color-mix(in srgb, var(--color-progress) 20%, transparent);
}

.track-label {
    line-height: 1;
    /* camelCase curve identifiers (easeInOutQuad …) read as-cased — the
       mono-caption rung uppercases; this keeps the label legible (isomorphic
       guard, not a register change). */
    text-transform: none;
}

.track-label--active {
    color: var(--color-progress);
    font-weight: 600;
}
</style>
