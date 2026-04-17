import { Animation, CSSKeyframesAnimation } from "@src/animation/index";
import {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSS,
    parseCSSAnimationOrKeyframes,
} from "@src/parsing/format";
import { parseCSSAnimationKeyframes } from "@src/parsing/keyframes";
import { parseCSSValueUnit } from "@src/parsing/units";
import { convert2 } from "@src/units/utils";
import { debounce } from "@src/utils";
import { ref, watch } from "vue";
import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "../../stores";
import { toast } from "vue-sonner";

export function useKeyframesEditor(
    getAnimation: () => Animation<any>,
    emit: (
        event: "keyframesUpdate",
        val: { animation: Animation<any> },
    ) => void,
) {
    const animation = getAnimation();
    // --- Stored controls setup ---

    const animationUUID = createAnimationUUId(animation, animation.superKey);
    const keyframesStyleId = `keyframes-style-${animationUUID}`;

    const defaultKeyframeControls = {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    };

    const storedControls = getStoredAnimationGroupControlOptions(animation);
    storedControls.keyframeControls ??= defaultKeyframeControls;

    // After ??= above, keyframeControls is guaranteed non-undefined.
    // Use a local alias to avoid TS18048 on every access.
    const kfControls = storedControls.keyframeControls!;

    // --- Refs ---

    const cssKeyframesString = ref("");
    const addKeyframesString = ref(kfControls.addKeyframes);
    const templateFrameStrings = ref<string[]>([]);

    const tabsListEl = ref<HTMLElement | null>(null);

    // --- CSS string functions ---

    const getFormatWidth = (el?: HTMLElement) => {
        el ??= tabsListEl.value!;

        if (el == null || el.offsetWidth == null) {
            return undefined;
        }

        return convert2(el.offsetWidth, "px", "ch", el);
    };

    const getTmpAnimationName = () => {
        return keyframesStyleId
            .replace("keyframes-style-", "")
            .toLowerCase();
    };

    const updateCSSAnimationKeyframesStringFromAnimation = async (
        cssAnimationKeyframes?: string,
    ) => {
        const keyframesString =
            cssAnimationKeyframes ??
            (await CSSKeyframesToString(
                animation,
                getTmpAnimationName(),
                getFormatWidth(),
            ));

        cssKeyframesString.value = keyframesString;

        return keyframesString;
    };

    const updateAllStrings = async () => {
        templateFrameStrings.value = [];
        templateFrameStrings.value = await CSSKeyframesToStrings(animation);

        const keyframesString =
            await updateCSSAnimationKeyframesStringFromAnimation();

        return keyframesString;
    };

    const debouncedUpdateAllStrings = debounce(updateAllStrings, 100);

    const updateAllStringsAndAnimation = async () => {
        const reversedKeyframesString = await updateAllStrings();
        updateAnimationFromKeyframesString(reversedKeyframesString);
    };

    const updateAnimationFromKeyframesString = debounce(
        (keyframesString: string) => {
            kfControls.keyframes = keyframesString;

            const parseAndUpdate = () => {
                const { options, values, keyframes } =
                    parseCSSAnimationKeyframes(keyframesString);

                // Old callsite passed the already-parsed `keyframes`
                // map to `fromString`, which technically expected a
                // string. The keyframes-map flow uses `fromKeyframes`,
                // which accepts a `Map<percent, vars>` directly and
                // skips the redundant re-parse.
                const tmpAnimation = new CSSKeyframesAnimation(
                    options,
                    ...animation.targets,
                ).fromKeyframes(keyframes as any);

                animation.options = tmpAnimation.options;
                animation.templateFrames = tmpAnimation.templateFrames;

                animation.parse();

                emit("keyframesUpdate", {
                    animation,
                });

                debouncedUpdateAllStrings();
            };

            try {
                parseAndUpdate();
            } catch (e) {
                toast.error("Could not update keyframes", {
                    description: (e as Error).message,
                    duration: 10000,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            updateAnimationFromKeyframesString(
                                keyframesString,
                            );
                        },
                    },
                });
                console.error(e);
            }
        },
        1000,
    );

    const updateAnimationFromKeyframeString = debounce(
        async (keyframeString: string, frameIx: number) => {
            const parseAndUpdate = async () => {
                const start = animation.templateFrames[frameIx]!.start;
                keyframeString = `${start} { ${keyframeString} }`;

                const { keyframes, options } =
                    parseCSSAnimationOrKeyframes(keyframeString);
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
            };

            try {
                await parseAndUpdate();
            } catch (e) {
                toast.error("Could not update keyframe", {
                    description: (e as Error).message,
                    duration: 10000,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            updateAnimationFromKeyframeString(
                                keyframeString,
                                frameIx,
                            );
                        },
                    },
                });

                console.error(e);
            }
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

        const parseAndUpdate = () => {
            const { options, values, keyframes } =
                parseCSSAnimationOrKeyframes(keyframesString);

            const tmpAnimation = new Animation(
                options ?? animation.options,
                animation.targets,
            );

            animation.templateFrames.forEach((f) => {
                tmpAnimation.addFrame(
                    f.start,
                    f.vars,
                    f.transform,
                    f.timingFunction,
                );
            });
            Object.entries(keyframes).forEach(([start, vars]) => {
                tmpAnimation.addFrame(
                    parseFloat(start),
                    vars as Partial<any>,
                );
            });

            tmpAnimation.parse();

            Object.assign(animation.options, tmpAnimation.options);
            Object.assign(
                animation.templateFrames,
                tmpAnimation.templateFrames,
            );

            animation.parse();

            updateAllStrings();

            kfControls.dialogOpen = false;

            addKeyframesString.value = "";
            kfControls.addKeyframes = "";
        };

        try {
            parseAndUpdate();
        } catch (e) {
            toast.error("Could not add keyframes", {
                description: (e as Error).message,
                duration: 10000,
                action: {
                    label: "Retry",
                    onClick: () => {
                        addKeyframesStringToAnimation(keyframesString);
                    },
                },
            });

            console.error(e);
        }
    };

    const removeKeyframeData = (frameIx: number) => {
        if (animation.templateFrames.length <= 1) {
            toast.error("Cannot remove last keyframe");
            return false;
        }

        const tmpAnimation = new Animation(
            animation.options,
            animation.targets,
        );

        animation.templateFrames.forEach((f, i) => {
            if (i !== frameIx) {
                tmpAnimation.addFrame(
                    f.start,
                    f.vars,
                    f.transform,
                    f.timingFunction,
                );
            }
        });

        tmpAnimation.parse();

        animation.options = tmpAnimation.options;
        animation.templateFrames = tmpAnimation.templateFrames;
        animation.parse();

        updateAllStringsAndAnimation();

        return true;
    };

    // --- Watchers ---

    watch(
        () => kfControls.selectedKeyframesControl,
        () => {
            updateAllStrings();
        },
    );

    watch(animation.templateFrames, async () => {
        debouncedUpdateAllStrings();
    });

    return {
        // Refs
        cssKeyframesString,
        addKeyframesString,
        templateFrameStrings,
        tabsListEl,

        // Constants
        animationUUID,
        keyframesStyleId,
        storedControls,
        kfControls,

        // Functions
        getFormatWidth,
        getTmpAnimationName,
        updateCSSAnimationKeyframesStringFromAnimation,
        updateAllStrings,
        debouncedUpdateAllStrings,
        updateAllStringsAndAnimation,
        updateAnimationFromKeyframesString,
        updateAnimationFromKeyframeString,
        updateAddKeyframesString,
        addKeyframesStringToAnimation,
        removeKeyframeData,
    };
}
