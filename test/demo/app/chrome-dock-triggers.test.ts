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
import { GlassDock } from "@mkbabb/glass-ui/dock";
import ChromeDock from "@app/dock/ChromeDock.vue";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

// X.KF.W13X.esc2 · ESC-dock-3 — every scene descriptor carries its miniature
// (`icon` is required, home included); a fixture glyph stands in for it here.
const Glyph = defineComponent(() => () => h("span"));

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
    { id: "cube", label: "Cube", icon: Glyph },
    { id: "easing", label: "Easing", icon: Glyph },
    { id: "spring", label: "Spring", icon: Glyph },
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
                        homeScene: { id: "home", label: "Home", icon: Glyph },
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

describe("UIA-KF-108 — a scene row is marked once", () => {
    it("(3) no scene row's label carries a consumer font-bold", async () => {
        const w = mountDock();
        const trig = w.find('[aria-label="Scene"]').element as HTMLElement;
        trig.focus();
        trig.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
        await vi.waitFor(() => expect(document.querySelectorAll("[role=listbox] [role=option]").length).toBe(SCENES.length + 1));
        expect(document.querySelectorAll("[role=listbox] .font-bold")).toHaveLength(0);
        w.unmount();
    });
});

describe("UIA-KF-131 — a dock popup starts below the dock, not inside it", () => {
    it("(4) the scene list and the @mbabb menu are offset from the dock's bottom edge, not the trigger's", async () => {
        const w = mountDock();
        // the plate is the GlassDock's own root element (its wrapper div runs past it)
        const plate = w.findComponent(GlassDock).element as HTMLElement;
        const rect = (bottom: number) => () => ({ x: 0, y: 0, top: bottom - 30, left: 0, right: 0, width: 0, height: 30, bottom, toJSON: () => ({}) }) as DOMRect;
        plate.getBoundingClientRect = rect(98);
        (document.querySelector("[data-dock-tether=top] > div") as HTMLElement).getBoundingClientRect = rect(105);
        const scene = w.find('[aria-label="Scene"]').element as HTMLElement;
        const mbabb = w.find('[aria-label="@mbabb menu"]').element as HTMLElement;
        scene.getBoundingClientRect = rect(90);
        mbabb.getBoundingClientRect = rect(90);

        scene.focus();
        scene.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
        await vi.waitFor(() => expect(document.querySelector("[role=listbox]")).toBeTruthy());
        const offsets = () => w.findAllComponents({ name: "PopperContent" }).map((c) => c.props("sideOffset"));
        // dock bottom 98 − trigger bottom 90 + the 8 px gap
        expect(offsets()).toEqual([16]);
        document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        document.querySelector<HTMLElement>("[role=listbox]")?.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
        await vi.waitFor(() => expect(document.querySelector("[role=listbox]")).toBeNull());

        const init = { bubbles: true, cancelable: true, button: 0 };
        mbabb.dispatchEvent(new window.PointerEvent("pointerdown", init));
        mbabb.dispatchEvent(new window.PointerEvent("pointerup", init));
        mbabb.dispatchEvent(new window.MouseEvent("click", { ...init, detail: 1 }));
        await vi.waitFor(() => expect(document.querySelector("[role=menu]")).toBeTruthy());
        expect(offsets()).toEqual([16]);
        w.unmount();
    });
});

describe("UIA-KF-237 — the glyph-only scene trigger keeps the label's line box", () => {
    it("(5) below 400 px (word hidden, OA-40) the Scene trigger's min block-size is one line box inside the producer's trigger padding", () => {
        const w = mountDock();
        const scene = w.find('[aria-label="Scene"]');
        expect(scene.find(".max-\\[399px\\]\\:sr-only").exists()).toBe(true);
        expect(scene.attributes("class")).toContain("max-[399px]:min-h-[calc(1lh_+_2_*_var(--dock-trigger-padding-block))]");
        w.unmount();
    });
});
