/**
 * `group/compositor.ts` — the single-target composite engine (R.W2 — lib-group:
 * the `transformFramesGrouped` (146L) + `boxedBlendArm` (70L) carve the spec §4
 * names). Free functions over the concrete `AnimationGroup` — the same DI
 * pattern the engine's `./playback`/`./interpolate` carve uses — so the class
 * keeps a thin `transformFramesGrouped` delegate while its body lands under the
 * decomposition ceiling. The per-frame composite buffer + SoA plan state
 * (`_grouped`/`_groupedKeys`/`_soaPlans`/`_compositeBuf`) stay instance state on
 * the group; these functions read/write them directly.
 *
 * The gate-anchored blend STATEMENTS follow the code to this new home (R.W2 — the
 * "gate follows code" co-edit): proof:blend's in-place-blend / array-guard /
 * min-loops, proof:spring-blend-weight's `phys-c-read`, and the SoA identity
 * test's fold-taken assertion all exercise THIS module's leaf contract (the
 * `Array.isArray` guard, the `Math.min` loop, the `isNumericUnit` per-element
 * guard, the un-clamped `+=`, the spring-weighted `lerp`, the
 * `groupSoABlendLayer` fold + `_compositeBuf`/`buildSoAPlans`/`_soaPlans`).
 */
import { lerp, type ValueUnit } from "@mkbabb/value.js";
import { NOOP_TRANSFORM } from "../constants";
import type { AnimationLayerConfig, Vars } from "../constants";
import { computeGroupedKeys } from "./entries";
import {
    buildSoAPlans,
    groupSoABlendLayer,
    isNumericUnit,
    isCompatibleNumericUnit,
} from "./soa";
import { buildPlainProjection, refreshPlainProjection } from "../compile/plain-vars";
import type { AnimationGroup } from "./group";
import type { CompositeState } from "./composite-state";
import {
    isWeightedBlend,
    resolveBlendOperator,
    resolveBlendWeight,
} from "./weight";

/**
 * Composite all animation values into a single grouped transform (per-frame for
 * single-target groups). Applies layer blending (replace / add / weighted) in
 * zIndex order, then calls the group transform with the merged values. Each
 * child's values refresh in place (`interpFrames` clears and rewrites the
 * long-lived buffer), so no stale keys leak and no fresh object is allocated per
 * entry per frame.
 */
