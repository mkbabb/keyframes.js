import { computed, inject, watch, type ComputedRef } from "vue";
import { ACTIVE_SCENE_KEY } from "../../injectionKeys";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { useSceneMachine } from "@state";
import type { StoredAnimationGroupControlOptions } from "@state";

interface UseSelectedControlSurfaceOptions {
    /** The host's animation (its superKey identifies the owning scene). */
    animation: KeyframesAnimation<any>;
    /** The shared per-group control store (read+written as the single authority). */
    storedControls: StoredAnimationGroupControlOptions;
    /** True when the host routes through the scene machine (DFA-gated). */
    tabsExternallyManaged: boolean;
}

interface UseSelectedControlSurfaceReturn {
    /** The machine-projected, synchronously-correct active control surface. */
    selectedControlSurface: ComputedRef<string>;
    /**
     * Project a raw user pick through the DFA to its valid surface (the
     * write the `selectControl` user-pick path stores). On a standalone host
     * the pick passes through unprojected.
     */
    projectPick: (pick: string) => string;
}

/**
 * The SELECTED-CONTROL-SURFACE single authority for AnimationControls.vue, lifted
 * out as a colocated composable (the K.WZ proof:demo-no-oversize seam; zero
 * behavior change). NOTE: `stripOptions`/`builtInTabs` deliberately stay in the
 * .vue (the proof:scene-control-dfa D1 source anchor greps the host for them).
 *
 * The `<SegmentedTabs> :model-value` is a MACHINE-PROJECTED, synchronously-correct
 * value: the active scene's selected surface resolved as a PURE FUNCTION of (the
 * DFA set × the group's stored pick) via `selectedControlSurfaceFor`. On a scene
 * SWITCH this is born correct on the very tick the strip mounts (no stale latch,
 * no nextTick re-assert — the B4 desync is fixed at its source). The STANDALONE
 * host (playground EditorShell, not scene-machine-routed) keeps the raw stored
 * pick (its activeScene stays the `home` default), mirroring `hasSurface`/
 * `builtInTabs` — the DFA projection gates ONLY when `tabsExternallyManaged`.
 *
 * THE ONE WRITER (J.W2 S2): the derivation-sync watch reconciles the store to the
 * single authority. When the machine projection corrects a stale pick (a single-
 * surface scene entered with another scene's stored selection; a matrix-controls
 * pick whose Matrix condition lapsed), it writes the projection BACK so the store
 * mirrors the authority — idempotent, fires only on genuine divergence, and the
 * projection (not this write) is what the strip binds, so it never races the
 * mount. The `isActiveSceneHost` gate is the suspend-on-leave half: during the
 * NAVIGATE → SCENE_READY window the controls still host the LEAVING scene's
 * animations, so a host whose `animation.superKey` is not the active scene's must
 * NOT write the destination scene's projection into the leaving scene's store
 * (the single-writer contract — the leaving scene's preference SURVIVES the
 * transition and resumes on re-entry).
 */
export function useSelectedControlSurface(
    options: UseSelectedControlSurfaceOptions,
): UseSelectedControlSurfaceReturn {
    const { animation, storedControls, tabsExternallyManaged } = options;

    const machine = useSceneMachine();

    // J.W2 S2 — the ACTIVE scene's superKey (App-provided; undefined on a
    // standalone host). The superKey is atomic with `machine.activeScene`, so the
    // write gate below can never lag the transition. The conditional-surface
    // awareness (cube's matrix-controls) is now folded INTO the derived surface
    // set (T.B2 — the Matrix channel's facet), so the machine projection is
    // already conditional-aware with no separate `activeConditionals` thread.
    const activeSuperKey = inject(ACTIVE_SCENE_KEY, undefined);

    // Does THIS host's store belong to the ACTIVE scene? During the NAVIGATE →
    // SCENE_READY window the controls still host the LEAVING scene's animations
    // (the App swaps `currentAnimationGroup` only on SCENE_READY) — a host whose
    // `animation.superKey` is not the active scene's must NOT write the destination
    // scene's projection into its own (the leaving scene's) store.
    const isActiveSceneHost = computed(
        () =>
            !activeSuperKey ||
            activeSuperKey.value === (animation.superKey ?? "default"),
    );

    const selectedControlSurface = computed<string>(() =>
        tabsExternallyManaged
            ? machine.selectedControlSurface(storedControls.selectedControl) ??
              storedControls.selectedControl
            : storedControls.selectedControl,
    );

    // Reconcile the store to the single authority — THE ONE WRITER (J.W2 S2).
    watch(
        selectedControlSurface,
        (surface) => {
            if (
                tabsExternallyManaged &&
                surface &&
                isActiveSceneHost.value &&
                storedControls.selectedControl !== surface
            ) {
                storedControls.selectedControl = surface;
            }
        },
        { immediate: true },
    );

    // J.W2 S2 — the user-pick path writes the DFA PROJECTION of the pick (not the
    // raw key), so every value that ever lands in the field is a projection of the
    // single authority: an invalid pick (a keyboard shortcut firing a surface this
    // scene doesn't have) resolves to the scene's valid surface instead of
    // transiting through the store.
    const projectPick = (pick: string): string =>
        tabsExternallyManaged
            ? machine.selectedControlSurface(pick) ?? pick
            : pick;

    return { selectedControlSurface, projectPick };
}
