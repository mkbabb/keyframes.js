/**
 * WAAPI delegation lifecycle — the cluster B.W2's adversarial review caught.
 *
 * W2 resurrected WAAPI delegation (the former Symbol-tag renderer check was
 * bind-broken, so every CSSKeyframesAnimation fell to rAF). With it live by
 * default, these are the contracts the resurrection MUST honor:
 *   - a faithful CSS twin is required to delegate (else bare linear ships);
 *   - stop()/reset() cancel the compositor animation AND resolve the awaited
 *     play() promise (no hang, no orphaned paint);
 *   - eligibility compares the callable identity, not the Easing wrapper.
 *
 * jsdom has no WAAPI, so we install a faithful `Element.animate` stub:
 * `finished` resolves on `finish()`, rejects (AbortError) on `cancel()`.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { KeyframesAnimation, CSSKeyframesAnimation } from "../../src/animation/engine";
import { isWAAPIEligible, toWAAPIOptions } from "../../src/animation/waapi";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { resolveEasing } from "../../src/animation/easing";

class FakeWAAnimation {
    playState: "running" | "paused" | "finished" | "idle" = "running";
    cancelled = false;
    finished: Promise<void>;
    private _resolve!: () => void;
    private _reject!: (e: unknown) => void;
    constructor() {
        this.finished = new Promise((res, rej) => {
            this._resolve = res;
            this._reject = rej;
        });
    }
    pause() {
        this.playState = "paused";
    }
    play() {
        this.playState = "running";
    }
    finish() {
        this.playState = "finished";
        this._resolve();
    }
    cancel() {
        this.cancelled = true;
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

const eligibleAnim = async () => {
    const el = document.createElement("div");
    const easing = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
    const anim = new CSSKeyframesAnimation({
        duration: 1000,
        iterationCount: Infinity,
        timingFunction: easing,
    });
    anim.setTargets(el);
    anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
    return { el, anim };
};

describe("WAAPI eligibility requires a faithful CSS twin", () => {
    it("a default-eased (easeInOutCubic) animation is INELIGIBLE (no CSS twin)", () => {
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({ duration: 500 });
        anim.setTargets(el);
        anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
        const elig = isWAAPIEligible(anim);
        expect(elig.eligible).toBe(false);
    });

    it("an explicit cubic-bezier()-eased animation IS eligible", async () => {
        const { anim } = await eligibleAnim();
        expect(isWAAPIEligible(anim).eligible).toBe(true);
    });

    it("a single-segment spring emits its css linear(); a multi-segment spring densifies to a single bare linear() (S.F5c S2)", async () => {
        const el = document.createElement("div");
        const spring = springTimingFunction({
            response: 0.4,
            dampingFraction: 0.7,
        });
        const two = new CSSKeyframesAnimation({
            duration: 300,
            timingFunction: spring,
        });
        two.setTargets(el);
        two.fromString(`from { opacity: 0; } to { opacity: 1; }`);
        // SINGLE segment: eligible, and the effect easing IS the spring's css
        // twin (the compositor runs the true curve between the two endpoints).
        expect(isWAAPIEligible(two).eligible).toBe(true);
        expect(String(toWAAPIOptions(two).easing)).toMatch(/^linear\(/);

        const three = new CSSKeyframesAnimation({
            duration: 300,
            timingFunction: spring,
        });
        three.setTargets(el);
        three.fromString(
            `0% { opacity: 0; } 50% { opacity: 0.3; } 100% { opacity: 1; }`,
        );
        // MULTI segment (S.F5c S2): NO LONGER refused. The densify bakes the
        // composite per-segment curve into keyframes fed a SINGLE bare `linear`
        // effect easing (the "densify → single linear()" collapse) — eligible,
        // and the emitted effect easing is bare "linear" (NOT the per-segment
        // spring css, which would double-ease the already-baked stops).
        expect(isWAAPIEligible(three).eligible).toBe(true);
        expect(toWAAPIOptions(three).easing).toBe("linear");
    });

    it("CE-1.0 — a spring linear() twin is INELIGIBLE on WebKit (HW-accel refused); cubic-bezier still delegates", async () => {
        const el = document.createElement("div");
        const spring = springTimingFunction({
            response: 0.4,
            dampingFraction: 0.7,
        });
        const makeSpring = () => {
            const a = new CSSKeyframesAnimation({
                duration: 300,
                timingFunction: spring,
            });
            a.setTargets(el);
            a.fromString(`from { opacity: 0; } to { opacity: 1; }`);
            return a;
        };
        // Non-WebKit (jsdom carries no WebKit engine marker — its UA string
        // falsely advertises AppleWebKit, which is WHY the guard is a
        // feature-detect): the single-segment spring delegates.
        expect(isWAAPIEligible(makeSpring()).eligible).toBe(true);

        // Install the WebKit engine marker → the SAME animation is held on
        // the rAF path (the probe-measured exclusion: a delegated spring
        // would run main-thread WAAPI, heavier than the rAF path).
        const g = globalThis as {
            webkitConvertPointFromNodeToPage?: unknown;
        };
        g.webkitConvertPointFromNodeToPage = () => ({});
        try {
            const elig = isWAAPIEligible(makeSpring());
            expect(elig.eligible).toBe(false);
            if (!elig.eligible) {
                expect(elig.reason).toMatch(/CE-1\.0/);
                expect(elig.reason).toMatch(/linear\(\)/);
            }
            // ONLY linear() is held — a cubic-bezier() twin still delegates
            // on WebKit (the refusal is linear()-specific).
            const { anim } = await eligibleAnim();
            expect(isWAAPIEligible(anim).eligible).toBe(true);
        } finally {
            delete g.webkitConvertPointFromNodeToPage;
        }
    });

    it("uniform-timing compares the callable identity, not the Easing wrapper", async () => {
        const el = document.createElement("div");
        const easing = await resolveEasing("ease-in-out");
        const anim = new CSSKeyframesAnimation({ duration: 300 });
        anim.setTargets(el);
        anim.fromString(
            `0% { opacity: 0; } 50% { opacity: 0.5; } 100% { opacity: 1; }`,
        );
        // Re-wrap the SAME callable in distinct Easing objects per frame.
        anim.frames.forEach((f) => {
            f.timingFunction = { fn: easing.fn };
        });
        // css is undefined on these wrappers → ineligible for the no-twin
        // reason, NOT the non-uniform reason (the fn identities match).
        const elig = isWAAPIEligible(anim);
        expect(elig.eligible).toBe(false);
        if (!elig.eligible) {
            expect(elig.reason).not.toMatch(/non-uniform/);
        }
    });
});

describe("WAAPI lifecycle — stop() / reset() cancel and resolve", () => {
    it("stop() during an infinite WAAPI play cancels the compositor + resolves the promise", async () => {
        const { anim } = await eligibleAnim();
        let resolved = false;
        const playing = anim.play().then(() => {
            resolved = true;
        });
        // Let the shadow loop arm + the WAAPI animation be created.
        await new Promise((r) => setTimeout(r, 30));
        expect(created.length).toBeGreaterThan(0);
        expect(created.every((c) => !c.cancelled)).toBe(true);

        anim.stop();

        // The cancel rejects wa.finished → playWAAPI swallows it → play resolves.
        await Promise.race([
            playing,
            new Promise((_, rej) => setTimeout(() => rej(new Error("HUNG")), 1000)),
        ]);
        expect(resolved).toBe(true);
        expect(created.every((c) => c.cancelled)).toBe(true);
    });

    it("reset() also cancels the compositor animation", async () => {
        const { anim } = await eligibleAnim();
        const playing = anim.play().catch(() => {});
        await new Promise((r) => setTimeout(r, 30));
        expect(created.length).toBeGreaterThan(0);
        anim.reset();
        await Promise.race([
            playing,
            new Promise((_, rej) => setTimeout(() => rej(new Error("HUNG")), 1000)),
        ]);
        expect(created.every((c) => c.cancelled)).toBe(true);
    });
});

describe("fromString stays lenient on an unknown per-keyframe timing function", () => {
    it("does NOT throw; the unknown name falls back to the inherited easing", () => {
        const anim = new CSSKeyframesAnimation({ duration: 500 });
        expect(() =>
            anim.fromString(
                `from { opacity: 0; animation-timing-function: not-a-real-easing; } to { opacity: 1; }`,
            ),
        ).not.toThrow();
        // The explicit setter API stays strict, by contrast.
        expect(() => anim.setTimingFunction("not-a-real-easing")).toThrow();
    });
});

describe("standalone rAF completion rests per the fill contract", () => {
    it("fillMode 'none' rests at the INITIAL frame (no final-frame clobber)", async () => {
        const painted: number[] = [];
        const anim = new KeyframesAnimation({
            duration: 40,
            fillMode: "none",
            useWAAPI: false,
        });
        anim.addFrame(0, { opacity: 0 }, (vars) => {
            painted.push((vars as { opacity: number }).opacity);
        });
        anim.addFrame(100, { opacity: 1 }, (vars) => {
            painted.push((vars as { opacity: number }).opacity);
        });
        anim.parse();
        await anim.play();
        // restPosition derives 'initial' for fillMode none …
        expect(anim.restPosition).toBe("initial");
        // … and the LAST painted value is the initial frame (0), not 1.
        expect(painted[painted.length - 1]).toBeCloseTo(0);
    });

    it("fillMode 'forwards' rests at the FINAL frame", async () => {
        const painted: number[] = [];
        const anim = new KeyframesAnimation({
            duration: 40,
            fillMode: "forwards",
            useWAAPI: false,
        });
        anim.addFrame(0, { opacity: 0 }, (vars) => {
            painted.push((vars as { opacity: number }).opacity);
        });
        anim.addFrame(100, { opacity: 1 }, (vars) => {
            painted.push((vars as { opacity: number }).opacity);
        });
        anim.parse();
        await anim.play();
        expect(anim.restPosition).toBe("final");
        expect(painted[painted.length - 1]).toBeCloseTo(1);
    });
});
