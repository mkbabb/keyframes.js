/**
 * X.KF.W13V.s — OA-37/46/51 (KF-W13 §0bl/§0by/§0ce): every scene's editors are
 * DOCK ITEMS, one per kind (Controls · Keyframes · Timeline · the scene facet),
 * from ONE shared descriptor, each opening the ONE shared controls pane. The
 * item set is identical on every scene; a scene disables what it has no data
 * for and never invents an item. Home has no scene, so no items.
 */
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";
import {
    DOCK_ITEM_KINDS,
    dockSurfaceItems,
    extraTabsFrom,
} from "@components/instrument/surfaceTabs";
import { surfacesFor, type ControlSurface } from "@state/controlSurfaces";

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
            ["Scene facet", false],
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
                    scenes: [{ id: "spring", label: "Spring" }],
                    homeScene: { id: "home", label: "Home" },
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

describe("ChromeDock renders the items and each opens the shared pane", () => {
    it("renders the four items (no Select, no separate panel toggle)", () => {
        const { wrapper } = mountDock(springProps);
        const items = wrapper.findAll("[data-dock-surface-item]");
        expect(items.map((i) => i.attributes("aria-label"))).toEqual([
            "Controls",
            "Keyframes",
            "Timeline",
            "Physics",
        ]);
        expect(wrapper.find("[aria-label='Controls tab']").exists()).toBe(false);
        expect(wrapper.find("[aria-label='Controls panel']").exists()).toBe(false);
        expect(wrapper.find("[data-selected]").attributes("aria-label")).toBe("Physics");
        wrapper.unmount();
    });

    it("pressing an item selects its surface and opens the closed pane", async () => {
        const { wrapper, onToggle, onSelect } = mountDock(springProps);
        await wrapper.find("[data-surface='keyframes']").trigger("click");
        expect(onSelect).toEqual(["keyframes"]);
        expect(onToggle).toHaveLength(1);
        wrapper.unmount();
    });

    it("pressing the item the open pane is showing closes the pane", async () => {
        const { wrapper, onToggle, onSelect } = mountDock({
            ...springProps,
            isControlsPanelOpen: true,
        });
        const physics = wrapper.find("[data-surface='spring']");
        expect(physics.attributes("aria-pressed")).toBe("true");
        await physics.trigger("click");
        expect(onSelect).toEqual([]);
        expect(onToggle).toHaveLength(1);
        wrapper.unmount();
    });

    it("a disabled item does nothing; home shows no items", async () => {
        const seq = mountDock({
            currentSceneId: "sequence",
            scenes: [{ id: "sequence", label: "Sequence" }],
            controlSurfaces: ["timeline"],
            extraControlTabs: [],
        });
        const items = seq.wrapper.findAll("[data-dock-surface-item]");
        expect(items).toHaveLength(4);
        expect(items.map((i) => i.attributes("aria-disabled") === "true")).toEqual([
            true,
            true,
            false,
            true,
        ]);
        await items[1]!.trigger("click");
        expect(seq.onSelect).toEqual([]);
        expect(seq.onToggle).toEqual([]);
        seq.wrapper.unmount();

        const home = mountDock({ currentSceneId: "home", controlSurfaces: [] });
        expect(home.wrapper.findAll("[data-dock-surface-item]")).toHaveLength(0);
        home.wrapper.unmount();
    });
});
