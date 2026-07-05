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
import { computed, h, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

const props = defineProps<{
    hideLoader?: boolean;
}>();

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Button,
} from "@mkbabb/glass-ui";
// glass-ui 4.0.0 (K.W1′ BA.W-TABS) — the control tab STRIP migrated from the
// reka `<Tabs>` compound to `<SegmentedTabs variant="underline">` in
// AnimationControls.vue, which DROPPED the reka `<Tabs>` ROOT that provided
// `TabsRootContext`. The former scene-injected reka `<TabsTrigger>`/`<TabsContent>`
// (re-sourced from reka-ui here) are now ORPHANS — they throw "Injection
// Symbol(TabsRootContext) not found" at runtime. The cube's `matrix-controls`
// tab is now projected AS DATA by the DFA (`extraControlTabs` → the
// `SegmentedTabs :options` strip), and its body is a PLAIN `[role=tabpanel]`
// gated on the active surface (mirroring the parent's built-in panels). So the
// reka Tabs import is deleted entirely (no legacy beside the replacement).
import { Lock, LockOpen, RotateCcw } from "@lucide/vue";

import { MatrixEditor } from "./matrix-editor";
import CubeTarget from "./CubeTarget.vue";

import { getStoredAnimationGroupControlOptions } from "@state";
import { facilityFromGroup } from "@app/scene/sceneFacility";
import { useTransformState } from "./matrix-editor/useTransformState";
import { useCubeDemo, SUPER_KEY } from "./useCubeDemo";
import { useCubeTransform } from "./cubeTransformStore";

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
} = useTransformState(isPlaying, isStarted, cubeElRef, useCubeTransform().value);

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

// glass-ui 4.0.0 (K.W1′ BA.W-TABS) — the matrix-controls TRIGGER is no longer a
// scene-injected reka `<TabsTrigger>`. AnimationControls dropped the
// `tabs-trigger` slot; the cube's conditional `matrix-controls` tab now rides the
// `<SegmentedTabs>` strip AS DATA, projected by the DFA's `extraControlTabs`
// (`CONDITIONAL_SURFACES.cube = ["matrix-controls"]`, labelled "Matrix Controls"
// in `SCENE_SURFACE_TABS`). That projection is gated on the SAME condition the
// former `tabsTrigger` guarded — the App supplies `matrix-controls` as an active
// conditional iff the cube's Matrix animation is selected (App.vue's
// `activeControlConditionals`, gated on `selectedAnimation === CUBE_ANIMATION_NAMES.Matrix`)
// — so the tab still appears only while the Matrix animation is selected. The former
// `tabsTrigger` function (and its `defineExpose` entry) are therefore DELETED.

// The matrix-controls BODY is now a PLAIN gated tabpanel (NO reka `<TabsContent>`,
// which needs the removed `TabsRootContext`). It mirrors AnimationControls' own
// built-in panels: rendered ONLY while the active surface is "matrix-controls"
// (gated on `storedControls.selectedControl` — the SAME single-authority value
// `ribbonContent` keys on, written back by the AnimationControls derivation-sync
// and falling back to "controls" when the Matrix condition lapses), as a plain
// `[role=tabpanel][data-state=active]` div (the proof seam the pane probes key
// on), else nothing (null) — matching the parent's `selectedControlSurface === 'x'`
// gating. The active surface is read from the store CubeScene already holds (the
// `tabs-content` slot chain does not forward it — ControlsPaneWrapper/App re-expose
// only selectedAnimation; the store read is the in-scope mirror of ribbonContent's
// gate, both reading the same authority).
const tabsContent = () =>
    storedControls.selectedControl === "matrix-controls"
        ? h("div", { role: "tabpanel", "data-state": "active" }, [
            h(MatrixEditor, {
                matrix3dEnd: matrix3dEnd.value,
                matrixCellMeta: matrixCellMeta.value,
                superKey,
                onUpdateMatrixCell: updateMatrixCell,
                onResetMatrix: resetMatrix,
            }),
        ])
        : null;

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
    useCubeTransform().value = {
        rotate: { ...t.rotate },
        translate: { ...t.translate },
        scale: { ...t.scale },
        matrix: t.matrix,
    };
});

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: cube's REAL group members are the
    // painting channels; the legacy `animationGroup` stays for the shell binding's
    // panel group. The facility's playback is the standard group adapter.
    facility: computed(() => facilityFromGroup(() => animationGroup.value)),
    animationGroup: computed(() => animationGroup.value),
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
   (design-idioms.css), so hero text and subject occupy DISJOINT vertical bands
   at phone widths — the 390×844 hero/subject intersection is 0 by construction.
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
