/**
 * X-DS kf pass 3 · KF-C3-15 — a PARTIAL stored bucket (a share patch, or a
 * bucket persisted before a member existed) left `isControlsPanelOpen`
 * undefined, and ChromeDock warned "Expected Boolean, got Undefined" and ran its
 * toggle logic on it. The store's one default boundary backfills every absent
 * member and keeps a stored `null`.
 */
import { describe, expect, it } from "vitest";
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
