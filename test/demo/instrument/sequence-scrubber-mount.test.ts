// SERVED MODEL: claude-opus-5[1m]
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import SequenceScrubber from "../../../demo/scenes/sequence/SequenceScrubber.vue";
import { SEQUENCE_DEMO_KEY } from "../../../demo/scenes/sequence/sequenceKeys";
import type { SequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";

/**
 * KF.W7 G11 fixture 4 — SEQUENCESCRUBBER IS MOUNTED BY A TEST AT ALL.
 *
 * kf-SequenceScrubber L·D-12, the banked N-10 coverage class's SECOND instance:
 * "no spec mounts SequenceScrubber; the keyboard divergence is exactly what a
 * mount test reds on run one." G1 ruled the surface KEEP-BESPOKE
 * (G1-VERDICT-TABLE §2.4), so its shape rows PERSIST and this mount is the
 * coverage they were missing. Clauses:
 *
 *   • THE PROVIDER GUARD (C·C-4, narrowed by `.a` to "a one-line provider
 *     guard + declaring the asymmetry") — born RED: `inject(SEQUENCE_DEMO_KEY)!`
 *     asserts a provider it never checks, so a mount outside the scene dies
 *     inside the RENDER with `Cannot read properties of undefined (reading
 *     'progress')` — a failure that names neither the contract nor the seam.
 *   • THE DIRECTION LATCH (S-4 / the ignition cascade) — `setScrubDir` must
 *     report 1 while the thumb advances and -1 the moment it draws back, and it
 *     must latch per SAMPLE, not per gesture.
 *   • PROJECTION — the rail rect-ratio, clamped at both ends, is what reaches
 *     `scrub`; the keyboard routes (arrows / Home / End) reach the same verb.
 */

type ScrubberStub = {
    demo: SequenceDemo;
    scrub: ReturnType<typeof vi.fn>;
    setScrubDir: ReturnType<typeof vi.fn>;
    setScrubbing: ReturnType<typeof vi.fn>;
};

/** The canonical clock's span the stub publishes (the default staircase). */
const DURATION = 1940;

/**
 * The scrubber injects the whole `SequenceDemo`, but reads a handful of its
 * members. The stub carries those and is cast once, at the seam, rather than
 * re-authoring the whole scene object per test.
 */
function stubDemo(progress = 0): ScrubberStub {
    const scrub = vi.fn();
    const setScrubDir = vi.fn();
    const setScrubbing = vi.fn();
    const demo = {
        progress: ref(progress),
        duration: ref(DURATION),
        scrub,
        setScrubDir,
        setScrubbing,
    } as unknown as SequenceDemo;
    return { demo, scrub, setScrubDir, setScrubbing };
}

const RAIL = { left: 100, width: 400 };

function mountScrubber(stub: ScrubberStub) {
    const wrapper = mount(SequenceScrubber, {
        global: { provide: { [SEQUENCE_DEMO_KEY as symbol]: stub.demo } },
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

describe("SequenceScrubber — the mount (KF.W7 G11 fixture 4)", () => {
    // C·C-4 — born RED (a TypeError from inside the render, naming 'progress').
    it("names its provider contract when mounted outside the sequence scene", () => {
        expect(() => mount(SequenceScrubber)).toThrowError(
            /SEQUENCE_DEMO_KEY|sequence scene/i,
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
});
