/**
 * test/demo/instrument/timeline-track-geometry.test.ts — X.KF.W13X.timeline,
 * the rail's geometry and registers:
 *
 *   KFA-172    the playhead is placed by a whole-pixel translate, not `left: %`
 *   KFA-173    the caret readouts hang below the rail (they straddled its border)
 *   UIA-KF-187 every mark sits on an inset lane, so end diamonds stay inside
 *   UIA-KF-178 a graduation a stop already labels is not labelled twice
 *   UIA-KF-180 the pan row collapses at zoom 1 (it held a dead band)
 *   UIA-KF-181/185 the rail and stage take role radii; the count is a glass Badge
 *
 * Served witness: `evidence/W13X/timeline/tl.mjs` — `caret` (readout top minus
 * rail bottom: −8 px at the before bytes), `mk` (end diamonds inside the rail:
 * 0·1·0), `pan` (22/18 px band at zoom 1), `rad` (10 px / 10 px).
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TimelineTrack from "../../../demo/components/instrument/timeline/components/TimelineTrack.vue";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";
import type { TimelineKeyframe } from "../../../demo/components/instrument/timeline/timelineTypes";
import { percentSelector } from "../../../demo/utils/keyframeSelector";

const kf = (id: string, percent: number): TimelineKeyframe => ({
    id,
    selector: percentSelector(percent),
    percent,
    vars: { opacity: "1" },
});

const mounts: Array<{ unmount: () => void }> = [];
afterEach(() => {
    while (mounts.length) mounts.pop()!.unmount();
    document.body.innerHTML = "";
});

const mountTrack = (keyframes: TimelineKeyframe[], scrubT = 0.37) => {
    const w = mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(TimelineTrack, { sortedKeyframes: keyframes, scrubT, selectedKeyframeId: null }),
            ),
        ),
        { attachTo: document.body },
    );
    mounts.push(w);
    return w;
};

describe("the Timeline rail's geometry", () => {
    it("KFA-172 — places the playhead by a whole-pixel translate", () => {
        const w = mountTrack([kf("a", 0), kf("b", 100)]);
        const head = w.get<HTMLElement>(".timeline-playhead").element;
        expect(head.style.left).toBe("");
        expect(head.style.transform).toMatch(/^translateX\(-?\d+px\)$/);
    });

    it("KFA-173 — hangs every caret below the rail, never across its border", () => {
        const w = mountTrack([kf("a", 0), kf("b", 50), kf("c", 100)]);
        const carets = w.findAll<HTMLElement>(".timeline-caret");
        expect(carets).toHaveLength(3);
        for (const caret of carets) {
            expect(caret.element.style.top).toMatch(/^calc\(100% \+/);
        }
    });

    it("UIA-KF-187 — puts every mark on the inset lane, the end diamonds centred on their stop", () => {
        const w = mountTrack([kf("a", 0), kf("b", 100)]);
        const lane = w.get(".timeline-track > .timeline-lane");
        const markers = lane.findAll(".keyframe-marker");
        expect(markers).toHaveLength(2);
        for (const marker of markers) {
            expect(marker.classes()).toContain("-translate-x-1/2");
            expect(marker.classes()).not.toContain("translate-x-0");
            expect(marker.classes()).not.toContain("-translate-x-full");
        }
        expect(lane.find(".timeline-caret").exists()).toBe(true);
        expect(lane.find(".timeline-playhead").exists()).toBe(true);
    });

    it("UIA-KF-178 — does not label a graduation a stop already labels", () => {
        const w = mountTrack([kf("a", 0), kf("b", 100)]);
        const ticks = w.findAll(".timeline-tick-label").map((t) => t.text());
        expect(ticks).not.toContain("0%");
        expect(ticks).not.toContain("100%");
        expect(ticks).toContain("50%");
    });

    it("UIA-KF-180 — collapses the pan row while there is nothing to pan", () => {
        const w = mountTrack([kf("a", 0), kf("b", 100)]);
        const collapse = w.get(".timeline-pan-collapse");
        expect(collapse.classes()).toContain("grid-rows-[0fr]");
        expect(collapse.find(".timeline-pan-row").attributes("aria-hidden")).toBe("true");
    });

    it("UIA-KF-181/185 · KF-C5-03 — the rail wears the field radius role, and a shared stop's count reads in its caret, not on the diamond", () => {
        const w = mountTrack([kf("a", 30), kf("b", 30), kf("c", 90)]);
        const rail = w.get(".timeline-track");
        expect(rail.classes()).toContain("rounded-[var(--radius-field)]");
        expect(rail.classes()).not.toContain("rounded-lg");
        // X-DS pass 5 (KF-C5-03): the Badge covered the 16px mark it annotated.
        expect(w.findAll(".keyframe-marker .stop-count")).toHaveLength(0);
        const count = w.get(".timeline-caret-readout .stop-count");
        expect(count.text()).toBe("×2");
        const readout = count.element.closest(".timeline-caret-readout")!;
        expect(readout.textContent?.replace(/\s+/g, "")).toBe("30%×2");
        expect(readout.getAttribute("aria-label")).toContain("2 keyframes");
    });

    it("UIA-KF-181/185 · UIA-KF-083 — the stage wears the media radius role and waits for an animation", () => {
        const w = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(KeyframeTimeline, { targets: [document.createElement("div")] }),
                ),
            ),
            { attachTo: document.body, global: { stubs: { CSSCodeEditor: true, CSSPasteDialog: true } } },
        );
        mounts.push(w);
        const stage = w.get<HTMLElement>(".timeline-preview-stage");
        expect(stage.classes()).toContain("rounded-[var(--radius-media)]");
        expect(stage.classes()).not.toContain("rounded-lg");
        expect(stage.element.style.display).toBe("none"); // 0 keyframes: the empty state owns the space
    });
});
