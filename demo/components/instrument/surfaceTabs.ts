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
