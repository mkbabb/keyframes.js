import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import type { Ref } from "vue";
import { useTimeline } from "../demo/@/components/custom/animation-controls/timeline/composables/useTimeline";
import type { TimelineKeyframe } from "../demo/@/components/custom/animation-controls/timeline/composables/timelineTypes";

/**
 * F.W14 — undo/redo for the destructive editor (the round-trip behavioural lock).
 *
 * The demo's timeline is a DESTRUCTIVE editor (clear-all / delete-frame / inline
 * CSS edits, all irreversible pre-F). F.W14 wraps the centralized `state` ref in
 * a scoped, DEBOUNCED `useRefHistory` so those ops become reversible via Mod+Z /
 * Mod+Shift+Z. These tests are the gate's behavioural clauses:
 *   1. an undo/redo round-trip restores then re-applies the prior keyframes;
 *   2. capture-on-COMMIT (debounced) — N rapid mutations within the debounce
 *      window collapse to ONE undo step, not N (the correctness keystone).
 *
 * `useRefHistory`'s debounce is driven by `setTimeout`, so the suite uses fake
 * timers + an `effectScope` (the composable owns internal watchers/rAF).
 */

const DEBOUNCE = 100;

function setup() {
    const scope = effectScope();
    const targets: Ref<HTMLElement[]> = ref([]);
    const tl = scope.run(() => useTimeline(targets))!;
    return { scope, tl };
}

/** Push a keyframe directly onto the centralized state (a destructive-adjacent
 * mutation the history must track), without going through the toast-emitting ops. */
function pushKeyframe(
    state: Ref<{ keyframes: TimelineKeyframe[] }>,
    percent: number,
    vars: Record<string, string> = {},
) {
    state.value.keyframes.push({
        id: `kf-test-${percent}-${Object.keys(vars).join(",")}`,
        percent,
        vars,
    });
}

/** Capture-on-commit: let the deep history watcher SEE the mutation + schedule
 * its debounce (nextTick), advance PAST the debounce window so the setTimeout
 * fires, then flush the watch callback that records the snapshot. */
async function commit() {
    await nextTick();
    vi.advanceTimersByTime(DEBOUNCE + 10);
    await nextTick();
    await nextTick();
}

describe("F.W14 — timeline undo/redo round-trip", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("undo restores the EXACT prior keyframes; redo re-applies (the round-trip)", async () => {
        const { scope, tl } = setup();
        try {
            // First committed edit: two keyframes.
            pushKeyframe(tl.state, 0, { opacity: "0" });
            pushKeyframe(tl.state, 100, { opacity: "1" });
            await commit();
            const prior = JSON.parse(JSON.stringify(tl.state.value.keyframes));
            expect(tl.state.value.keyframes).toHaveLength(2);
            expect(tl.canUndo.value).toBe(true);

            // The destructive op: clear() wipes the whole set.
            tl.clear();
            await commit();
            expect(tl.state.value.keyframes).toHaveLength(0);

            // Mod+Z → undo restores the EXACT prior state.
            tl.undo();
            await nextTick();
            expect(tl.state.value.keyframes).toHaveLength(2);
            expect(tl.state.value.keyframes).toEqual(prior);

            // Mod+Shift+Z → redo re-applies the clear.
            tl.redo();
            await nextTick();
            expect(tl.state.value.keyframes).toHaveLength(0);
        } finally {
            scope.stop();
        }
    });

    it("undo restores a prior CSS-edit (in-place vars mutation) — deep history", async () => {
        const { scope, tl } = setup();
        try {
            pushKeyframe(tl.state, 0, { opacity: "0" });
            pushKeyframe(tl.state, 100, { opacity: "1" });
            await commit();

            // Edit a frame's CSS in place (the inline-edit path mutates kf.vars).
            tl.state.value.keyframes[1]!.vars = { opacity: "0.5", color: "red" };
            await commit();
            expect(tl.state.value.keyframes[1]!.vars).toEqual({
                opacity: "0.5",
                color: "red",
            });

            // Mod+Z restores the prior CSS string for that frame.
            tl.undo();
            await nextTick();
            expect(tl.state.value.keyframes[1]!.vars).toEqual({ opacity: "1" });
        } finally {
            scope.stop();
        }
    });

    it("captures on COMMIT, not per-keystroke — N rapid edits = ONE undo step", async () => {
        const { scope, tl } = setup();
        try {
            // A baseline committed edit so canUndo starts from a known point.
            pushKeyframe(tl.state, 0, { opacity: "0" });
            await commit();

            const undoableNow = () => {
                let steps = 0;
                while (tl.canUndo.value) {
                    tl.undo();
                    steps++;
                    // guard against an unexpected unbounded trail
                    if (steps > 100) break;
                }
                return steps;
            };

            // Simulate a multi-keystroke CSS edit: N in-place mutations WITHIN one
            // debounce window. With per-keystroke capture this would be N entries;
            // with capture-on-commit it collapses to ONE.
            const N = 8;
            for (let i = 0; i < N; i++) {
                tl.state.value.keyframes[0]!.vars = { opacity: `${i / 10}` };
                vi.advanceTimersByTime(10); // all inside the 100ms debounce window
                await nextTick();
            }
            // Close the window — exactly one commit lands for the N mutations.
            await commit();

            // After the baseline commit + the single collapsed edit commit, the
            // trail is exactly 2 undoable steps (not 1 + N).
            const steps = undoableNow();
            expect(steps).toBe(2);
        } finally {
            scope.stop();
        }
    });
});
