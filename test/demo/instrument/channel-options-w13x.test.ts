/**
 * X.KF.W13X.controls — the Controls card's falsifiers, on the REAL
 * `ChannelOptions` (and every module it composes) over a real
 * `AnimationGroup` and the warmed engine.
 *
 * Rows: A2-KE-L1-7 (one drill-in owner, one sub-pane header) · UIA-KF-079 ·
 * 080 · 269 · 273 · 036 (the header is never inside the scrolled body) ·
 * UIA-KF-165 (peeking does not rewrite the easing) · 168 (the provenance
 * caption tells the truth) · 271 (no gold status label; the trigger names a
 * custom curve) · 166 (a short human error) · 081 (the weight label is
 * static, its value a readout of its own) · 082 / 270 (the reason is stated,
 * z-index disabled with its siblings) · 169 (z-index dims with its row) ·
 * KFA-36 (the detail pane stays mounted through its exit) · KFA-101 (every
 * focus hand-off is `preventScroll`) · KFA-118 (the keyframes reveal focus is
 * `preventScroll`).
 *
 * STUBBED at the module seam, exactly as `channel-options-render-edge.test.ts`
 * does and for the same reason (every entry whose closure reaches
 * `@mkbabb/keyframes.js` cannot load under vitest's externalized resolution):
 * the glass ROOT barrel, `number-field`, `popover`, `tabs` and the
 * `EasingPicker` (a contract-faithful stub declaring the real props). The
 * `labeled-field`, `label`, `select` and `slider` subpaths are REAL.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, markRaw, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import {
    getStoredAnimationGroupControlOptions,
    getStoredAnimationOptions,
} from "@state";
import type { TimingFunctionNames } from "@mkbabb/keyframes.js";

const passthrough = (name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup(_props, { slots }) {
            return () => h("div", { "data-stub": name }, slots.default?.());
        },
    });
/** A real `<button>` that forwards its attrs (class, aria-label, disabled),
 *  so the class a consumer puts on the producer's Button is observable. */
const buttonStub = defineComponent({
    name: "ButtonStub",
    setup(_props, { slots }) {
        return () => h("button", { type: "button" }, slots.default?.());
    },
});
vi.mock("@mkbabb/glass-ui", () => ({
    Button: buttonStub,
    Card: passthrough("CardStub"),
    CardContent: passthrough("CardContentStub"),
    Select: passthrough("SelectStub"),
    SelectContent: passthrough("SelectContentStub"),
    SelectGroup: passthrough("SelectGroupStub"),
    SelectItem: passthrough("SelectItemStub"),
    SelectTrigger: passthrough("SelectTriggerStub"),
    SelectValue: passthrough("SelectValueStub"),
    Separator: passthrough("SeparatorStub"),
    Slider: passthrough("SliderStub"),
    useTouchGate: () => ({
        isActive: false,
        isTouchDevice: false,
        handleScrollCheck: () => {},
        handleTouchEnd: () => {},
        handleTouchStart: () => false,
        suppressDeactivate: () => {},
    }),
}));
vi.mock("@mkbabb/glass-ui/button", () => ({ Button: buttonStub }));
vi.mock("@mkbabb/glass-ui/number-field", () => ({
    NumberField: defineComponent({
        name: "NumberFieldStub",
        props: {
            modelValue: { type: Number, default: undefined },
            step: { type: Number, default: undefined },
            formatOptions: { type: Object, default: undefined },
            disabled: { type: Boolean, default: false },
            id: { type: String, default: undefined },
        },
        setup(props, { slots }) {
            return () =>
                h(
                    "div",
                    {
                        "data-stub": "NumberField",
                        "data-disabled": props.disabled ? "" : undefined,
                    },
                    slots.default?.(),
                );
        },
    }),
    NumberFieldStep: buttonStub,
    NumberFieldInput: defineComponent({
        name: "NumberFieldInputStub",
        setup() {
            return () => h("input", { type: "text" });
        },
    }),
}));
vi.mock("@mkbabb/glass-ui/popover", () => ({
    Popover: passthrough("PopoverStub"),
    PopoverTrigger: passthrough("PopoverTriggerStub"),
    PopoverContent: passthrough("PopoverContentStub"),
}));
vi.mock("@mkbabb/glass-ui/tabs", () => ({
    SegmentedTabs: passthrough("SegmentedTabsStub"),
}));

