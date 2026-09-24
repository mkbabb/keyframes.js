/**
 * X.KF.W13W.p (OA-58, COHESION §0cq; KF-W13.md "[KF.W13W.p] the easing picker")
 * — ONE easing picker, ONE hierarchy.
 *
 * The owner, verbatim (2026-09-24): "the easing curve picker is not organized
 * well with proper design hierarchy and dividing".
 *
 * The spec's hierarchy, read off REAL mounts (never the source text):
 *   (1) one component — the gallery's drawer and the Controls pane's easing
 *       dropdown both render `EasingCatalogue` (`[data-easing-catalogue]`; the
 *       dropdown half is channel-options-render-edge (5)/(6), re-seated);
 *   (2) the family filter is ONE glass segmented control (`SegmentedTabs`),
 *       not a row of loose pills; a divider sits between it and the grid;
 *   (3) on "All", one type-scale header per family; a single family shows no
 *       header and only its tiles;
 *   (4) one tile idiom: the curve with its ball carriage on the `.b` plot, the
 *       name beneath, whole; the selected tile is the one `data-state="on"`
 *       tile and a pick selects the scene's curve.
 * Born RED at kf `82360347` (the ToggleGroup pill filter, no divider, no
 * headers, no catalogue).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { warmKfEngine } from "../../../demo/kf-engine";

import { EASING_GROUPS } from "../../../demo/utils/reference-data/easingGroups";

class OnScreenIntersectionObserver {
    constructor(private readonly cb: (e: { target: Element; isIntersecting: boolean }[]) => void) {}
    observe(target: Element) {
        this.cb([{ target, isIntersecting: true }]);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}
class InertResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const SPECIMEN_GROUPS = EASING_GROUPS.filter((g) => g.family !== "Custom");
const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};

describe("X.KF.W13W.p · OA-58 — the easing picker's one hierarchy", () => {
    let host: HTMLElement;
    beforeAll(async () => {
        // jsdom implements no Web Animations; the segmented control's indicator
        // reads its element's running animations on a selection change.
        if (!("getAnimations" in Element.prototype))
            Object.defineProperty(Element.prototype, "getAnimations", {
                configurable: true,
                value: () => [],
            });
        if (!("animate" in Element.prototype))
            Object.defineProperty(Element.prototype, "animate", {
                configurable: true,
                value: () => ({
                    finished: Promise.resolve(),
                    playState: "finished",
                    onfinish: null,
                    cancel() {},
                    finish() {},
                    play() {},
                    pause() {},
                    commitStyles() {},
                    persist() {},
                    addEventListener() {},
                    removeEventListener() {},
                }),
            });
        await warmKfEngine();
    });
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", InertResizeObserver);
        vi.stubGlobal("IntersectionObserver", OnScreenIntersectionObserver);
        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent: () => false,
        }));
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        host.remove();
    });

    const mountGallery = async () => {
        const { default: EasingTarget } = await import("../../../demo/scenes/easing/EasingTarget.vue");
        const { useEasingDemo } = await import("../../../demo/scenes/easing/useEasingDemo");
        const { EASING_DEMO_KEY } = await import("../../../demo/scenes/easing/easingKeys");
        let demo!: ReturnType<typeof useEasingDemo>;
        const app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    provide(EASING_DEMO_KEY, demo);
                    return () => h(TooltipProvider, null, { default: () => h(EasingTarget) });
                },
            }),
        );
        app.mount(host);
        await settle();
        return { app, demo: () => demo };
    };

    it("(1)(2) the gallery renders the one picker: a segmented family filter, then a divider, then the grid", async () => {
        const { app } = await mountGallery();
        try {
            const pickers = host.querySelectorAll("[data-easing-catalogue]");
            expect(pickers).toHaveLength(1);
            const picker = pickers[0]!;
            const filter = picker.querySelector('[aria-label="Filter curves by family"]')!;
            expect(filter).not.toBeNull();
            // ONE glass segmented control — never a ToggleGroup of loose pills.
            expect(filter.classList.contains("segmented-tabs")).toBe(true);
            expect(filter.querySelectorAll(".toggle-group__item")).toHaveLength(0);
            const labels = [...filter.querySelectorAll("button")].map((b) => b.textContent?.trim());
            expect(labels).toEqual(["All", ...SPECIMEN_GROUPS.map((g) => g.family)]);
            // The divider sits between the filter and the grid, in DOM order.
            const divider = picker.querySelector('[data-slot="separator"]')!;
            expect(divider).not.toBeNull();
            const grid = picker.querySelector(".specimen-grid")!;
            expect(filter.compareDocumentPosition(divider) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
            expect(divider.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        } finally {
            app.unmount();
        }
    });

    it("(3) 'All' shows one header per family over its own tiles; one family shows no header", async () => {
        const { app } = await mountGallery();
        try {
            const picker = host.querySelector("[data-easing-catalogue]")!;
            const sections = [...picker.querySelectorAll(".catalogue-section")];
            expect(sections.map((s) => s.querySelector("h3")?.textContent?.trim())).toEqual(
                SPECIMEN_GROUPS.map((g) => g.family),
            );
            sections.forEach((s, i) => {
                expect(s.querySelector("h3")!.className).toMatch(/\btext-subheading\b/);
                expect(
                    [...s.querySelectorAll(".specimen-tile .tile-name")].map((n) => n.textContent?.trim()),
                ).toEqual(SPECIMEN_GROUPS[i]!.items.map((it) => it.name));
            });
            const sine = [...picker.querySelectorAll<HTMLElement>('[aria-label="Filter curves by family"] button')].find(
                (b) => b.textContent?.trim() === "Sine",
            )!;
            sine.click();
            await settle();
            expect(picker.querySelectorAll("h3")).toHaveLength(0);
            expect(
                [...picker.querySelectorAll(".specimen-tile .tile-name")].map((n) => n.textContent?.trim()),
            ).toEqual(SPECIMEN_GROUPS.find((g) => g.family === "Sine")!.items.map((it) => it.name));
        } finally {
            app.unmount();
        }
    });

    it("(4) one tile idiom — curve + ball carriage + whole name; one selected tile; a pick selects the curve", async () => {
        const { app, demo } = await mountGallery();
        try {
            const tiles = [...host.querySelectorAll<HTMLElement>("[data-easing-catalogue] .specimen-tile")];
            expect(tiles).toHaveLength(SPECIMEN_GROUPS.flatMap((g) => g.items).length);
            for (const t of tiles) {
                expect(t.querySelector(".tile-sparkline path")?.getAttribute("d")).toMatch(/^M /);
                expect(t.querySelector(".tile-plot > .tile-carriage > .tile-ball")).not.toBeNull();
                const name = t.querySelector(".tile-name")!.textContent!.trim();
                expect(name).not.toMatch(/…|\.\.\.$/);
                expect(t.querySelector(".tile-carriage")!.getAttribute("data-curve")).toBe(name);
            }
            const on = () => tiles.filter((t) => t.getAttribute("data-state") === "on");
            expect(on()).toHaveLength(1);
            expect(on()[0]!.querySelector(".tile-name")!.textContent!.trim()).toBe(
                demo().currentEasingName.value,
            );
            const target = tiles.find((t) => t.querySelector(".tile-name")!.textContent!.trim() === "ease-out-back")!;
            target.click();
            await settle();
            expect(demo().currentEasingName.value).toBe("ease-out-back");
            expect(on()).toEqual([target]);
        } finally {
            app.unmount();
        }
    });
});
