// SERVED MODEL: claude-opus-5[1m]
/**
 * test/compile/valuejs-contract.test.ts — THE ENTRY-POINT CONTRACT (X.KF.W2,
 * gate **G-W2-6**; the emit-mirror clause of **G-W2-8**).
 *
 * What a consumer is owed by `src/animation/compile/parse-facade.ts`, published
 * once and pinned executably:
 *
 *   1. **WHICH GRAMMAR BELONGS AT WHICH SEAM.** A keyframe selector is read by
 *      the SELECTOR grammar. `parseCssScalar` is a different entry with a
 *      different domain, and the two are not interchangeable — it ADMITS `500%`
 *      and `-20%`, which the selector grammar refuses. The contract states the
 *      answer; the call-site edit belongs to its own unit, and this wave opens
 *      no call site.
 *   2. **THE FROZEN PARSE BOUNDARY.** A façade parse result is deep-frozen in a
 *      frozen envelope: a consumer write is a loud `TypeError`, never a silent
 *      corruption. Mirrors `test/resolve/value4-immutable-resolve.test.ts:43`,
 *      the invariant kf's own resolve lane already preserves.
 *   3. **THE PAYLOAD SHAPE.** The value inside that envelope is a plain
 *      `Readonly` union with NO useful `toString` — `String(selector)` is
 *      `"[object Object]"`. The freeze is why a write is loud; the shape is why
 *      the same object renders as `[object Object]` when nobody writes to it at
 *      all. A contract that states one and not the other publishes half a
 *      clause, so both are here.
 *   4. **THE POSTURES.** Exactly one declared thing happens when a CSS string is
 *      bad, and a call site names WHICH: THROW / ABSORB / SWALLOW / FALLBACK.
 *   5. **THE EMIT MIRROR.** The façade publishes both halves of the declaration
 *      seam — parse AND emit — so a hand-rolled scanner has a delegation target.
 *
 * The test reaches the façade deliberately: this file is the ONE place in
 * `test/` that holds the library by its own seam rather than by the package,
 * because the seam is the subject.
 */
import { describe, expect, it } from "vitest";

// The PACKAGE, held directly — this file keeps its direct grammar edge on
// purpose (it is one of the ten test-side direct consumers the wave censused
// and froze), because clause 0 below is an assertion ABOUT that edge.
import * as valueCss from "@mkbabb/value.js/css";

import * as facade from "../../src/animation/compile/parse-facade";
import {
    absorbParsed,
    orFallback,
    parseCssScalar,
    parseDeclarationBlock,
    parseKeyframeSelector,
    parseStylesheet,
    requireParsed,
    serializeDeclarationBlock,
    swallowParsed,
} from "../../src/animation/compile/parse-facade";

describe("entry-point contract · clause 0 — the façade RE-PUBLISHES, it does not re-implement", () => {
    it("every parse-surface entry is value.js's own binding, by identity", () => {
        const surface = [
            "collectAnimationOptions",
            "collectCustomFunctions",
            "collectKeyframes",
            "collectPropertyDescriptors",
            "collectStyleRules",
            "collectTimelineOptions",
            "parseAnimationRange",
            "parseAnimationTimeline",
            "parseCssScalar",
            "parseCssValues",
            "parseKeyframeSelector",
            "parseStylesheet",
            "parseTimingFunction",
            "serializeTimelineOptions",
        ] as const;
        for (const name of surface) {
            expect(facade[name]).toBe(valueCss[name]);
        }
        // The falsifier this clause exists for: a façade that WRAPPED an entry
        // — normalising here, defaulting there — would be a second grammar
        // wearing the seam's name, and every identity above would break. The
        // seam is a funnel; it mints no grammar.
        expect(surface.length).toBe(14);
    });
});

describe("entry-point contract · clause 1 — which grammar belongs at the seam", () => {
    it("the SELECTOR grammar reads a keyframe selector, and normalizes to [0,1]", () => {
        expect(parseKeyframeSelector("50%")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 0.5 },
        });
        expect(parseKeyframeSelector("from")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 0 },
        });
        expect(parseKeyframeSelector("to")).toMatchObject({
            ok: true,
            value: { kind: "percent", value: 1 },
        });
        expect(parseKeyframeSelector("entry")).toMatchObject({
            ok: true,
            value: { kind: "named", name: "entry" },
        });
        expect(parseKeyframeSelector("exit 100%")).toMatchObject({
            ok: true,
            value: { kind: "named", name: "exit", offset: 1 },
        });
    });

    it("rejects empty and whitespace-only selectors with diagnostics", () => {
        for (const source of ["", "   "]) {
            const result = parseKeyframeSelector(source);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.diagnostics[0].code).toBe(
                    "keyframe_selector_invalid",
                );
            }
        }
    });

    it("rejects malformed and out-of-range selectors", () => {
        for (const source of ["101%", "entry 101%", "bogus", "50px"]) {
            expect(parseKeyframeSelector(source).ok).toBe(false);
        }
    });

    it("`parseCssScalar` is NOT the selector grammar — it admits what the seam must refuse", () => {
        // The two entries disagree on exactly the inputs a selector seam cares
        // about: the scalar grammar has no [0,1] domain, so it accepts a stop
        // that can never be rendered, and the failure then surfaces somewhere
        // else entirely. This is the contract's whole point.
        for (const source of ["500%", "-20%"]) {
            expect(parseCssScalar(source).ok).toBe(true);
            expect(parseKeyframeSelector(source).ok).toBe(false);
        }
        // And the correction the registry records: the scalar entry does NOT
        // reject `from`/`to` either — it reads them as keywords. A cure written
        // against "parseCssScalar rejects from" is written against a false
        // mechanism.
        for (const source of ["from", "to"]) {
            expect(parseCssScalar(source).ok).toBe(true);
        }
    });
});

