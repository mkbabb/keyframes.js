<template>
    <!-- G6 + G5 (H.W10.S4) — the spring sidebar NORMALIZED onto the standard
         controls component: ONE `Card surface="cartoon" tier="quiet"` (the H.W9
         quiet register; the Card primitive carries `rounded-card` by construction
         — dissolves G2) wrapping `Labeled*` label-left rows + the spring domain
         content in ONE `panel-content` flow. The former ×3 inner sub-Cards + the
         hand-rolled `text-admin-label`/`size="sm"` param rows are DELETED (no
         legacy beside the replacement) — the control sizing lifts to the standard
         scale automatically (G5: same components → same sizes). -->
    <Card surface="cartoon" tier="quiet" class="w-full overflow-visible">
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- J.W7a S5 / XH-4 (D22) — the view switcher (H.W5.S3) lives in the
                 RAIL now, at the head of the spring's control panel: relocated
                 out of the top-center band it shared (and collided) with the
                 scene-switcher dock on mobile (cross-hierarchy #4). One spring
                 curve, two views — the live SpringProgress solver, and that same
                 spring linear() easing a real @starting-style / allow-discrete
                 transition. -->
            <div
                class="spring-view-switch glass-resting cartoon-surface flex shrink-0 gap-1 rounded-full p-1"
                role="tablist"
                aria-label="Spring view"
            >
                <button
                    type="button"
                    role="tab"
                    class="spring-view-tab text-small btn-interactive rounded-full px-3.5 py-1"
                    :class="{ 'spring-view-active': demo.view.value === 'solver' }"
                    :aria-selected="demo.view.value === 'solver'"
                    @click="demo.view.value = 'solver'"
                >
                    Live solver
                </button>
                <button
                    type="button"
                    role="tab"
                    class="spring-view-tab text-small btn-interactive rounded-full px-3.5 py-1"
                    :class="{ 'spring-view-active': demo.view.value === 'discrete' }"
                    :aria-selected="demo.view.value === 'discrete'"
                    @click="demo.view.value = 'discrete'"
                >
                    Discrete transition
                </button>
            </div>

            <!-- Live params — label-left rows (the H.W9 F1 idiom) -->
            <LabeledSlider
                :model-value="demo.response.value"
                label="response"
                label-class="text-mono-small text-muted-foreground"
                tooltip="Spring response time (s) — higher = slower"
                :min="0.1"
                :max="1.2"
                :step="0.01"
                @update:model-value="(v) => { demo.response.value = v; }"
            />
            <LabeledSlider
                :model-value="demo.dampingFraction.value"
                label="damping (ζ)"
                label-class="text-mono-small text-muted-foreground"
                tooltip="Damping fraction (ζ) — <1 overshoots, ≥1 settles"
                :min="0.2"
                :max="1.5"
                :step="0.01"
                @update:model-value="(v) => { demo.dampingFraction.value = v; }"
            />

            <!-- Canonical preset buttons -->
            <div class="grid grid-cols-2 gap-2">
                <Button
                    v-for="t in demo.tracks"
                    :key="t.preset.name"
                    variant="outline"
                    size="sm"
                    class="h-auto py-1.5 flex flex-col items-start gap-0.5 btn-interactive"
                    :class="{ 'preset-active': isActivePreset(t) }"
                    @click="applyPreset(t.preset)"
                >
                    <span class="text-small text-foreground capitalize">{{ t.preset.name }}</span>
                    <span class="text-mono-caption text-muted-foreground">{{ t.preset.response }} / {{ t.preset.dampingFraction }}</span>
                </Button>
            </div>

            <!-- Side-by-side canonical comparison (folded into the parent Card) -->
            <div class="grid gap-2.5">
                <span class="text-mono-small text-muted-foreground">canonical springs &mdash; re-seat all together</span>
                <div
                    v-for="(t, i) in demo.tracks"
                    :key="t.preset.name"
                    class="preset-row"
                >
                    <span class="preset-label text-mono-caption shrink-0 w-14 truncate" :title="t.preset.blurb">{{ t.preset.name }}</span>
                    <div class="preset-track relative flex-1 h-7">
                        <div class="progress-rail"></div>
                        <!-- Painter-positioned (J.W2 S5): the track balls are the
                             60 Hz hot path — direct style writes, no reactive
                             :style binding. -->
                        <div
                            :ref="(el: any) => setTrackBallEl(i, el)"
                            class="progress-ball preset-ball"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- springLinearStops CSS — Monaco editor (follows dark mode) -->
            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-mono-small text-muted-foreground">springLinearStops() &rarr; CSS</span>
                    <CopyButton class="shrink-0 w-4 h-4" :text="linearStopsCss" />
                </div>
                <CSSCodeEditor
                    v-model="linearStopsCss"
                    height="110px"
                    :font-size="12"
                    :line-numbers="false"
                    :padding="8"
                    :border="false"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, watch } from "vue";
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/custom/CopyButton.vue";
import CSSCodeEditor from "@components/custom/animation-controls/keyframes/CSSCodeEditor.vue";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── J.W2 S5 (DS-3) — the preset-track ball painter ──────────────────────────
// The 4 comparison balls are the 60 Hz hot path: positioned by a registered
// painter reading the demo's non-reactive `springLive` snapshot (direct
// `style.left` writes, off the Vue render graph) — the former per-frame
// reactive `t.value` :style bindings are DELETED with the migration.
const trackBallEls: (HTMLElement | null)[] = [];
const setTrackBallEl = (i: number, el: any) => {
    trackBallEls[i] = (el as HTMLElement) ?? null;
};

