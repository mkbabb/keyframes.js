// SERVED MODEL: claude-opus-5[1m]
/**
 * test/orchestration/stagger-doc-example.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-STAGGER-DOC leg 1** (row B-4 ≡ KF-EST-5's library arm).
 *
 * THE DEFECT: the CANONICAL example in `stagger.ts`'s own module docblock — the
 * one a reader copies — did not typecheck, and had not since `AnimationGroup`'s
 * input type was carved. It passed `{ animation, options: { delay } }` into a
 * VARIADIC constructor, and `AnimationGroupInput` is `KeyframesAnimation | {
 * animation, layer? }`: no `options` field exists on it, and the constructor
 * never took an array. `split-text.ts`'s header carried the identical shape.
 *
 * THE GATE'S INSTRUMENT IS THE COMPILER, and its falsifier is "fails if the
 * example is 'fixed' by deleting it" — so both docblock examples are LIFTED HERE
 * VERBATIM and compiled: `npx tsc --noEmit -p tsconfig.test.json` reaches
 * `test/` (leg 2 of the repo's own `check`), where `tsconfig.lib.json` —
 * `include: ["src/"]` — never could, so a fixture under it would have been a
 * gate that cannot fail.
 *
 * The cure is "the docs describe the type", NOT "the type gains the field":
 * B-4's group-rewrite cure is SEVERED by the cure-separation law and this wave
 * does not un-sever it. Per-child delay rides the CHILD, which is where the
 * group already reads it (`toWAAPIOptions`: `delay: opts.delay`) — and leg 2
 * (`group-viability.test.ts`) measures what that actually buys.
 */
import { describe, expect, it } from "vitest";
import { AnimationGroup } from "../../src/animation/group";
import { KeyframesAnimation } from "../../src/animation/engine";
import { stagger } from "../../src/animation/orchestration/stagger";
import { splitText } from "../../src/animation/orchestration/split-text";

/** Stand-in for the docblock's `fadeIn` — any child animation compiles the same. */
function fadeIn(el: HTMLElement): KeyframesAnimation<{ opacity: number }> {
    const anim = new KeyframesAnimation<{ opacity: number }>({
        duration: 300,
        useWAAPI: false,
    });
    anim.setTargets(el);
    anim.addFrame(0, { opacity: 0 });
    anim.addFrame(100, { opacity: 1 });
    return anim.parse();
}

const fadeUp = fadeIn;

describe("the stagger docblock example compiles AND runs (G-STAGGER-DOC leg 1)", () => {
    it("`stagger.ts`'s canonical example, verbatim", () => {
        const items = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div"),
        ];

        // ── the docblock example ────────────────────────────────────────────
        const delay = stagger(items.length, { each: 50, from: "center" });
        const group = new AnimationGroup(
            ...items.map((el, i) => fadeIn(el).setDelay(delay(i, items.length))),
        );
        // ────────────────────────────────────────────────────────────────────

        const delays = Object.values(group.animations).map(
            (entry) => entry.animation.options.delay,
        );
        expect(delays).toEqual(delay.delays(items.length));
        // `from: "center"` — the middle child leads, the edges follow.
        expect(delays[1]).toBe(0);
        expect(delays[0]).toBe(delays[2]);
    });

    it("`split-text.ts`'s header example, verbatim", () => {
        const el = document.createElement("div");
        el.textContent = "Select an animation";
        document.body.appendChild(el);

        // ── the docblock example ────────────────────────────────────────────
        const split = splitText(el, { by: "word" }); // a11y on by default
        const group = new AnimationGroup(
            ...split.fragments.map((frag, i) =>
                fadeUp(frag).setDelay(split.stagger(i)),
            ),
        );
        // ────────────────────────────────────────────────────────────────────

        expect(Object.keys(group.animations).length).toBe(3);
        expect(
            Object.values(group.animations).map(
                (entry) => entry.animation.options.delay,
            ),
        ).toEqual(split.delays);
    });

    it("the shape the examples USED to carry is still not a group input", () => {
        // The falsifier's other half: this records WHY the examples changed, so
        // a later seat cannot "restore" them believing the type grew a field.
        // Both halves of the old shape are pinned, because each fails for its
        // own reason and a fixture that pinned only one would let the other back.
        // COMPILED, NEVER EXECUTED: the verdict here is the compiler's. And it
        // must not run — the array form does not merely fail to typecheck, it
        // THROWS (`TypeError: Cannot read properties of undefined (reading
        // 'frames')` inside the constructor, measured), which is what the
        // canonical example would have done to the reader who copied it.
        const neverRun = (): void => {
            const el = document.createElement("div");

            // @ts-expect-error — the constructor is VARIADIC; an array is not an input.
            new AnimationGroup([fadeIn(el)]);

            // @ts-expect-error — `AnimationGroupInput` has `layer?`, never `options`.
            new AnimationGroup({ animation: fadeIn(el), options: { delay: 50 } });
        };

        expect(typeof neverRun).toBe("function");
    });
});
