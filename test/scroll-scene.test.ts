/**
 * scroll-scene.test.ts — K.W9 SCROLL-AS-CSS (the value proof; the source-shape
 * lock rides `scripts/proof-scroll-roundtrip.mjs`).
 *
 * BORN-RED WITNESS (DOUBLE-rooted, both now resolved):
 *   (1) the FRONTIER sense — kf had ZERO scroll-parse surface and no
 *       `ScrollScene` (the §State-verified two-comments-only grep). This wave
 *       ships `src/animation/scroll-scene.ts`; before it, every assert below
 *       reds by construction (the symbol does not exist).
 *   (2) value.js-GATED — the typed scroll-VALUE extractor + `CSSTimelineOptions`
 *       were ABSENT in value.js ≤ 0.12.0. value.js 0.13.0 PUBLISHES them
 *       (`parseAnimationTimeline` / `extractTimelineOptions` /
 *       `serializeTimelineOptions`); the consume edge is now LIT, so clause (b)
 *       (the PARSE round-trip) greens on the publish.
 *
 * CLAUSES (mirror the §Hard gate):
 *   (a) SO-2 the JS driver SCRUBS + SNAPS a spec-fed scene (value.js-INDEPENDENT)
 *   (b) SO-1 the PARSE round-trips a scroll-driven stylesheet (value.js-GATED)
 *   (c) the DISPATCH is conservative-correct, with a queryable reason
 *   (d) SO-3 the pin is `position:sticky` synthesis, never transform-tracking
 *   (e) SO-6 the JS driver is NOT deleted (the ARCH-kill guard)
 */
import { describe, expect, it } from "vitest";
import {
    ScrollScene,
    createScrollScene,
    dispatchScrollBackend,
    parseScrollCSS,
    parseScrollRange,
    parseScrollTimeline,
    pinCSS,
    resolveRange,
    roundTripScrollCSS,
    serializeScrollOptions,
} from "../src/animation/scroll-scene";
import { KeyframesScrollTimeline } from "../src/animation/timeline";
import { CSSKeyframesAnimation } from "../src/animation/engine";

const mkEl = (style: Record<string, string> = {}): HTMLElement => {
    const el = document.createElement("div");
    for (const [k, v] of Object.entries(style)) el.style.setProperty(k, v);
    return el;
};

// ════════════════════════════════════════════════════════════════════════
// clause (a) — SO-2 the JS driver SCRUBS + SNAPS (value.js-INDEPENDENT)
// ════════════════════════════════════════════════════════════════════════
describe("K.W9 clause (a) — the JS ScrollScene scrubs + snaps a spec-fed scene", () => {
    it("maps a raw scroll position to local progress over the parsed range", () => {
        // range: entry 0% cover 40% → start 0, end (cover band 0.25..0.75 at 40%)
        const scene = createScrollScene({
            range: {
                start: { phase: "entry", offset: "0%" },
                end: { phase: "cover", offset: "40%" },
            },
        });
        // No scrub → the progress tracks the scroll 1:1 over [start,end].
        const { start, end } = scene.range;
        const mid = (start + end) / 2;
        expect(scene.scrollProgress(start)).toBeCloseTo(0, 5);
        expect(scene.scrollProgress(end)).toBeCloseTo(1, 5);
        expect(scene.scrollProgress(mid)).toBeCloseTo(0.5, 5);
    });

    it("scrub: the engine progress tracks scroll THROUGH the smoother (not 1:1)", () => {
        const scene = new ScrollScene({
            range: { start: { offset: "0%" }, end: { offset: "100%" } },
            scrub: 0.3,
        });
        // Seed the target at full progress; the smoother has NOT converged, so
        // the first read is BELOW the target — the damped lag a 1:1 scrub cannot
        // produce. This is the engine-write disambiguation: a decorative bob
        // cannot produce a scroll-correlated, smoother-damped progress.
        const immediate = scene.scrollProgress(1);
        expect(immediate).toBeLessThan(1);
        expect(scene.settled).toBe(false);
        // Drive the smoother — it converges toward the scroll target.
        for (let i = 0; i < 200 && !scene.settled; i++) scene.tick(16.667);
        expect(scene.progress).toBeCloseTo(1, 2);
        expect(scene.settled).toBe(true);
    });

    it("snap: settles to the NEAREST configured range boundary on scroll-idle", () => {
        const scene = new ScrollScene({
            range: { start: { offset: "0%" }, end: { offset: "100%" } },
            snap: [0, 0.5, 1],
        });
        // Park near 0.45 → nearest snap point is 0.5.
        scene.scrollProgress(0.45);
        const target = scene.snapTo(0);
        expect(target).toBe(0.5);
        // Drive the spring settle — the progress converges to the snap point.
        for (let i = 0; i < 400; i++) scene.tickSnap(16.667);
        expect(scene.progress).toBeCloseTo(0.5, 2);
    });

    it("snap projects the momentum rest point (decayRest) before choosing", () => {
        const scene = new ScrollScene({
            range: { start: { offset: "0%" }, end: { offset: "100%" } },
            snap: [0, 0.5, 1],
        });
        // Park at 0.2 but with a strong forward velocity — decayRest projects the
        // glide past 0.5, so the nearest snap to the PROJECTED rest is 1, not 0.
        scene.scrollProgress(0.2);
        const target = scene.snapTo(/* velocity */ 5);
        expect(target).toBe(1);
    });

    it("enter/leave fire at the parsed range boundaries", () => {
        const scene = new ScrollScene({
            range: { start: { offset: "20%" }, end: { offset: "80%" } },
        });
        let entered = 0;
        let left = 0;
        scene.on("enter", () => entered++);
        scene.on("leave", () => left++);
        scene.scrollProgress(0.1); // before → no event
        scene.scrollProgress(0.5); // inside → enter
        scene.scrollProgress(0.9); // after → leave
        expect(entered).toBe(1);
        expect(left).toBe(1);
    });
});

