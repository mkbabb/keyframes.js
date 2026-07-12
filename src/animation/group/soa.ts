/**
 * group-soa — the P.W2 Structure-of-Arrays compositor fold, lifted off
 * `AnimationGroup` as a cohesive INTERNAL unit (NOT a barrel export). The
 * flagship perf: the `add`/`weighted` blend arms — a boxed per-element AoS loop
 * (`for..in` + `Array.isArray` + per-element `isNumericUnit` dispatch) — are
 * transposed onto a contiguous {@link Float64Array} fold over a PRECOMPUTED
 * numeric-slot layout (the validated ADOPT: bit-identical `maxErr=0` +
 * >=1.2× at K=8). The bit-identity + fold-taken oracles live in
 * `test/group/soa-composite-identity.test.ts`; the same-report ADOPT floor in
 * `bench/taxonomy.json`'s budgeted `add/weighted SoA · K=8` rows.
 *
 * Cohesion (the decomposition seam, F.W2/Q.WF2): the SoA machinery is a
 * self-contained planning+folding unit that rides the group's
 * structural-change seam (`_groupedKeysDirty`) and the per-frame fold site, but
 * has NO dependency on the managed-child lifecycle, the scheduler-yield
 * batching, or the spring-weight composite STATEMENTS that are the reason
 * `group.ts`'s remaining inline code must stay inline. Three pieces move whole:
 *   - {@link SoALayerPlan} — the precomputed per-layer fold layout (the type).
 *   - {@link buildSoAPlans} — the structural-change-time plan builder (returns
 *     the plans + the grown shared scratch buffer; the group parks both as
 *     instance state).
 *   - {@link groupSoABlendLayer} — the per-frame fold for ONE layer (takes the
 *     buffer + plan as arguments; the `AnimationGroup.soaBlendLayer` instance
 *     method stays a thin delegating wrapper; the fold-taken identity test
 *     exercises the same instance seam directly).
 *
 * The gate-anchored composite STATEMENTS the `weighted` leaf + spring seam need
 * (the `?? layer.weight` read INSIDE the boxed arm, `layer.weightSpring =
 * spring`, the per-frame `spring.tickDt(dt)`, the settle commit/clear) stay
 * INLINE in `group.ts` — proof:spring-blend-weight (+ proof:blend's element
 * loop) lock them ON that seam. This module re-reads `weightSpring?.value ??
 * weight` LIVE inside the fold (the K.W11 PHYS-C spring still drives the blend),
 * but the spring lifecycle itself never reaches here.
 *
 * value.js note: the typed `isNumericUnit` guard + `lerp` come from
 * `@mkbabb/value.js` (the real `ValueUnit` class is on the heavy side, so the
 * `instanceof` guard is exact, not structural). `group.ts` is HEAVY regardless;
 * this INTERNAL companion is never scanned by `proof:boundary` (which sweeps the
 * LIGHT barrel surface only).
 *
 * Zero-alloc discipline: `buildSoAPlans` allocates the shared scratch
 * {@link Float64Array} AT MOST once per structural change (grown only when the
 * widest layer's numeric width exceeds the current capacity); `groupSoABlendLayer`
 * allocates NOTHING per frame. The constant-shape draw path reuses one buffer
 * across every layer AND every frame (the F.W4 zero-alloc discipline,
 * proof:zero-alloc and the SoA identity test green).
 */
import { ValueUnit, lerp } from "@mkbabb/value.js";
import type { AnimationLayerConfig } from "../constants";
import type { AnimationGroupEntry } from "./types";
import { resolveBlendWeight } from "./weight";

/**
 * Typed blend-carrier guard — the group is heavy-side (it statically composes
 * the engine), so the real `ValueUnit` class is available for an `instanceof`
 * check instead of structural duck-typing on `{ value }`. Shared by the SoA
 * plan builder (here) and the boxed blend arm (still inline in `group.ts`).
 */
export const isNumericUnit = (value: unknown): value is ValueUnit<number> =>
    value instanceof ValueUnit && typeof value.value === "number";

