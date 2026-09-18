// SERVED MODEL: claude-opus-5[1m]
/**
 * test/_root/public-surface.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-CSSIDENT** (rows B-10 ≡ N-8, B-11 ≡ C-8, B-12 ≡ KF-ET-32).
 *
 * THE PUBLICATION DECISION (§Sequencing S-3), taken as ONE ruling over THREE
 * library names plus the easing registry, and asserted here at both doors a
 * consumer has: `loadAnimationEngine()` and the `./engine` subpath barrel.
 *
 * THE RED IT REPLACES, measured at this wave's open: `cssIdent` —  the library's
 * single CSS-ident normalizer — reached NO published entry. It was re-exported
 * along a two-site INTERNAL chain (`backward/walk.ts` decl → `backward/index.ts`
 * → `compile/emit/index.ts`) and `git grep -c` over `index.ts`, `public.ts` and
 * `load-engine.ts` returned 0/0/0 for it and for `reverseCSSTime` and
 * `serializeTimingFunction` alike — nine pairs, every one zero. The product
 * consequence is N-8: one animation carrying THREE names
 * (`keyframes-style-square-Transform` / `@keyframes square-transform` /
 * `@keyframes Transform`), because the demo hand-rolls `.replace().toLowerCase()`
 * for want of a door onto the normalizer the library already owns.
 *
 * `debounce` and `convertPixelsToCh` are NOT in this oracle: both are declared
 * in `demo/utils/helpers.ts` with ZERO declarations under `src/`, so a library
 * publication assertion over them would be a tautology, not a measurement. They
 * stay the colocation question the wave routes to KF.W8.
 */
import { describe, expect, it } from "vitest";
import { loadAnimationEngine } from "../../src/animation/load-engine";
import * as subpath from "../../src/animation/public";
import * as lightBarrel from "../../src/animation/index";

/** The publication decision's subject, by name. */
const PUBLISHED = [
    "cssIdent",
    "reverseCSSTime",
    "serializeTimingFunction",
    "resolveTimingFunction",
    "timingFunctionEntries",
] as const;

describe("the publication decision (G-CSSIDENT)", () => {
    it("every published name resolves from `loadAnimationEngine()`", async () => {
        const engine = await loadAnimationEngine();
        for (const name of PUBLISHED) {
            expect(engine).toHaveProperty(name);
            expect(engine[name]).toBeDefined();
        }
    });

    it("every published name resolves from the `./engine` subpath barrel", () => {
        for (const name of PUBLISHED) {
            expect(subpath).toHaveProperty(name);
        }
    });

    it("both doors hand out the SAME references — one name, one derivation", async () => {
        const engine = await loadAnimationEngine();
        for (const name of PUBLISHED) {
            expect(engine[name]).toBe(subpath[name]);
        }
    });

    it("the normalizer a consumer reaches is the one the emitter uses", async () => {
        const { cssIdent } = await loadAnimationEngine();
        // The N-8 worked example: the same input a demo hand-roll mangled three
        // ways now has ONE published answer.
        expect(cssIdent("Square Transform")).toBe("Square-Transform");
        expect(cssIdent("3-up")).toBe("a3-up");
        expect(cssIdent("anim.1")).toBe("anim-1");
    });

    it("the two CSS-text serializers behave as published", async () => {
        const { reverseCSSTime, serializeTimingFunction } =
            await loadAnimationEngine();
        expect(reverseCSSTime(250)).toBe("250ms");
        expect(reverseCSSTime(5000)).toBe("5s");
        expect(serializeTimingFunction({ kind: "keyword", name: "ease-in" })).toBe(
            "ease-in",
        );
    });

    it("the easing registry is reachable SYNCHRONOUSLY (KF-ET-32)", async () => {
        const { resolveTimingFunction, timingFunctionEntries } =
            await loadAnimationEngine();

        expect(timingFunctionEntries.length).toBeGreaterThan(0);
        const [name, fn] = timingFunctionEntries[0]!;
        expect(typeof name).toBe("string");
        expect(typeof fn).toBe("function");

        // name → fn with NO await: the hole KF-ET-32 filed (the library's only
        // name→fn door, `resolveEasing`, is async).
        const resolved = resolveTimingFunction("easeOutCubic");
        expect(typeof resolved).toBe("function");
        expect(resolved).toBe(
            timingFunctionEntries.find(([n]) => n === "easeOutCubic")?.[1],
        );
    });

    it("the LIGHT barrel is deliberately NOT the door for them", () => {
        // Declared, not accidental: all five carry value.js by specifier, and
        // the `.` barrel's value.js-free boundary is not spent on a convenience
        // re-export. The gate's GREEN reads `loadAnimationEngine()` OR the
        // exports map, and both are the heavy surface.
        for (const name of PUBLISHED) {
            expect(lightBarrel).not.toHaveProperty(name);
        }
    });
});
