// H.W11 S4 / I2 — the control-surface DFA pure-core unit test.
//
// The per-scene control-surface DFA is the THIRD orthogonal axis on the W1
// machine (scene + playback + control-surface). `controlSurfacesFor(sceneId)` is
// a PURE, TOTAL selector over a static table — unit-testable in isolation (no
// Vue, no DOM). This file proves: (1) each scene maps to its enumerated set
// (easing → [easing], sequence/path → []); (2) the selector is TOTAL (every
// declared scene + an unknown id resolve a DEFINED set — the no-undefined-
// behavior guarantee the navigation matrix needs); (3) the built-in-triad
// projection filters correctly. It does NOT touch the W1 reducer (the DFA
// EXTENDS, never re-authors — proof:scene-machine-irrefragable stays green).

import { describe, it, expect } from "vitest";
import {
    CONTROL_SURFACES,
    CONDITIONAL_SURFACES,
    BUILT_IN_SURFACES,
    controlSurfacesFor,
    isSurfaceValidForScene,
    builtInSurfacesFor,
    dockCardinality,
    type ControlSurfaceTab,
} from "../../demo/@/state/controlSurfaceDFA";

const DECLARED_SCENES = [
    "home",
    "cube",
    "amiga",
    "square",
    "easing",
    "spring",
    "sequence",
] as const;

describe("H.W11 control-surface DFA — the per-scene table", () => {
    it("maps easing to ONLY the easing surface (not the meaningless triad)", () => {
        expect(controlSurfacesFor("easing")).toEqual(["easing"]);
        expect(controlSurfacesFor("easing")).not.toContain("keyframes");
        expect(controlSurfacesFor("easing")).not.toContain("timeline");
        expect(controlSurfacesFor("easing")).not.toContain("controls");
    });

    it("maps spring to ONLY the spring surface", () => {
        expect(controlSurfacesFor("spring")).toEqual(["spring"]);
    });

    it("maps the editor scenes (cube/amiga/square) to the full built-in triad", () => {
        // T.A13 + T.B3 (fold row 69) — square RE-TABLED into the triad: the G2
        // collapse is CURED (the "Transform" anim is LIVE via the num() normalizer
        // + four-corner keyframes + the {idle,drag,playback} FSM), so the triad
        // edits an HONEST animation — the VERDICT #12/#25 panel RETURN.
        for (const s of ["cube", "amiga", "square"]) {
            expect(controlSurfacesFor(s)).toEqual([
                "controls",
                "keyframes",
                "timeline",
            ]);
        }
    });

    it("maps the self-contained scene (sequence) to NO panel", () => {
        // sequence stays self-contained — the drag/spring-autonomous scene whose
        // live controls live ON the stage, not in a rail. (motion-path/morph were
        // PRUNED at T.E3, OD-1 = PRUNE.)
        expect(controlSurfacesFor("sequence")).toEqual([]);
    });

    it("maps home to NO control surface", () => {
        expect(controlSurfacesFor("home")).toEqual([]);
    });
});

