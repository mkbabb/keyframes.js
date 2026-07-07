// ─────────────────────────────────────────────────────────────────────────────
// THE CONTROL-SURFACE DERIVATION — the THIRD orthogonal axis on the H.W1
// keystone (H.W11.S4 / I2), INVERTED at T.B2 from a hand-maintained per-scene
// exclusion TABLE (the deleted `CONTROL_SURFACES` / `CONDITIONAL_SURFACES` rows,
// keyed by SceneId) into a DERIVATION off the live scene facility. The valid
// surface set is now COMPUTED from "does the
// selected channel paint" — never declared per scene — so no row can deny a
// painting group its triad (the owner's #25 asymmetry vanishes BY
// CONSTRUCTION). Pure core, co-located with the scene+playback reducer it
// EXTENDS (sceneMachine.ts owns scene+playback; THIS owns control-surface
// VISIBILITY). The reactive projection is exposed through the effect layer
// (useSceneMachine.ts `controlSurfaces`, fed the active facility by the App via
// `setActiveSurfaces`).
//
// THE DERIVATION (T.B2): `surfacesFor(facility, selected)` =
//   [...(selected.animation ? BUILT_IN_SURFACES : selected.surfaces ?? []),
//    ...(the selected channel's own conditional facets — cube's matrix-controls),
//    ...facility.facets.map(f => f.surface)]
// A channel that carries a painting `animation` earns the BUILT-IN triad
// (Controls/Keyframes/Timeline); a light channel declares its honest subset; the
// facility's additive facets (easing Curve, spring Physics) union on top. Cube's
// `matrix-controls` is a facet on its Matrix CHANNEL descriptor — visible only
// while that channel is selected, so selection-gating is just "which channel is
// selected" (the old CONDITIONAL_SURFACES + activeConditionals threading DIED).
//
// DO NOT touch the W1 reducer (`transition`) — this is a PURE orthogonal
// PROJECTION, never a state mutation. proof:scene-machine-irrefragable stays
// GREEN by construction.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The control-surface alphabet — every surface a scene MAY expose in the control
 * dock/panel. `controls`/`keyframes`/`timeline` are the BUILT-IN editor triad;
 * `easing`/`spring`/`matrix-controls` are the scene-specific facet surfaces whose
 * tab metadata resolves from the ONE `SURFACE_META` registry. The derivation is
 * the authority on WHICH of these hold for the active (facility × selected
 * channel); the tab host renders the INTERSECTION of its known tab descriptors
 * with the derived set.
 */
export type ControlSurface =
    | "controls"
    | "keyframes"
    | "timeline"
    | "easing"
    | "spring"
    | "matrix-controls";

/** The BUILT-IN editor triad — the surfaces `AnimationControls`/`ChromeDock`
 *  carry as first-class tab descriptors. A channel that PAINTS (carries an
 *  `animation`) earns the whole triad by construction. */
export const BUILT_IN_SURFACES: readonly ControlSurface[] = [
    "controls",
    "keyframes",
    "timeline",
];

// ── THE DERIVATION INPUT (T.B2 — structural, cycle-free) ─────────────────────
// `surfacesFor` reads the live `SceneFacility` STRUCTURALLY (the app/scene/
// `SceneFacility`/`ChannelHandle`/`SceneFacet` satisfy these), so this pure
// state module never imports the app-scene layer (which imports FROM @state —
// the cycle the structural typing breaks).

/** The channel shape `surfacesFor` reads: does it paint (`animation`), what
 *  honest subset does a light channel declare (`surfaces`), and what conditional
 *  facets does selecting IT add (cube's Matrix channel → matrix-controls). */
export interface SurfaceChannelLike {
    name: string;
    /** Present ⇒ this channel PAINTS ⇒ it earns the BUILT-IN triad. */
    animation?: unknown;
    /** A light channel's honest surface subset (no fictional keyframes). */
    surfaces?: readonly ControlSurface[];
    /** Conditional facets contributed ONLY while THIS channel is selected. */
    facets?: readonly { surface: ControlSurface }[];
}

/** The facility shape `surfacesFor` reads: the transport channels + the
 *  facility-wide additive facets (easing Curve, spring Physics). */
export interface SurfaceFacilityLike {
    channels: readonly SurfaceChannelLike[];
    facets: readonly { surface: ControlSurface }[];
}

