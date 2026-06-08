<template>
    <div class="glass-resting cartoon-surface p-3 grid gap-3">
        <!-- Live params -->
        <Card surface="cartoon" class="p-0">
            <CardContent class="grid gap-3 p-3">
                <div class="grid gap-1.5">
                    <div class="flex items-center justify-between">
                        <label class="text-admin-label text-muted-foreground">response</label>
                        <span class="text-mono-caption text-foreground tabular-nums">{{ demo.response.value.toFixed(2) }}s</span>
                    </div>
                    <div class="spring-slider">
                        <Slider
                            size="sm"
                            :model-value="[demo.response.value]"
                            :min="0.1"
                            :max="1.2"
                            :step="0.01"
                            aria-label="response"
                            @update:model-value="(v: any) => { demo.response.value = v[0]; }"
                        />
                    </div>
                </div>
                <div class="grid gap-1.5">
                    <div class="flex items-center justify-between">
                        <label class="text-admin-label text-muted-foreground">dampingFraction (&zeta;)</label>
                        <span class="text-mono-caption text-foreground tabular-nums">{{ demo.dampingFraction.value.toFixed(2) }}</span>
                    </div>
                    <div class="spring-slider">
                        <Slider
                            size="sm"
                            :model-value="[demo.dampingFraction.value]"
                            :min="0.2"
                            :max="1.5"
                            :step="0.01"
                            aria-label="dampingFraction"
                            @update:model-value="(v: any) => { demo.dampingFraction.value = v[0]; }"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

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
                <span class="text-admin-label text-muted-foreground">{{ t.preset.response }} / {{ t.preset.dampingFraction }}</span>
            </Button>
        </div>

        <!-- Side-by-side canonical comparison -->
        <Card surface="cartoon" class="p-0">
            <CardContent class="grid gap-2.5 p-3">
                <span class="text-small text-muted-foreground">canonical springs &mdash; re-seat all together</span>
                <div
                    v-for="t in demo.tracks"
                    :key="t.preset.name"
                    class="preset-row"
                >
                    <span class="preset-label text-admin-label shrink-0 w-14 truncate" :title="t.preset.blurb">{{ t.preset.name }}</span>
                    <div class="preset-track relative flex-1 h-7">
                        <div class="progress-rail"></div>
                        <div
                            class="progress-ball preset-ball"
                            :style="{ left: `calc(${clamp01(t.value.value) * 100}%)` }"
                        ></div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- springLinearStops CSS — Monaco editor (follows dark mode) -->
        <Card surface="cartoon" class="p-0 overflow-hidden">
            <CardContent class="grid gap-2 p-2">
                <div class="flex items-center justify-between px-1">
                    <span class="text-small text-muted-foreground">springLinearStops() &rarr; CSS</span>
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
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Button, Card, CardContent, Slider } from "@mkbabb/glass-ui";

import { springLinearStops } from "@src/animation/springLinearStops";
import CopyButton from "@components/custom/CopyButton.vue";
import CSSCodeEditor from "@components/custom/animation-controls/keyframes/CSSCodeEditor.vue";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const isActivePreset = (t: SpringTrack) =>
    Math.abs(demo.response.value - t.preset.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - t.preset.dampingFraction) < 1e-6;

const applyPreset = (preset: SpringPreset) => {
    demo.response.value = preset.response;
    demo.dampingFraction.value = preset.dampingFraction;
};

// CSS `linear()` token sampled from the live params. Two-way bound to the
// Monaco editor: editing the params regenerates it; the editor is read-mostly
// here (the model just mirrors the generated stops).
const linearStopsCss = ref("");
const generated = computed(() =>
    `--spring-easing: ${springLinearStops({
        response: demo.response.value,
        dampingFraction: demo.dampingFraction.value,
    })};`,
);
watch(generated, (css) => { linearStopsCss.value = css; }, { immediate: true });
</script>

<style scoped>
.spring-slider {
    --slider-track-bg: color-mix(in srgb, var(--color-slider-track) 15%, transparent);
    --slider-range-bg: color-mix(in srgb, var(--color-slider-track) 40%, transparent);
    --slider-thumb-bg: var(--color-progress);
}
.spring-slider:hover {
    --slider-thumb-bg: color-mix(in srgb, var(--color-progress) 80%, transparent);
}

.preset-active {
    border-color: var(--color-progress);
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