export function compositeFrame<V extends Vars>(
    group: AnimationGroup<V>,
    t: number,
): Record<string, unknown> {
    // Reuse the long-lived composite buffer, cleared in place (the zero-alloc
    // idiom `interpFrames` uses for its `out` buffer) — no fresh object/frame.
    const groupedValues = group._grouped;
    if (group._groupedKeysDirty) {
        // The compile-stable key UNION (whitelist-filtered) — recomputed only on
        // a structural change, never per frame (fold in `./entries`).
        group._groupedKeys = computeGroupedKeys(group.getEntries());
        group._compositeState.configure(group._groupedKeys);
        group._groupedKeysDirty = false;
        // P.W2 — drop the SoA plan; it is rebuilt lazily on the next frame (once
        // each child's `entry.values` is populated, so the carrier + incoming
        // refs can be captured). A structural change invalidates the captured
        // refs, so the rebuild is gated on the SAME dirty seam.
        group._soaPlans = null;
        // T.A6 — the PLAIN projection caches the `_grouped` leaf refs a structural
        // change likewise invalidates; drop it on the SAME seam (rebuilt lazily
        // once `_grouped` is populated below).
        group._plainProj = null;
    }

    // F.W4 S2 — stable-key null-fill clear (NO `delete`: the delete-loop trapped
    // `_grouped` in V8 dictionary mode). Inactive keys read back `undefined`; the
    // blend skips them and the post-blend compaction drops any uncontributed key.
    const groupedKeys = group._groupedKeys;
    group._compositeState.clear();

    const entries = group.getEntries();

    // P.W2 — the SoA fold (the validated 3.7×) takes over ONLY once the plan is
    // built. The plan needs each child's `entry.values` populated (the carrier +
    // incoming refs to capture), so the FIRST frame after a structural change
    // runs the boxed path AND builds the plan; subsequent frames fold numeric
    // pairs through `_compositeBuf`. A group with NO `add`/`weighted` layer builds
    // an empty plan list (the `replace` default is dispatch-free), so the fast
    // path is byte-unchanged.
    const useSoA = group._soaPlans !== null;
    let soaIdx = 0;

    let done = true;
    for (const groupObject of entries) {
        const { animation, layer, values } = groupObject;

        done = done && animation.done;

        if (!layer.enabled) continue;

        // Refresh in place — `interpFrames` resets `values` before writing, so a
        // scrubbed child's fresh state is always reflected.
        animation.interpFrames(
            animation.t,
            false,
            values as Record<string, ValueUnit[]>,
        );

        // The whitelist is an INLINE key-skip — no `filteredValues` object; each
        // blend arm walks `values` with `for..in` (allocation-free).
        const whitelist = layer.properties;

        const op = resolveBlendOperator(layer);
        const weighted = isWeightedBlend(layer);
        if (op === "replace" && !weighted) {
            // The DEFAULT arm — a bare reference-assign (z-order last-writer-wins).
            // Already dispatch-free; UNTOUCHED by the SoA transposition.
            for (const key in values) {
                if (whitelist && !whitelist.has(key)) continue;
                const incoming = values[key];
                if (incoming === undefined) continue;
                group._compositeState.copy(key, incoming);
            }
            continue;
        }

        // `add` / `accumulate` / weighted alias — the non-default boxed-AoS arms
        // the SoA fold targets. `accumulate` is additive at group scope; repeat
        // stacking remains owned by the per-animation engine operator.
        // When the plan is built, fold the pure-numeric pairs through
        // `_compositeBuf` (`groupSoABlendLayer`, called DIRECTLY), then run the
        // boxed path ONLY over the residual (non-numeric / mixed / first-touch)
        // keys — empty for the dominant all-numeric shape, so the whole `for..in`
        // collapses to the fold. On the plan-build frame `useSoA` is false: the
        // boxed path runs whole (and records the carriers the next frame captures).
        if (useSoA) {
            const plan = group._soaPlans![soaIdx++]!;
            groupSoABlendLayer(group._compositeBuf!, plan);
            if (plan.boxedKeys.size > 0) {
                boxedBlendArm(layer, values, groupedValues, whitelist, plan.boxedKeys, group._compositeState);
            }
        } else {
            boxedBlendArm(layer, values, groupedValues, whitelist, undefined, group._compositeState);
        }
    }

    // Build the SoA plan once `entry.values` is populated (this frame's boxed pass
    // established the carriers) — captured for every subsequent frame.
    // `buildSoAPlans` (INTERNAL, `./soa`) grows the shared scratch and returns it
    // alongside the plans; re-park both as instance state.
    if (!useSoA) {
        const { plans, compositeBuf } = buildSoAPlans(
            entries,
            group._compositeBuf,
            groupedValues,
        );
        group._soaPlans = plans;
        group._compositeBuf = compositeBuf;
    }

    group.done = done;

    // Drop any key NO enabled child contributed this frame so the transform never
    // serializes an `undefined`. In the common case this deletes nothing, so
    // `_grouped` stays in fast-properties mode (delete-free, zero-alloc).
    group._compositeState.pruneInactive();

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
    // each frame — so the amiga group rides the SoA blend onto ONE plain-vars
    // adapter (T.A7) with no array-boxed leaves reaching the mesh. The DOM-style
    // default renderer keeps the FLAT `_grouped` map, byte-unchanged.
    if (group.unflatten) {
        let proj = group._plainProj;
        if (proj === null) {
            proj = buildPlainProjection(
                groupedValues as Record<string, ValueUnit[] | undefined>,
            );
            group._plainProj = proj;
        } else {
            refreshPlainProjection(proj);
        }
        group.transform(proj.root as V, t);
    } else {
        group.transform(groupedValues as V, t);
    }

    return groupedValues;
}

