<template>
    <div class="grid gap-4 relative">
        <Card>
            <CardHeader class="instrument-serif w-full mb-0 pb-2">
                <h2 class="text-xl italic flex w-full relative">
                    <Select
                        :model-value="selectedColorSpace"
                        @update:model-value="
                            (colorSpace: any) => {
                                selectedColorSpace = colorSpace;
                            }
                        "
                    >
                        <SelectTrigger
                            class="w-fit h-fit text-xl p-0 m-0 border-none fira-code hover:scale-105"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup class="fira-code">
                                <SelectItem
                                    v-for="space in Object.keys(colorSpaceRanges)"
                                    :value="space"
                                    >{{ colorSpaceNames[space] }}</SelectItem
                                >
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div
                        @click="
                            copyToClipboard(denormalizedCurrentColor.value.toString())
                        "
                        class="w-16 absolute top-0 right-0 aspect-square rounded-full hover:scale-125 flex items-center justify-items-center justify-center transition-transform cursor-pointer"
                        :style="{
                            backgroundColor: denormalizedCurrentColor.value.toString(),
                        }"
                    ></div>
                </h2>
                <CardTitle
                    contenteditable="true"
                    class="flex text-4xl h-16 gap-x-2 flex-wrap focus-visible:outline-none"
                >
                    <template
                        v-for="([component, value], ix) in Object.entries(
                            colorSpaceRanges[currentColorSpace],
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
                                    colorSpaceRanges[currentColorSpace],
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
            <CardContent class="instrument-serif grid gap-4">
                <ColorSpectrumPicker
                    :current-color="currentColor!"
                    :hsl-color="hslColor"
                    :hsv-color="hsvColor"
                    :current-color-opaque="currentColorOpaque"
                    ref="spectrumPickerRef"
                    @update="updateFromColor"
                />

                <div class="contents grid items-center gap-2">
                </div>

                <ColorComponentSliders
                    :current-color="currentColor!"
                    :current-color-space="currentColorSpace"
                    :color-space-ranges="colorSpaceRanges"
                    :current-color-ranges="currentColorRanges"
                    :components-sliders-style="componentsSlidersStyle"
                    :denormalized-current-color="denormalizedCurrentColor"
                    @update-component="updateColorComponent"
                />

                <div class="flex items-center gap-x-2 w-full overflow-hidden">
                    <span
                        contenteditable
                        class="border overflow-hidden border-input bg-background rounded-sm px-3 py-2 focus-visible:outline-none fira-code block items-center justify-items-center justify-center w-full text-ellipsis flex-nowrap text-nowrap transition-all"
                        @input="(e) => parseAndSetColor((e.target as any).innerText)"
                        @focus="selectAll"
                        >{{ denormalizedCurrentColor.value.toFormattedString() }}</span
                    >
                    <SquarePlus
                        @click="() => addColorClick()"
                        class="h-6 w-6 stroke-foreground hover:scale-125 transition-all cursor-pointer"
                    />

                    <Shuffle
                        @click="
                            () =>
                                updateFromColor(generateRandomColor(selectedColorSpace))
                        "
                        class="h-6 w-6 stroke-foreground hover:scale-125 transition-all cursor-pointer"
                    />
                </div>
            </CardContent>
        </Card>

        <SavedColorsPanel
            :saved-colors="savedColors!"
            @select="onSavedColorClick"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Card, CardContent, CardTitle, CardHeader } from "@components/ui/card";
import { SquarePlus, Shuffle } from "lucide-vue-next";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@components/ui/select";
import { parseCSSColor } from "@src/parsing/units";
import {
    normalizeColorUnit,
    colorUnit2,
    normalizeColorUnitComponent,
} from "@src/units/color/normalize";
import {
    COLOR_SPACE_RANGES,
    COLOR_SPACE_NAMES,
    COLOR_SPACE_DENORM_UNITS,
} from "@src/units/color/constants";
import type { ColorSpace } from "@src/units/color/constants";
import { debounce } from "@src/utils";
import { useMagicKeys } from "@vueuse/core";
import { useClipboard } from "@composables/useClipboard";
import { useGlobalDark } from "@components/custom/dark-mode-toggle";
import { CSSKeyframesAnimation } from "@src/animation";
import type { Animation } from "@src/animation";
import * as animations from "@src/animation/animations";
import { getStoredAnimationGroupControlOptions } from "../animation-controls/animationStores";
import type { ColorValueUnit } from "./types";

import ColorSpectrumPicker from "./ColorSpectrumPicker.vue";
import ColorComponentSliders from "./ColorComponentSliders.vue";
import SavedColorsPanel from "./SavedColorsPanel.vue";

const props = defineProps<{
    color: string;
    animation: Animation;
}>();

const emit = defineEmits<{
    (e: "update", color: ColorValueUnit): void;
}>();

