/**
 * X.KF.W13X.mobile · UIA-KF-008 / A2-KE-L3-13 — a scene FACET renders on its
 * own surface only.
 *
 * The scene facet bodies (easing Curve = EasingSidebar, spring Physics =
 * SpringPhysicsFacet, cube Matrix Controls) flow through the pane's
 * `tabs-content` slot. Easing and spring supplied theirs ungated, so the Curve
 * and Physics plates rendered under the Controls, Keyframes and Timeline
 * surfaces too (1440 frames: the Curve card wedged between Monaco and its
 * action bar; spring Timeline showing Physics with the timeline out of view).
 * The cure renders the facet slot CENTRALLY, in the one pane host, only while
 * the selected surface is a facet (not a BUILT_IN surface) — so no scene can
 * forget the gate.
 *
 * ChannelControls is stubbed at its seam (it renders the slot it is handed);
 * the pane wrapper is REAL — the gate is the wrapper's.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";

vi.mock("../../../demo/components/instrument/transport/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({
        name: "ChannelControlsStub",
        setup(_p, { slots }) {
            return () => h("div", { "data-stub": "ChannelControls" }, slots["tabs-content"]?.());
        },
    }),
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

async function mountOn(selectedControl: string) {
    const storedControls = reactive({
        selectedAnimation: "a",
        selectedControl,
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
            setup() {
                return () =>
                    h(
                        ControlsPaneWrapper as any,
                        {
                            animationGroup: group,
                            blendAvailable: true,
                            storedControls,
                            isPlaying: false,
                            activeKeyframesRef: null,
                            activeTimelineRef: null,
                        },
                        { "tabs-content": () => h("section", { class: "facet-body" }, "facet") },
                    );
            },
        }),
    );
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    await nextTick();
    return el;
}

describe("UIA-KF-008 — the scene facet renders on its own surface only", () => {
    it.each(["controls", "keyframes", "timeline"])(
        "a BUILT_IN surface (%s) renders no facet body",
        async (surface) => {
            const el = await mountOn(surface);
            expect(el.querySelector("[data-stub=ChannelControls]")).not.toBeNull();
            expect(el.querySelectorAll(".facet-body").length).toBe(0);
        },
    );

    it.each(["easing", "spring", "matrix-controls"])(
        "the facet surface (%s) renders its body once",
        async (surface) => {
            const el = await mountOn(surface);
            expect(el.querySelectorAll(".facet-body").length).toBe(1);
        },
    );
});