/**
 * The boxed `add`/`weighted` blend arm — the per-element AoS path that the SoA
 * fold (`groupSoABlendLayer`) supplants for the pure-numeric majority. Kept as
 * THE blend implementation for two roles: (1) the plan-build frame (every key,
 * `only === undefined`) — it establishes the carriers `buildSoAPlans` then
 * captures; (2) the per-frame residual (the plan's `boxedKeys` — non-numeric /
 * mixed / first-touch leaves the fold cannot cover, typically empty). Both arms
 * guard on `Array.isArray(existing) && Array.isArray(incoming)` and loop
 * `Math.min(existing.length, incoming.length)` elements with a per-element
 * `isNumericUnit` guard — the byte-exact G.W17 leaf contract (proof:blend),
 * un-clamped `add` (`+=`), spring-weighted `lerp`. A non-array carrier (or a
 * skipped key) falls through to `groupedValues[key] = incoming`.
 *
 * S.F5a S1 — `only` is the plan's PRECOMPUTED `boxedKeys` Set (built once at
 * `buildSoAPlans`), taken DIRECTLY as the membership test — NO per-frame
 * `new Set(only)` (the retired allocation on the mixed-leaf hot path,
 * `proof:zero-alloc` mixed-leaf clause). `undefined` on the plan-build frame
 * (every key runs).
 */
export function boxedBlendArm(
    layer: AnimationLayerConfig,
    values: Record<string, unknown>,
    groupedValues: Record<string, unknown>,
    whitelist: Set<string> | undefined,
    only?: ReadonlySet<string>,
    state?: CompositeState,
): void {
    const op = resolveBlendOperator(layer);
    if (op === "add" || op === "accumulate") {
        // Accumulate each numeric leaf element in place (the leaf is a
        // `ValueUnit[]` — scalar = length 1, multi-component = N). Numeric add is
        // UN-CLAMPED (CSS `animation-composition: add` clamps at use, not
        // composition) — `0.8 + 0.8 → 1.6`.
        for (const key in values) {
            if (only && !only.has(key)) continue;
            if (whitelist && !whitelist.has(key)) continue;
            const incoming = values[key];
            if (incoming === undefined) continue;
            const existing = groupedValues[key];
            if (Array.isArray(existing) && Array.isArray(incoming)) {
                const n = Math.min(existing.length, incoming.length);
                let unitMismatch = false;
                for (let i = 0; i < n; i++) {
                    if (
                        isNumericUnit(existing[i]) &&
                        isNumericUnit(incoming[i]) &&
                        existing[i].unit !== incoming[i].unit
                    ) {
                        unitMismatch = true;
                        break;
                    }
                }
                if (unitMismatch) {
                    // A numeric unit pair with different CSS units has no
                    // faithful sum (10px + 50% is not 60px). Refuse the
                    // composite explicitly by replacing the whole leaf.
                    if (state) state.copy(key, incoming);
                    else groupedValues[key] = incoming;
                    continue;
                }
                for (let i = 0; i < n; i++) {
                    if (isCompatibleNumericUnit(existing[i], incoming[i])) {
                        existing[i].value += incoming[i].value;
                    } else {
                        existing[i] = incoming[i];
                    }
                }
            } else {
                if (state) state.copy(key, incoming);
                else groupedValues[key] = incoming;
            }
        }
        return;
    }

    // `weighted` — lerp each numeric leaf element toward the incoming value by
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
        if (Array.isArray(existing) && Array.isArray(incoming)) {
            const n = Math.min(existing.length, incoming.length);
            let unitMismatch = false;
            for (let i = 0; i < n; i++) {
                if (
                    isNumericUnit(existing[i]) &&
                    isNumericUnit(incoming[i]) &&
                    existing[i].unit !== incoming[i].unit
                ) {
                    unitMismatch = true;
                    break;
                }
            }
            if (unitMismatch) {
                if (state) state.copy(key, incoming);
                else groupedValues[key] = incoming;
                continue;
            }
            for (let i = 0; i < n; i++) {
                if (isCompatibleNumericUnit(existing[i], incoming[i])) {
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
            if (state) {
                const owned = state.copy(key, incoming);
                // A weighted layer may be the bottom/lone contributor. Its
                // weight still applies against the numeric additive identity
                // (zero); the historical reference assignment silently dropped
                // that weight. Non-numeric leaves intentionally replace-fallback.
                if (Array.isArray(owned) && owned.every(isNumericUnit)) {
                    for (const unit of owned) unit.value = lerp(0, unit.value, w);
                }
            } else {
                groupedValues[key] = incoming;
            }
        }
    }
}
