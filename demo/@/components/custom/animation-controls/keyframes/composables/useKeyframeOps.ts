import { formatCSS } from "@mkbabb/value.js";
import { Animation, CSSKeyframesAnimation } from "@src/animation/engine";
import { yieldToMain } from "@src/animation/internal/scheduler";
import { debounce } from "@mkbabb/value.js";
import { toast } from "vue-sonner";
import type { KeyframesState } from "./useKeyframesState";
import { parseAnimationCSS } from "../utils/parseAnimationCSS";

/** The string-generation callbacks the ops thread back into. */
interface StringSync {
    updateAllStrings: () => Promise<string>;
    updateAllStringsAndAnimation: () => Promise<void>;
    debouncedUpdateAllStrings: () => void;
}

/** Run `fn`; on throw, surface a toast with a Retry action and re-log. */
function withErrorToast(
    fn: () => void,
    message: string,
    retry: () => void,
): void {
    try {
        fn();
    } catch (e) {
        toast.error(message, {
            description: (e as Error).message,
            duration: 10000,
            action: { label: "Retry", onClick: retry },
        });
        console.error(e);
    }
}

/**
 * The async sibling of `withErrorToast` — same error/retry contract, but
 * `await`s `fn` so an op that yields the main thread mid-work (the engine's
 * `yieldToMain`, S4 INP relief) still routes a throw through the toast+retry
 * path. Used by the heavy parse→compile edit op.
 */
async function withErrorToastAsync(
    fn: () => Promise<void>,
    message: string,
    retry: () => void,
): Promise<void> {
    try {
        await fn();
    } catch (e) {
        toast.error(message, {
            description: (e as Error).message,
            duration: 10000,
            action: { label: "Retry", onClick: retry },
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
    animation: Animation<any>,
    state: KeyframesState,
    emit: (event: "keyframesUpdate", val: { animation: Animation<any> }) => void,
    sync: StringSync,
) {
    const { addKeyframesString, kfControls, getFormatWidth } = state;
    const { updateAllStrings, updateAllStringsAndAnimation } = sync;

    const updateAnimationFromKeyframesString = debounce(
        (keyframesString: string) => {
            kfControls.keyframes = keyframesString;

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
                    const { options, keyframes } =
                        parseAnimationCSS(keyframesString);

                    // Yield AFTER the parse, BEFORE the compile: the two heaviest
                    // slices land in separate tasks, so neither monopolizes the
                    // main thread during an active edit.
                    await yieldToMain();

                    // value.js's CSS-spec AnimationOptions is structurally
                    // equivalent to keyframes.js's broader InputAnimationOptions
                    // for the fields CSS authors set (duration, delay, etc.).
                    // SINGLE COMPILE (E.W8 S0): adopt the throwaway's compiled
                    // state — `adoptCompiled` re-binds the live-options reference
                    // and recomputes the key-set (G.W19), so no second compile.
                    const compiled = new CSSKeyframesAnimation(
                        options as Record<string, unknown>,
                        ...animation.targets,
                    ).fromKeyframes(keyframes as any);

                    animation.adoptCompiled(compiled);

                    emit("keyframesUpdate", { animation });

                    sync.debouncedUpdateAllStrings();
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
            const wrapped = `${start} { ${keyframeString} }`;

            withErrorToast(
                () => {
                    const { keyframes, options } = parseAnimationCSS(wrapped);
                    const [_, newVars] = Object.entries(keyframes)[0]!;

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

    const updateAddKeyframesString = async (keyframesString: string) => {
        const formatted = await formatCSS(keyframesString, getFormatWidth());

        kfControls.addKeyframes = formatted;
        addKeyframesString.value = formatted;

        return formatted;
    };

    const addKeyframesStringToAnimation = (keyframesString: string) => {
        addKeyframesString.value = keyframesString;
        kfControls.addKeyframes = keyframesString;

        withErrorToast(
            () => {
                const { options, keyframes } =
                    parseAnimationCSS(keyframesString);

                // SINGLE COMPILE (E.W8 S0): append the new stops to the LIVE
                // animation and parse ONCE — no throwaway Animation that re-adds
                // every existing frame and compiles a first time. A new frame
                // (no transform) inherits the preceding keyframe's renderer via
                // the template-index seek (W7 D-1).
                if (options) {
                    animation.setOptions(options as Record<string, unknown>);
                }
                Object.entries(keyframes).forEach(([start, vars]) => {
                    animation.addFrame(parseFloat(start), vars as Partial<any>);
                });

                animation.parse();

                updateAllStrings();

                kfControls.dialogOpen = false;

                addKeyframesString.value = "";
                kfControls.addKeyframes = "";
            },
            "Could not add keyframes",
            () => addKeyframesStringToAnimation(keyframesString),
        );
    };

    const removeKeyframeData = (frameIx: number) => {
        if (animation.templateFrames.length <= 1) {
            toast.error("Cannot remove last keyframe");
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
        updateAnimationFromKeyframesString,
        updateAnimationFromKeyframeString,
        updateAddKeyframesString,
        addKeyframesStringToAnimation,
        removeKeyframeData,
    };
}