/**
 * P.W2 — the precomputed SoA fold layout for ONE `add`/`weighted` blend layer.
 * `carriers[s]`/`incomings[s]` are the stable `ValueUnit<number>` refs the boxed
 * inner loop would have touched at slot `s` (the carrier is the leaf a lower
 * layer parked in `_grouped`; the incoming is this layer's `entry.values` leaf —
 * both alias `frame.flatVars` units whose `.value` `interpFrames` mutates in
 * place, so the refs are frame-stable). The per-frame fold seeds the composite
 * buffer from each carrier, applies the layer's op (`+=` for `add`, `lerp(...,w)`
 * for `weighted`) against the incoming, and writes back — replacing the
 * per-frame `for..in` + `Array.isArray` + per-element `isNumericUnit` dispatch
 * with a contiguous numeric loop. The `entry` is carried for the `weighted`
 * arm's per-LAYER `w = layer.weightSpring?.value ?? layer.weight` read (K.W11
 * PHYS-C).
 */
export interface SoALayerPlan {
    /**
     * The layer config — the `weighted` fold re-reads its per-frame `w =
     * weightSpring?.value ?? weight` LIVE (K.W11 PHYS-C, so a spring still drives
     * the blend), and the config is generic-independent so the plan holds it
     * without binding the group's `V`.
     */
    layer: AnimationLayerConfig;
    weighted: boolean;
    /** The pure-numeric carrier units the fold seeds the composite buffer from + writes back to. */
    carriers: ValueUnit<number>[];
    /** The incoming numeric units folded against each carrier (parallel to `carriers`). */
    incomingSlots: Array<{
        values: Record<string, unknown>;
        key: string;
        index: number;
    }>;
    /**
     * The keys this layer touches that the SoA fold does NOT cover — a non-array
     * carrier (first-touch of a key, or a scalar that a lower layer left
     * `undefined`), or a leaf with ANY non-numeric / mixed element. These keep
     * the boxed per-element path (the `Array.isArray` guard + the
     * `Math.min(existing.length, incoming.length)` element loop), so the
     * `add`/`weighted` blend stays byte-identical on the non-numeric tail. EMPTY
     * for the dominant all-numeric transform shape (every leaf a numeric
     * `ValueUnit[]`), so the whole `for..in` collapses to the SoA fold.
     *
     * S.F5a S1 — a precomputed `Set`, built ONCE here at `buildSoAPlans`
     * (structural-change time). The compositor's boxed residual (`boxedBlendArm`)
     * takes it DIRECTLY as its `only` membership test — killing the per-frame
     * `new Set(only)` the boxed arm rebuilt every frame on the mixed-leaf shape
     * (the allocation is hoisted to plan-build time, `proof:zero-alloc`
     * mixed-leaf clause).
     */
    boxedKeys: Set<string>;
}

/**
 * P.W2 — the SoA fold for ONE `add`/`weighted` layer (the validated ADOPT:
 * bit-identical `maxErr=0`, >=1.2× at K=8). Replaces the
 * boxed `for..in` + `Array.isArray` + per-element `isNumericUnit` dispatch with a
 * contiguous {@link Float64Array} fold over the plan's precomputed numeric
 * `(carrier, incoming)` pairs: seed the buffer from each carrier, apply the op
 * against the incoming, write back. The carrier units are the SAME `ValueUnit`s
 * a lower layer parked in `_grouped` (the refs are frame-stable — `interpFrames`
 * mutates `.value` in place), so writing the folded result back to
 * `carrier.value` mutates the live composite exactly as the boxed arm did. The
 * `add` accumulate is naturally UN-CLAMPED; the `weighted` lerp reads ONE
 * per-layer `w` (the K.W11 PHYS-C spring weight).
 *
 * Free function (Q.WF2): the shared scratch `buf` is passed in (the group owns
 * `_compositeBuf` as instance state); the `AnimationGroup.soaBlendLayer` method
 * stays a thin wrapper that forwards `this._compositeBuf!`.
 */
