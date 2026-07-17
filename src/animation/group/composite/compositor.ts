/**
 * `group/composite/compositor.ts` — the single-target composite engine (R.W2 — lib-group:
 * the `transformFramesGrouped` (146L) + `residualBlendArm` (70L) carve the spec §4
 * names). Free functions over the concrete `AnimationGroup` — the same DI
 * pattern the engine's `./playback`/`./interpolate` carve uses — so the class
 * keeps a thin `transformFramesGrouped` delegate while its body lands under the
 * decomposition ceiling. The per-frame composite buffer, key cache, plans, and
 * scratch stay in one private group store passed explicitly to this fold.
 *
 * The gate-anchored blend STATEMENTS follow the code to this new home (R.W2 — the
 * "gate follows code" co-edit): proof:blend's in-place-blend / array-guard /
 * min-loops, proof:spring-blend-weight's `phys-c-read`, and the SoA identity
 * test's fold-taken assertion all exercise THIS module's leaf contract (the
 * `Array.isArray` guard, the `Math.min` loop, the `isNumericUnit` per-element
 * guard, the un-clamped `+=`, the spring-weightBlend `lerp`, the
 * `groupSoABlendLayer` fold + shared scratch / `buildSoAPlans` / cached plans).
 */
import { lerp } from "@mkbabb/value.js/math";
import { NOOP_TRANSFORM } from "../../constants";
import type { AnimationLayerConfig, Vars } from "../../constants";
import {
    buildNestedAuthoredSink,
    refreshNestedAuthoredSink,
    type FlatAuthoredValues,
    type NestedAuthoredSink,
} from "../../compile/value";
import { computeGroupedKeys } from "../entries";
import {
    buildSoAPlans,
    groupSoABlendLayer,
    isNumericAuthoredValue,
} from "../soa";
import type { AnimationGroup } from "../group";
import type { CompositeState } from "./state";
import type { GroupCompositeStorage } from "./storage";
import {
    isWeightBlend,
    resolveBlendWeight,
} from "../weight";

const nestedSinks = new WeakMap<object, NestedAuthoredSink<any>>();

/**
 * Composite all animation values into a single grouped transform (per-frame for
 * single-target groups). Applies layer blending (replace / add / weightBlend) in
 * zIndex order, then calls the group transform with the merged values. Each
 * child's values refresh in place (`interpFrames` clears and rewrites the
 * long-lived buffer), so no stale keys leak and no fresh object is allocated per
 * entry per frame.
 */
