/**
 * X.KF.W13T.e2 · G-KFW13T-6, turned round by FORTY-SIXTH E (the address is the
 * page) — the easing ball preview's hide toggle lives in the scene's bucket of
 * the control-options store, in memory, beside `isControlsPanelOpen` and cube's
 * `cubeSkin`; across a reload it travels in the address (`ball=0`,
 * useSceneUrlState), never in browser storage.
 *
 * Two limbs: (1) READ — a bucket an older build left in localStorage as
 * `hidden` is never read: the ribbon mounts with the preview SHOWN; (2) WRITE —
 * a press writes nothing to storage, and the next mount in the same page reads
 * the bucket the press set. Drives the REAL `EasingScene` over the REAL
 * `useEasingDemo`, the REAL store and the REAL `PlaybackRibbon` (its producer
 * Slider real, from the clean `/slider` subpath). Stubbed at their own seams:
 * the glass-ui root barrel's `Button` (the keyframes.js-import wall; the
 * `playback-ribbon-contract` precedent), the `AnimationVisualizer` twin, and
 * the scene's `EasingTarget` / `EasingSidebar` (not this witness's subject).
 * Born RED at the pre-cure bytes (the toggle's state was scene-held), and RED
 * again on the storage-backed store (it restored the old bucket).
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { warmKfEngine } from "../../../demo/kf-engine";

const buttonHost = defineComponent({
    name: "ButtonHost",
    setup(_props, { slots }) {
        return () => h("button", { type: "button" }, slots.default?.());
    },
});
const empty = (name: string) =>
    defineComponent({
        name,
        setup() {
            return () => h("div", { "data-stub": name });
        },
    });

vi.mock("@mkbabb/glass-ui", async () => {
    const slider =
        await vi.importActual<typeof import("@mkbabb/glass-ui/slider")>("@mkbabb/glass-ui/slider");
    return { ...slider, Button: buttonHost };
});
// OD19-K4 — the track seats the ribbon's two discs (its `start` / `end` slots)
// and takes the preview state the ribbon hands it.
vi.mock("../../../demo/components/playback/AnimationVisualizer.vue", () => ({
    default: defineComponent({
        name: "AnimationVisualizer",
        props: { preview: { type: String, default: undefined } },
        setup(props, { slots }) {
            return () =>
                h("div", { "data-stub": "AnimationVisualizer", "data-preview": props.preview }, [
                    slots.start?.(),
                    slots.end?.(),
                ]);
        },
    }),
}));
vi.mock("../../../demo/scenes/easing/EasingTarget.vue", () => ({
    default: empty("EasingTarget"),
}));
vi.mock("../../../demo/scenes/easing/EasingSidebar.vue", () => ({
    default: empty("EasingSidebar"),
}));

const STORE_KEY = "animation-groups-control-options-store";
const SCENE = "easing";

class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
}

// The page's Storage. Node (>= 25) defines its own global `localStorage`
// accessor, which reads `undefined` without `--localstorage-file` and shadows
// the jsdom window's. The jsdom window's own Storage is installed as the global
// the page would see, before any module creates the (lazily created) store.
const { jsdom } = globalThis as unknown as { jsdom: { window: { localStorage: Storage } } };
vi.stubGlobal("localStorage", jsdom.window.localStorage);

beforeAll(async () => {
    vi.stubGlobal("ResizeObserver", NoopResizeObserver);
    // An older build's record: the bucket stored with the preview hidden,
    // written BEFORE any module touches the (lazily created) store.
    window.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
            _storeTimestamp: Date.now(),
            [SCENE]: {
                selectedControl: "easing",
                selectedAnimation: "",
                keyframeControls: {
                    selectedKeyframesControl: "keyframes",
                    dialogOpen: false,
                    keyframes: "",
                    addKeyframes: "",
                },
                isTimelineExpanded: false,
                isControlsPanelOpen: true,
                ballPreview: "hidden",
            },
        }),
    );
    await warmKfEngine();
});
afterAll(() => {
    window.localStorage.removeItem(STORE_KEY);
    vi.unstubAllGlobals();
});

const { default: EasingScene } = await import("../../../demo/scenes/easing/EasingScene.vue");
const { default: PlaybackRibbon } = await import("../../../demo/components/playback/PlaybackRibbon.vue");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

const settle = async () => {
    await nextTick();
    await nextTick();
};

function mountScene(): VueWrapper {
    const scene = ref<InstanceType<typeof EasingScene> | null>(null);
    const Host = defineComponent({
        setup() {
            return () =>
                h(TooltipProvider, null, () => {
                    // X.KF.W13X.r4ribbon — the scene publishes a BINDING; the
                    // ribbon is mounted by its one host (here, this harness).
                    const binding = scene.value?.ribbonContent({ selectedControl: "easing" }) ?? null;
                    return [h(EasingScene, { ref: scene }), binding ? h(PlaybackRibbon, binding) : null];
                });
        },
    });
    return mount(Host, { attachTo: document.body });
}

const toggleOf = (root: ParentNode) =>
    root.querySelector<HTMLButtonElement>('button[aria-label="Ball preview"]');
// OA-61 (X.KF.W13W.e) — hidden keeps the preview's box (PreviewToggle's
// data-state), so the SHOWN preview is the one under a `shown` toggle root.
const previewOf = (root: ParentNode) =>
    root.querySelector('[data-stub="AnimationVisualizer"][data-preview="shown"]');
const persisted = () =>
    (JSON.parse(window.localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, { ballPreview?: string }>)[
        SCENE
    ]?.ballPreview;

describe("G-KFW13T-6 · FORTY-SIXTH E — the preview toggle is the scene's view state, in memory", () => {
    it("(read) a bucket left in storage is never read: the ribbon boots with the preview shown", async () => {
        const wrapper = mountScene();
        await settle();
        const toggle = toggleOf(document.body);
        expect(toggle).not.toBeNull();
        // X-DS pass 1, C1 (KF-C1-03) — pressed = shown.
        expect(toggle!.getAttribute("aria-pressed")).toBe("true");
        expect(previewOf(document.body)).not.toBeNull();
        wrapper.unmount();
    });

    it("(write) a press writes nothing to storage, and the next mount in the page reads it", async () => {
        window.localStorage.removeItem(STORE_KEY);
        let wrapper = mountScene();
        await settle();
        const root = document.body;
        toggleOf(root)!.click();
        await settle();
        expect(toggleOf(root)!.getAttribute("aria-pressed")).toBe("false");
        expect(previewOf(root)).toBeNull();
        expect(persisted()).toBeUndefined();
        expect(Object.keys(window.localStorage)).toEqual([]);
        wrapper.unmount();

        wrapper = mountScene();
        await settle();
        expect(toggleOf(document.body)!.getAttribute("aria-pressed")).toBe("false");
        expect(previewOf(document.body)).toBeNull();
        wrapper.unmount();
    });
});