// ════════════════════════════════════════════════════════════════════════
// clause (b) — SO-1 the PARSE round-trips a scroll-driven stylesheet
//              (value.js-GATED — the consume edge LIT on value.js 0.13.0)
// ════════════════════════════════════════════════════════════════════════
describe("K.W9 clause (b) — the scroll grammar round-trips (parse → serialize)", () => {
    it("parses a view()/animation-range stylesheet to typed CSSTimelineOptions", () => {
        const css = `@keyframes reveal {
          from { opacity: 0; translate: 0 40px }
          to { opacity: 1; translate: 0 0 }
        }
        .card {
          animation: reveal linear both;
          animation-timeline: view();
          animation-range: entry 0% cover 40%;
        }`;
        const opts = parseScrollCSS(css);
        expect(opts.timeline).toEqual({ kind: "view" });
        expect(opts.range).toEqual({
            start: { phase: "entry", offset: "0%" },
            end: { phase: "cover", offset: "40%" },
        });
    });

    it("THE REPLAY-EQUALITY ORACLE: serialize(parse(s)) re-parses equivalent", () => {
        const css = `.card {
          animation-timeline: scroll(root block);
          animation-range: entry 0% cover 40%;
        }`;
        const { options, declarations } = roundTripScrollCSS(css);
        // The serialized longhands re-parse to the SAME typed options — the
        // round-trip is faithful (a dropped phase / a scroll()→view() collapse
        // would diverge here, reding the clause even though it "parsed").
        const reTimeline = parseScrollTimeline(declarations["animation-timeline"]!);
        const reRange = parseScrollRange(declarations["animation-range"]!);
        expect(reTimeline).toEqual(options.timeline);
        expect(reRange).toEqual(options.range);
    });

    it("a NAMED timeline ref round-trips as a <dashed-ident> (not silently lost)", () => {
        const css = `.card { animation-timeline: --hero-scroll; }`;
        const { options, declarations } = roundTripScrollCSS(css);
        expect(options.timeline).toEqual({ kind: "name", name: "--hero-scroll" });
        // The named ref survives the round-trip verbatim.
        expect(declarations["animation-timeline"]).toBe("--hero-scroll");
        expect(parseScrollTimeline(declarations["animation-timeline"]!)).toEqual(
            options.timeline,
        );
    });

    it("the parsed range resolves to driver [start,end] extent fractions (TIME)", () => {
        // value.js emits the offset VERBATIM ("40%"); kf resolves it to a fraction.
        const range = parseScrollRange("entry 0% cover 40%");
        const resolved = resolveRange(range);
        expect(resolved.start).toBeCloseTo(0, 5);
        // cover band 0.25..0.75 at 40% through → 0.25 + 0.4*0.5 = 0.45
        expect(resolved.end).toBeCloseTo(0.45, 5);
    });
});

