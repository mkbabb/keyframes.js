/**
 * E.W9 — modern-platform adoption (inv ξ).
 *
 * Each adopted native feature (S1/S2/S3/S5) carries TWO clauses, both of which
 * must BITE on their negative:
 *   (a) a feature-detect GUARD — the path no-ops where the platform lacks the
 *       feature (jsdom/SSR green, no throw);
 *   (b) a behaviour-EQUIVALENCE/observable test — the native path reproduces
 *       the JS-path output where both run (the same eligibility discipline the
 *       WAAPI delegation already enforces).
 *
 * jsdom ships NEITHER `CSS.registerProperty` NOR `ScrollTimeline` NOR
 * `Element.animate`, so the guard clauses pass unmocked; the equivalence
 * clauses install a faithful stub of just the surface under test.
 *
 * S4 (native CSS Color L4 interp) and S6 (`currentColor`/`light-dark()`) are
 * value.js-gated (E-HANDOFF) — RECORDED, not implemented this wave (see the
 * lane summary), so no clause exercises them.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import {
    attachNativeScrollTimeline,
    isWAAPIEligible,
    toWAAPIKeyframes,
} from "../src/animation/waapi";
import {
    KeyframesScrollTimeline as JSScrollTimeline,
    Timeline,
    createNativeTimeline,
} from "../src/animation/orchestration/timeline";
import {
    onReducedMotionChange,
    prefersReducedMotion,
} from "../src/animation/internal/reduced-motion";
import { resolveEasing } from "../src/animation/easing";

// ──────────────────────────────────────────────────────────────────────────
// matchMedia harness — a real EventTarget-backed MediaQueryList so a `change`
// event actually fans out to listeners (jsdom's matchMedia is static).
// ──────────────────────────────────────────────────────────────────────────

interface FakeMQL {
    matches: boolean;
    media: string;
    dispatch(matches: boolean): void;
    addEventListener: (type: string, cb: (e: { matches: boolean }) => void) => void;
    removeEventListener: (
        type: string,
        cb: (e: { matches: boolean }) => void,
    ) => void;
}

function installMatchMedia(initial: boolean): FakeMQL {
    const listeners = new Set<(e: { matches: boolean }) => void>();
    const mql: FakeMQL = {
        matches: initial,
        media: "(prefers-reduced-motion: reduce)",
        dispatch(matches: boolean) {
            this.matches = matches;
            for (const cb of listeners) cb({ matches });
        },
        addEventListener: (_type, cb) => listeners.add(cb),
        removeEventListener: (_type, cb) => listeners.delete(cb),
    };
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: (query: string) =>
            query.includes("prefers-reduced-motion")
                ? mql
                : { ...mql, matches: false },
    });
    return mql;
}

// reduced-motion.ts memoizes ONE module-level MediaQueryList. Re-importing it
// fresh per test resets that handle so each test observes its own matchMedia.
async function freshReducedMotion() {
    vi.resetModules();
    return import("../src/animation/internal/reduced-motion");
}

const opacityAnim = async (duration = 1000, infinite = false) => {
    const el = document.createElement("div");
    const easing = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
    const anim = new CSSKeyframesAnimation({
        duration,
        useWAAPI: false,
        timingFunction: easing,
        ...(infinite ? { iterationCount: Infinity } : {}),
    });
    anim.setTargets(el);
    anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
    return { el, anim };
};

// ══════════════════════════════════════════════════════════════════════════
// S1 — register the parsed @property registry (D-LIB-1)
// ══════════════════════════════════════════════════════════════════════════

describe("S1 — @property registry → CSS.registerProperty", () => {
    const PROP_CSS = `
        @property --ramp {
            syntax: "<number>";
            inherits: false;
            initial-value: 0;
        }
        @keyframes ramp {
            from { --ramp: 0; }
            to { --ramp: 1; }
        }
    `;

    afterEach(() => {
        // @ts-expect-error — tear down the CSS stub between tests
        delete globalThis.CSS;
    });

    it("(a) GUARD: no CSS global (jsdom/SSR) → fromString no-ops, never throws", () => {
        expect(typeof (globalThis as { CSS?: unknown }).CSS).toBe("undefined");
        const anim = new CSSKeyframesAnimation({ duration: 300 });
        expect(() => anim.fromString(PROP_CSS)).not.toThrow();
        // The registry is still populated (the metadata-recovery surface).
        expect(anim.propertyRegistry.has("--ramp")).toBe(true);
    });

    it("(b) EQUIVALENCE: the registry is no longer inert — one registerProperty() call per descriptor", () => {
        const spy = vi.fn();
        // @ts-expect-error — install a minimal CSS stub
        globalThis.CSS = { registerProperty: spy };

        new CSSKeyframesAnimation({ duration: 300 }).fromString(PROP_CSS);

        expect(spy).toHaveBeenCalledTimes(1);
        const def = spy.mock.calls[0]![0];
        expect(def.name).toBe("--ramp");
        expect(def.syntax).toBe("<number>");
        expect(def.inherits).toBe(false);
        expect(def.initialValue).toBe("0");
    });

    it("(b) swallows the benign InvalidModificationError on a duplicate name", () => {
        const err = new Error("InvalidModificationError");
        err.name = "InvalidModificationError";
        const spy = vi.fn(() => {
            throw err;
        });
        // @ts-expect-error — install a throwing CSS stub
        globalThis.CSS = { registerProperty: spy };

        const anim = new CSSKeyframesAnimation({ duration: 300 });
        expect(() => anim.fromString(PROP_CSS)).not.toThrow();
        expect(spy).toHaveBeenCalled();
    });

    it("BITE: with no @property rules, registerProperty is never called", () => {
        const spy = vi.fn();
        // @ts-expect-error — install a minimal CSS stub
        globalThis.CSS = { registerProperty: spy };
        new CSSKeyframesAnimation({ duration: 300 }).fromString(
            `from { opacity: 0; } to { opacity: 1; }`,
        );
        expect(spy).not.toHaveBeenCalled();
    });
});

// ══════════════════════════════════════════════════════════════════════════
// S2 — live reduced-motion observation (D-LIB-3)
// ══════════════════════════════════════════════════════════════════════════

describe("S2 — live reduced-motion observation", () => {
    afterEach(() => {
        // @ts-expect-error — restore a benign matchMedia
        delete window.matchMedia;
    });

    it("(a) GUARD: no matchMedia → onReducedMotionChange returns a no-op unsubscribe", async () => {
        // @ts-expect-error — simulate an engine without matchMedia
        delete window.matchMedia;
        const rm = await freshReducedMotion();
        const off = rm.onReducedMotionChange(() => {});
        expect(typeof off).toBe("function");
        expect(() => off()).not.toThrow();
        expect(rm.prefersReducedMotion()).toBe(false);
    });

    it("(b) the ONE shared MediaQueryList: a change event fans out to the listener", async () => {
        const mql = installMatchMedia(false);
        const rm = await freshReducedMotion();
        const seen: boolean[] = [];
        const off = rm.onReducedMotionChange((m) => seen.push(m));

        expect(rm.prefersReducedMotion()).toBe(false);
        mql.dispatch(true);
        // The live read reflects the flip immediately (one shared handle).
        expect(rm.prefersReducedMotion()).toBe(true);
        expect(seen).toEqual([true]);

        off();
        mql.dispatch(false);
        // After unsubscribe the listener is silent, but the live read still
        // tracks the shared handle.
        expect(seen).toEqual([true]);
        expect(rm.prefersReducedMotion()).toBe(false);
    });

    it("(b) OBSERVABLE: a mid-flight flip to reduce snaps a running infinite animation to rest", async () => {
        const mql = installMatchMedia(false);
        // The engine reads the SAME module-level handle; this test drives the
        // engine import (not the fresh one) so the snap path consults it.
        const { el, anim } = await opacityAnim(100_000, /* infinite */ true);
        anim.setRespectReducedMotion(true);

        const playP = anim.play();
        // Let the rAF loop run a few frames at the non-reduced preference.
        await new Promise((r) => setTimeout(r, 30));
        expect(anim.done).toBe(false);

        // OS toggles reduced-motion mid-flight.
        mql.dispatch(true);
        await playP; // the next tick re-consults and snaps to rest

        // Rest = final frame (fill forwards) painted, loop resolved.
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
    });

    it("BITE: with the preference OFF, a running animation does NOT snap early", async () => {
        installMatchMedia(false);
        const { anim } = await opacityAnim(60);
        anim.setRespectReducedMotion(true);
        const start = performance.now();
        await anim.play();
        // It ran the full (short) duration rather than snapping on frame 1.
        expect(performance.now() - start).toBeGreaterThanOrEqual(40);
    });
});