export const groupSoABlendLayer = (
    buf: Float64Array,
    plan: SoALayerPlan,
): void => {
    const { carriers, incomingSlots } = plan;
    const n = carriers.length;
    if (n === 0) return;
    // Seed from the live carriers (the lower layers' freshly-lerped `.value`).
    for (let s = 0; s < n; s++) buf[s] = carriers[s]!.value;
    if (plan.weighted) {
        // ONE per-LAYER weight (the spring overshoot or the constant) — the
        // exact `?? layer.weight` read the boxed weighted arm hoists.
        const w = resolveBlendWeight(plan.layer);
        for (let s = 0; s < n; s++) {
            const slot = incomingSlots[s]!;
            const incoming = (slot.values[slot.key] as ValueUnit<number>[])[slot.index]!;
            buf[s] = lerp(buf[s]!, incoming.value, w);
        }
    } else {
        // UN-CLAMPED accumulate — a Float64 `+=` is naturally un-clamped, the
        // GL-6 `0.8 + 0.8 → 1.6` contract preserved by construction.
        for (let s = 0; s < n; s++) {
            const slot = incomingSlots[s]!;
            const incoming = (slot.values[slot.key] as ValueUnit<number>[])[slot.index]!;
            buf[s] = buf[s]! + incoming.value;
        }
    }
    // Write the folded result back to the carrier units (the live composite).
    for (let s = 0; s < n; s++) carriers[s]!.value = buf[s]!;
};

/**
 * P.W2 — build the SoA fold layout for every `add`/`weighted` layer (rebuilt
 * ONLY on a structural change, gated by the group's `_groupedKeys` dirty seam).
 * A NON-destructive carrier-resolution walk in zIndex order mirrors the boxed
 * blend's carrier semantics EXACTLY: `replace` (and the non-array first-touch
 * fall-through) parks a key's leaf as its carrier; `add`/`weighted` over an
 * array carrier blend the numeric elements in place. For each `add`/`weighted`
 * layer, the pure-numeric `(carrier, incoming)` element pairs (carrier IS an
 * array, both elements numeric) are extracted into the flat `carriers`/
 * `incomings` arrays the fold loops; every other key it touches (non-array
 * carrier, or ANY non-numeric / mixed element) is recorded in the `boxedKeys`
 * Set for the boxed residual — precomputed HERE (once per structural change) so
 * the compositor never rebuilds a per-frame `new Set` (S.F5a S1).
 *
 * Free function (Q.WF2): the caller passes the CURRENT shared scratch buffer
 * (`prevBuf`, the group's `_compositeBuf`); the walk grows it to the widest
 * layer's numeric width ONCE (reused across layers and frames — zero per-frame
 * alloc) and returns BOTH the plans AND the (possibly grown) buffer, which the
 * group re-parks on `_compositeBuf`. The walk mutates NOTHING on the entries (it
 * reads `.value` only to classify, never writes), so the building frame's
 * already-computed composite is untouched.
 */
export const buildSoAPlans = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    prevBuf: Float64Array | null,
    ownedValues?: Record<string, unknown>,
): { plans: SoALayerPlan[]; compositeBuf: Float64Array | null } => {
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
                carrierOf[key] = ownedValues?.[key] ?? incoming;
            }
            continue;
        }

        // `add` / `weighted` — partition this layer's keys into the numeric
        // SoA pairs and the boxed residual, mirroring the boxed arm's guards.
        const carriers: ValueUnit<number>[] = [];
        const incomingSlots: SoALayerPlan["incomingSlots"] = [];
        // S.F5a S1 — the boxed residual as a precomputed Set (built once here,
        // taken directly by `boxedBlendArm`'s `only` membership test; no per-frame
        // `new Set`).
        const boxedKeys = new Set<string>();
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
                        incomingSlots.push({ values, key, index: i });
                    }
                } else {
                    boxedKeys.add(key);
                }
                // The carrier identity is unchanged by an in-place blend, so
                // `carrierOf[key]` stays the array `existing`.
            } else {
                // Non-array carrier (first-touch / scalar) — the boxed arm
                // assigns `groupedValues[key] = incoming`; record the key for
                // the residual AND update the resolved carrier so a HIGHER
                // add/weighted layer sees the same carrier the boxed pass would.
                boxedKeys.add(key);
                carrierOf[key] = incoming;
            }
        }

        if (carriers.length > maxWidth) maxWidth = carriers.length;
        plans.push({
            layer,
            weighted,
            carriers,
            incomingSlots,
            boxedKeys,
        });
    }

    // Grow the shared fold scratch to the widest layer's numeric width ONCE
    // (reused across every layer AND every frame — the F.W4 zero-alloc
    // discipline: NO per-frame `Float64Array` allocation).
    let compositeBuf = prevBuf;
    if (maxWidth > 0 && (compositeBuf === null || compositeBuf.length < maxWidth)) {
        compositeBuf = new Float64Array(maxWidth);
    }

    return { plans, compositeBuf };
};
