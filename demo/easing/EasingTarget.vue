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
                    <SelectTrigger class="w-auto min-w-28 h-7 border-none bg-transparent instrument-serif text-sm gap-1 focus:ring-0 [&>svg:last-child]:w-3 [&>svg:last-child]:h-3 shrink-0 ml-3">
                        <SelectValue placeholder="Singular" />
                    </SelectTrigger>
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

            <!-- Singular mode: one large draggable ball, centered -->
            <div
                v-if="viewMode === 'singular'"
                ref="trackContainerEl"
                class="flex-1 min-h-0 flex items-center justify-center px-6 py-6"
            >
                <div class="w-full relative h-20">
                    <div class="track-line track-line--singular"></div>
                    <div class="track-marker track-marker--start"></div>
                    <div class="track-marker track-marker--end"></div>
                    <div
                        ref="singularBallEl"
                        :class="[
                            'track-ball track-ball--singular',
                            isDragging ? 'cursor-grabbing' : 'cursor-grab',
                        ]"
                        :style="{
                            transform: `translateX(${singularBallX}px)`,
                        }"
                        @pointerdown="onBallPointerDown"
                    ></div>
                </div>
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
                                    ? 'text-[var(--color-progress)] font-semibold'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";

import { EASING_DEMO_KEY } from "./easingKeys";
import { EASING_GROUPS, getFamilyForCurve } from "./easingGroups";
import { timingFunctions } from "@src/easing";
import { camelCaseToHyphen } from "@src/utils";
import type { TimingFunction } from "@src/animation/constants";

const demo = inject(EASING_DEMO_KEY)!;

// "singular" = just the selected curve (big ball), family names = comparison, "all" = everything
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

const BALL_SIZE_SINGULAR = 72; // 4.5rem
const BALL_SIZE_ACTIVE = 36;   // 2.25rem
const BALL_SIZE_MUTED = 24;    // 1.5rem

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

// ── Track measurement ──────────────────────────────────────────

const trackContainerEl = useTemplateRef<HTMLElement>("trackContainerEl");
const singularBallEl = useTemplateRef<HTMLElement>("singularBallEl");
const trackWidth = ref(0);

/** For singular mode, the track runs from ball center to ball center. */
const getSingularMaxX = () => trackWidth.value - BALL_SIZE_SINGULAR;

const getBallX = (fn: TimingFunction, isActive: boolean, isSingular: boolean): number => {
    const size = isSingular ? BALL_SIZE_SINGULAR : isActive ? BALL_SIZE_ACTIVE : BALL_SIZE_MUTED;
    const maxX = trackWidth.value - size;
    if (maxX <= 0) return 0;
    return fn(demo.progress.value) * maxX;
};

const singularBallX = computed(() => {
    if (isDragging.value) return dragBallX.value;
    const maxX = getSingularMaxX();
    if (maxX <= 0) return 0;
    return demo.currentEasingFn.value(demo.progress.value) * maxX;
});

let resizeObs: ResizeObserver | undefined;

const measureTrackWidth = () => {
    const container = trackContainerEl.value;
    if (!container) return;
    const trackEl = container.querySelector<HTMLElement>(".track-container");
    if (trackEl) {
        trackWidth.value = trackEl.clientWidth;
    } else {
        // Singular mode: use the inner track div
        const inner = container.querySelector<HTMLElement>(".track-line");
        if (inner?.parentElement) {
            trackWidth.value = inner.parentElement.clientWidth;
        } else {
            trackWidth.value = container.clientWidth - 48; // px-6 padding
        }
    }
};

onMounted(() => {
    measureTrackWidth();
    resizeObs = new ResizeObserver(() => measureTrackWidth());
    if (trackContainerEl.value) resizeObs.observe(trackContainerEl.value);
});

onUnmounted(() => {
    resizeObs?.disconnect();
});

// ── Draggable ball (singular mode) ─────────────────────────────

const isDragging = ref(false);
const dragBallX = ref(0);
let grabOffset = 0;
let wasPlayingBeforeDrag = false;

const progressFromPointerX = (clientX: number): number => {
    const container = trackContainerEl.value;
    if (!container) return 0;
    const inner = container.querySelector<HTMLElement>(".track-line")?.parentElement;
    if (!inner) return 0;
    const rect = inner.getBoundingClientRect();
    const maxX = getSingularMaxX();
    if (maxX <= 0) return 0;
    const x = clientX - rect.left - BALL_SIZE_SINGULAR / 2 - grabOffset;
    return Math.max(0, Math.min(x / maxX, 1));
};

const onBallPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    const ball = singularBallEl.value;
    if (!ball) return;

    const ballRect = ball.getBoundingClientRect();
    grabOffset = e.clientX - (ballRect.left + ballRect.width / 2);

    isDragging.value = true;
    wasPlayingBeforeDrag = demo.isPlaying.value;
    if (wasPlayingBeforeDrag) demo.pause();

    dragBallX.value = singularBallX.value;

    try { ball.setPointerCapture(e.pointerId); } catch {}

    const onMove = (me: PointerEvent) => {
        const p = progressFromPointerX(me.clientX);
        demo.progress.value = p;
        dragBallX.value = p * getSingularMaxX();
    };

    const onUp = (ue: PointerEvent) => {
        isDragging.value = false;
        grabOffset = 0;
        try { ball.releasePointerCapture(ue.pointerId); } catch {}
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (wasPlayingBeforeDrag) demo.play();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
};
</script>

<style>
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
    width: 2.25rem;
    height: 2.25rem;
    margin-top: -1.125rem;
    background: var(--color-progress);
    box-shadow: 0 2px 10px color-mix(in srgb, var(--color-progress) 35%, transparent);
    pointer-events: none;
}

.track-ball--muted {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: -0.75rem;
    background: color-mix(in srgb, var(--color-progress) 20%, transparent);
    pointer-events: none;
}

.track-ball--singular {
    width: 4.5rem;
    height: 4.5rem;
    margin-top: -2.25rem;
    background: var(--color-progress);
    box-shadow: 0 4px 20px color-mix(in srgb, var(--color-progress) 40%, transparent);
    touch-action: none;
    z-index: 1;
}

.track-line--singular {
    height: 3px;
}

.track-marker {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 9999px;
    pointer-events: none;
}

.track-marker--start {
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
    background: color-mix(in srgb, var(--color-progress) 15%, transparent);
}

.track-marker--end {
    right: 0;
    width: 1.5rem;
    height: 1.5rem;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
    border: 2px dashed color-mix(in srgb, var(--color-progress) 25%, transparent);
}

.track-label {
    line-height: 1;
}
</style>
