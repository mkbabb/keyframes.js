// SERVED MODEL: claude-opus-5[1m]
/**
 * test/engine/prm-engagement.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-PRM-FLIP** (row B-6 ≡ KF-TD-1).
 *
 * THE DEFECT THIS PINS — the ENGAGEMENT direction (no-reduce → reduce), which
 * the up-front gate structurally cannot see: on the lane the library actually
 * SHIPS (WAAPI delegation) a live flip to `prefers-reduced-motion: reduce` was
 * never observed. `snapToReducedMotion`'s sole caller was `playFrame`, the rAF
 * lane's per-tick step, and a delegated animation never runs it; the shadow tick
 * consulted no detector; `respectReducedMotion: true` bought only the mount-time
 * gate — while the docblock over the snap asserted the opposite verbatim ("The
 * WAAPI lane snaps via the same path").
 *
 * THE ORACLE IS BEHAVIOURAL, and it is the one the gate names: a flip observed
 * on the DELEGATED lane. jsdom has no WAAPI, so the established
 * `test/waapi/waapi-lifecycle.test.ts` harness is reused — a faithful
 * `Element.animate` stub whose `finished` rejects (AbortError) on `cancel()`,
 * which is exactly what `cancelWAAPI` does on the way through the snap.
 *
 * An infinite animation is used on purpose: it can only ever settle BY the
 * snap, so "did the lane observe the flip?" and "did the awaited play()
 * resolve?" are the same question, and a blind lane wedges instead of lying.
 *
 * INSTRUMENT CAVEAT, declared: this jsdom defines no `AnimationEvent`
 * (`typeof AnimationEvent === "undefined"`, measured), and
 * `dispatchAnimationEvent` returns early when it is absent — so the
 * `animationstart`/`animationend` half of the snap's observability is NOT
 * measurable here and is not asserted. The state half (rest paint, settled
 * transport, cancelled handles, released awaiter) is, and it is what the gate
 * names. `settle()` deliberately resets `done` to false as the terminal step,
 * so `playing()` — not `done` — is the honest post-snap predicate.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { resolveEasing } from "../../src/animation/easing";
import { isWAAPIEligible, playWAAPI } from "../../src/animation/waapi";

class FakeWAAnimation {
    playState: "running" | "paused" | "finished" | "idle" = "running";
    cancelled = false;
    finished: Promise<void>;
    private _reject!: (e: unknown) => void;
    constructor() {
        this.finished = new Promise((_res, rej) => {
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
        this.cancelled = true;
        this.playState = "idle";
        const err = new Error("AbortError");
        err.name = "AbortError";
        this._reject(err);
    }
}

let created: FakeWAAnimation[] = [];

function mockReducedMotion(matches: boolean): void {
    // A FRESH `matchMedia` identity per call: the engine's one shared
    // `MediaQueryList` is keyed on that identity, so this is how a mid-flight
    // OS toggle is modelled without reaching into the detector's private state.
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
            matches: query.includes("prefers-reduced-motion") && matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

const frame = (): Promise<void> =>
    new Promise((resolve) => requestAnimationFrame(() => resolve()));

/** Resolve to `"settled"` if the play resolves within `ms`, else `"wedged"`. */
async function settledWithin(play: Promise<void>, ms: number): Promise<string> {
    let timer: ReturnType<typeof setTimeout>;
    const deadline = new Promise<string>((resolve) => {
        timer = setTimeout(() => resolve("wedged"), ms);
    });
    const verdict = await Promise.race([play.then(() => "settled"), deadline]);
    clearTimeout(timer!);
    return verdict;
}

async function infiniteEligible(respectReducedMotion: boolean) {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const easing = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
    const anim = new CSSKeyframesAnimation({
        duration: 200,
        iterationCount: Infinity,
        timingFunction: easing,
        respectReducedMotion,
    });
    anim.setTargets(el);
    anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
    return { el, anim };
}

beforeEach(() => {
    created = [];
    mockReducedMotion(false);
    HTMLElement.prototype.animate = function () {
        const a = new FakeWAAnimation();
        created.push(a);
        return a as unknown as globalThis.Animation;
    };
});

afterEach(() => {
    mockReducedMotion(false);
    // @ts-expect-error — remove the stub
    delete HTMLElement.prototype.animate;
    document.body.innerHTML = "";
});

describe("live PRM engagement on the DELEGATED lane (G-PRM-FLIP)", () => {
    it("the fixture really is delegated (else the gate measures the rAF lane)", async () => {
        const { anim } = await infiniteEligible(true);
        expect(isWAAPIEligible(anim).eligible).toBe(true);
    });

    it("a mid-flight flip to `reduce` is OBSERVED and the play converges", async () => {
        const { el, anim } = await infiniteEligible(true);

        const playing = anim.play();
        await frame();
        // Still running under no-reduce: the flip has not happened yet, and an
        // infinite animation has no other way to end.
        expect(anim.playing()).toBe(true);
        expect(created.length).toBeGreaterThan(0);

        mockReducedMotion(true);
        expect(await settledWithin(playing, 2000)).toBe("settled");

        // The SAME terminal state the rAF lane produces: the rest frame is
        // painted, the transport has settled, and every compositor handle is
        // cancelled — no orphaned native effect left owning the element.
        expect(anim.playing()).toBe(false);
        expect(created.every((a) => a.cancelled)).toBe(true);
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
    });

    it("`respectReducedMotion: false` still ignores the flip (the opt-out holds)", async () => {
        const { anim } = await infiniteEligible(false);

        const playing = anim.play();
        await frame();
        mockReducedMotion(true);
        await frame();
        await frame();

        expect(anim.playing()).toBe(true);
        expect(created.every((a) => !a.cancelled)).toBe(true);
        anim.stop();
        await settledWithin(playing, 2000);
    });

    it("the delegated lane takes the snap through the INJECTED hook", async () => {
        // The tight unit of the same contract: `playWAAPI` owns the shadow tick
        // but not the snap — it calls what its caller hands it. An optional hook
        // would let a future caller re-acquire the blindness silently, so the
        // parameter is required and this asserts it is actually invoked. The
        // stand-in snap tears down exactly as the real one does (cancel the
        // handles, settle, release) so the delegation promise can complete.
        const { anim } = await infiniteEligible(true);
        const snap = vi.fn(() => anim.stop());

        mockReducedMotion(true);
        const done = playWAAPI(anim, { snapToReducedMotion: snap });
        expect(await settledWithin(done, 2000)).toBe("settled");
        expect(snap).toHaveBeenCalled();
    });

    it("the rAF lane still snaps on a live flip (no regression)", async () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const anim = new CSSKeyframesAnimation({
            duration: 200,
            iterationCount: Infinity,
            useWAAPI: false,
            respectReducedMotion: true,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        anim.setTargets(el);

        const playing = anim.play();
        await frame();
        mockReducedMotion(true);

        expect(await settledWithin(playing, 2000)).toBe("settled");
        expect(anim.playing()).toBe(false);
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
    });
});