const storedControls = getStoredAnimationGroupControlOptions(props.animation);

// Typed aliases for template use (avoids string-indexing errors on readonly typed objects)
const colorSpaceNames = COLOR_SPACE_NAMES as Record<string, string>;
const colorSpaceRanges = COLOR_SPACE_RANGES as Record<string, Record<string, any>>;

const spectrumPickerRef = ref<InstanceType<typeof ColorSpectrumPicker> | null>(null);

const currentColor = ref(parseAndNormalizeColor(props.color)) as ReturnType<typeof ref<ColorValueUnit>>;

// add 6 white colors to the saved colors:
const savedColors = ref([]) as ReturnType<typeof ref<ColorValueUnit[]>>;

for (let i = 0; i < 6; i++) {
    savedColors.value!.push(parseAndNormalizeColor("white"));
}

const currentColorSpace = computed(() => currentColor.value!.superType![1] as ColorSpace);

const selectedColorSpace = ref<ColorSpace>(currentColorSpace.value);

const selectAll = (event: FocusEvent) => {
    const target = event.target as HTMLSpanElement;
    const range = document.createRange();

    range.selectNodeContents(target);
    const selection = window.getSelection();

    // if the range is already all, do nothing:
    if (selection?.toString() === target.innerText) return;

    selection?.removeAllRanges();
    selection?.addRange(range);
};

const generateRandomColor = (
    colorSpace: ColorSpace,
): ColorValueUnit => {
    let color = parseAndNormalizeColor("white");

    color = colorUnit2(color, colorSpace, true, false, true) as ColorValueUnit;

    color.value
        .entries()
        .filter(([component]) => component !== "alpha")
        .forEach(([component, value]) => {
            const randomValue = Math.random();
            value.value = randomValue;
        });

    new CSSKeyframesAnimation({
        duration: 700,
    })
        .fromVars(
            [{ color: currentColor.value!.clone() }, { color: color.clone() }],
            ({ color }) => {
                updateFromColor(color[0] as ColorValueUnit);
            },
        )
        .play();

    return color;
};

const { copy: copyToClipboard } = useClipboard();

const createGradientStops = (
    color: ColorValueUnit,
    component: string,
    steps: number,
    to?: ColorSpace,
    normalized: boolean = false,
) => {
    color = color.clone();
    color = normalized ? color : normalizeColorUnit(color) as typeof color;

    to ??= color.value.colorSpace;

    const colorStops = Array.from({ length: steps }).map((_, ix) => {
        let newColor = color.clone();

        (newColor.value as any)[component].value = ix / steps;

        newColor = colorUnit2(newColor, to, true, false, true) as typeof newColor;

        return (normalizeColorUnit(newColor, true, true) as typeof newColor).toString();
    });

    return colorStops.reduce((acc, colorString, ix, arr) => {
        const createString = (percent: number, ix: number) => {
            colorString = arr[ix];

            return `${colorString} ${percent}%`;
        };

        const percent = (ix / arr.length) * 100;
        acc.push(createString(percent, ix));

        return acc;
    }, [] as string[]);
};

function parseAndNormalizeColor(value: string): ColorValueUnit {
    const color = parseCSSColor(value) as ColorValueUnit;
    return normalizeColorUnit(color);
}

const parseAndSetColor = debounce(
    (newVal: string) => {
        try {
            const color = parseAndNormalizeColor(newVal);

            currentColor.value = color;
            selectedColorSpace.value = color.superType![1] as ColorSpace;

            emit("update", denormalizedCurrentColor.value);

            toast.success(`Parsed ${denormalizedCurrentColor.value.toString()} 🎨`);
        } catch (e) {
            toast.error(`Invalid color: ${newVal}`);
        }
    },
    500,
    false,
);

const denormalizedCurrentColor = computed(() => {
    return normalizeColorUnit(currentColor.value!, true, false) as ColorValueUnit;
});

const currentColorOpaque = computed(() => {
    const color = denormalizedCurrentColor.value.clone();
    color.value.alpha.value = 100;
    return color as ColorValueUnit;
});

const currentColorComponentsFormatted = computed(() => {
    return denormalizedCurrentColor.value.value
        .entries()
        .filter(([key]) => key !== "alpha")
        .map(([key, value]) => {
            const s = value.toFixed(1);

            return [key, s];
        })
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
});

const currentColorRanges = computed(() => {
    return currentColor.value!.value.keys().reduce((acc, key) => {
        const unit = (COLOR_SPACE_DENORM_UNITS as Record<string, Record<string, string>>)[currentColorSpace.value][key];
        const range = (COLOR_SPACE_RANGES as Record<string, Record<string, Record<string, { min: number; max: number }>>>)[currentColorSpace.value][key];
        const { min, max } = range[unit] ?? range["number"];

        acc[key] = `(${min}${unit} - ${max}${unit})`;

        return acc;
    }, {} as Record<string, string>);
});

