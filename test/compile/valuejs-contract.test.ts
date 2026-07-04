/**
 * J.W1 S4 (SEAM-2) — the kf-side pin for the LOAD-BEARING value.js
 * empty-input contract.
 *
 * I FINAL §4-A declares `parseCSSValueUnit("") → ValueUnit(0)` LOAD-BEARING:
 * rebuilding `dist` on value.js 0.11.1 (no empty-input fix) reds the live
 * `proof:engine-no-throw-on-play` gate. But the kf selector guard
 * short-circuits empty input BEFORE value.js sees it, so the guard tests
 * prove the GUARD — not the value.js contract. This pin calls
 * `parseCSSValueUnit` DIRECTLY (the `leaves-parity.test.ts` precedent: a kf
 * test that locks kf's CONSUMPTION of a value.js property), so a future
 * value.js empty-input regression reds HERE — fast, named, in `npm test` —
 * not only on the indirect built-dist runtime gate.
 */
import { describe, expect, it } from "vitest";
import { parseCSSValueUnit, ValueUnit } from "@mkbabb/value.js";

describe("value.js consume-edge — the empty-input contract (I FINAL §4-A, LOAD-BEARING)", () => {
    it('parseCSSValueUnit("") returns a typed-empty ValueUnit (value 0), never throws', () => {
        let parsed: ValueUnit | undefined;
        expect(() => {
            parsed = parseCSSValueUnit("");
        }).not.toThrow();
        expect(parsed).toBeInstanceOf(ValueUnit);
        expect(parsed!.value).toBe(0);
    });

    it('parseCSSValueUnit("   ") (whitespace-only) returns the same typed-empty result', () => {
        let parsed: ValueUnit | undefined;
        expect(() => {
            parsed = parseCSSValueUnit("   ");
        }).not.toThrow();
        expect(parsed).toBeInstanceOf(ValueUnit);
        expect(parsed!.value).toBe(0);
    });

    it("positive control: a real value still parses (the pin is not vacuous)", () => {
        const v = parseCSSValueUnit("50%");
        expect(v.value).toBe(50);
        expect(v.unit).toBe("%");
    });
});
