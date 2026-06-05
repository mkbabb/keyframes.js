<template>
    <template v-for="(char, index) in currentText" :key="`${index}-${char}`">
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
import { ref, computed, watch } from "vue";
import { useWindowSize } from "@vueuse/core";

const HTML_SPACE = "\u00a0";
const { width } = useWindowSize();

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    offset: {
        type: Number,
        default: 0.2,
    },
});

const newText = ref(props.text.replace(/ /g, HTML_SPACE));

const brokenText = ref(newText.value.replace(/\s/g, HTML_SPACE + "\n"));

const currentText = ref(brokenText.value);

const duration = computed(() => `${currentText.value.length * props.offset + props.offset * 10}s`);

watch(
    () => width.value,
    (val) => {
        if (val < 768) {
            currentText.value = brokenText.value;
        } else {
            currentText.value = newText.value;
        }
    },
    { immediate: true },
);
</script>

<style scoped>
.lift-down {
    display: inline-block;
    animation: liftDown 3s var(--ease-standard) infinite;
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
}

.dot-fade {
    display: inline-block;
    animation: dotFade v-bind("duration") var(--ease-standard) infinite;
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

/* PRM guard: the hero is the LCP node and runs perpetual infinite decorative
   motion. Under prefers-reduced-motion the characters settle to their resting
   frame (no lift, fully opaque) — the engine's withReducedMotion authority
   mirrored at the CSS layer for this template-only hero. */
@media (prefers-reduced-motion: reduce) {
    .lift-down,
    .dot-fade {
        animation: none;
    }
    .dot-fade {
        opacity: 1;
    }
}
</style>