const pickers: { emit: (v: unknown) => void }[] = [];
vi.mock("@mkbabb/glass-ui/easing", () => ({
    EasingPicker: defineComponent({
        name: "EasingPickerStub",
        props: {
            mode: { type: String, default: undefined },
            preset: { type: String, default: undefined },
            steps: { type: Number, default: undefined },
            term: { type: String, default: undefined },
            modelValue: { type: Object, default: undefined },
            playback: { type: Boolean, default: undefined },
            label: { type: String, default: undefined },
        },
        emits: ["update:modelValue"],
        setup(_props, { emit }) {
            pickers.push({ emit: (v) => emit("update:modelValue", v) });
            return () => h("div", { class: "picker-stub" });
        },
    }),
}));

const { default: ChannelOptions } =
    await import("../../../demo/components/instrument/transport/channel-controls/ChannelOptions.vue");

const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
});

let sceneSeq = 0;
/** A channel built the way a store-backed scene builds it (from its bucket).
 *  The card reads blend availability from its host (`targets: 1` → a
 *  single-target group, blend available; `2` → the cube's multi-target
 *  shape, blend unavailable — the prop `ChannelControls` binds). */
function makeChannel(timingFunction: TimingFunctionNames = "ease-in-out") {
    const scene = `w13x-controls-${++sceneSeq}`;
    const stored = getStoredAnimationOptions("rotate", scene);
    stored.animationOptions.timingFunction = timingFunction;
    const a = new CSSKeyframesAnimation({ duration: 1000, timingFunction }).fromString(`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    `);
    a.name = "rotate";
    a.superKey = scene;
    // The app holds every engine object raw (a reactive proxy breaks the
    // compiler's WeakMap state), and so does this fixture.
    markRaw(a);
    const group = new AnimationGroup(a);
    return { a, group, stored };
}

function mountCard(targets: 1 | 2, timingFunction?: TimingFunctionNames) {
    const { a, group, stored } = makeChannel(timingFunction);
    const wrapper = mount(ChannelOptions, {
        props: {
            animation: a,
            isPlaying: false,
            layerConfig: group.getLayerConfig("rotate"),
            blendAvailable: targets === 1,
            active: false,
        },
        attachTo: document.body,
    });
    return { wrapper, a, group, stored };
}

const settle = async () => {
    await nextTick();
    await nextTick();
    await nextTick();
};

/** The row's own collapse finishing — what the browser fires when the
 *  `grid-template-rows` transition ends. */
const endRowTransition = async (row: Element) => {
    const ev = new Event("transitionend", { bubbles: true });
    Object.defineProperty(ev, "propertyName", { value: "grid-template-rows" });
    row.dispatchEvent(ev);
    await settle();
};

const pencil = (w: ReturnType<typeof mount>) =>
    w.get('button[aria-label="Edit easing curve"]');
const layerEntry = (w: ReturnType<typeof mount>) =>
    w.get("button[aria-controls][aria-expanded]");

