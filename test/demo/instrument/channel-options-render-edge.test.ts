/**
 * G-KFW12-2 — the ChannelOptions render edge, executed against the REAL
 * producer at its declared seams (X.KF.W12.b, OPTIONS-UNIT).
 *
 * The wave's headline: the advanced pane's three selects were pinned shut and
 * its layer switch pinned OFF by props the installed labeled-field components
 * never declared (`is-open`, `checked`) — an ABSENT Boolean prop casts to
 * `false` and is forwarded unconditionally into reka's controlled mode — and
 * the pane rendered a `layerConfig` SNAPSHOT taken at mount, so an engine-side
 * `setLayerConfig` never re-rendered the weight slider or the switch. The
 * transport's EasingPicker seat derived its `:key` from the state its own drag
 * handler wrote, so the first drag off a preset-matched quad remounted the
 * picker mid-gesture.
 *
 * What is REAL here: the wrapper (`ControlsPaneWrapper`, where the write→render
 * edge lives), `ChannelControls`, `ChannelOptions`, `LayerConfigPanel`, the
 * `useEasingPickerSeat` composable, the warmed engine and a real
 * `AnimationGroup`, and — the point — the installed `@mkbabb/glass-ui`
 * `labeled-field` subpath (the real `LabeledSelect` / `LabeledSwitch` /
 * `LabeledSlider` over real reka Select / Switch / Slider under jsdom; its
 * chunk closure never reaches a `@mkbabb/keyframes.js` import — computed
 * over `dist/*.js` imports, receipted in the wave record). What is STUBBED,
 * at the module seam, is exactly what cannot load under vitest's externalized
 * resolution — every entry whose closure reaches `useSpring-*.js`, which
 * imports `@mkbabb/keyframes.js` (the lane's known wall): the ROOT barrel
 * (stubbed by every demo test that mounts a card), the `drawer` barrel
 * (`useDragMorph`), and `number-field` (its stepper `Button` → `useLiquidPress`
 * → `useSpring`; the z-index row is not a subject of this gate); and the
 * `EasingPicker` — replaced by a contract-faithful stub
 * declaring the SAME props the real component declares (`mode preset steps
 * term modelValue playback label readout`, emit `update:modelValue`) so the
 * seat's remount discipline is observable as a mount count. No test.skip, no
 * allowlist, no try/catch around a defect.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { computed, defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import type { AnimationLayerConfig } from "../../../src/animation/constants/types";
import { warmKfEngine } from "../../../demo/kf-engine";
import {
    ACTIVE_SCENE_KEY,
    TABS_EXTERNALLY_MANAGED_KEY,
} from "../../../demo/components/instrument/transport/injectionKeys";
import {
    getStoredAnimationGroupControlOptions,
    getStoredAnimationOptions,
    useSceneMachine,
} from "@state";
import { NAMED_EASING_BEZIER } from "@utils/reference-data/animationDescriptions";

// ── The two module-seam stubs ─────────────────────────────────────────────────
const passthrough = (name: string) =>
    defineComponent({
        name,
        inheritAttrs: false,
        setup(_props, { slots }) {
            return () => h("div", { "data-stub": name }, slots.default?.());
        },
    });

/** The root barrel's members along this mount path (ChannelOptions,
 *  ChannelControls, RibbonBar, PlaybackRibbon). `Button` renders a real
 *  `<button>` so the pencil and the advanced Back are focusable elements;
 *  nothing here is a subject of the gate. */
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
    SelectLabel: passthrough("SelectLabelStub"),
    SelectSeparator: passthrough("SelectSeparatorStub"),
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

