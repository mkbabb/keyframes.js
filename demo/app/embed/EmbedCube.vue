<template>
    <!-- The cube slice: the demo's own CubeTarget with its orbital drag, in the
         chosen skin, on the demo's own graph paper, under the demo's own
         transport. The die holds still at its opening attitude until Play.
         The stage owns every gesture over it (one finger orbits; two pan,
         pinch and twist; the wheel is the orbit's, OA-17), so a pan never
         scrolls the host. The paper and its axes ride the orbit's pan and zoom,
         so panning reads as moving across paper. The die keeps its face
         numerals, as in the app; the axis-lock lines stay the app's. Under
         `transport=host` the host carries Play / Pause and Reset in its own
         dock (the bridge's set-playing / reset), so no transport is drawn
         here; Space still toggles. -->
    <div class="embed-cube">
        <div class="embed-cube-stage" :data-skin="skin" :style="paperVars">
            <div class="embed-cube-paper grid-background" aria-hidden="true"></div>
            <div class="embed-cube-axes" aria-hidden="true">
                <div class="embed-cube-axis stage-field-x"></div>
                <div class="embed-cube-axis stage-field-y"></div>
            </div>
            <CubeTarget
                ref="cubeTargetRef"
                :is-playing="playing"
                :skin="skin"
                scroll-owner="stage"
                bare
                v-model:transform="transformSliderValues"
            />
        </div>
        <TransportDock
            v-if="!hostTransport"
            contained
            :stored-controls="storedControls"
            :is-playing="playing"
            :animation-names="[]"
            @toggle-play="togglePlay"
            @reset="reset"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import type { CubeSkin } from "@state";
import { getStoredAnimationGroupControlOptions } from "@state";
import CubeTarget from "../../scenes/cube/CubeTarget.vue";
import { CUBE_SCENE_ID } from "../../scenes/cube/cubeKeys";
import { useCubeDemo } from "../../scenes/cube/useCubeDemo";
import { useTransformState } from "../../scenes/cube/matrix-editor/useTransformState";
import TransportDock from "../../components/instrument/transport/TransportDock.vue";
import { isSpaceActivationTarget } from "../../components/instrument/transport/composables/useControlsKeyboardShortcuts";

const props = defineProps<{ skin: CubeSkin; hostTransport?: boolean }>();
const skin = computed(() => props.skin);

const emit = defineEmits<{ (e: "transport", playing: boolean): void }>();

// Paused on load: the die rests at its opening attitude (no settle sweep, no
// spin) until Play. `started` is the group's own (true from the first Play
// until a Reset), so the Matrix channel's pre-start painter and the running
// group never both write the pose (KFA-2).
const playing = ref(false);
const started = ref(false);

const cubeTargetRef = useTemplateRef<InstanceType<typeof CubeTarget>>("cubeTargetRef");
const poseElRef = ref<HTMLElement | undefined>();
const { matrix3dStart, matrix3dEnd, transformSliderValues } = useTransformState(started, poseElRef);
const { animationGroup, setTargets } = useCubeDemo(matrix3dStart, matrix3dEnd, skin, {
    settle: false,
});
const storedControls = getStoredAnimationGroupControlOptions(CUBE_SCENE_ID);

const setPlaying = (next: boolean) => {
    const group = animationGroup.value;
    if (next === playing.value) return;
    if (next) {
        started.value = true;
        if (group.started) group.resume();
        else void group.play();
    } else {
        group.pause();
    }
    playing.value = next;
    emit("transport", next);
};

const togglePlay = () => setPlaying(!playing.value);

/** Reset: rewind every channel to its first frame and hold there. */
const reset = () => {
    animationGroup.value.stop();
    started.value = false;
    if (playing.value) {
        playing.value = false;
        emit("transport", false);
    }
};

// Space toggles, as in the app: a focused control keeps its own Space.
const releaseSpace = registerShortcut(
    "Space",
    (e) => {
        if (e.repeat || isSpaceActivationTarget(e.target)) return;
        e.preventDefault();
        togglePlay();
    },
    { label: "Play / Pause", group: "Playback" },
);

// The paper's origin is the die's projected centre: the stage's centre plus
// the orbit's screen pan, ruled at the orbit's zoom.
const paperVars = computed(() => {
    const { translate, scale } = transformSliderValues.value;
    return {
        "--paper-x": `${translate.x}px`,
        "--paper-y": `${translate.y}px`,
        "--paper-zoom": String(scale.x),
    };
});

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
});

onBeforeUnmount(() => {
    releaseSpace();
    animationGroup.value.stop();
});

defineExpose({ setPlaying, reset });
</script>

<style scoped>
.embed-cube {
    display: grid;
    inline-size: 100%;
}

.embed-cube-stage {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: 100%;
    aspect-ratio: 1;
    container-type: size;
    overscroll-behavior: contain;
    /* The paper fades into the host's ground at the stage's rim. */
    --paper-fade: radial-gradient(closest-side, #000 62%, transparent);
}

/* Her inks rule the paper under her skin: jamun on light, gulabi on dark
   (CubeTarget.css's Daraksha register). */
.embed-cube-stage[data-skin="daraksha"] {
    --graph-ink: light-dark(oklch(39% 0.1 356), oklch(90% 0.055 18));
}

.embed-cube-paper,
.embed-cube-axes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    mask-image: var(--paper-fade);
}

/* The shared graph paper (design-idioms.css), its tiles scaled by the zoom
   and its lines struck through the die's projected centre. */
.embed-cube-paper {
    --paper-origin: calc(50cqi + var(--paper-x)) calc(50cqb + var(--paper-y));
    background-size:
        calc(var(--graph-major) * var(--paper-zoom)) calc(var(--graph-major) * var(--paper-zoom)),
        calc(var(--graph-major) * var(--paper-zoom)) calc(var(--graph-major) * var(--paper-zoom)),
        calc(var(--graph-pitch) * var(--paper-zoom)) calc(var(--graph-pitch) * var(--paper-zoom)),
        calc(var(--graph-pitch) * var(--paper-zoom)) calc(var(--graph-pitch) * var(--paper-zoom));
    background-position: var(--paper-origin), var(--paper-origin), var(--paper-origin), var(--paper-origin);
}

/* The coordinate frame (design-idioms.css `.stage-field-{x,y}`): quarter rules
   whose middle pair are the axes through the die, carried with the pan and
   scaled with the zoom. */
.embed-cube-axes {
    display: grid;
    place-items: center;
}
.embed-cube-axis {
    grid-area: 1 / 1;
    inline-size: 76cqmin;
    block-size: 76cqmin;
    transform: translate(var(--paper-x), var(--paper-y)) scale(var(--paper-zoom));
}

/* The die's side is the stage's, over φ²: its corner-on projection (the √3
   diagonal under the stage perspective) and the garland's sway stay inside
   the square. */
.embed-cube-stage :deep(.cube) {
    --side-size: calc(min(100cqi, 100cqb) / 2.618);
}
</style>
