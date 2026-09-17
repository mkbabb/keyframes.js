// ─────────────────────────────────────────────────────────────────────────────
// SceneExposedApi — the typed surface that every scene exposes via
// `defineExpose()`. Replaces the `shallowRef<any>(null)` duck-typing chain
// across App.vue / useSceneMachineApp.ts (R.W6 B.2).
//
// The render-fn slot protocol (`tabsContent`/`ribbonContent`/`headerLeft` as
// render functions) STAYS — scenes project into sibling slot positions that
// Vue named slots structurally cannot reach; the render-fn bridge is the
// idiomatic cross-sibling teleport, not a workaround (R.md §2 / challenge-demo
// C.3). Only the typing changes.
// ─────────────────────────────────────────────────────────────────────────────

import type { VNode } from "vue";
import type { SceneFacility } from "@composables/scene-facility";

export interface SceneExposedApi {
    /**
     * The `SceneFacility` descriptor (T.B1). EVERY non-home scene exposes one
     * (the T.B1-β/T.B7 joint motion completed the set): the shell binding
     * registers `facility.playback` with the machine and `facility.channels`
     * drives the whole transport axis (labels, host mounts, selection, scrub).
     */
    facility?: SceneFacility;
    /** Render-fn slot projections (cross-sibling via defineExpose). */
    tabsContent?: () => VNode;
    /**
     * The controls-pane tab TRIGGER projection. `App.vue:58-63` binds it into
     * `<component :is>` under its own `v-if`, so the member is optional and a
     * scene that projects no trigger simply omits it (CubeScene deleted its
     * entry at `:152-156` — the App supplies `matrix-controls` as an active
     * surface instead). The slot props are the ones `ControlsPaneWrapper`
     * publishes on its `tabs-trigger` outlet (`:selected-animation` /
     * `:is-playing`), forwarded unchanged through `AnimationControlsGroup` and
     * `EditorShell`. The shape is the compiler's own, read off the slot chain by
     * `vue-tsc` rather than assumed: `selectedAnimation` is nullable because
     * `storedControls.selectedAnimation` is.
     */
    tabsTrigger?: (slotProps: {
        selectedAnimation: string | null;
        isPlaying: boolean;
    }) => VNode | null;
    ribbonContent?: (slotProps: { selectedControl: string }) => VNode | null;
    headerLeft?: () => VNode;
    /** The scene's superKey string (used by useSceneMachineApp for group-match). */
    superKey?: string;
    /** True if the scene auto-starts on mount. */
    autoPlays?: boolean;
    /** True if the scene has started at least once. */
    isStarted?: boolean;
}
