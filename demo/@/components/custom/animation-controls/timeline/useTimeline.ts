import { computed, markRaw, ref, shallowRef, watch } from "vue";
import type { Ref, ShallowRef } from "vue";
import { CSSKeyframesAnimation } from "@src/animation/index";
import type { InputAnimationOptions } from "@src/animation/constants";
import { defaultAnimationOptions } from "../animationStores";
import { DEFAULT_CAPTURE_PROPERTIES, createKeyframeId } from "./timelineTypes";
import type { TimelineKeyframe, TimelineState } from "./timelineTypes";
import { captureSnapshot } from "./snapshotCapture";
import {
    buildAnimationFromTimeline,
    exportTimelineToCSS,
    importCSSToTimeline,
} from "./timelineEngine";
import { flattenVars } from "@utils/flattenVars";
import { toast } from "vue-sonner";

export function useTimeline(
    targets: Ref<HTMLElement[]>,
    options?: Ref<InputAnimationOptions>,
) {
    const state = ref<TimelineState>({
        keyframes: [],
        captureProperties: [...DEFAULT_CAPTURE_PROPERTIES],
        animationName: "timeline-animation",
    });

    const animOptions = options ?? ref({ ...defaultAnimationOptions });

    const animation: ShallowRef<CSSKeyframesAnimation<any> | null> =
        shallowRef(null);

    const scrubT = ref(0);
    const isPlaying = ref(false);

    const sortedKeyframes = computed(() =>
        [...state.value.keyframes].sort((a, b) => a.percent - b.percent),
    );

    const rebuild = () => {
        if (state.value.keyframes.length < 2) {
            animation.value = null;
            return;
        }

        try {
            const anim = buildAnimationFromTimeline(
                state.value,
                animOptions.value,
                targets.value,
            );
            animation.value = markRaw(anim);
        } catch (e) {
            console.error("Failed to rebuild timeline animation:", e);
            animation.value = null;
        }
    };

    const snapshot = (percent?: number) => {
        const target = targets.value[0];
        if (!target) {
            toast.error("No target element to snapshot");
            return;
        }

        const p = percent ?? scrubT.value * 100;
        const kf = captureSnapshot(target, p, state.value.captureProperties);

        state.value.keyframes.push(kf);
        rebuild();

        toast.success(`Keyframe captured at ${Math.round(p)}%`);
    };

    const addKeyframe = (percent: number, vars?: Record<string, string>) => {
        const kf: TimelineKeyframe = {
            id: createKeyframeId(),
            percent,
            vars: vars ?? {},
        };
        state.value.keyframes.push(kf);
        rebuild();
    };

    const removeKeyframe = (id: string) => {
        const idx = state.value.keyframes.findIndex((kf) => kf.id === id);
        if (idx !== -1) {
            state.value.keyframes.splice(idx, 1);
            rebuild();
        }
    };

    const moveKeyframe = (id: string, newPercent: number) => {
        const kf = state.value.keyframes.find((k) => k.id === id);
        if (kf) {
            kf.percent = Math.max(0, Math.min(100, newPercent));
            rebuild();
        }
    };

    const updateKeyframeProperty = (
        id: string,
        prop: string,
        value: string,
    ) => {
        const kf = state.value.keyframes.find((k) => k.id === id);
        if (kf) {
            if (value.trim() === "") {
                delete kf.vars[prop];
            } else {
                kf.vars[prop] = value;
            }
            rebuild();
        }
    };

    const scrub = (t: number) => {
        scrubT.value = Math.max(0, Math.min(1, t));

        if (animation.value) {
            animation.value.paused = true;
            animation.value.t = scrubT.value * animation.value.options.duration;
            animation.value.interpFrames(animation.value.t, true);
        }
    };

    const exportCSS = async (): Promise<string> => {
        if (state.value.keyframes.length < 2) {
            toast.error("Need at least 2 keyframes to export");
            return "";
        }

        try {
            const css = await exportTimelineToCSS(
                state.value,
                animOptions.value,
                targets.value,
            );

            await navigator.clipboard.writeText(css);
            toast.success("CSS copied to clipboard!");

            return css;
        } catch (e) {
            toast.error("Failed to export CSS", {
                description: (e as Error).message,
            });
            return "";
        }
    };

    const importCSS = (css: string) => {
        try {
            const imported = importCSSToTimeline(css);
            if (imported.length === 0) {
                toast.error("No keyframes found in CSS");
                return;
            }

            state.value.keyframes = imported;
            rebuild();

            toast.success(`Imported ${imported.length} keyframes`);
        } catch (e) {
            toast.error("Failed to parse CSS", {
                description: (e as Error).message,
            });
        }
    };

    const loadPreset = (presetAnim: CSSKeyframesAnimation<any>) => {
        const keyframes: TimelineKeyframe[] = [];

        for (const frame of presetAnim.templateFrames) {
            const percent =
                typeof frame.start.valueOf() === "number"
                    ? (frame.start.valueOf() as number) * 100
                    : 0;

            const vars: Record<string, string> = {};
            flattenVars(frame.vars, "", vars);

            keyframes.push({
                id: createKeyframeId(),
                percent,
                vars,
            });
        }

        state.value.keyframes = keyframes;
        state.value.animationName = presetAnim.name ?? "preset-animation";
        rebuild();
    };

    const scrubAndCapture = async (
        percent: number,
    ): Promise<HTMLCanvasElement | null> => {
        const target = targets.value[0];
        if (!target) return null;

        const hasAnimation = !!animation.value;
        const prevT = scrubT.value;

        if (hasAnimation) {
            scrub(percent / 100);
            await new Promise<void>((resolve) =>
                requestAnimationFrame(() => resolve()),
            );
        }

        try {
            const { default: html2canvas } = await import("html2canvas");
            return await html2canvas(target, {
                scale: 0.5,
                logging: false,
                backgroundColor: null,
            });
        } catch {
            return null;
        } finally {
            if (hasAnimation) {
                scrub(prevT);
            }
        }
    };

    const clear = () => {
        state.value.keyframes = [];
        animation.value = null;
    };

    return {
        state,
        animation,
        scrubT,
        isPlaying,
        sortedKeyframes,
        snapshot,
        addKeyframe,
        removeKeyframe,
        moveKeyframe,
        updateKeyframeProperty,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        loadPreset,
        clear,
    };
}