describe("H.W11 control-surface DFA — TOTALITY (no undefined navigation cell)", () => {
    it("resolves a DEFINED array for EVERY declared scene", () => {
        for (const s of DECLARED_SCENES) {
            const set = controlSurfacesFor(s);
            expect(Array.isArray(set)).toBe(true);
        }
    });

    it("resolves a DEFINED set for an UNKNOWN scene id (the conservative triad)", () => {
        // The no-undefined-behavior guarantee: a never-seen scene falls back to
        // the built-in editor triad, never `undefined`.
        const set = controlSurfacesFor("a-scene-that-does-not-exist");
        expect(set).toEqual([...BUILT_IN_SURFACES]);
    });

    it("the (scene → scene) navigation matrix is TOTAL (every cell defined)", () => {
        // Every ordered pair lands on a DEFINED destination set — the matrix the
        // gate asserts has no undefined cell.
        for (const from of DECLARED_SCENES) {
            for (const to of DECLARED_SCENES) {
                void from; // the from-scene does not affect the destination set
                expect(controlSurfacesFor(to)).toBeDefined();
                expect(Array.isArray(controlSurfacesFor(to))).toBe(true);
            }
        }
    });

    it("returns a FRESH array (callers never mutate the table)", () => {
        const a = controlSurfacesFor("cube");
        a.push("matrix-controls");
        // The table entry is unchanged — controlSurfacesFor copies.
        expect(controlSurfacesFor("cube")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
        // Sanity: the table object itself is not the returned reference.
        expect(controlSurfacesFor("cube")).not.toBe(CONTROL_SURFACES.cube);
    });
});

describe("H.W11 control-surface DFA — the built-in projection + conditional", () => {
    it("builtInSurfacesFor filters the triad to the scene's valid subset", () => {
        expect(builtInSurfacesFor("cube")).toEqual([
            "controls",
            "keyframes",
            "timeline",
        ]);
        // easing's set is ['easing'] → NO built-in triad member survives.
        expect(builtInSurfacesFor("easing")).toEqual([]);
        expect(builtInSurfacesFor("sequence")).toEqual([]);
    });

    it("cube's matrix-controls is a CONDITIONAL surface (valid, but not static)", () => {
        // Not in the static set...
        expect(controlSurfacesFor("cube")).not.toContain("matrix-controls");
        // ...but recorded as a valid conditional surface.
        expect(CONDITIONAL_SURFACES.cube).toContain("matrix-controls");
        // isSurfaceValidForScene includes the conditional ceiling (may-ever-render).
        expect(isSurfaceValidForScene("cube", "matrix-controls")).toBe(true);
        // easing may NEVER show keyframes (neither static nor conditional).
        expect(isSurfaceValidForScene("easing", "keyframes")).toBe(false);
    });
});

// ── T.B5-MODEL — the dock cardinality projection (the ONE elision rule) ──────
describe("T.B5 dock cardinality — controlZone / channelZone / cross-axis", () => {
    const tab = (value: string, label: string): ControlSurfaceTab => ({
        value: value as ControlSurfaceTab["value"],
        label,
    });

    it("controlZone: >1 tab ⇒ select; ==1 ⇒ inline; 0 ⇒ absent", () => {
        const many = dockCardinality({
            tabs: [tab("controls", "Controls"), tab("keyframes", "Keyframes")],
            channels: [],
        });
        expect(many.controlZone.kind).toBe("select");
        if (many.controlZone.kind === "select") {
            expect(many.controlZone.tabs).toHaveLength(2);
        }

        const one = dockCardinality({
            tabs: [tab("spring", "Spring")],
            channels: [],
        });
        expect(one.controlZone.kind).toBe("inline");
        if (one.controlZone.kind === "inline") {
            expect(one.controlZone.tab.label).toBe("Spring");
        }

        const none = dockCardinality({ tabs: [], channels: [] });
        expect(none.controlZone.kind).toBe("absent");
    });

    it("channelZone: >1 channel ⇒ select; ≤1 ⇒ absent (a lone channel needs no picker)", () => {
        const two = dockCardinality({
            tabs: [],
            channels: ["Sweep", "Entry"],
        });
        expect(two.channelZone.kind).toBe("select");
        if (two.channelZone.kind === "select") {
            expect(two.channelZone.channels).toEqual(["Sweep", "Entry"]);
        }

        expect(
            dockCardinality({ tabs: [], channels: ["Sweep"] }).channelZone.kind,
        ).toBe("absent");
        expect(
            dockCardinality({ tabs: [], channels: [] }).channelZone.kind,
        ).toBe("absent");
    });

    it("cross-axis redundancy: a lone tab whose identity duplicates the scene label ⇒ render nothing", () => {
        // owner shot 14's "Spring\nSpring" → "Spring": the sole control-surface
        // label is a strict subset of the adjacent scene identity.
        const redundant = dockCardinality({
            tabs: [tab("spring", "Spring")],
            channels: [],
            sceneLabel: "Spring",
        });
        expect(redundant.controlLabelRedundant).toBe(true);

        // case/whitespace-insensitive.
        expect(
            dockCardinality({
                tabs: [tab("easing", "Easing")],
                channels: [],
                sceneLabel: "  easing ",
            }).controlLabelRedundant,
        ).toBe(true);
    });

    it("cross-axis redundancy is FALSE for a distinct label, multi-tab, or no scene label", () => {
        // distinct identity — the control label adds information.
        expect(
            dockCardinality({
                tabs: [tab("matrix-controls", "Matrix Controls")],
                channels: [],
                sceneLabel: "Cube",
            }).controlLabelRedundant,
        ).toBe(false);
        // a multi-tab select is never a redundant lone label.
        expect(
            dockCardinality({
                tabs: [tab("controls", "Controls"), tab("timeline", "Timeline")],
                channels: [],
                sceneLabel: "Cube",
            }).controlLabelRedundant,
        ).toBe(false);
        // no adjacent scene label ⇒ nothing to be redundant against.
        expect(
            dockCardinality({
                tabs: [tab("spring", "Spring")],
                channels: [],
            }).controlLabelRedundant,
        ).toBe(false);
    });

    it("returns FRESH arrays (the model is never a live table reference)", () => {
        const tabs = [tab("controls", "Controls"), tab("keyframes", "Keyframes")];
        const channels = ["A", "B"];
        const model = dockCardinality({ tabs, channels });
        if (model.controlZone.kind === "select") {
            expect(model.controlZone.tabs).not.toBe(tabs);
        }
        if (model.channelZone.kind === "select") {
            expect(model.channelZone.channels).not.toBe(channels);
        }
    });
});