let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const values = demo.springLive.trackValues;
        for (let i = 0; i < trackBallEls.length; i++) {
            const el = trackBallEls[i];
            if (el) el.style.left = `${clamp01(values[i] ?? 0) * 100}%`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

const isActivePreset = (t: SpringTrack) =>
    Math.abs(demo.response.value - t.preset.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - t.preset.dampingFraction) < 1e-6;

const applyPreset = (preset: SpringPreset) => {
    demo.response.value = preset.response;
    demo.dampingFraction.value = preset.dampingFraction;
};

// CSS `linear()` token sampled from the live params — the ONE springLinearStops
// surface (useSpringLinearStops, H.W5.S3). Two-way bound to the Monaco editor:
// editing the params regenerates it; the editor is read-mostly here (the model
// just mirrors the generated stops).
const springLinear = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);
const linearStopsCss = ref("");
const generated = computed(() => `--spring-easing: ${springLinear.value};`);
watch(generated, (css) => { linearStopsCss.value = css; }, { immediate: true });
</script>

<style scoped>
/* ── F1 (H.W9.S3 idiom) — label-LEFT / value-RIGHT per row ──
   G6 normalizes the spring sidebar onto the standard component, so it INHERITS
   the F1 row shape (matching the standard AnimationControlsControls rows). Every
   glass-ui `.labeled-field` (LabeledSlider here) becomes a two-cell grid (label
   auto, control 1fr). The durable home is glass-ui's BOOKED `LabeledField
   orientation="horizontal"` (inv-16 HANDOFF — NOT patched here). */
.panel-content :deep(.labeled-field) {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.75rem;
    row-gap: 0.25rem;
}
.panel-content :deep(.labeled-field .labeled-field-error) {
    grid-column: 1 / -1;
}

.preset-active {
    border-color: var(--color-progress);
    box-shadow: 0 0 0 1px var(--color-progress) inset;
}

/* The view switcher (H.W5.S3, relocated here at J.W7a D22) — a compact
   segmented control. Rides the shared glass-resting/cartoon-surface depth
   idiom; the active tab takes the progress accent the spring scene uses
   throughout. */
.spring-view-switch {
    align-self: center;
}
.spring-view-tab {
    color: var(--muted-foreground);
    transition:
        color var(--duration-fast, 150ms) ease,
        background-color var(--duration-fast, 150ms) ease;
}
.spring-view-active {
    color: var(--color-progress);
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 0 0 1px var(--color-progress) inset;
}

.preset-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.preset-track {
    display: flex;
    align-items: center;
}
/* The rail + ball geometry come from the shared .progress-rail / .progress-ball
   idiom (design-idioms.css). The former 10% rail folds to the canonical 8% (a
   named befitting motion-cohesion delta). The preset ball is the smallest +
   quietest (a compact preset indicator), so it suppresses the glow and rides
   `left:` (the idiom centers vertically; this scoped modifier centers
   horizontally + sets the per-site size). */
.preset-ball {
    --ball-size: 1.1rem;
    --ball-glow: 0%;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}
.preset-label {
    color: var(--muted-foreground);
}
</style>
