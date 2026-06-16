/**
 * `animation-composition` honoring (K.W7 S1) — the pure helper surface the
 * `Animation` engine calls to composite a lerped numeric leaf onto its captured
 * underlying base per the author's `add`/`accumulate`/`replace` operator.
 *
 * INTERNAL colocated module — NOT a barrel export. It carries no class state and
 * no run-state: every function is pure over its explicit arguments (the per-run
 * caches + the engine scalars are passed in via {@link CompositionRuntime}), so
 * the `engine.ts` god-object sheds the K.W7 composition block WITHOUT changing
 * the `loadAnimationEngine()` dynamic boundary (the engine still imports it
 * statically; both ride the same heavy chunk). ZERO behavior change — the
 * honoring works identically; `proof:composition-honored` greps THIS module for
 * the moved body anchors and `engine.ts` for the call sites + the gate.
 *
 * value.js is reached only for `ValueUnit` (the numeric-leaf guard + the
 * segment-end read) — the same heavy surface `engine.ts` already imports.
 */
import { ValueUnit } from "@mkbabb/value.js";
import type { Diagnostic } from "./adapter";
import type { AnimationFrame, CompositeOperator, Vars } from "./constants";

/**
 * The per-run composition state the honoring reads/writes — the engine owns
 * these fields; the pure helpers thread them explicitly (no `this`). The caches
 * are reset by {@link computeHasComposition} on every (re)parse.
 *
 * - `iteration` — the engine's own iteration counter (the `accumulate` stack).
 * - `target` — the first animated element (the underlying-base source); the
 *   engine passes `this.targets[0]` so the helper never reaches into the class.
 * - `compositionBase` — captured per-leaf underlying base (keyed by flat key).
 * - `compositionFallbackSeen` — properties whose non-numeric fallback already
 *   emitted its row (the once-per-property honesty guard).
 * - `diagnostics` — the structured diagnostics channel the fallback row pushes to.
 */
export interface CompositionRuntime {
    readonly iteration: number;
    readonly target: HTMLElement | undefined;
    readonly compositionBase: Map<string, number[]>;
    readonly compositionFallbackSeen: Set<string>;
    readonly diagnostics: Diagnostic[];
}

/**
 * True iff ANY compiled frame carries a non-`replace` `animation-composition`
 * operator (K.W7 S1). The honoring hot-path branch (`processFrame` →
 * `applyComposition`) reads this ONE per-animation constant; a pure-`replace`
 * animation never pays for the composition work. The caller also resets the
 * per-run base/fallback caches so a re-parse (new keyframes) re-snapshots the
 * underlying base — see {@link resetCompositionCaches}.
 */
export function computeHasComposition<V extends Vars>(
    frames: readonly AnimationFrame<V>[],
): boolean {
    for (const frame of frames) {
        if (frame.composition != null && frame.composition !== "replace") {
            return true;
        }
    }
    return false;
}

/**
 * Reset the per-run base/fallback caches (K.W7 S1) — called on every (re)parse
 * and on `adoptCompiled`, so a new key-set re-snapshots its underlying base.
 */
export function resetCompositionCaches(
    compositionBase: Map<string, number[]>,
    compositionFallbackSeen: Set<string>,
): void {
    compositionBase.clear();
    compositionFallbackSeen.clear();
}

/**
 * Composite ONE frame's lerped numeric leaves onto the captured underlying
 * base, per the frame's `animation-composition` operator (K.W7 S1). The
 * leaf is a `ValueUnit[]` (a one-element array for a scalar, an N-element
 * array for a multi-component leaf — a transform list); the lerp already
 * wrote `unit.value`, so the composite is `unit.value += base` IN PLACE
 * (un-clamped — CSS does not clamp at composition; the same `group.ts` `add`
 * leaf contract). The underlying base is snapshotted the first time the leaf
 * is composited (from the target's pre-animation value), keyed by the flat
 * property name. The `replace` operator is filtered out by the caller.
 *
 *   - `add`        — `value = base + lerp`
 *   - `accumulate` — repeat-aware: `value = base + iteration·(endΔ) + lerp`,
 *                    so iteration N stacks onto N−1's net effect (the one new
 *                    semantic; reads the engine's own `iteration` counter).
 *
 * A NON-NUMERIC leaf (color, `<custom-ident>`, discrete) has no faithful
 * numeric add: it `replace`-falls-back (the leaf keeps its lerped value) AND
 * emits a `COMPOSITION_FALLBACK` row naming the property — never a silent
 * wrong pixel (the honest-refusal clause). The row is emitted ONCE per
 * property (a `Set` guard) so a long playback does not flood the channel.
 */
