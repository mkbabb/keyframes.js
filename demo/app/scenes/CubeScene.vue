<template>
    <div
        class="grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        style="touch-action: none; overscroll-behavior: contain"
        @wheel.prevent
    >
        <CubeTarget
            ref="cubeTargetRef"
            :is-playing="isPlaying"
            :is-started="isStarted"
            :pp-mode="storedControls.ppMode ?? false"
            :show-loader="!props.hideLoader && !storedControls.selectedAnimation"
            v-model:transform="transformSliderValues"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

const props = defineProps<{
    hideLoader?: boolean;
}>();

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    TabsContent,
    TabsTrigger,
    Button,
} from "@mkbabb/glass-ui";
import { Lock, LockOpen, RotateCcw } from "@lucide/vue";

import { MatrixEditor } from "@components/custom/matrix-editor";
import { EditorStartScreen } from "@components/custom/editor-shell";
import CubeTarget from "../../cube/CubeTarget.vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
import { useTransformState } from "@components/custom/matrix-editor/useTransformState";
import { useCubeAnimations, SUPER_KEY, CUBE_ANIMATION_NAMES } from "../../cube/useCubeAnimations";
import { sharedCubeTransform } from "../cubeTransformStore";

const superKey = SUPER_KEY;

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

const isPlaying = ref(false);
const isStarted = ref(false);

const cubeTargetRef = useTemplateRef<InstanceType<typeof CubeTarget>>("cubeTargetRef");
const cubeElRef = ref<HTMLElement | undefined>();

const {
    matrix3dStart,
    matrix3dEnd,
    transformSliderValues,
    matrixCellMeta,
    updateMatrixCell,
    resetMatrix,
} = useTransformState(isPlaying, isStarted, cubeElRef, sharedCubeTransform.value);

const { animationGroup, setTargets } = useCubeAnimations(
    matrix3dStart,
    matrix3dEnd,
);

const setPPMode = () => {
    storedControls.ppMode = !storedControls.ppMode;
};

watch(
    () => storedControls.selectedAnimation,
    (selectedAnimation) => {
        if (
            selectedAnimation !== CUBE_ANIMATION_NAMES.Matrix &&
            storedControls.selectedControl === "matrix-controls"
        ) {
            storedControls.selectedControl = "controls";
        }
    },
);

// Ppmycota hover card state
const ppmycotaOpen = ref(false);
let autoDismissTimer: ReturnType<typeof setTimeout> | undefined;

function clearAutoDismiss() {
    if (autoDismissTimer != null) {
        clearTimeout(autoDismissTimer);
        autoDismissTimer = undefined;
    }
}

watch(ppmycotaOpen, (open) => {
    clearAutoDismiss();
    if (open) {
        autoDismissTimer = setTimeout(() => { ppmycotaOpen.value = false; }, 4000);
    }
});

// --- Slot sub-components exposed via defineExpose ---

const headerLeft = () =>
    h(HoverCard, { openDelay: 200, closeDelay: 150, open: ppmycotaOpen.value, "onUpdate:open": (v: boolean) => { ppmycotaOpen.value = v; } }, {
        default: () => [
            h(HoverCardTrigger, null, {
                default: () => h("div", {
                    onClick: setPPMode,
                    class: "ppmycota-logo-sm m-0 h-8 w-8 lg:h-10 lg:w-10 cursor-pointer stroke-2 p-0 font-bold scale-on-hover",
                }),
            }),
            h(HoverCardContent, { class: "z-hovercard p-4 min-w-[var(--dock-panel-width)] text-small" }, {
                default: () => [
                    h("div", { class: "flex items-center gap-3" }, [
                        // z-20: LOCAL stacking — lifts the logo glyph above its
                        // row siblings inside the hovercard (which itself sits at
                        // z-hovercard); not an editor z-contract participant.
                        h("div", { class: "ppmycota-logo-sm z-20 h-10 w-10 shrink-0 stroke-2 font-bold" }),
                        h("div", { class: "flex-1 min-w-0" }, [
                            h("a", { href: "https://ppmycota.com", target: "_blank", rel: "noopener noreferrer", class: "text-small font-semibold text-foreground hover:underline" }, "ppmycota"),
                            h("p", { class: "mt-0.5 text-caption text-muted-foreground", innerHTML: "&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;" }),
                        ]),
                    ]),
                    h("hr", { class: "my-2 border-border/50" }),
                    h("a", { href: "https://ppmycota.com", target: "_blank", rel: "noopener noreferrer", class: "block text-small text-foreground hover:underline" }, "ppmycota.com"),
                ],
            }),
        ],
    });

