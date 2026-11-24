/**
 * An upright phone's opened sheet: on a one-channel scene Reset is a labelled
 * row of its own at the section's foot.
 *
 * The opened sheet offers Reset (to the start), the verb the dock leaves out
 * at rest. With two or more channels it shares the head row with the channel
 * select. With one (sequence, easing) it stood alone in a row of a 304 px
 * sheet, then in the section's own header, where on sequence the header read
 * Stagger, Reset, Reel, the stagger's own reset: two back glyphs one seat
 * apart. The owner's ruling (23 Nov): a row of its own, labelled, at the foot
 * of the section, so the header keeps one back glyph.
 *
 * Born red: on sequence Reset headed the Stagger row, glyph only.
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

describe("the opened sheet: on a one-channel scene Reset is a labelled row at the section's foot", () => {
    it("on sequence: one Reset, its word shown, after the lanes, and the Stagger header holds no Reset", async () => {
        const calls = await openSequenceSheet(390, 844);
        const sheet = document.querySelector('[data-stub="SheetContent"]')!;
        const resets = sheet.querySelectorAll<HTMLButtonElement>('button[aria-label="Reset animation"]');
        expect(resets).toHaveLength(1);
        const reset = resets[0]!;
        // Labelled: its word is on it.
        expect(reset.textContent?.trim()).toBe("Reset");
        // Not in the sheet's head row, nor among the section header's verbs ...
        expect(reset.closest(".sheet-head-row")).toBeNull();
        const actions = sheet.querySelector('[data-slot="configurator-layer-actions"]');
        expect(actions).not.toBeNull();
        expect(actions!.contains(reset)).toBe(false);
        // ... where the one back glyph is the stagger's own reset.
        expect(actions!.querySelectorAll('button[aria-label^="Reset"]')).toHaveLength(1);
        expect(actions!.querySelectorAll('button[aria-label^="Reset the sequence items"]')).toHaveLength(1);
        // At the foot: after the lanes, and nothing follows it in the section.
        const lanes = sheet.querySelector(".seq-lane-scrub");
        expect(lanes).not.toBeNull();
        expect(lanes!.compareDocumentPosition(reset) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(reset.nextElementSibling).toBeNull();
        reset.click();
        expect(calls.reset).toBe(1);
    });

    it("a landscape phone's rail keeps the Stagger header as it was: no sheet Reset there", async () => {
        await openSequenceSheet(844, 390);
        const sheet = document.querySelector('[data-stub="SheetContent"]')!;
        expect(sheet.querySelector('button[aria-label="Reset animation"]')).toBeNull();
    });
});
