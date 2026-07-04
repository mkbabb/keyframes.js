/**
 * `group/layer-api.ts` — the layer-management + spring-transition API (R.W2 —
 * the cohesive "layer API" concern carved off `AnimationGroup` to keep `group.ts`
 * under the decomposition ceiling). Free functions over the concrete group (the
 * same DI pattern the engine's `./playback`/`./interpolate` carve uses); the
 * class keeps thin chainable delegates.
 *
 * The gate-anchored composite STATEMENTS follow the code to this new home (R.W2 —
 * "gate follows code"): proof:spring-blend-weight's `phys-c-api` greps THIS
 * module for the transition API (`transitionLayer`/`crossfade`), the spring park
 * (`layer.weightSpring = spring`), and the mid-flight re-seat
 * (`existing.target = target.weight`). The per-frame integrate lives in
 * `./springs`; the `weighted` blend leaf in `./compositor`.
 */
import { SpringProgress } from "../physics/spring";
import { requireEntry, resolveEntryKey } from "./entries";
import { seedLayerSpring } from "./springs";
import type { LayerTransitionSpring } from "./springs";
import type { AnimationLayerConfig, Vars } from "../constants";
import type { KeyframesAnimation } from "../engine";
import type { AnimationGroup } from "./group";

/**
 * Set layer config for an animation by name or reference; throws on an
 * unregistered key (silent no-ops were hiding consumer bugs).
 */
export function setLayerConfig<V extends Vars>(
    group: AnimationGroup<V>,
    nameOrAnim: string | KeyframesAnimation<V>,
    config: Partial<AnimationLayerConfig>,
): void {
    const entry = requireEntry(group.animations, nameOrAnim, "setLayerConfig");
    Object.assign(entry.layer, config);
    group.invalidateEntries();
}

/** Read the layer config for an animation by name or reference. */
export function getLayerConfig<V extends Vars>(
    group: AnimationGroup<V>,
    nameOrAnim: string | KeyframesAnimation<V>,
): AnimationLayerConfig | undefined {
    return group.animations[resolveEntryKey(nameOrAnim)]?.layer;
}

/**
 * Spring a layer's blend `weight` from its CURRENT value to `weight` (K.W11
 * PHYS-C — the spring-driven crossfade). Seeds a `SpringProgress` (via
 * `seedLayerSpring`), parks it on `layer.weightSpring`, forces `blendMode` to
 * `weighted`. A mid-flight re-target RE-SEATS the in-flight spring from its live
 * `(value, velocity)` (`set target`) — velocity-continuous, no kink.
 */
export function transitionLayer<V extends Vars>(
    group: AnimationGroup<V>,
    nameOrAnim: string | KeyframesAnimation<V>,
    target: { weight: number; spring?: LayerTransitionSpring },
): void {
    const entry = requireEntry(group.animations, nameOrAnim, "transitionLayer");
    const layer = entry.layer;
    layer.blendMode = "weighted";

    const existing = layer.weightSpring;
    if (existing instanceof SpringProgress) {
        // Re-seat the in-flight spring from its live (value, velocity) —
        // velocity-continuous, no kink. `set target` does the re-seat.
        existing.target = target.weight;
    } else {
        // Seed a fresh spring at the layer's current weight, then park it.
        const spring = seedLayerSpring(layer.weight, target.weight, target.spring);
        layer.weightSpring = spring;
    }

    group._hasLayerSprings = true;
    group.invalidateEntries();
}

/**
 * Physically crossfade between two layers (K.W11 PHYS-C): spring layer `a` down
 * to weight `0` and layer `b` up to `1`, each over its own `SpringProgress` —
 * two `transitionLayer` calls (the flagship demo moment, a crossfade that
 * overshoots and settles).
 */
export function crossfade<V extends Vars>(
    group: AnimationGroup<V>,
    a: string | KeyframesAnimation<V>,
    b: string | KeyframesAnimation<V>,
    options?: { spring?: LayerTransitionSpring },
): void {
    const spring = options?.spring;
    transitionLayer(group, a, { weight: 0, ...(spring ? { spring } : {}) });
    transitionLayer(group, b, { weight: 1, ...(spring ? { spring } : {}) });
}