/**
 * THE DERIVATION (T.B2). The valid control-surface set for a scene, COMPUTED
 * from its live facility × the selected channel — never a hand-maintained table
 * row. The triad half is *computed* from "does the selected channel paint," so a
 * painting group can never be denied it (the #25 asymmetry cure). A light
 * channel contributes only its declared honest `surfaces` (sequence → []). The
 * selected channel's own conditional facets union on (cube's matrix-controls —
 * visible only while the Matrix channel is selected); the facility-wide facets
 * (easing Curve / spring Physics) always union. `home` (no facility) → [].
 *
 * Deduplicated, order-preserving. Returns a fresh array per call.
 */
export function surfacesFor(
    facility: SurfaceFacilityLike | undefined,
    selectedName?: string,
): ControlSurface[] {
    if (!facility) return [];
    const { channels, facets } = facility;
    const selected =
        channels.find((c) => c.name === selectedName) ?? channels[0];

    // The triad is COMPUTED from paint: a channel carrying an `animation` earns
    // {controls,keyframes,timeline}; a light channel contributes its honest
    // declared subset (sequence's lone channel declares []).
    const base: ControlSurface[] = selected?.animation
        ? [...BUILT_IN_SURFACES]
        : [...(selected?.surfaces ?? [])];

    // The selected channel's conditional facets (cube's Matrix channel →
    // matrix-controls) — selection-gating IS "which channel is selected."
    const channelFacets = (selected?.facets ?? []).map((f) => f.surface);

    // The facility-wide additive facets (easing Curve, spring Physics).
    const facilityFacets = facets.map((f) => f.surface);

    const all = [...base, ...channelFacets, ...facilityFacets];
    return all.filter((s, i) => all.indexOf(s) === i);
}

// ── THE SURFACE-METADATA REGISTRY (T.B2 — the triplication fold) ─────────────
// The scene-specific surfaces' TAB METADATA (value + label + icon), single-
// sourced HERE. Formerly the surface→{label,icon} map existed THREE times —
// `SCENE_SURFACE_TABS` here, `BUILT_IN_TAB_META` in AnimationControls.vue,
// `BUILT_IN_CONTROL_TABS`+`TAB_ICONS` in ChromeDock.vue — three hand-synced
// copies of one fact. This is the SINGLE source: both docks and the in-panel
// strip derive their tab descriptors from it (ChromeDock's `TAB_ICONS` survives
// as the string→component ICON registry, a render concern, not metadata).

/** A dock/tab-host descriptor for a control surface. The `icon` is a key into
 *  the host's icon-COMPONENT registry (ChromeDock `TAB_ICONS` — a string→
 *  component map, not metadata). */
export interface ControlSurfaceTab {
    value: ControlSurface;
    label: string;
    icon?: string;
}

/**
 * THE ONE SURFACE-METADATA REGISTRY. Total over the ControlSurface alphabet —
 * both docks and the in-panel strip resolve every tab's `{label,icon}` from HERE
 * (proof:dfa-derived's "resolves from exactly ONE module" clause).
 */
export const SURFACE_META: Record<ControlSurface, ControlSurfaceTab> = {
    controls: { value: "controls", label: "Controls", icon: "SlidersHorizontal" },
    keyframes: { value: "keyframes", label: "Keyframes", icon: "Braces" },
    timeline: { value: "timeline", label: "Timeline", icon: "Clock" },
    easing: { value: "easing", label: "Easing", icon: "Activity" },
    spring: { value: "spring", label: "Spring", icon: "Activity" },
    "matrix-controls": {
        value: "matrix-controls",
        label: "Matrix Controls",
        icon: "Grid3X3",
    },
};

/**
 * The scene-specific control tabs derived from a surface SET — the non-built-in
 * surfaces mapped through the ONE `SURFACE_META` registry (the dock's
 * `extraControlTabs`). Pure over the derived set: the caller (App) computes the
 * set via `surfacesFor`, so the tab metadata settles synchronously with the
 * route (no tick-late `sceneRef.extraControlTabs` re-bind).
 */
export function extraTabsFrom(
    surfaces: readonly ControlSurface[],
): ControlSurfaceTab[] {
    return surfaces
        .filter((s) => !BUILT_IN_SURFACES.includes(s))
        .map((s) => SURFACE_META[s]);
}

/**
 * Resolve the SELECTED control surface from a derived surface SET × a preferred
 * pick — a PURE FUNCTION so the value is synchronously correct on the mounting
 * tick (no reka latch race). Returns the set's first surface when the preference
 * is absent / not a valid member (the deterministic default); `undefined` only
 * when the set is empty (home/sequence mount no control pane).
 */
