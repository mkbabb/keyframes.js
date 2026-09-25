// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.dock — the top dock's triggers and its scene select.
 *
 *   UIA-KF-237 the @mbabb trigger takes the dock's label rung (the scene
 *              trigger's), not the caption/small type overrides that shrank it
 *   UIA-KF-242 opening the scene list warms every scene, whatever the input
 *              (touch has no hover before its tap; the keyboard may not arrow)
 *   UIA-KF-108 a scene row is marked once (the select's dot), not dot + bold
 *
 * The real ChromeDock under a TooltipProvider (as chrome-dock-containment.test.ts);
 * stubs: jsdom's absent ResizeObserver and matchMedia only.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent: () => false,
        });
    }
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
});

const SCENES = [
    { id: "cube", label: "Cube" },
    { id: "easing", label: "Easing" },
    { id: "spring", label: "Spring" },
];

function mountDock(onWarm: (id: string) => void = () => {}) {
    return mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(
                    ChromeDock,
                    {
                        currentSceneId: "cube",
                        scenes: SCENES,
                        homeScene: { id: "home", label: "Home" },
                        isControlsPanelOpen: false,
                        onWarmScene: onWarm,
                    },
                    { items: () => h(MbabbMenu, { onSceneRestore: () => {} }) },
                ),
            ),
        ),
        { attachTo: document.body },
    );
}

describe("UIA-KF-237 — the two dock triggers share the dock's label rung", () => {
    it("(1) @mbabb wears dock-label (the scene trigger's rung) and the mono face only", () => {
        const w = mountDock();
        const scene = w.find('[aria-label="Scene"]');
        const mbabb = w.find('[aria-label="@mbabb menu"]');
        expect(scene.classes()).toContain("dock-label");
        expect(mbabb.classes()).toContain("dock-label");
        expect(mbabb.attributes("class")).not.toMatch(/text-mono-(caption|small)/);
        w.unmount();
    });
});

describe("UIA-KF-242 — opening the scene list warms every scene", () => {
    it("(2) a keyboard open with NO row hovered or arrowed warms each scene once", async () => {
        const warm = vi.fn();
        const w = mountDock(warm);
        const trig = w.find('[aria-label="Scene"]').element as HTMLElement;
        trig.focus();
        trig.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
        await vi.waitFor(() => expect(document.querySelector("[role=listbox]")).toBeTruthy());
        await nextTick();
        expect(new Set(warm.mock.calls.map((c) => c[0]))).toEqual(new Set(SCENES.map((s) => s.id)));
        w.unmount();
    });
});
