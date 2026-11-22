/**
 * P2d — an upright phone's opened sheet gives no row to Reset alone.
 *
 * The opened sheet leads with Reset (to the start), the verb the dock leaves
 * out at rest. With two or more channels it shares its row with the channel
 * select. With one (sequence, easing) it stood alone on a row of a 304 px
 * sheet; it now heads the surface's own first row (the Stagger header), and
 * the sheet's head row gives way.
 *
 * Born red: on sequence the sheet's first row held Reset and nothing else.
 *
 * The glass Sheet and Dialog are stubbed at their seams; the pane wrapper and
 * the Sequence pane are real.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";
import type { SequenceTimelineSource } from "../../../demo/composables/scene-facility/sequenceTimeline";

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
vi.mock("@components/instrument/pane/channel-controls/ChannelControls.vue", () => ({
    default: defineComponent({ name: "ChannelControlsStub", setup: () => () => h("div") }),
}));
vi.mock("@components/instrument/pane/RibbonBar.vue", () => ({
    default: defineComponent({ name: "RibbonBarStub", setup: () => () => h("div") }),
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

const source: SequenceTimelineSource = {
    lanes: () => [{ index: 0, at: 0, span: 600, tone: "red" }],
    duration: () => 1200,
    atMax: 1600,
    progress: () => 0,
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

const mounted: Array<() => void> = [];
afterEach(() => {
    for (const m of mounted.splice(0)) m();
});

async function openSequenceSheet(w: number, ht: number) {
    viewport = { w, h: ht };
    const calls = { reset: 0 };
    const storedControls = reactive({
        selectedAnimation: "sequence",
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
                            animationGroup: { animations: {}, singleTarget: true },
                            channels: [{ name: "sequence", sequence: source }],
                            blendAvailable: true,
                            storedControls,
                            isPlaying: false,
                            onReset: () => calls.reset++,
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
    storedControls.isControlsPanelOpen = true;
    await nextTick();
    await nextTick();
    return calls;
}

describe("P2d — the opened sheet gives no row to Reset alone", () => {
    it("on a one-channel scene (sequence) Reset heads the Stagger row: one Reset, sharing its row", async () => {
        const calls = await openSequenceSheet(390, 844);
        const sheet = document.querySelector('[data-stub="SheetContent"]')!;
        const resets = sheet.querySelectorAll<HTMLButtonElement>('button[aria-label="Reset animation"]');
        expect(resets).toHaveLength(1);
        const reset = resets[0]!;
        // The row it stands in holds another control (the Reel), and the title.
        const header = reset.closest('[data-slot="configurator-layer-header"], [data-slot="configurator-layer-trigger"]')?.parentElement ?? reset.parentElement!;
        const row = reset.closest(".sheet-head-row") ?? header;
        const others = [...row.querySelectorAll("button")].filter((b) => b !== reset);
        expect(others.length).toBeGreaterThan(0);
        expect(row.textContent).toContain("Stagger");
        reset.click();
        expect(calls.reset).toBe(1);
    });

    it("a landscape phone's rail keeps the Stagger header as it was: no sheet Reset there", async () => {
        await openSequenceSheet(844, 390);
        const sheet = document.querySelector('[data-stub="SheetContent"]')!;
        expect(sheet.querySelector('button[aria-label="Reset animation"]')).toBeNull();
    });
});
