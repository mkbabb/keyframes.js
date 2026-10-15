// ─────────────────────────────────────────────────────────────────────────────
// SceneExposedApi — the typed surface that every scene exposes via
// `defineExpose()`. Replaces the `shallowRef<any>(null)` duck-typing chain
// across App.vue / useSceneMachineApp.ts (R.W6 B.2).
//
// The facet BODY stays a render fn (`tabsContent`): a scene projects it into a
// sibling slot position that Vue named slots structurally cannot reach, and
// the render-fn bridge is the idiomatic cross-sibling seam (R.md §2 /
// challenge-demo C.3). The scene's TRANSPORT is not a render fn any more
// (X.KF.W13X.r4ribbon · A2-KE-L1-24): `ribbonContent` is a typed binding
// source for the one PlaybackRibbon mount (RibbonBar), read through the ribbon
// seat the App provides, so a scene mounts no ribbon of its own.
// A2-KE-L1-13 (X.KF.W13X.scene): the `tabsTrigger` and `headerLeft` members no
// scene provided and nothing read are deleted — a scene projects exactly the
// two members the shell reads.
// ─────────────────────────────────────────────────────────────────────────────

import type { VNode } from "vue";
import type { SceneFacility } from "@composables/scene-facility";
import type { RibbonSource } from "@components/instrument/transport/injectionKeys";

export interface SceneExposedApi {
    /**
     * The `SceneFacility` descriptor (T.B1). EVERY non-home scene exposes one
     * (the T.B1-β/T.B7 joint motion completed the set): the shell binding
     * registers `facility.playback` with the machine and `facility.channels`
     * drives the whole transport axis (labels, host mounts, selection, scrub).
     */
    facility?: SceneFacility;
    /** The facet body, as a render fn (cross-sibling via defineExpose). */
    tabsContent?: () => VNode;
    /** The scene's transport for its facet surface: the binding RibbonBar's
     *  one PlaybackRibbon mount shows, or `null` on a surface with none. */
    ribbonContent?: RibbonSource;
    /** The scene's superKey string (used by useSceneMachineApp for group-match). */
    superKey?: string;
    /** True if the scene auto-starts on mount. */
    autoPlays?: boolean;
    /** True if the scene has started at least once. */
    isStarted?: boolean;
}
