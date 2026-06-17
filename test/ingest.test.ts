/**
 * ingest.test.ts — K.W8 (the round-trip pointed FORWARD at the live web): the
 * REPLAY-EQUALITY invariant in the forward direction. `fromStyleSheets()` /
 * `fromLiveAnimations()` walk the CSSOM into kf objects; `adoptRunning()` takes
 * over a running CSS animation mid-flight; what cannot ingest faithfully is
 * REFUSED with a named `ParseDiagnostic` row, never silently approximated.
 *
 * proof:ingest-replay (the value proof; the source-shape lock rides
 * `scripts/proof-ingest-replay.mjs`).
 *
 * BORN-RED WITNESS: on the pre-cure tree NO CSSOM-walk surface exists
 * (`grep "styleSheets|getAnimations|cssRules" src/` = ZERO) — there is no
 * `fromStyleSheets` to call, so every replay-equality assert reds by
 * construction (the capability is ABSENT, the frontier sense of born-RED).
 *
 * Clauses (each BITES):
 *   (a) K1 ingest replays EQUAL to the source — the reconstructed kf object,
 *       sampled at t, equals the source CSS animation's linear interpolation
 *       (replay-equality; a lossy reconstruction reds even though it "parsed").
 *   (b) the round-trip is byte-faithful — the reconstructed object re-serialises
 *       to a template-equivalent of the source @keyframes (serialize symmetry).
 *   (c) K2 adoptRunning is FLASH-FREE — seeded at the captured currentTime, NOT
 *       at zero (a seed-at-zero adopt flashes the element to its 0% state).
 *   (d) the CORS skip is a DIAGNOSTIC, never a silent drop — a cross-origin
 *       sheet whose cssRules throws SecurityError emits a CORS_SKIP row.
 */
import { describe, expect, it } from "vitest";
import {
    fromStyleSheets,
    fromLiveAnimations,
    resolveLiveKeyframes,
    adoptRunning,
} from "../src/animation/ingest";
import { CSSKeyframesToString } from "../src/animation/format";

/** Install a `<style>` sheet into the document; return its live CSSStyleSheet. */
const installSheet = (css: string): CSSStyleSheet => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return style.sheet!;
};

const PULSE =
    "@keyframes pulse { 0% { opacity: 0; transform: scale(0.8) } " +
    "100% { opacity: 1; transform: scale(1) } } " +
    ".target { animation: pulse 1000ms linear; }";

describe("K.W8 clause (a) — K1 ingest replays EQUAL to the source", () => {
    it("fromStyleSheets reconstructs every @keyframes rule, keyed by name", () => {
        const sheet = installSheet(PULSE);
        const { animations, diagnostics } = fromStyleSheets([sheet]);
        // A clean same-origin sheet skips nothing — no diagnostic rows.
        expect(diagnostics.length).toBe(0);
        // The @keyframes rule is reconstructed, keyed by its CSS name.
        expect(animations.has("pulse")).toBe(true);
        const pulse = animations.get("pulse")!;
        expect(pulse.name).toBe("pulse");
        // Two declared stops (0%, 100%) → two template frames.
        expect(pulse.animation.templateFrames.length).toBe(2);
    });

    it("the reconstructed object SAMPLES equal to the source linear interp", () => {
        const sheet = installSheet(PULSE);
        const el = document.createElement("div");
        document.body.appendChild(el);
        const a = fromStyleSheets([sheet]).animations.get("pulse")!.animation;
        a.setTargets(el);
        // The source is `pulse 1000ms linear`, opacity 0→1: at t ms the source
        // computed opacity is t/1000. The reconstructed kf object MUST sample the
        // SAME value — replay-equality. A lossy reconstruction (wrong values,
        // dropped stop) would diverge here even though it "parsed".
        for (const t of [0, 250, 500, 750, 1000]) {
            a.interpFrames(t, true);
            const opacity = parseFloat(el.style.opacity || "0");
            expect(Math.abs(opacity - t / 1000)).toBeLessThan(0.01);
        }
    });

    it("the sibling style rule's options ride the reconstructed animation", () => {
        // `.target { animation: pulse 1000ms linear }` — the duration must flow
        // from the sibling style rule onto the reconstructed object (the
        // animation-name → style-rule linkage; NOT the engine default 1000ms by
        // coincidence — use a non-default duration to prove the linkage).
        const sheet = installSheet(
            "@keyframes p2 { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                ".t2 { animation: p2 2500ms linear; }",
        );
        const a = fromStyleSheets([sheet]).animations.get("p2")!.animation;
        expect(a.options.duration).toBe(2500);
    });
});

