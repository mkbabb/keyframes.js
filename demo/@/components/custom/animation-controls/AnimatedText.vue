<template>
    <template v-for="(char, index) in currentText" :key="index">
        <span
            class="lift-down"
            v-bind="$attrs"
            v-if="char !== '\n'"
            :style="{
                animationDelay: `${index * offset}s`,
                animationDuration: duration,
            }"
            >{{ char }}</span
        >
        <template v-else>
            <br class="w-screen" />
        </template>
    </template>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useWindowSize } from "@vueuse/core";

const HTML_SPACE = "\u00a0";
const { width } = useWindowSize();

let { text, offset } = $defineProps({
    text: {
        type: String,
        required: true,
    },
    offset: {
        type: Number,
        default: 0.2,
    },
});

let newText = $ref(text.replace(/ /g, HTML_SPACE));

let brokenText = $ref(newText.replace(/\s/g, HTML_SPACE + "\n"));

let currentText = $ref(brokenText);

const duration = $computed(() => `${currentText.length * offset + offset * 10}s`);

watch(
    () => width.value,
    (val) => {
        if (val < 768) {
            currentText = brokenText;
        } else {
            currentText = newText;
        }
    },
    { immediate: true },
);
</script>

<style lang="scss" scoped>
.lift-down {
    display: inline-block;
    animation: liftDown 3s ease-in-out infinite;
    animation-fill-mode: forwards;
}

@keyframes liftDown {
    0% {
        transform: translateY(0);
    }
    5% {
        transform: translateY(-10px);
    }
    10% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(0);
    }
    200% {
        transform: translateY(0);
    }
}

.dot-fade {
    display: inline-block;
    animation: dotFade v-bind("duration") ease-in-out infinite;
    animation-fill-mode: forwards;
}

@keyframes dotFade {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}
</style>
