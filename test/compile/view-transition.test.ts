/**
 * test/compile/view-transition.test.ts — the jsdom (string-level) half of S.F1
 * VT-c: the emitter's OUTPUT SHAPE (the three surfaces, the class cohort, the
 * cross-doc preamble, the PRM block) + the FOUR VT refusals atop the inherited
 * CC-3 four. The BROWSER half (getAnimations() drives the pseudos; the group
 * carries the emitted duration) is the separate `proof:vt-roundtrip` oracle
 * (`test/compile/view-transition-roundtrip.test.ts`) — jsdom has no View Transitions.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { compileToViewTransition } from "../../src/animation/compile/emit/view-transition";

const spring = springTimingFunction({ response: 0.4, dampingFraction: 0.7 });
const mk = (css: string, opts: Record<string, unknown> = {}): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: 350, timingFunction: spring, ...opts });
    a.fromString(css);
    return a;
};

const fade = (dir: "in" | "out") =>
    dir === "out"
        ? mk(`@keyframes x { 0% { opacity: 1; transform: scale(1) } 100% { opacity: 0; transform: scale(0.9) } }`)
        : mk(`@keyframes x { 0% { opacity: 0; transform: scale(1.05) } 100% { opacity: 1; transform: scale(1) } }`);

describe("S.F1 VT-c — the three emission surfaces", () => {
    it("emits old/new @keyframes + shorthand AND the timing-only group override (no animation-name on the group)", async () => {
        const out = await compileToViewTransition({
            scene: { old: fade("out"), new: fade("in") },
        });
        expect(out.eligible).toBe(true);
        expect(out.names).toEqual(["scene"]);
        // old/new: full @keyframes + a shorthand on the pseudo.
        expect(out.css).toMatch(/@keyframes scene-old/);
        expect(out.css).toMatch(/@keyframes scene-new/);
        expect(out.css).toMatch(/::view-transition-old\(scene\)\s*\{[^}]*animation:/);
        expect(out.css).toMatch(/::view-transition-new\(scene\)\s*\{[^}]*animation:/);
        // group: TIMING-ONLY — duration + timing-function, NEVER animation-name.
        const groupBlock = out.css.match(/::view-transition-group\(scene\)\s*\{([^}]*)\}/s)?.[1] ?? "";
        expect(groupBlock).toMatch(/animation-duration:\s*350ms/);
        expect(groupBlock).toMatch(/animation-timing-function:\s*linear\(/);
        expect(groupBlock).not.toMatch(/animation-name/);
    });

    it("group is MANDATORY-by-default; opts.emitGroup:false omits it (the falsifiability lever)", async () => {
        const on = await compileToViewTransition({ scene: { old: fade("out"), new: fade("in") } });
        expect(on.css).toMatch(/::view-transition-group\(scene\)/);
        const off = await compileToViewTransition(
            { scene: { old: fade("out"), new: fade("in") } },
            { emitGroup: false },
        );
        expect(off.css).not.toMatch(/::view-transition-group\(scene\)/);
    });

    it("group timing derives from an explicit group Pick when given", async () => {
        const out = await compileToViewTransition({
            scene: { old: fade("out"), new: fade("in"), group: { duration: 500, timingFunction: spring } },
        });
        expect(out.css).toMatch(/::view-transition-group\(scene\)\s*\{[^}]*animation-duration:\s*500ms/s);
    });

    it("types wrap every rule in :active-view-transition-type(); crossDocument prepends the preamble; PRM appends by default", async () => {
        const out = await compileToViewTransition(
            { scene: { old: fade("out"), new: fade("in") } },
            { types: ["forward", "backward"], crossDocument: true },
        );
        // Prettier may wrap the long selector's `(scene)` onto the next line —
        // assert the type prefix + old pseudo, format-tolerant.
        expect(out.css).toMatch(/:root:active-view-transition-type\(forward, backward\)::view-transition-old\(/);
        expect(out.css).toMatch(/@view-transition\s*\{[^}]*navigation:\s*auto/s);
        expect(out.css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
        expect(out.css).toMatch(/animation:\s*none\s*!important/);
    });

    it("reducedMotion:false suppresses the PRM block", async () => {
        const out = await compileToViewTransition(
            { scene: { new: fade("in") } },
            { reducedMotion: false },
        );
        expect(out.css).not.toMatch(/prefers-reduced-motion/);
    });

    it("a class cohort re-targets the pseudo selector onto .class (uniform-cohort form)", async () => {
        const out = await compileToViewTransition({
            card: { old: fade("out"), new: fade("in"), class: "kf-card" },
        });
        expect(out.css).toMatch(/::view-transition-old\(\.kf-card\)/);
        expect(out.css).toMatch(/::view-transition-group\(\.kf-card\)/);
    });
});

describe("S.F1 VT-c — the four VT refusals (atop the inherited CC-3 four)", () => {
    it("vt-name-collision — two distinct keys collapsing to one CSS ident REFUSE (not a silent rename)", async () => {
        const out = await compileToViewTransition({
            "a.b": { new: fade("in") },
            "a-b": { new: fade("in") },
        });
        expect(out.eligible).toBe(false);
        const reasons = out.refusals.map((r) => r.reason);
        expect(reasons).toContain("vt-name-collision");
        // BOTH colliding keys are named (never a silent rename).
        expect(out.refusals.filter((r) => r.reason === "vt-name-collision")).toHaveLength(2);
    });

    it("vt-snapshot-inapplicable — a layout property on a replaced-content snapshot REFUSES per property", async () => {
        const wide = mk(`@keyframes w { 0% { width: 100px } 100% { width: 200px } }`);
        const out = await compileToViewTransition({ scene: { new: wide } });
        expect(out.eligible).toBe(false);
        expect(out.refusals.map((r) => r.reason)).toContain("vt-snapshot-inapplicable");
        expect(out.refusals[0]!.message).toMatch(/width/);
    });

    it("vt-element-scoped-computed — a container-query unit on the role REFUSES (never reaches the root pseudo)", async () => {
        const cq = mk(`@keyframes c { 0% { transform: translateX(0px) } 100% { transform: translateX(50cqw) } }`);
        const out = await compileToViewTransition({ scene: { new: cq } });
        expect(out.eligible).toBe(false);
        expect(out.refusals.map((r) => r.reason)).toContain("vt-element-scoped-computed");
    });

    it("vt-scroll-grammar — scrollOptions on a VT role has no defined pseudo behavior → REFUSE", async () => {
        const scrolled = fade("in");
        (scrolled as unknown as { scrollOptions: unknown }).scrollOptions = {
            timeline: { kind: "named", name: "--s" },
        };
        const out = await compileToViewTransition({ scene: { new: scrolled } });
        expect(out.eligible).toBe(false);
        expect(out.refusals.map((r) => r.reason)).toContain("vt-scroll-grammar");
    });

    it("a refused role is skipped in the artifact but the transition's other names still emit", async () => {
        const wide = mk(`@keyframes w { 0% { width: 100px } 100% { width: 200px } }`);
        const out = await compileToViewTransition({
            good: { new: fade("in") },
            bad: { new: wide },
        });
        expect(out.eligible).toBe(false);
        expect(out.css).toMatch(/::view-transition-new\(good\)/);
        expect(out.css).not.toMatch(/@keyframes bad-new/);
    });
});