export function applyComposition<V extends Vars>(
    frame: AnimationFrame<V>,
    runtime: CompositionRuntime,
): void {
    const op = frame.composition;
    if (op == null || op === "replace") return;

    const flatVars = frame.flatVars as unknown as Record<string, ValueUnit[]>;
    for (const key in flatVars) {
        const leaf = flatVars[key];
        if (!Array.isArray(leaf) || leaf.length === 0) continue;

        // Non-numeric refusal (S3 / NEW-39): a leaf any element of which is
        // not a plain numeric ValueUnit has no faithful numeric add. It
        // `replace`-falls-back (keeps the lerped value) and emits its row.
        const numeric = leaf.every(
            (u) => u instanceof ValueUnit && typeof u.value === "number",
        );
        if (!numeric) {
            emitCompositionFallback(key, op, runtime);
            continue;
        }

        // Capture the underlying base ONCE (before the engine's first write
        // overwrote it). Keyed by the flat property; one number per element.
        let base = runtime.compositionBase.get(key);
        if (base === undefined) {
            base = captureUnderlyingBase(runtime.target, key, leaf.length);
            runtime.compositionBase.set(key, base);
        }

        // The repeat-aware accumulate stacks the PRIOR iterations' net
        // effect (the segment's end value minus its base, per completed
        // iteration). For `add`, the stack is zero (iteration-independent).
        const iters = op === "accumulate" ? runtime.iteration : 0;
        for (let i = 0; i < leaf.length; i++) {
            const unit = leaf[i]!;
            const b = base[i] ?? 0;
            if (iters > 0) {
                // The net per-iteration delta is (end − base); `accumulate`
                // adds it once per COMPLETED iteration on top of the base,
                // then the live lerp on top of that (CSS repeat-aware
                // accumulation). `unit.value` currently holds the live lerp.
                const end = endValueFor(frame, key, i, runtime.compositionBase);
                unit.value = b + iters * (end - b) + unit.value;
            } else {
                unit.value = b + unit.value;
            }
        }
    }
}

/**
 * Snapshot the underlying base for a composited leaf (K.W7 S1) — the
 * element's value WITHOUT this animation, the value `add`/`accumulate`
 * composites onto. Reads the target's pre-animation INLINE style for the
 * leaf's CSS property and parses each component to a number; an absent /
 * non-numeric inline value is the CSS initial-ish `0` (additive identity),
 * so a fresh element with no underlying declaration composites as a pure
 * `add` onto `0` (the lerped value passes through unchanged — faithful: no
 * underlying value means nothing to add to). Bounded to `count` elements.
 */
export function captureUnderlyingBase(
    target: HTMLElement | undefined,
    key: string,
    count: number,
): number[] {
    const base = new Array<number>(count).fill(0);
    if (target == null || target.style == null) return base;
    // The flat key's leaf segment is the CSS-ish property (e.g. `opacity`,
    // or `transform.translateX` → `translateX`); read the inline value and
    // parse leading numeric components positionally.
    const prop = key.split(".").pop() ?? key;
    const raw =
        target.style.getPropertyValue(prop) ||
        (target.style as unknown as Record<string, string>)[prop] ||
        "";
    if (!raw) return base;
    const nums = raw.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
    if (nums == null) return base;
    for (let i = 0; i < count && i < nums.length; i++) {
        const n = Number.parseFloat(nums[i]!);
        if (Number.isFinite(n)) base[i] = n;
    }
    return base;
}

/**
 * The segment END value for a leaf element (K.W7 — the `accumulate`
 * repeat-aware stack). The compiled `InterpolatedVar` carries `start`/`stop`
 * ValueUnits; the end of the segment is `stop.value`. Returns the captured
 * base when the stop is not a plain number (the accumulate degrades to a
 * no-stack `add`, never a NaN).
 */
export function endValueFor<V extends Vars>(
    frame: AnimationFrame<V>,
    key: string,
    index: number,
    compositionBase: Map<string, number[]>,
): number {
    const ivArr = frame.interpVars[key];
    const iv = ivArr?.[index];
    const stop = iv?.stop;
    if (stop instanceof ValueUnit && typeof stop.value === "number") {
        return stop.value;
    }
    return compositionBase.get(key)?.[index] ?? 0;
}

/** Emit a `COMPOSITION_FALLBACK` diagnostic ONCE per property (S3/S4). */
export function emitCompositionFallback(
    property: string,
    op: CompositeOperator,
    runtime: CompositionRuntime,
): void {
    if (runtime.compositionFallbackSeen.has(property)) return;
    runtime.compositionFallbackSeen.add(property);
    runtime.diagnostics.push({
        code: "COMPOSITION_FALLBACK",
        message:
            `animation-composition: ${op} on a non-numeric leaf ` +
            `"${property}" has no faithful numeric add — composited as ` +
            `\`replace\` (the lerped value), never a wrong sum`,
        property,
    });
}
