/**
 * X.KF.W13T.k — OA-6 (COHESION §0ao): the top ChromeDock CONTAINS its
 * controls. Measured live (390×844, dock expanded, a scene active): the
 * capsule was capped at exactly 50vw and the Controls tab, the panel toggle
 * and the @mbabb trigger painted past its right edge. Two roots, both cured at
 * the layout, neither by a clip:
 *
 *  (1) the tether. `fixed left-1/2 -translate-x-1/2` gives the dock a
 *      shrink-to-fit containing block of `100vw − 50vw` — a 50vw cap no token
 *      declares — so the producer's own `--dock-max-inline-size` never
 *      governed. The band now spans the viewport (`left-0 right-0` +
 *      `justify-center`, the TransportDock band's own idiom) and the dock
 *      centres itself inside it.
 *  (2) the over-cap strategy. GlassDock's default `overflow` is "grow"
 *      (content overflows visibly past the cap). `overflow="wrap"` is the
 *      producer's containment recipe: the row reflows to N rows exactly when
 *      its intrinsic width exceeds the cap, and stays one row when it fits.
 *
 * Layout itself is measured by the committed Playwright evidence
 * (evidence/W13T/KF-W13T-k-*); this witness pins the two layout inputs at the
 * mounted DOM, so neither can regress silently.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";
import MbabbMenu from "@app/dock/MbabbMenu.vue";

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown })
    .ResizeObserver;

beforeAll(() => {
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (
            query: string,
        ) => ({
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
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver =
        savedResizeObserver;
});

// X.KF.W13T.k3 — the dock now carries the App zone's tooltip, so it is mounted
// the way App.vue mounts it: inside the app's ONE hoisted TooltipProvider.
const Host = defineComponent(() => () =>
    h(TooltipProvider, null, () =>
        h(ChromeDock, {
            currentSceneId: "cube",
            scenes: [
                { id: "cube", label: "Cube" },
                { id: "easing", label: "Easing" },
            ],
            homeScene: { id: "home", label: "Home" },
            isControlsPanelOpen: false,
        }),
    ),
);

function mountDock() {
    return mount(Host, { attachTo: document.body });
}

describe("ChromeDock contains its controls (OA-6)", () => {
    it("(1) the top band spans the viewport — no 50vw shrink-to-fit cap", () => {
        const wrapper = mountDock();
        const band = wrapper.find('[data-dock-tether="top"]');
        expect(band.exists()).toBe(true);
        const cls = band.classes();
        expect(cls).toEqual(expect.arrayContaining(["fixed", "left-0", "right-0", "justify-center"]));
        expect(cls).not.toContain("left-1/2");
        expect(cls).not.toContain("-translate-x-1/2");
        wrapper.unmount();
    });

    it("(2) the dock takes the producer's wrap recipe over the cap, never a clip", () => {
        const wrapper = mountDock();
        const dock = wrapper.find(".glass-dock");
        expect(dock.exists()).toBe(true);
        expect(dock.classes()).toContain("dock-overflow-wrap");
        // Containment is layout, not a mask: no overflow clip is authored on
        // the band or its pointer-events host.
        const band = wrapper.find('[data-dock-tether="top"]');
        for (const el of [band.element, band.element.firstElementChild]) {
            const cls = (el as HTMLElement).className;
            expect(cls).not.toMatch(/overflow-(hidden|clip)/);
        }
        wrapper.unmount();
    });

    it("(3) OA-33 (§0bi) — the trailing app zone is the @mbabb trigger ALONE; Share · shortcuts · theme ride its menu, and `?` still opens the shortcuts dialog", async () => {
        // Supersedes W13T.k3's R-k-1 case in place (E-3 for tests: the claim
        // changed, so the witness changes with it). The dock renders no Share /
        // shortcuts / theme control of its own; the slotted MbabbMenu is the
        // zone's one control and registers the `?` shortcut.
        const wrapper = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(
                        ChromeDock,
                        {
                            currentSceneId: "cube",
                            scenes: [{ id: "cube", label: "Cube" }],
                            homeScene: { id: "home", label: "Home" },
                            isControlsPanelOpen: false,
                        },
                        { items: () => h(MbabbMenu, { onSceneRestore: () => {} }) },
                    ),
                ),
            ),
            { attachTo: document.body },
        );
        const names = wrapper
            .find(".glass-dock")
            .findAll("button")
            .map((b) => b.attributes("aria-label") ?? "");
        expect(names).not.toContain("Share animation");
        expect(names).not.toContain("Show keyboard shortcuts");
        expect(names.some((n) => /^Switch to (dark|light) mode$/.test(n))).toBe(false);
        expect(names.filter((n) => n === "@mbabb menu")).toHaveLength(1);
        expect(document.querySelector('[role="dialog"]')).toBeNull();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
        await nextTick();
        await nextTick();
        expect(document.querySelector('[role="dialog"]')).not.toBeNull();
        wrapper.unmount();
    });
});