const startScreen = () =>
    h(EditorStartScreen, {
        hint: "or drag M. cubert \u{1F642}\u200D\u2194\uFE0F",
    });

const tabsTrigger = (slotProps: { selectedAnimation: string }) =>
    slotProps.selectedAnimation === CUBE_ANIMATION_NAMES.Matrix
        ? h(TabsTrigger, {
            value: "matrix-controls",
            class: "tab-trigger-base tab-trigger-underline",
        }, { default: () => "Matrix Controls" })
        : null;

const tabsContent = () =>
    h(TabsContent, { value: "matrix-controls" }, {
        default: () => h(MatrixEditor, {
            matrix3dEnd: matrix3dEnd.value,
            matrixCellMeta: matrixCellMeta.value,
            superKey,
            onUpdateMatrixCell: updateMatrixCell,
            onResetMatrix: resetMatrix,
        }),
    });

const ribbonContent = (slotProps: { selectedControl: string }) =>
    slotProps.selectedControl === "matrix-controls"
        ? [
            h(Button, {
                size: "sm", variant: "outline",
                class: "h-8 gap-1.5 cursor-pointer text-mono-caption px-3 rounded-lg btn-interactive",
                onClick: () => resetMatrix(),
            }, { default: () => [h(RotateCcw, { class: "w-3.5 h-3.5" }), " Reset"] }),
            h(Button, {
                size: "sm", variant: "outline",
                class: "h-8 gap-1.5 cursor-pointer text-mono-caption px-3 rounded-lg btn-interactive",
                onClick: () => { storedControls.matrixOptions.fixed = !storedControls.matrixOptions.fixed; },
            }, {
                default: () => [
                    !storedControls.matrixOptions?.fixed ? h(Lock, { class: "w-3.5 h-3.5" }) : h(LockOpen, { class: "w-3.5 h-3.5" }),
                    ` ${storedControls.matrixOptions?.fixed ? "Free" : "Fixed"}`,
                ],
            }),
        ]
        : null;

onMounted(() => {
    const cubeEl = cubeTargetRef.value?.cubeEl;
    const graphEl = cubeTargetRef.value?.graphEl;

    if (cubeEl && graphEl) {
        cubeElRef.value = cubeEl;
        setTargets(cubeEl, graphEl);
    }
});

onBeforeUnmount(() => {
    clearAutoDismiss();
    animationGroup.value.stop();

    // Persist transform state so it carries over on next mount (home ↔ cube)
    const t = transformSliderValues.value;
    sharedCubeTransform.value = {
        rotate: { ...t.rotate },
        translate: { ...t.translate },
        scale: { ...t.scale },
        matrix: t.matrix,
    };
});

const extraControlTabs = computed(() =>
    storedControls.selectedAnimation === CUBE_ANIMATION_NAMES.Matrix
        ? [{ value: "matrix-controls", label: "Matrix Controls", icon: "Grid3X3" }]
        : [],
);

defineExpose({
    animationGroup: computed(() => animationGroup.value),
    superKey,
    isPlaying,
    isStarted,
    headerLeft,
    startScreen,
    tabsTrigger,
    tabsContent,
    ribbonContent,
    extraControlTabs,
});
</script>
