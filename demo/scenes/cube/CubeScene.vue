<template>
    <!-- J.W7a S1 (D6 / H3) — on the HOME landing (hideLoader === the start
         screen is up) the cube is the hero's BACKDROP subject: below lg it
         RECEDES into the band beneath the hero (the `cube-stage--hero-recede`
         padding pushes its centering region below --start-hero-band), so the
         mega text and the cube never fight for the same pixels
         (`home-mobile.png`, the H3/TYP-1 collision). Desktop and the cube
         scene proper are byte-identical. -->
    <div
        class="grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        :class="{ 'cube-stage--hero-recede': props.hideLoader }"
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
import { h, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

const props = defineProps<{
    hideLoader?: boolean;
}>();

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
} from "@mkbabb/glass-ui";
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

import { getStoredAnimationGroupControlOptions } from "@state";
import { facilityFromGroup } from "@composables/scene-facility";
import { useTransformState } from "./matrix-editor/useTransformState";
import { useCubeDemo, SCENE_ID, CUBE_ANIMATION_NAMES } from "./useCubeDemo";
import { useCubeTransform } from "./cubeTransformStore";

const superKey = SCENE_ID;

const storedControls = getStoredAnimationGroupControlOptions(superKey);
storedControls.ppMode ??= false;

// kf-CubeScene L-2/C-5 (+ kf-CubeTarget #34/#42) — `isStarted` is written by the
// shell binding (`useSceneMachineShellBinding` assigns it on the exposed scene);
// `isPlaying` HAS NO WRITER ANYWHERE. It is exposed, passed down to CubeTarget
// and keyed on by `.idle-hover.playing .cube { will-change }`, so the component's
// own celebrated TRANSIENT promotion never fires and only the resident ancestor
// hint ever does. The cure is ONE playing-state authority shared with
// kf-SquareScene L-8/C-2, and its writer lives in `demo/app/scene/` — outside
// this wave's §Bounds and inside KF.W13's. DECLARED here, not shimmed: a
// scene-side derivation off the raw (non-reactive) group would be a second
// authority, which is the defect this row exists to retire.
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
} = useTransformState(isStarted, cubeElRef, useCubeTransform().value);

const { animationGroup, setTargets } = useCubeDemo(
    matrix3dStart,
    matrix3dEnd,
);

const setPPMode = () => {
    storedControls.ppMode = !storedControls.ppMode;
};

// J.W2 S2 (DS-1) — the former scene-side watch that wrote
// `storedControls.selectedControl = "controls"` when the Matrix animation
// deselected is DELETED (the one remaining rogue writer outside the DFA
// authority). The matrix-controls fallback is now a function OF the DFA:
// `selectedControlSurfaceFor(scene, pick, activeConditionals)` stops honoring
// the conditional surface the moment its condition lapses, and the ONE writer
// (the AnimationControls derivation-sync) re-projects `"controls"` — the same
// result, computed at the authority.

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
    h(Popover, { trigger: "hover", openDelay: 200, closeDelay: 150, open: ppmycotaOpen.value, "onUpdate:open": (v: boolean | undefined) => { ppmycotaOpen.value = v!; } }, {
        default: () => [
            h(PopoverTrigger, null, {
                default: () => h("div", {
                    onClick: setPPMode,
                    class: "ppmycota-logo-sm m-0 h-8 w-8 lg:h-10 lg:w-10 cursor-pointer stroke-2 p-0 font-bold scale-on-hover",
                }),
            }),
            h(PopoverContent, { class: "z-hovercard p-4 min-w-[var(--dock-panel-width)] text-small", role: "card" }, {
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
    isPlaying,
    isStarted,
    headerLeft,
    tabsContent,
    ribbonContent,
});
</script>

<style scoped>
/* J.W7a S1 (D6 / H3) — the hero-backdrop recede band (mobile only). The hero
   parks in the top band (EditorStartScreen `pt-[var(--dock-top-band-reserve)]`);
   the cube's centering region starts BELOW the --start-hero-band split
   (layout.css — the golden top share of the work-area height, derived from the
   same chain the docks ride), so hero text and subject occupy DISJOINT vertical
   bands at phone widths; the rendered 390×844 clearance is KF.W9's witness.
   Desktop (≥lg) is untouched: text and cube share the wide stage as before. */
@media (max-width: 1023px) {
    .cube-stage--hero-recede {
        padding-block-start: var(--start-hero-band);
        /* The subject's band ends at the MENUBAR top, not the raw dock-band
           depth: the bottom TransportDock floats --work-area-bottom-offset
           above the viewport edge (= --dock-menubar-reserve − the band depth
           the stage cell already reserves), so without this term the receded
           cube's lower face slid under the transport pill. Same tokens, no
           magic numbers. */
        padding-block-end: calc(
            var(--dock-menubar-reserve) - var(--dock-band-reserve)
        );
    }
    /* The receded backdrop subject steps down one sizing rung (50→40 of the
       short axis) so it FITS the band the hero leaves it on phone heights —
       part of the same D6 separation (H3: "push the hero to the top quarter
       and reserve the cube below"); the cube scene proper keeps its 50/18rem
       protagonist size. */
    .cube-stage--hero-recede :deep(.cube) {
        --side-size: min(40vh, 40vw, 16rem);
    }
}
</style>
