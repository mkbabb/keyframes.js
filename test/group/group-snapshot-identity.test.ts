// proof:group-snapshot-identity — H.W1 S6 · the value.js/engine-HANDOFF gate
// (BORN-RED, chronic-closure-paired).
//
// The store lands FIRST against the existing imperative restore
// (`restoreGroupPlaybackState`, gated by proof:scene-contract-identity +
// e-w1-encapsulation). S6 names the ENGINE half as a born-RED HANDOFF: when
// value.js/the engine ships `AnimationGroup.serialize(): GroupSnapshot` +
// `.hydrate(snapshot)`, the demo's hand-poked eight-field restore reduces to two
// calls (`g.hydrate(g.serialize())`), and that round-trip must be an IDENTITY on
// `{t, reversed, iteration, playing, started}` for every animation, round-tripping
// through JSON.
//
// THE WITNESS (TC-6 · V.W9 — the `it.fails` round-trip wrapper was FOLDED):
// the standing positive control below asserts the seam is genuinely ABSENT on
// `AnimationGroup` today (`typeof g.serialize !== "function"`). It is a normal
// green test that FLIPS RED the instant the engine ships `serialize()/hydrate()`
// — the same consume-leg signal the `it.fails` round-trip carried, minus the
// double-count R2-07 TC-6 forbade (the round-trip mirrored this control, it was
// never behavioral coverage). On the flip: swap `restoreGroupPlaybackState`'s
// body for `g.hydrate(g.serialize())`. inv-16: NO engine serialize/hydrate is
// authored in src/animation here — this gate WITNESSES the absent seam.
//
// [Covers the AnimationGroup family ONLY; proof:scene-contract-identity covers the
// raw-rAF scenes (easing/spring/sequence/path), which have NO AnimationGroup
// position to serialize.]

import { describe, it, expect } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/** A fixture group with two named animations at known clock state. */
function makeGroup(): AnimationGroup<any> {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    a.name = "rotate";
    const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { transform: translateX(0px); }
        to { transform: translateX(100px); }
    `);
    b.name = "matrix";
    const g = new AnimationGroup(a, b);
    g.started = true;
    g.animations["rotate"]!.animation.t = 250;
    g.animations["rotate"]!.animation.reversed = true;
    g.animations["rotate"]!.animation.iteration = 1;
    g.animations["matrix"]!.animation.t = 410;
    g.animations["matrix"]!.animation.reversed = false;
    g.animations["matrix"]!.animation.iteration = 0;
    return g;
}

describe("proof:group-snapshot-identity — the engine serialize()/hydrate() HANDOFF witness", () => {
    // The standing positive control of the witness's own mechanism — the seam IS
    // genuinely absent today. This bites if the witness is deleted (the HANDOFF
    // goes un-watched); it FLIPS RED the instant the engine ships the seam — the
    // consume-leg signal to fold restoreGroupPlaybackState onto hydrate/serialize.
    it("the engine seam is genuinely absent today (the witnessed gap)", () => {
        const g = makeGroup() as unknown as Record<string, unknown>;
        expect(typeof g.serialize).not.toBe("function");
        expect(typeof g.hydrate).not.toBe("function");
        // inv-16: no engine code authored in src/animation — this gate only
        // witnesses the seam; the imperative restoreGroupPlaybackState (gated by
        // e-w1-encapsulation + proof:scene-contract-identity) is the live codec.
    });
});
