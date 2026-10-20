/**
 * X.KF.W13V.s — OA-37/46/51 (KF-W13 §0bl/§0by/§0ce): every scene's editors are
 * DOCK ITEMS, one per kind (Controls · Keyframes · Timeline · the scene facet),
 * from ONE shared descriptor, each opening the ONE shared controls pane. The
 * item set is identical on every scene; a scene disables what it has no data
 * for and never invents an item. Home has no scene, so no items.
 */
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";
import {
    DOCK_ITEM_KINDS,
    SURFACE_META,
    channelFacetsOf,
    dockSurfaceItems,
    extraTabsFrom,
    surfacesFor,
    type ControlSurface,
} from "@state/controlSurfaces";

// X.KF.W13X.esc2 · ESC-dock-3 — every scene descriptor carries its miniature
// (`icon` is required, home included); a fixture glyph stands in for it here.
const Glyph = defineComponent(() => () => h("span"));

// The live scene facilities' shapes, read structurally (surfacesFor, T.B2).
const paints = { name: "A", animation: {} };
const SCENE_SURFACES: Record<string, ControlSurface[]> = {
    cube: surfacesFor({ channels: [paints], facets: [] }),
    amiga: surfacesFor({ channels: [paints], facets: [] }),
    square: surfacesFor({ channels: [paints], facets: [] }),
    easing: surfacesFor({ channels: [paints], facets: [{ surface: "easing" }] }),
    spring: surfacesFor({ channels: [paints], facets: [{ surface: "spring" }] }),
    // X.KF.W13V.s2 — sequence's light channel declares the Timeline (its
    // Sequence mode); it has no Controls/Keyframes data and no facet.
    sequence: surfacesFor({ channels: [{ name: "Sequence", surfaces: ["timeline"] }], facets: [] }),
};

describe("dockSurfaceItems — the ONE dock item descriptor", () => {
    it("every scene projects the same four kinds, in the same order", () => {
        for (const [scene, surfaces] of Object.entries(SCENE_SURFACES)) {
            const kinds = dockSurfaceItems(surfaces).map((i) => i.kind);
            expect(kinds, scene).toEqual([...DOCK_ITEM_KINDS]);
        }
    });

    it("a scene disables what it has no data for — never drops or invents", () => {
        const seq = dockSurfaceItems(SCENE_SURFACES.sequence!);
        expect(seq.map((i) => [i.label, i.enabled])).toEqual([
            ["Controls", false],
            ["Keyframes", false],
            ["Timeline", true],
            ["", false], // the blank facet seat (X-DS KF-C13-01)
        ]);
        const cube = dockSurfaceItems(SCENE_SURFACES.cube!);
        expect(cube.map((i) => i.enabled)).toEqual([true, true, true, false]);
        const spring = dockSurfaceItems(SCENE_SURFACES.spring!);
        expect(spring.map((i) => [i.label, i.enabled])).toEqual([
            ["Controls", true],
            ["Keyframes", true],
            ["Timeline", true],
            ["Physics", true],
        ]);
        expect(dockSurfaceItems(SCENE_SURFACES.easing!)[3]!.label).toBe("Curve");
    });
});

function mountDock(props: Record<string, unknown>) {
    const onToggle: unknown[] = [];
    const onSelect: unknown[] = [];
    const wrapper = mount(
        defineComponent(() => () =>
            h(TooltipProvider, null, () =>
                h(ChromeDock, {
                    currentSceneId: "spring",
                    scenes: [{ id: "spring", label: "Spring", icon: Glyph }],
                    homeScene: { id: "home", label: "Home", icon: Glyph },
                    isControlsPanelOpen: false,
                    onToggleControlsPanel: () => onToggle.push(1),
                    onUpdateSelectedControl: (v: unknown) => onSelect.push(v),
                    ...props,
                }),
            ),
        ),
        { attachTo: document.body },
    );
    return { wrapper, onToggle, onSelect };
}

const springProps = {
    controlSurfaces: SCENE_SURFACES.spring,
    extraControlTabs: extraTabsFrom(SCENE_SURFACES.spring!),
    selectedControl: "spring",
};

