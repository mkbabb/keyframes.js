/**
 * `internal/group-factory.ts` — the neutral DI seam for `KeyframesAnimation.group()`
 * (R.W2c).
 *
 * The `group/` compositor zone depends on the `engine/` zone (it composes
 * `KeyframesAnimation` instances — the natural direction). The engine's
 * `.group()` convenience constructs an `AnimationGroup`, which is the ONE
 * runtime edge pointing the WRONG way (engine → group), closing the engine↔group
 * `no-cycle` ring. Rather than re-import the group class into the engine, the
 * group zone REGISTERS its constructor here (a value.js-free leaf depending on
 * neither zone) and `.group()` reads it back — dependency injection through a
 * neutral seam, no async, no cycle.
 *
 * Soundness: `KeyframesAnimation` is reachable only through
 * `loadAnimationEngine()`, which imports BOTH the engine and group zones, so the
 * factory is always registered (by `group/group.ts`'s module init) before any
 * `KeyframesAnimation` instance — and thus any `.group()` call — can exist.
 *
 * Typed structurally (the factory returns a bare `object`) so the leaf carries
 * ZERO edge to the group class; the engine narrows the return to the real
 * `AnimationGroup` type via its own `import type`.
 *
 * value.js-free (LIGHT).
 */

/**
 * Constructs an AnimationGroup from a first animation + rest animations. The
 * return is `object` (the real type is `AnimationGroup<V>`, narrowed by the
 * engine's own `import type` cast) so this leaf carries ZERO edge to the group
 * class.
 */
export type GroupFactory = (first: unknown, ...rest: unknown[]) => object;

let _groupFactory: GroupFactory | null = null;

/**
 * Register the AnimationGroup constructor (called once by `group/group.ts` at
 * module init). Idempotent — a re-register simply overwrites with the same
 * constructor.
 */
export const registerGroupFactory = (factory: GroupFactory): void => {
    _groupFactory = factory;
};

/**
 * Resolve the registered AnimationGroup constructor. Throws if the group zone
 * was never loaded — an impossible state through the public surface (see the
 * soundness note above), but an honest guard rather than a silent `undefined`.
 */
export const getGroupFactory = (): GroupFactory => {
    if (_groupFactory === null) {
        throw new Error(
            "AnimationGroup factory not registered — the group/ zone must be " +
                "loaded (it is, transitively, via loadAnimationEngine()) before " +
                "KeyframesAnimation.group() is called.",
        );
    }
    return _groupFactory;
};
