/**
 * X.KF.W13X.r4pane · UIA-KF-105 — the desktop rail's one frame is the glass
 * Card AT REST: no `cartoon-surface` stamp (glass's 2px rim + the hard 0-blur
 * `--shadow-cartoon-md` offset cast), which read as a second slab under every
 * controls card. The owner's O-87 ruling puts stacked chrome shadows out; the
 * resting Card's single edge is the frame.
 *
 * ChannelControls, RibbonBar and SequenceTimeline are stubbed at their seams;
 * the pane wrapper and glass's Card are REAL (jsdom has no matchMedia, so the
 * wrapper takes its desktop-rail branch, where the frame is the Card).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";

vi.mock("../../../demo/components/instrument/transport/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({ name: "ChannelControlsStub", setup: () => () => h("div") }),
}));
vi.mock("../../../demo/components/instrument/transport/controls-pane/RibbonBar.vue", () => ({
    default: defineComponent({ name: "RibbonBarStub", setup: () => () => h("div") }),
}));
vi.mock("../../../demo/components/instrument/timeline/SequenceTimeline.vue", () => ({
    default: defineComponent({ name: "SequenceTimelineStub", setup: () => () => h("div") }),
}));

const { default: ControlsPaneWrapper } =
    await import("../../../demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue");

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
});

async function mountRail() {
    const storedControls = reactive({
        selectedAnimation: "a",
        selectedControl: "controls",
        isControlsPanelOpen: true,
        isTimelineExpanded: false,
    });
    const group = {
        animations: { a: { animation: { id: "a" }, layer: undefined } },
        singleTarget: true,
    };
    const el = document.createElement("div");
    document.body.appendChild(el);
    const app = createApp(
        defineComponent({
            setup: () => () =>
                h(ControlsPaneWrapper as any, {
                    animationGroup: group,
                    blendAvailable: true,
                    storedControls,
                    isPlaying: false,
                }),
        }),
    );
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    await nextTick();
    return el;
}

describe("UIA-KF-105 — the rail frame is the resting glass Card, unstamped", () => {
    it("the desktop frame is one Card with no cartoon stamp", async () => {
        const el = await mountRail();
        const frames = el.querySelectorAll(".pane-frame");
        expect(frames.length).toBe(1);
        const frame = frames[0] as HTMLElement;
        expect(frame.classList.contains("card")).toBe(true);
        expect(frame.classList.contains("cartoon-surface")).toBe(false);
        expect(el.querySelectorAll(".cartoon-surface").length).toBe(0);
    });
});