// OD19-K6 — the surfaces are ONE glass DockTrigger (for="dropdown") and its
// DropdownMenu, the @mbabb menu's pair: the face is the showing surface's
// glyph, the rows are titled (glyph + title from `dockSurfaceItems`), a
// disabled row keeps its title (its reason), and re-picking the showing row
// closes the pane. The menu portals to the body, so rows are read there.
const rows = () => [...document.querySelectorAll<HTMLElement>("[data-dock-surface-item]")];

async function openMenu(wrapper: ReturnType<typeof mountDock>["wrapper"]) {
    // The producer's DockTrigger actuates on `pointerdown`; the gesture is
    // dispatched as the browser sends it (mbabb-menu-self-hold's idiom).
    const el = wrapper.find("[data-dock-surface-trigger]").element;
    const init = { bubbles: true, cancelable: true, button: 0 };
    el.dispatchEvent(new window.PointerEvent("pointerdown", init));
    el.dispatchEvent(new window.PointerEvent("pointerup", init));
    el.dispatchEvent(new window.MouseEvent("click", { ...init, detail: 1 }));
    await flushPromises();
    await nextTick();
}

describe("ChromeDock: one surface trigger whose menu opens the shared pane", () => {
    it("renders ONE trigger (no item run, no Select, no panel toggle) faced by the showing surface", async () => {
        const { wrapper } = mountDock(springProps);
        const triggers = wrapper.findAll("[data-dock-surface-trigger]");
        expect(triggers).toHaveLength(1);
        expect(triggers[0]!.attributes("aria-haspopup")).toBe("menu");
        expect(triggers[0]!.attributes("data-surface")).toBe("spring");
        // No surface row rides the dock itself: the rows are the menu's.
        expect(wrapper.find(".glass-dock [data-dock-surface-item]").exists()).toBe(false);
        expect(wrapper.find("[aria-label='Controls tab']").exists()).toBe(false);
        expect(wrapper.find("[aria-label='Controls panel']").exists()).toBe(false);
        expect(rows()).toHaveLength(0);
        wrapper.unmount();
    });

    it("its menu names the four surfaces, each row a glyph + its title", async () => {
        const { wrapper } = mountDock(springProps);
        await openMenu(wrapper);
        const r = rows();
        expect(r.map((e) => e.getAttribute("role"))).toEqual(["menuitemradio", "menuitemradio", "menuitemradio", "menuitemradio"]);
        expect(r.map((e) => e.textContent?.trim())).toEqual(["Controls", "Keyframes", "Timeline", "Physics"]);
        for (const e of r) expect(e.querySelector("svg")).not.toBeNull();
        // C1-KF-10 — the pane is closed, so no row is checked.
        expect(r.filter((e) => e.getAttribute("aria-checked") === "true")).toHaveLength(0);
        wrapper.unmount();
    });

    it("picking a row selects its surface and opens the closed pane", async () => {
        const { wrapper, onToggle, onSelect } = mountDock(springProps);
        await openMenu(wrapper);
        rows().find((e) => e.dataset.surface === "keyframes")!.click();
        await flushPromises();
        expect(onSelect).toEqual(["keyframes"]);
        expect(onToggle).toHaveLength(1);
        wrapper.unmount();
    });

    it("re-picking the row the open pane is showing closes the pane", async () => {
        const { wrapper, onToggle, onSelect } = mountDock({
            ...springProps,
            isControlsPanelOpen: true,
        });
        await openMenu(wrapper);
        const physics = rows().find((e) => e.dataset.surface === "spring")!;
        // C1-KF-10 — the showing row wears the producer's checked radio (its dot),
        // and it is the only checked row.
        expect(physics.getAttribute("aria-checked")).toBe("true");
        expect(physics.querySelector(".menu__radio-dot")).not.toBeNull();
        expect(rows().filter((e) => e.getAttribute("aria-checked") === "true")).toEqual([physics]);
        physics.click();
        await flushPromises();
        expect(onSelect).toEqual([]);
        expect(onToggle).toHaveLength(1);
        wrapper.unmount();
    });

    it("a disabled row keeps its title and does nothing; home shows no trigger", async () => {
        const seq = mountDock({
            currentSceneId: "sequence",
            scenes: [{ id: "sequence", label: "Sequence", icon: Glyph }],
            controlSurfaces: ["timeline"],
            extraControlTabs: [],
        });
        // The face is the one live surface's.
        expect(seq.wrapper.find("[data-dock-surface-trigger]").attributes("data-surface")).toBe("timeline");
        await openMenu(seq.wrapper);
        const r = rows();
        // The blank facet seat has no name, so it is no row.
        expect(r.map((e) => [e.textContent?.trim(), e.hasAttribute("data-disabled")])).toEqual([
            ["Controls", true],
            ["Keyframes", true],
            ["Timeline", false],
        ]);
        r[1]!.click();
        await flushPromises();
        expect(seq.onSelect).toEqual([]);
        expect(seq.onToggle).toEqual([]);
        seq.wrapper.unmount();

        // A latent facet's disabled row names its reason.
        const cube = mountDock({
            currentSceneId: "cube",
            scenes: [{ id: "cube", label: "Cube", icon: Glyph }],
            controlSurfaces: ["controls", "keyframes", "timeline"],
            extraControlTabs: [],
            channelFacets: [{ surface: "matrix-controls", channel: "Matrix" }],
            selectedControl: "controls",
        });
        await openMenu(cube.wrapper);
        const facet = rows()[3]!;
        expect(facet.textContent?.trim()).toBe("Matrix: select the Matrix channel");
        expect(facet.hasAttribute("data-disabled")).toBe(true);
        cube.wrapper.unmount();

        const home = mountDock({ currentSceneId: "home", controlSurfaces: [] });
        expect(home.wrapper.findAll("[data-dock-surface-trigger]")).toHaveLength(0);
        home.wrapper.unmount();
    });
});

