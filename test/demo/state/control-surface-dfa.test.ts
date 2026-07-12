// T.B2 — the control-surface DERIVATION pure-core unit test (INVERTED from the
// H.W11 exclusion TABLE). The per-scene control-surface axis is the THIRD
// orthogonal axis on the W1 machine (scene + playback + control-surface). It is
// no longer a hand-maintained `Record<SceneId, ControlSurface[]>` row — it is
// DERIVED by `surfacesFor(facility, selected)` from the live scene facility ×
// the selected channel (does the channel PAINT). This file proves: (1) a
// painting channel earns the built-in triad BY CONSTRUCTION (the #25 asymmetry
// cure — no row can deny it); (2) a light channel contributes only its honest
// declared subset (sequence → []); (3) the facility + selected-channel facets
// union on (easing Curve, spring Physics, cube's conditional matrix-controls);
// (4) `extraTabsFrom`/`selectedSurfaceFrom` resolve the tab metadata + the
// selected member from the derived SET through the ONE `SURFACE_META` registry.
// It does NOT touch the W1 reducer — proof:scene-machine-irrefragable stays green.

import { describe, it, expect } from "vitest";
import {
    BUILT_IN_SURFACES,
    SURFACE_META,
    surfacesFor,
    extraTabsFrom,
    selectedSurfaceFrom,
    dockCardinality,
    type SurfaceFacilityLike,
    type ControlSurfaceTab,
} from "../../../demo/@/state/controlSurfaceDFA";

// ── Facility fixtures mirroring the live scenes' `SceneFacility` shape ────────

/** cube/amiga/square — every channel PAINTS (carries an `animation`). Cube's
 *  Matrix channel adds `matrix-controls` as a conditional facet. */
const groupFacility: SurfaceFacilityLike = {
    channels: [
        { name: "Rotations", animation: {} },
        {
            name: "Matrix",
            animation: {},
            facets: [{ surface: "matrix-controls" }],
        },
        { name: "Hover", animation: {} },
    ],
    facets: [],
};

/** easing — one PAINTING preview channel + the Curve facet (facility-wide). */
const easingFacility: SurfaceFacilityLike = {
    channels: [{ name: "Easing", animation: {} }],
    facets: [{ surface: "easing" }],
};

/** spring — two PAINTING channels + the Physics facet. */
const springFacility: SurfaceFacilityLike = {
    channels: [
        { name: "Sweep", animation: {} },
        { name: "Entry", animation: {} },
    ],
    facets: [{ surface: "spring" }],
};

/** sequence — one LIGHT channel (no paint, honest empty subset), no facet. */
const sequenceFacility: SurfaceFacilityLike = {
    channels: [{ name: "Sequence", surfaces: [] }],
    facets: [],
};