export function compositeFrame<V extends Vars>(
    group: AnimationGroup<V>,
    state: GroupCompositeStorage,
    t: number,
): FlatAuthoredValues {
    // Reuse the long-lived composite buffer, cleared in place (the zero-alloc
    // idiom `interpFrames` uses for its `out` buffer) — no fresh object/frame.
    const groupedValues = state.grouped;
    if (state.groupedKeysDirty) {
        // The compile-stable key UNION (whitelist-filtered) — recomputed only on
        // a structural change, never per frame (fold in `./entries`).
        state.groupedKeys = computeGroupedKeys(group.getEntries());
        state.compositeState.configure(state.groupedKeys);
        state.groupedKeysDirty = false;
        // P.W2 — drop the SoA plan; it is rebuilt lazily on the next frame (once
        // each child's `entry.values` is populated, so the carrier + incoming
        // refs can be captured). A structural change invalidates the captured
        // refs, so the rebuild is gated on the SAME dirty seam.
        state.soaPlans = null;
        // T.A6 — the PLAIN projection caches the `_grouped` leaf refs a structural
        // change likewise invalidates; drop it on the SAME seam (rebuilt lazily
        // once `_grouped` is populated below).
        nestedSinks.delete(group);
    }

    // F.W4 S2 — stable-key null-fill clear (NO `delete`: the delete-loop trapped
    // `_grouped` in V8 dictionary mode). Inactive keys read back `undefined`; the
    // blend skips them and the post-blend compaction drops any uncontributed key.
    const groupedKeys = state.groupedKeys;
    state.compositeState.clear();

    const entries = group.getEntries();

    // P.W2 — the SoA fold (the validated 3.7×) takes over ONLY once the plan is
    // built. The plan needs each child's `entry.values` populated (the carrier +
    // incoming refs to capture), so the FIRST frame after a structural change
    // runs the residual path AND builds the plan; subsequent frames fold numeric
    // pairs through `_compositeBuf`. A group with NO `add`/`weightBlend` layer builds
    // an empty plan list (the `replace` default is dispatch-free), so the fast
    // path is byte-unchanged.
    const useSoA = state.soaPlans !== null;
    let soaIdx = 0;

    let done = true;
    for (const groupObject of entries) {
        const { animation, layer, values } = groupObject;

        done = done && animation.done;

        if (!layer.enabled) continue;

        // Refresh in place — `interpFrames` resets `values` before writing, so a
        // scrubbed child's fresh state is always reflected.
        animation.interpFrames(animation.t, false, values);

        // The whitelist is an INLINE key-skip — no `filteredValues` object; each
        // blend arm walks `values` with `for..in` (allocation-free).
        const whitelist = layer.properties;
        for (const key in values) {
            if (whitelist && !whitelist.has(key)) continue;
            if (values[key] !== undefined) state.compositeState.mark(key);
        }

        const op = layer.op;
        const weightBlend = isWeightBlend(layer);
        if (op === "replace" && !weightBlend) {
            // The DEFAULT arm — a bare reference-assign (z-order last-writer-wins).
            // Already dispatch-free; UNTOUCHED by the SoA transposition.
            for (const key in values) {
                if (whitelist && !whitelist.has(key)) continue;
                const incoming = values[key];
                if (incoming === undefined) continue;
                state.compositeState.copy(key, incoming);
            }
            continue;
        }

        // `add` / `accumulate` / weightBlend alias — the non-default residual-AoS arms
        // the SoA fold targets. `accumulate` is additive at group scope; repeat
        // stacking remains owned by the per-animation engine operator.
        // When the plan is built, fold the pure-numeric pairs through
        // `_compositeBuf` (`groupSoABlendLayer`, called DIRECTLY), then run the
        // residual path ONLY over the residual (non-numeric / mixed / first-touch)
        // keys — empty for the dominant all-numeric shape, so the whole `for..in`
        // collapses to the fold. On the plan-build frame `useSoA` is false: the
        // residual path runs whole (and records the carriers the next frame captures).
        if (useSoA) {
            const plan = state.soaPlans![soaIdx++]!;
            groupSoABlendLayer(state.compositeBuf!, plan);
            if (plan.residualKeys.size > 0) {
                residualBlendArm(layer, values, groupedValues, whitelist, plan.residualKeys, state.compositeState);
            }
        } else {
            residualBlendArm(layer, values, groupedValues, whitelist, undefined, state.compositeState);
        }
    }

    // Build the SoA plan once `entry.values` is populated (this frame's residual pass
    // established the carriers) — captured for every subsequent frame.
    // `buildSoAPlans` (INTERNAL, `./soa`) grows the shared scratch and returns it
    // alongside the plans; re-park both as instance state.
    if (!useSoA) {
        const { plans, compositeBuf } = buildSoAPlans(
            entries,
            state.compositeBuf,
            groupedValues,
        );
        state.soaPlans = plans;
        state.compositeBuf = compositeBuf;
    }

    group.done = done;

    // Drop any key NO enabled child contributed this frame so the transform never
    // serializes an `undefined`. In the common case this deletes nothing, so
    // `_grouped` stays in fast-properties mode (delete-free, zero-alloc).
    state.compositeState.pruneInactive();

    // I.W0 S3 — lazy composite-transform resolution. A child constructed before
    // `parse()` populates its `frames` keeps `transform`'s no-op default
    // (compositing NOTHING); resolve it from the first now-parsed child the FIRST
    // time we draw a real frame. A childless group keeps the no-op (harmless).
    if (group.transform === NOOP_TRANSFORM) {
        for (const entry of group.getEntries()) {
            const frame = entry.animation.frames[0];
            if (frame != null && frame.transform != null) {
                group.transform = frame.transform;
                // T.A6 — inherit the resolved child's flatten discipline here too
                // (the constructor-time inherit is skipped for a child built
                // before its first `parse()`).
                group.unflatten = entry.animation.unflatten;
                break;
            }
        }
    }

    // T.A6 — a CUSTOM-transform group consumes the nested PLAIN authored-shape
    // projection of the composite (numbers where authored numbers, strings where
    // a unit/color demands), built lazily from `_grouped` and refreshed in place
    // each frame — so the amiga group rides the SoA blend onto one structural
    // projection with no internal slots reaching the mesh. The DOM-style
    // default renderer keeps the FLAT `_grouped` map, byte-unchanged.
    if (group.unflatten) {
        let proj = nestedSinks.get(group) as NestedAuthoredSink<V> | undefined;
        if (proj === undefined) {
            proj = buildNestedAuthoredSink<V>(groupedValues);
            nestedSinks.set(group, proj);
        } else {
            refreshNestedAuthoredSink(proj);
        }
        group.transform(proj.root, t);
    } else {
        group.transform(groupedValues as V, t);
    }

    return groupedValues;
}

