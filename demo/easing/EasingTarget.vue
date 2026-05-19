<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">

        <div class="glass-card w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Header: easing name + view mode dropdown -->
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="instrument-serif text-xl lg:text-2xl text-foreground truncate">
                        {{ demo.currentEasingName.value }}
                    </span>
                    <span class="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                        f({{ demo.progress.value.toFixed(2) }}) = {{ easedValue.toFixed(3) }}
                    </span>
                </div>
                <Select
                    :model-value="viewMode"
                    @update:model-value="onViewModeChange"
                >
                    <DockSelectTrigger aria-label="View mode" class="instrument-serif text-sm ml-3">
                        <SelectValue placeholder="Singular" />
                    </DockSelectTrigger>
                    <SelectContent class="min-w-40 instrument-serif">
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

            <!-- Singular mode: the glass-ui scrubber Slider -->
            <div
                v-if="viewMode === 'singular'"
                class="flex-1 min-h-0 flex items-center justify-center px-8 py-6"
            >
                <Slider
                    class="t-scrubber w-full"
                    variant="glass-scrubber"
                    size="lg"
                    :model-value="[demo.progress.value]"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    aria-label="Scrub progress"
                    @update:model-value="onScrub"
                    @pointerdown="onScrubStart"
                    @value-commit="onScrubEnd"
                />
            </div>

            <!-- Multi-track mode: scrollable list -->
            <div
                v-else
                ref="trackContainerEl"
                class="flex-1 min-h-0 overflow-y-auto px-4 py-3"
            >
                <div class="grid gap-3">
                    <div
                        v-for="curve in visibleCurves"
                        :key="curve.name"
                        class="track-row"
                    >
                        <span
                            :class="[
                                'track-label font-mono text-xs shrink-0 w-36 text-right pr-3 truncate',
                                curve.name === demo.currentEasingName.value
                                    ? 'track-label--active'
                                    : 'text-muted-foreground',
                            ]"
                            :title="curve.name"
                        >{{ curve.name }}</span>
                        <div class="track-container relative flex-1 h-10">
                            <div class="track-line"></div>
                            <div
                                :class="[
                                    'track-ball',
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, useTemplateRef, onMounted, onUnmounted, watch } from "vue";
import { DockSelectTrigger } from "@mkbabb/glass-ui/dock";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectValue,
    Slider,
} from "@mkbabb/glass-ui";

import { EASING_DEMO_KEY } from "./easingKeys";
import { EASING_GROUPS, getFamilyForCurve } from "./easingGroups";
import { camelCaseToHyphen, timingFunctions } from "@mkbabb/value.js";
import type { TimingFunction } from "@src/animation/constants";

const demo = inject(EASING_DEMO_KEY)!;

// "singular" = just the selected curve (scrubber), family names = comparison, "all" = everything
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
    const container = trackContainerEl.value;
    if (!container) return;
    const root = container.closest<HTMLElement>(".glass-card") ?? container;
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

// ── Comparison-track measurement ───────────────────────────────

const trackContainerEl = useTemplateRef<HTMLElement>("trackContainerEl");
const trackWidth = ref(0);

const getBallX = (fn: TimingFunction, isActive: boolean, _isSingular: boolean): number => {
    const size = isActive ? BALL_SIZE_ACTIVE.value : BALL_SIZE_MUTED.value;
    const maxX = trackWidth.value - size;
    if (maxX <= 0) return 0;
    return fn(demo.progress.value) * maxX;
};

let resizeObs: ResizeObserver | undefined;

const measureTrackWidth = () => {
    const container = trackContainerEl.value;
    if (!container) return;
    const trackEl = container.querySelector<HTMLElement>(".track-container");
    if (trackEl) {
        trackWidth.value = trackEl.clientWidth;
    }
};

onMounted(() => {
    readBallSizes();
    measureTrackWidth();
    resizeObs = new ResizeObserver(() => measureTrackWidth());
    if (trackContainerEl.value) resizeObs.observe(trackContainerEl.value);
});

onUnmounted(() => {
    resizeObs?.disconnect();
});

// ── Singular scrubber (glass-ui Slider) ────────────────────────
// Feature parity with the hand-rolled track-ball: drag scrubs progress,
// playback pauses for the gesture and resumes after. The Slider also adds
// keyboard scrubbing for free (arrow keys / Home / End).

let wasPlayingBeforeScrub = false;
let scrubbing = false;

const onScrub = (v: unknown) => {
    const arr = v as number[];
    if (Array.isArray(arr) && arr.length) {
        demo.progress.value = Math.max(0, Math.min(1, arr[0]!));
    }
};

const onScrubStart = () => {
    if (scrubbing) return;
    scrubbing = true;
    wasPlayingBeforeScrub = demo.isPlaying.value;
    if (wasPlayingBeforeScrub) demo.pause();
};

const onScrubEnd = () => {
    if (!scrubbing) return;
    scrubbing = false;
    if (wasPlayingBeforeScrub) demo.play();
};
</script>

<style>
/* Comparison-track ball sizing tokens — read by JS via getComputedStyle so
   CSS is the single source of truth. Values are intentionally in px (not rem)
   because JS reads computed lengths. */
.glass-card {
    --track-ball-size-active: 36px;
    --track-ball-size-muted: 24px;
}

/* The singular t-scrubber adopts the glass-ui glass-scrubber Slider variant.
   Its track + range + thumb paint from the consumer's progress-tone tokens. */
.t-scrubber {
    --slider-track-bg: color-mix(in srgb, var(--color-progress) 10%, transparent);
    --slider-range-bg: color-mix(in srgb, var(--color-progress) 45%, transparent);
    --slider-thumb-bg: var(--color-progress);
}

.track-row {
    display: flex;
    align-items: center;
}

.track-container {
    display: flex;
    align-items: center;
}

.track-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
    pointer-events: none;
}

.track-ball {
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 9999px;
    will-change: transform;
}

.track-ball--active {
    width: var(--track-ball-size-active);
    height: var(--track-ball-size-active);
    margin-top: calc(var(--track-ball-size-active) / -2);
    background: var(--color-progress);
    box-shadow: 0 2px 10px color-mix(in srgb, var(--color-progress) 35%, transparent);
    pointer-events: none;
}

.track-ball--muted {
    width: var(--track-ball-size-muted);
    height: var(--track-ball-size-muted);
    margin-top: calc(var(--track-ball-size-muted) / -2);
    background: color-mix(in srgb, var(--color-progress) 20%, transparent);
    pointer-events: none;
}

.track-label {
    line-height: 1;
}

.track-label--active {
    color: var(--color-progress);
    font-weight: 600;
}
</style>
