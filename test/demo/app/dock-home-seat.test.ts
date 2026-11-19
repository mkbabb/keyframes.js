/**
 * The dock's Home seat (owner 2026-11-12: "have a home button"; glass: "a Home
 * seat is an ordinary first seat in a dock"). On every scene the dock leads
 * with Home, which says its name and takes the visitor home in one press. On
 * Home the scene trigger already reads Home, so the seat is not offered there.
 *
 * The real ChromeDock under a TooltipProvider; stubs: jsdom's absent
 * ResizeObserver and matchMedia only.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";

const Glyph = defineComponent(() => () => h("span", { class: "home-glyph" }));
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

const Other = defineComponent(() => () => h("span"));
const SCENES = [
    { id: "cube", label: "Cube", icon: Other },
    { id: "easing", label: "Easing", icon: Other },
];

function mountDock(currentSceneId: string, onSwitch: (id: string) => void = () => {}) {
    return mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(ChromeDock, {
                    currentSceneId,
                    scenes: SCENES,
                    homeScene: { id: "home", label: "Home", icon: Glyph },
                    isControlsPanelOpen: false,
                    onSwitchScene: onSwitch,
                }),
            ),
        ),
        { attachTo: document.body },
    );
}

/** The expanded row's seats in order: the controls a visitor can press. */
const seats = (root: Element) =>
    [...root.querySelectorAll(".dock-layer button, .dock-layer [role=combobox]")].filter(
        (el) => !el.closest("[data-collapsed-face], .dock-collapsed"),
    );

describe("the dock's Home seat", () => {
    it("leads the dock on a scene, named Home, with Home's own glyph", () => {
        const w = mountDock("cube");
        const first = seats(w.element.ownerDocument.body)[0] as HTMLElement | undefined;
        expect(first?.getAttribute("aria-label")).toBe("Home");
        expect(first?.querySelector(".home-glyph")).toBeTruthy();
        w.unmount();
    });

    it("takes the visitor home in one press", async () => {
        const picked: string[] = [];
        const w = mountDock("easing", (id) => picked.push(id));
        await w.find('[aria-label="Home"]').trigger("click");
        expect(picked).toEqual(["home"]);
        w.unmount();
    });

    it("is not offered on Home, where the scene trigger reads Home", () => {
        const w = mountDock("home");
        expect(w.find('[aria-label="Home"]').exists()).toBe(false);
        expect((seats(w.element.ownerDocument.body)[0] as HTMLElement | undefined)?.getAttribute("aria-label")).toBe("Scene");
        w.unmount();
    });
});
