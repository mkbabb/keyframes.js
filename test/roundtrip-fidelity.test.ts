/**
 * G.W16 S3 (TR-4) — the @keyframes parse corpus + the value-fidelity round-trip.
 *
 * The grammar is exercised by inline `fromString` one-liners scattered across
 * ~20 files; no fixture directory of inputs × expected ASTs existed, and
 * `format.test.ts` round-trips assert frame COUNT + property-name preservation —
 * never that the INTERPOLATED VALUE survives parse→format→reparse for a color /
 * multi-arg transform / per-keyframe easing. The re-pin's A2 maximal-munch unit
 * classifier changes how the grammar tokenizes, and a serializer that drops a
 * channel on `format` would diverge SILENTLY past a frame-count check.
 *
 * This corpus closes both: (a) the authoritative parse corpus
 * (`test/fixtures/keyframes/` × the manifest's expected normalized frame
 * structure), and (b) the value-fidelity round-trip — for each row,
 * `fromString(css) → CSSKeyframesToString → fromString (reparse) →
 * interpFrames(0.5)` produces the BYTE-SAME midpoint as the original's
 * `interpFrames(0.5)`. This extends `format.test.ts` from "same frame count" to
 * "same interpolated value" and lifts G.W4's `proof:roundtrip-easing` (the
 * easing channel only) to the full value matrix.
 *
 * RECORD (a verified value.js HANDOFF, surfaced not patched — the test-only
 * charter): the ONE `epsilon` corpus row (chromatic color) does NOT round-trip
 * byte-same — value.js's oklab string serialize→parse drifts the last float
 * digit (~1e-13), propagating to the midpoint. This is a value.js color
 * serialization float-precision artifact (folds into G.WV), NOT a kf serializer
 * channel-drop; every other row IS byte-same, so the channel-drop bite is intact.
 *
 * Re-run by `scripts/proof-roundtrip-fidelity.mjs` (the source-grep + manifest
 * existence half) + this `vitest run` body (the round-trip half).
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { CSSKeyframesToString } from "../src/animation/compile/backward/format";

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS = join(HERE, "fixtures", "keyframes");

interface Fixture {
    file: string;
    frames: number;
    keys: string[];
    /**
     * `byte`/`epsilon` rows lock the interpFrames(0.5) midpoint;
     * `text` rows (J.W1 SEAM-3) carry computed-unit values (var()/calc())
     * that interpolate only against a live DOM box — their oracle is the
     * SERIALIZED TEXT (serialize→reparse→serialize byte-same + the
     * `verbatim` authored tokens present), and `keys` lock the flattened
     * parsedVars shape instead of the midpoint.
     */
    roundtrip: "byte" | "epsilon" | "text";
    /** Authored tokens that must appear VERBATIM in the serialized output. */
    verbatim?: string[];
}
const manifest = JSON.parse(
    readFileSync(join(CORPUS, "manifest.json"), "utf8"),
) as { fixtures: Fixture[] };

/** Just the `@keyframes` block (drop any leading `@property` etc.). */
const kfBlock = (css: string): string => css.slice(css.indexOf("@keyframes"));

/** The serialized, sorted, flattened midpoint of `interpFrames(0.5)` (= at(0.5)). */
const midpointSig = (a: CSSKeyframesAnimation): string => {
    const r = a.at(0.5);
    return Object.keys(r)
        .sort()
        .map((k) => `${k}=${r[k]!.map((v) => String(v)).join(",")}`)
        .join(" ; ");
};

/** Parse a numeric leaf out of a `key=value` signature segment (for epsilon diffs). */
const numbers = (sig: string): number[] =>
    (sig.match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/g) ?? []).map(Number);

