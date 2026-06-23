import { ValueUnit, lerp } from "@mkbabb/value.js";
import { withReducedMotion } from "./internal/reduced-motion";
import { RAFPlayback } from "./playback";
import { KeyframesAnimation, getAnimationId } from "./engine";
// PKG-3 (L.W8 §S4): the class was renamed `Animation` → `KeyframesAnimation`
// (the runtime VALUE). The `Animation` name survives only as a deprecated TYPE
// alias — kept here for the existing `Animation<V>` annotations below — while
// the `instanceof` guard reads the canonical runtime constructor.
import type { Animation } from "./engine";
import { SpringProgress } from "./spring";
import {
    advanceBatched,
    advanceSlice,
    computeGroupedKeys,
    renderMultiTarget,
    requireEntry,
    resolveEntryKey,
    seedLayerSpring,
    setChildrenPaused,
    snapChildrenToFinal,
} from "./group-layer-springs";
import type { LayerTransitionSpring } from "./group-layer-springs";
import type {
    AnimationLayerConfig,
    TransformFunction,
    Vars,
} from "./constants";
import { defaultLayerConfig, NOOP_TRANSFORM } from "./constants";

// The K.W11 PHYS-C spring-weight helpers live in `./group-layer-springs`
// (INTERNAL); re-export the option type so the public `transitionLayer`/
// `crossfade` signatures read unchanged.
export type { LayerTransitionSpring };

/**
 * Typed blend-carrier guard — the group is heavy-side (it statically composes
 * the engine), so the real `ValueUnit` class is available for an `instanceof`
 * check instead of structural duck-typing on `{ value }`.
 */
const isNumericUnit = (value: unknown): value is ValueUnit<number> =>
    value instanceof ValueUnit && typeof value.value === "number";

/**
 * P.W2 — the precomputed SoA fold layout for ONE `add`/`weighted` blend layer.
 * `carriers[s]`/`incomings[s]` are the stable `ValueUnit<number>` refs the boxed
 * inner loop would have touched at slot `s` (the carrier is the leaf a lower
 * layer parked in `_grouped`; the incoming is this layer's `entry.values` leaf —
 * both alias `frame.flatVars` units whose `.value` `interpFrames` mutates in
 * place, so the refs are frame-stable). The per-frame fold seeds `_compositeBuf`
 * from each carrier, applies the layer's op (`+=` for `add`, `lerp(...,w)` for
 * `weighted`) against the incoming, and writes back — replacing the per-frame
 * `for..in` + `Array.isArray` + per-element `isNumericUnit` dispatch with a
 * contiguous numeric loop. The `entry` is carried for the `weighted` arm's
 * per-LAYER `w = layer.weightSpring?.value ?? layer.weight` read (K.W11 PHYS-C).
 */
interface SoALayerPlan {
    /**
     * The layer config — the `weighted` fold re-reads its per-frame `w =
     * weightSpring?.value ?? weight` LIVE (K.W11 PHYS-C, so a spring still drives
     * the blend), and the config is generic-independent so the plan holds it
     * without binding the group's `V`.
     */
    layer: AnimationLayerConfig;
    weighted: boolean;
    /** The pure-numeric carrier units the fold seeds `_compositeBuf` from + writes back to. */
    carriers: ValueUnit<number>[];
    /** The incoming numeric units folded against each carrier (parallel to `carriers`). */
    incomings: ValueUnit<number>[];
    /**
     * The keys this layer touches that the SoA fold does NOT cover — a non-array
     * carrier (first-touch of a key, or a scalar that a lower layer left
     * `undefined`), or a leaf with ANY non-numeric / mixed element. These keep
     * the boxed per-element path (the `Array.isArray` guard + the
     * `Math.min(existing.length, incoming.length)` element loop), so the
     * `add`/`weighted` blend stays byte-identical on the non-numeric tail. EMPTY
     * for the dominant all-numeric transform shape (every leaf a numeric
     * `ValueUnit[]`), so the whole `for..in` collapses to the SoA fold.
     */
    boxedKeys: string[];
}

export interface AnimationGroupEntry<V extends Vars> {
    animation: Animation<V>;
    values: Record<string, unknown>;
    layer: AnimationLayerConfig;
}

export interface AnimationGroupObject<V extends Vars> {
    [key: string]: AnimationGroupEntry<V>;
}

/** Input type for AnimationGroup constructor — bare Animation or Animation with layer config. */
export type AnimationGroupInput<V extends Vars> =
    | Animation<V>
    | { animation: Animation<V>; layer?: Partial<AnimationLayerConfig> };

