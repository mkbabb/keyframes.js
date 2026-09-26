import { h, markRaw, shallowRef } from "vue";
import type { Ref, ShallowRef } from "vue";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";
import type { TimelineState } from "../timelineTypes";
import { selectorText } from "@utils/keyframeSelector";
import {
    buildAnimationFromTimeline,
    exportTimelineToCSS,
    importCSSToTimeline,
} from "../utils/timelineEngine";
import { toast, ToastAction } from "@mkbabb/glass-ui/toast";
import { copyWithToast } from "@composables/copyWithToast";
import { clamp } from "@mkbabb/value.js/math";

// KFA-59 (X.KF.W13X.timeline) — the hover-preview CAPTURE is gone: its memo
// (PreviewEntry / previewKey / evictStalePreviews / capturePreview) and the
// `scrubAndCapture` seam it memoized rasterised the scene with html2canvas,
// which cannot parse CSS `color()` and so failed on every hover. The preview is
// now a posed clone of the subject (`posePreviewSubject`, timelineEngine.ts):
// synchronous, content-derived, with no failure state to cache.

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
            toast({
                title: "Failed to rebuild timeline animation",
                tone: "destructive",
                description: (e as Error).message,
                duration: 10000,
                action: h(ToastAction, { altText: "Retry", onClick: () => void rebuild() }, () => "Retry"),
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

    const exportCSS = async (): Promise<string> => {
        if (state.value.keyframes.length < 2) {
            toast({ title: "Need at least 2 keyframes to export", tone: "destructive" });
            return "";
        }

        try {
            const css = await exportTimelineToCSS(
                state.value,
                animOptions.value,
                targets.value,
            );

            // A2-KE-L1-19 — the one clipboard verb; a refused write toasts its
            // named failure there instead of surfacing as an export error.
            const { ok } = await copyWithToast(css, "CSS copied to clipboard!");
            return ok ? css : "";
        } catch (e) {
            toast({
                title: "Failed to export CSS",
                tone: "destructive",
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

        toast({ title: `Imported ${imported.length} keyframes`, tone: "success" });
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

        toast({
            title: `Merged ${imported.length} keyframes — ${added} added, ${merged} into existing stops`,
            tone: "success",
        });
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
        exportCSS,
        importCSS,
        mergeCSS,
        clear,
    };
}
