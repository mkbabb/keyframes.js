// SERVED MODEL: claude-opus-5[1m]
/**
 * adopt-compiled-renderer.test.ts — X.KF.W5 `.d` · **G-RENDERER**.
 *
 * THE SEAM, not the scene. `adoptCompiled` transplants a throwaway's compiled
 * state whole; the row (C-1, kf-SquareScene L-2) is that it transplants the
 * throwaway's RENDERER with it. One editor round trip — `useKeyframeOps`
 * `updateFromString` builds `new CSSKeyframesAnimation(opts, ...targets)
 * .fromKeyframes(keyframes)` with **no transform** and adopts it — therefore
 * destroys the receiver's custom `transformFunc` silently and permanently for
 * the mount. The gate is written against the SEAM's two animations; naming
 * `SquareScene` here would fail it (the spec's own falsifier), because square is
 * merely the seam's only current consumer.
 *
 * The ruled cure is LIBRARY-side: the renderer belongs to the RECEIVER unless
 * the SOURCE declared one of its own, keyed on `usesDefaultRenderer` — the
 * reference test `engine/css/animation.ts`'s own comment already names.
 *
 * WHERE THE BITE IS, stated because a vacuous gate is this wave's own ruled
 * defect class. The gate's headline wording — *"`usesDefaultRenderer` still
 * false"* — is **vacuous at the un-cured bytes**: `_defaultTransform` is a
 * per-instance field, so a receiver asked about the THROWAWAY's default answers
 * `false` too. Every clause below therefore asserts an identity, a flag or a
 * value the un-cured seam cannot produce; the headline clause rides along, named
 * as the gate's letter and never as its measurement. Measured born-RED against
 * the un-cured file: **5 failed | 1 passed** — the one pass is describe (b),
 * which is a REGRESSION LOCK, not a bite: a source that declared its own
 * renderer must go on being adopted whole, and does.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import type { TransformFunction } from "../../src/animation/constants";

/** A nested authored shape — the leaf an `unflatten` renderer reads. */
type Nested = {
    box: { a: { b: { c: { d: number } } } };
};

const KEYFRAMES_A = {
    "0%": { box: { a: { b: { c: { d: 0 } } } } },
    "100%": { box: { a: { b: { c: { d: 100 } } } } },
} as unknown as Record<string, Partial<Nested>>;

/** The EDITED text's keyframes — a different range, the same var shape. */
const KEYFRAMES_B = {
    "0%": { box: { a: { b: { c: { d: 10 } } } } },
    "100%": { box: { a: { b: { c: { d: 200 } } } } },
} as unknown as Record<string, Partial<Nested>>;

const mount = () => {
    const el = document.createElement("div");
    document.body.append(el);
    return el;
};

/** A receiver carrying a CUSTOM renderer, the shape a scene supplies. */
const buildReceiver = (el: HTMLElement) => {
    const seen: number[] = [];
    const renderer: TransformFunction<Nested> = (vars) => {
        seen.push(vars.box?.a?.b?.c?.d);
    };
    const anim = new CSSKeyframesAnimation<Nested>(
        { duration: 100, delay: 0, useWAAPI: false },
        el,
    ).fromKeyframes(KEYFRAMES_A, renderer);
    return { anim, renderer, seen };
};

/**
 * The editor's recompile, verbatim in shape: options + the SAME targets, the
 * edited keyframes, and NO transform.
 */
const buildEditorRecompile = (el: HTMLElement) =>
    new CSSKeyframesAnimation<Nested>(
        { duration: 100, delay: 0, useWAAPI: false },
        el,
    ).fromKeyframes(KEYFRAMES_B);

