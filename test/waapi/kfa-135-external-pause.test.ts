// SERVED MODEL: claude-opus-5-5
/**
 * KFA-135 (X.KF.W13X.r4lib) — an external pause of a delegated animation is an
 * engine pause, not something the shadow tick undoes.
 *
 * DevTools' animation panel, or `el.getAnimations().forEach(a => a.pause())`,
 * paused the typing dots' compositor animation; two frames later the shadow
 * tick's reconcile called `wa.play()` (it resumed any paused handle while the
 * engine was not paused), so playState read 'running' again and the engine's
 * clock never knew. The delegated animation's handles and the engine now agree:
 * the external pause becomes the engine's pause, and the engine's `resume()`
 * resumes the compositor.
 *
 * jsdom has no WAAPI; the stub mirrors `waapi-lifecycle.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { resolveEasing } from "../../src/animation/easing";

class FakeWAAnimation {
    playState: "running" | "paused" | "finished" | "idle" = "running";
    finished: Promise<void>;
    private _reject!: (e: unknown) => void;
    constructor() {
        this.finished = new Promise((_, rej) => {
            this._reject = rej;
        });
    }
    pause() {
        this.playState = "paused";
    }
    play() {
        this.playState = "running";
    }
    cancel() {
        this.playState = "idle";
        const err = new Error("AbortError");
        err.name = "AbortError";
        this._reject(err);
    }
}

let created: FakeWAAnimation[] = [];

beforeEach(() => {
    created = [];
    HTMLElement.prototype.animate = function () {
        const a = new FakeWAAnimation();
        created.push(a);
        return a as unknown as globalThis.Animation;
    };
});

afterEach(() => {
    // @ts-expect-error — remove the stub
    delete HTMLElement.prototype.animate;
});

const frames = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("KFA-135 — an external WAAPI pause holds", () => {
    it("the shadow tick adopts the pause instead of resuming the compositor", async () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: Infinity,
            timingFunction: await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)"),
        });
        anim.setTargets(el);
        anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
        const playing = anim.play().catch(() => {});
        await frames(40);
        expect(created).toHaveLength(1);

        created[0]!.pause(); // DevTools / getAnimations().pause()
        await frames(80); // several shadow ticks

        expect(created[0]!.playState).toBe("paused");
        expect(anim.paused).toBe(true);

        anim.resume();
        await frames(40);
        expect(created[0]!.playState).toBe("running");
        expect(anim.paused).toBe(false);

        anim.stop();
        await playing;
    });
});
