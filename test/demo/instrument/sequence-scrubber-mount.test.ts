// SERVED MODEL: claude-opus-5[1m]
// RE-SEATED X.KF.W13V.s2 (claude-opus-5-5): the master scrub left the stage for
// the shared Timeline pane's Sequence mode (§0cw ESC-s-1 (b)); its rail is now
// the pane leaf `SequenceLanes`'s playhead control, fed by the channel's
// `SequenceTimelineSource` instead of an injected demo. Every clause below is
// the same property on the moved control.
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SequenceLanes from "../../../demo/components/instrument/timeline/components/SequenceLanes.vue";
import type { SequenceTimelineSource } from "../../../demo/components/instrument/timeline/timelineTypes";

/**
 * KF.W7 G11 fixture 4 — THE MASTER SCRUB IS MOUNTED BY A TEST AT ALL.
 *
 * kf-SequenceScrubber L·D-12, the banked N-10 coverage class's SECOND instance:
 * "no spec mounts SequenceScrubber; the keyboard divergence is exactly what a
 * mount test reds on run one." G1 ruled the surface KEEP-BESPOKE
 * (G1-VERDICT-TABLE §2.4), so its shape rows PERSIST and this mount is the
 * coverage they were missing. Clauses:
 *
 *   • THE SOURCE GUARD (C·C-4, narrowed by `.a` to "a one-line provider
 *     guard + declaring the asymmetry") — a mount without its Sequence source
 *     names the contract, never a TypeError from inside the render.
 *   • THE DIRECTION LATCH (S-4 / the ignition cascade) — `setScrubDir` must
 *     report 1 while the thumb advances and -1 the moment it draws back, and it
 *     must latch per SAMPLE, not per gesture.
 *   • PROJECTION — the rail rect-ratio, clamped at both ends, is what reaches
 *     `scrub`; the keyboard routes (arrows / Home / End) reach the same verb.
 */

type ScrubberStub = {
    source: SequenceTimelineSource;
    scrub: ReturnType<typeof vi.fn>;
    setScrubDir: ReturnType<typeof vi.fn>;
    setScrubbing: ReturnType<typeof vi.fn>;
};

/** The canonical clock's span the stub publishes (the default staircase). */
const DURATION = 1940;

/**
 * The master scrub reads the channel's Sequence source; the stub carries a
 * lane-less source (the scrub rail is then the leaf's only slider) whose verbs
 * are spies.
 */
function stubDemo(progress = 0): ScrubberStub {
    const scrub = vi.fn();
    const setScrubDir = vi.fn();
    const setScrubbing = vi.fn();
    const source: SequenceTimelineSource = {
        lanes: () => [],
        duration: () => DURATION,
        atMax: 1600,
        progress: () => progress,
        isScrubbing: () => false,
        reseat: vi.fn(),
        scrub,
        setScrubbing,
        setScrubDir,
        reset: vi.fn(),
    };
    return { source, scrub, setScrubDir, setScrubbing };
}

const RAIL = { left: 100, width: 400 };

function mountScrubber(stub: ScrubberStub) {
    const wrapper = mount(SequenceLanes, {
        props: { source: stub.source },
        attachTo: document.body,
    });
    const rail = wrapper.get('[role="slider"]');
    // jsdom lays nothing out; the rail's geometry is the projector's only input.
    (rail.element as HTMLElement).getBoundingClientRect = () =>
        ({ left: RAIL.left, width: RAIL.width, right: RAIL.left + RAIL.width })
            .valueOf() as DOMRect;
    return { wrapper, rail };
}

/** A pointer sample at the fraction `p` of the rail. */
const at = (p: number) =>
    new PointerEvent("pointermove", {
        clientX: RAIL.left + RAIL.width * p,
        bubbles: true,
    });

