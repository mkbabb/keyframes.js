<template>
    <div class="grid gap-4 relative">
        <Card>
            <CardHeader class="fraunces w-full mb-0 pb-2">
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
                                    v-for="space in Object.keys(COLOR_SPACE_RANGES)"
                                    :value="space"
                                    >{{ COLOR_SPACE_NAMES[space] }}</SelectItem
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
                    class="w-full h-48 rounded-sm cursor-crosshair relative"
                    :style="spectrumStyle"
                    @mousedown="handleSpectrumChange"
                    @mousemove="handleSpectrumMove"
                    @mouseup="stopDragging"
                    @mouseleave="stopDragging"
                >
                    <div
                        class="w-6 aspect-square border-2 border-solid border-background rounded-full shadow-md absolute -translate-x-1/2 -translate-y-1/2"
                        :style="spectrumDotStyle"
                    ></div>
                </div>

                <div class="contents grid items-center gap-2">
                    <!-- <SliderRoot
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
                </SliderRoot> -->

                    <!-- <SliderRoot
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
                            background: `linear-gradient(to left, ${currentColorOpaque}, transparent)`,
                        }"
                    >
                        <SliderRange class="absolute h-full bg-transparent" />
                    </SliderTrack>
                    <SliderThumb
                        class="block h-4 w-4 rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none"
                    />
                </SliderRoot> -->
                </div>

                <div class="grid gap-2">
                    <div
                        v-for="[component, value] in Object.entries(
                            COLOR_SPACE_RANGES[currentColorSpace],
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
                            :model-value="[currentColor.value[component].value]"
                            @update:model-value="
                                ([v]) => updateColorComponent(v, component, true)
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
                                        {{ denormalizedCurrentColor.value[component].toFixed(2) }}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </SliderRoot>
                    </div>
                </div>

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

        <Card>
            <CardContent>
                <div
                    class="relative flex flex-wrap gap-2 items-center justify-center justify-items-center w-full"
                >
                    <template v-for="(color, ix) in savedColors">
                        <TooltipProvider :delay-duration="100">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <div
                                        class="items-center rounded-sm w-12 aspect-square hover:scale-125 cursor-pointer transition-all border-1 border-solid border-gray-200"
                                        :style="{
                                            backgroundColor: normalizeColorUnit(
                                                color,
                                                true,
                                                false,
                                            ).toString(),
                                        }"
                                        @click="() => onSavedColorClick(color, ix)"
                                    ></div>
                                </TooltipTrigger>
                                <TooltipContent class="fira-code">
                                    {{
                                        normalizeColorUnit(
                                            color,
                                            true,
                                            false,
                                        ).value.toFormattedString()
                                    }}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </template>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Card, CardContent, CardTitle, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "radix-vue";

import { Plus, SquarePlus } from "lucide-vue-next";

import { clamp, scale } from "@src/math";

import { parseCSSColor } from "@src/parsing/units";
import {
    normalizeColorUnits,
    normalizeColorUnit,
    colorUnit2,
    normalizeColorUnitComponent,
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
    COLOR_SPACE_DENORM_UNITS,
} from "@src/units/color/constants";
import { Color, OKLABColor } from "@src/units/color";
import { toast } from "vue-sonner";
import { debounce } from "@src/utils";
import Label from "@components/ui/label/Label.vue";
import Separator from "@components/ui/separator/Separator.vue";
import { Shuffle } from "lucide-vue-next";

const selectAll = (event: MouseEvent) => {
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
): ValueUnit<Color<ValueUnit<number>>> => {
    let color = parseAndNormalizeColor("white");

    color = colorUnit2(color, colorSpace, true, false, true);

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
            [{ color: currentColor.clone() }, { color: color.clone() }],
            ({ color }) => {
                updateFromColor(color[0]);
            },
        )
        .play();

    return color;
};

const copyToClipboard = (text: string) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            toast.success("Copied to clipboard 📋");
        })
        .catch((err) => {
            toast.error("Could not copy to clipboard: " + err);
        });
};

const createGradientStops = (
    color: ValueUnit<Color<ValueUnit<number>>>,
    component: string,
    steps: number,
    to?: ColorSpace,
    normalized: boolean = false,
) => {
    color = color.clone();
    color = normalized ? color : normalizeColorUnit(color);

    to ??= color.value.colorSpace;

    const colorStops = Array.from({ length: steps }).map((_, ix) => {
        let newColor = color.clone();

        newColor.value[component].value = ix / steps;

        newColor = colorUnit2(newColor, to, true, false, true);

        return normalizeColorUnit(newColor, true, true).toString();
    });

    return colorStops.reduce((acc, colorString, ix, arr) => {
        const createString = (percent: number, ix: number) => {
            colorString = arr[ix];

            return `${colorString} ${percent}%`;
        };

        const percent = (ix / arr.length) * 100;
        acc.push(createString(percent, ix));

        // if (ix === arr.length - 1) {
        //     acc.push(createString(100, 0));
        // }

        return acc;
    }, []);
};

const parseAndNormalizeColor = (value: string) => {
    const color = parseCSSColor(value);
    return normalizeColorUnit(color);
};

const parseAndSetColor = debounce(
    (newVal: string) => {
        try {
            inputColor = newVal;

            const color = parseAndNormalizeColor(newVal);

            currentColor = color;
            selectedColorSpace = color.superType[1] as ColorSpace;

            emit("update", denormalizedCurrentColor.value);

            toast.success(`Parsed ${denormalizedCurrentColor.value.toString()} 🎨`);
        } catch (e) {
            toast.error(`Invalid color: ${newVal}`);
        }
    },
    500,
    false,
);

let { color: inputColor, animation } = $defineProps<{
    color: string;
    animation: Animation;
}>();

