<template>
    <LabeledSwitch
        label="WAAPI"
        tooltip="Use Web Animations API for compositor-thread execution"
        :checked="animation.options.useWAAPI"
        @update:checked="(v: boolean) => { animation.options.useWAAPI = v; }"
    />

    <LabeledSelect
        :model-value="animation.options.colorSpace ?? 'oklab'"
        :is-open="isOpen('colorSpace')"
        :items="COLOR_SPACES"
        :descriptions="COLOR_SPACE_DESCRIPTIONS"
        label="color space"
        tooltip="Color interpolation space"
        @update:model-value="(v) => { animation.options.colorSpace = v as any; }"
        @update:open="(v) => setOpen('colorSpace', v)"
    />

    <template v-if="HUE_COLOR_SPACES.has(animation.options.colorSpace ?? 'oklab')">
        <LabeledSelect
            :model-value="animation.options.hueMethod ?? 'shorter'"
            :is-open="isOpen('hueMethod')"
            :items="HUE_METHODS"
            :descriptions="HUE_METHOD_DESCRIPTIONS"
            label="hue method"
            tooltip="Hue interpolation method"
            @update:model-value="(v) => { animation.options.hueMethod = v as any; }"
            @update:open="(v) => setOpen('hueMethod', v)"
        />
    </template>
</template>

<script setup lang="ts">
import type { Animation } from "@src/animation/index";
import LabeledSelect from "@components/custom/LabeledSelect.vue";
import LabeledSwitch from "@components/custom/LabeledSwitch.vue";
import {
    COLOR_SPACE_DESCRIPTIONS,
    HUE_METHOD_DESCRIPTIONS,
} from "../animationDescriptions";

const COLOR_SPACES = ["oklab", "srgb", "lab", "lch", "oklch"] as const;
const HUE_METHODS = ["shorter", "longer", "increasing", "decreasing"] as const;
const HUE_COLOR_SPACES = new Set(["lch", "oklch", "hsl"]);

defineProps<{
    animation: Animation<any>;
    isOpen: (name: string) => boolean;
    setOpen: (name: string, open: boolean) => void;
}>();
</script>
