/**
 * animate() — the single-call declarative front door (E.W10 §S7).
 *
 * The DX baseline of the genre: `motion.animate(el, { opacity: [0, 1] })`,
 * `gsap.to(target, vars)`, anime.js v4 `animate(targets, params)`. keyframes
 * collapses the documented four-step lifecycle — `new CSSKeyframesAnimation` →
 * `.from*` → `.setTargets` → `.play` — into one call that returns the
 * constructed animation as the control handle (`.pause()` / `.play()` /
 * `.stop()` / the awaitable play promise).
 *
 * Pure construction-time DISPATCH — no new engine logic. `animate` branches on
 * the SHAPE of `input` to pick the right `from*` factory, then auto-targets and
 * auto-plays:
 *
 *   • a CSS `@keyframes` string            → `.fromString(css)`
 *   • a keyframe map (`Map` / record       → `.fromKeyframes(map)`
 *     of `{ "0%": {...}, "100%": {...} }`)
 *   • a vars array (`[from, to, ...]`)      → `.fromVars(vars)`
 *   • a MotionPath spec (`{ path, ... }`)   → `fromMotionPath` (F.W12 §S2)
 *
 * ── BOUNDARY: HEAVY (value.js-bearing, but no NEW static edge).
 * `animate.ts` constructs `CSSKeyframesAnimation`, so it statically imports
 * `./engine` (the value.js-bearing CSS engine). It therefore lives on the
 * EXISTING heavy/dynamic surface: the barrel places it behind
 * `loadAnimationEngine()` (the lead wires that), so a light-only consumer never
 * pulls it — and it adds NO new static value.js edge beyond the engine it
 * already needs (inv α; `proof:boundary`). The four-step lifecycle stays for
 * power users; this is its convenience general form, not a replacement.
 */

import { CSSKeyframesAnimation } from "./engine";
import { AnimationGroup } from "./group";
import { Sequence } from "./sequence";
import { fromMotionPath } from "./motion-path";
import type { MotionPathOptions } from "./motion-path";
import type {
    InputAnimationOptions,
    TransformFunction,
    Vars,
} from "./constants";

/** A keyframe map: percent/keyword stops → partial var frames. */
export type KeyframeMap<V extends Vars> =
    | Map<string, Partial<V>>
    | Record<string, Partial<V>>;

/**
 * A MotionPath spec — the `{ path, ... }` shape that routes to
 * {@link fromMotionPath} (F.W12 §S2). It carries the author `offset-path`
 * (`path`) plus the optional `from`/`to`/`rotate` MotionPath knobs; the
 * animation-options + `autoPlay` ride {@link AnimateOptions} on the third
 * argument, exactly as every other `animate()` shape. The discriminating field
 * is `path` — a `string` no keyframe map / vars array carries.
 */
export type MotionPathInput = Pick<
    MotionPathOptions,
    "path" | "from" | "to" | "rotate"
>;

/**
 * The declarative input to {@link animate} — one of the six dispatch shapes:
 *
 *  • `string`            — a CSS `@keyframes` (or bare keyframe-block) source.
 *  • `KeyframeMap`       — `{ "0%": {...}, "100%": {...} }` or the `Map` form.
 *  • `V[]`               — an ordered vars array (the simplest `[from, to]`
 *                          pair, or more stops), distributed evenly 0→100%.
 *  • `MotionPathInput`   — `{ path, from?, to?, rotate? }` — an `offset-distance`
 *                          sweep over an author `offset-path` (F.W12 §S2).
 *  • `AnimationGroup`    — the SPATIAL per-frame blender (L.W8 §S3) — routed to
 *                          its own `.play()`, NOT wrapped in a new animation.
 *  • `Sequence`          — the TEMPORAL master-playhead orchestrator (L.W8 §S3)
 *                          — routed to its own `.play()`.
 */
export type AnimateInput<V extends Vars> =
    | string
    | KeyframeMap<V>
    | V[]
    | MotionPathInput
    | AnimationGroup<V>
    | Sequence<V>;

/**
 * Options accepted by {@link animate}. The animation-options surface, plus an
 * optional custom `transform` renderer (forwarded to the chosen `from*`
 * factory) and `autoPlay` (default true — set false to construct + target
 * without starting, when the caller wants to drive the returned handle).
 */
export interface AnimateOptions extends Partial<InputAnimationOptions> {
    /** Custom renderer forwarded to the `from*` factory. */
    transform?: TransformFunction<any>;
    /**
     * Auto-start the animation after construction + targeting. Default true.
     * `false` returns a constructed, targeted, NOT-yet-playing handle.
     */
    autoPlay?: boolean;
}

/**
 * Distinguish the MotionPath spec `{ path, ... }` from a keyframe map. Keyed on
 * a `path: string` field — a keyframe map's keys are percent/keyword stops
 * (`"0%"`), never a bare `path` string, and a vars array is an array — so the
 * discrimination is unambiguous. Checked BEFORE {@link isKeyframeMap} (a `Map`
 * is excluded first since it has no own `path` property to read).
 */
