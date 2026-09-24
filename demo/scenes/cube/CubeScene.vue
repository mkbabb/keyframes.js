<template>
    <!-- On the HOME landing (hideLoader === the start screen is up) below lg
         the cube is centred in the STAGE (X.KF.W13V.s, OA-39): the
         `cube-stage--hero-recede` rule centres it between the top dock band
         and the transport band and steps it down one sizing rung; the
         headline and deck stack above and below it (EditorStartScreen reads
         the same layout.css tokens), so text and cube never share pixels.
         Desktop and the cube scene proper are byte-identical. -->
    <div
        class="grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        :class="{ 'cube-stage--hero-recede': props.hideLoader }"
        style="touch-action: none; overscroll-behavior: contain"
        @wheel.prevent
    >
        <CubeTarget
            ref="cubeTargetRef"
            :is-playing="isPlaying"
            :pp-mode="storedControls.ppMode ?? false"
            :show-loader="!props.hideLoader && !storedControls.selectedAnimation"
            v-model:transform="transformSliderValues"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";

const props = defineProps<{
    hideLoader?: boolean;
}>();

import { Button } from "@mkbabb/glass-ui";
// No reka `<Tabs>` import here, and none is owed (CubeScene D-20, KF.W6 — the
// former header argued this against a superseded glass-ui major and a strip
// component in a file that does not exist; the pin and the installed copy are
// 7.0.0 and the
// channel host renders no tab strip at all). The cube's `matrix-controls`
// surface is projected AS DATA by the DFA (`surfacesFor` in
// `state/controlSurfaces.ts`, surfaced through `machine.extraControlTabs()` to
// the dock's controls `<Select>`), and its body is a plain gated panel
// (`matrixControlsPanel` below) keyed on the active surface, mirroring the
// channel host's built-in panels. No scene-injected trigger or content node
// exists, so there is no root context for one to miss.
import { Lock, LockOpen, RotateCcw } from "@lucide/vue";

import MatrixEditor from "./matrix-editor/MatrixEditor.vue";
import CubeTarget from "./CubeTarget.vue";

import { getStoredAnimationGroupControlOptions, useSceneMachine } from "@state";
import { useSceneTransport } from "@composables/scene-runtime/useSceneTransport";
import { facilityFromGroup } from "@composables/scene-facility";
import { useTransformState } from "./matrix-editor/useTransformState";
import { useCubeDemo, SCENE_ID } from "./useCubeDemo";
import { CUBE_ANIMATION_NAMES } from "./cubeMotion";
import { useCubeTransform } from "./cubeTransformStore";

const superKey = SCENE_ID;

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

// KFA-1 (X.KF.W13V.k; kf-CubeScene L-2/C-5 + kf-CubeTarget #34/#42) — ONE
// PLAYING-STATE AUTHORITY. `isPlaying` had no writer and `isStarted` was written
// only from a transport click, so the autoplay PLAY left both false: the orbit
// container was never composed and every drag frame was re-routed into the
// Matrix channel. Both are now READ-ONLY projections of `machine.status` — the
// house projection Square/Easing/Spring/Sequence already ride
// (`useSceneTransport`) — so the autoplay PLAY, a transport click, a restore and
// a pause all land through the one authority. Neither is exposed: nothing
// outside this scene reads them, and an exposed value would invite the shell
// binding's `isStarted` write-back (a second writer).
const machine = useSceneMachine();
const { isPlaying } = useSceneTransport(machine);
const isStarted = computed(
    () => machine.status.value === "playing" || machine.status.value === "paused",
);

const cubeTargetRef = useTemplateRef<InstanceType<typeof CubeTarget>>("cubeTargetRef");
const poseElRef = ref<HTMLElement | undefined>();

const {
    matrix3dStart,
    matrix3dEnd,
    transformSliderValues,
    matrixCellMeta,
    updateMatrixCell,
    resetMatrix,
} = useTransformState(isStarted, poseElRef, useCubeTransform().value);

const { animationGroup, setTargets } = useCubeDemo(
    matrix3dStart,
    matrix3dEnd,
);

// J.W2 S2 (DS-1) — the former scene-side watch that wrote
// `storedControls.selectedControl = "controls"` when the Matrix animation
// deselected is DELETED (the one remaining rogue writer outside the DFA
// authority). The matrix-controls fallback is now a function OF the DFA:
// `selectedControlSurfaceFor(scene, pick, activeConditionals)` stops honoring
// the conditional surface the moment its condition lapses, and the ONE writer
// (the AnimationControls derivation-sync) re-projects `"controls"` — the same
// result, computed at the authority.

// --- Slot sub-components exposed via defineExpose ---

// The matrix-controls TRIGGER is not a scene-injected node at all. There is no
// in-panel strip and no `tabs-trigger` slot: the cube's conditional
// `matrix-controls` surface rides the DFA's `extraControlTabs` projection AS
// DATA (a conditional facet on the Matrix CHANNEL descriptor, T.B2 — the
// hand-maintained `CONDITIONAL_SURFACES` table the earlier note named is
// deleted; labelled "Matrix Controls" in `SCENE_SURFACE_TABS`), which the
// dock's controls `<Select>` renders. That projection is gated on the SAME condition the former
// `tabsTrigger` function guarded — `matrix-controls` is an active conditional
// iff the cube's Matrix animation is selected — so the entry still appears only
// while the Matrix animation is selected. The former `tabsTrigger` function (and
// its `defineExpose` entry) are DELETED.

