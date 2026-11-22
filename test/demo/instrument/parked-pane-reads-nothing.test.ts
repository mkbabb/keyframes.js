/**
 * P2f — a parked controls pane does no per-frame work.
 *
 * Once an upright phone's pane has been mounted it stays mounted for its
 * scene, waiting unseen in a hidden park while the sheet is shut. Parked, it
 * must cost a playing scene nothing per frame: the Sequence lanes re-rendered
 * their playhead and its `aria-valuetext` every frame of a play, and the
 * keyframe Timeline's mirror read the transport's clock every frame, for a
 * pane nobody could see. Each reads the pane's `paneShown` fact
 * (usePaneShown.ts): parked, nothing reads the clock; shown again, each reads
 * it afresh.
 *
 * Born red: before the fact, both read the clock whatever the pane's state.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, provide, ref, shallowRef } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import type { SequenceTimelineSource } from "@composables/scene-facility/sequenceTimeline";
import { PANE_SHOWN_KEY } from "@components/instrument/pane/composables/usePaneShown";

const SequenceLanes = (await import("../../../demo/components/instrument/timeline/components/SequenceLanes.vue")).default;
const KeyframeTimeline = (await import("../../../demo/components/instrument/timeline/KeyframeTimeline.vue")).default;

let queue: FrameRequestCallback[] = [];
let now = 0;
beforeEach(() => {
    queue = [];
    now = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        queue.push(cb);
        return queue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
});
const mounts: Array<{ unmount: () => void }> = [];
afterEach(() => {
    while (mounts.length) mounts.pop()!.unmount();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

const frames = async (n: number) => {
    for (let i = 0; i < n; i++) {
        now += 1000 / 60;
        const due = queue;
        queue = [];
        for (const cb of due) cb(now);
        await nextTick();
    }
};

/** A sequence whose master clock is a plain reactive playhead. */
function sequenceSource() {
    const progress = ref(0);
    const source: SequenceTimelineSource = {
        lanes: () => [
            { index: 0, at: 0, span: 600, tone: "red" },
            { index: 1, at: 200, span: 600, tone: "blue" },
        ],
        duration: () => 1000,
        atMax: 400,
        progress: () => progress.value,
        isScrubbing: () => false,
        reseat: () => {},
        scrub: () => {},
        setScrubbing: () => {},
        setScrubDir: () => {},
        reset: () => {},
        preview: () => {},
        playReel: () => {},
        isReeling: () => false,
    };
    return { source, progress };
}

describe("the Sequence lanes in a parked pane", () => {
    it("render nothing while a play moves the clock, and read the clock afresh when shown", async () => {
        const { source, progress } = sequenceSource();
        const shown = shallowRef(false);
        let renders = 0;
        const w = mount(
            defineComponent(() => {
                provide(PANE_SHOWN_KEY, shown);
                return () => h(SequenceLanes, { source, onVnodeUpdated: () => renders++ });
            }),
            { attachTo: document.body },
        );
        mounts.push(w);
        const scrub = () => w.get('[role="slider"][aria-label="Scrub the sequence master clock"]');
        expect(scrub().attributes("aria-valuetext")).toBe("0 ms of 1000 ms");

        // A play: the clock moves every frame while the pane is parked.
        for (let i = 1; i <= 12; i++) {
            progress.value = i / 60;
            await nextTick();
        }
        expect(renders).toBe(0);
        expect(scrub().attributes("aria-valuetext")).toBe("0 ms of 1000 ms");

        // Shown: the lanes read the clock where it stands now.
        shown.value = true;
        await nextTick();
        expect(scrub().attributes("aria-valuetext")).toBe("200 ms of 1000 ms");
        // ... and follow it from then on.
        progress.value = 0.5;
        await nextTick();
        expect(scrub().attributes("aria-valuetext")).toBe("500 ms of 1000 ms");
    });

    it("on their own (no pane around them) follow the clock as before", async () => {
        const { source, progress } = sequenceSource();
        const w = mount(SequenceLanes, { props: { source }, attachTo: document.body });
        mounts.push(w);
        progress.value = 0.25;
        await nextTick();
        expect(w.get('[role="slider"][aria-label="Scrub the sequence master clock"]').attributes("aria-valuetext")).toBe(
            "250 ms of 1000 ms",
        );
    });
});

describe("the keyframe Timeline in a parked pane", () => {
    /** A running clock that counts the mirror's reads of it. */
    const runningClock = () => {
        const reads = { n: 0 };
        const clock = {
            get started() {
                reads.n++;
                return true;
            },
            paused: false,
            t: 250,
            options: { duration: 1000 },
        };
        return { clock, reads };
    };

    it("reads no frame of the clock while parked, and every frame once shown", async () => {
        const { clock, reads } = runningClock();
        const shown = shallowRef(false);
        const targets: HTMLElement[] = [document.createElement("div")];
        const w = mount(
            defineComponent(() => {
                provide(PANE_SHOWN_KEY, shown);
                return () => h(TooltipProvider, null, () => h(KeyframeTimeline, { targets, clock }));
            }),
            { attachTo: document.body, global: { stubs: { CSSCodeEditor: true, CSSPasteDialog: true } } },
        );
        mounts.push(w);
        await nextTick();
        await frames(10);
        expect(reads.n).toBe(0);

        shown.value = true;
        await nextTick();
        await frames(10);
        expect(reads.n).toBeGreaterThanOrEqual(9);

        // Parked again: the mirror stops.
        shown.value = false;
        await nextTick();
        const at = reads.n;
        await frames(10);
        expect(reads.n).toBe(at);
    });
});
