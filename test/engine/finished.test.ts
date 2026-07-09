import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { Sequence } from "../../src/animation/orchestration/sequence";

/**
 * G.W13 — the `.finished` completion front-door (proof:finished).
 *
 * `get finished()` exposes the ONE held `_playingPromise` `play()` already
 * constructs — NOT a second completion lifecycle. These tests lock: it resolves
 * once at completion as the SAME promise mid-play (clause 5), is pre-resolved
 * when settled/never-played and does NOT resolve prematurely mid-play (clause 6),
 * and is present on all four playable surfaces (clause 7).
 */

const opacityAnim = (durationMs: number): CSSKeyframesAnimation<any> => {
    const el = document.createElement("div");
    const anim = new CSSKeyframesAnimation({
        duration: durationMs,
        delay: 0,
        useWAAPI: false,
    }).fromString("from { opacity: 0; } to { opacity: 1; }");
    anim.setTargets(el);
    return anim;
};

const timeout = (ms: number): Promise<"timeout"> =>
    new Promise((resolve) => setTimeout(() => resolve("timeout"), ms));

describe("proof:finished (5) — resolves at completion, the SAME promise mid-play", () => {
    it("await anim.finished resolves after the play settles", async () => {
        const anim = opacityAnim(40);
        const play = anim.play();
        await anim.finished;
        await play;
        // After settle, `.finished` reads null → an immediately-resolved promise.
        await expect(anim.finished).resolves.toBeUndefined();
    });

    it("two reads of .finished MID-PLAY return the SAME promise (the held one, not a fresh one)", () => {
        const anim = opacityAnim(10000);
        void anim.play(); // in flight; `_playingPromise` set synchronously
        const a = anim.finished;
        const b = anim.finished;
        // Referential identity — a fresh `new Promise` per call would fail this.
        expect(a).toBe(b);
        anim.stop(); // settle the held promise (no dangling loop)
    });
});

describe("proof:finished (6) — pre-resolved when settled; does NOT resolve prematurely mid-play", () => {
    it("a never-played animation's .finished resolves immediately (nothing to await)", async () => {
        const anim = opacityAnim(1000);
        await expect(anim.finished).resolves.toBeUndefined();
    });

    it("BITE: .finished captured MID-PLAY does NOT resolve before completion", async () => {
        const anim = opacityAnim(10000); // long enough to outlast the race timeout
        void anim.play();
        const finished = anim.finished;
        // The held promise is still pending — the race must take the timeout.
        const winner = await Promise.race([
            finished.then(() => "finished" as const),
            timeout(80),
        ]);
        expect(winner).toBe("timeout");
        anim.stop();
    });
});

describe("proof:finished (7) — present on all four playable surfaces", () => {
    it("Animation / CSSKeyframesAnimation expose get finished", () => {
        const anim = opacityAnim(100);
        expect(typeof anim.finished.then).toBe("function");
    });

    it("AnimationGroup exposes get finished", async () => {
        const group = new AnimationGroup<any>({
            animation: opacityAnim(100),
            layer: { zIndex: 0 },
        });
        // Never-played group → settled → resolves immediately.
        await expect(group.finished).resolves.toBeUndefined();
        // Mid-play identity (the held promise).
        void group.play();
        const a = group.finished;
        const b = group.finished;
        expect(a).toBe(b);
        group.stop();
    });

    it("Sequence exposes get finished", async () => {
        const seq = new Sequence<any>();
        seq.add(opacityAnim(100));
        // Never-played sequence → settled → resolves immediately.
        await expect(seq.finished).resolves.toBeUndefined();
        void seq.play();
        const a = seq.finished;
        const b = seq.finished;
        expect(a).toBe(b);
        seq.stop();
    });
});
