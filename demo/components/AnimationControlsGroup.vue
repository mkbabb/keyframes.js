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
                        animationGroup.paused || !animationGroup.started
                            ? ['fas', 'play']
                            : ['fas', 'pause']
                    "
                />
            </button>
        </div>

        <template v-for="(animation, name) in animations">
            <AnimationControls
                v-show="selectedAnimation == name"
                @slider-update="sliderUpdate"
                :animation="animation"
                :is-grouped="true"
                :class="[
                    !animationGroup.started || animationGroup.paused ? 'disabled' : '',
                ]"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watchEffect } from "vue";
import { Animation, AnimationGroup, Vars } from "../../src/animation";
import AnimationControls from "./AnimationControls.vue";

const { animations } = defineProps<{
    animations: { [key: string]: Animation<any> };
}>();

const selectedAnimation = ref("");
const emit = defineEmits<{
    (e: "selectedAnimation", val: string): void;
}>();

const animationGroup = $ref(new AnimationGroup(...Object.values(animations)));
selectedAnimation.value = Object.keys(animations)[0];

const sliderUpdate = (e: { t: number; animationId: number }) => {
    const { t, animationId } = e;
    const groupObject = animationGroup.animationGroup.find(
        (a) => a.animation.id == animationId
    );
    const { animation } = groupObject;

    const paused = animation.paused;
    const prevT = animation.t;

    animation.paused = false;
    animation.t = t;

    animationGroup.transformFrames(t);

    animation.paused = paused;
    animation.t = prevT;
};

const toggle = () => {
    if (!animationGroup.started) {
        animationGroup.play();
    } else {
        animationGroup.pause();
    }
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.animation-controls-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 1;
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
