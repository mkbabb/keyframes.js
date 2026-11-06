/**
 * The Monaco keyframes pane mounts on intent only (useKeyframesPaneReveal).
 *
 * MEASURED (kf-load L0, docs/evidence/o1105-kf-load): every cold `#/spring`
 * and `#/easing` load fetched and evaluated `vendor-monaco` within 10 s: an
 * idle callback (`{ timeout: 4000 }`, a 1.5 s timer where absent) flipped the
 * pane's warm flag, the force-mounted pane booted Monaco, and its Prettier
 * format followed, for a surface nobody had opened.
 *
 * The witness: setting the composable up arms no idle callback and no timer,
 * and the flag stays false until the Keyframes surface is the selected one;
 * a deep link that lands on Keyframes mounts at once.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import { getStoredAnimationGroupControlOptions } from "@state";
import { useKeyframesPaneReveal } from "@components/instrument/pane/channel-controls/composables/useKeyframesPaneReveal";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("the Keyframes pane warms on intent, never at idle", () => {
    it("arms no idle warm and stays cold until the surface is selected", async () => {
        const idle = vi.fn(() => 1);
        vi.stubGlobal("requestIdleCallback", idle);
        vi.useFakeTimers();
        const storedControls = getStoredAnimationGroupControlOptions("kf-pane-intent-a");
        storedControls.selectedControl = "controls";
        const warmed = ref(false);
        const scope = effectScope();
        scope.run(() => useKeyframesPaneReveal({ storedControls, keyframesPaneEl: ref(null), keyframesWarmed: warmed }));
        try {
            vi.advanceTimersByTime(10_000);
            expect(idle).not.toHaveBeenCalled();
            expect(warmed.value).toBe(false);
            storedControls.selectedControl = "keyframes";
            await nextTick();
            expect(warmed.value).toBe(true);
        } finally {
            scope.stop();
        }
    });

    it("a deep link that lands on Keyframes mounts the pane at once", () => {
        const storedControls = getStoredAnimationGroupControlOptions("kf-pane-intent-b");
        storedControls.selectedControl = "keyframes";
        const warmed = ref(false);
        const scope = effectScope();
        scope.run(() => useKeyframesPaneReveal({ storedControls, keyframesPaneEl: ref(null), keyframesWarmed: warmed }));
        try {
            expect(warmed.value).toBe(true);
        } finally {
            scope.stop();
        }
    });
});
