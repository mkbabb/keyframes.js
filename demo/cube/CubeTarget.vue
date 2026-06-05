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
                    >
                        <span
                            class="contents"
                            v-if="showLoader"
                        >
                            <Loader2
                                class="absolute h-[var(--target-viewport-h)] w-[30vw] animate-spin"
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
                                :style="{
                                    animationDelay: `${Math.random() * 10}s`,
                                    animationDuration: `${Math.random() * 10}s`,
                                }"
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
import { useTemplateRef } from "vue";
import { Loader2 } from "@lucide/vue";
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
</script>

<style scoped>
.graph {
    perspective: 1200px;
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
    will-change: transform;
    contain: style;
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
    will-change: transform;

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

