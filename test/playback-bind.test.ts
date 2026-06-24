/**
 * J.W1 S5 (TB-2) — the I.W1 bind-proof contract as a UNIT pin.
 *
 * `RAFPlayback`'s public control surface (`play`/`drive`/`loop`/`stop`) is
 * BIND-PROOF BY CONSTRUCTION: arrow class-fields capture `this` at
 * construction, so a destructured method, a method passed bare as a
 * callback, and a member call are ALL safe. Before I.W1 the prototype
 * methods dropped `this` under bare invocation (`this._gen++` threw inside
 * a Vue reactive flush — `rootcause-rc-dfa-gen.md`); the only oracle was
 * the live browser gate `proof:fsm-suspend-resume-live`. This file is the
 * cheap jsdom companion: an `npm test` regression of the bind contract
 * (e.g. someone "simplifies" the arrow fields back to prototype methods)
 * reds HERE, without browser infra.
 */
import { describe, expect, it } from "vitest";
import { RAFPlayback, type Tickable } from "../src/animation/physics/playback";

describe("RAFPlayback — bind-proof by construction (the I.W1 contract)", () => {
    it("const s = pb.stop; s() — the unbound stop operates on ITS instance (no this-undefined throw)", () => {
        const pb = new RAFPlayback();
        pb.loop(() => true);
        expect(pb.running).toBe(true);

        const s = pb.stop;
        expect(() => s()).not.toThrow();
        expect(pb.running).toBe(false);
    });

    it("pb.stop passed BARE as a callback (the Vue-flush shape) stops the right instance", () => {
        const pb = new RAFPlayback();
        pb.loop(() => true);

        const invokeUnbound = (cb: () => void): void => {
            cb(); // a free-standing call — receiver dropped
        };
        expect(() => invokeUnbound(pb.stop)).not.toThrow();
        expect(pb.running).toBe(false);
    });

    it("destructured { loop, stop } both stay bound — start AND halt through free functions", () => {
        const pb = new RAFPlayback();
        const { loop, stop } = pb;

        expect(() => loop(() => true)).not.toThrow();
        expect(pb.running).toBe(true);

        stop();
        expect(pb.running).toBe(false);
    });

    it("destructured drive() arms the dt loop on the right instance and auto-stops on settle", async () => {
        const pb = new RAFPlayback();
        const { drive } = pb;

        let ticks = 0;
        const stepper: Tickable = {
            tickDt: () => {
                ticks += 1;
                return ticks;
            },
            get settled() {
                return ticks >= 2;
            },
        };

        expect(() => drive(stepper)).not.toThrow();
        expect(pb.running).toBe(true);

        // The shared rAF shim falls back to setTimeout off-DOM — wait for the
        // loop to step to settle and self-clean.
        await new Promise<void>((resolve) => {
            const poll = () => {
                if (!pb.running) return resolve();
                setTimeout(poll, 5);
            };
            poll();
        });
        expect(ticks).toBeGreaterThanOrEqual(2);
        expect(pb.running).toBe(false);
    });

    it("destructured play() runs to completion and resolves — the duration loop is bound too", async () => {
        const pb = new RAFPlayback();
        const { play } = pb;

        let last = 0;
        await expect(
            play(20, (p) => {
                last = p;
            }),
        ).resolves.toBeUndefined();
        expect(last).toBe(1);
        expect(pb.running).toBe(false);
    });

    it("two instances: each destructured stop halts ONLY its own loop (the capture is per-instance)", () => {
        const a = new RAFPlayback();
        const b = new RAFPlayback();
        a.loop(() => true);
        b.loop(() => true);

        const stopA = a.stop;
        stopA();

        expect(a.running).toBe(false);
        expect(b.running).toBe(true);
        b.stop();
    });
});
