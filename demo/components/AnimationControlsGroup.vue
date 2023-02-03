<template>
    <div class="animation-controls-group">
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

        <div class="animation-controls">
            <AnimationControls
                v-if="selectedAnimation"
                @slider-update="sliderUpdate"
                :animation="animations[selectedAnimation]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { string } from "parsimmon";
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
    display: grid;

    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(2, auto);

    gap: 1rem;

    border-radius: 5px;

    label {
        grid-column: 1 /2;
    }
    select {
        grid-column: 2 / 2;
    }
    .animation-controls {
        grid-column: 1 / -1;
        grid-row: 2;
    }
}
</style>
