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
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import type { ScenePlayback } from "@state";
import type { SceneFacility } from "./sceneFacility";

export interface SceneExposedApi {
    /**
     * The `SceneFacility` descriptor (T.B1 — STAGE 1). When a scene exposes this,
     * the shell binding PREFERS it: `facility.playback` is registered with the
     * machine and `facility.channels` drives the transport-select labels. ADDITIVE
     * during the stage — a migrated scene may still carry the legacy
     * `animationGroup?`/`scenePlayback?` fields below (the two STAGE-2 scenes,
     * easing/spring, carry only the legacy fields until batch ⑤).
     */
    facility?: SceneFacility;
    /** The active AnimationGroup for the scene (or undefined if not set up yet). */
    animationGroup?: AnimationGroup<any>;
    /** The scene's own ScenePlayback handle (optional, owned scenes only). */
    scenePlayback?: ScenePlayback;
    /** Render-fn slot projections (cross-sibling via defineExpose). */
    tabsContent?: () => VNode;
    ribbonContent?: (slotProps: { selectedControl: string }) => VNode | null;
    headerLeft?: () => VNode;
    /** The scene's superKey string (used by useSceneMachineApp for group-match). */
    superKey?: string;
    /** True if the scene auto-starts on mount. */
    autoPlays?: boolean;
    /** True if the scene is currently playing (read by useSceneMachineApp). */
    isPlaying?: boolean;
    /** True if the scene has started at least once. */
    isStarted?: boolean;
}
