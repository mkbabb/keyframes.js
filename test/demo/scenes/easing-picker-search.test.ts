/**
 * FIFTY-FIFTH (owner, 23 Nov 2026, of the easing picker's dropdown): "this
 * should be wider and searchable, too. On desktop and mobile."
 *
 * The dropdown picker (`EasingCatalogue`, `density="menu"`) gains a search
 * field: a curve is found by a part of its name or its family, every word of
 * the query counting; the rows land through the filter's own fade; Enter picks
 * the first curve shown; a query that finds nothing says so. The stage gallery
 * (`density="stage"`) has no field. Read off real mounts over the real
 * catalogue data (`EASING_GROUPS`), never the source text. Born red on
 * 2a11fb1f: the catalogue had no search.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, h, nextTick } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { warmKfEngine } from "../../../demo/kf-engine";
import { EASING_GROUPS } from "../../../demo/utils/reference-data/easingGroups";
import { namedEasing } from "../../../demo/utils/reference-data/timingCurveUtils";

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

const GROUPS = EASING_GROUPS.filter((g) => g.family !== "Custom");
/** The tiles' plots: a named curve, or a straight line for a draft kind
 *  (`steps`), as the dropdown's own `curveFnFor` gives a stored draft. */
const curveFor = (name: string) => {
    try {
        return namedEasing(name);
    } catch {
        return (t: number) => t;
    }
};
const settle = async () => {
    for (let i = 0; i < 6; i++) await nextTick();
    // The filter's fade: out, swap, in (the stub resolves at once).
    await new Promise((r) => setTimeout(r, 0));
    for (let i = 0; i < 6; i++) await nextTick();
};

describe("FIFTY-FIFTH — the dropdown easing picker is searchable", () => {
    let host: HTMLElement;
    beforeAll(async () => {
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
            matches: /min-width/.test(query),
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

    const mount = async (density: "menu" | "stage") => {
        const { default: EasingCatalogue } = await import(
            "../../../demo/components/EasingCatalogue/EasingCatalogue.vue"
        );
        const picked: string[] = [];
        const app = createApp({
            render: () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(EasingCatalogue, {
                            modelValue: "linear",
                            groups: GROUPS,
                            curveFor,
                            label: "Easing curves",
                            density,
                            "onUpdate:modelValue": (v: string) => picked.push(v),
                        }),
                }),
        });
        app.mount(host);
        await settle();
        return { app, picked };
    };
    const field = () => host.querySelector<HTMLInputElement>("input[data-catalogue-search]");
    const shown = () =>
        [...host.querySelectorAll<HTMLElement>(".specimen-tile")].map((t) => t.getAttribute("data-value") ?? t.querySelector(".tile-name")!.textContent!.trim());
    const type = async (text: string) => {
        const input = field()!;
        input.value = text;
        input.dispatchEvent(new Event("input"));
        await settle();
    };
    const ALL_NAMES = GROUPS.flatMap((g) => g.items.map((i) => i.name));

    it("the dropdown has one search field, named; the stage gallery has none", async () => {
        const menu = await mount("menu");
        try {
            const input = field();
            expect(input).not.toBeNull();
            expect(input!.type).toBe("search");
            expect(input!.getAttribute("aria-label")).toBe("Search curves");
            expect(input!.placeholder).toBe("Search curves");
            expect(shown()).toEqual(ALL_NAMES);
        } finally {
            menu.app.unmount();
        }
        const stage = await mount("stage");
        try {
            expect(field()).toBeNull();
        } finally {
            stage.app.unmount();
        }
    });

    it("finds by a part of the name, every word counting, and by family", async () => {
        const { app } = await mount("menu");
        try {
            await type("expo");
            const expo = ALL_NAMES.filter((n) => n.includes("expo"));
            expect(expo).toHaveLength(3);
            expect(shown()).toEqual(expo);

            await type("in out");
            const inOut = ALL_NAMES.filter((n) => n.includes("in") && n.includes("out"));
            expect(inOut.length).toBeGreaterThan(1);
            expect(shown()).toEqual(inOut);

            const back = GROUPS.find((g) => g.family === "Back")!;
            await type("BACK");
            expect(shown()).toEqual(
                ALL_NAMES.filter((n) => n.includes("back") || back.items.some((i) => i.name === n)),
            );
            // Each family that has a match keeps its heading over its rows.
            expect(host.querySelectorAll(".catalogue-family").length).toBeGreaterThan(0);

            await type("");
            expect(shown()).toEqual(ALL_NAMES);
        } finally {
            app.unmount();
        }
    });

    it("a query that finds nothing says so; Enter picks the first curve shown", async () => {
        const { app, picked } = await mount("menu");
        try {
            await type("zzz");
            expect(shown()).toEqual([]);
            const status = host.querySelector('[role="status"].catalogue-empty');
            expect(status?.textContent).toContain("zzz");

            await type("sine");
            const first = ALL_NAMES.find((n) => n.includes("sine"))!;
            field()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
            await settle();
            expect(picked).toEqual([first]);
        } finally {
            app.unmount();
        }
    });
});
