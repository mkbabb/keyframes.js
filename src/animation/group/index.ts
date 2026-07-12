/**
 * group/ — the AnimationGroup compositor barrel (R.W1). HEAVY (value.js-bearing).
 * The `group.ts` class over `soa.ts` (the zero-alloc SoA blend fold) and
 * `layer-springs.ts`/`springs.ts` (the spring-weight helpers). The barrel is the
 * zone's single surface (the engine barrel re-exports `AnimationGroup` through it).
 *
 * S.B4 (a06 F1/F2 — the ownership inversion) — the `registerGroupFactory`
 * service-locator arming that once let `KeyframesAnimation.group()` build a group
 * WITHOUT a static engine→group edge is DELETED, along with the
 * `internal/group-factory` leaf it armed. Group construction is now
 * `AnimationGroup.of(first, ...rest)` (genuine ownership), so the `group → engine`
 * dependency is one-directional by construction — no back-edge to invert, no seam
 * to arm.
 */
export { AnimationGroup } from "./group";
export type {
    AnimationGroupEntry,
    AnimationGroupObject,
    AnimationGroupInput,
} from "./types";
export {
    isGroupWAAPIEligible,
    lowerGroupWAAPI,
} from "./waapi";
