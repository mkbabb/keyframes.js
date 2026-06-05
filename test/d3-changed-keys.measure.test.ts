import { unflattenObjectToString } from "@mkbabb/value.js";
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

/**
 * D.W4 D-3 — measure-first artifact for the "changed-keys write" transposition.
 *
 * The transposition would cache the last-written style string per key and skip
 * `setProperty` for keys whose serialized value is unchanged frame-to-frame.
 * Its benefit is therefore bounded by the fraction of keys that DON'T change
 * during interpolation. This re-runnable measurement records that fraction for
 * a representative mixed animation (animating opacity + translateX, plus a held
 * constant `border-width`). The finding informs the WITHHOLD decision (D-3 is
 * landed ONLY on a demonstrated win; this proves the keyframes-local hot-path
 * win is ~0 — every interpolating key changes every frame).
 */
describe("D-3 measure: changed-keys write benefit on the interpolation hot path", () => {
    it("records the unchanged-key fraction across a 60fps interpolation sweep", () => {
        const anim = new CSSKeyframesAnimation({
            duration: 1000,
            useWAAPI: false,
        }).fromString(`
            from { opacity: 0; transform: translateX(0px); border-width: 2px; }
            to   { opacity: 1; transform: translateX(100px); border-width: 2px; }
        `);

        let prev: Record<string, string> | null = null;
        let totalKeys = 0;
        let unchangedKeys = 0;

        // Sweep the INTERIOR of the timeline (exclude the exact endpoints,
        // where an animating value can momentarily repeat its boundary string).
        for (let t = 1; t < 1000; t += 1000 / 60) {
            const vars = anim.at(t / 1000, false);
            const styled = unflattenObjectToString(
                vars as unknown as Record<string, unknown>,
            ) as Record<string, string>;
            if (prev) {
                for (const k in styled) {
                    totalKeys++;
                    if (prev[k] === styled[k]) unchangedKeys++;
                }
            }
            prev = styled;
        }

        const fraction = totalKeys === 0 ? 0 : unchangedKeys / totalKeys;
        // eslint-disable-next-line no-console
        console.log(
            `[D-3 measure] unchanged-key fraction during interpolation = ` +
                `${(fraction * 100).toFixed(1)}% (${unchangedKeys}/${totalKeys}) ` +
                `— the cache-skippable share of per-frame setProperty writes`,
        );

        // The animating keys (opacity, transform) change EVERY interior frame;
        // only a genuinely-held constant is cache-skippable. The keyframes-local
        // changed-keys write thus offers ~no hot-path win — recorded; D-3
        // WITHHELD (the real re-serialization cost lives in value.js, out of
        // inv-16 scope).
        expect(fraction).toBeLessThan(0.5);
    });
});