const emit = defineEmits<{
    (e: "update", color: ValueUnit<Color<ValueUnit<number>>, "color">): void;
}>();

const storedControls = getStoredAnimationGroupControlOptions(animation);

let isDragging = $ref(false);

let spectrumRef = $ref<HTMLElement | null>(null);

let currentColor = $ref(parseAndNormalizeColor(inputColor)) as ValueUnit<
    Color<ValueUnit<number>>,
    "color"
>;

// add 6 white colors to the saved colors:
const savedColors = $ref([]) as ValueUnit<Color<ValueUnit<number>>, "color">[];

for (let i = 0; i < 6; i++) {
    savedColors.push(parseAndNormalizeColor("white"));
}

let currentColorSpace = computed(() => currentColor.superType[1] as ColorSpace);

let selectedColorSpace = $ref<ColorSpace>(currentColorSpace.value);

const denormalizedCurrentColor = computed(() => {
    return normalizeColorUnit(currentColor, true, false);
});

const currentColorOpaque = computed(() => {
    const color = denormalizedCurrentColor.value.clone();
    color.value.alpha.value = 100;
    return color;
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
        }, {});
});

const currentColorRanges = computed(() => {
    return currentColor.value.keys().reduce((acc, key) => {
        const unit = COLOR_SPACE_DENORM_UNITS[currentColorSpace.value][key];
        const range = COLOR_SPACE_RANGES[currentColorSpace.value][key];
        const { min, max } = range[unit] ?? range["number"];

        acc[key] = `(${min}${unit} - ${max}${unit})`;

        return acc;
    }, {});
});

const hslColor = computed(() => {
    const hsl = colorUnit2(currentColor, "hsl", true, false, false);
    return hsl;
});

const hsvColor = computed(() => {
    const hsv = colorUnit2(currentColor, "hsv", true, false, false);
    return hsv;
});

const keys = useMagicKeys();

const onSavedColorClick = (
    color: ValueUnit<Color<ValueUnit<number>>, "color">,
    ix: number,
) => {
    const temp = currentColor.clone();

    currentColor = color.clone();

    if (keys.current.has("meta")) {
        savedColors[ix] = temp;
    }

    emit("update", denormalizedCurrentColor.value);
};

const isDark = useDark({ disableTransition: false });

const isBlankColor = (color: ValueUnit<Color<ValueUnit<number>>, "color">) => {
    return color.value
        .entries()
        .filter(([component]) => component !== "alpha")
        .every(([component, value]) => {
            return value.value === 0 || value.value === 1;
        });
};

// watch for dark mode changes, update the blank colors:
watch(isDark, () => {
    savedColors.forEach((color) => {
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
    const colorIx = savedColors.findIndex((color) => {
        return color.value.toString() === currentColor.value.toString();
    });
    if (colorIx !== -1) {
        return;
    }

    const blankColorIx = savedColors.findIndex((color) => {
        return isBlankColor(color);
    });
    if (blankColorIx !== -1) {
        savedColors[blankColorIx] = currentColor.clone();
        return;
    }

    const color = currentColor.clone();
    const normalized = normalizeColorUnit(color, true, false);

    savedColors.push(currentColor.clone());
};

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
        const normalizedValue = normalizeColorUnitComponent(
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

const spectrumStyle = computed(() => {
    let { h, s, l } = hslColor.value.value;
    const denormalized = normalizeColorUnit(currentColor, true, false);
    denormalized.value.alpha.value = 30;

    h.value = clamp(h.value, 0, 1);

    return {
        background: `
        linear-gradient(to top, #000, transparent),
        linear-gradient(to right, #fff, hsl(${h.value * 360}deg, 100%, 50%))
      `,
        boxShadow: `8px 8px 0px 0px ${denormalized.value.toString()}`,
    };
});

const spectrumDotStyle = computed(() => {
    let { s, v } = hsvColor.value.value;

    return {
        left: `${100 * s.value}%`,
        top: `${100 * (1 - v.value)}%`,
        backgroundColor: currentColorOpaque.value.toString(),
    };
});

const hueSliderStyle = computed(() => {
    const color = parseCSSColor("hsl(0, 100%, 50%)");
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
            color.value[component].value = 0;

            const gradient = createGradientStops(color, component, steps, to, false);

            return [component, gradient] as const;
        })
        .reduce((acc, [component, gradient]) => {
            acc[component] = gradient;
            return acc;
        }, {});

    return gradients;
});

watch(
    () => selectedColorSpace,
    (newVal) => {
        updateToColorSpace(newVal);
    },
);

import * as animations from "@src/animation/animations";
import { Animation, CSSKeyframesAnimation } from "@src/animation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@components/ui/tooltip";
import { rand, useDark, useLocalStorage, useMagicKeys } from "@vueuse/core";
import { getStoredAnimationGroupControlOptions } from "./animation-controls/animationStores";

const hover = animations.hover({ duration: "2s" });

// generate a list of offsets for each color component
const sliderAnimOffsets = computed(() => {
    const offsets = currentColor.value
        .keys()
        .map((component) => {
            const offset = Math.random();
            return [component, offset];
        })
        .reduce((acc, [component, offset]) => {
            acc[component] = offset;
            return acc;
        }, {});

    return offsets;
});

// const slidersAnim = new CSSKeyframesAnimation({
//     iterationCount: "infinite",
//     direction: "alternate",
//     duration: "10s"
// }).fromVars([{ t: 0 }, { t: 1 }], ({ t: [x] }) => {
//     currentColor.value.entries().forEach(([component, value]) => {
//         value.value = x.valueOf();
//     });
// });

onMounted(() => {
    hover.setTargets(spectrumRef);
    hover.play();

    // slidersAnim.play();
});
</script>