describe("entry-point contract · clause 2 — the frozen parse boundary", () => {
    it("a façade selector result is FROZEN, envelope and payload", () => {
        const resolved = parseKeyframeSelector("50%");
        expect(Object.isFrozen(resolved)).toBe(true);
        expect(resolved.ok).toBe(true);
        if (resolved.ok) expect(Object.isFrozen(resolved.value)).toBe(true);
    });

    it("a façade stylesheet result is FROZEN to its items", () => {
        const resolved = parseStylesheet("@keyframes a { from { opacity: 0 } }");
        expect(Object.isFrozen(resolved)).toBe(true);
        expect(resolved.ok).toBe(true);
        if (resolved.ok) {
            expect(Object.isFrozen(resolved.value)).toBe(true);
            expect(Object.isFrozen(resolved.value[0])).toBe(true);
        }
    });

    it("a consumer write into a façade result THROWS — it is never a silent no-op", () => {
        const resolved = parseKeyframeSelector("50%");
        expect(resolved.ok).toBe(true);
        if (!resolved.ok) return;
        const selector = resolved.value as { value: number };
        expect(() => {
            selector.value = 0.25;
        }).toThrow(TypeError);
        expect(resolved.value).toMatchObject({ kind: "percent", value: 0.5 });
    });
});

describe("entry-point contract · clause 3 — the payload shape", () => {
    it("the payload has NO useful toString: coercion yields [object Object]", () => {
        const resolved = parseKeyframeSelector("50%");
        expect(resolved.ok).toBe(true);
        if (!resolved.ok) return;
        expect(String(resolved.value)).toBe("[object Object]");
        expect(`${resolved.value}`).toBe("[object Object]");
        // The rendered form comes from a serializer, never from coercion — the
        // structural fields are what a renderer reads.
        expect(resolved.value).toMatchObject({ kind: "percent", value: 0.5 });
    });
});

describe("entry-point contract · clause 4 — the declared postures", () => {
    it("THROW — the caller owns the error, the façade owns the branch", () => {
        expect(
            requireParsed(parseKeyframeSelector("50%"), () => new TypeError()),
        ).toMatchObject({ kind: "percent", value: 0.5 });
        expect(() =>
            requireParsed(
                parseKeyframeSelector("500%"),
                ([issue]) => new TypeError(issue.code),
            ),
        ).toThrow("keyframe_selector_invalid");
    });

    it("ABSORB — a refusal yields the declared empty value and SURFACES its diagnostics", () => {
        const absorbed = absorbParsed(parseStylesheet("@keyframes {"), []);
        expect(absorbed.value).toEqual([]);
        expect(absorbed.issues.length).toBeGreaterThan(0);
    });

    it("SWALLOW — a refusal AND a thrown parse both yield the fallback", () => {
        expect(
            swallowParsed(
                () => parseStylesheet("@keyframes a { from { opacity: 0 } }"),
                (ast) => ast.length,
                -1,
            ),
        ).toBe(1);
        expect(
            swallowParsed(() => parseStylesheet("@keyframes {"), () => 1, -1),
        ).toBe(-1);
        // The R1 class: value.js 4.0.0 THROWS on the empty-argument colour form
        // rather than refusing, which is exactly why ABSORB cannot reach it and
        // SWALLOW can. If this input ever becomes a refusal the assertion still
        // holds — the posture is total either way.
        expect(
            swallowParsed(
                () => parseStylesheet("@keyframes a { from { color: oklch() } }"),
                () => 1,
                -1,
            ),
        ).toBe(-1);
    });

    it("FALLBACK — a refusal becomes the declared value", () => {
        expect(orFallback(parseCssScalar("10px"), undefined)).toMatchObject({
            payload: { type: "number", value: 10, unit: "px" },
        });
        expect(orFallback(parseCssScalar("@@@"), undefined)).toBeUndefined();
    });
});

describe("entry-point contract · clause 5 — the emit mirror (declaration pair)", () => {
    it("parses a bare declaration body through the grammar, name-keyed", () => {
        const parsed = parseDeclarationBlock(
            "--offset: 10px;\nopacity: 0.5;\ntransform: translateX(4px);",
        );
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        expect([...parsed.value.keys()]).toEqual([
            "--offset",
            "opacity",
            "transform",
        ]);
    });

    it("round-trips: serialize(parse(body)) replays the body", () => {
        const body = "--offset: 10px;\nopacity: 0.5;";
        const parsed = parseDeclarationBlock(body);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        expect(serializeDeclarationBlock(parsed.value.values())).toBe(body);
    });

    it("a malformed body REFUSES — it never silently drops what it could not read", () => {
        // The half-parse this pair exists to retire is the hand-rolled scanner
        // that keeps the lines it understood and DELETES the rest (a whole
        // replacement, so a missed line is data loss, not a mis-parse). The
        // façade refuses instead, by measurement: `css_syntax`, including for a
        // body whose FIRST declaration is well-formed.
        for (const body of ["opacity 0.5", "opacity: ;", "--x: 10px;\nbogus"]) {
            const parsed = parseDeclarationBlock(body);
            expect(parsed.ok).toBe(false);
            if (!parsed.ok) {
                expect(parsed.diagnostics[0].code).toBe("css_syntax");
            }
        }
        // An EMPTY body is not malformed — it is an empty map, not a refusal.
        const empty = parseDeclarationBlock("");
        expect(empty.ok).toBe(true);
        if (empty.ok) expect(empty.value.size).toBe(0);
    });
});
