import { markRaw, shallowRef } from "vue";
import type { Ref, ShallowRef } from "vue";
import { useRafFn } from "@vueuse/core";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import type { InputAnimationOptions } from "@src/animation/constants";
import { createKeyframeId } from "../timelineTypes";
import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import {
    buildAnimationFromTimeline,
    exportTimelineToCSS,
    importCSSToTimeline,
} from "../utils/timelineEngine";
import { flattenVars } from "../utils/flattenVars";
import { toast } from "vue-sonner";

/**
 * The BUILD half of the timeline: everything that touches the engine
 * `CSSKeyframesAnimation` object — rebuild from state, scrub it, capture a
 * frame, and the CSS import/export round-trip over `timelineEngine`. Owns the
 * `markRaw`'d `animation` shallowRef; the ops half (keyframe-array CRUD) calls
 * `rebuild` after each mutation.
 */
export function useTimelineBuild(
    state: Ref<TimelineState>,
    scrubT: Ref<number>,
    animOptions: Ref<InputAnimationOptions>,
    targets: Ref<HTMLElement[]>,
) {
    const animation: ShallowRef<CSSKeyframesAnimation<any> | null> =
        shallowRef(null);

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

    const scrub = (t: number) => {
        scrubT.value = Math.max(0, Math.min(1, t));

        if (animation.value) {
            animation.value.paused = true;
            animation.value.t = scrubT.value * animation.value.options.duration;
            animation.value.interpFrames(animation.value.t, true);
        }
    };

    // One-shot next-frame await: let a scrub paint before html2canvas reads the
    // DOM. `useRafFn` owns the rAF lifecycle (registers tryOnScopeDispose at
    // setup so the loop is torn down on unmount). The single hoisted loop runs
    // for exactly one frame per `nextFrame()` call — it pauses itself and
    // resolves the pending promise on the first tick.
    // Re-entrancy-safe: ALL callers awaiting the next frame resolve together on
    // the first tick (the old single `pendingFrame` slot dropped every caller
    // but the last — a concurrent scrubAndCapture would hang forever). Matches
    // the old per-call `new Promise(rAF)` semantics: every call resolves.
    let pendingFrames: Array<() => void> = [];
    const { pause: pauseFrame, resume: resumeFrame } = useRafFn(
        () => {
            pauseFrame();
            const done = pendingFrames;
            pendingFrames = [];
            for (const resolve of done) resolve();
        },
        { immediate: false },
    );

    const nextFrame = () =>
        new Promise<void>((resolve) => {
            pendingFrames.push(resolve);
            resumeFrame();
        });

    const scrubAndCapture = async (
        percent: number,
    ): Promise<HTMLCanvasElement | null> => {
        const target = targets.value[0];
        if (!target) return null;

        const hasAnimation = !!animation.value;
        const prevT = scrubT.value;

        if (hasAnimation) {
            scrub(percent / 100);
            await nextFrame();
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

    const clear = () => {
        state.value.keyframes = [];
        animation.value = null;
    };

    return {
        animation,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        loadPreset,
        clear,
    };
}
