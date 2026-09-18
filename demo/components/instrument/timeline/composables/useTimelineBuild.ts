import { markRaw, shallowRef } from "vue";
import type { Ref, ShallowRef } from "vue";
import { useRafFn } from "@vueuse/core";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import type { InputAnimationOptions } from "@mkbabb/keyframes.js";
import type { TimelineKeyframe, TimelineState } from "../timelineTypes";
import { selectorText } from "@utils/keyframeSelector";
import {
    buildAnimationFromTimeline,
    exportTimelineToCSS,
    importCSSToTimeline,
} from "../utils/timelineEngine";
import { toast } from "vue-sonner";
import { clamp } from "@mkbabb/value.js/math";

// ───────────────────────────────────────────────────────────────────────────
// THE HOVER-PREVIEW CACHE, AS RULES (KF.W7 G10 · D-4/L-4/C-5)
//
// The thumbnails the hover panel shows are a MEMO over `scrubAndCapture`, and
// the memo is what was broken: two parallel maps (`previewCache: Record<id,
// string>` + `previewLoading: Record<id, boolean>`) keyed on a MUTATION-STABLE
// id, with no `delete` anywhere in the owning component. Between them they
// could express "have it" and "fetching it" and NOT "tried and it failed", so
// every hover after a failure re-entered the capture and re-failed without
// bound, and every edit left a picture of a pose that no longer existed paired
// with a LIVE percent. Remove / clear / import-over orphaned their base64 PNGs
// for the session.
//
// The rules live HERE, beside the capture seam they memoize, as three pure
// functions over a plain `Map`: the owner supplies the reactive map and the
// component tree renders it, but deciding what a cached preview is a preview
// OF, when it stops being one, and what a failure does is not render-time work
// and is not a 659-line SFC's to hide.
// ───────────────────────────────────────────────────────────────────────────

/**
 * One keyframe's preview state. `key` is the CONTENT the entry is a preview OF,
 * which is what makes eviction decidable rather than timed — and `failed` is
 * the third state the two-map shape could not say.
 */
export type PreviewEntry =
    | { kind: "ready"; key: string; src: string }
    | { kind: "capturing"; key: string }
    | { kind: "failed"; key: string; error: string };

/** WHAT a cached preview is a preview OF — the eviction test, in one string. */
export const previewKey = (kf: TimelineKeyframe): string =>
    `${kf.percent}|${JSON.stringify(kf.vars)}`;

/**
 * Drop every entry that is no longer a preview of live content.
 *
 * ONE pass covers all five mutations: edit (the key changes), remove and clear
 * (the id is gone), import-over (new ids), undo (the state is re-seated). It is
 * content-keyed, so an undo that restores the exact prior vars KEEPS its
 * still-valid capture — a cache, not a TTL.
 */
export const evictStalePreviews = (
    previews: Map<string, PreviewEntry>,
    keyframes: readonly TimelineKeyframe[],
): void => {
    const live = new Map(keyframes.map((kf) => [kf.id, previewKey(kf)]));
    for (const [id, entry] of previews) {
        if (live.get(id) !== entry.key) previews.delete(id);
    }
};

/**
 * Fill one keyframe's preview slot, at most once per content.
 *
 * `ready`, `capturing` AND `failed` all answer *"this content is settled"*, so
 * a repeatedly-failing capture STOPS — and it SAYS SO, because the message is
 * carried in the entry the panel renders instead of being swallowed by a catch.
 * A failure un-sticks the moment the keyframe changes, because then it is a
 * different preview being asked for.
 *
 * The capture is injected rather than imported: the memo's rules are the same
 * whether the frame comes from html2canvas or from nowhere, and the two states
 * that were impossible to reach before are exactly the ones a caller has to be
 * able to provoke.
 */
export const capturePreview = async (
    previews: Map<string, PreviewEntry>,
    kf: TimelineKeyframe,
    capture: (percent: number) => Promise<string>,
): Promise<void> => {
    const key = previewKey(kf);
    if (previews.get(kf.id)?.key === key) return;
    previews.set(kf.id, { kind: "capturing", key });

    try {
        const src = await capture(kf.percent);
        // The keyframe may have been edited, removed or undone while the frame
        // was in flight; the capture is then of content nobody asked for.
        if (previews.get(kf.id)?.key !== key) return;
        previews.set(kf.id, { kind: "ready", key, src });
    } catch (error) {
        if (previews.get(kf.id)?.key !== key) return;
        previews.set(kf.id, {
            kind: "failed",
            key,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

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

    /**
     * A capture of what the scrub paints, as a PNG data URL — or a REJECTION
     * naming why there is none (KF.W7 G10 / D-4·L-4·C-5, G14 P1).
     *
     * This seam used to end in `catch { return null }` and a bare `return null`
     * for the no-target case: two silent failures that reached the hover cache
     * as an indistinguishable "nothing happened", so every hover re-entered and
     * re-failed forever with no reader ever told. Failure is a STATE here, and
     * a state has to be expressible — so the value is the data URL and the
     * failure is the rejection. `toDataURL` is inside the boundary on purpose:
     * a tainted canvas throws a SecurityError, which is a capture failure like
     * any other and belongs in the same channel as the rest.
     *
     * The `finally` restore is the invariant that survives untouched: whatever
     * happens, the scrub position the reader left behind is put back.
     */
    const scrubAndCapture = async (percent: number): Promise<string> => {
        // Capture WHAT THE SCRUB PAINTS. After the KF.W7 G2 seam the engine is
        // bound to the owner's detached preview subject, never to the scene, so
        // screenshotting `targets[0]` would return the scene's untouched pose
        // at every percent — a thumbnail that is the same picture N times.
        // `targets[0]` remains the fallback for the pre-build state, where
        // there is no engine and nothing has been scrubbed anyway.
        const target = animation.value?.targets[0] ?? targets.value[0];
        if (!target) throw new Error("No preview target mounted");

        const hasAnimation = !!animation.value;
        const prevT = scrubT.value;

        if (hasAnimation) {
            scrub(percent / 100);
            await nextFrame();
        }

        try {
            const { default: html2canvas } = await import("html2canvas");
            const canvas = await html2canvas(target, {
                scale: 0.5,
                logging: false,
                backgroundColor: null,
            });
            return canvas.toDataURL("image/png");
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
