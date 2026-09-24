/**
 * X.KF.W13T.e2 · G-KFW13T-6's persistence limb (ESC-e-1, GRANTED at COHESION
 * §0ar) — the easing ball preview's hide toggle survives a reload.
 *
 * The scene's view state lives in its bucket of the control-options store
 * (`animation-groups-control-options-store` in localStorage, keyed by the
 * registry `SceneId`), beside `isControlsPanelOpen` and cube's `ppMode`. The
 * toggle's state is the bucket's `ballPreview` field, read by `EasingScene`
 * through `getStoredAnimationGroupControlOptions(EASING_SCENE_ID)`.
 *
 * Two limbs, the two halves of a reload: (1) READ — a bucket persisted as
 * `hidden` before the store is first touched (the state a reload boots into)
 * mounts the ribbon pressed with the preview ABSENT; (2) WRITE — each press
 * lands in the persisted bucket. Drives the REAL `EasingScene` over the REAL
 * `useEasingDemo`, the REAL store and the REAL `PlaybackRibbon` (its producer
 * Slider real, from the clean `/slider` subpath). Stubbed at their own seams:
 * the glass-ui root barrel's `Button` (the keyframes.js-import wall; the
 * `playback-ribbon-contract` precedent), the `AnimationVisualizer` twin, and
 * the scene's `EasingTarget` / `EasingSidebar` (not this witness's subject).
 * Born RED at the pre-cure bytes (the toggle's state was scene-held).
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
vi.mock("../../../demo/components/playback/AnimationVisualizer.vue", () => ({
    default: empty("AnimationVisualizer"),
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
// the jsdom window's; the store's `useStorage` would then persist nowhere. The
// jsdom window's own Storage is installed as the global the page would see,
// before any module creates the (lazily created) store.
const { jsdom } = globalThis as unknown as { jsdom: { window: { localStorage: Storage } } };
vi.stubGlobal("localStorage", jsdom.window.localStorage);

beforeAll(async () => {
    vi.stubGlobal("ResizeObserver", NoopResizeObserver);
    // The reload's boot state: the bucket persisted with the preview hidden,
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
                h(TooltipProvider, null, () => [
                    h(EasingScene, { ref: scene }),
                    scene.value?.ribbonContent({ selectedControl: "easing" }) ?? null,
                ]);
        },
    });
    return mount(Host, { attachTo: document.body });
}

const toggleOf = (root: ParentNode) =>
    root.querySelector<HTMLButtonElement>('button[aria-label="Hide ball preview"]');
// OA-61 (X.KF.W13W.e) — hidden keeps the preview's box (PreviewToggle's
// data-state), so the SHOWN preview is the one under a `shown` toggle root.
const previewOf = (root: ParentNode) =>
    root.querySelector('.preview-toggle[data-state="shown"] [data-stub="AnimationVisualizer"]');
const persisted = () =>
    (JSON.parse(window.localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, { ballPreview?: string }>)[
        SCENE
    ]?.ballPreview;

describe("G-KFW13T-6 — the preview toggle is persisted with the scene's view state", () => {
    it("(read) a bucket persisted as hidden boots the ribbon pressed, the preview absent", async () => {
        const wrapper = mountScene();
        await settle();
        const toggle = toggleOf(document.body);
        expect(toggle).not.toBeNull();
        expect(toggle!.getAttribute("aria-pressed")).toBe("true");
        expect(previewOf(document.body)).toBeNull();
        wrapper.unmount();
    });

    it("(write) each press lands in the persisted bucket, and the next mount reads it", async () => {
        let wrapper = mountScene();
        await settle();
        const root = document.body;
        toggleOf(root)!.click();
        await settle();
        expect(toggleOf(root)!.getAttribute("aria-pressed")).toBe("false");
        expect(previewOf(root)).not.toBeNull();
        expect(persisted()).toBe("shown");

        toggleOf(root)!.click();
        await settle();
        expect(persisted()).toBe("hidden");
        wrapper.unmount();

        wrapper = mountScene();
        await settle();
        expect(toggleOf(document.body)!.getAttribute("aria-pressed")).toBe("true");
        expect(previewOf(document.body)).toBeNull();
        wrapper.unmount();
    });
});
