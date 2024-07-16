<template>
    <Card>
        <CardHeader class="fraunces w-full mb-0 pb-2">
            <h2 class="text-xl italic flex w-full relative">
                <div class="flex items-center gap-x-2 m-0">
                    {{ COLOR_SPACE_NAMES[currentColorSpace] }}
                    <CopyButton class="w-4 h-4" :text="currentColorString" />
                </div>
                <div
                    class="w-8 absolute top-0 right-0 aspect-square rounded-full hover:scale-105 flex items-center justify-items-center justify-center"
                    :style="{
                        backgroundColor: currentColorString,
                    }"
                ></div>
            </h2>
            <CardTitle class="flex text-4xl h-16 gap-x-2 flex-wrap">
                <template
                    v-for="([component, value], ix) in Object.entries(
                        COLOR_SPACE_RANGES[currentColorSpace],
                    ).filter(([key]) => key !== 'alpha')"
                    :key="component"
                >
                    <span
                        contenteditable="true"
                        class="focus-visible:outline-none"
                        @input="
                            (e) =>
                                updateColorComponentDebounced(
                                    parseFloat((e.target as any).innerText),
                                    component,
                                )
                        "
                        >{{ currentColorComponentsFormatted[component]
                        }}{{
                            Object.entries(
                                COLOR_SPACE_RANGES[currentColorSpace],
                            ).filter(([key]) => key !== "alpha").length -
                                1 ===
                            ix
                                ? ""
                                : ", "
                        }}</span
                    >
                </template>
            </CardTitle>
        </CardHeader>
        <CardContent class="fraunces grid gap-4">
            <div
                ref="spectrumRef"
                class="w-full h-40 mb-4 rounded-md cursor-crosshair relative"
                :style="spectrumStyle"
                @mousedown="handleSpectrumChange"
                @mousemove="handleSpectrumMove"
                @mouseup="stopDragging"
                @mouseleave="stopDragging"
            >
                <div
                    class="w-6 h-6 border-2 border-solid border-background rounded-full shadow-md absolute -translate-x-1/2 -translate-y-1/2"
                    :style="dotStyle"
                ></div>
            </div>

            <div class="grid items-center gap-2">
                <SliderRoot
                    :min="0"
                    :max="1"
                    :step="0.01"
                    class="relative flex w-full touch-none select-none items-center"
                    :model-value="[hslColor.value.h.value]"
                    @update:model-value="([v]) => updateHue(v)"
                >
                    <SliderTrack
                        class="relative h-6 w-full grow overflow-hidden rounded-full bg-secondary"
                        :style="hueSliderStyle"
                    >
                        <SliderRange class="absolute h-full bg-transparent" />
                    </SliderTrack>
                    <SliderThumb
                        class="block h-4 w-4 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none"
                    />
                </SliderRoot>
                <SliderRoot
                    :min="0"
                    :max="1"
                    :step="0.01"
                    class="relative flex w-full touch-none select-none items-center"
                    :model-value="[currentColor.value['alpha'].value]"
                    @update:model-value="
                        ([v]) => updateColorComponent(v, 'alpha', true)
                    "
                >
                    <SliderTrack
                        class="relative h-6 w-full grow overflow-hidden rounded-full bg-secondary"
                        :style="{
                            background: `linear-gradient(to left, ${currentColorStringOpaque}, transparent)`,
                        }"
                    >
                        <SliderRange class="absolute h-full bg-transparent" />
                    </SliderTrack>
                    <SliderThumb
                        class="block h-4 w-4 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none"
                    />
                </SliderRoot>
            </div>

            <div
                v-for="[component, value] in Object.entries(
                    COLOR_SPACE_RANGES[currentColorSpace],
                ).filter(([key]) => key !== 'alpha')"
                :key="component"
                class="flex w-full gap-2 items-center"
            >
                <Label class="font-bold text-xl">{{ component.toUpperCase() }}</Label>

                <SliderRoot
                    :min="0"
                    :max="1"
                    :step="0.01"
                    class="relative flex w-full touch-none select-none items-center"
                    :model-value="[currentColor.value[component].value]"
                    @update:model-value="
                        ([v]) => updateColorComponent(v, component, true)
                    "
                >
                    <SliderTrack
                        class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
                    >
                        <SliderRange class="absolute h-full bg-primary" />
                    </SliderTrack>
                    <SliderThumb
                        class="block h-4 w-4 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none"
                    />
                </SliderRoot>
            </div>

            <div class="flex items-center gap-x-2">
                <Select
                    :model-value="selectedColorSpace"
                    @update:model-value="
                        (colorSpace: any) => {
                            selectedColorSpace = colorSpace;
                        }
                    "
                >
                    <SelectTrigger class="fira-code">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup class="fira-code">
                            <SelectItem
                                v-for="space in Object.keys(COLOR_SPACE_RANGES)"
                                :value="space"
                                >{{ space }}</SelectItem
                            >
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input
                    :model-value="inputColor"
                    class="fira-code"
                    @update:model-value="parseAndSetColor"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Card, CardContent, CardTitle, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "radix-vue";