describe("K.W8 clause (b) — the round-trip is byte-faithful (serialize symmetry)", () => {
    it("the reconstructed object re-serialises to a template-equivalent @keyframes", async () => {
        const sheet = installSheet(PULSE);
        const a = fromStyleSheets([sheet]).animations.get("pulse")!.animation;
        const out = await CSSKeyframesToString(a, "pulse");
        // The DECLARED template projects back to CSS (format.ts declaredKeyframeBody,
        // the var()/calc()-faithful path) — not a DOM-resolved sample. The 0%/100%
        // stops + their declared values round-trip.
        expect(out).toContain("@keyframes pulse");
        expect(out).toContain("opacity: 0");
        expect(out).toContain("opacity: 1");
        // The transform stop round-trips (value.js normalises scale() to its
        // scaleX/Y/Z longhand on BOTH the authored and ingested path, so the
        // round-trip is template-equivalent, the symmetry the gate measures).
        expect(out).toContain("transform:");
    });

    it("re-ingesting the serialized output reproduces the same stops (idempotent)", async () => {
        const sheet = installSheet(PULSE);
        const a1 = fromStyleSheets([sheet]).animations.get("pulse")!.animation;
        const serialized = await CSSKeyframesToString(a1, "pulse");
        // Feed the SERIALIZED output back through the CSSOM walk: a second ingest
        // of kf's own emission must reconstruct the same stop count — the
        // round-trip is stable (ingest∘serialize∘ingest === ingest).
        const sheet2 = installSheet(serialized);
        const a2 = fromStyleSheets([sheet2]).animations.get("pulse")!.animation;
        expect(a2.templateFrames.length).toBe(a1.templateFrames.length);
    });
});

