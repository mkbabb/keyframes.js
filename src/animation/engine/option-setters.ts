/**
 * `engine/option-setters.ts` — the option-APPLY surface, lifted off the
 * `KeyframesAnimation` god-object (R.W2 — "Concern B"). Sits beside `./options`
 * (the pure normalizers): each free function NORMALIZES its input (via the
 * `./options` normalizer) and APPLIES it onto the animation's live `options`
 * object (+ the duration-ratio rescale / the color-space renormalize side
 * effects). The class keeps the fluent `setX(...)` delegate surface (each
 * returns `this` for chaining); the logic lives here.
 *
 * The fail-explicit contract: genuine omission (`undefined`/`null`) means "use
 * the default" and is always accepted; present-but-malformed input THROWS a
 * typed `AnimationOptionError` (raised inside the `./options` normalizer) naming
 * the option and the offending value — no silent fallback, no silently-preserved
 * previous value.
 */
import {
    normalizeBoolean,
    normalizeColorSpace,
    normalizeDelay,
    normalizeDirection,
    normalizeDuration,
    normalizeFillMode,
    normalizeHueMethod,
    normalizeIterationCount,
    normalizeTimingFunction,
} from "./options";
import { shouldReverse } from "./play-lifecycle";
import type { InputAnimationOptions, Vars } from "../constants";
import type { KeyframesAnimation } from "./animation";
import { compilerFor } from "./compiler-state";

export function applyTimingFunction<V extends Vars>(
    anim: KeyframesAnimation<V>,
    timingFunction: InputAnimationOptions["timingFunction"],
): void {
    anim.options.timingFunction = normalizeTimingFunction(timingFunction);
}

export function applyIterationCount<V extends Vars>(
    anim: KeyframesAnimation<V>,
    iterationCount: InputAnimationOptions["iterationCount"],
): void {
    anim.options.iterationCount = normalizeIterationCount(iterationCount);
}

export function applyDuration<V extends Vars>(
    anim: KeyframesAnimation<V>,
    duration: InputAnimationOptions["duration"],
): void {
    // Genuine omission: keep the current duration (the constructor always seeds
    // the default; a bare `setDuration()` is a no-op).
    const d = normalizeDuration(duration);
    if (d === undefined) return;

    const ratio = d / anim.options.duration;
    for (let i = 0; i < anim.frames.length; i++) {
        const frame = anim.frames[i]!;
        frame.time.start *= ratio;
        frame.time.stop *= ratio;
    }
    anim.options.duration = d;
}

export function applyDelay<V extends Vars>(
    anim: KeyframesAnimation<V>,
    delay: InputAnimationOptions["delay"],
): void {
    anim.options.delay = normalizeDelay(delay);
}

export function applyDirection<V extends Vars>(
    anim: KeyframesAnimation<V>,
    direction: InputAnimationOptions["direction"],
): void {
    anim.options.direction = normalizeDirection(direction);
    // Immediately update reversed flag so mid-iteration direction changes take
    // effect. R.W2 F-3 (DRY): the three-way direction → reversal test is the
    // single `shouldReverse` predicate, shared with the play-start `onStart`.
    anim._playback.reversed = shouldReverse(anim.options.direction, anim._playback.iteration);
}

export function applyFillMode<V extends Vars>(
    anim: KeyframesAnimation<V>,
    fillMode: InputAnimationOptions["fillMode"],
): void {
    anim.options.fillMode = normalizeFillMode(fillMode);
}

export function applyUseWAAPI<V extends Vars>(
    anim: KeyframesAnimation<V>,
    useWAAPI: InputAnimationOptions["useWAAPI"],
): void {
    anim.options.useWAAPI = normalizeBoolean("useWAAPI", useWAAPI);
}

export function applyRespectReducedMotion<V extends Vars>(
    anim: KeyframesAnimation<V>,
    respectReducedMotion: InputAnimationOptions["respectReducedMotion"],
): void {
    anim.options.respectReducedMotion = normalizeBoolean(
        "respectReducedMotion",
        respectReducedMotion,
    );
}

export function applyColorSpace<V extends Vars>(
    anim: KeyframesAnimation<V>,
    colorSpace: InputAnimationOptions["colorSpace"],
): void {
    anim.options.colorSpace = normalizeColorSpace(colorSpace);
    // Honor the live-options contract: if frames are already compiled, the color
    // space is baked into their interp carriers — re-derive them so the change
    // takes effect (not a silent compile-stale no-op).
    if (anim.frames.length > 0) compilerFor<V>(anim).renormalizeColors();
}

export function applyHueMethod<V extends Vars>(
    anim: KeyframesAnimation<V>,
    hueMethod: InputAnimationOptions["hueMethod"],
): void {
    // Genuine omission leaves `hueMethod` unset (the color machinery picks the
    // space's default); a present-but-malformed value throws.
    const normalized = normalizeHueMethod(hueMethod);
    if (normalized === undefined) return;
    anim.options.hueMethod = normalized;
    // The hue-interpolation method is baked into compiled cylindrical-space
    // carriers; re-derive when frames already exist (live-options contract).
    if (anim.frames.length > 0) compilerFor<V>(anim).renormalizeColors();
}

export function applyComposite<V extends Vars>(
    anim: KeyframesAnimation<V>,
    composite: InputAnimationOptions["composite"],
): void {
    // Genuine omission (`undefined`) leaves the field unset — the serializer
    // treats it as the CSS default `replace` and omits the longhand. A present
    // value is stored verbatim (`replace` | `add` | `accumulate`), so a sibling
    // `.class { animation-composition: add }` ingested by `fromString`
    // round-trips on re-serialize.
    if (composite === undefined) return;
    anim.options.composite = composite;
}

/** Apply a whole option bag — the constructor + `fromString` base-merge path. */
export function applyOptions<V extends Vars>(
    anim: KeyframesAnimation<V>,
    options: Partial<InputAnimationOptions>,
): void {
    applyTimingFunction(anim, options.timingFunction);
    applyDuration(anim, options.duration);
    applyIterationCount(anim, options.iterationCount);
    applyDelay(anim, options.delay);
    applyDirection(anim, options.direction);
    applyFillMode(anim, options.fillMode);
    applyUseWAAPI(anim, options.useWAAPI);
    applyRespectReducedMotion(anim, options.respectReducedMotion);
    applyColorSpace(anim, options.colorSpace);
    applyHueMethod(anim, options.hueMethod);
    applyComposite(anim, options.composite);
}