describe("G.W16 TR-4 — the parse corpus is authoritative (frame structure lock)", () => {
    it("the corpus directory is non-empty and the manifest covers every .css fixture", () => {
        const cssFiles = readdirSync(CORPUS).filter((f) => f.endsWith(".css"));
        expect(cssFiles.length).toBeGreaterThan(0);
        const covered = new Set(manifest.fixtures.map((f) => f.file));
        // BITE: add a .css fixture without a manifest row (or delete a row) → the
        // corpus is no longer authoritative for that input → this reds.
        for (const f of cssFiles) {
            expect(covered.has(f)).toBe(true);
        }
        expect(manifest.fixtures.length).toBe(cssFiles.length);
    });

    for (const fx of manifest.fixtures) {
        it(`${fx.file} — normalized frame structure matches the manifest AST`, () => {
            const css = readFileSync(join(CORPUS, fx.file), "utf8");
            const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
                css,
            );
            a.parse();
            // The expected template-frame count (the parsed @keyframes stop count).
            expect(a.templateFrames.length).toBe(fx.frames);
            if (fx.roundtrip === "text") {
                // Computed-unit rows: the midpoint needs a live DOM box, so the
                // AST shape is locked on the flattened DECLARED parsedVars keys.
                const keys = [
                    ...new Set(a.parsedVars.flatMap((m) => Object.keys(m))),
                ].sort();
                expect(keys).toEqual(fx.keys);
                return;
            }
            // The expected flattened sub-property keys at the midpoint (the
            // normalized AST shape the grammar produces).
            expect(Object.keys(a.at(0.5)).sort()).toEqual(fx.keys);
            // BITE: delete a fixture's expected `frames`/`keys` from the manifest
            // (or regress the grammar to drop a key) → the corpus claim is no
            // longer falsifiable / the shape diverges → reds (no silent grammar
            // regression).
        });
    }
});

describe("G.W16 TR-4 — the value-fidelity round-trip (parse→format→reparse→interp)", () => {
    for (const fx of manifest.fixtures) {
        if (fx.roundtrip === "text") {
            it(`${fx.file} — serialize→reparse→serialize is byte-stable and the authored tokens survive VERBATIM (text)`, async () => {
                const css = readFileSync(join(CORPUS, fx.file), "utf8");
                const a = new CSSKeyframesAnimation({
                    duration: 1000,
                }).fromString(css);

                const once = await CSSKeyframesToString(a);
                // The serialize-from-template claim (I.W0 S2, format.ts): a
                // var()/calc() is already valid CSS and round-trips AUTHORED,
                // never DOM-resolved to a number. BITE: a serializer that
                // resolves (or drops) the computed value loses the token.
                for (const token of fx.verbatim ?? []) {
                    expect(once).toContain(token);
                }

                const b = new CSSKeyframesAnimation({
                    duration: 1000,
                }).fromString(kfBlock(once));
                const twice = await CSSKeyframesToString(b);
                // BITE: a reparse that mangles the computed value diverges here.
                expect(twice).toBe(once);
            });
            continue;
        }
        it(`${fx.file} — interpFrames(0.5) survives the round trip (${fx.roundtrip})`, async () => {
            const css = readFileSync(join(CORPUS, fx.file), "utf8");
            const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
                css,
            );
            const before = midpointSig(a);

            const formatted = await CSSKeyframesToString(a);
            // Rows that name `verbatim` tokens (J.W1 SEAM-3): the authored
            // value must appear in the serialized output AS WRITTEN.
            for (const token of fx.verbatim ?? []) {
                expect(formatted).toContain(token);
            }
            const b = new CSSKeyframesAnimation({
                duration: 1000,
            }).fromString(kfBlock(formatted));
            const after = midpointSig(b);

            if (fx.roundtrip === "byte") {
                // BITE: a serializer that drops a transform/filter channel on
                // `format` → the round-trip midpoint diverges and this row reds.
                // This is the no-silent-degrade clause: a frame-count check would
                // pass, but the VALUE is wrong → byte-same catches it.
                expect(after).toBe(before);
            } else {
                // The documented value.js oklab-string float-precision HANDOFF:
                // structurally identical, numerically within 1e-9 (the drift is
                // ~1e-13). Still falsifiable — a dropped channel changes the
                // NUMBER COUNT, and a wrong channel diverges past 1e-9.
                const nb = numbers(before);
                const na = numbers(after);
                expect(na.length).toBe(nb.length);
                for (let i = 0; i < nb.length; i++) {
                    expect(na[i]).toBeCloseTo(nb[i]!, 9);
                }
            }
        });
    }
});
