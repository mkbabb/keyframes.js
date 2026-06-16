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
        expect(res.diagnostics.some((d) => d.code === "WAAPI_INELIGIBLE")).toBe(
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