const isMotionPathInput = <V extends Vars>(
    input: AnimateInput<V>,
): input is MotionPathInput =>
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    !(input instanceof Map) &&
    typeof (input as MotionPathInput).path === "string";

/** Distinguish the keyframe-map shape from a vars array at construction time. */
const isKeyframeMap = <V extends Vars>(
    input: AnimateInput<V>,
): input is KeyframeMap<V> =>
    input instanceof Map ||
    (typeof input === "object" && input !== null && !Array.isArray(input));

/**
 * Construct, target, and play an animation in one call. Returns the
 * `CSSKeyframesAnimation` as the control handle — `await animate(...)` is NOT
 * the pattern (it would await the *construction*, which is synchronous); await
 * the returned handle's play promise via the `.play()` it already kicked off,
 * or pass `autoPlay: false` and drive it yourself.
 *
 * @param target  one or more DOM elements (or a single element) to animate.
 * @param input   a CSS string, a keyframe map, a vars array, or a MotionPath
 *                spec (`{ path }`) — dispatched on its shape.
 * @param options animation options + optional `transform` / `autoPlay`.
 *
 * @example
 * // CSS string → fromString
 * animate(box, `from { opacity: 0 } to { opacity: 1 }`, { duration: 400 });
 * // keyframe map → fromKeyframes
 * animate(box, { "0%": { opacity: 0 }, "100%": { opacity: 1 } });
 * // vars array → fromVars
 * animate(box, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
 * // MotionPath spec → fromMotionPath (F.W12 §S2)
 * animate(box, { path: "path('M 0 0 Q 100 -100 200 0')", rotate: "auto" }, { duration: 2000 });
 */
export function animate<V extends Vars = any>(
    target: HTMLElement | HTMLElement[],
    input: AnimateInput<V>,
    options?: AnimateOptions,
): CSSKeyframesAnimation<V> | AnimationGroup<V> | Sequence<V> {
    const { transform, autoPlay = true, ...animOptions } = options ?? {};

    // Orchestration tier → dispatch to the input's OWN play path (L.W8 §S3,
    // W127). An `AnimationGroup` (the SPATIAL per-frame blender) and a
    // `Sequence` (the TEMPORAL master-playhead) each OWN their loop and their
    // children's targets — `animate` must NOT wrap them in a new
    // `CSSKeyframesAnimation`. Both are HEAVY (they need the engine at
    // call-time for `.play()`), and they ride `loadAnimationEngine()` already
    // via `engine.ts`'s re-exports, so the runtime `instanceof` checks fire
    // after the dynamic import has resolved — NO new static value.js edge.
    // Checked FIRST: an instance is a non-array, non-Map object that would
    // otherwise be misread as a keyframe map by `isKeyframeMap`. We forward the
    // target (`setTargets` is present on both; the optional-call guards a future
    // shape), gate the `.play()` on `autoPlay` (same semantics as every other
    // shape), and return the instance BY REFERENCE as the control handle.
    if (input instanceof AnimationGroup || input instanceof Sequence) {
        const targets = Array.isArray(target) ? target : [target];
        input.setTargets?.(...targets);
        if (autoPlay) void input.play();
        return input;
    }

    // MotionPath spec → fromMotionPath (F.W12 §S2). Checked FIRST among the
    // object shapes (a `{ path }` is a non-array object that would otherwise
    // satisfy isKeyframeMap). `fromMotionPath` owns its own construction +
    // offset-path set + targeting + autoPlay, so it is a full short-circuit:
    // we forward target + the path knobs + the shared animation options and
    // return ITS handle (the same control-handle contract as every other
    // shape). NO new engine logic — pure construction-time dispatch.
    if (isMotionPathInput(input)) {
        return fromMotionPath<V>(target, {
            ...input,
            ...animOptions,
            autoPlay,
        });
    }

    const animation = new CSSKeyframesAnimation<V>(animOptions);

    // Construction-time dispatch on input shape — string before map before
    // array, each routed to the one matching factory. A string can never be a
    // map or array, so the order is unambiguous.
    if (typeof input === "string") {
        animation.fromString(input, transform);
    } else if (Array.isArray(input)) {
        animation.fromVars(input, transform);
    } else if (isKeyframeMap(input)) {
        animation.fromKeyframes(input, transform);
    } else {
        throw new Error(
            "animate(): unrecognized input — pass a CSS @keyframes string, a keyframe map ({ \"0%\": {...} }), a vars array ([from, to]), or a MotionPath spec ({ path }).",
        );
    }

    const targets = Array.isArray(target) ? target : [target];
    animation.setTargets(...targets);

    if (autoPlay) {
        // Fire the play loop; the returned handle carries the play promise via
        // its own re-entrant `play()` (a second `.play()` returns the same
        // promise). We do NOT await — the handle IS the control surface.
        void animation.play();
    }

    return animation;
}
