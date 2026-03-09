<template>
    <IconTooltip text="Use Web Animations API for compositor-thread execution">
        <label class="instrument-serif text-base text-muted-foreground cursor-help">WAAPI</label>
    </IconTooltip>
    <div class="flex items-center">
        <Switch
            :checked="animation.options.useWAAPI"
            @update:checked="(v: boolean) => { animation.options.useWAAPI = v; }"
        />
    </div>

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
import IconTooltip from "@components/custom/IconTooltip.vue";
import LabeledSelect from "@components/custom/LabeledSelect.vue";
import { Switch } from "@components/ui/switch";

const COLOR_SPACES = ["oklab", "srgb", "lab", "lch", "oklch"] as const;
const HUE_METHODS = ["shorter", "longer", "increasing", "decreasing"] as const;
const HUE_COLOR_SPACES = new Set(["lch", "oklch", "hsl"]);

const COLOR_SPACE_DESCRIPTIONS: Record<string, string> = {
    "oklab": "perceptually uniform (default)",
    "srgb": "standard RGB gamut",
    "lab": "CIE L*a*b* perceptual",
    "lch": "cylindrical lab (hue aware)",
    "oklch": "cylindrical oklab (hue aware)",
};

const HUE_METHOD_DESCRIPTIONS: Record<string, string> = {
    "shorter": "shortest arc",
    "longer": "longest arc",
    "increasing": "always clockwise",
    "decreasing": "always counter-clockwise",
};

defineProps<{
    animation: Animation<any>;
    isOpen: (name: string) => boolean;
    setOpen: (name: string, open: boolean) => void;
}>();
</script>
