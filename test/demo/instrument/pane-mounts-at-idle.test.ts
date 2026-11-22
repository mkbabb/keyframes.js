/**
 * P2f — an upright phone's controls pane is mounted at idle, not by the first
 * Controls press.
 *
 * The first press used to mount the whole pane inside the sheet's own first
 * frame: a 140 to 190 ms task on a 4x phone before anything moved. The pane is
 * now mounted once the page has painted and gone idle (never inside a scene
 * change), waits in a hidden park, and is carried, not remounted, into the
 * sheet when it opens and back when it closes. A press that comes before the
 * idle still mounts it with the sheet.
 *
 * Born red: before the change no pane existed until the press, and every open
 * mounted a new one.
 *
 * The glass Sheet and Dialog are stubbed at their seams (the Dialog renders its
 * content only while open, as reka's does); the pane wrapper is real, and the
 * channel host is a stub that counts its mounts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, onMounted, onUnmounted, reactive } from "vue";

vi.mock("@mkbabb/glass-ui/sheet", () => ({
    SheetContent: defineComponent({
        name: "SheetContentStub",
        inheritAttrs: false,
        props: ["side", "detents", "detent", "scroll"],
        emits: ["update:detent"],
        setup: (_p, { slots }) => () => h("div", { "data-stub": "SheetContent" }, slots.default?.()),
    }),
}));
vi.mock("@mkbabb/glass-ui/dialog", () => ({
    Dialog: defineComponent({
        props: ["open", "modal"],
        setup: (p, { slots }) => () => (p.open ? slots.default?.() : null),
    }),
    DialogTitle: defineComponent({ setup: (_p, { slots }) => () => h("h2", slots.default?.()) }),
}));
const hostMounts = { n: 0, gone: 0 };
vi.mock("@components/instrument/pane/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({
        name: "ChannelControlsStub",
        setup: () => {
            onMounted(() => hostMounts.n++);
            onUnmounted(() => hostMounts.gone++);
            return () => h("div", { "data-stub": "ChannelControls" });
        },
    }),
}));
vi.mock("@components/instrument/pane/RibbonBar.vue", () => ({
    default: defineComponent({ name: "RibbonBarStub", setup: () => () => h("div") }),
}));
vi.mock("../../../demo/components/instrument/timeline/SequenceTimeline.vue", () => ({
    default: defineComponent({ name: "SequenceTimelineStub", setup: () => () => h("div") }),
}));

let viewport = { w: 390, h: 844 };
function matches(q: string): boolean {
    let ok = true;
    for (const [, kind, axis, px] of q.matchAll(/\((max|min)-(width|height): (\d+)px\)/g)) {
        const v = axis === "height" ? viewport.h : viewport.w;
        ok &&= kind === "max" ? v <= Number(px) : v >= Number(px);
    }
    return ok;
}
Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
        matches: matches(query),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
    }),
});

const { default: ControlsPaneWrapperBare } = await import("@components/instrument/pane/ControlsPaneWrapper.vue");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

let frames: FrameRequestCallback[] = [];
let idles: Array<() => void> = [];
beforeEach(() => {
    frames = [];
    idles = [];
    hostMounts.n = 0;
    hostMounts.gone = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => idles.push(cb));
    vi.stubGlobal("cancelIdleCallback", () => {});
});
const mounted: Array<() => void> = [];
afterEach(() => {
    for (const m of mounted.splice(0)) m();
    vi.unstubAllGlobals();
});

const runFrames = async () => {
    const due = frames.splice(0);
    for (const cb of due) cb(performance.now());
    await nextTick();
};
const runIdle = async () => {
    const due = idles.splice(0);
    for (const cb of due) cb();
    await nextTick();
};

async function mountPhone(w = 390, ht = 844) {
    viewport = { w, h: ht };
    const storedControls = reactive({
        selectedAnimation: "a",
        selectedControl: "controls",
        isControlsPanelOpen: false,
        isTimelineExpanded: false,
    });
    const el = document.createElement("div");
    document.body.appendChild(el);
    const app = createApp(
        defineComponent({
            setup: () => () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(ControlsPaneWrapperBare as any, {
                            animationGroup: { animations: { a: { animation: { id: "a" }, layer: undefined } }, singleTarget: true },
                            blendAvailable: true,
                            storedControls,
                            isPlaying: false,
                            onSetControlsPanelOpen: (v: boolean) => {
                                storedControls.isControlsPanelOpen = v;
                            },
                        }),
                }),
        }),
    );
    app.mount(el);
    mounted.push(() => {
        app.unmount();
        el.remove();
    });
    await nextTick();
    return storedControls;
}

const host = () => document.querySelector<HTMLElement>('[data-stub="ChannelControls"]');
const inSheet = (node: Element | null) => !!node?.closest('[data-stub="SheetContent"]');
const parked = (node: Element | null) => !!node?.closest("[hidden]");

describe("P2f — an upright phone's pane is mounted at idle and carried into the sheet", () => {
    it("after the first paint and an idle period the pane is mounted, unseen, before any press", async () => {
        await mountPhone();
        expect(host()).toBeNull();
        await runFrames();
        await runIdle();
        expect(hostMounts.n).toBe(1);
        expect(parked(host())).toBe(true);
        expect(inSheet(host())).toBe(false);
    });

    it("the Controls press carries the mounted pane into the sheet, and the close carries it back: one mount", async () => {
        const stored = await mountPhone();
        await runFrames();
        await runIdle();
        const pane = host();
        expect(pane).not.toBeNull();

        stored.isControlsPanelOpen = true;
        await nextTick();
        await nextTick();
        expect(host()).toBe(pane);
        expect(inSheet(pane)).toBe(true);
        expect(parked(pane)).toBe(false);

        stored.isControlsPanelOpen = false;
        // The plate's fade (no Web Animations here: it ends at once), then the dialog closes.
        for (let i = 0; i < 4; i++) {
            await runFrames();
            await nextTick();
        }
        expect(host()).toBe(pane);
        expect(parked(pane)).toBe(true);
        expect(hostMounts.n).toBe(1);
    });

    it("a press before the idle mounts the pane with the sheet", async () => {
        const stored = await mountPhone();
        stored.isControlsPanelOpen = true;
        await nextTick();
        await nextTick();
        expect(hostMounts.n).toBe(1);
        expect(inSheet(host())).toBe(true);
    });

    it("the landscape rail keeps its pane in the sheet, as before", async () => {
        await mountPhone(844, 390);
        await runFrames();
        await runIdle();
        expect(inSheet(host())).toBe(true);
        expect(document.querySelector(".sheet-pane-park")).toBeNull();
    });

    // The stage tap that puts the sheet away: on a 4x phone it cost 5 frames
    // over 33 ms (largest 79) against production's 1, the dialog's close
    // unmounting the whole pane in one task. The pane is parked instead.
    it("a stage tap that puts the sheet away unmounts nothing of the pane, open after open", async () => {
        const stored = await mountPhone();
        await runFrames();
        await runIdle();
        for (let round = 0; round < 3; round++) {
            stored.isControlsPanelOpen = true;
            await nextTick();
            await nextTick();
            stored.isControlsPanelOpen = false;
            for (let i = 0; i < 4; i++) {
                await runFrames();
                await nextTick();
            }
        }
        expect(hostMounts.gone).toBe(0);
        expect(hostMounts.n).toBe(1);
    });
});
