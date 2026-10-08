/**
 * test/demo/instrument/sequence-lanes-retime.test.ts — X.KF.W13X.timeline, the
 * Timeline pane's Sequence mode (rows re-homed from `.sequence`):
 *
 *   UIA-KF-031 (BROKEN) a re-time re-derives the master clock's span, and the
 *              lanes were drawn on the LIVE span while the drag projected onto
 *              the span at press — the handle slid out from under the pointer
 *              (served BEFORE x2, row 5: −11 … −90 px at 1440, −11 … −97 px at
 *              390 over a 120 px drag). The axis now holds still for the drag.
 *   UIA-KF-317 a held handle says it is held (`data-dragging`).
 *   UIA-KF-313 the focus ring is on the grip and the ball, not on the square
 *              hit hosts (no `kf-focus-ring` on the hosts).
 *   UIA-KF-317 (X.KF.W13X.dh2, the preview limb) a SETTLED re-time — a drag
 *              released, a key step — asks the stage to run the retimed row
 *              once (`source.preview`); a held drag never does (served
 *              witness: `evidence/W13X/dh2/dh2.mjs` D4/D5).
 *
 * Served witness: `evidence/W13X/timeline/seqpane.mjs` (before/after ×2).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick, reactive } from "vue";
import { mount } from "@vue/test-utils";
import SequenceLanes from "../../../demo/components/instrument/timeline/components/SequenceLanes.vue";
import type { SequenceTimelineSource } from "../../../demo/components/instrument/timeline/timelineTypes";

const SPAN = 900;
const LANE = { left: 100, width: 400 };

/** A source whose span re-derives from the items, as the real master clock's does. */
function source() {
    const ats = reactive([0, 260, 520]);
    const duration = () => Math.max(...ats) + SPAN;
    const src: SequenceTimelineSource = {
        lanes: () => ats.map((at, index) => ({ index, at, span: SPAN, tone: "red" })),
        duration,
        atMax: 1600,
        progress: () => 0,
        isScrubbing: () => false,
        reseat: (i, at) => void (ats[i] = Math.min(Math.max(at, 0), 1600)),
        scrub: vi.fn(),
        setScrubbing: vi.fn(),
        setScrubDir: vi.fn(),
        reset: vi.fn(),
        preview: vi.fn(),
        playReel: vi.fn(),
        isReeling: () => false,
    };
    return { src, ats, duration };
}

afterEach(() => {
    document.body.innerHTML = "";
});

function mountLanes() {
    const s = source();
    const wrapper = mount(SequenceLanes, { props: { source: s.src }, attachTo: document.body });
    // ESC-W13X-tl-1 — the lanes ride the one LaneTrack: a pointer projects onto
    // its time column (every lane spans it), and the drag's pointer is captured
    // by the track's host, which is where a browser then delivers its moves.
    const column = wrapper.get(".lane-track-column").element as HTMLElement;
    column.getBoundingClientRect = () =>
        ({ left: LANE.left, width: LANE.width, right: LANE.left + LANE.width }) as DOMRect;
    const host = column.closest<HTMLElement>('[role="slider"]')!;
    const captured = new Set<number>();
    host.setPointerCapture = (id: number) => void captured.add(id);
    host.releasePointerCapture = (id: number) => void captured.delete(id);
    host.hasPointerCapture = (id: number) => captured.has(id);
    return { wrapper, host, ...s };
}

/** The handle's drawn centre, in client px, from its `left: %` on the lane. */
const drawnX = (el: HTMLElement) => LANE.left + (parseFloat(el.style.left) / 100) * LANE.width;

describe("UIA-KF-031 — the re-time handle stays under the pointer", () => {
    it("draws every step of a span-growing drag where the pointer is", async () => {
        const { wrapper, host, duration } = mountLanes();
        const handle = wrapper.findAll<HTMLElement>(".seq-lane-handle")[2]!;
        const start = drawnX(handle.element);
        handle.element.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: start, bubbles: true, isPrimary: true, button: 0 }),
        );
        const spanAtPress = duration();
        for (const dx of [20, 40, 60, 80]) {
            host.dispatchEvent(new PointerEvent("pointermove", { clientX: start + dx, bubbles: true }));
            await nextTick();
            expect(duration()).toBeGreaterThan(spanAtPress); // the span DID grow under the drag
            expect(drawnX(handle.element)).toBeCloseTo(start + dx, 5);
        }
        host.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        await nextTick();
        wrapper.unmount();
    });

    it("UIA-KF-317 — marks the held handle for the life of the drag", async () => {
        const { wrapper, host } = mountLanes();
        const handle = wrapper.findAll<HTMLElement>(".seq-lane-handle")[1]!;
        expect(handle.attributes("data-dragging")).toBeUndefined();
        handle.element.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: drawnX(handle.element), bubbles: true, isPrimary: true, button: 0 }),
        );
        await nextTick();
        expect(handle.attributes("data-dragging")).toBe("");
        host.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        await nextTick();
        expect(handle.attributes("data-dragging")).toBeUndefined();
        wrapper.unmount();
    });
});

describe("UIA-KF-317 — a settled re-time previews the retimed row (X.KF.W13X.dh2)", () => {
    it("previews on release, never under a held drag", async () => {
        const { wrapper, host, src } = mountLanes();
        const handle = wrapper.findAll<HTMLElement>(".seq-lane-handle")[2]!;
        const start = drawnX(handle.element);
        handle.element.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: start, bubbles: true, isPrimary: true, button: 0 }),
        );
        host.dispatchEvent(new PointerEvent("pointermove", { clientX: start + 30, bubbles: true }));
        await nextTick();
        expect(src.preview).not.toHaveBeenCalled();
        host.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        await nextTick();
        expect(src.preview).toHaveBeenCalledTimes(1);
        expect(src.preview).toHaveBeenCalledWith(2);
        wrapper.unmount();
    });

    it("previews each key step on the stepped row", async () => {
        const { wrapper, src, ats } = mountLanes();
        const handle = wrapper.findAll<HTMLElement>(".seq-lane-handle")[1]!;
        await handle.trigger("keydown", { key: "ArrowRight" });
        expect(ats[1]).toBe(300);
        expect(src.preview).toHaveBeenCalledWith(1);
        await handle.trigger("keydown", { key: "Tab" });
        expect(src.preview).toHaveBeenCalledTimes(1); // a non-step key re-times nothing
        wrapper.unmount();
    });
});

describe("UIA-KF-313 — the ring sits on the control's own shape", () => {
    it("puts no box ring on the square hit hosts", () => {
        const { wrapper } = mountLanes();
        for (const host of wrapper.findAll('[role="slider"]')) {
            expect(host.classes()).not.toContain("kf-focus-ring");
        }
        wrapper.unmount();
    });
});