/** C-11 (X.KF.W13.e, COHESION §0ai) — the seam widened, one line. This gate
 *  stubbed the ROOT barrel alone, which is the whole reason PlaybackRibbon's
 *  `Button`/`Slider` had to stay on the root barrel against the convention
 *  (`PlaybackRibbon.vue`'s own C-11 note said so). The `/button` subpath now
 *  resolves to the SAME stub, so a consumer on this mount path may follow the
 *  convention without crossing the keyframes.js-import wall. */
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
        emits: ["update:modelValue"],
        setup(_props, { slots }) {
            return () =>
                h("div", { "data-stub": "NumberField" }, slots.default?.());
        },
    }),
    NumberFieldContent: passthrough("NumberFieldContentStub"),
    NumberFieldDecrement: buttonStub,
    NumberFieldIncrement: buttonStub,
    NumberFieldInput: defineComponent({
        name: "NumberFieldInputStub",
        setup() {
            return () => h("input", { type: "text" });
        },
    }),
}));

vi.mock("@mkbabb/glass-ui/drawer", () => ({
    Drawer: passthrough("DrawerStub"),
    DrawerContent: passthrough("DrawerContentStub"),
    DrawerTitle: passthrough("DrawerTitleStub"),
}));

/** Every EasingPicker instance ever constructed, in order (a remount appends). */
const pickerInstances: {
    emit: (v: unknown) => void;
    props: Readonly<Record<string, unknown>>;
}[] = [];

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
            readout: { type: Boolean, default: undefined },
        },
        emits: ["update:modelValue"],
        setup(props, { emit }) {
            pickerInstances.push({
                emit: (v) => emit("update:modelValue", v),
                props,
            });
            return () => h("div", { class: "picker-stub" });
        },
    }),
}));

const { default: ControlsPaneWrapper } =
    await import("../../../demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.vue");
// The app mounts ONE TooltipProvider at its root (the ribbon's tooltips inject
// it); the subpath is clean (its closure reaches no keyframes.js import).
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

// ── jsdom gaps the mount path touches (environment, never a guard) ───────────
// jsdom ships no ResizeObserver, no `scrollIntoView`, and no pointer-capture
// surface on Element (`hasPointerCapture` / `releasePointerCapture` /
// `setPointerCapture` — reka's SelectTrigger calls the first two inside its
// `pointerdown` handler before it opens). These symbols must EXIST; none of
// them alters what the components under test do.
type PointerCaptureSurface = {
    hasPointerCapture?: (id: number) => boolean;
    releasePointerCapture?: (id: number) => void;
    setPointerCapture?: (id: number) => void;
};
const elementProto = Element.prototype as unknown as PointerCaptureSurface;
const savedRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
const savedScrollIntoView = Element.prototype.scrollIntoView;
const savedCapture = {
    has: elementProto.hasPointerCapture,
    release: elementProto.releasePointerCapture,
    set: elementProto.setPointerCapture,
};
beforeAll(async () => {
    class NoopResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    Element.prototype.scrollIntoView = function scrollIntoView() {};
    elementProto.hasPointerCapture = () => false;
    elementProto.releasePointerCapture = () => {};
    elementProto.setPointerCapture = () => {};
    await warmKfEngine();
});
afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedRO;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedRO;
    Element.prototype.scrollIntoView = savedScrollIntoView;
    elementProto.hasPointerCapture = savedCapture.has;
    elementProto.releasePointerCapture = savedCapture.release;
    elementProto.setPointerCapture = savedCapture.set;
});

const SCENE = "gate-kfw12-b";

/** A two-member group on one (absent) target → `singleTarget` true → blend
 *  available → the weight slider renders (the app's cube-scene shape). */
function makeGroup() {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    `);
    a.name = "rotate";
    a.superKey = SCENE;
    const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { transform: translateX(0px); }
        to { transform: translateX(100px); }
    `);
    b.name = "matrix";
    b.superKey = SCENE;
    return { group: new AnimationGroup(a, b), a, b };
}

/** Mount the wrapper the way `AnimationControlsGroup` mounts it: the parent's
 *  `layerConfigUpdate` handler IS the engine's `setLayerConfig` (synchronous,
 *  `Object.assign` + a dirty flag, no event) — the app's own wiring. */
