<template>
    <div class="animation-controls-group">
        <div class="animation-select">
            <select
                class="animation-select"
                @change="emit('selectedAnimation', selectedAnimation)"
                v-model="selectedAnimation"
            >
                <option v-for="(value, key) in animations" :value="key">
                    {{ key }}
                </option>
            </select>
            <button v-if="selectedAnimation" class="toggle" @click="toggle">
                <font-awesome-icon
                    class="icon"
                    :icon="
                        !animationGroup.paused && animationGroup.started
                            ? ['fas', 'pause']
                            : ['fas', 'play']
                    "
                />
            </button>
        </div>

        <AnimationControls
            v-if="selectedAnimation"
            @slider-update="sliderUpdate"
            :animation="animations[selectedAnimation]"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watchEffect } from "vue";
import { Animation, AnimationGroup, Vars } from "../../src/animation";
import { ValueArray } from "../../src/units";
import AnimationControls from "./AnimationControls.vue";

const { animations } = defineProps<{
    animations: { [key: string]: Animation<any> };
}>();

const selectedAnimation = ref("");
const emit = defineEmits<{
    (e: "selectedAnimation", val: string): void;
}>();

let animationGroup: AnimationGroup<any>;

const sliderUpdate = (e: { values: Vars<ValueArray>; animationId: number }) => {
    const { values, animationId } = e;
    const groupObject = animationGroup.animationGroup.find(
        (a) => a.animation.id == animationId
    );
    groupObject.values = values;
};

let pausedString = computed(() => {
    return animationGroup.paused ? "Play" : "Pause";
});

const toggle = () => {
    if (!animationGroup.started) {
        animationGroup.play();
    } else {
        animationGroup.pause();
    }
};

onMounted(() => {
    animationGroup = new AnimationGroup(...Object.values(animations));
    selectedAnimation.value = Object.keys(animations)[0];
});
</script>

<style scoped lang="scss">
.animation-controls-group {
    display: flex;
    flex-direction: column;
    width: min-content;

    min-height: 1px;
    gap: 1rem;
}

.animation-select {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
}

button {
    background: linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 127, 0, 1) 12.5%,
        rgba(255, 255, 0, 1) 25%,
        rgba(0, 255, 0, 1) 37.5%,
        rgba(0, 0, 255, 1) 50%,
        rgba(75, 0, 130, 1) 62.5%,
        rgba(143, 0, 255, 1) 75%,
        rgba(255, 0, 0, 1) 87.5%,
        rgba(255, 0, 0, 1) 100%
    );
}
</style>