// X.KF.W13X.esc1 (ESC-mobile-2 · A2-KE-L1-11 · UIA-KF-103/133/238) — ONE surface
// module: the registry and the dock-item descriptor are read from
// `@state/controlSurfaces` (the facility copy is deleted); one glyph per
// surface; the cube facet is named "Matrix".
describe("the one surface registry (X.KF.W13X.esc1)", () => {
    it("gives every surface its own glyph (UIA-KF-238)", () => {
        const icons = Object.values(SURFACE_META).map((m) => m.icon);
        expect(new Set(icons).size).toBe(icons.length);
        expect(SURFACE_META.spring.icon).not.toBe(SURFACE_META.easing.icon);
    });
    it("names the cube facet by the facet, not '… Controls' (UIA-KF-133)", () => {
        expect(SURFACE_META["matrix-controls"].label).toBe("Matrix");
        const labels = Object.values(SURFACE_META).map((m) => m.label);
        expect(labels.filter((l) => /controls/i.test(l))).toEqual(["Controls"]);
    });
    // X-DS KF-C12-01 — the facet slot never shows a generic glyph with an
    // internal name: a scene whose channel carries a conditional facet names
    // that facet and the channel that enables it; a scene with none keeps a blank seat.
    it("a facet slot with no live facet names the facet its channel would show", () => {
        const channels = [
            { name: "Matrix", animation: {}, facets: [{ surface: "matrix-controls" as const }] },
            { name: "Rotations", animation: {} },
        ];
        const facets = channelFacetsOf(channels);
        expect(facets).toEqual([{ surface: "matrix-controls", channel: "Matrix" }]);
        const atRest = dockSurfaceItems(surfacesFor({ channels, facets: [] }, "Rotations"), facets);
        expect(atRest[3]).toMatchObject({
            kind: "facet",
            surface: "matrix-controls",
            label: "Matrix",
            icon: SURFACE_META["matrix-controls"].icon,
            title: "Matrix: select the Matrix channel",
            enabled: false,
        });
        const selected = dockSurfaceItems(surfacesFor({ channels, facets: [] }, "Matrix"), facets);
        expect(selected[3]).toMatchObject({ label: "Matrix", title: "Matrix", enabled: true });
        // X-DS KF-C13-01 — a scene with no facet keeps the seat (the set is
        // identical on every scene) but the seat is blank: no glyph, no name.
        const none = dockSurfaceItems(SCENE_SURFACES.amiga!);
        expect(none[3]).toEqual({ kind: "facet", label: "", icon: "", title: "", enabled: false });
        expect(none.map((i) => i.icon)).not.toContain("Activity");
        expect(none.map((i) => i.icon)).not.toContain("CircleDashed");
    });
    it("the dock item for a facet carries the registry's own glyph", () => {
        const spring = dockSurfaceItems(["controls", "keyframes", "timeline", "spring"]);
        expect(spring[3]).toMatchObject({ kind: "facet", label: "Physics", icon: SURFACE_META.spring.icon });
    });
});
