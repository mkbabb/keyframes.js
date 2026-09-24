import { h } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { debounce } from "@utils/helpers";
import { toast, ToastAction } from "@mkbabb/glass-ui/toast";
import type { KeyframesState } from "./useKeyframesState";
import { parseAnimationCSS } from "../utils/parseAnimationCSS";
import { getStoredAnimationOptions } from "@state";
import { requireKeyframeSelector, selectorText } from "@utils/keyframeSelector";
import { formatEditorCSS } from "@utils/formatEditorCSS";

/** The string-generation callbacks the ops thread back into. */
interface StringSync {
    updateAllStrings: () => Promise<string>;
    updateAllStringsAndAnimation: () => Promise<void>;
    debouncedUpdateAllStrings: () => void;
}

/**
 * Run `fn`; on throw, surface a toast with a Retry action and re-log. `await`s
 * `fn` so an op that yields the main thread mid-work (the engine's `yieldToMain`,
 * S4 INP relief) or awaits `loadAnimationEngine()` (L.W8 S1 dogfood inversion)
 * still routes a throw through the toast+retry path.
 */
async function withErrorToastAsync(
    fn: () => Promise<void>,
    message: string,
    retry: () => void,
): Promise<void> {
    try {
        await fn();
    } catch (e) {
        toast({
            title: message,
            tone: "destructive",
            description: (e as Error).message,
            duration: 10000,
            action: h(ToastAction, { altText: "Retry", onClick: retry }, () => "Retry"),
        });
        console.error(e);
    }
}

/**
 * The string-edit → animation mutation ops: fold an edited keyframes/keyframe
 * string back into the live `Animation`, add/remove a keyframe. One-way
 * dependency on the string-generation callbacks (`StringSync`) — no cycle.
 */
export function useKeyframeOps(
    animation: KeyframesAnimation<any>,
    state: KeyframesState,
    emit: (
        event: "keyframesUpdate",
        val: { animation: KeyframesAnimation<any> },
    ) => void,
    sync: StringSync,
) {
    const { addKeyframesString, getFormatWidth } = state;
    const { updateAllStrings, updateAllStringsAndAnimation } = sync;

    // KF-KE-55 (X.KF.W12.c): the `kfControls.keyframes` write that stood here
    // fed a stored cell nothing in the demo reads; the write is gone and the
    // cell's schema member is the store owner's to delete.
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
        sync.debouncedUpdateAllStrings();
    };

    const updateAnimationFromKeyframesString = debounce(
        (keyframesString: string) => {
            // S4 (INP relief): this is the demo's heaviest edit op — a full CSS
            // parse THEN a fresh compile, run on every Monaco edit. Splitting it
            // with the engine's OWN `yieldToMain` (one yield ladder in the
            // codebase — the same `scheduler.yield`→`MessageChannel`→`setTimeout`
            // probe `AnimationGroup` rides) lets the browser service input/paint
            // between the parse and the compile, so a large keyframes edit never
            // lands as one > 50 ms long task. `void` — the debounced caller is
            // fire-and-forget; the throw path is owned by `withErrorToastAsync`.
            void withErrorToastAsync(
                async () => {
                    await updateFromString(keyframesString);
                },
                "Could not update keyframes",
                () => updateAnimationFromKeyframesString(keyframesString),
            );
        },
        1000,
    );

    const updateAnimationFromKeyframeString = debounce(
        (keyframeString: string, frameIx: number) => {
            const start = animation.templateFrames[frameIx]!.start;
            const wrapped = `${selectorText(start)} { ${keyframeString} }`;

            void withErrorToastAsync(
                async () => {
                    const { keyframes, options } =
                        await parseAnimationCSS(wrapped);
                    const first = keyframes.entries().next();
                    if (first.done) {
                        throw new TypeError(
                            "Keyframe edit produced no keyframe.",
                        );
                    }
                    const [, newVars] = first.value;

                    Object.assign(
                        animation.options,
                        options ?? animation.options,
                    );
                    Object.assign(
                        animation.templateFrames[frameIx]!.vars,
                        newVars,
                    );

                    animation.parse();

                    updateAllStringsAndAnimation();
                },
                "Could not update keyframe",
                () =>
                    updateAnimationFromKeyframeString(keyframeString, frameIx),
            );
        },
        1000,
    );

    /**
     * KF-KE-56 (X.KF.W12.c) — PURE, as the dialog's `format` prop declares it
     * ("formats the raw string and RETURNS the result; writes nothing"). It
     * also wrote both draft cells, so three writers maintained one mirror; the
     * dialog emits the formatted text through its model and the editor's one
     * watch persists it.
     */
    const updateAddKeyframesString = (keyframesString: string) =>
        formatEditorCSS(keyframesString, getFormatWidth());

    /**
     * Fold a pasted `@keyframes` block into the live animation. `onAdded` runs
     * on success — the editor closes its dialog there (KF-KE-20: the open state
     * is the editor's local ref, not a stored preference this op writes).
     */
    const addKeyframesStringToAnimation = (
        keyframesString: string,
        onAdded?: () => void,
    ) => {
        void withErrorToastAsync(
            async () => {
                const { options, keyframes } =
                    await parseAnimationCSS(keyframesString);

                // SINGLE COMPILE (E.W8 S0): append the new stops to the LIVE
                // animation and parse ONCE — no throwaway Animation that re-adds
                // every existing frame and compiles a first time. A new frame
                // (no transform) inherits the preceding keyframe's renderer via
                // the template-index seek (W7 D-1).
                if (options) {
                    animation.setOptions(options as Record<string, unknown>);
                }
                for (const [start, vars] of keyframes) {
                    animation.addFrame(
                        requireKeyframeSelector(start),
                        vars as Partial<any>,
                    );
                }

                animation.parse();

                updateAllStrings();

                onAdded?.();

                // The draft is spent; the editor's watch mirrors the clear.
                addKeyframesString.value = "";
            },
            "Could not add keyframes",
            () => addKeyframesStringToAnimation(keyframesString, onAdded),
        );
    };

    const removeKeyframeData = (frameIx: number) => {
        if (animation.templateFrames.length <= 1) {
            toast({ title: "Cannot remove last keyframe", tone: "destructive" });
            return false;
        }

        // SINGLE COMPILE (E.W8 S0): drop the keyframe from the LIVE templates and
        // parse ONCE — no throwaway Animation re-adding every surviving frame and
        // compiling a first time.
        animation.templateFrames = animation.templateFrames.filter(
            (_, i) => i !== frameIx,
        );
        animation.parse();

        updateAllStringsAndAnimation();

        return true;
    };

    return {
        updateFromString,
        updateAnimationFromKeyframesString,
        updateAnimationFromKeyframeString,
        updateAddKeyframesString,
        addKeyframesStringToAnimation,
        removeKeyframeData,
    };
}
