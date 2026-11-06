<template>
    <!-- The cube slice: the demo's own CubeTarget with its orbital drag, in the
         chosen skin, playing its scene's channels. The stage is square and
         sizes the die off its own box. The host page owns vertical scroll
         (a swipe scrolls it; a horizontal drag or a pinch is the die's), and
         the die stands alone: no numerals, no axis lines. -->
    <div class="embed-cube-stage">
        <CubeTarget
            ref="cubeTargetRef"
            :is-playing="playing"
            :skin="skin"
            scroll-owner="page"
            bare
            v-model:transform="transformSliderValues"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import type { CubeSkin } from "@state";
import CubeTarget from "../../scenes/cube/CubeTarget.vue";
import { useCubeDemo } from "../../scenes/cube/useCubeDemo";
import { useTransformState } from "../../scenes/cube/matrix-editor/useTransformState";

const props = defineProps<{ skin: CubeSkin }>();
const skin = computed(() => props.skin);

// Reduced motion: the die rests at its opening attitude and only the drag moves it.
const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
const playing = ref(false);

const cubeTargetRef = useTemplateRef<InstanceType<typeof CubeTarget>>("cubeTargetRef");
const poseElRef = ref<HTMLElement | undefined>();
const { matrix3dStart, matrix3dEnd, transformSliderValues } = useTransformState(playing, poseElRef);
const { animationGroup, setTargets } = useCubeDemo(matrix3dStart, matrix3dEnd, skin);

onMounted(() => {
    const target = cubeTargetRef.value;
    if (!target?.cubeEl || !target.bobEl || !target.poseEl || !target.graphEl) return;
    poseElRef.value = target.poseEl;
    setTargets({
        cubeEl: target.cubeEl,
        bobEl: target.bobEl,
        poseEl: target.poseEl,
        graphEl: target.graphEl,
    });
    if (reducedMotion) return;
    playing.value = true;
    void animationGroup.value.play();
});

onBeforeUnmount(() => animationGroup.value.stop());
</script>

<style scoped>
.embed-cube-stage {
    display: grid;
    place-items: center;
    inline-size: 100%;
    aspect-ratio: 1;
    container-type: size;
}
/* The die's side is the stage's, over φ²: its corner-on projection (the √3
   diagonal under the stage perspective) and the garland's sway stay inside
   the square. */
.embed-cube-stage :deep(.cube) {
    --side-size: calc(min(100cqi, 100cqb) / 2.618);
}
</style>
