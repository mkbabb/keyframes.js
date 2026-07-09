/**
 * test/compile/entry.test.ts — the jsdom (string-level) half of S.F3 EN-c: the
 * emitter's OUTPUT SHAPE (the three-rule grammar, the asymmetric two lists, the
 * display/overlay allow-discrete on BOTH lists, the oklab endpoint
 * canonicalization) + the SIX entry-specific refusals (atop the 3 inherited). The
 * BROWSER half (the transitions RUN, the exit HOLDS display/overlay) is the
 * separate `proof:entry-roundtrip` oracle — jsdom runs no `@starting-style`.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { compileToEntry } from "../../src/animation/compile/entry";

const spring = springTimingFunction({ response: 0.4, dampingFraction: 0.7 });
const mk = (css: string, opts: Record<string, unknown> = {}): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: 350, timingFunction: spring, ...opts });
    a.fromString(css);
    return a;
};
const enter2 = () =>
    mk(`@keyframes en { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0px) } }`);

describe("S.F3 EN-c — the three-rule grammar", () => {
    it("emits base(closed)+open+@starting-style; display:none on base, display on open, allow-discrete on BOTH lists", async () => {
        const out = await compileToEntry({ ".toast": { enter: enter2() } });
        expect(out.eligible).toBe(true);
        // 1. base/closed rule — the hidden state + display:none + the EXIT list.
        expect(out.css).toMatch(/\.toast\s*\{[^}]*display:\s*none/s);
        // 2. open rule — the shown state + display + the ENTRY list.
        expect(out.css).toMatch(/\.toast\.open\s*\{[^}]*display:\s*block/s);
        // 3. @starting-style — enter's FIRST frame on the open selector.
        expect(out.css).toMatch(/@starting-style\s*\{\s*\.toast\.open/s);
        // display + overlay allow-discrete ride BOTH lists.
        expect((out.css.match(/display 350ms allow-discrete/g) ?? []).length).toBe(2);
        expect((out.css.match(/overlay 350ms allow-discrete/g) ?? []).length).toBe(2);
        // the spring linear() rides the transition verbatim.
        expect(out.css).toMatch(/opacity 350ms\s*linear\(/s);
    });

    it("the default exit is enter-REVERSED (the base rule's hidden state == @starting-style)", async () => {
        const out = await compileToEntry({ ".toast": { enter: enter2() } });
        // base rule = enter's first frame (opacity 0), same as @starting-style.
        expect(out.css).toMatch(/\.toast\s*\{\s*opacity:\s*0/s);
        expect(out.css).toMatch(/@starting-style\s*\{\s*\.toast\.open\s*\{\s*opacity:\s*0/s);
    });

    it("an explicit exit gives asymmetric entry/exit duration on the two lists", async () => {
        const enter = enter2();
        const exit = mk(
            `@keyframes ex { from { opacity: 1 } to { opacity: 0 } }`,
            { duration: 250 },
        );
        const out = await compileToEntry({ ".toast": { enter, exit } });
        // ENTRY list (open rule) = 350ms; EXIT list (base rule) = 250ms.
        expect(out.css).toMatch(/\.toast\.open\s*\{[^}]*opacity 350ms/s);
        expect(out.css).toMatch(/\.toast\s*\{[^}]*opacity 250ms/s);
    });

    it("openSelector variants concatenate onto the base selector; overlay:false suppresses overlay", async () => {
        const pop = await compileToEntry(
            { ".menu": { enter: enter2() } },
            { openSelector: ":popover-open", overlay: false },
        );
        expect(pop.css).toMatch(/\.menu:popover-open/);
        expect(pop.css).not.toMatch(/overlay .*allow-discrete/);
        // display still rides (it is the entry/exit load-bearing property).
        expect(pop.css).toMatch(/display 350ms allow-discrete/);
    });

    it("color endpoints canonicalize to oklab() (the perceptual-oklab INVERSION — no densify, zero stops)", async () => {
        const enter = mk(
            `@keyframes c { from { background-color: crimson } to { background-color: rebeccapurple } }`,
        );
        const out = await compileToEntry({ ".toast": { enter } });
        expect(out.eligible).toBe(true);
        expect(out.css).toMatch(/background-color:\s*oklab\(/);
        // A two-endpoint transition — NO intermediate densified stops.
        expect(out.css).not.toMatch(/@keyframes/);
    });
});

describe("S.F3 EN-c — the six entry-specific refusals (atop the 3 inherited)", () => {
    it("entry-multi-keyframe — >2 declared stops REFUSE (a transition is two-endpoint)", async () => {
        const wiggle = mk(
            `@keyframes w { 0% { opacity: 0 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`,
        );
        const out = await compileToEntry({ ".toast": { enter: wiggle } });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("entry-multi-keyframe");
    });

    it("entry-iteration — iterationCount ≠ 1 REFUSES; but `reverse` is an endpoint swap (NOT a refusal)", async () => {
        const looped = mk(
            `@keyframes en { from { opacity: 0 } to { opacity: 1 } }`,
            { iterationCount: 2 },
        );
        expect((await compileToEntry({ ".toast": { enter: looped } })).refusals[0]!.reason).toBe(
            "entry-iteration",
        );
        // `reverse` swaps endpoints, does NOT refuse.
        const rev = mk(`@keyframes en { from { opacity: 0 } to { opacity: 1 } }`, {
            direction: "reverse",
        });
        const out = await compileToEntry({ ".toast": { enter: rev } });
        expect(out.eligible).toBe(true);
    });

    it("entry-composition — add/accumulate REFUSES (no transition twin, never flattened)", async () => {
        const added = mk(`@keyframes en { from { opacity: 0 } to { opacity: 1 } }`, {
            composite: "add",
        });
        const out = await compileToEntry({ ".toast": { enter: added } });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("entry-composition");
    });

    it("entry-scroll-grammar — scrollOptions on the role REFUSES", async () => {
        const scrolled = enter2();
        (scrolled as unknown as { scrollOptions: unknown }).scrollOptions = {
            timeline: { kind: "named", name: "--s" },
        };
        const out = await compileToEntry({ ".toast": { enter: scrolled } });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("entry-scroll-grammar");
    });

    it("entry-color-space — oklch REFUSES (transitions expose no space control; native oklab is the feature)", async () => {
        const oklch = mk(
            `@keyframes c { from { background-color: crimson } to { background-color: gold } }`,
            { colorSpace: "oklch" },
        );
        const out = await compileToEntry({ ".toast": { enter: oklch } });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("entry-color-space");
    });

    it("entry-easing-twin — a twinless custom closure REFUSES (the linear() densify is the pre-refusal remedy)", async () => {
        const custom = mk(`@keyframes en { from { opacity: 0 } to { opacity: 1 } }`, {
            timingFunction: { fn: (t: number) => t * t * 0.999 },
        });
        const out = await compileToEntry({ ".toast": { enter: custom } });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("entry-easing-twin");
    });
});
