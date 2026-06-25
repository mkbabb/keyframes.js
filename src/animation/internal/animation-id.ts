/**
 * `internal/animation-id.ts` — the shared animation-identity helper (R.W2c).
 *
 * `getAnimationId` was a static member of `engine/animation.ts`, which made
 * `group/group.ts` + `group/entries.ts` reach BACK into the engine zone at
 * runtime purely to resolve a name — one of the two runtime edges that closed
 * the engine↔group ring. It is pure string logic over the minimal identity
 * shape (`{ name?, id }`) every animation already carries, so it belongs in the
 * value.js-free leaf zone, depending on neither engine nor group.
 *
 * Structural by design: it takes `AnimationIdentity` (NOT `KeyframesAnimation`)
 * so it carries ZERO edge to the engine class. The engine barrel re-exports it
 * for the public `getAnimationId` surface; group/compile read it from here.
 *
 * value.js-free (LIGHT).
 */

/** The minimal identity shape every animation carries — name (optional) + numeric id. */
export interface AnimationIdentity {
    name?: string | undefined;
    id: number;
}

/**
 * Resolve a stable name for an animation reference: the explicit `name` when
 * set, else the numeric `id` stringified. A bare string passes through (the ONE
 * place a name-or-animation reference collapses to a name).
 */
export const getAnimationId = (
    animation: AnimationIdentity | string,
): string => {
    if (typeof animation === "string") return animation;
    return animation.name ?? String(animation.id);
};
