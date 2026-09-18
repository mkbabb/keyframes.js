import { markRaw, shallowRef } from "vue";
import type { Ref, ShallowRef } from "vue";
import { useRafFn } from "@vueuse/core";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";
import type { TimelineState } from "../timelineTypes";
import { selectorText } from "@utils/keyframeSelector";
import {
    buildAnimationFromTimeline,
    exportTimelineToCSS,
    importCSSToTimeline,
} from "../utils/timelineEngine";
import { toast } from "vue-sonner";
import { clamp } from "@mkbabb/value.js/math";

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

    /**
     * The last rebuild failure, or `null`. KF.W7 C-7 / G14 P1 + P3 — this was
     * the file's ONE non-toasting failure, and the only one reachable BY
     * TYPING: a `console.error` and a null engine, with nothing on screen to
     * say the instrument had stopped animating. The engine really is gone
     * (`animation.value = null` stays), so the state it leaves behind is
     * RENDERED by the owner (P4b, `KeyframeTimeline`) and announced through the
     * house channel with a Retry action (★ S-7's shape, not a new helper).
     */
    const buildError: ShallowRef<string | null> = shallowRef(null);

    const rebuild = async (): Promise<void> => {
        if (state.value.keyframes.length < 2) {
            animation.value = null;
            buildError.value = null;
            return;
        }

        try {
            const anim = await buildAnimationFromTimeline(
                state.value,
                animOptions.value,
                targets.value,
            );
            animation.value = markRaw(anim);
            buildError.value = null;
        } catch (e) {
            animation.value = null;
            buildError.value = (e as Error).message;
            toast.error("Failed to rebuild timeline animation", {
                description: (e as Error).message,
                duration: 10000,
                action: { label: "Retry", onClick: () => void rebuild() },
            });
            console.error("Failed to rebuild timeline animation:", e);
        }
    };

    const scrub = (t: number) => {
        scrubT.value = clamp(t, 0, 1);

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
        // Capture WHAT THE SCRUB PAINTS. After the KF.W7 G2 seam the engine is
        // bound to the owner's detached preview subject, never to the scene, so
        // screenshotting `targets[0]` would return the scene's untouched pose
        // at every percent — a thumbnail that is the same picture N times.
        // `targets[0]` remains the fallback for the pre-build state, where
        // there is no engine and nothing has been scrubbed anyway.
        const target = animation.value?.targets[0] ?? targets.value[0];
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

    /**
     * REPLACE the timeline with the stops in `css` (the Import dialog).
     *
     * G14 P2 / R-4 — this REJECTS. It used to catch its own parse failure and
     * toast it, which meant the dialog closed on a failed parse and destroyed
     * the paste; the submission surface is the place a submission failure
     * belongs, so the failure travels to the caller and the dialog stays open
     * with the draft intact. The SUCCESS toast stays: the count is information
     * the close does not convey (P3's outcome toast, after the awaited build).
     */
    const importCSS = async (css: string) => {
        const imported = await importCSSToTimeline(css);
        if (imported.length === 0) {
            throw new Error("No @keyframes stops found in that CSS.");
        }

        state.value.keyframes = imported;
        await rebuild();

        toast.success(`Imported ${imported.length} keyframes`);
    };

    /**
     * MERGE pasted CSS into the timeline (KF.W7 R-3 — the "Add" verb).
     *
     * The Add dialog has always said *"merge into the timeline"* and always
     * performed a whole-array REPLACE: `importCSS` never read the existing
     * state, so one Add silently destroyed every keyframe the user had
     * authored. This is the merge that copy promises, and it merges the way CSS
     * itself does — a pasted stop whose selector serializes to the same text as
     * an existing stop contributes its declarations to that stop, later
     * declarations winning (exactly `coalesceKeyframes`' rule, so the UI, the
     * built animation and the exported artifact cannot disagree about it);
     * a selector the timeline does not hold is appended as a new keyframe.
     *
     * Rejects like {@link importCSS}, and for the same reason (G14 P2 / R-4).
     */
    const mergeCSS = async (css: string) => {
        const imported = await importCSSToTimeline(css);
        if (imported.length === 0) {
            throw new Error("No @keyframes stops found in that CSS.");
        }

        const existing = new Map(
            state.value.keyframes.map((kf) => [selectorText(kf.selector), kf]),
        );
        let added = 0;
        let merged = 0;

        for (const kf of imported) {
            const target = existing.get(selectorText(kf.selector));
            if (target) {
                target.vars = { ...target.vars, ...kf.vars };
                merged += 1;
            } else {
                state.value.keyframes.push(kf);
                existing.set(selectorText(kf.selector), kf);
                added += 1;
            }
        }

        await rebuild();

        toast.success(
            `Merged ${imported.length} keyframes — ${added} added, ${merged} into existing stops`,
        );
    };

    const clear = () => {
        state.value.keyframes = [];
        animation.value = null;
    };

    return {
        animation,
        buildError,
        rebuild,
        scrub,
        scrubAndCapture,
        exportCSS,
        importCSS,
        mergeCSS,
        clear,
    };
}
