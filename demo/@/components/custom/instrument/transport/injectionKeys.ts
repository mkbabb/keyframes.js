import type { ComputedRef, InjectionKey, Ref } from "vue";

export const CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>> = Symbol("controlsPaneHover");
export const TABS_EXTERNALLY_MANAGED_KEY: InjectionKey<boolean> = Symbol("tabsExternallyManaged");

/** J.W2 S2 / T.B9 — the ACTIVE scene's registry id (the App's `currentSuperKey`,
 *  atomic with `machine.activeScene`; the ONE keyspace — the `animation.superKey`
 *  field now carries the SceneId). The `AnimationControls` derivation-sync gates
 *  its store write on `animation.superKey === ACTIVE_SCENE_KEY` so a stale-mounted
 *  host (the NAVIGATE → SCENE_READY window, when the controls still host the
 *  LEAVING scene's animations) can never write the DESTINATION scene's projection
 *  into the LEAVING scene's store — the suspend-on-leave half of the single-writer
 *  contract (the perf-battery §2 corruption cure). */
export const ACTIVE_SCENE_KEY: InjectionKey<ComputedRef<string | undefined>> =
    Symbol("activeSceneKey");
