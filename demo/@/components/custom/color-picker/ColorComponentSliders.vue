<template>
    <div class="grid gap-2">
        <div
            v-for="[component, value] in Object.entries(
                colorSpaceRanges[currentColorSpace],
            )"
            :key="component"
            class="grid w-full items-start"
        >
            <Label class="font-bold text-sm"
                >{{ component.toUpperCase()
                }}<span class="font-normal italic opacity-60">{{
                    ` ${currentColorRanges[component]}`
                }}</span></Label
            >

            <SliderRoot
                :min="0"
                :max="1"
                :step="0.001"
                class="relative flex w-full touch-none select-none items-center"
                :model-value="[(currentColor!.value as any)[component].value]"
                @update:model-value="
                    (val: any) => emit('updateComponent', val[0], component, true)
                "
            >
                <SliderTrack
                    class="relative h-6 w-full grow overflow-hidden rounded-sm"
                    :style="{
                        background: `linear-gradient(to right, ${componentsSlidersStyle[
                            component
                        ].join(', ')})`,
                    }"
                >
                    <SliderRange class="absolute h-full bg-transparent" />
                </SliderTrack>
                <TooltipProvider :skip-delay-duration="0" :delay-duration="100">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <SliderThumb
                                class="block h-full w-3 rounded-sm border-2 border-background bg-transparent transition-colors focus-visible:outline-none"
                            />
                        </TooltipTrigger>
                        <TooltipContent class="fira-code">
                            {{ (denormalizedCurrentColor.value as any)[component].toFixed(2) }}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </SliderRoot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui";
import Label from "@components/ui/label/Label.vue";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@components/ui/tooltip";
import type { ColorValueUnit, ColorSpace } from "./types";

defineProps<{
    currentColor: ColorValueUnit;
    currentColorSpace: ColorSpace;
    colorSpaceRanges: Record<string, Record<string, any>>;
    currentColorRanges: Record<string, string>;
    componentsSlidersStyle: Record<string, string[]>;
    denormalizedCurrentColor: ColorValueUnit;
}>();

const emit = defineEmits<{
    (e: "updateComponent", value: number, component: string, normalized: boolean): void;
}>();
</script>
