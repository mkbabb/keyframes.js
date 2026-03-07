<template>
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
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import { clamp } from "@src/math";
import { normalizeColorUnit, colorUnit2 } from "@src/units/color/normalize";
import type { ColorValueUnit } from "./types";

const props = defineProps<{
    currentColor: ColorValueUnit;
    hslColor: ColorValueUnit;
    hsvColor: ColorValueUnit;
    currentColorOpaque: ColorValueUnit;
}>();

const emit = defineEmits<{
    (e: "update", color: ColorValueUnit): void;
}>();

const isDragging = ref(false);

const spectrumRef = useTemplateRef<HTMLElement>("spectrumRef");

const updateSpectrumColor = (event: MouseEvent) => {
    if (!spectrumRef.value) return;

    const rect = spectrumRef.value.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);

    const s = x / rect.width;
    const v = 1 - y / rect.height;

    const hsv = props.hsvColor.clone() as ColorValueUnit;

    hsv.value.s.value = s;
    hsv.value.v.value = v;

    emit("update", hsv);
};

const handleSpectrumChange = (event: MouseEvent) => {
    isDragging.value = true;
    updateSpectrumColor(event);
};

const handleSpectrumMove = (event: MouseEvent) => {
    if (isDragging.value) {
        updateSpectrumColor(event);
    }
};

const stopDragging = () => {
    isDragging.value = false;
};

const spectrumStyle = computed(() => {
    let { h, s, l } = props.hslColor.value;
    const denormalized = normalizeColorUnit(props.currentColor, true, false) as ColorValueUnit;
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
    let { s, v } = props.hsvColor.value;

    return {
        left: `${100 * s.value}%`,
        top: `${100 * (1 - v.value)}%`,
        backgroundColor: props.currentColorOpaque.toString(),
    };
});

defineExpose({
    spectrumRef,
});
</script>