describe("X.KF.W13X.controls — one drill-in owner, one sub-pane header (A2-KE-L1-7 · UIA-KF-079 · 080 · 269 · 273 · 036)", () => {
    it("(1) both sub-panes wear the SAME header: Back first, the title on the subheading rung, no size overrides on any Back", async () => {
        const { wrapper } = mountCard(1);
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            const detail = wrapper.get(".panel-row--detail");
            const dh = detail.get("[data-subpane-header]");
            const shape = (el: Element) =>
                [...el.querySelectorAll("*")].map((e) => e.tagName).slice(0, 3);
            expect(dh.element.querySelector("button")?.getAttribute("aria-label")).toBe("Back to controls");
            expect(dh.element.firstElementChild?.tagName).toBe("BUTTON");
            const dt = dh.get("[data-subpane-title]");
            expect(dt.text()).toBe("cubic-bézier");
            expect(dt.classes()).toContain("text-subheading");
            await detail.find('button[aria-label="Back to controls"]').trigger("click");
            await endRowTransition(detail.element);

            await layerEntry(wrapper).trigger("click");
            await settle();
            const layer = wrapper.get(`[id="${layerEntry(wrapper).attributes("aria-controls")}"]`);
            const lh = layer.get("[data-subpane-header]");
            expect(lh.element.firstElementChild?.tagName).toBe("BUTTON");
            expect(lh.get("[data-subpane-title]").text()).toBe("layer");
            expect(lh.get("[data-subpane-title]").classes()).toContain("text-subheading");
            expect(shape(lh.element)).toEqual(shape(dh.element));
            // UIA-KF-269 — no Back or pencil shrinks the producer's Button.
            for (const b of wrapper.findAll("button")) expect(b.classes()).not.toContain("h-auto");
            // UIA-KF-273 / 269 — the entry names the content and is not a hand-rolled focus ring.
            expect(layerEntry(wrapper).text()).toBe("layer");
            expect(layerEntry(wrapper).classes()).not.toContain("kf-focus-ring");
        } finally {
            wrapper.unmount();
        }
    });

    it("(2) UIA-KF-036 — the header is a sibling of the scrolled body, never inside it", async () => {
        const { wrapper } = mountCard(1);
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            const detail = wrapper.get(".panel-row--detail");
            const body = detail.get("[data-subpane-body]");
            expect(body.find(".picker-stub").exists()).toBe(true);
            expect(body.find("[data-subpane-header]").exists()).toBe(false);
            expect(detail.find("[data-subpane-header]").exists()).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it("(3) KFA-36 — the detail pane stays mounted through its exit and unmounts when the row's collapse ends", async () => {
        const { wrapper } = mountCard(1);
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            const detail = wrapper.get(".panel-row--detail");
            await detail.get('button[aria-label="Back to controls"]').trigger("click");
            await settle();
            expect(detail.classes()).toContain("panel-row--inactive");
            expect(detail.find(".picker-stub").exists()).toBe(true);
            await endRowTransition(detail.element);
            expect(detail.find(".picker-stub").exists()).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });

    it("(4) KFA-101 — every focus hand-off of the drill-in is preventScroll", async () => {
        const calls: unknown[] = [];
        const orig = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (this: HTMLElement, o?: FocusOptions) {
            calls.push(o);
            return orig.call(this, o);
        };
        const { wrapper } = mountCard(1);
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            await wrapper.get('.panel-row--detail button[aria-label="Back to controls"]').trigger("click");
            await settle();
            await layerEntry(wrapper).trigger("click");
            await settle();
            expect(calls.length).toBeGreaterThanOrEqual(3);
            for (const o of calls) expect(o).toEqual({ preventScroll: true });
        } finally {
            HTMLElement.prototype.focus = orig;
            wrapper.unmount();
        }
    });
});

describe("X.KF.W13X.controls — the easing editor tells the truth (UIA-KF-165 · 168 · 271)", () => {
    it("(5) UIA-KF-165 — opening the editor on a named curve and backing out rewrites nothing", async () => {
        const { wrapper, stored } = mountCard(1, "ease-in-out");
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            expect(stored.animationOptions.timingFunction).toBe("ease-in-out");
            expect(wrapper.get("[data-subpane-caption]").text()).toBe("from ease-in-out");
            await wrapper.get('.panel-row--detail button[aria-label="Back to controls"]').trigger("click");
            await settle();
            expect(stored.animationOptions.timingFunction).toBe("ease-in-out");
            expect(wrapper.find(".gold-shimmer").exists()).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });

    it("(6) UIA-KF-168 · 271 — the first authored edit commits the curve, the caption says 'edited', the trigger says 'custom'", async () => {
        const { wrapper, stored } = mountCard(1, "ease-in-out");
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            const pts: [number, number, number, number] = [0.42, 0, 0.2, 1.6];
            pickers.at(-1)!.emit({ mode: "bezier", css: "cubic-bezier(0.42, 0, 0.2, 1.6)", fn: (t: number) => t, points: pts, steps: 4, term: "jump-end" });
            await settle();
            expect(String(stored.animationOptions.timingFunction)).toMatch(/^cubic-bezier\(/);
            expect(wrapper.get("[data-subpane-caption]").text()).toBe("edited");
            await wrapper.get('.panel-row--detail button[aria-label="Back to controls"]').trigger("click");
            await settle();
            expect(wrapper.find(".gold-shimmer").exists()).toBe(false);
            expect(wrapper.get('[aria-haspopup="dialog"], [data-stub="PopoverTriggerStub"] button').text()).toContain("custom");
        } finally {
            wrapper.unmount();
        }
    });

    it("(7) UIA-KF-168 — a departure (no cubic-bézier form) says in plain words what the editor starts from", async () => {
        const { wrapper, stored } = mountCard(1, "ease-in-bounce");
        try {
            await pencil(wrapper).trigger("click");
            await settle();
            expect(stored.animationOptions.timingFunction).toBe("ease-in-bounce");
            const cap = wrapper.get("[data-subpane-caption]").text();
            expect(cap).toContain("ease-in-bounce");
            expect(cap).toContain("starting from your last custom curve");
            expect(cap).not.toContain("engine-native");
        } finally {
            wrapper.unmount();
        }
    });
});

