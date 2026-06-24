/**
 * group/ — the AnimationGroup compositor barrel (R.W1). HEAVY (value.js-bearing).
 * The `group.ts` class (moved as-is — the 924L god-class carve into the SoA fold
 * + layer-springs 3-way split + the test-scaffold demotion is R.W2) over `soa.ts`
 * (the zero-alloc SoA blend fold) and `layer-springs.ts` (the spring-weight
 * helpers). The barrel is the zone's single surface (the engine barrel re-exports
 * `AnimationGroup` through it).
 */
export { AnimationGroup } from "./group";
export type {
    AnimationGroupEntry,
    AnimationGroupObject,
    AnimationGroupInput,
} from "./group";
