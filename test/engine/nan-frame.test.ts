/**
 * nan-frame.test.ts — Q.WD1 (DM-22 named-selector NaN-frame proper cure).
 *
 * The vitest companion to `proof:nan-frame` (the runtime tsx gate): the four
 * RUNTIME observables of the proper cure, locked in the fast `npm test` tier.
 *   - `s4-ingest-roundtrip` — `fromString` NEVER throws on a named selector +
 *     round-trips the authored token verbatim (the L.W1 S4 floor).
 *   - `bind-resolves` — `namedSelectorToFraction` maps the named phases to the
 *     exact single-position fractions.
 *   - `no-nan-at-play` — after `bindTimeline`, every frame time is finite + the
 *     bound animation's `at()`/`play()` do NOT over-throw.
 *   - `play-throws-no-timeline` — without `bindTimeline`, `play()`/`at()` throw
 *     the typed `NAMED_SELECTOR_NO_TIMELINE` (NEVER a parse-time throw).
 *
 * The cure supersedes O.W3 Path A (the reverted parse-time throw). It is Path B:
 * deferred resolution at attach + a typed throw ONLY at the genuinely-demanded
 * play-without-timeline point.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import {
    namedSelectorToFraction,
    parseKeyframeSelector,
} from "../../src/animation/compile/selector";
import { ManualTimeline } from "../../src/animation/orchestration/timeline";

const NAMED_CSS = "@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }";

const namedSelector = (source: string) => {
    const selector = parseKeyframeSelector(source);
    if (selector.kind !== "named") {
        throw new TypeError(
            `Expected a named selector for ${JSON.stringify(source)}.`,
        );
    }
    return selector;
};

const selectorText = (selector: ReturnType<typeof parseKeyframeSelector>) =>
    selector.kind === "percent"
        ? `${selector.value * 100}%`
        : `${selector.name}${
              selector.offset === undefined ? "" : ` ${selector.offset * 100}%`
          }`;

describe("Q.WD1 — named-selector NaN-frame proper cure (DM-22)", () => {
    // ── s4-ingest-roundtrip (the L.W1 S4 floor — stays green) ───────────────
    it("fromString does NOT throw on named selectors and round-trips the token verbatim", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 });
        expect(() => anim.fromString(NAMED_CSS)).not.toThrow();
        const raws = anim.templateFrames.map((f) => selectorText(f.start));
        expect(raws).toContain("entry");
        expect(raws).toContain("exit");
    });

    // ── bind-resolves (the resolver — exact single-position mappings) ───────
    it("namedSelectorToFraction maps the named phases to their single-position fraction", () => {
        expect(namedSelectorToFraction(namedSelector("entry"))).toBe(0);
        expect(namedSelectorToFraction(namedSelector("cover"))).toBe(0.25);
        expect(namedSelectorToFraction(namedSelector("contain"))).toBe(0.375);
        expect(namedSelectorToFraction(namedSelector("exit"))).toBe(0.75);
        // `entry 50%` = 50% through the entry band [0, 0.25] = 0.125.
        expect(namedSelectorToFraction(namedSelector("entry 50%"))).toBeCloseTo(
            0.125,
            12,
        );
        // `exit 100%` = end of the exit band [0.75, 1] = 1.0.
        expect(namedSelectorToFraction(namedSelector("exit 100%"))).toBeCloseTo(
            1,
            12,
        );
    });

    // ── no-nan-at-play (bind resolves to finite + the bound path is clean) ──
    it("after bindTimeline, every frame time is finite and at() does NOT throw", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            NAMED_CSS,
        );
        anim.bindTimeline(new ManualTimeline());

        for (const frame of anim.frames) {
            expect(Number.isFinite(frame.time.start)).toBe(true);
            expect(Number.isFinite(frame.time.stop)).toBe(true);
        }
        // The ordering enforcer: the guard reads the CLEARED superType tag, so
        // the bound animation's query path does NOT over-throw.
        expect(() => anim.at(0)).not.toThrow();
        expect(() => anim.at(0.5)).not.toThrow();
        expect(() => anim.at(1)).not.toThrow();
    });

    // ── T.S4 (DM-22 build branch, ratified) — a named-selector frame SAMPLED
    //    after bindTimeline yields a FINITE value, not NaN (the direct gate) ──
    it("T.S4: a named-selector frame sampled after bindTimeline yields a finite value (not NaN)", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            NAMED_CSS,
        );
        anim.bindTimeline(new ManualTimeline());
        // Sample the interpolated opacity across the resolved band [entry=0%,
        // exit=75%] → duration ms [0, 750]. Every in-band sample is a FINITE
        // number (the phase→% resolution eliminated the sample-time NaN the
        // DEFERRED comment used to advertise as an unbuilt cure); crucially, no
        // sample is EVER NaN (the failure mode the deferral left latent).
        for (const t of [0.05, 0.25, 0.5, 0.7]) {
            const v = anim.at(t).opacity;
            expect(typeof v).toBe("number");
            expect(Number.isNaN(v as number)).toBe(false);
            expect(Number.isFinite(v as number)).toBe(true);
        }
    });

    it("bindTimeline replaces named selectors with normalized percent selectors", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            NAMED_CSS,
        );
        anim.bindTimeline(new ManualTimeline());
        const stillNamed = anim.templateFrames.some(
            (f) => f.start.kind === "named",
        );
        expect(stillNamed).toBe(false);
        // `entry` → 0% , `exit` → 75% (the resolved numeric positions).
        const starts = anim.templateFrames
            .flatMap((f) =>
                f.start.kind === "percent" ? [f.start.value * 100] : [],
            )
            .sort((a, b) => a - b);
        expect(starts).toContain(0);
        expect(starts).toContain(75);
    });

    // ── play-throws-no-timeline (the typed throw — the keystone) ────────────
    it("at() WITHOUT bindTimeline throws AnimationOptionError code NAMED_SELECTOR_NO_TIMELINE", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            NAMED_CSS,
        );
        let code: string | undefined;
        try {
            anim.at(0.5);
            throw new Error("expected at() to throw, it did not");
        } catch (e) {
            code = (e as { code?: string }).code;
        }
        expect(code).toBe("NAMED_SELECTOR_NO_TIMELINE");
    });

    it("play() WITHOUT bindTimeline rejects with NAMED_SELECTOR_NO_TIMELINE (never a parse-time throw)", async () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            NAMED_CSS,
        );
        await expect(anim.play()).rejects.toMatchObject({
            code: "NAMED_SELECTOR_NO_TIMELINE",
        });
    });

    // ── no-regression: a plain %/from-to animation is untouched by the guard ─
    it("a plain percentage animation plays/queries without the guard firing", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes y { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        expect(() => anim.at(0.5)).not.toThrow();
        const v = anim.at(0.5).opacity;
        expect(typeof v).toBe("number");
        expect(v).toBeCloseTo(0.5, 6);
    });
});
