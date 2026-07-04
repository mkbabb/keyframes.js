/**
 * group/ — the AnimationGroup compositor barrel (R.W1). HEAVY (value.js-bearing).
 * The `group.ts` class (moved as-is — the 924L god-class carve into the SoA fold
 * + layer-springs 3-way split + the test-scaffold demotion is R.W2) over `soa.ts`
 * (the zero-alloc SoA blend fold) and `layer-springs.ts` (the spring-weight
 * helpers). The barrel is the zone's single surface (the engine barrel re-exports
 * `AnimationGroup` through it).
 */
import { AnimationGroup } from "./group";
import type { AnimationGroupInput } from "./group";
import { registerGroupFactory } from "../internal/group-factory";
import type { KeyframesAnimation } from "../engine";

export { AnimationGroup } from "./group";
export type {
    AnimationGroupEntry,
    AnimationGroupObject,
    AnimationGroupInput,
} from "./group";

// R.W2c — register the AnimationGroup ctor into the neutral DI seam so
// `KeyframesAnimation.group()` builds a group WITHOUT a static engine→group edge
// (inverting the back-edge that closed the engine↔group `no-cycle` ring). Done
// at the ZONE BARREL (the zone's composition point): loading the group zone —
// which `loadAnimationEngine()` does alongside the engine — arms the seam, so
// the factory is always registered before any `.group()` call can occur.
registerGroupFactory(
    (first, ...rest) =>
        new AnimationGroup(
            first as KeyframesAnimation,
            ...(rest as AnimationGroupInput<any>[]),
        ),
);
