import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { parseAnimationCSS } from "../utils/parseAnimationCSS";
import { getStoredAnimationOptions } from "@state";

/** The buffer projection the op threads back into after an adopt. */
interface BufferSync {
    /** Re-project the buffer from the adopted animation (debounced). */
    reproject: () => void;
}

/**
 * The string-edit → animation op: fold an edited `@keyframes` buffer back into
 * the live `Animation`. One-way dependency on the buffer projection
 * (`BufferSync`) — no cycle.
 *
 * X.KF.W13X.keyframes (KFE-ORPHAN · A2-KE-L1-1) — `updateFromString` is the
 * whole op surface the live Keyframes pane reads. The per-stop ops
 * (`updateAnimationFromKeyframeString`, `addKeyframesStringToAnimation`,
 * `updateAddKeyframesString`, `removeKeyframeData`) and the debounced
 * whole-buffer op (with its `withErrorToastAsync` retry toast) served only the
 * card editor and its add dialog, which no product file mounted after
 * `e69f7731`; they left with that subtree.
 */
export function useKeyframeOps(
    animation: KeyframesAnimation<any>,
    emit: (
        event: "keyframesUpdate",
        val: { animation: KeyframesAnimation<any> },
    ) => void,
    sync: BufferSync,
) {
    const updateFromString = async (keyframesString: string) => {
        const { CSSKeyframesAnimation, reverseCSSTime, yieldToMain } =
            await loadAnimationEngine();
        const { options, keyframes } = await parseAnimationCSS(keyframesString);
        await yieldToMain();
        const compiled = new CSSKeyframesAnimation(
            options as Record<string, unknown>,
            ...animation.targets,
        ).fromKeyframes(keyframes);
        animation.adoptCompiled(compiled);

        const stored = getStoredAnimationOptions(animation).animationOptions;
        stored.duration = reverseCSSTime(animation.options.duration);
        stored.delay = reverseCSSTime(animation.options.delay);
        stored.iterationCount = isFinite(animation.options.iterationCount)
            ? animation.options.iterationCount
            : "infinite";
        stored.direction = animation.options.direction;
        stored.fillMode = animation.options.fillMode;
        // §0u (X.KF.W12.c), the ONE diagnostic left in this unit's rows, named
        // at its root rather than narrowed here: `options.timingFunction` IS a
        // `CssEasingLiteral` at runtime — `parseAnimationCSS` produces it with
        // the engine's published `serializeTimingFunction`, whose return type is
        // exactly that union — but the projection's own type
        // (`parseAnimationCSS.ts:9`, `timingFunction?: string`) widens it to
        // `string`, which the store's declared union refuses. The cure is that
        // one token in a file no unit of this wave owns; a re-narrowing guard
        // here would be a shim over the widening, and a cast is refused by the
        // ruling. Escalated in the unit's receipt with the byte named.
        if (options?.timingFunction)
            stored.timingFunction = options.timingFunction;

        emit("keyframesUpdate", { animation });
        sync.reproject();
    };

    return { updateFromString };
}
