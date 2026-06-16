<template>
    <div
        class="grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        style="touch-action: none; overscroll-behavior: contain"
        @wheel.prevent
    >
        <div
            ref="graphEl"
            class="graph preserve-3d grid items-center justify-center justify-items-center"
        >
            <OrbitalDrag
                class="preserve-3d relative flex items-center justify-center justify-items-center select-none"
                v-model="transform"
                :apply-transform-to-container="props.isPlaying || props.isStarted"
            >
                <div
                    :class="[
                        'idle-hover preserve-3d',
                        { playing: isPlaying },
                    ]"
                >
                    <div
                        ref="cubeEl"
                        class="cube preserve-3d animation relative flex items-center justify-center justify-items-center"
                        :class="{ 'cube--rolling': rolling }"
                        @dblclick="onRoll"
                    >
                        <span
                            class="contents"
                            v-if="showLoader"
                        >
                            <Loader2
                                class="absolute h-[var(--target-viewport-h)] w-[var(--target-viewport-w)] animate-spin"
                            ></Loader2>
                        </span>
                        <div
                            v-for="(side, index) in cubeSides"
                            :key="index"
                            :class="[
                                'cube-side',
                                side.class,
                                'rounded-lg',
                                'transition-[background-color,opacity] duration-panel ease-in-out',
                                // z-10: LOCAL stacking inside the 3D cube — each
                                // face sits above its own .rainbow-wrapper
                                // background span. NOT a participant in the
                                // editor z-contract (style.css), so it stays a
                                // bare local rung, not a semantic z-* layer.
                                'absolute z-10 flex items-center justify-center',
                            ]"
                        >
                            <span
                                :class="
                                    'rainbow-wrapper ' +
                                    (!isPlaying
                                        ? 'opacity-100'
                                        : 'opacity-25')
                                "
                                :style="rainbowTimings[index]"
                            >
                            </span>
                            <template v-if="!ppMode">
                                <div
                                    :class="[
                                        'h-full w-full font-bold',
                                        'flex items-center justify-center',
                                    ]"
                                    :style="{
                                        backgroundColor: side.color,
                                    }"
                                >
                                    <span
                                        :class="[
                                            'text-display-2 h-full w-full',
                                            'flex items-center justify-center',
                                        ]"
                                        >{{ side.content }}</span
                                    >
                                </div>
                            </template>

                            <template v-else>
                                <div
                                    class="ppmycota-cube absolute h-full w-full"
                                ></div>
                                <div
                                    class="ppmycota-logo-lg absolute h-full w-full"
                                ></div>
                            </template>
                        </div>
                    </div>
                </div>
            </OrbitalDrag>

            <div class="axis-line x"></div>
            <div class="axis-line y"></div>
            <div class="axis-line z"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onScopeDispose, ref, useTemplateRef } from "vue";
import { Loader2 } from "@lucide/vue";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import OrbitalDrag from "@components/custom/orbital-drag/OrbitalDrag.vue";
import type { TransformState } from "@components/custom/orbital-drag";

const props = defineProps<{
    isPlaying: boolean;
    isStarted: boolean;
    ppMode: boolean;
    showLoader: boolean;
}>();

const transform = defineModel<TransformState>("transform", { required: true });

const cubeEl = useTemplateRef<HTMLElement>("cubeEl");
const graphEl = useTemplateRef<HTMLElement>("graphEl");

defineExpose({ cubeEl, graphEl });

const cubeSides = [
    { class: "front", content: "1", color: "rgba(255, 0, 0, 0.8)" },
    { class: "right", content: "2", color: "rgba(0, 255, 0, 0.8)" },
    { class: "back", content: "3", color: "rgba(0, 0, 255, 0.8)" },
    { class: "left", content: "4", color: "rgba(255, 255, 0, 0.8)" },
    { class: "top", content: "5", color: "rgba(255, 0, 255, 0.8)" },
    { class: "bottom", content: "6", color: "rgba(0, 255, 255, 0.8)" },
];

