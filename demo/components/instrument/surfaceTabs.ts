import {
    BUILT_IN_SURFACES,
    type ControlSurface,
} from "@state/controlSurfaces";

export interface ControlSurfaceTab {
    value: ControlSurface;
    label: string;
    icon?: string;
}

export const SURFACE_META: Record<ControlSurface, ControlSurfaceTab> = {
    controls: { value: "controls", label: "Controls", icon: "SlidersHorizontal" },
    keyframes: { value: "keyframes", label: "Keyframes", icon: "Braces" },
    timeline: { value: "timeline", label: "Timeline", icon: "Clock" },
    easing: { value: "easing", label: "Curve", icon: "Activity" },
    spring: { value: "spring", label: "Physics", icon: "Activity" },
    "matrix-controls": { value: "matrix-controls", label: "Matrix Controls", icon: "Grid3X3" },
};

export function extraTabsFrom(surfaces: readonly ControlSurface[]): ControlSurfaceTab[] {
    return surfaces.filter((surface) => !BUILT_IN_SURFACES.includes(surface)).map((surface) => SURFACE_META[surface]);
}

export function dockCardinality(input: {
    tabs: readonly ControlSurfaceTab[];
    channels: readonly string[];
    sceneLabel?: string;
}) {
    const controlZone = input.tabs.length > 1
        ? { kind: "select" as const, tabs: [...input.tabs] }
        : input.tabs.length === 1
          ? { kind: "inline" as const, tab: input.tabs[0]! }
          : { kind: "absent" as const };
    const channelZone = input.channels.length > 1
        ? { kind: "select" as const, channels: [...input.channels] }
        : { kind: "absent" as const };
    const controlLabelRedundant = controlZone.kind === "inline" && !!input.sceneLabel &&
        controlZone.tab.label.trim().toLowerCase() === input.sceneLabel.trim().toLowerCase();
    return { controlZone, channelZone, controlLabelRedundant };
}

// ── THE ONE DOCK-ITEM DESCRIPTOR (X.KF.W13V.s · OA-37/46/51) ────────────────
// The owner: "we should have dock items for keyframes, timeline, etc--NOT
// inline keyframes". Every scene's dock carries the SAME four item kinds, in
// the same order: Controls · Keyframes · Timeline · the scene facet. Each item
// opens the ONE shared controls pane on its surface. A scene never invents an
// item: what it has no data for is DISABLED (the item stays, so the set is
// identical on every scene). Which items are live is read from the derived
// surface set (`surfacesFor`, T.B2) — never a per-scene table.

/** The four dock item kinds, in dock order. `facet` resolves to the scene's
 *  non-built-in surface(s) (Curve, Physics, Matrix Controls). */
export const DOCK_ITEM_KINDS = ["controls", "keyframes", "timeline", "facet"] as const;
export type DockItemKind = (typeof DOCK_ITEM_KINDS)[number];

/** One rendered dock item. `surface` is undefined only for a disabled facet
 *  slot (the scene has no facet). */
export interface DockSurfaceItem {
    kind: DockItemKind;
    surface?: ControlSurface;
    label: string;
    icon: string;
    enabled: boolean;
}

/** The disabled facet slot's descriptor (a scene with no facet). */
const FACET_PLACEHOLDER = { label: "Scene facet", icon: "Activity" } as const;

/**
 * Project a scene's derived surface set onto the ONE dock item set. Pure and
 * total: the result always holds the three built-in kinds plus at least one
 * facet item; a surface outside `surfaces` renders disabled.
 */
export function dockSurfaceItems(surfaces: readonly ControlSurface[]): DockSurfaceItem[] {
    const builtIn: DockSurfaceItem[] = BUILT_IN_SURFACES.map((surface) => {
        const meta = SURFACE_META[surface];
        return {
            kind: surface as DockItemKind,
            surface,
            label: meta.label,
            icon: meta.icon ?? "SlidersHorizontal",
            enabled: surfaces.includes(surface),
        };
    });
    const facets = extraTabsFrom(surfaces);
    const facetItems: DockSurfaceItem[] = facets.length
        ? facets.map((tab) => ({
              kind: "facet",
              surface: tab.value,
              label: tab.label,
              icon: tab.icon ?? FACET_PLACEHOLDER.icon,
              enabled: true,
          }))
        : [{ kind: "facet", ...FACET_PLACEHOLDER, enabled: false }];
    return [...builtIn, ...facetItems];
}