describe("G-RENDERER (a) — an editor round trip preserves a custom renderer", () => {
    it("every adopted frame still carries the RECEIVER's renderer, by identity", () => {
        const el = mount();
        const { anim, renderer } = buildReceiver(el);

        anim.adoptCompiled(buildEditorRecompile(el));

        // BITE: the un-cured seam leaves every frame holding the THROWAWAY's
        // `_defaultTransform` — a function the receiver never supplied.
        expect(anim.frames.length).toBeGreaterThan(0);
        for (const frame of anim.frames) {
            expect(frame.transform).toBe(renderer);
        }
        // The gate's literal wording. Vacuous alone (a foreign instance's
        // default answers `false` too); kept because the gate states it.
        expect(anim.usesDefaultRenderer(anim.frames[0]!.transform)).toBe(false);
    });

    it("`unflatten` survives, so the nested leaf reaches the renderer", () => {
        const el = mount();
        const { anim, renderer, seen } = buildReceiver(el);

        anim.adoptCompiled(buildEditorRecompile(el));

        // BITE: the un-cured seam copies `source.unflatten` (false — the
        // throwaway resolved no transform), so the renderer would be handed
        // the FLAT projection even if it survived, and `vars.box.a.b.c.d`
        // would read `undefined` off a `{"box.a.b.c.d": n}` bag.
        expect(anim.unflatten).toBe(true);

        seen.length = 0;
        // The engine's own apply path — the one the rAF frame drives.
        anim.interpFrames(0, true);

        // BITE: un-cured, the receiver's renderer is never called at all.
        expect(seen.length).toBeGreaterThan(0);
        // The adopted RANGE is the edited one — the compiled state IS adopted;
        // it is only the renderer that stays the receiver's.
        expect(seen[0]).toBe(10);
        expect(renderer).toBe(anim.frames[0]!.transform);
    });

    it("the preservation survives a later re-parse (the templates were re-pointed too)", () => {
        const el = mount();
        const { anim, renderer } = buildReceiver(el);

        anim.adoptCompiled(buildEditorRecompile(el));
        anim.parse();

        // BITE: re-pointing only the COMPILED frames leaves the adopted
        // `templateFrames` holding the throwaway's default, and the next
        // `parse()` — a `setDuration`, a `bindTimeline` — re-derives the loss.
        for (const frame of anim.frames) {
            expect(frame.transform).toBe(renderer);
        }
    });
});

describe("G-RENDERER (b) — a source that DECLARED a renderer is still adopted whole", () => {
    it("the source's own renderer wins over the receiver's", () => {
        const el = mount();
        const { anim } = buildReceiver(el);

        const sourceRenderer: TransformFunction<Nested> = () => {};
        const source = new CSSKeyframesAnimation<Nested>(
            { duration: 100, delay: 0, useWAAPI: false },
            el,
        ).fromKeyframes(KEYFRAMES_B, sourceRenderer);

        anim.adoptCompiled(source);

        // The compiled state a caller deliberately built with a renderer keeps
        // it — the cure preserves the receiver's renderer, it does not pin it.
        for (const frame of anim.frames) {
            expect(frame.transform).toBe(sourceRenderer);
        }
        expect(anim.unflatten).toBe(true);
    });
});

describe("G-RENDERER (c) — the default renderer is the RECEIVER's own", () => {
    it("a default-renderer receiver answers `usesDefaultRenderer` true after adopting", () => {
        const el = mount();
        const anim = new CSSKeyframesAnimation<Nested>(
            { duration: 100, delay: 0, useWAAPI: false },
            el,
        ).fromKeyframes(KEYFRAMES_A);

        anim.adoptCompiled(buildEditorRecompile(el));

        // BITE: un-cured, the adopted frames hold the THROWAWAY's
        // `_defaultTransform` — a different object closing over a different
        // target set — so the receiver's own reference test answers FALSE and
        // the WAAPI fast lane refuses the animation for a renderer nobody
        // supplied (`waapi/eligibility.ts`, `compile/emit/entry.ts`).
        for (const frame of anim.frames) {
            expect(anim.usesDefaultRenderer(frame.transform)).toBe(true);
        }
        expect(anim.unflatten).toBe(false);
    });

    it("the default renderer paints the RECEIVER's targets, not the source's", () => {
        const sourceTarget = mount();
        const destinationTarget = mount();

        const source = new CSSKeyframesAnimation<Nested>(
            { duration: 100, delay: 0, useWAAPI: false },
            sourceTarget,
        ).fromKeyframes({
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
        } as never);
        const destination = new CSSKeyframesAnimation<Nested>(
            { duration: 100, delay: 0, useWAAPI: false },
            destinationTarget,
        ).fromKeyframes({
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
        } as never);

        destination.adoptCompiled(source);
        destination.interpFrames(0, true);

        // BITE: the adopted default renderer closes over `source.targets` — the
        // un-cured seam paints the SOURCE's element from the RECEIVER's play.
        expect(destinationTarget.style.opacity).not.toBe("");
        expect(sourceTarget.style.opacity).toBe("");
    });
});