// S5d (K.W0) — the per-face rainbow-wrapper animation timings were drawn with
// `Math.random()` INSIDE the inline :style binding, so every render re-rolled the
// delay/duration and the rainbow shimmer flickered on each reactive tick. The
// timings are a constant property of each face, not render state: draw them ONCE
// at setup (one entry per cube side) and bind the static array by index. No
// per-render randomness — the shimmer is now stable across reactivity.
const rainbowTimings = cubeSides.map(() => ({
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 10}s`,
}));

// ── EASTER EGG — "the Roll" (H.W12.S6) ───────────────────────────────────────
// Double-click M. Cubert → roll the die. The cube IS a six-faced die (1–6); the
// egg DOGFOODS the engine `CSSKeyframesAnimation` (inv ζ) to spin the `.cube`
// element itself a couple of full turns on TWO axes into a RANDOM face, on a
// bouncy `easeOutBack` so the die overshoots and settles. It targets the `.cube`
// (NOT the OrbitalDrag quaternion container), so the spin COMPOSES with whatever
// orbit the user set — the faces tumble within the current viewing frame. A
// transitionend-free, engine-owned tumble; the rolling flag suppresses re-rolls
// mid-spin and stands the pointer down for the ~1s arc.
const rolling = ref(false);
let rollAnim: CSSKeyframesAnimation | undefined;

// The six face-up orientations of the `.cube` (degrees). Spinning the cube to
// these shows faces 1–6 toward the viewer (the faces sit at ±translateZ off the
// cube center, so a whole-cube rotate re-presents them).
const ROLL_FACES: ReadonlyArray<{ x: number; y: number }> = [
    { x: 0, y: 0 },     // 1 — front
    { x: 0, y: -90 },   // 2 — right
    { x: 0, y: 180 },   // 3 — back
    { x: 0, y: 90 },    // 4 — left
    { x: -90, y: 0 },   // 5 — top
    { x: 90, y: 0 },    // 6 — bottom
];

const onRoll = () => {
    if (rolling.value || !cubeEl.value) return;
    rolling.value = true;

    const face = ROLL_FACES[Math.floor(Math.random() * ROLL_FACES.length)]!;
    // 1–2 extra whole turns per axis for the tumble drama, landing on the face.
    const endX = face.x + (1 + Math.floor(Math.random() * 2)) * 360;
    const endY = face.y + (1 + Math.floor(Math.random() * 2)) * 360;

    rollAnim?.stop();
    rollAnim = new CSSKeyframesAnimation({
        duration: 1100,
        iterationCount: 1,
        fillMode: "forwards",
        // The bounce-overshoot is the die settling onto its face.
        timingFunction: "ease-out-back",
    }).fromKeyframes(
        {
            from: { transform: { rotateX: "0deg", rotateY: "0deg" } },
            to: { transform: { rotateX: `${endX}deg`, rotateY: `${endY}deg` } },
        },
    );
    rollAnim.setTargets(cubeEl.value);
    rollAnim.play();
    // Release the gesture lock after the arc; the fillMode:forwards leaves the
    // die resting on its rolled face (the next drag/animation re-bases as usual).
    setTimeout(() => { rolling.value = false; }, 1200);
};

onScopeDispose(() => rollAnim?.stop());
</script>

<style scoped>
.graph {
    perspective: 1200px;
}

/* EASTER EGG — "the Roll" (H.W12.S6): while the die tumbles, the cube ignores
   pointer input so a stray drag mid-roll cannot fight the spring; the engine
   owns the rotation for the ~1s tumble, then hands control back. Isomorphic —
   no visual change, just the gesture hand-off. */
.cube--rolling {
    pointer-events: none;
}

/* CSS twin of the engine's reduced-motion gate: the always-on idle bob runs
   only when the user has not asked the OS to reduce motion. */
@media (prefers-reduced-motion: no-preference) {
    .idle-hover {
        animation: idle-bob 3s var(--ease-standard) infinite alternate;
    }
    .idle-hover.playing {
        animation: none;
    }
}
@keyframes idle-bob {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(5px);
    }
}

.cube {
    --side-size: min(25vh, 25vw, 15rem);
    --side-offset: calc(var(--side-size) / 2);
    --rotationX: 360deg;

    height: calc(var(--side-size) * 2);
    contain: style;
}

/* G5 (transient will-change): the cube is the element that actually transforms
   (the matrix/rotation animations + the OrbitalDrag container). Promote it to
   its own compositor layer ONLY while it is moving — playing or hovered — and
   drop the hint at rest, so an idle/off-screen cube holds no resident layer (a
   resident `will-change` keeps the layer alive forever, the G5 anti-pattern).
   The idle-bob is a 5px translate the compositor handles without the hint. */
.idle-hover.playing .cube,
.graph:hover .cube {
    will-change: transform;
}

@media (max-width: 1023px) {
    .cube {
        --side-size: min(50vh, 50vw, 18rem);
    }
}

.cube-side {
    width: var(--side-size);
    height: var(--side-size);
    backface-visibility: hidden;
    /* G5: the faces carry a STATIC per-face transform (they never re-transform —
       only the parent .cube/.idle-hover/OrbitalDrag container animates), so the
       former resident `will-change: transform` here pinned six permanent
       compositor layers for nothing. Dropped — the parent's transient hint
       promotes the whole 3D subtree while it moves. */

    &.front {
        transform: rotateY(0deg) translateZ(var(--side-offset));
    }
    &.back {
        transform: rotateY(180deg) translateZ(var(--side-offset));
    }
    &.top {
        transform: rotateX(90deg) translateZ(var(--side-offset));
    }
    &.bottom {
        transform: rotateX(-90deg) translateZ(var(--side-offset));
    }
    &.left {
        transform: rotateY(-90deg) translateZ(var(--side-offset));
    }
    &.right {
        transform: rotateY(90deg) translateZ(var(--side-offset));
    }
}

.axis-line {
    width: 1000vw;
    height: 0px;
    border: 1px dashed var(--color);
    opacity: 0.75;
    /* Below the content plane — the demo's named below-stack rung (W3.S2).
       Reconciles the former orphan raw below-plane value to the z-contract
       documented in style.css (--z-behind < --z-content). */
    z-index: var(--z-behind, -10);
    position: absolute;
    pointer-events: none;

    &.x {
        --color: var(--axis-x);
        transform: rotateX(0deg);
    }
    &.y {
        --color: var(--axis-y);
        transform: rotateZ(90deg);
    }
    &.z {
        --color: var(--axis-z);
        transform: rotateY(90deg);
    }
}
</style>

