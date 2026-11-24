/**
 * P2f — an upright phone's controls pane is mounted when the visitor reaches
 * for the Controls seat, never at idle, and is carried, not remounted.
 *
 * The first press used to mount the whole pane inside the sheet's own first
 * frame: a 140 to 190 ms task on a 4x phone before anything moved. The pane is
 * now mounted at the seat's intent (its pointerenter, pointerdown or focus,
 * about 100 ms ahead of the click, relayed to `warmPane`), or by the press
 * when nothing came first. It is never mounted at idle: the pane is the
 * scene's own, so an idle mount landed after every load and every scene
 * change, while the die played, for a pane nobody opened. Once mounted it
 * waits in a hidden park while the sheet is shut and is carried into the
 * sheet when it opens; parked, it tells its readers it is not shown.
 *
 * Born red: before the change no pane survived a close, and every open
 * mounted a new one.
 *
 * The glass Sheet and Dialog are stubbed at their seams (the Dialog renders its
 * content only while open, as reka's does); the pane wrapper is real, and the
 * channel host is a stub that counts its mounts and shows the pane's
 * `paneShown` fact.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, onMounted, onUnmounted, reactive } from "vue";
import { usePaneShown } from "@components/instrument/pane/composables/usePaneShown";

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
            const shown = usePaneShown();
            onMounted(() => hostMounts.n++);
            onUnmounted(() => hostMounts.gone++);
            return () => h("div", { "data-stub": "ChannelControls", "data-shown": String(shown.value) });
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

let wrapper: { warmPane: () => void } | null = null;
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
                            ref: (r: unknown) => (wrapper = r as typeof wrapper),
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
const shownFact = () => host()?.getAttribute("data-shown");
/** The Controls seat's intent, as AnimationControlsGroup relays it. */
const reach = async () => {
    wrapper!.warmPane();
    await nextTick();
    await nextTick();
};
/** The sheet's close: the plate's fade (no Web Animations here: it ends at once), then the dialog closes. */
const close = async (stored: { isControlsPanelOpen: boolean }) => {
    stored.isControlsPanelOpen = false;
    for (let i = 0; i < 4; i++) {
        await runFrames();
        await nextTick();
    }
};
const open = async (stored: { isControlsPanelOpen: boolean }) => {
    stored.isControlsPanelOpen = true;
    await nextTick();
    await nextTick();
};

describe("P2f — an upright phone's pane is mounted on intent and carried into the sheet", () => {
    it("no pane is mounted at idle: after the first paint and idle periods, none before the seat is reached for", async () => {
        await mountPhone();
        for (let i = 0; i < 3; i++) {
            await runFrames();
            await runIdle();
        }
        expect(host()).toBeNull();
        expect(hostMounts.n).toBe(0);
    });

    it("reaching for the Controls seat mounts the pane, unseen, before the press", async () => {
        await mountPhone();
        await reach();
        expect(hostMounts.n).toBe(1);
        expect(parked(host())).toBe(true);
        expect(inSheet(host())).toBe(false);
        expect(shownFact()).toBe("false");
    });

    it("the press carries the mounted pane into the sheet, and the close carries it back: one mount", async () => {
        const stored = await mountPhone();
        await reach();
        const pane = host();
        expect(pane).not.toBeNull();

        await open(stored);
        expect(host()).toBe(pane);
        expect(inSheet(pane)).toBe(true);
        expect(parked(pane)).toBe(false);
        expect(shownFact()).toBe("true");

        await close(stored);
        expect(host()).toBe(pane);
        expect(parked(pane)).toBe(true);
        expect(shownFact()).toBe("false");
        expect(hostMounts.n).toBe(1);
    });

    it("a press with no intent before it mounts the pane with the sheet", async () => {
        const stored = await mountPhone();
        await open(stored);
        expect(hostMounts.n).toBe(1);
        expect(inSheet(host())).toBe(true);
        expect(shownFact()).toBe("true");
    });

    it("the landscape rail keeps its pane in the sheet, as before, and intent changes nothing there", async () => {
        await mountPhone(844, 390);
        await reach();
        expect(inSheet(host())).toBe(true);
        expect(shownFact()).toBe("true");
        expect(document.querySelector(".sheet-pane-park")).toBeNull();
    });

    // The stage tap that puts the sheet away: on a 4x phone it cost 5 frames
    // over 33 ms (largest 79) against production's 1, and the close unmounted
    // the whole pane in one task. The pane is parked instead (the frame count
    // itself is the browser's to measure).
    it("a stage tap that puts the sheet away unmounts nothing of the pane, open after open", async () => {
        const stored = await mountPhone();
        await reach();
        for (let round = 0; round < 3; round++) {
            await open(stored);
            await close(stored);
        }
        expect(hostMounts.gone).toBe(0);
        expect(hostMounts.n).toBe(1);
    });
});