export class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V> = {};
    /**
     * The group's composite transform. Defaults to a real no-op at the FIELD
     * (I.W0 S3) — NOT a lying definite-assignment assertion: a childless or
     * pre-`parse()` group composites nothing via a harmless no-op instead of
     * throwing `this.transform is not a function`. The constructor overrides it
     * with the first child's transform when one exists.
     */
    transform: TransformFunction<V> = NOOP_TRANSFORM;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    /**
     * When true, `play()` honors `prefers-reduced-motion: reduce` by snapping
     * every child to its final frame in a single composite instead of running
     * the rAF draw loop. SSR-safe off-DOM. Default false.
     */
    respectReducedMotion = false;

    /**
     * Children-per-slice before `advanceTo()` yields to the main thread. Groups
     * at or under this size tick in one slice (fast path); larger groups tick in
     * batches with a `scheduler.yield()` between them (INP relief).
     */
    static readonly YIELD_BATCH = 32;

    singleTarget = true;

    lastTickTime: number = 0;

    /** THE rAF owner for the group's draw loop. */
    readonly playback = new RAFPlayback();
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;
    private _playingPromise: Promise<void> | null = null;

    /** Pre-bound frame callback — allocated once to avoid a per-loop closure. */
    private _boundFrame: (t: number) => boolean | Promise<boolean>;

    /** Cached entries sorted by layer zIndex (see `getEntries`). */
    private _entries: AnimationGroupEntry<V>[] = [];
    private _entriesDirty = true;

    /**
     * Long-lived composite buffer, cleared in place at the top of
     * `transformFramesGrouped` (the zero-alloc idiom `interpFrames`'s `out` buffer
     * uses) — no fresh object allocated per frame.
     */
    private _grouped: Record<string, unknown> = {};

    /**
     * The compile-stable union of every child's contributed (whitelist-filtered)
     * keys — what `_grouped` is null-filled to each frame so the composite clears
     * WITHOUT `delete` (F.W4 S2: the delete-loop trapped `_grouped` in V8
     * dictionary mode). Recomputed only on a structural change; the fold lives in
     * `group-layer-springs`.
     */
    private _groupedKeys: string[] = [];
    private _groupedKeysDirty = true;

    /**
     * P.W2 — the SoA composite layout for the `add`/`weighted` blend arms (the
     * validated 3.7× — `scripts/group-soa-decision.json`, bit-identical
     * `maxErr=0`). One {@link SoALayerPlan} per `add`/`weighted` entry: the FLAT
     * list of pure-numeric `(carrier, incoming)` `ValueUnit<number>` pairs that
     * blend would touch, hoisted out of the per-frame `for..in` + `Array.isArray`
     * + per-element `isNumericUnit` dispatch into a contiguous {@link Float64Array}
     * fold. Rebuilt ONLY on a structural change (alongside `_groupedKeys`), NEVER
     * per frame. The `replace` default arm is dispatch-free and carries NO plan;
     * the non-numeric (color/computed/string/mixed) tail keeps the boxed
     * per-element path. The probe (`carrier-probe`) proved `interpFrames` MUTATES
     * each leaf `ValueUnit.value` IN PLACE, so the carrier + incoming refs are
     * STABLE across frames — the plan is valid until the entry set / a layer
     * whitelist / a blend mode changes (every such mutation routes through
     * `invalidateEntries`).
     */
    private _soaPlans: SoALayerPlan[] | null = null;
    /**
     * The long-lived SoA fold scratch — the contiguous numeric accumulate buffer
     * the `add`/`weighted` fold seeds, folds, and writes back through. Sized to
     * the WIDEST single-layer numeric pair count once per structural change
     * (reused across layers AND frames — zero per-frame alloc, the F.W4 zero-alloc
     * discipline). `null` until the first plan with numeric pairs is built.
     */
    private _compositeBuf: Float64Array | null = null;

    /**
     * K.W11 PHYS-C — true iff ANY layer currently carries a `weightSpring`. The
     * fast-path guard: when false (the universal case) `advanceTo` skips the
     * per-frame spring scan entirely, so the constant-weight blend hot path takes
     * ZERO new work. Set true by `transitionLayer`; recomputed false once every
     * driving spring has settled.
     */
    private _hasLayerSprings = false;

    constructor(...inputs: (Animation<V> | AnimationGroupInput<V>)[]) {
        this._boundFrame = this._frame.bind(this);

        const animations: Animation<V>[] = [];

        for (const input of inputs) {
            let animation: Animation<V>;
            let layerConfig: Partial<AnimationLayerConfig> | undefined;

            if (input instanceof KeyframesAnimation) {
                animation = input;
            } else {
                animation = input.animation;
                layerConfig = input.layer;
            }

            // Inherit the transform from the first child that has one, overriding
            // the no-op field default. A child constructed before `parse()`
            // (empty `frames`) leaves the no-op default standing, so
            // `transformFramesGrouped` composites a harmless empty frame instead
            // of throwing (I.W0 S3 — the field default IS the total fallback).
            if (
                this.transform === NOOP_TRANSFORM &&
                animation.frames[0] != null
            ) {
                this.transform = animation.frames[0].transform;
            }

            const name = getAnimationId(animation);

            this.animations[name] = {
                values: {},
                animation,
                layer: { ...defaultLayerConfig, ...layerConfig },
            };

            animation.managed = true;
            animations.push(animation);
        }

        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0]?.targets[0],
        );

        this.invalidateEntries();
    }

    // ── Entry cache ──────────────────────────────────────────────────

    /**
     * The animation entries sorted by layer zIndex, dirty-flag cached — rebuilt
     * only when the animations object or a layer config is mutated. All hot-path
     * iteration uses this instead of `Object.values()`.
     */
    private getEntries(): AnimationGroupEntry<V>[] {
        if (this._entriesDirty) {
            this._entries = Object.values(this.animations);
            this._entries.sort((a, b) => a.layer.zIndex - b.layer.zIndex);
            this._entriesDirty = false;
        }
        return this._entries;
    }

    /** Mark entries cache stale. Called at all mutation boundaries. */
    private invalidateEntries(): void {
        this._entriesDirty = true;
        this._groupedKeysDirty = true;
    }

    // ── Setup ────────────────────────────────────────────────────────

    setSuperKey(superKey: string) {
        this.superKey = superKey;
        for (const entry of this.getEntries()) {
            entry.animation.superKey = superKey;
        }
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        const entries = this.getEntries();
        for (const entry of entries) {
            entry.animation.setTargets(...targets);
        }

        this.singleTarget = entries.every(
            (entry) =>
                entry.animation.targets[0] === entries[0]?.animation.targets[0],
        );

        return this;
    }

    // ── Lifecycle hooks ──────────────────────────────────────────────

    onStart() {
        this.started = true;
        return this;
    }

    onEnd() {
        return this;
    }

    // ── Frame rendering ──────────────────────────────────────────────

    /**
     * Composite all animation values into a single grouped transform (per-frame
     * for single-target groups). Applies layer blending (replace / add /
     * weighted) in zIndex order, then calls the group transform with the merged
     * values. Each child's values refresh in place (`interpFrames` clears and
     * rewrites the long-lived buffer), so no stale keys leak and no fresh object
     * is allocated per entry per frame.
     */
    transformFramesGrouped(t: number) {
        // Reuse the long-lived composite buffer, cleared in place (the zero-alloc
        // idiom `interpFrames` uses for its `out` buffer) — no fresh object/frame.
        const groupedValues = this._grouped;
        if (this._groupedKeysDirty) {
            // The compile-stable key UNION (whitelist-filtered) — recomputed only
            // on a structural change, never per frame (fold in `group-layer-springs`).
            this._groupedKeys = computeGroupedKeys(this.getEntries());
            this._groupedKeysDirty = false;
            // P.W2 — drop the SoA plan; it is rebuilt lazily on the next frame
            // (once each child's `entry.values` is populated, so the carrier +
            // incoming refs can be captured). A structural change invalidates the
            // captured refs, so the rebuild is gated on the SAME dirty seam.
            this._soaPlans = null;
        }

        // F.W4 S2 — stable-key null-fill clear (NO `delete`: the delete-loop
        // trapped `_grouped` in V8 dictionary mode). Inactive keys read back
        // `undefined`; the blend skips them and the post-blend compaction drops
        // any uncontributed key.
        const groupedKeys = this._groupedKeys;
        for (let i = 0; i < groupedKeys.length; i++) {
            groupedValues[groupedKeys[i]!] = undefined;
        }

        const entries = this.getEntries();

        // P.W2 — the SoA fold (the validated 3.7×) takes over ONLY once the plan
        // is built. The plan needs each child's `entry.values` populated (the
        // carrier + incoming refs to capture), so the FIRST frame after a
        // structural change runs the boxed path AND builds the plan; subsequent
        // frames fold numeric pairs through `_compositeBuf`. A group with NO
        // `add`/`weighted` layer builds an empty plan list (the `replace` default
        // is dispatch-free — there is nothing to transpose), so the fast path is
        // byte-unchanged.
        const useSoA = this._soaPlans !== null;
        let soaIdx = 0;

        let done = true;
        for (const groupObject of entries) {
            const { animation, layer, values } = groupObject;

            done = done && animation.done;

            if (!layer.enabled) continue;

            // Refresh in place — `interpFrames` resets `values` before writing,
            // so a scrubbed child's fresh state is always reflected.
            animation.interpFrames(
                animation.t,
                false,
                values as Record<string, ValueUnit[]>,
            );

            // The whitelist is an INLINE key-skip — no `filteredValues` object;
            // each blend arm walks `values` with `for..in` (allocation-free).
            const whitelist = layer.properties;

            if (layer.blendMode === "replace") {
                // The DEFAULT arm — a bare reference-assign (z-order last-writer-
                // wins). Already dispatch-free; UNTOUCHED by the SoA transposition.
                for (const key in values) {
                    if (whitelist && !whitelist.has(key)) continue;
                    const incoming = values[key];
                    if (incoming === undefined) continue;
                    groupedValues[key] = incoming;
                }
                continue;
            }

            // `add` / `weighted` — the non-default boxed-AoS arms the SoA fold
            // targets. When the plan is built, fold the pure-numeric pairs through
            // `_compositeBuf` (`soaBlendLayer`), then run the boxed path ONLY over
            // the residual (non-numeric / mixed / first-touch) keys — empty for the
            // dominant all-numeric shape, so the whole `for..in` collapses to the
            // fold. On the plan-build frame `useSoA` is false: the boxed path runs
            // whole (and records the carriers the next frame's plan captures).
            if (useSoA) {
                const plan = this._soaPlans![soaIdx++]!;
                this.soaBlendLayer(plan);
                if (plan.boxedKeys.length > 0) {
                    this.boxedBlendArm(
                        layer,
                        values,
                        groupedValues,
                        whitelist,
                        plan.boxedKeys,
                    );
                }
            } else {
                this.boxedBlendArm(layer, values, groupedValues, whitelist);
            }
        }

        // Build the SoA plan once `entry.values` is populated (this frame's boxed
        // pass established the carriers) — captured for every subsequent frame.
        if (!useSoA) this._soaPlans = this.buildSoAPlans(entries);

        this.done = done;

        // Drop any key NO enabled child contributed this frame so the transform
        // never serializes an `undefined`. In the common case this deletes
        // nothing, so `_grouped` stays in fast-properties mode (delete-free,
        // zero-alloc).
        for (let i = 0; i < groupedKeys.length; i++) {
            const key = groupedKeys[i]!;
            if (groupedValues[key] === undefined) delete groupedValues[key];
        }

        // I.W0 S3 — lazy composite-transform resolution. A child constructed
        // before `parse()` populates its `frames` keeps `transform`'s no-op
        // default (compositing NOTHING — a frozen subject); resolve it from the
        // first now-parsed child the FIRST time we draw a real frame. A childless
        // group keeps the no-op (harmless). Idempotent — guard skips once resolved.
        if (this.transform === NOOP_TRANSFORM) {
            for (const entry of this.getEntries()) {
                const frame = entry.animation.frames[0];
                if (frame != null && frame.transform != null) {
                    this.transform = frame.transform;
                    break;
                }
            }
        }

        this.transform(groupedValues as V, t);

        return groupedValues;
    }

    /**
     * The boxed `add`/`weighted` blend arm — the per-element AoS path that the
     * SoA fold (`soaBlendLayer`) supplants for the pure-numeric majority. Kept as
     * THE blend implementation for two roles: (1) the plan-build frame (every key,
     * `only === undefined`) — it establishes the carriers `buildSoAPlans` then
     * captures; (2) the per-frame residual (the plan's `boxedKeys` — non-numeric /
     * mixed / first-touch leaves the fold cannot cover, typically empty). Both
     * arms guard on `Array.isArray(existing) && Array.isArray(incoming)` and loop
     * `Math.min(existing.length, incoming.length)` elements with a per-element
     * `isNumericUnit` guard — the byte-exact G.W17 leaf contract (proof:blend),
     * un-clamped `add` (`+=`), spring-weighted `lerp`. A non-array carrier (or a
     * skipped key) falls through to `groupedValues[key] = incoming`.
     */
    private boxedBlendArm(
        layer: AnimationLayerConfig,
        values: Record<string, unknown>,
        groupedValues: Record<string, unknown>,
        whitelist: Set<string> | undefined,
        only?: readonly string[],
    ): void {
        const onlySet = only ? new Set(only) : undefined;
        if (layer.blendMode === "add") {
            // Accumulate each numeric leaf element in place (the leaf is a
            // `ValueUnit[]` — scalar = length 1, multi-component = N). Numeric add
            // is UN-CLAMPED (CSS `animation-composition: add` clamps at use, not
            // composition) — `0.8 + 0.8 → 1.6`.
            for (const key in values) {
                if (onlySet && !onlySet.has(key)) continue;
                if (whitelist && !whitelist.has(key)) continue;
                const incoming = values[key];
                if (incoming === undefined) continue;
                const existing = groupedValues[key];
                if (Array.isArray(existing) && Array.isArray(incoming)) {
                    const n = Math.min(existing.length, incoming.length);
                    for (let i = 0; i < n; i++) {
                        if (
                            isNumericUnit(existing[i]) &&
                            isNumericUnit(incoming[i])
                        ) {
                            existing[i].value += incoming[i].value;
                        } else {
                            existing[i] = incoming[i];
                        }
                    }
                } else {
                    groupedValues[key] = incoming;
                }
            }
            return;
        }

        // `weighted` — lerp each numeric leaf element toward the incoming value by
        // `w`, in place. K.W11 PHYS-C — the spring-driven blend weight: when the
        // layer carries a `weightSpring` (set by `transitionLayer`/`crossfade`),
        // `w` is the stepper's CURRENT value, not the constant `layer.weight` —
        // ONE nullish read hoisted out of the element loop (a per-LAYER scalar), so
        // the crossfade can overshoot 1.0 and settle. On settle the spring clears
        // and the read falls back to the constant (byte-unchanged when no spring).
        const w = layer.weightSpring?.value ?? layer.weight;
        for (const key in values) {
            if (onlySet && !onlySet.has(key)) continue;
            if (whitelist && !whitelist.has(key)) continue;
            const incoming = values[key];
            if (incoming === undefined) continue;
            const existing = groupedValues[key];
            if (Array.isArray(existing) && Array.isArray(incoming)) {
                const n = Math.min(existing.length, incoming.length);
                for (let i = 0; i < n; i++) {
                    if (isNumericUnit(existing[i]) && isNumericUnit(incoming[i])) {
                        existing[i].value = lerp(
                            existing[i].value,
                            incoming[i].value,
                            w,
                        );
                    } else {
                        existing[i] = incoming[i];
                    }
                }
            } else {
                groupedValues[key] = incoming;
            }
        }
    }

    /**
     * P.W2 — the SoA fold for ONE `add`/`weighted` layer (the validated 3.7×,
     * `scripts/group-soa-decision.json`: weighted 3.66×, add 3.69×, bit-identical
     * `maxErr=0`). Replaces the boxed `for..in` + `Array.isArray` + per-element
     * `isNumericUnit` dispatch with a contiguous {@link Float64Array} fold over the
     * plan's precomputed numeric `(carrier, incoming)` pairs: seed `_compositeBuf`
     * from each carrier, apply the op against the incoming, write back. The carrier
     * units are the SAME `ValueUnit`s a lower layer parked in `_grouped` (the refs
     * are frame-stable — `interpFrames` mutates `.value` in place), so writing the
     * folded result back to `carrier.value` mutates the live composite exactly as
     * the boxed arm did. The `add` accumulate is naturally UN-CLAMPED; the
     * `weighted` lerp reads ONE per-layer `w` (the K.W11 PHYS-C spring weight).
     */
    private soaBlendLayer(plan: SoALayerPlan): void {
        const { carriers, incomings } = plan;
        const n = carriers.length;
        if (n === 0) return;
        const buf = this._compositeBuf!;
        // Seed from the live carriers (the lower layers' freshly-lerped `.value`).
        for (let s = 0; s < n; s++) buf[s] = carriers[s]!.value;
        if (plan.weighted) {
            // ONE per-LAYER weight (the spring overshoot or the constant) — the
            // exact `?? layer.weight` read the boxed weighted arm hoists.
            const w = plan.layer.weightSpring?.value ?? plan.layer.weight;
            for (let s = 0; s < n; s++) {
                buf[s] = lerp(buf[s]!, incomings[s]!.value, w);
            }
        } else {
            // UN-CLAMPED accumulate — a Float64 `+=` is naturally un-clamped, the
            // GL-6 `0.8 + 0.8 → 1.6` contract preserved by construction.
            for (let s = 0; s < n; s++) buf[s] = buf[s]! + incomings[s]!.value;
        }
        // Write the folded result back to the carrier units (the live composite).
        for (let s = 0; s < n; s++) carriers[s]!.value = buf[s]!;
    }

    /**
     * P.W2 — build the SoA fold layout for every `add`/`weighted` layer (rebuilt
     * ONLY on a structural change, gated by the `_groupedKeys` dirty seam). A
     * NON-destructive carrier-resolution walk in zIndex order mirrors the boxed
     * blend's carrier semantics EXACTLY: `replace` (and the non-array first-touch
     * fall-through) parks a key's leaf as its carrier; `add`/`weighted` over an
     * array carrier blend the numeric elements in place. For each `add`/`weighted`
     * layer, the pure-numeric `(carrier, incoming)` element pairs (carrier IS an
     * array, both elements numeric) are extracted into the flat `carriers`/
     * `incomings` arrays the fold loops; every other key it touches (non-array
     * carrier, or ANY non-numeric / mixed element) is recorded in `boxedKeys` for
     * the boxed residual. `_compositeBuf` is grown to the widest layer's numeric
     * width ONCE (reused across layers and frames — zero per-frame alloc). The
     * walk mutates NOTHING (it reads `.value` only to classify, never writes), so
     * the building frame's already-computed composite is untouched.
     */
    private buildSoAPlans(entries: AnimationGroupEntry<V>[]): SoALayerPlan[] {
        const plans: SoALayerPlan[] = [];
        // The carrier each key currently resolves to (the leaf a lower layer
        // parked) — mirrors `_grouped`'s per-key carrier at this point in the pass.
        const carrierOf: Record<string, unknown> = {};
        let maxWidth = 0;

        for (const entry of entries) {
            const { layer, values } = entry;
            if (!layer.enabled) continue;
            const whitelist = layer.properties;
            const weighted = layer.blendMode === "weighted";

            if (layer.blendMode === "replace") {
                for (const key in values) {
                    if (whitelist && !whitelist.has(key)) continue;
                    const incoming = values[key];
                    if (incoming === undefined) continue;
                    carrierOf[key] = incoming;
                }
                continue;
            }

            // `add` / `weighted` — partition this layer's keys into the numeric
            // SoA pairs and the boxed residual, mirroring the boxed arm's guards.
            const carriers: ValueUnit<number>[] = [];
            const incomings: ValueUnit<number>[] = [];
            const boxedKeys: string[] = [];
            for (const key in values) {
                if (whitelist && !whitelist.has(key)) continue;
                const incoming = values[key];
                if (incoming === undefined) continue;
                const existing = carrierOf[key];
                if (Array.isArray(existing) && Array.isArray(incoming)) {
                    const n = Math.min(existing.length, incoming.length);
                    // A key goes to SoA ONLY if EVERY blended element (the first
                    // `n`) is a numeric pair — a mixed leaf goes ENTIRELY to the
                    // boxed residual (never split across both paths, which would
                    // double-blend the numeric elements). The K3 partition
                    // discipline: pure-numeric → SoA, anything else → boxed.
                    let allNumeric = true;
                    for (let i = 0; i < n; i++) {
                        if (
                            !isNumericUnit(existing[i]) ||
                            !isNumericUnit(incoming[i])
                        ) {
                            allNumeric = false;
                            break;
                        }
                    }
                    if (allNumeric) {
                        for (let i = 0; i < n; i++) {
                            carriers.push(existing[i] as ValueUnit<number>);
                            incomings.push(incoming[i] as ValueUnit<number>);
                        }
                    } else {
                        boxedKeys.push(key);
                    }
                    // The carrier identity is unchanged by an in-place blend, so
                    // `carrierOf[key]` stays the array `existing`.
                } else {
                    // Non-array carrier (first-touch / scalar) — the boxed arm
                    // assigns `groupedValues[key] = incoming`; record the key for
                    // the residual AND update the resolved carrier so a HIGHER
                    // add/weighted layer sees the same carrier the boxed pass would.
                    boxedKeys.push(key);
                    carrierOf[key] = incoming;
                }
            }

            if (carriers.length > maxWidth) maxWidth = carriers.length;
            plans.push({
                layer,
                weighted,
                carriers,
                incomings,
                boxedKeys,
            });
        }

        // Grow the shared fold scratch to the widest layer's numeric width ONCE
        // (reused across every layer AND every frame — the F.W4 zero-alloc
        // discipline: NO per-frame `Float64Array` allocation).
        if (
            maxWidth > 0 &&
            (this._compositeBuf === null || this._compositeBuf.length < maxWidth)
        ) {
            this._compositeBuf = new Float64Array(maxWidth);
        }

        return plans;
    }

    /**
     * Render the current composition as a static frame at each child's current
     * `t`. Single-target groups go through the blended transform; multi-target
     * groups apply each child's interpolated vars to its own targets. The public
     * entry point for state mutated outside the rAF loop (scrubbing, state
     * restore, pause snapshots) that needs the visual to update immediately.
     */
    render(): void {
        const now = this.lastTickTime || performance.now();
        if (this.singleTarget) {
            this.transformFramesGrouped(now);
        } else {
            renderMultiTarget(this.getEntries());
        }
    }

    /**
     * Set a child animation's current time without touching its siblings.
     * Updates `pausedTime` so the child resumes correctly from the scrub
     * position. Chainable; call `render()` afterwards to reflect it visually.
     */
    setChildTime(nameOrAnim: string | Animation<V>, t: number) {
        const entry = requireEntry(this.animations, nameOrAnim, "setChildTime");
        const anim = entry.animation;
        anim.t = t;
        if (anim.startTime !== undefined) {
            anim.pausedTime = anim.startTime + t;
        }
        return this;
    }

    // ── Playback loop ────────────────────────────────────────────────

    /**
     * Advance all child animations to absolute clock `t`. SYNC on the steady
     * path (J.W6 S1): children that all step synchronously advance the group
     * with no per-frame `Promise.all`/microtask hop; a thenable only on a
     * genuinely-async child or the over-`YIELD_BATCH` yield path.
     */
    advanceTo(t: number): this | Promise<this> {
        // K.W11 PHYS-C — advance any spring-driven layer weights by the frame
        // delta BEFORE updating `lastTickTime`. A first tick has `lastTickTime
        // === 0`, so clamp the delta to 0 — a layer spring never takes one giant
        // first step (it integrates from the next real frame).
        const dt = this.lastTickTime === 0 ? 0 : t - this.lastTickTime;
        if (this._hasLayerSprings) this.advanceLayerSprings(dt);

        this.lastTickTime = t;
        if (!this.started) this.onStart();

        // The slice fan-out + the over-`YIELD_BATCH` batched advance are pure
        // functions in `./group-layer-springs`; `advanceSlice` returns
        // `undefined` on the all-sync fast path (J.W6 S1 — zero microtask).
        const entries = this.getEntries();
        const BATCH = AnimationGroup.YIELD_BATCH;
        const pending =
            entries.length <= BATCH
                ? advanceSlice(entries, t)
                : advanceBatched(entries, t, BATCH);
        return pending
            ? pending.then(() => this._endAdvance())
            : this._endAdvance();
    }

    /** The post-advance tail — `onEnd` once the render marked done. */
    private _endAdvance(): this {
        if (this.done) this.onEnd();
        return this;
    }

    /**
     * One frame of the group's draw loop (driven by `RAFPlayback.loop`): ticks
     * all children, then renders (single-target: grouped blending; multi-target:
     * per-child). Returns whether the loop should continue.
     */
    private _frame(t: number): boolean | Promise<boolean> {
        const advanced = this.advanceTo(t);
        return typeof (advanced as Promise<this>).then === "function"
            ? (advanced as Promise<this>).then(() => this._renderFrame(t))
            : this._renderFrame(t);
    }

    /** The post-advance render half of `_frame` — composite, or settle. */
    private _renderFrame(t: number): boolean {
        if (this.paused) {
            return false;
        }

        if (this.singleTarget) {
            this.transformFramesGrouped(t);
        } else {
            this.done = renderMultiTarget(this.getEntries());
        }

        if (!this.done) {
            return true;
        }

        // Completion: every child's `onEnd` already painted its rest frame per
        // its fill contract and the composite above rendered the blended result,
        // so settle is pure teardown, never a repaint (the rest-position
        // contract — a completion `reset()` would repaint frame 0, ending a
        // fadeIn group invisible).
        this.settle();
        this._resolvePlay();
        return false;
    }

    private _resolvePlay() {
        const resolve = this.resolvePromise;
        this.resolvePromise = null;
        resolve?.();
    }

    /**
     * The completion front-door (G.W13) — `await group.finished` resolves once
     * the in-flight composite play settles. Exposes the ONE held
     * `_playingPromise` `play()` constructs (the re-entrant guard returns it;
     * the `finally`-clear nulls it on settle) — NOT a second completion
     * lifecycle. A settled (or never-played) group resolves immediately.
     */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
    }

    /**
     * Start the animation group. Resolves when all children complete (or on
     * explicit stop/reset). Re-entrant: a `play()` while one is in flight
     * returns the same promise rather than leaking a second draw loop. Under
     * `respectReducedMotion` + an active query, snaps every child to its final
     * frame in a single composite (no rAF loop), then settles as a completed
     * play would.
     */
    async play(): Promise<void> {
        if (this._playingPromise) return this._playingPromise;

        const result = withReducedMotion(
            this.respectReducedMotion,
            () => this._playReducedMotion(),
            () =>
                new Promise<void>((resolve) => {
                    this.resolvePromise = resolve;
                    this.playback.loop(this._boundFrame);
                }),
        );

        this._playingPromise = result;
        result.finally(() => {
            this._playingPromise = null;
        });
        return result;
    }

    /**
     * `prefers-reduced-motion` snap: rest = final, paint it, settle — the SAME
     * terminal path a completed play takes, motion elided. Every child advances
     * to its final frame, one composite paints, `settle()` readies the group for
     * replay (final frame stays on the target(s), matching `Animation`'s snap).
     */
    private _playReducedMotion(): Promise<void> {
        this.onStart();
        const now = this.lastTickTime || performance.now();
        this.lastTickTime = now;

        // Snap every child to its final frame, then composite one final paint.
        snapChildrenToFinal(this.getEntries());
        if (this.singleTarget) {
            this.transformFramesGrouped(now);
        }

        this.settle();

        return Promise.resolve();
    }

    // ── The managed-child lifecycle contract (full statement in
    // src/animation/CLAUDE.md → AnimationGroup → "Managed-child lifecycle").
    // A managed child (`managed = true`) is loop-owned by the group: it throws
    // on direct `play()`; `pause()` records the last rAF clock on each child's
    // `pausedTime` so `resume()` adjusts `startTime` jump-free; `resume()`
    // un-pauses children DIRECTLY (never `child.resume()`, which would race the
    // draw loop); `settle()` releases the child (`managed = false`).

    /**
     * Pause the group — idempotent. Pausing an already-paused (or
     * not-yet-started) group is a no-op, NOT a resume (use {@link toggle} for
     * the explicit flip). Cancels the rAF loop immediately and renders a
     * final-frame snapshot so the visual matches the exact pause moment.
     */
    pause() {
        if (!this.started || this.paused) return this;

        this.paused = true;
        const now = this.lastTickTime || performance.now();

        // Propagate the pause to every child, recording the last rAF timestamp
        // (not performance.now()) so resume adjusts startTime jump-free.
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            anim.pause();
            if (anim.pausedTime === 0) {
                anim.pausedTime = now;
            }
        }

        this.playback.stop();
        this.render();

        return this;
    }

    /**
     * Resume the group — idempotent. Unpauses every child DIRECTLY (not via
     * `child.resume()`, which would start each child's own rAF loop — the
     * group's draw loop owns the ticking) and re-registers that loop.
     */
    resume() {
        if (!this.started || !this.paused) return this;

        this.paused = false;
        setChildrenPaused(this.getEntries(), false);

        this.playback.loop(this._boundFrame);

        return this;
    }

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return this.paused ? this.resume() : this.pause();
    }

    /**
     * Pure state teardown — never paints. Releases every child
     * (`managed = false`, `child.settle()`) and clears the group's playback
     * flags. Completion and the reduced-motion snap both end here, leaving the
     * rest frame on the target(s).
     */
    settle() {
        for (const entry of this.getEntries()) {
            entry.animation.managed = false;
            entry.animation.settle();
        }

        this.started = false;
        this.done = false;
        this.paused = false;
        this.lastTickTime = 0;

        return this;
    }

    /**
     * Explicit rewind: paint every started child back to its INITIAL frame, then
     * settle — the user-facing "return to start". Completion does NOT come here
     * (it settles where the fill contract rested the pixels).
     */
    reset() {
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (anim.started && anim.frames.length > 0) {
                anim.interpFrames(0, true);
            }
        }

        return this.settle();
    }

    /**
     * Halt the draw loop, rewind to the initial frame (the transport-stop
     * semantic the demo's controls expect), and resolve any pending `play()`.
     */
    stop() {
        this.playback.stop();
        this.reset();
        this._resolvePlay();

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    forcePause() {
        this.paused = true;
        setChildrenPaused(this.getEntries(), true);
    }

    forcePlay() {
        this.paused = false;
        setChildrenPaused(this.getEntries(), false);
    }

    // ── Layer management API ─────────────────────────────────────────

    /**
     * Set layer config for an animation by name or reference. Chainable; throws
     * on an unregistered key (silent no-ops were hiding consumer bugs).
     */
    setLayerConfig(
        nameOrAnim: string | Animation<V>,
        config: Partial<AnimationLayerConfig>,
    ) {
        const entry = requireEntry(
            this.animations,
            nameOrAnim,
            "setLayerConfig",
        );
        Object.assign(entry.layer, config);
        this.invalidateEntries();
        return this;
    }

    /** Convenience toggle for enabling/disabling a layer. Chainable. */
    setLayerEnabled(nameOrAnim: string | Animation<V>, enabled: boolean) {
        return this.setLayerConfig(nameOrAnim, { enabled });
    }

    /** Read the layer config for an animation by name or reference. */
    getLayerConfig(
        nameOrAnim: string | Animation<V>,
    ): AnimationLayerConfig | undefined {
        return this.animations[resolveEntryKey(nameOrAnim)]?.layer;
    }

    // ── Spring-driven blend weight (K.W11 PHYS-C) ────────────────────────
    // The CONSTRUCTION + shared name↔reference lookup live in
    // `./group-layer-springs` (INTERNAL). The gate-anchored composite STATEMENTS
    // (`existing.target`, `layer.weightSpring = spring`, the per-frame
    // `spring.tickDt(dt)`, the settle commit/clear) stay inline —
    // proof:spring-blend-weight locks the composite contract ON this seam.

    /**
     * Spring a layer's blend `weight` from its CURRENT value to `weight` (K.W11
     * PHYS-C — the spring-driven crossfade). Seeds a `SpringProgress` (via
     * `seedLayerSpring`), parks it on `layer.weightSpring`, and forces
     * `blendMode` to `weighted`. A re-target mid-flight RE-SEATS the in-flight
     * spring from its live `(value, velocity)` (`set target`) — no kink. Full
     * trajectory documentation in `./group-layer-springs`. Chainable.
     */
    transitionLayer(
        nameOrAnim: string | Animation<V>,
        target: { weight: number; spring?: LayerTransitionSpring },
    ): this {
        const entry = requireEntry(
            this.animations,
            nameOrAnim,
            "transitionLayer",
        );
        const layer = entry.layer;
        layer.blendMode = "weighted";

        const existing = layer.weightSpring;
        if (existing instanceof SpringProgress) {
            // Re-seat the in-flight spring from its live (value, velocity) —
            // velocity-continuous, no kink. `set target` does the re-seat.
            existing.target = target.weight;
        } else {
            // Seed a fresh spring at the layer's current weight, then park it.
            const spring = seedLayerSpring(
                layer.weight,
                target.weight,
                target.spring,
            );
            layer.weightSpring = spring;
        }

        this._hasLayerSprings = true;
        this.invalidateEntries();
        return this;
    }

    /**
     * Physically crossfade between two layers (K.W11 PHYS-C): spring layer `a`
     * down to weight `0` and layer `b` up to weight `1`, each over its own
     * `SpringProgress`. Two `transitionLayer` calls — the flagship demo moment, a
     * crossfade that overshoots and settles. Chainable.
     */
    crossfade(
        a: string | Animation<V>,
        b: string | Animation<V>,
        options?: { spring?: LayerTransitionSpring },
    ): this {
        const spring = options?.spring;
        this.transitionLayer(a, { weight: 0, ...(spring ? { spring } : {}) });
        this.transitionLayer(b, { weight: 1, ...(spring ? { spring } : {}) });
        return this;
    }

    /**
     * Advance every spring-driven layer weight by the frame delta `dt` ms (K.W11
     * PHYS-C). Called from `advanceTo` ONLY when `_hasLayerSprings` is true, so
     * the constant-weight path pays nothing. On settle the converged value
     * commits to the constant `layer.weight` and the spring is CLEARED — the
     * `weighted` leaf's `?? layer.weight` read then serves the constant.
     */
    private advanceLayerSprings(dt: number): void {
        let anyActive = false;
        for (const entry of this.getEntries()) {
            const spring = entry.layer.weightSpring;
            if (spring === undefined) continue;
            if (dt > 0) spring.tickDt(dt);
            if (spring.settled) {
                // Commit the converged value to the constant weight, then drop
                // the spring so the read falls back to it (`delete`, not
                // `= undefined`, under `exactOptionalPropertyTypes`).
                entry.layer.weight = spring.value;
                delete entry.layer.weightSpring;
            } else {
                anyActive = true;
            }
        }
        this._hasLayerSprings = anyActive;
    }
}