/**
 * The residual `add`/`weightBlend` blend arm — the per-element AoS path that the SoA
 * fold (`groupSoABlendLayer`) supplants for the pure-numeric majority. Kept as
 * THE blend implementation for two roles: (1) the plan-build frame (every key,
 * `only === undefined`) — it establishes the carriers `buildSoAPlans` then
 * captures; (2) the per-frame residual (the plan's `residualKeys` — non-numeric
 * or first-touch authored values the numeric fold cannot cover, typically
 * empty). Numeric values add or weight directly; structural strings replace
 * honestly rather than inventing arithmetic.
 *
 * S.F5a S1 — `only` is the plan's PRECOMPUTED `residualKeys` Set (built once at
 * `buildSoAPlans`), taken DIRECTLY as the membership test — NO per-frame
 * `new Set(only)` (the retired allocation on the mixed-leaf hot path,
 * `proof:zero-alloc` mixed-leaf clause). `undefined` on the plan-build frame
 * (every key runs).
 */
export function residualBlendArm(
    layer: AnimationLayerConfig,
    values: FlatAuthoredValues,
    groupedValues: FlatAuthoredValues,
    whitelist: Set<string> | undefined,
    only?: ReadonlySet<string>,
    state?: CompositeState,
): void {
    const op = layer.op;
    if (op === "add" || op === "accumulate") {
        // Accumulate each numeric authored value in place. Numeric add is
        // UN-CLAMPED (CSS `animation-composition: add` clamps at use, not
        // composition) — `0.8 + 0.8 → 1.6`.
        for (const key in values) {
            if (only && !only.has(key)) continue;
            if (whitelist && !whitelist.has(key)) continue;
            const incoming = values[key];
            if (incoming === undefined) continue;
            const existing = groupedValues[key];
            if (isNumericAuthoredValue(existing) &&
                isNumericAuthoredValue(incoming)) {
                groupedValues[key] = existing + incoming;
            } else {
                if (state) state.copy(key, incoming);
                else groupedValues[key] = incoming;
            }
        }
        return;
    }

    // `weightBlend` — lerp each numeric leaf element toward the incoming value by
    // `w`, in place. K.W11 PHYS-C — the spring-driven blend weight: when the layer
    // carries a `weightSpring` (set by `transitionLayer`/`crossfade`), `w` is the
    // stepper's CURRENT value, not the constant `layer.weight` — ONE nullish read
    // hoisted out of the element loop (a per-LAYER scalar), so the crossfade can
    // overshoot 1.0 and settle. On settle the spring clears and the read falls
    // back to the constant (byte-unchanged when no spring).
    const w = resolveBlendWeight(layer);
    for (const key in values) {
        if (only && !only.has(key)) continue;
        if (whitelist && !whitelist.has(key)) continue;
        const incoming = values[key];
        if (incoming === undefined) continue;
        const existing = groupedValues[key];
        if (isNumericAuthoredValue(existing) &&
            isNumericAuthoredValue(incoming)) {
            groupedValues[key] = lerp(existing, incoming, w);
        } else {
            if (state) {
                const owned = state.copy(key, incoming);
                // A weightBlend layer may be the bottom/lone contributor. Its
                // weight still applies against the numeric additive identity
                // (zero); the historical reference assignment silently dropped
                // that weight. Non-numeric leaves intentionally replace-fallback.
                if (isNumericAuthoredValue(owned)) {
                    groupedValues[key] = lerp(0, owned, w);
                }
            } else {
                groupedValues[key] = incoming;
            }
        }
    }
}