import { clamp } from "@src/math";

import { parseCSSColor } from "@src/parsing/units";
import {
    normalizeColorUnits,
    normalizeColorUnit,
    colorUnit2,
    normalizeColorComponent,
} from "@src/units/color/normalize";
import { cn } from "@utils/utils";
import { ValueUnit } from "@src/units";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@components/ui/select";
import CopyButton from "./CopyButton.vue";
import { lerpColorValue, lerpObjectValue, lerpValue } from "@src/animation/utils";
import { InterpolatedVar } from "@src/animation/constants";
import {
    ColorSpace,
    COLOR_SPACE_RANGES,
    COLOR_SPACE_NAMES,
} from "@src/units/color/constants";
import { Color, OKLABColor } from "@src/units/color";
import { toast } from "vue-sonner";
import { debounce } from "@src/utils";
import Label from "@components/ui/label/Label.vue";

const parseColor = (value: string) => {
    const color = parseCSSColor(value);
    return normalizeColorUnit(color);
};

const formatNumber = (value: number) => {
    return Number(value.toFixed(2));
};

let { color: inputColor } = $defineProps<{
    color: string;
}>();

const emit = defineEmits<{
    (e: "update", color: ValueUnit<Color<ValueUnit<number>>, "color">): void;
}>();

let currentColor = $ref(parseColor(inputColor)) as ValueUnit<
    Color<ValueUnit<number>>,
    "color"
>;
let currentColorSpace = computed(() => currentColor.superType[1] as ColorSpace);

let selectedColorSpace = $ref<ColorSpace>(currentColorSpace.value);

const denormalizedCurrentColor = computed(() => {
    return normalizeColorUnit(currentColor, true, false);
});

const currentColorString = computed(() => {
    return denormalizedCurrentColor.value.toString();
});

const currentColorStringOpaque = computed(() => {
    const color = denormalizedCurrentColor.value;
    color.value.alpha.value = 100;

    return color;
});

const hslColor = computed(() => {
    const hsl = colorUnit2(currentColor, "hsl", true, false, false);
    return hsl;
});

const hsvColor = computed(() => {
    const hsv = colorUnit2(currentColor, "hsv", true, false, false);
    return hsv;
});

let isDragging = $ref(false);
let spectrumRef = $ref<HTMLElement | null>(null);

const updateFromColor = (color: ValueUnit<Color<ValueUnit<number>>, "color">) => {
    const converted = colorUnit2(color, currentColorSpace.value, true);
    currentColor = converted as any;

    emit("update", denormalizedCurrentColor.value);
};

const updateToColorSpace = (to: ColorSpace) => {
    currentColor = colorUnit2(currentColor, to, true);
    selectedColorSpace = to;

    emit("update", denormalizedCurrentColor.value);
};

const updateColorComponent = (
    value: number,
    component: string,
    normalized: boolean = false,
) => {
    if (normalized) {
        currentColor.value[component].value = value;
    } else {
        const normalizedValue = normalizeColorComponent(
            value,
            denormalizedCurrentColor.value.value[component].unit,
            currentColorSpace.value,
            component,
            false,
        );

        currentColor.value[component].value = normalizedValue.value;
    }

    emit("update", denormalizedCurrentColor.value);
};

const updateColorComponentDebounced = debounce(updateColorComponent, 500);