function mountPane() {
    const { group, a } = makeGroup();
    useSceneMachine().setActiveSurfaces(["controls"]);
    const storedControls = getStoredAnimationGroupControlOptions(SCENE);
    storedControls.selectedAnimation = "rotate";
    storedControls.selectedControl = "controls";
    storedControls.isControlsPanelOpen = true;

    // The ribbon's Teleport target the app's shell renders.
    let ribbonTarget = document.getElementById("controls-ribbon-target");
    if (!ribbonTarget) {
        ribbonTarget = document.createElement("div");
        ribbonTarget.id = "controls-ribbon-target";
        document.body.appendChild(ribbonTarget);
    }

    const Host = defineComponent({
        name: "GateHost",
        setup() {
            return () =>
                h(TooltipProvider, null, () =>
                    h(ControlsPaneWrapper, {
                        animationGroup: group,
                        blendAvailable: group.singleTarget,
                        channels: undefined,
                        storedControls,
                        hideControls: false,
                        stageMode: "subject",
                        isPlaying: false,
                        animControlRefs: {},
                        activeKeyframesRef: null,
                        activeTimelineRef: null,
                        onLayerConfigUpdate: (
                            name: string,
                            config: Partial<AnimationLayerConfig>,
                        ) => {
                            group.setLayerConfig(name, config);
                        },
                    }),
                );
        },
    });

    const wrapper = mount(Host, {
        global: {
            provide: {
                [TABS_EXTERNALLY_MANAGED_KEY as symbol]: true,
                [ACTIVE_SCENE_KEY as symbol]: computed(() => SCENE),
            },
        },
        attachTo: document.body,
    });
    return { wrapper, group, a, storedControls };
}

const settle = async () => {
    await nextTick();
    await nextTick();
};