// ══════════════════════════════════════════════════════════════════════════
// S3 — dense WAAPI sub-segment sampling (F3)
// ══════════════════════════════════════════════════════════════════════════

describe("S3 — dense WAAPI sub-segment sampling", () => {
    const transformAnim = async () => {
        const el = document.createElement("div");
        const easing = await resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
        const anim = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: easing,
        });
        anim.setTargets(el);
        anim.fromString(`
            from { transform: translateX(0px); }
            to   { transform: translateX(100px); }
        `);
        return anim;
    };

    it("(a) emits intermediate-offset stops BETWEEN the boundaries (not boundary-only)", async () => {
        const anim = await transformAnim();
        const kfs = toWAAPIKeyframes(anim);
        const offsets = kfs.map((k) => k.offset as number);
        // Boundary-only would be exactly [0, 1]. Dense sampling adds interior
        // stops strictly between them.
        expect(offsets[0]).toBe(0);
        expect(offsets[offsets.length - 1]).toBe(1);
        const interior = offsets.filter((o) => o > 0 && o < 1);
        expect(interior.length).toBeGreaterThan(0);
    });

    it("(b) EQUIVALENCE: each emitted stop matches the true rAF curve at that offset", async () => {
        const anim = await transformAnim();
        const kfs = toWAAPIKeyframes(anim);
        const pxAt = (s: string): number =>
            parseFloat(s.match(/translateX\(([-\d.]+)px\)/)![1]!);

        // The emitted stops must be MONOTONE-INCREASING in px across offsets —
        // an ease-in-out translateX is monotone — and each must equal the JS
        // path's own re-emit at that same offset (the curve, not its endpoints).
        let prev = -Infinity;
        for (const kf of kfs) {
            const offset = kf.offset as number;
            const t = offset * anim.options.duration;
            const emitted = (kf as Record<string, unknown>).transform as string;
            expect(emitted).toContain("translateX");
            const px = pxAt(emitted);
            // The JS-path truth at this offset: interpFrames(t) flattens to
            // `transform.translateX`; the eased px equals the emitted stop.
            const truth = anim.interpFrames(t, false);
            const truthPx = parseFloat(
                truth["transform.translateX"]![0]!.toString(),
            );
            expect(px).toBeCloseTo(truthPx, 6);
            expect(px).toBeGreaterThanOrEqual(prev - 1e-9);
            prev = px;
        }

        // An interior stop must be OFF the straight boundary-to-boundary line —
        // proof the densification samples the BENT curve, not just lerps 0→100.
        const interior = kfs.filter((k) => {
            const o = k.offset as number;
            return o > 0 && o < 1;
        });
        const bentOffLine = interior.some((k) => {
            const o = k.offset as number;
            const px = pxAt((k as Record<string, unknown>).transform as string);
            return Math.abs(px - o * 100) > 0.5; // linear fill would be o*100
        });
        expect(bentOffLine).toBe(true);
    });

    it("BITE: boundary-only emit would carry NO interior stops (the densification is what adds them)", async () => {
        const anim = await transformAnim();
        const kfs = toWAAPIKeyframes(anim);
        const interior = kfs
            .map((k) => k.offset as number)
            .filter((o) => o > 0 && o < 1);
        // If the per-segment densification were reverted to boundary-only this
        // set would be empty — the clause bites on that regression.
        expect(interior.length).toBeGreaterThanOrEqual(1);
    });
});

