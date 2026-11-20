<template>
    <!-- The cube slice: the demo's own CubeTarget with its orbital drag, in the
         chosen skin, on the demo's own graph paper, under the demo's own
         transport. The die holds still at its opening attitude until Play.
         The stage owns every gesture over it (one finger orbits; two pan,
         pinch and twist; a two-finger scroll orbits, Shift-scroll pans,
         a pinch or Ctrl-wheel zooms, Safari's twist rolls; a drag around the
         die off it rolls it), so no gesture over it scrolls the host. The
         stage is the orbit's bound: no more than a quarter of the die leaves
         it, and a die thrown past springs back. The paper and its axes are one
         sheet that rides the orbit's pan and zoom (one transform a frame), so
         panning reads as moving across paper. The die keeps its face
         numerals, as in the app; the axis-lock lines stay the app's. Under
         `transport=host` the host carries Play / Pause and Reset in its own
         dock (the bridge's set-playing / reset), so no transport is drawn
         here; Space still toggles. -->
    <div class="embed-cube">
        <div
            class="embed-cube-stage"
            :class="{ 'embed-cube-stage--fill': fill }"
            data-orbit-stage
            :data-skin="skin"
        >
            <div class="embed-cube-ground" aria-hidden="true">
                <div ref="sheetEl" class="embed-cube-sheet">
                    <div class="embed-cube-paper grid-background"></div>
                    <div class="embed-cube-axis stage-field-x"></div>
                    <div class="embed-cube-axis stage-field-y"></div>
                </div>
            </div>
            <CubeTarget
                ref="cubeTargetRef"
                :is-playing="playing"
                :skin="skin"
                scroll-owner="stage"
                bare
                v-model:transform="transformSliderValues"
                @orbit-frame="moveSheet"
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
import { PLAY_FILL } from "../../components/instrument/transport/playFill";
import type { GesturePhase, TransportLook } from "./bridge";
import { isSpaceActivationTarget } from "../../components/instrument/transport/composables/useControlsKeyboardShortcuts";

const props = defineProps<{ skin: CubeSkin; hostTransport?: boolean; fill?: boolean }>();
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

/** Reset: rewind every channel to its first frame and hold there, and return
 *  the orbit (attitude, pan, zoom) to the opening one on the settle spring, so
 *  the die eases back to where it loaded. */
const reset = () => {
    animationGroup.value.stop();
    started.value = false;
    cubeTargetRef.value?.homeOrbit();
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

// The sheet's centre is the die's projected centre: the stage's centre plus
// the orbit's screen pan, magnified by the orbit's zoom. One transform a
// frame on one layer (no custom property on the stage, which restyled the
// whole subtree and repainted the paper every frame).
const sheetEl = useTemplateRef<HTMLElement>("sheetEl");
const moveSheet = ({ t, s }: { t: { x: number; y: number }; s: number }) => {
    const el = sheetEl.value;
    if (el) el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${s})`;
};

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

/** A gesture* the host relays (its own, over the frame), in this frame's px. */
const relayGesture = (phase: GesturePhase, scale: number, rotation: number, x: number, y: number) =>
    cubeTargetRef.value?.relayGesture(phase, scale, rotation, { x, y });

/** The Play seat's look in this scheme, read from a hidden seat carrying its
 *  fill (TransportDock's own classes), for a host that draws the transport. */
const transportLook = (): TransportLook => {
    const seat = document.createElement("span");
    seat.setAttribute("aria-hidden", "true");
    seat.style.cssText = "position:absolute;inline-size:1px;block-size:1px;visibility:hidden;pointer-events:none";
    document.body.append(seat);
    const read = (fill: string) => {
        seat.className = `${PLAY_FILL.ink} ${fill}`;
        const cs = getComputedStyle(seat);
        return { bg: cs.backgroundImage, ink: cs.color };
    };
    const rest = read(PLAY_FILL.rest);
    const playing = read(PLAY_FILL.playing);
    seat.remove();
    return { rest: rest.bg, playing: playing.bg, ink: rest.ink };
};

defineExpose({ setPlaying, reset, relayGesture, transportLook });
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

/* stage=fill: the frame's own box, whatever the host makes it. */
.embed-cube-stage--fill {
    aspect-ratio: auto;
    block-size: 100vh;
    block-size: 100dvh;
}

/* Her inks rule the paper under her skin: jamun on light, gulabi on dark
   (CubeTarget.css's Daraksha register). */
.embed-cube-stage[data-skin="daraksha"] {
    --graph-ink: light-dark(oklch(39% 0.1 356), oklch(90% 0.055 18));
}

/* The ground: the stage's own box, fading into the host's at the rim. It
   stays put; the sheet inside it moves. */
.embed-cube-ground {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    mask-image: var(--paper-fade);
}

/* THE SHEET: the paper and the coordinate frame on one layer, three stages
   wide and tall about the stage's centre (so a pan or a zoom-out never shows
   its edge inside the fade), moved by the orbit's one transform per frame
   (moveSheet). */
.embed-cube-sheet {
    position: absolute;
    inset: -100%;
    display: grid;
    place-items: center;
    transform-origin: 50% 50%;
}

/* The shared graph paper (design-idioms.css), its lines struck through the
   sheet's centre (150cqi: the sheet is three stages wide, the stage a size
   container), which is the die's projected centre. */
.embed-cube-paper {
    position: absolute;
    inset: 0;
    background-position: 150cqi 150cqb, 150cqi 150cqb, 150cqi 150cqb, 150cqi 150cqb;
}

/* The coordinate frame (design-idioms.css `.stage-field-{x,y}`): quarter rules
   whose middle pair are the axes through the die. */
.embed-cube-axis {
    grid-area: 1 / 1;
    inline-size: 76cqmin;
    block-size: 76cqmin;
    /* The field's opening and closing rules meet in corners; the panel radius
       rounds them, so no square corner shows in a rounded card (Daraksha's
       rounding census, R7). */
    border-radius: var(--radius-panel, 12px);
}

/* The die takes the card (owner 2026-11-16): its side is half the stage's
   short side. That is as large as it can be with every face inside the stage
   in every attitude at rest: its corner-on silhouette is ~1.73 × the side, and
   at /2 the faces' union keeps 22-38 px clear of the frame's edge at 390 and
   1440, on the embed and on Motion, with room for the garland's ±2.5° sway
   (~0.04 × side). φ (/1.618) was asked for and measured: a corner-on face
   then leaves the stage by 15-76 px. (Was /φ², 2.618.) */
.embed-cube-stage :deep(.cube) {
    --side-size: calc(min(100cqi, 100cqb) / 2);
}
</style>