export function selectedSurfaceFrom(
    surfaces: readonly ControlSurface[],
    preferred?: string,
): ControlSurface | undefined {
    if (surfaces.length === 0) return undefined;
    const pick = preferred as ControlSurface;
    if (preferred && surfaces.includes(pick)) return pick;
    return surfaces[0];
}

// ── THE DOCK CARDINALITY PROJECTION (T.B5-MODEL — the ONE elision rule) ───────
// VERDICT #17 ("when we have a page with ONE option … elide that intelligently")
// + #6 (the superfluous divider). Single-option elision was half-built, DUPLICATED
// across three sites (ChromeDock `multipleControlTabs`, TransportDock
// `animationNames.length`, AnimationControls `isSingleSurfaceScene`), and each
// SUBSTITUTED A STATIC LABEL instead of eliding — the very move the owner rejected
// (owner shot 14's second "Spring"). This is the ONE derived cardinality model both
// docks read, so the elision is decided in ONE place and consumed identically.
//
// Lane 3 (the dock host) CONSUMES this projection and DELETES the per-dock `.length`
// arithmetic + the static-label branches. This module is the single writer of the
// order-of-truth; it renders no chrome itself.

/**
 * The control-surface zone's cardinality state. `select` (>1 surface) draws the
 * dock `Select`; `inline` (exactly 1) draws the tab body with ZERO dock chrome and
 * NO static-label duplicate; `absent` (0) draws NO node AND no flanking separator.
 */
type ControlZone =
    | { kind: "select"; tabs: ControlSurfaceTab[] }
    | { kind: "inline"; tab: ControlSurfaceTab }
    | { kind: "absent" };

/**
 * The transport-channel zone's cardinality state. `select` (>1 channel) draws the
 * transport `Select`; `absent` (≤1) draws NO node and no flanking separator — a
 * lone channel needs no picker (its identity is the scene's).
 */
type ChannelZone =
    | { kind: "select"; channels: string[] }
    | { kind: "absent" };

/**
 * The ONE derived dock cardinality model both docks read (T.B5). `controlZone`
 * and `channelZone` decide select-vs-inline-vs-absent from the SAME axis-counts,
 * so the dock never re-derives `.length > 1` per site. `controlLabelRedundant`
 * carries the cross-axis clause (lane 30 rec 4): the sole control-surface identity
 * is a strict subset of the adjacent scene identity already shown — so the answer
 * is RENDER NOTHING, not a demoted label.
 */
interface DockCardinality {
    controlZone: ControlZone;
    channelZone: ChannelZone;
    /**
     * The cross-axis redundancy clause: the control zone is `inline` AND its sole
     * tab's identity duplicates the adjacent scene identity already shown (owner
     * shot 14's "Spring\nSpring" → "Spring"). Lane 3 renders nothing for the
     * control zone when this holds.
     */
    controlLabelRedundant: boolean;
}

/**
 * Derive the dock cardinality model from the two axis inputs. PURE — it counts the
 * control-surface tabs and the transport channels and resolves the cross-axis
 * redundancy against the scene label; it holds no dock state and draws no chrome.
 *
 * `tabs` — the scene's control-surface tab descriptors (the derived triad + facet
 *          set, T.B2).
 * `channels` — the transport channel names (`facility.channels.map(c => c.name)`).
 * `sceneLabel` — the scene identity already shown by the adjacent scene-select
 *          (the cross-axis redundancy comparand); omit for scenes with no adjacent
 *          scene label.
 */
export function dockCardinality(input: {
    tabs: readonly ControlSurfaceTab[];
    channels: readonly string[];
    sceneLabel?: string;
}): DockCardinality {
    const { tabs, channels, sceneLabel } = input;

    let controlZone: ControlZone;
    if (tabs.length > 1) {
        controlZone = { kind: "select", tabs: [...tabs] };
    } else if (tabs.length === 1) {
        controlZone = { kind: "inline", tab: tabs[0]! };
    } else {
        controlZone = { kind: "absent" };
    }

    const channelZone: ChannelZone =
        channels.length > 1
            ? { kind: "select", channels: [...channels] }
            : { kind: "absent" };

    // The cross-axis subset test: a lone control-surface label whose identity the
    // adjacent scene-select already shows is redundant — render nothing, not a
    // demoted static label (owner shot 14).
    const controlLabelRedundant =
        controlZone.kind === "inline" &&
        !!sceneLabel &&
        controlZone.tab.label.trim().toLowerCase() ===
            sceneLabel.trim().toLowerCase();

    return { controlZone, channelZone, controlLabelRedundant };
}