// ══════════════════════════════════════════════════════════════════════════
// S5 — the ADDITIVE native ScrollTimeline/ViewTimeline bridge (D-LIB-2 / F-5)
// ══════════════════════════════════════════════════════════════════════════

describe("S5 — additive native scroll-timeline bridge", () => {
    afterEach(() => {
        // @ts-expect-error — tear down the native-timeline + animate stubs
        delete globalThis.ScrollTimeline;
        // @ts-expect-error
        delete globalThis.ViewTimeline;
        // @ts-expect-error
        delete HTMLElement.prototype.animate;
    });

    const installScrollTimeline = () => {
        class FakeScrollTimeline {
            source: Element | null;
            axis: string;
            constructor(opts?: { source?: Element | null; axis?: string }) {
                this.source = opts?.source ?? null;
                this.axis = opts?.axis ?? "block";
            }
        }
        // @ts-expect-error — install the native global
        globalThis.ScrollTimeline = FakeScrollTimeline;
        return FakeScrollTimeline;
    };

    const installAnimate = () => {
        const calls: { keyframes: unknown; options: unknown }[] = [];
        HTMLElement.prototype.animate = function (keyframes, options) {
            calls.push({ keyframes, options });
            return { finished: Promise.resolve(), cancel() {} } as unknown as globalThis.Animation;
        };
        return calls;
    };

    it("(a)(ii) the JS ScrollTimeline sampler STILL exists and is reachable (ARCH-kill holds)", () => {
        // The additive bridge must never delete the general JS sampler.
        expect(typeof JSScrollTimeline).toBe("function");
        const ts = new JSScrollTimeline({ getScrollY: () => 0 });
        expect(ts).toBeInstanceOf(Timeline);
        expect(typeof ts.tick).toBe("function");
    });

    it("(a) GUARD: no ScrollTimeline global → createNativeTimeline returns null, attach falls back", async () => {
        expect(
            (globalThis as { ScrollTimeline?: unknown }).ScrollTimeline,
        ).toBeUndefined();
        expect(createNativeTimeline({ kind: "scroll" })).toBeNull();

        const { anim } = await opacityAnim();
        const res = attachNativeScrollTimeline(anim, { kind: "scroll" });
        expect(res.attached).toBe(false);
        // The caller keeps the JS Timeline fallback — no throw, no attach.
    });

    it("(b) where supported + eligible: attaches a native timeline via Element.animate", async () => {
        const Native = installScrollTimeline();
        const calls = installAnimate();
        const scroller = document.createElement("div");
        const { anim } = await opacityAnim();

        const res = attachNativeScrollTimeline(anim, {
            kind: "scroll",
            source: scroller,
        });
        expect(res.attached).toBe(true);
        expect(calls).toHaveLength(1);
        const options = calls[0]!.options as { timeline?: unknown };
        expect(options.timeline).toBeInstanceOf(Native);
    });

    it("(b) reconciliation: the JS lane disables smoothing to match the un-smoothed native lane", () => {
        // The native animation-range path has no SmoothProgress. The
        // equivalence contract: run the JS ScrollTimeline with smoothing off so
        // raw scroll progress on both lanes agrees. With smoothing off, a
        // mid-range sample is the RAW eased progress (no lerp lag).
        const native = new JSScrollTimeline({
            smoothing: false,
            getScrollY: () => 35,
            getViewportHeight: () => 100,
            threshold: 1,
        });
        native.tick();
        // raw = 35/100 = 0.35, identity easing, no smoothing → exactly 0.35.
        expect(native.progress).toBeCloseTo(0.35, 6);

        // BITE: with smoothing ON the same single tick LAGS behind 0.35 — the
        // two lanes would diverge, which is exactly why the bridge disables it.
        const smoothed = new JSScrollTimeline({
            getScrollY: () => 35,
            getViewportHeight: () => 100,
            threshold: 1,
        });
        smoothed.tick();
        expect(smoothed.progress).toBeLessThan(0.35);
    });

    it("BITE: an INELIGIBLE animation (default easing, no CSS twin) never attaches a native timeline", async () => {
        installScrollTimeline();
        const calls = installAnimate();
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({ duration: 500 }); // default easing
        anim.setTargets(el);
        anim.fromString(`from { opacity: 0; } to { opacity: 1; }`);
        expect(isWAAPIEligible(anim).eligible).toBe(false);

        const res = attachNativeScrollTimeline(anim, { kind: "scroll" });
        expect(res.attached).toBe(false);
        expect(calls).toHaveLength(0);
    });

    it("ViewTimeline branch: feature-detected on its own global", () => {
        const subject = document.createElement("div");
        // ScrollTimeline present, ViewTimeline absent → view kind returns null.
        installScrollTimeline();
        expect(createNativeTimeline({ kind: "view", subject })).toBeNull();
    });
});