const hslColor = computed(() => {
    const hsl = colorUnit2(currentColor.value!, "hsl", true, false, false);
    return hsl as ColorValueUnit;
});

const hsvColor = computed(() => {
    const hsv = colorUnit2(currentColor.value!, "hsv", true, false, false);
    return hsv as ColorValueUnit;
});

const keys = useMagicKeys();

const onSavedColorClick = (
    color: ColorValueUnit,
    ix: number,
) => {
    const temp = currentColor.value!.clone();

    currentColor.value = color.clone();

    if (keys.current.has("meta")) {
        savedColors.value![ix] = temp;
    }

    emit("update", denormalizedCurrentColor.value);
};

const { isDark } = useGlobalDark();

const isBlankColor = (color: ColorValueUnit) => {
    return color.value
        .entries()
        .filter(([component]) => component !== "alpha")
        .every(([component, value]) => {
            return value.value === 0 || value.value === 1;
        });
};

// watch for dark mode changes, update the blank colors:
watch(isDark, () => {
    savedColors.value!.forEach((color) => {
        if (isBlankColor(color)) {
            color.value
                .entries()
                .filter(([component]) => component !== "alpha")
                .forEach(([component, value]) => {
                    value.value = isDark.value ? 1 : 0;
                });
        }
    });
});

const addColorClick = () => {
    const colorIx = savedColors.value!.findIndex((color) => {
        return color.value.toString() === currentColor.value!.value.toString();
    });
    if (colorIx !== -1) {
        return;
    }

    const blankColorIx = savedColors.value!.findIndex((color) => {
        return isBlankColor(color);
    });
    if (blankColorIx !== -1) {
        savedColors.value![blankColorIx] = currentColor.value!.clone();
        return;
    }

    const color = currentColor.value!.clone();
    const normalized = normalizeColorUnit(color, true, false);

    savedColors.value!.push(currentColor.value!.clone());
};

const updateFromColor = (color: ColorValueUnit) => {
    const converted = colorUnit2(color, currentColorSpace.value, true) as ColorValueUnit;
    currentColor.value = converted;

    emit("update", denormalizedCurrentColor.value);
};

const updateToColorSpace = (to: ColorSpace) => {
    currentColor.value = colorUnit2(currentColor.value!, to, true) as ColorValueUnit;
    selectedColorSpace.value = to;

    emit("update", denormalizedCurrentColor.value);
};

const updateColorComponent = (
    value: number,
    component: string,
    normalized: boolean = false,
) => {
    if (normalized) {
        (currentColor.value!.value as any)[component].value = value;
    } else {
        const normalizedValue = normalizeColorUnitComponent(
            value,
            (denormalizedCurrentColor.value.value as any)[component].unit,
            currentColorSpace.value,
            component,
            false,
        );

        (currentColor.value!.value as any)[component].value = normalizedValue.value;
    }

    emit("update", denormalizedCurrentColor.value);
};
const updateColorComponentDebounced = debounce(updateColorComponent, 500);

const updateHue = (value: number) => {
    const hsl = hslColor.value;
    hsl.value.h.value = value;

    updateFromColor(hsl);
};

const hueSliderStyle = computed(() => {
    const color = parseCSSColor("hsl(0, 100%, 50%)") as ColorValueUnit;
    const gradient = createGradientStops(color, "h", 10, "oklab");

    return {
        background: `linear-gradient(to right, ${gradient.join(", ")})`,
    };
});

const componentsSlidersStyle = computed(() => {
    const steps = 10;
    const to = "rgb" as ColorSpace;

    const gradients = currentColorOpaque.value.value
        .entries()
        .map(([component, value]) => {
            const color = currentColorOpaque.value.clone();
            (color.value as any)[component].value = 0;

            const gradient = createGradientStops(color, component, steps, to, false);

            return [component, gradient] as const;
        })
        .reduce((acc, [component, gradient]) => {
            acc[component] = gradient;
            return acc;
        }, {} as Record<string, string[]>);

    return gradients;
});

watch(selectedColorSpace, (newVal) => {
    updateToColorSpace(newVal);
});

const hover = animations.hover({ duration: "2s" });

// generate a list of offsets for each color component
const sliderAnimOffsets = computed(() => {
    const offsets = currentColor.value!.value
        .keys()
        .map((component) => {
            const offset = Math.random();
            return [component, offset] as const;
        })
        .reduce((acc, [component, offset]) => {
            acc[component as string] = offset;
            return acc;
        }, {} as Record<string, number>);

    return offsets;
});

onMounted(() => {
    const spectrumEl = spectrumPickerRef.value?.spectrumRef;
    if (spectrumEl) {
        hover.setTargets(spectrumEl);
        hover.play();
    }
});
</script>
