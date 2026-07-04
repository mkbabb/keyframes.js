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
} from "../../demo/@/state/controlSurfaceDFA";

const DECLARED_SCENES = [
    "home",
    "cube",
    "amiga",
    "square",
    "easing",
    "spring",
    "sequence",
    "motion-path",
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

    it("maps the editor scenes (cube/amiga) to the full built-in triad", () => {
        for (const s of ["cube", "amiga"]) {
            expect(controlSurfacesFor(s)).toEqual([
                "controls",
                "keyframes",
                "timeline",
            ]);
        }
    });

    it("maps the self-contained scenes (square/sequence/motion-path) to NO panel", () => {
        // S.G2 S2 (fold row 69) — square COLLAPSED to the empty set: its built-in
        // triad edited a CSSKeyframesAnimation that painted nothing (the lying
        // panel), so it joins the drag/spring/Play-tumble-autonomous scenes whose
        // live controls live ON the stage, not in a rail.
        expect(controlSurfacesFor("square")).toEqual([]);
        expect(controlSurfacesFor("sequence")).toEqual([]);
        expect(controlSurfacesFor("motion-path")).toEqual([]);
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