describe("T.B2 control-surface derivation — the triad is COMPUTED from paint", () => {
    it("a painting channel earns the full built-in triad (the #25 asymmetry cure)", () => {
        expect(surfacesFor(groupFacility, "Rotations")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
    });

    it("easing/spring — a painting channel earns the triad + the facility facet", () => {
        expect(surfacesFor(easingFacility, "Easing")).toEqual([
            "controls",
            "keyframes",
            "timeline",
            "easing",
        ]);
        expect(surfacesFor(springFacility, "Sweep")).toEqual([
            "controls",
            "keyframes",
            "timeline",
            "spring",
        ]);
    });

    it("cube's matrix-controls is a CONDITIONAL facet on the Matrix channel", () => {
        // Selecting Matrix adds matrix-controls; selecting any other channel does
        // not — selection-gating IS "which channel is selected" (no separate
        // activeConditionals thread).
        expect(surfacesFor(groupFacility, "Matrix")).toEqual([
            "controls",
            "keyframes",
            "timeline",
            "matrix-controls",
        ]);
        expect(surfacesFor(groupFacility, "Hover")).not.toContain(
            "matrix-controls",
        );
    });

    it("a LIGHT channel contributes only its honest subset (sequence → [])", () => {
        expect(surfacesFor(sequenceFacility, "Sequence")).toEqual([]);
    });

    it("home (no facility) derives the empty set", () => {
        expect(surfacesFor(undefined, undefined)).toEqual([]);
    });

    it("falls back to the FIRST channel when the selection is absent/unknown", () => {
        // No selection → the first channel drives the triad (deterministic floor).
        expect(surfacesFor(groupFacility, undefined)).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
        expect(surfacesFor(groupFacility, "does-not-exist")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
    });

    it("is deduplicated + order-preserving, and returns a FRESH array", () => {
        // A facet duplicating a base surface never doubles.
        const dupFacility: SurfaceFacilityLike = {
            channels: [{ name: "A", animation: {} }],
            facets: [{ surface: "controls" }],
        };
        expect(surfacesFor(dupFacility, "A")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
        const a = surfacesFor(groupFacility, "Rotations");
        a.push("matrix-controls");
        expect(surfacesFor(groupFacility, "Rotations")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
    });
});

describe("T.B2 — extraTabsFrom resolves facet metadata from ONE registry", () => {
    it("filters the built-in triad and maps the rest through SURFACE_META", () => {
        const tabs = extraTabsFrom(surfacesFor(easingFacility, "Easing"));
        expect(tabs).toEqual([SURFACE_META.easing]);
        // No built-in surface leaks into the extra-tab set.
        for (const s of BUILT_IN_SURFACES) {
            expect(tabs.map((t) => t.value)).not.toContain(s);
        }
    });

    it("cube's Matrix selection projects the matrix-controls tab", () => {
        expect(extraTabsFrom(surfacesFor(groupFacility, "Matrix"))).toEqual([
            SURFACE_META["matrix-controls"],
        ]);
    });

    it("a light scene with no facet projects no extra tabs", () => {
        expect(extraTabsFrom(surfacesFor(sequenceFacility, "Sequence"))).toEqual(
            [],
        );
    });
});

describe("T.B2 — selectedSurfaceFrom resolves the selected member", () => {
    it("returns undefined for the empty set (home/sequence mount no pane)", () => {
        expect(selectedSurfaceFrom([])).toBeUndefined();
    });

    it("honors a valid preferred pick", () => {
        const set = surfacesFor(easingFacility, "Easing");
        expect(selectedSurfaceFrom(set, "easing")).toBe("easing");
    });

    it("falls back to the FIRST surface for an absent/invalid pick", () => {
        const set = surfacesFor(easingFacility, "Easing");
        expect(selectedSurfaceFrom(set)).toBe("controls");
        expect(selectedSurfaceFrom(set, "spring")).toBe("controls");
    });
});

describe("T.B5 dock cardinality (unchanged by T.B2)", () => {
    const tab = (value: string): ControlSurfaceTab =>
        SURFACE_META[value as keyof typeof SURFACE_META];

    it("select for >1 tab, inline for exactly 1, absent for 0", () => {
        expect(
            dockCardinality({
                tabs: [tab("controls"), tab("keyframes")],
                channels: [],
            }).controlZone.kind,
        ).toBe("select");
        expect(
            dockCardinality({ tabs: [tab("spring")], channels: [] }).controlZone
                .kind,
        ).toBe("inline");
        expect(dockCardinality({ tabs: [], channels: [] }).controlZone.kind).toBe(
            "absent",
        );
    });

    it("flags a lone control label redundant with the adjacent scene label", () => {
        // The cross-axis clause bites on LABEL EQUALITY (owner shot 14's
        // "Spring\nSpring") — a synthetic label-equal tab proves the clause.
        const d = dockCardinality({
            tabs: [{ value: "spring", label: "Spring" }],
            channels: [],
            sceneLabel: "Spring",
        });
        expect(d.controlLabelRedundant).toBe(true);
    });

    it("the renamed facet labels (item-7a) are NOT scene-redundant", () => {
        // T.E8/item-7a renamed the facet tabs to name the FACET (Curve/
        // Physics), so the lone-tab case no longer duplicates the scene
        // identity — the redundancy clause correctly stands down.
        const d = dockCardinality({
            tabs: [tab("spring")],
            channels: [],
            sceneLabel: "Spring",
        });
        expect(d.controlLabelRedundant).toBe(false);
    });
});
