/**
 * compile/backward-walk.ts — the COMPILE input walkers (K.W10, carved off
 * `backward.ts` in R.W2b).
 *
 * The "orchestration graph → `CompileChild[]`" half of the backward compile:
 * `walkGroup` (an `AnimationGroup`'s layer `blendMode` → `animation-composition`
 * operator + the CC-5 static/spring `weighted` partition), `walkSequence` (a
 * `Sequence`'s master-clock `at` offsets → `animation-delay`), `walkList` (a bare
 * `stagger`-delayed cohort), and the `cssIdent` name normalizer. `backward.ts`
 * owns the per-child compile + the orchestrating `compileToCSS` over these.
 *
 * HEAVY (reaches the `./engine`/`./group`/`./orchestration` runtime) — rides the
 * same `loadAnimationEngine()` dynamic edge as `backward.ts`.
 */
import type { KeyframesAnimation } from "../../engine";
import { AnimationGroup } from "../../group";
// a06 F7 (S.B3 S5) — `getAnimationId` is homed at `internal/animation-id` (the
// value.js-free leaf `engine`/`group`/`compile` all read); reach it at the LEAF,
// not re-routed through the `../engine` barrel — closing the cross-zone deep-import.
import { getAnimationId } from "../../internal/animation-id";
import { Sequence } from "../../orchestration/sequence";
import type { CompositeOperator, Vars } from "../../constants";

/** A walked child — its animation + the layer/sequence metadata the compile reads. */
export interface CompileChild<V extends Vars> {
    animation: KeyframesAnimation<V>;
    name: string;
    /** The CSS `animation-composition` operator for this child's layering (CC-1 inverting W7). */
    composition: CompositeOperator;
    /**
     * A SPRING-driven `weighted` blend (a live `weightSpring` crossfade) forces a
     * refusal (CC-3 §3a) — it has no static CSS twin. A STATIC `weighted` layer is
     * NOT this: it pre-multiplies into an `accumulate` layer (see {@link CompileChild.staticWeight}).
     */
    weighted: boolean;
    /**
     * CC-5 (L.W2 S3) — a STATIC `weighted` layer's constant blend scalar. When
     * defined, `compileChild` pre-multiplies the child's numeric keyframe leaves by
     * this weight (CLONE-only — never mutates `parsedVars`) and emits the result as
     * an `animation-composition: accumulate` layer (exact CSS, no spring, no
     * runtime). `undefined` for a `replace`/`add` layer or a spring crossfade.
     */
    staticWeight?: number;
    /** An absolute offset (ms) — a Sequence position / stagger delay, emitted as `animation-delay`. */
    delay: number;
}

/** The input shapes `compileToCSS` accepts. */
export type CompileInput<V extends Vars = Vars> =
    | AnimationGroup<V>
    | Sequence<V>
    | ReadonlyArray<KeyframesAnimation<V> | { animation: KeyframesAnimation<V> }>;

/**
 * Walk an `AnimationGroup` into compile children. The layer `blendMode` maps to
 * the CSS `animation-composition` operator: `replace` → `replace`, `add` → `add`
 * (INVERTING W7's honoring — the operator W7 taught the engine to READ is now
 * EMITTED).
 *
 * CC-5 (L.W2 S3) — the `weighted` blend PARTITIONS:
 *   • a SPRING-driven `weighted` (a live `weightSpring` crossfade) has no static
 *     CSS twin → a REFUSAL flag (`springWeighted` → `weighted: true`), the §3a
 *     refusal that PROVES axis-3's uniqueness.
 *   • a STATIC `weighted` (constant scalar, `weightSpring == null`) is the simple
 *     pre-compositing case: the keyframe values pre-multiply by the scalar at
 *     compile time and the layer emits as `animation-composition: accumulate` —
 *     exact CSS, no spring, no JS runtime. Carried on `staticWeight`.
 */
export function walkGroup<V extends Vars>(
    group: AnimationGroup<V>,
): CompileChild<V>[] {
    const children: CompileChild<V>[] = [];
    for (const key of Object.keys(group.animations)) {
        const entry = group.animations[key]!;
        const blend = entry.layer.blendMode;
        const springWeighted =
            blend === "weighted" && entry.layer.weightSpring != null;
        const staticWeighted =
            blend === "weighted" && entry.layer.weightSpring == null;
        const composition: CompositeOperator =
            blend === "add" ? "add" : staticWeighted ? "accumulate" : "replace";
        children.push({
            animation: entry.animation,
            name: cssIdent(getAnimationId(entry.animation)),
            composition,
            weighted: springWeighted,
            ...(staticWeighted ? { staticWeight: entry.layer.weight } : {}),
            delay: 0,
        });
    }
    return children;
}

/**
 * Walk a `Sequence` into compile children. Each entry's absolute `at` offset on
 * the master clock materializes as the child's `animation-delay` — the temporal
 * positioning emitted as a literal delay (a Sequence is `replace`-layered:
 * children paint their own targets along one clock, not a per-frame blend).
 */
export function walkSequence<V extends Vars>(
    seq: Sequence<V>,
): CompileChild<V>[] {
    return seq.entries.map((entry) => ({
        animation: entry.animation,
        name: cssIdent(getAnimationId(entry.animation)),
        composition: "replace" as const,
        weighted: false,
        delay: entry.at,
    }));
}

/** Walk a bare child list (e.g. a `stagger`-delayed cohort). All `replace`. */
export function walkList<V extends Vars>(
    list: ReadonlyArray<
        KeyframesAnimation<V> | { animation: KeyframesAnimation<V> }
    >,
): CompileChild<V>[] {
    return list.map((item, i) => {
        const anim = (
            "animation" in (item as { animation?: unknown })
                ? (item as { animation: KeyframesAnimation<V> }).animation
                : (item as KeyframesAnimation<V>)
        ) as KeyframesAnimation<V>;
        return {
            animation: anim,
            name: cssIdent(getAnimationId(anim) || `anim-${i}`),
            composition: "replace" as const,
            weighted: false,
            delay: 0,
        };
    });
}

/**
 * Normalize a child name to a CSS-safe ident (the `@keyframes`/class name). A
 * bare numeric id (`getAnimationId` falls back to `String(id)`) gets an `a`
 * prefix so the `@keyframes` name is a valid CSS identifier; collisions are
 * de-duped by the walker via a `-2`/`-3` suffix.
 */
export function cssIdent(name: string): string {
    const cleaned = name.replace(/[^a-zA-Z0-9_-]/g, "-");
    return /^[a-zA-Z_]/.test(cleaned) ? cleaned : `a${cleaned}`;
}