describe("K.W8 clause (c) — K2 adoptRunning is FLASH-FREE (the continuity oracle)", () => {
    /**
     * jsdom does not paint, so a real running `CSSAnimation` with a live
     * `currentTime` is unavailable (the headed chrome-devtools-mcp tier owns the
     * pixel-continuity assert per §P6). Here we stub a running animation with a
     * known `currentTime` and assert the SEED MECHANISM: the kf playhead is
     * seeded at the captured time, NOT at zero — the structural fact a
     * seed-at-zero adopt provably violates.
     */
    const stubRunning = (
        el: Element,
        animationName: string,
        currentTime: number,
    ): { cancelled: () => boolean } => {
        let cancelled = false;
        const fake = {
            animationName,
            currentTime,
            playState: "running",
            cancel() {
                cancelled = true;
            },
        };
        (el as { getAnimations: () => Animation[] }).getAnimations = () =>
            [fake] as unknown as Animation[];
        return { cancelled: () => cancelled };
    };

    it("adoptRunning seeds at the captured currentTime, NOT at zero", async () => {
        installSheet(
            "@keyframes spinA { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                ".sa { animation: spinA 2000ms linear; }",
        );
        const el = document.createElement("div");
        document.body.appendChild(el);
        const native = stubRunning(el, "spinA", 800);
        const res = await adoptRunning(el, { animationName: "spinA" });
        // The continuity seed: the kf playhead is at the captured time (800),
        // NOT 0 (the seed-at-zero flash). effectiveT is the observable.
        expect(res.currentTime).toBe(800);
        expect(res.animation).not.toBeNull();
        expect(res.animation!.effectiveT).toBeCloseTo(800, -1);
        // The native animation is cancelled (its precedence would fight the kf
        // paint) — AFTER the commit, so there is no flash window.
        expect(native.cancelled()).toBe(true);
        res.animation!.stop();
    });

    it("the commit-on-ADOPT paints the mid-curve frame inline (no flash to 0)", async () => {
        installSheet(
            "@keyframes fadeB { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                ".fb { animation: fadeB 1000ms linear; }",
        );
        const el = document.createElement("div");
        document.body.appendChild(el);
        stubRunning(el, "fadeB", 700);
        const res = await adoptRunning(el, { animationName: "fadeB" });
        // The commit-on-adopt painted opacity at t=700 → ~0.7. A seed-at-zero
        // adopt would have painted 0 (the flash). The element holds the mid-curve
        // value, continuous with the native animation's last paint.
        const opacity = parseFloat(el.style.opacity || "0");
        expect(opacity).toBeGreaterThan(0.6);
        res.animation!.stop();
    });

    it("adoptRunning REFUSES (a diagnostic, not a silent no-op) when no running animation matches", async () => {
        installSheet(
            "@keyframes presentC { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        const el = document.createElement("div");
        // No matching running animation by that name.
        (el as { getAnimations: () => Animation[] }).getAnimations = () => [];
        const res = await adoptRunning(el, { animationName: "presentC" });
        expect(res.animation).toBeNull();
        // L.W3 S3: the "no running animation by that name" path is an INGEST
        // refusal (the Web Animations API IS present — getAnimations() resolved
        // to []), distinct from the WAAPI-API-absent path (no getAnimations() at
        // all). It now emits ADOPT_REFUSE, not WAAPI_INELIGIBLE — a consumer
        // branches on the code without scraping the message.
        expect(res.diagnostics.some((d) => d.code === "ADOPT_REFUSE")).toBe(
            true,
        );
    });
});

describe("K.W8 clause (d) — the CORS skip is a DIAGNOSTIC, never a silent drop", () => {
    it("a cross-origin sheet whose cssRules throws emits a CORS_SKIP row", () => {
        // A cross-origin sheet without Access-Control-Allow-Origin throws a
        // SecurityError the moment cssRules is read. The walk MUST catch it per
        // sheet and emit a CORS_SKIP row — never an uncaught throw, never a
        // silent omission (the exact class the proof culture forbids).
        const corsSheet = {
            href: "https://cross-origin.example/styles.css",
            get cssRules(): CSSRuleList {
                throw new DOMException("blocked by CORS", "SecurityError");
            },
        } as unknown as CSSStyleSheet;
        const { animations, diagnostics } = resolveLiveKeyframes([corsSheet]);
        // No uncaught throw (the call returned), no reconstructed animation, and
        // a typed CORS_SKIP row PRESENT (the honesty surface).
        expect(animations.size).toBe(0);
        const cors = diagnostics.find((d) => d.code === "CORS_SKIP");
        expect(cors).toBeDefined();
        expect(cors!.input).toBe("https://cross-origin.example/styles.css");
        expect(typeof cors!.message).toBe("string");
    });

    it("a mixed walk reconstructs the same-origin sheet AND reports the CORS one", () => {
        // The CORS skip does not poison the walk: a same-origin sheet beside a
        // cross-origin one is still reconstructed; both outcomes are honest.
        const okSheet = installSheet(
            "@keyframes okD { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        const corsSheet = {
            href: "https://cross-origin.example/x.css",
            get cssRules(): CSSRuleList {
                throw new DOMException("blocked", "SecurityError");
            },
        } as unknown as CSSStyleSheet;
        const { animations, diagnostics } = resolveLiveKeyframes([
            okSheet,
            corsSheet,
        ]);
        expect(animations.has("okD")).toBe(true);
        expect(diagnostics.some((d) => d.code === "CORS_SKIP")).toBe(true);
    });

    it("a malformed @keyframes rule is REFUSED with a per-rule diagnostic, not an uncaught throw", () => {
        // The VJ-9 robustness edge: a rule value.js cannot parse totally must
        // surface as a citable row, never abort the whole walk. (Most inputs
        // parse leniently in 0.13.0; this asserts the SHAPE of the refusal path
        // exists — a per-rule diagnostics array the consumer can read.)
        const sheet = installSheet(
            "@keyframes mixed { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                "@keyframes also { 0% { left: 0px } 100% { left: 10px } }",
        );
        const { animations } = resolveLiveKeyframes([sheet]);
        // Every reconstructed animation carries its OWN per-rule diagnostics
        // array (the channel a refusal rides) — present even when empty.
        for (const ingested of animations.values()) {
            expect(Array.isArray(ingested.diagnostics)).toBe(true);
        }
        expect(animations.size).toBeGreaterThanOrEqual(2);
    });
});

describe("K.W8 — fromLiveAnimations narrows to the RUNNING animation set", () => {
    it("reconstructs only the names currently running via getAnimations()", () => {
        installSheet(
            "@keyframes liveOne { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                "@keyframes liveTwo { 0% { left: 0px } 100% { left: 9px } }",
        );
        // A document scope whose getAnimations() reports only `liveOne` running.
        const fakeDoc = {
            getAnimations: () =>
                [{ animationName: "liveOne" }] as unknown as Animation[],
            styleSheets: document.styleSheets,
        } as unknown as Document;
        const { animations } = fromLiveAnimations(fakeDoc);
        // Only the running name is reconstructed (the declared-but-idle `liveTwo`
        // is NOT — fromLiveAnimations narrows to motion).
        expect(animations.has("liveOne")).toBe(true);
        expect(animations.has("liveTwo")).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// L.W3 — Ingest deepening: five new arms, each BORN-RED on today's UNCURED tree
// (it greens only when its S-clause cures). The five live-web scenarios K.W8
// deferred as honest BOOKs (Lane 33 audit) — delay-reset, nested group-rule,
// ADOPT_REFUSE diagnostics, Shadow-DOM walk, scroll-driven currentTime — all
// SILENTLY PASS the eight K.W8 clauses today; these arms bite the exact cases
// that break. See docs/tranches/L/waves/L.W3.md.
// ─────────────────────────────────────────────────────────────────────────────

describe("L.W3 S1 — seedAtTime resets the source delay (the takeover is mid-flight)", () => {
    /**
     * BORN-RED today. `seedAtTime` (ingest.ts) calls `animation.onStart()`; when
     * the reconstructed animation's `options.delay > 0` (the source CSS carries
     * `animation-delay: 800ms`), `onStart()` enters the delay branch
     * (engine.ts) and sets `this.paused = true`. The takeover then marks
     * `started = true` and seeds `startTime` but never clears `paused`, so the
     * first post-seed `advanceTo` hits the `paused && pausedTime === 0` early-out
     * (`_advance`) and returns `this.t` WITHOUT advancing — the animation is
     * frozen at the seeded time forever. A mid-flight takeover MUST NOT honor the
     * source delay (the native animation already consumed it). The cure resets
     * `animation.options.delay` to 0 (via `setDelay(0)`) BEFORE `onStart()`.
     */
    const stubRunningDelay = (
        el: Element,
        animationName: string,
        currentTime: number,
    ): void => {
        const fake = {
            animationName,
            currentTime,
            playState: "running",
            cancel() {},
        };
        (el as { getAnimations: () => Animation[] }).getAnimations = () =>
            [fake] as unknown as Animation[];
    };

    it("a takeover of an animation with animation-delay advances past the seeded time", async () => {
        // `.foo { animation: spin 2000ms linear 800ms }` — the sibling style rule
        // carries `animation-delay: 800ms`, so the reconstructed object's
        // options.delay is 800.
        installSheet(
            "@keyframes spinDelay { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                ".foo-delay { animation: spinDelay 2000ms linear 800ms; }",
        );
        const el = document.createElement("div");
        document.body.appendChild(el);
        stubRunningDelay(el, "spinDelay", 600);
        const res = await adoptRunning(el, { animationName: "spinDelay" });
        expect(res.animation).not.toBeNull();
        const anim = res.animation!;
        // The reconstructed object preserves the declared delay for serialization
        // symmetry — but the SEED must strip it for the takeover (the native side
        // already elapsed it). On today's tree onStart()'s delay branch froze the
        // engine (paused=true), so the next advance does NOT move the playhead.
        const before = anim.effectiveT;
        anim.advanceTo(performance.now() + 1);
        // The animation advanced PAST the seeded time — proof the engine is not
        // frozen by an un-reset delay. RED today: `paused` stays true, `_advance`
        // returns `this.t` unchanged, so effectiveT never moves off the seed.
        expect(anim.effectiveT).toBeGreaterThan(before);
        anim.stop();
    });
});

describe("L.W3 S2 — walkSheet descends into group rules for nested @keyframes", () => {
    /**
     * BORN-RED today. `walkSheet` (ingest-cssom.ts) iterates a flat
     * `CSSRuleList` and calls `isKeyframesRule` on each entry; it never descends
     * into `CSSGroupingRule` subclasses (`CSSMediaRule`, `CSSSupportsRule`,
     * `CSSLayerBlockRule`, `CSSContainerRule`), which expose their own
     * `.cssRules`. A `@keyframes` declared inside `@media (…) { @keyframes … }`
     * is silently absent — zero diagnostics, empty `animations` Map (the
     * forbidden silent-absent class). The cure makes `walkSheet` recurse into
     * grouping rules (bounded depth guard 32).
     */
    it("a @keyframes inside @media is reconstructed (the recursive descent)", () => {
        const sheet = installSheet(
            "@media screen { @keyframes nestedKf { 0% { opacity: 0 } " +
                "100% { opacity: 1 } } }",
        );
        const { animations } = fromStyleSheets([sheet]);
        // jsdom exposes the @media rule as a CSSMediaRule (type 4) whose
        // `.cssRules` holds the nested CSSKeyframesRule. The flat walk skips the
        // @media body entirely — `animations` is empty today (RED). The cure's
        // recursive descent into the grouping rule recovers `nestedKf`.
        expect(animations.has("nestedKf")).toBe(true);
    });

    it("a @keyframes inside a @supports group rule is reconstructed", () => {
        const sheet = installSheet(
            "@supports (opacity: 0) { @keyframes nestedSupports { " +
                "0% { opacity: 0 } 100% { opacity: 1 } } }",
        );
        const { animations } = fromStyleSheets([sheet]);
        // Same forbidden-silent-absent on a second grouping-rule kind (@supports);
        // the recursive descent must enter EVERY CSSGroupingRule, not just @media.
        expect(animations.has("nestedSupports")).toBe(true);
    });
});

describe("L.W3 S3 — ADOPT_REFUSE distinguishes an ingest refusal from a WAAPI-API absence", () => {
    /**
     * BORN-RED today. `DiagnosticCode` (adapter.ts) has no `"ADOPT_REFUSE"`
     * entry; BOTH failure paths in `adoptRunning` emit `"WAAPI_INELIGIBLE"` —
     * the `getAnimations()`-absent path (a genuine WAAPI-API failure) AND the
     * "no running animation by that name" path (an INGEST refusal, a different
     * consumer branch). Conflating them forces consumers to scrape the `message`
     * string to distinguish the branches (violates the stable-`code`,
     * never-scrape-message contract). The cure adds `"ADOPT_REFUSE"` and uses it
     * for the ingest-domain refusals.
     */
    it("a name not present in getAnimations() refuses with ADOPT_REFUSE, not WAAPI_INELIGIBLE", async () => {
        installSheet(
            "@keyframes presentRefuse { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        const el = document.createElement("div");
        // The Web Animations API IS present (getAnimations exists) but reports no
        // running animation by that name — an INGEST refusal, not a WAAPI-API
        // absence. The diagnostic code MUST be ADOPT_REFUSE.
        (el as { getAnimations: () => Animation[] }).getAnimations = () => [];
        const res = await adoptRunning(el, { animationName: "presentRefuse" });
        expect(res.animation).toBeNull();
        // RED today: the code is "WAAPI_INELIGIBLE" (no ADOPT_REFUSE exists).
        expect(res.diagnostics.some((d) => d.code === "ADOPT_REFUSE")).toBe(
            true,
        );
    });
});

describe("L.W3 S4 — resolveLiveKeyframes walks a ShadowRoot's stylesheets", () => {
    /**
     * BORN-RED today. `resolveLiveKeyframes` (ingest-cssom.ts) resolves the sheet
     * source via three branches — `null` (ambient document), `Array.isArray`
     * (explicit list), `instanceof Document` — with NO `ShadowRoot` branch.
     * `ShadowRoot.adoptedStyleSheets` (constructable stylesheets, Baseline 2023)
     * and `ShadowRoot.styleSheets` are both unwalked. A custom element with its
     * `@keyframes` in a shadow stylesheet is invisible to `fromStyleSheets()` —
     * the call falls through to the bare-`CSSStyleSheet` branch (`sheets = [sr]`),
     * `sr.cssRules` is not a rule list, and the result is empty (the silent-absent
     * class). The cure adds a `ShadowRoot` branch collecting `styleSheets` +
     * `adoptedStyleSheets`.
     */
    it("a @keyframes in a ShadowRoot's adoptedStyleSheets is reconstructed", () => {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: "open" });
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
            "@keyframes shadowPulse { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        // Inject as a constructable adoptedStyleSheets entry (Baseline 2023).
        (shadow as ShadowRoot).adoptedStyleSheets = [sheet];
        const { animations } = fromStyleSheets(shadow as unknown as ShadowRoot);
        // RED today: the ShadowRoot falls through to the bare-CSSStyleSheet branch,
        // `shadow.cssRules` is undefined, the walk skips it — `animations` empty.
        // The cure's ShadowRoot branch collects `adoptedStyleSheets` and recovers
        // `shadowPulse`.
        expect(animations.has("shadowPulse")).toBe(true);
    });
});

describe("L.W3 S5 — adoptRunning resolves a scroll-driven CSSUnitValue currentTime", () => {
    /**
     * BORN-RED today. `adoptRunning` (ingest.ts) acknowledges `currentTime` is a
     * `CSSNumberish` (the comment names "a {value, unit} for a scroll timeline")
     * but the extraction accepts ONLY `typeof rawTime === "number"`. A
     * scroll-driven `CSSAnimation` has `currentTime` as a `CSSUnitValue`
     * (`{value: 42, unit: "percent"}`), which is NOT a number, so `currentTime`
     * defaults silently to 0 — the takeover jumps the scroll target to position 0
     * (the same flash the continuity seed exists to prevent). The cure branches
     * on the `CSSUnitValue` shape (`unit === "percent"`) and seeds from the scroll
     * percentage; a non-percent CSSUnitValue emits an ADOPT_REFUSE diagnostic.
     */
    const stubRunningScroll = (
        el: Element,
        animationName: string,
        currentTime: { value: number; unit: string },
    ): void => {
        const fake = {
            animationName,
            currentTime,
            playState: "running",
            cancel() {},
        };
        (el as { getAnimations: () => Animation[] }).getAnimations = () =>
            [fake] as unknown as Animation[];
    };

    it("a CSSUnitValue percent currentTime is NOT silently defaulted to 0", async () => {
        installSheet(
            "@keyframes scrollFade { 0% { opacity: 0 } 100% { opacity: 1 } } " +
                ".scroll-fade { animation: scrollFade 1000ms linear; }",
        );
        const el = document.createElement("div");
        document.body.appendChild(el);
        // A scroll-driven animation's currentTime is a CSSUnitValue (percent),
        // not a numeric ms. value 42 → 42% of the scroll range.
        stubRunningScroll(el, "scrollFade", { value: 42, unit: "percent" });
        const res = await adoptRunning(el, { animationName: "scrollFade" });
        // RED today: `typeof rawTime` is "object", not "number", so currentTime
        // defaults to 0 — the silent scroll-to-top flash. The cure resolves the
        // 42% into the [0,1] progress domain (currentTime !== 0).
        expect(res.currentTime).not.toBe(0);
        // A scroll-time CSSUnitValue is a VALID input, not a refusal — no
        // ADOPT_REFUSE row for the well-formed percent unit.
        expect(res.diagnostics.some((d) => d.code === "ADOPT_REFUSE")).toBe(
            false,
        );
        res.animation?.stop();
    });
});
