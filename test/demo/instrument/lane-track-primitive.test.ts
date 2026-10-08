/**
 * X.KF.W13X.esc3 — ESC-W13X-tl-1 (A2-KE-L1-9 consumer half · UIA-KF-099),
 * steps 1–2 (KF-W13.md addendum (g), COHESION §0er): ONE lane-track primitive.
 *
 * The banked defect: the one Timeline pane hosted two independent timeline
 * stacks, each with its own scrub, playhead, ruler and gesture code —
 * KeyframeTimeline → TimelineTrack (a rail slider, a tick ruler, a whole-pixel
 * playhead, the KF.W7 G2 pointer policy) and SequenceTimeline → SequenceLanes (a
 * hand-rolled master scrub, a playhead line, NO ruler, a second drag composable
 * with its own policy).
 *
 * (1) both adapters render the ONE primitive: the scrub slider each names is
 *     the LaneTrack's host, the playhead is the LaneTrack's, and the ruler is
 *     the LaneTrack's — the Sequence mode now carries one too;
 * (2) one pointer policy: a second contact (a pinch) ends a live re-time drag
 *     in the Sequence mode exactly as it ends a stop drag on the keyframe rail;
 * (3) one keyboard map: Shift+arrow on either scrub moves its page step.
 *
 * Step 3 (the rail from glass `Slider` draggable marks, O-59 / UIA-KF-280) is
 * ADOPT-AT-LANDING and not asserted here.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import TimelineTrack from "../../../demo/components/instrument/timeline/components/TimelineTrack.vue";
import SequenceLanes from "../../../demo/components/instrument/timeline/components/SequenceLanes.vue";
import type {
    SequenceTimelineSource,
    TimelineKeyframe,
} from "../../../demo/components/instrument/timeline/timelineTypes";
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

const mountTrack = () => {
    const onScrub = vi.fn();
    const w = mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(TimelineTrack, {
                    sortedKeyframes: [kf("a", 0), kf("b", 100)],
                    scrubT: 0.4,
                    selectedKeyframeId: null,
                    "onUpdate:scrubT": onScrub,
                }),
            ),
        ),
        { attachTo: document.body },
    );
    mounts.push(w);
    return { w, onScrub };
};

const SPAN = 900;
function mountLanes() {
    const ats = reactive([0, 260, 520]);
    let progress = 0.4;
    const src: SequenceTimelineSource = {
        lanes: () => ats.map((at, index) => ({ index, at, span: SPAN, tone: "red" })),
        duration: () => Math.max(...ats) + SPAN,
        atMax: 1600,
        progress: () => progress,
        isScrubbing: () => false,
        reseat: (i, at) => void (ats[i] = Math.min(Math.max(at, 0), 1600)),
        scrub: vi.fn((p: number) => void (progress = p)),
        setScrubbing: vi.fn(),
        setScrubDir: vi.fn(),
        reset: vi.fn(),
        preview: vi.fn(),
        playReel: vi.fn(),
        isReeling: () => false,
    };
    const w = mount(SequenceLanes, { props: { source: src }, attachTo: document.body });
    mounts.push(w);
    return { w, src, ats };
}

/** Lay the column out (jsdom has no layout) and give the host its capture API. */
const layOut = (root: HTMLElement) => {
    const column = root.querySelector<HTMLElement>(".lane-track-column");
    const host = column?.closest<HTMLElement>('[role="slider"]') ?? null;
    if (column) {
        column.getBoundingClientRect = () =>
            ({ left: 100, width: 400, right: 500, top: 0, bottom: 48, height: 48, x: 100, y: 0 }) as DOMRect;
    }
    // the lanes' own boxes span the same column (a stack that projects a drag
    // onto a lane's box reads the same geometry)
    for (const lane of root.querySelectorAll<HTMLElement>(".seq-lane-track")) {
        lane.getBoundingClientRect = () =>
            ({ left: 100, width: 400, right: 500, top: 0, bottom: 32, height: 32, x: 100, y: 0 }) as DOMRect;
    }
    if (host) {
        const captured = new Set<number>();
        host.setPointerCapture = (id: number) => void captured.add(id);
        host.releasePointerCapture = (id: number) => void captured.delete(id);
        host.hasPointerCapture = (id: number) => captured.has(id);
    }
    return { column, host };
};

describe("(1) both timeline stacks render the one LaneTrack", () => {
    it("the keyframe rail: its scrub, playhead and ruler are the LaneTrack's", () => {
        const { w } = mountTrack();
        const scrub = w.get('[role="slider"][aria-label="Playhead — scrub the animation"]');
        expect(scrub.classes(), "the scrub is the LaneTrack's host").toContain("lane-track-scrub");
        expect(w.findAll(".lane-track")).toHaveLength(1);
        expect(scrub.findAll("[data-lane-track-playhead]")).toHaveLength(1);
        expect(scrub.findAll(".lane-track-tick-label").length).toBeGreaterThan(0);
    });

    it("the sequence lanes: the master scrub, the playhead and a ruler are the LaneTrack's", () => {
        const { w } = mountLanes();
        const scrub = w.get('[role="slider"][aria-label="Scrub the sequence master clock"]');
        expect(scrub.classes(), "the scrub is the LaneTrack's host").toContain("lane-track-scrub");
        expect(w.findAll(".lane-track")).toHaveLength(1);
        expect(scrub.findAll("[data-lane-track-playhead]")).toHaveLength(1);
        const ruler = scrub.findAll(".lane-track-tick-label").map((t) => t.text());
        expect(ruler, "the sequence mode carries the one ruler, in ms").toEqual(["0", "355", "710", "1065", "1420"]);
        // every lane rides the one column
        expect(scrub.findAll(".lane-track-column .seq-lane-track")).toHaveLength(3);
    });
});

describe("(2) one pointer policy", () => {
    it("a second contact ends a live re-time drag in the sequence mode", async () => {
        const { w, ats } = mountLanes();
        const { host } = layOut(w.element as HTMLElement);
        const handle = w.findAll<HTMLElement>(".seq-lane-handle")[1]!.element;
        const at0 = ats[1]!;
        // the drawn centre of row 2's handle on the 400 px column
        const x0 = 100 + (parseFloat(handle.style.left) / 100) * 400;
        handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: x0, pointerId: 1, bubbles: true, isPrimary: true, button: 0 }));
        handle.dispatchEvent(new PointerEvent("pointerdown", { clientX: x0 + 50, pointerId: 2, bubbles: true, isPrimary: false, button: 0 }));
        (host ?? window).dispatchEvent(new PointerEvent("pointermove", { clientX: x0 + 80, pointerId: 1, bubbles: true }));
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: x0 + 80, pointerId: 1, bubbles: true }));
        await nextTick();
        expect(ats[1], "the pinch ended the drag: the row did not move").toBeCloseTo(at0, 0);
    });
});

describe("(3) one keyboard map", () => {
    it("Shift+arrow moves the page step on both scrubs", async () => {
        const t = mountTrack();
        await t.w.get('[aria-label="Playhead — scrub the animation"]').trigger("keydown", { key: "ArrowRight", shiftKey: true });
        expect(t.onScrub).toHaveBeenLastCalledWith(0.5);

        const s = mountLanes();
        await s.w.get('[aria-label="Scrub the sequence master clock"]').trigger("keydown", { key: "ArrowRight", shiftKey: true });
        expect(s.src.scrub).toHaveBeenLastCalledWith(0.65);
    });
});
