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
// THE PATTERN (mirrors the MCI-5 fn-arity-pad witness in interpolate-anything.ts):
// the seam does NOT exist on `AnimationGroup` yet, so the inner identity assertion
// FAILS (the methods are absent) — `it.fails` makes the witness GREEN today and
// FLIPS RED the instant the engine ships `serialize()/hydrate()` and the identity
// holds. It is NOT a perpetually-red gate (inv-27): the suite stays green while the
// HANDOFF is pending, and the RED flip is the consume-leg signal to (a) swap
// `restoreGroupPlaybackState`'s body for `g.hydrate(g.serialize())` and (b) delete
// this `it.fails` wrapper. inv-16: NO engine serialize/hydrate is authored in
// src/animation here — this gate WITNESSES the absent seam, it does not fill it.
//
// [Covers the AnimationGroup family ONLY; proof:scene-contract-identity covers the
// raw-rAF scenes (easing/spring/sequence/path), which have NO AnimationGroup
// position to serialize.]

import { describe, it, expect } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

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

/** The byte-identity field set the matrix gate asserts on round-trip. */
const clockOf = (g: AnimationGroup<any>) => ({
    started: g.started,
    playing: g.started ? g.playing() : false,
    animations: Object.fromEntries(
        Object.entries(g.animations).map(([name, { animation }]) => [
            name,
            {
                t: animation.t,
                reversed: animation.reversed,
                iteration: animation.iteration,
            },
        ]),
    ),
});

describe("proof:group-snapshot-identity — the engine serialize()/hydrate() HANDOFF (born-RED)", () => {
    // GREEN today: the seam does NOT exist, so the inner identity assertion FAILS
    // (the methods are undefined) and `it.fails` passes. FLIPS RED when the engine
    // ships serialize()/hydrate() and `g.hydrate(g.serialize())` is an identity →
    // swap restoreGroupPlaybackState's body for the two calls + delete this wrapper.
    it.fails(
        "g.hydrate(g.serialize()) is an identity on {t,reversed,iteration,playing,started} — engine seam NOT yet shipped",
        () => {
            const source = makeGroup();
            const before = clockOf(source);

            // The S6 seam — absent today. `serialize()` is `undefined`, so this
            // call throws (TypeError: not a function) and the inner test FAILS,
            // making `it.fails` GREEN. When the engine ships the seam, the
            // round-trip through JSON re-seats a fresh group identically and the
            // inner test PASSES → `it.fails` FLIPS RED.
            const g = source as unknown as {
                serialize(): unknown;
                hydrate(snap: unknown): void;
            };
            const wire = JSON.parse(JSON.stringify(g.serialize()));

            const target = makeGroup();
            // Scramble the target's clock so a no-op hydrate cannot pass vacuously.
            target.animations["rotate"]!.animation.t = 0;
            target.animations["rotate"]!.animation.reversed = false;
            target.animations["rotate"]!.animation.iteration = 0;
            target.animations["matrix"]!.animation.t = 0;
            (target as unknown as { hydrate(s: unknown): void }).hydrate(wire);

            expect(clockOf(target)).toEqual(before);
        },
    );

    // The standing positive control of the witness's own mechanism — the seam IS
    // genuinely absent today. This bites if the witness is deleted (the HANDOFF
    // goes un-watched) or if the engine shipped the seam WITHOUT flipping the
    // it.fails (then the witness would be stale — this control reds, signalling it).
    it("the engine seam is genuinely absent today (the witnessed gap)", () => {
        const g = makeGroup() as unknown as Record<string, unknown>;
        expect(typeof g.serialize).not.toBe("function");
        expect(typeof g.hydrate).not.toBe("function");
        // inv-16: no engine code authored in src/animation — this gate only
        // witnesses the seam; the imperative restoreGroupPlaybackState (gated by
        // e-w1-encapsulation + proof:scene-contract-identity) is the live codec.
    });
});