describe("G-KFW12-2 — the ChannelOptions render edge", () => {
    it("(0) the producer's declared names, quoted at RUNTIME from the installed labeled-field module", async () => {
        const mod = await import("@mkbabb/glass-ui/labeled-field");
        const selectProps = Object.keys(
            (mod.LabeledSelect as { props: Record<string, unknown> }).props,
        );
        const switchProps = Object.keys(
            (mod.LabeledSwitch as { props: Record<string, unknown> }).props,
        );
        // The names the wave binds to…
        expect(selectProps).toContain("open");
        expect(switchProps).toContain("modelValue");
        // …and the phantoms the frontier bound, declared by nothing.
        expect(selectProps).not.toContain("isOpen");
        expect(selectProps).not.toContain("tooltip");
        expect(selectProps).not.toContain("descriptions");
        expect(switchProps).not.toContain("checked");
        const selectEmits = (mod.LabeledSelect as { emits: string[] }).emits;
        const switchEmits = (mod.LabeledSwitch as { emits: string[] }).emits;
        expect(selectEmits).toContain("update:open");
        expect(switchEmits).toContain("update:modelValue");
        expect(switchEmits).not.toContain("update:checked");
    });

    it("(1) KF-CO-8 ≡ LP-3 + LP-1: the switch renders the engine's `enabled`, and an engine-side setLayerConfig through the wrapper re-renders it", async () => {
        const { wrapper, group } = mountPane();
        try {
            await settle();
            // Open the advanced sub-pane the way a user does.
            const advanced = wrapper.get("button[aria-expanded]");
            await advanced.trigger("click");
            await settle();

            const sw = wrapper.get("button[role=switch]");
            // The engine default is `enabled: true`; the frontier's absent
            // Boolean `modelValue` rendered this OFF.
            expect(group.getLayerConfig("rotate")?.enabled).toBe(true);
            expect(sw.attributes("aria-checked")).toBe("true");

            // The user's click → LayerConfigPanel `update` → ChannelOptions →
            // ChannelControls → the wrapper's edge → the parent's engine write.
            await sw.trigger("click");
            await settle();
            expect(group.getLayerConfig("rotate")?.enabled).toBe(false);
            // …and the pane renders the engine's POST-WRITE truth, not the
            // snapshot taken at mount.
            expect(sw.attributes("aria-checked")).toBe("false");
        } finally {
            wrapper.unmount();
        }
    });

    it("(2) LP-1: the weight slider re-renders the engine's weight after a write through the wrapper", async () => {
        const { wrapper, group } = mountPane();
        try {
            await settle();
            await wrapper.get("button[aria-expanded]").trigger("click");
            await settle();

            const thumb = wrapper.get("[role=slider]");
            expect(thumb.attributes("aria-valuenow")).toBe("1");

            // A keyboard step on the real reka Slider emits the new value; the
            // chain ends at `group.setLayerConfig("rotate", { weight })`.
            (thumb.element as HTMLElement).focus();
            await thumb.trigger("keydown", { key: "ArrowLeft" });
            await settle();
            const weight = group.getLayerConfig("rotate")?.weight;
            expect(weight).toBeCloseTo(0.99, 6);
            expect(Number(thumb.attributes("aria-valuenow"))).toBeCloseTo(
                0.99,
                6,
            );
        } finally {
            wrapper.unmount();
        }
    });

    it("(3) KF-CO-1: the direction dropdown OPENS on click (the declared `open` prop, not the phantom `is-open`)", async () => {
        const { wrapper } = mountPane();
        try {
            await settle();
            // The main row's first combobox is `direction` (duration / delay /
            // iterations are inputs).
            const triggers = wrapper.findAll("button[role=combobox]");
            expect(triggers.length).toBeGreaterThanOrEqual(1);
            const direction = triggers[0]!;
            expect(direction.attributes("aria-expanded")).toBe("false");

            // reka's SelectTrigger opens on a primary-button mouse pointerdown.
            direction.element.dispatchEvent(
                new PointerEvent("pointerdown", {
                    button: 0,
                    pointerType: "mouse",
                    bubbles: true,
                    cancelable: true,
                }),
            );
            await settle();
            expect(direction.attributes("aria-expanded")).toBe("true");
        } finally {
            wrapper.unmount();
        }
    });

    it("(4) KF-TFP-1 ≡ KF-ES-12: the first drag off a preset-matched quad does NOT remount EasingPicker", async () => {
        const { wrapper, a, storedControls } = mountPane();
        try {
            await settle();
            const before = pickerInstances.length;

            // The pencil opens the editor on the stored curve (the store's
            // default `ease-in-out` is a NAMED bezier → converted + seated as
            // its preset).
            const pencil = wrapper.get(
                'button[aria-label="Edit easing curve"]',
            );
            await pencil.trigger("click");
            await settle();
            expect(pickerInstances.length).toBe(before + 1);
            const seated = pickerInstances[pickerInstances.length - 1]!;
            expect(seated.props.mode).toBe("bezier");
            expect(seated.props.preset).toBe("ease-in-out");

            const store = getStoredAnimationOptions(a);
            expect(store.cubicBezierOptions.controlPoints).toEqual(
                NAMED_EASING_BEZIER["ease-in-out"],
            );

            // The FIRST drag: the vendor emits a quad that matches no preset.
            const dragged: [number, number, number, number] = [0.5, 0, 0.58, 1];
            seated.emit({
                mode: "bezier",
                css: "cubic-bezier(0.5, 0, 0.58, 1)",
                fn: (t: number) => t,
                points: dragged,
                steps: 4,
                term: "jump-end",
            });
            await settle();

            // …and the picker was NOT torn down under the gesture.
            expect(pickerInstances.length).toBe(before + 1);

            // The truth moved: the store's quad, and the persisted literal is
            // the COMPLETE re-parseable `cubic-bezier(…)` of that quad (the
            // demo's own 2-decimal spelling; compared by value, not bytes).
            expect(store.cubicBezierOptions.controlPoints).toEqual(dragged);
            const literal = String(store.animationOptions.timingFunction);
            const m = /^cubic-bezier\(([^)]*)\)$/.exec(literal);
            expect(m).not.toBeNull();
            expect(m![1]!.split(",").map(Number)).toEqual(dragged);
            void storedControls;
        } finally {
            wrapper.unmount();
        }
    });
});
