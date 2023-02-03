<template>
    <div class="animation-controls-group">
        <div class="animation-select">
            <label><div class="rainbow-text">Animation Select</div></label>
            <select
                class="animation-select"
                @change="emit('selectedAnimation', selectedAnimation)"
                v-model="selectedAnimation"
            >
                <option v-for="(value, key) in animations" :value="key">
                    {{ key }}
                </option>
            </select>
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

onMounted(() => {
    animationGroup = new AnimationGroup(...Object.values(animations));
    selectedAnimation.value = Object.keys(animations)[0];
    animationGroup.play();
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
    padding: 0.25rem;
    border-radius: 5px;
    background-color: white;
    

    * {
        box-shadow: none;
    }
}
</style>
