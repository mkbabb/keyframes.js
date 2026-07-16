/**
 * group/types.ts — the AnimationGroup shared TYPE leaf (S.B4 / a04). The entry /
 * object / input shapes the compositor class + its colocated helpers
 * (`./entries`, `./soa`, `./yield-batch`, `./springs`) all consume, carved off
 * `group.ts` so the class module owns behaviour and the type surface has one
 * declared home (the sibling helpers import from `./types`, not the class file).
 *
 * A value.js-free type leaf: it holds only `type`/`interface` declarations over
 * the engine's `KeyframesAnimation` TYPE (erased) + the constants — no runtime
 * edge, no `instanceof`.
 */
import type { KeyframesAnimation } from "../engine";
import type { FlatAuthoredValues } from "../compile/value-ast";
import type { AnimationLayerConfig, Vars } from "../constants";

export interface AnimationGroupEntry<V extends Vars> {
    animation: KeyframesAnimation<V>;
    values: FlatAuthoredValues;
    layer: AnimationLayerConfig;
}

export interface AnimationGroupObject<V extends Vars> {
    [key: string]: AnimationGroupEntry<V>;
}

/** Input — a bare Animation or one with a layer config. */
export type AnimationGroupInput<V extends Vars> =
    | KeyframesAnimation<V>
    | { animation: KeyframesAnimation<V>; layer?: Partial<AnimationLayerConfig> };