describe("X.KF.W13X.controls — the options form and the layer pane (UIA-KF-166 · 081 · 082 · 270 · 169)", () => {
    it("(8) UIA-KF-166 — a rejected duration reads as one short human line", async () => {
        const { wrapper } = mountCard(1);
        try {
            const input = wrapper.get(".panel-row input");
            await input.setValue("abc");
            await settle();
            expect(wrapper.get(".labeled-field-error").text()).toBe("Try 500ms or 2s");
        } finally {
            wrapper.unmount();
        }
    });

    it("(9) UIA-KF-081 — the weight label is static; its value is a readout of its own", async () => {
        const { wrapper } = mountCard(1);
        try {
            await layerEntry(wrapper).trigger("click");
            await settle();
            const labels = wrapper.findAll(".labeled-field-grid .label").map((l) => l.text());
            expect(labels).toContain("weight");
            expect(labels.some((t) => /\d/.test(t))).toBe(false);
            expect(wrapper.get("output").text()).toBe("1.00");
        } finally {
            wrapper.unmount();
        }
    });

    it("(10) UIA-KF-082 · 270 — on a multi-target group the pane states why, and z-index is disabled with blend and enabled", async () => {
        const { wrapper } = mountCard(2);
        try {
            await layerEntry(wrapper).trigger("click");
            await settle();
            const pane = wrapper.get(`[id="${layerEntry(wrapper).attributes("aria-controls")}"]`);
            expect(pane.text()).toContain("Layer compositing applies to single-target groups");
            expect(pane.get('[data-stub="NumberField"]').attributes()).toHaveProperty("data-disabled");
        } finally {
            wrapper.unmount();
        }
    });

    it("(11) UIA-KF-169 — with enabled off, the z-index row is disabled as a row (its label dims with its stepper)", async () => {
        const { wrapper, group } = mountCard(1);
        try {
            group.setLayerConfig("rotate", { enabled: false });
            await wrapper.setProps({ layerConfig: { ...group.getLayerConfig("rotate")! } });
            await layerEntry(wrapper).trigger("click");
            await settle();
            const z = wrapper.findAll(".labeled-field").find((f) => f.find(".label").text() === "z-index");
            expect(z?.attributes()).toHaveProperty("data-disabled");
        } finally {
            wrapper.unmount();
        }
    });
});

describe("X.KF.W13X.controls — the keyframes reveal (KFA-118)", () => {
    it("(12) revealing the keyframes pane focuses it without scrolling the pane", async () => {
        const { effectScope, ref } = await import("vue");
        const { useKeyframesPaneReveal } = await import(
            "../../../demo/components/instrument/transport/channel-controls/composables/useKeyframesPaneReveal"
        );
        const el = document.createElement("div");
        el.tabIndex = 0;
        document.body.appendChild(el);
        const calls: unknown[] = [];
        el.focus = (o?: FocusOptions) => {
            calls.push(o);
        };
        const storedControls = getStoredAnimationGroupControlOptions("w13x-reveal");
        storedControls.selectedControl = "controls";
        const scope = effectScope();
        scope.run(() =>
            useKeyframesPaneReveal({
                storedControls,
                keyframesPaneEl: ref(el),
            }),
        );
        try {
            storedControls.selectedControl = "keyframes";
            await settle();
            expect(calls).toEqual([{ preventScroll: true }]);
        } finally {
            scope.stop();
            el.remove();
        }
    });
});
