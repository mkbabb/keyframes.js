import { formatCSS } from "@mkbabb/value.js";
import { Animation, CSSKeyframesAnimation } from "@src/animation/engine";
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

            withErrorToast(
                () => {
                    const { options, keyframes } =
                        parseAnimationCSS(keyframesString);

                    // value.js's CSS-spec AnimationOptions is structurally
                    // equivalent to keyframes.js's broader InputAnimationOptions
                    // for the fields CSS authors set (duration, delay, etc.).
                    // SINGLE COMPILE (E.W8 S0): the throwaway's `fromKeyframes`
                    // is the ONE compile; transplant its compiled state onto the
                    // live animation instead of re-`parse()`ing. `compiled` is
                    // built with the same targets, and its compiler holds
                    // `compiled.options` — which we adopt — so the compiler's
                    // live options reference stays consistent (no stale re-parse).
                    const compiled = new CSSKeyframesAnimation(
                        options as Record<string, unknown>,
                        ...animation.targets,
                    ).fromKeyframes(keyframes as any);

                    animation.options = compiled.options;
                    animation.compiler = compiled.compiler;
                    animation.unflatten = compiled.unflatten;

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