// The matrix-controls BODY is a PLAIN gated panel, rendered ONLY while the
// active surface is "matrix-controls" (gated on `storedControls.selectedControl`
// — the SAME single-authority value `ribbonContent` keys on, written back by the
// ChannelControls derivation-sync and falling back to "controls" when the Matrix
// condition lapses), else nothing (null) — matching the parent's
// `selectedControlSurface === 'x'` gating. The active surface is read from the
// store CubeScene already holds (the `tabs-content` slot chain does not forward
// it — ControlsPaneWrapper/App re-expose only selectedAnimation; the store read
// is the in-scope mirror of ribbonContent's gate, both reading the same
// authority).
//
// This is the FOURTH orphan `[role=tabpanel]` site (CC-D-2/C-3 + N-4), and the
// only one a template grep cannot see. Its `role`/`data-state` pair is retained
// for the same stated reason as its three siblings in `ChannelControls.vue`: it
// is the seam `styles/tab-idiom.css`'s panel-enter rule and the pane probes key
// on, and retiring that rule is an open decision this wave does not own. The
// missing accessible NAME is the a11y spec input the row is banked as.
const tabsContent = () =>
    storedControls.selectedControl === "matrix-controls"
        ? h("div", { role: "tabpanel", "data-state": "active" }, [
            h(MatrixEditor, {
                matrix3dEnd: matrix3dEnd.value,
                matrixCellMeta: matrixCellMeta.value,
                superKey,
                onUpdateMatrixCell: updateMatrixCell,
            }),
        ])
        : null;

const ribbonContent = (slotProps: { selectedControl: string }) =>
    slotProps.selectedControl === "matrix-controls"
        ? [
            h(Button, {
                size: "sm",
                class: "h-8 gap-1.5 cursor-pointer text-small font-medium px-3 rounded-lg",
                onClick: () => resetMatrix(),
            }, { default: () => [h(RotateCcw, { class: "w-3.5 h-3.5" }), " Reset"] }),
            h(Button, {
                size: "sm",
                class: "h-8 gap-1.5 cursor-pointer text-small font-medium px-3 rounded-lg",
                onClick: () => { storedControls.matrixOptions!.fixed = !storedControls.matrixOptions!.fixed; },
            }, {
                default: () => [
                    !storedControls.matrixOptions?.fixed ? h(Lock, { class: "w-3.5 h-3.5" }) : h(LockOpen, { class: "w-3.5 h-3.5" }),
                    ` ${storedControls.matrixOptions?.fixed ? "Free" : "Fixed"}`,
                ],
            }),
        ]
        : null;

onMounted(() => {
    const target = cubeTargetRef.value;
    const cubeEl = target?.cubeEl;
    const bobEl = target?.bobEl;
    const poseEl = target?.poseEl;
    const graphEl = target?.graphEl;

    if (cubeEl && bobEl && poseEl && graphEl) {
        poseElRef.value = poseEl;
        setTargets({ cubeEl, bobEl, poseEl, graphEl });
    }
});

onBeforeUnmount(() => {
    animationGroup.value.stop();

    // Persist transform state so it carries over on next mount (home ↔ cube)
    const t = transformSliderValues.value;
    useCubeTransform().value = {
        rotate: { ...t.rotate },
        translate: { ...t.translate },
        scale: { ...t.scale },
        matrix: t.matrix,
    };
});

const facility = facilityFromGroup(() => animationGroup.value, {
    channelFacets: {
        [CUBE_ANIMATION_NAMES.Matrix]: [
            {
                surface: "matrix-controls",
                label: "Matrix Controls",
                icon: "Grid3X3",
            },
        ],
    },
});

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: cube's REAL group members are the
    // painting channels; the legacy `animationGroup` stays for the shell binding's
    // panel group. The facility's playback is the standard group adapter.
    // T.B2 — the Matrix channel carries `matrix-controls` as a CONDITIONAL facet:
    // the derived surface set gains it only while the Matrix channel is selected
    // (selection-gating IS "which channel is selected"; the old
    // CONDITIONAL_SURFACES + activeControlConditionals threading DIED).
    facility,
    superKey,
    // KF.W13U.w (OA-27, KF-W13.md addendum 2026-09-23 `.w`: "the cube … must
    // animate on load and on play") — the cube is the demo's hero subject and
    // plays on EVERY entry to its scene; the shell binding dispatches PLAY on
    // SCENE_READY for an `autoPlays` scene (home is excluded there — the
    // landing stays still until its own Play gesture).
    autoPlays: true,
    tabsContent,
    ribbonContent,
});
</script>

<style scoped>
/* X.KF.W13V.s (OA-39) — the landing's phone column (mobile only). The scene
   host spans the stage cell's symmetric padding box; the stage the owner sees
   ends at the TRANSPORT band, which sits higher than the top band's mirror, so
   the host's lower edge is lifted by exactly that difference and the cube
   centres in the stage region itself. The receded cube steps down one sizing
   rung (--home-cube-side, shared with the start screen's text rows). Desktop
   (≥lg) is untouched. */
@media (max-width: 1023px) {
    .cube-stage--hero-recede {
        padding-block-end: calc(
            var(--stage-bottom-inset) - var(--stage-top-inset)
        );
    }
    .cube-stage--hero-recede :deep(.cube) {
        --side-size: var(--home-cube-side);
    }
}
</style>