// ════════════════════════════════════════════════════════════════════════
// clause (c) — the DISPATCH is conservative-correct, with a queryable reason
// ════════════════════════════════════════════════════════════════════════
describe("K.W9 clause (c) — the dispatch picks native vs JS correctly", () => {
    it("scrub requested → JS, with a reason naming the missing smoother", () => {
        const el = mkEl();
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString("@keyframes x { from { opacity: 0 } to { opacity: 1 } }");
        const verdict = dispatchScrollBackend({
            animation: a,
            nativeSpec: { kind: "scroll" },
            scrub: true,
        });
        expect(verdict.backend).toBe("js");
        if (verdict.backend === "js")
            expect(verdict.reason).toMatch(/scrub|smoother/i);
    });

    it("snap requested → JS, with a reason naming the missing physics snap", () => {
        const el = mkEl();
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString("@keyframes x { from { opacity: 0 } to { opacity: 1 } }");
        const verdict = dispatchScrollBackend({
            animation: a,
            nativeSpec: { kind: "view", subject: el },
            snap: true,
        });
        expect(verdict.backend).toBe("js");
        if (verdict.backend === "js") expect(verdict.reason).toMatch(/snap/i);
    });

    it("non-DOM target / no animation → JS (the universal driver)", () => {
        const verdict = dispatchScrollBackend({});
        expect(verdict.backend).toBe("js");
        if (verdict.backend === "js") expect(verdict.reason).toMatch(/non-DOM|universal/i);
    });

    it("native ABSENT (jsdom: no Element.animate / no ScrollTimeline) → JS, never native", () => {
        // jsdom implements neither `Element.animate()` nor the `ScrollTimeline`
        // global → an otherwise-eligible animation NEVER dispatches native; it
        // falls back to JS (the conservative-correct floor), with a reason. The
        // exact reason is whichever conservative check trips first (eligibility
        // OR feature-absence); the BITE is that it is JS, not a silent native.
        const el = mkEl();
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString("@keyframes x { from { opacity: 0 } to { opacity: 1 } }");
        const verdict = dispatchScrollBackend({
            animation: a,
            nativeSpec: { kind: "scroll" },
        });
        expect(verdict.backend).toBe("js");
        if (verdict.backend === "js")
            expect(verdict.reason.length).toBeGreaterThan(0);
    });

    it("native-feature-absence is the JS reason when the animation IS WAAPI-eligible", () => {
        // Build a FULLY WAAPI-eligible animation: install a minimal
        // `Element.animate()` (jsdom lacks it) AND a CSS-twinned `linear` easing
        // (the default easeInOutCubic has no CSS twin). Now eligibility passes →
        // the JS fallback reason is the native-feature-absence
        // (createNativeTimeline → null in jsdom: no ScrollTimeline global), the
        // dispatch's LAST conservative gate — never a silent native dispatch.
        const el = mkEl();
        const orig = (el as unknown as { animate?: unknown }).animate;
        (el as unknown as { animate: () => unknown }).animate = () => ({});
        try {
            const linear = { fn: (t: number) => t, css: "linear" };
            const a = new CSSKeyframesAnimation(
                { duration: 1000, timingFunction: linear },
                el,
            );
            a.fromString("@keyframes x { from { opacity: 0 } to { opacity: 1 } }");
            const verdict = dispatchScrollBackend({
                animation: a,
                nativeSpec: { kind: "scroll" },
            });
            expect(verdict.backend).toBe("js");
            if (verdict.backend === "js")
                expect(verdict.reason).toMatch(/unavailable|absent/i);
        } finally {
            if (orig === undefined)
                delete (el as unknown as { animate?: unknown }).animate;
            else (el as unknown as { animate?: unknown }).animate = orig;
        }
    });

    it("an ineligible (color-interp) animation never dispatches native — reason given", () => {
        const el = mkEl();
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        // color interpolation is in the WAAPI-ineligible set.
        a.fromString("@keyframes c { from { color: red } to { color: blue } }");
        const verdict = dispatchScrollBackend({
            animation: a,
            nativeSpec: { kind: "scroll" },
        });
        expect(verdict.backend).toBe("js");
        if (verdict.backend === "js") expect(verdict.reason.length).toBeGreaterThan(0);
    });
});

// ════════════════════════════════════════════════════════════════════════
// clause (d) — SO-3 the pin is position:sticky SYNTHESIS, never transform
// ════════════════════════════════════════════════════════════════════════
describe("K.W9 clause (d) — the pin is position:sticky, never transform-tracking", () => {
    it("pinCSS emits position:sticky (SO-4 transform-pinning is KILLED)", () => {
        const css = pinCSS();
        expect(css).toContain("position: sticky");
        // The anti-jitter assert: NO transform-tracking primitive in the pin CSS.
        expect(css).not.toMatch(/transform/);
        expect(css).not.toMatch(/translateY/);
    });

    it("pinCSS honors a top/bottom offset, still sticky", () => {
        expect(pinCSS({ top: 24 })).toBe("position: sticky; top: 24px;");
        expect(pinCSS({ bottom: 16 })).toBe("position: sticky; bottom: 16px;");
    });
});

// ════════════════════════════════════════════════════════════════════════
// clause (e) — SO-6 the JS driver is NOT deleted (the ARCH-kill guard)
// ════════════════════════════════════════════════════════════════════════
describe("K.W9 clause (e) — the JS ScrollTimeline driver is the universal fallback", () => {
    it("the shipped JS ScrollTimeline still drives progress (not replaced)", () => {
        // The ARCH-kill HOLDS: the dispatch ADDS a tier; it deletes no driver.
        let y = 0;
        const tl = new KeyframesScrollTimeline({
            smoothing: false,
            getScrollY: () => y,
            getViewportHeight: () => 100,
        });
        y = 35; // threshold 0.35 * 100 = 35 → full progress
        tl.tick();
        expect(tl.progress).toBeCloseTo(1, 5);
    });

    it("a ScrollScene with no scrub/snap maps the range 1:1 (the universal driver)", () => {
        const scene = createScrollScene({
            range: { start: { offset: "0%" }, end: { offset: "100%" } },
        });
        expect(scene.scrollProgress(0.42)).toBeCloseTo(0.42, 5);
    });
});