describe("The Timeline pane's master scrub — the mount (KF.W7 G11 fixture 4)", () => {
    // C·C-4 — a mount without its source names the contract.
    it("names its source contract when mounted without a Sequence source", () => {
        expect(() => mount(SequenceLanes)).toThrowError(
            /SequenceTimelineSource|Sequence source/i,
        );
    });

    it("mounts inside the scene and publishes the master clock as an AT slider", () => {
        const stub = stubDemo(0.25);
        const { rail } = mountScrubber(stub);
        expect(rail.attributes("aria-valuenow")).toBe("25");
        expect(rail.attributes("aria-valuemin")).toBe("0");
        expect(rail.attributes("aria-valuemax")).toBe("100");
        expect(rail.attributes("aria-label")).toBeTruthy();
    });

    it("projects a press onto the rail's rect-ratio and reports the gesture", () => {
        const stub = stubDemo(0);
        const { rail } = mountScrubber(stub);
        rail.element.dispatchEvent(
            new PointerEvent("pointerdown", {
                clientX: RAIL.left + RAIL.width * 0.5,
                bubbles: true,
            }),
        );
        expect(stub.setScrubbing).toHaveBeenCalledWith(true);
        expect(stub.scrub).toHaveBeenCalledWith(0.5);
    });

    it("clamps the projection at both rail ends", () => {
        const stub = stubDemo(0);
        const { rail } = mountScrubber(stub);
        rail.element.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: 0, bubbles: true }),
        );
        expect(stub.scrub).toHaveBeenLastCalledWith(0);
        window.dispatchEvent(at(2));
        expect(stub.scrub).toHaveBeenLastCalledWith(1);
    });

    it("latches the direction PER SAMPLE — forward, then back on a drag-back", () => {
        const stub = stubDemo(0);
        const { rail } = mountScrubber(stub);
        rail.element.dispatchEvent(
            new PointerEvent("pointerdown", {
                clientX: RAIL.left + RAIL.width * 0.2,
                bubbles: true,
            }),
        );
        window.dispatchEvent(at(0.6));
        window.dispatchEvent(at(0.9));
        window.dispatchEvent(at(0.4));
        const dirs = stub.setScrubDir.mock.calls.map((c) => c[0]);
        expect(dirs.slice(-3)).toEqual([1, 1, -1]);
        window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
        expect(stub.setScrubbing).toHaveBeenLastCalledWith(false);
    });

    it("routes every keyboard verb to the same scrub seam the pointer uses", () => {
        const stub = stubDemo(0.5);
        const { rail } = mountScrubber(stub);
        const key = (k: string) =>
            rail.element.dispatchEvent(
                new KeyboardEvent("keydown", { key: k, bubbles: true }),
            );
        key("ArrowRight");
        expect(stub.scrub).toHaveBeenLastCalledWith(0.55);
        key("ArrowLeft");
        expect(stub.scrub).toHaveBeenLastCalledWith(0.45);
        key("Home");
        expect(stub.scrub).toHaveBeenLastCalledWith(0);
        key("End");
        expect(stub.scrub).toHaveBeenLastCalledWith(1);
    });

    // ── X.KF.W11.d — the gesture-spec cases (the remainder of L·D-12) ────────

    it("the keyboard writes the direction latch and lights the well (N-3 · N-13 — the applyScrub spec)", () => {
        const stub = stubDemo(0.5);
        const { rail } = mountScrubber(stub);
        rail.element.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
        );
        expect(stub.setScrubDir).toHaveBeenLastCalledWith(-1);
        expect(stub.setScrubbing).toHaveBeenLastCalledWith(true);
        rail.element.dispatchEvent(
            new KeyboardEvent("keyup", { key: "ArrowLeft", bubbles: true }),
        );
        expect(stub.setScrubbing).toHaveBeenLastCalledWith(false);
        rail.element.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        );
        expect(stub.setScrubDir).toHaveBeenLastCalledWith(1);
        rail.element.dispatchEvent(new FocusEvent("blur"));
        expect(stub.setScrubbing).toHaveBeenLastCalledWith(false);
    });

    it("a zero-delta sample leaves the direction untouched (C-12's deadband)", () => {
        const stub = stubDemo(0);
        const { rail } = mountScrubber(stub);
        rail.element.dispatchEvent(
            new PointerEvent("pointerdown", {
                clientX: RAIL.left + RAIL.width * 0.5,
                bubbles: true,
            }),
        );
        window.dispatchEvent(at(0.5));
        window.dispatchEvent(at(0.5));
        expect(stub.setScrubDir).toHaveBeenCalledTimes(1);
        expect(stub.scrub).toHaveBeenCalledTimes(3);
        window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    });

    it("announces the canonical unit — milliseconds on the master clock (N-14, after N-1)", () => {
        const stub = stubDemo(0.25);
        const { rail } = mountScrubber(stub);
        expect(rail.attributes("aria-valuetext")).toBe(
            `${Math.round(0.25 * DURATION)} ms of ${DURATION} ms`,
        );
        expect(rail.attributes("aria-label")).toMatch(/master clock/);
    });

    it("a rail without geometry projects the current clock, never NaN (the projector guard)", () => {
        const stub = stubDemo(0.25);
        const { rail } = mountScrubber(stub);
        (rail.element as HTMLElement).getBoundingClientRect = () =>
            ({ left: 0, width: 0, right: 0 }).valueOf() as DOMRect;
        rail.element.dispatchEvent(
            new PointerEvent("pointerdown", { clientX: 50, bubbles: true }),
        );
        expect(stub.scrub).toHaveBeenLastCalledWith(0.25);
        expect(Number.isNaN(stub.scrub.mock.calls.at(-1)?.[0])).toBe(false);
        window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    });
});