const updateHue = (value: number) => {
    const hsl = hslColor.value;
    hsl.value.h.value = value;

    updateFromColor(hsl);
};

const currentColorComponentsFormatted = computed(() => {
    return (
        denormalizedCurrentColor.value.value
            .entries()
            // .filter(([key]) => key !== "alpha")
            .map(([key, { value, unit }]) => {
                value = formatNumber(value);
                const s = `${value}${unit}`;

                return [key, s];
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {})
    );
});

const spectrumStyle = computed(() => {
    const { h, s, l } = hslColor.value.value;
    const denormalized = normalizeColorUnit(currentColor, true, false);
    denormalized.value.alpha.value = 30;

    return {
        background: `
        linear-gradient(to top, #000, transparent),
        linear-gradient(to right, #fff, hsl(${h.value * 360}deg, 100%, 50%))
      `,
        boxShadow: `8px 8px 0px 0px ${denormalized.value.toString()}`,
    };
});

const hueSliderStyle = computed(() => {
    const baseColorCount = 14;

    const baseColors = Array.from({ length: baseColorCount }).map((_, ix) => {
        const hsl = parseCSSColor(`hsl(${(ix / baseColorCount) * 360}deg, 100%, 50%)`);

        const oklab = colorUnit2(hsl, "oklab");

        return oklab;
    });

    const interpVars = baseColors.reduce((acc, color, ix) => {
        const nextColor = baseColors[ix + 1];
        if (!nextColor) return acc;

        acc.push({
            start: color,
            stop: nextColor,
            value: color.clone(),
        } as InterpolatedVar<OKLABColor>);

        return acc;
    }, []);

    const steps = 10;

    interpVars.reduce((acc, v) => {
        const stepSize = 1 / steps;

        for (let t = 0; t < 1; t += stepSize) {
            acc.push(lerpColorValue(t, v));
        }

        acc.push(v);

        return acc;
    }, []);

    const colorStrings = interpVars.map((v) => {
        return normalizeColorUnit(v.value, true).toString();
    });

    // make a linear gradient from the interpolated colors
    const gradient = colorStrings.reduce((acc, colorString, ix) => {
        const createString = (percent: number, ix: number) => {
            colorString = colorStrings[ix];

            return `${colorString} ${percent}%`;
        };

        const percent = (ix / colorStrings.length) * 100;
        acc.push(createString(percent, ix));

        if (ix === colorStrings.length - 1) {
            acc.push(createString(100, 0));
        }

        return acc;
    }, []);

    return {
        background: `linear-gradient(to right, ${gradient.join(", ")})`,
    };
});

const dotStyle = computed(() => {
    const { s, v } = hsvColor.value.value;

    return {
        left: `${100 * s.value}%`,
        top: `${100 * (1 - v.value)}%`,
        backgroundColor: currentColorString.value,
    };
});

const updateSpectrumColor = (event: MouseEvent) => {
    if (!spectrumRef) return;

    const rect = spectrumRef.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);

    const s = x / rect.width;
    const v = 1 - y / rect.height;

    const hsv = hsvColor.value;

    hsv.value.s.value = s;
    hsv.value.v.value = v;

    updateFromColor(hsv);
};

const handleSpectrumChange = (event: MouseEvent) => {
    isDragging = true;
    updateSpectrumColor(event);
};

const handleSpectrumMove = (event: MouseEvent) => {
    if (isDragging) {
        updateSpectrumColor(event);
    }
};

const stopDragging = () => {
    isDragging = false;
};

const parseAndSetColor = debounce(
    (newVal: string) => {
        try {
            inputColor = newVal;

            const color = parseColor(newVal);

            currentColor = color;
            selectedColorSpace = color.superType[1] as ColorSpace;

            emit("update", denormalizedCurrentColor.value);

            toast.success(`Parsed ${currentColorString.value} 🎨`);
        } catch (e) {
            toast.error(`Invalid color: ${newVal}`);
        }
    },
    500,
    false,
);

watch(
    () => selectedColorSpace,
    (newVal) => {
        updateToColorSpace(newVal);
    },
);
</script>
import { OKLABColor } from "@src/units/color"; import { Color, ColorSpace } from
"three";
