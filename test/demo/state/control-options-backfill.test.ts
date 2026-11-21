/**
 * X-DS kf pass 3 · KF-C3-15 — a PARTIAL stored bucket (a share patch, or a
 * bucket persisted before a member existed) left `isControlsPanelOpen`
 * undefined, and ChromeDock warned "Expected Boolean, got Undefined" and ran its
 * toggle logic on it. The store's one default boundary backfills every absent
 * member and keeps a stored `null`.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
    _resetAnimationGroupsControlOptionsStore,
    getStoredAnimationGroupControlOptions,
    useAnimationGroupsControlOptionsStore,
} from "../../../demo/state/controlOptionsStore";

describe("KF-C3-15 — the stored bucket's defaults", () => {
    it("backfills absent members of a partial bucket and keeps a stored null", () => {
        _resetAnimationGroupsControlOptionsStore();
        const store = useAnimationGroupsControlOptionsStore();
        store.value.cube = {
            selectedControl: "timeline",
            selectedAnimation: null,
        } as never;
        const controls = getStoredAnimationGroupControlOptions("cube");
        expect(controls.isControlsPanelOpen).toBe(true);
        expect(controls.isTimelineExpanded).toBe(false);
        expect(controls.keyframeControls.selectedKeyframesControl).toBe("keyframes");
        expect(controls.selectedControl).toBe("timeline");
        expect(controls.selectedAnimation).toBeNull();
    });
});

describe("the stored bucket's rest follows the layout", () => {
    const width0 = window.innerWidth;
    afterEach(() => {
        Object.defineProperty(window, "innerWidth", { value: width0, configurable: true });
    });

    it("a fresh bucket starts with the controls closed under 1024 px and open at 1024 and over", () => {
        for (const [width, open] of [[390, false], [1023, false], [1024, true], [1440, true]] as const) {
            Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
            _resetAnimationGroupsControlOptionsStore();
            expect(getStoredAnimationGroupControlOptions("cube").isControlsPanelOpen).toBe(open);
        }
    });
});
