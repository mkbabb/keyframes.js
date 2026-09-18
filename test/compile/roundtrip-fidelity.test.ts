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
 * ── X.KF.W2 G-W2-7 — THE NET COVERS THE FAÇADE ──────────────────────────────
 * The two suites above drive the corpus through the ENGINE
 * (`fromString` → `CSSKeyframesToString`), which reaches value.js's grammar
 * only transitively; nothing in them names the Tier-A seam, so a seam that
 * re-grew a second grammar would not be seen here. The third suite drives the
 * SAME fourteen fixtures through `compile/parse-facade.ts` — the one module
 * under `src/animation/**` that speaks to value.js's grammar — at the SAME
 * fidelity mode the manifest declares for each row, and it is built on the
 * in-tree oracle precedent, `scroll/grammar.ts`'s `roundTripScrollCSS`
 * (`serialize(parse(s))` ≡ `s`), generalised from the scroll grammar to the
 * whole keyframe corpus.
 *
 * Two legs per row:
 *   (a) REPLAY-EQUALITY AT THE SEAM — the façade's declaration pair
 *       (`parseDeclarationBlock` / `serializeDeclarationBlock`) replays each
 *       stop's declarations byte-stably.
 *   (b) THE ROUND TRIP READ BACK THROUGH THE SEAM — fixture → façade →
 *       engine serialize → façade: every animated value survives, stop for
 *       stop, keyed by the parsed selector.
 * The manifest's `roundtrip` column selects the oracle in BOTH legs. The one
 * `epsilon` row keeps the engine arm's own 1e-9 tolerance — the declared
 * value.js oklab handoff is never silently widened to buy a pass, and the
 * manifest's mode column is fixed.
 *
 * This Vitest body owns the corpus-manifest and round-trip checks.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { CSSKeyframesToString } from "../../src/animation/compile/emit/format";
import {
    collectKeyframes,
    parseDeclarationBlock,
    parseStylesheet,
    requireParsed,
    serializeDeclarationBlock,
} from "../../src/animation/compile/parse-facade";

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS = join(HERE, "..", "fixtures", "keyframes");

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

const animation = () =>
    new CSSKeyframesAnimation<any>({ duration: 1000 }, document.createElement("div"));

const authoredKeys = (keys: readonly string[]): string[] =>
    [...new Set(keys.map((key) => key.split(".", 1)[0]!))].sort();

/** The serialized, sorted, flattened midpoint of `interpFrames(0.5)` (= at(0.5)). */
const midpointSig = (a: CSSKeyframesAnimation<any>): string => {
    const r = a.at(0.5);
    return Object.keys(r)
        .sort()
        .map((k) => `${k}=${String(r[k])}`)
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
            const a = animation().fromString(css);
            a.parse();
            // The expected template-frame count (the parsed @keyframes stop count).
            expect(a.templateFrames.length).toBe(fx.frames);
            if (fx.roundtrip === "text") {
                // Computed-unit rows: the midpoint needs a live DOM box, so the
                // AST shape is locked on the flattened DECLARED parsedVars keys.
                const keys = [
                    ...new Set(a.parsedVars.flatMap((m) => Object.keys(m))),
                ].sort();
                expect(keys).toEqual(authoredKeys(fx.keys));
                return;
            }
            // The expected flattened sub-property keys at the midpoint (the
            // normalized AST shape the grammar produces).
            expect(Object.keys(a.at(0.5)).sort()).toEqual(authoredKeys(fx.keys));
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
                const a = animation().fromString(css);

                const once = await CSSKeyframesToString(a);
                // The serialize-from-template claim (I.W0 S2, format.ts): a
                // var()/calc() is already valid CSS and round-trips AUTHORED,
                // never DOM-resolved to a number. BITE: a serializer that
                // resolves (or drops) the computed value loses the token.
                for (const token of fx.verbatim ?? []) {
                    expect(once).toContain(token);
                }

                const b = animation().fromString(kfBlock(once));
                const twice = await CSSKeyframesToString(b);
                // BITE: a reparse that mangles the computed value diverges here.
                expect(twice).toBe(once);
            });
            continue;
        }
        it(`${fx.file} — interpFrames(0.5) survives the round trip (${fx.roundtrip})`, async () => {
            const css = readFileSync(join(CORPUS, fx.file), "utf8");
            const a = animation().fromString(css);
            const before = midpointSig(a);

            const formatted = await CSSKeyframesToString(a);
            // Rows that name `verbatim` tokens (J.W1 SEAM-3): the authored
            // value must appear in the serialized output AS WRITTEN.
            for (const token of fx.verbatim ?? []) {
                expect(formatted).toContain(token);
            }
            const b = animation().fromString(kfBlock(formatted));
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

// ── X.KF.W2 G-W2-7 — the façade arm's instruments ───────────────────────────

/**
 * The per-keyframe easing channel. It is NOT an animated property: value.js
 * lifts an `animation-timing-function` declared inside a stop onto the parsed
 * rule's `timingFunction` (CSS Animations L1 — it eases the interval STARTING
 * at that stop), and the manifest's `keys` lock the ANIMATED set. It is
 * therefore excluded from the animated projection and asserted on its own, as
 * a typed lift, below.
 */
const EASING_CHANNEL = "animation-timing-function";

/** The stop shape the façade hands back, derived from its own published
 *  signature so this file adds no second `@mkbabb/value.js/css` edge (the
 *  `test/` quadrant is censused and frozen — §Bounds LAW-A census A-5). */
type FacadeStop = ReturnType<
    typeof collectKeyframes
>[number]["rule"]["rules"][number];

/** Read a fixture through the seam: value.js's grammar, reached at the ONE
 *  path, under the façade's own THROW posture. */
const facadeBlocks = (css: string): ReturnType<typeof collectKeyframes> =>
    collectKeyframes(
        requireParsed(
            parseStylesheet(css),
            (diagnostics) =>
                new TypeError(
                    `the seam refused a corpus fixture: ${diagnostics[0].code}`,
                ),
        ),
    );

/** A stop's IDENTITY for the comparison below — never CSS. It emits no
 *  selector text (that serializer is MISS-β2's publication decision and
 *  belongs to KF.W8); it keys a Map by the values the grammar already parsed. */
const stopKey = (selector: FacadeStop["selectors"][number]): string =>
    selector.kind === "percent"
        ? `percent:${selector.value}`
        : `${selector.name}:${selector.offset ?? "-"}`;

/** A stop's ANIMATED declarations, name-sorted, through the façade's emit
 *  half. Sorted because CSS gives no significance to the order of distinct
 *  properties in a block — the fidelity subject is the VALUE each property
 *  carries, which is exactly what a dropped channel changes. */
const animatedProjection = (stop: FacadeStop): string =>
    serializeDeclarationBlock(
        [...stop.declarations]
            .filter((declaration) => declaration.name !== EASING_CHANNEL)
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)),
    );

/**
 * Compare two serialized declaration texts at the row's DECLARED fidelity mode
 * — the manifest's own column, never a mode this seat chose. `byte` and `text`
 * rows are BYTE-SAME; the single `epsilon` row is structurally identical and
 * numerically within 1e-9, the SAME tolerance the engine arm above applies.
 * Widening a row to buy a pass is the convicted failure mode (S.W3's
 * re-baseline), and the mode column is fixed at wave-open.
 */
const expectAtMode = (
    after: string,
    before: string,
    mode: Fixture["roundtrip"],
    label: string,
): void => {
    if (mode !== "epsilon") {
        expect(after, label).toBe(before);
        return;
    }
    const nb = numbers(before);
    const na = numbers(after);
    expect(na.length, `${label} (number count)`).toBe(nb.length);
    for (let i = 0; i < nb.length; i++) {
        expect(na[i], `${label} (leaf ${i})`).toBeCloseTo(nb[i]!, 9);
    }
};

describe("X.KF.W2 G-W2-7 — the round-trip net covers the FAÇADE (the Tier-A seam)", () => {
    for (const fx of manifest.fixtures) {
        it(`${fx.file} — the seam reads it: one @keyframes block, the manifest's stops and animated keys, the easing lifted TYPED`, () => {
            const css = readFileSync(join(CORPUS, fx.file), "utf8");
            const blocks = facadeBlocks(css);
            // BITE: a seam that reached a second grammar — or none — cannot
            // return this corpus's structure.
            expect(blocks.length).toBe(1);
            const stops = blocks[0]!.rule.rules;
            expect(stops.length).toBe(fx.frames);

            const animated = [
                ...new Set(
                    stops.flatMap((stop) =>
                        stop.declarations.map((declaration) => declaration.name),
                    ),
                ),
            ]
                .filter((name) => name !== EASING_CHANNEL)
                .sort();
            expect(animated).toEqual(authoredKeys(fx.keys));

            // BITE: a fixture that DECLARES a per-keyframe easing must carry it
            // TYPED on the rule. A regression that left it as raw declaration
            // text would pass the key-set check above and fail here.
            const declaresEasing = stops.some((stop) =>
                stop.declarations.some(
                    (declaration) => declaration.name === EASING_CHANNEL,
                ),
            );
            expect(
                stops.some((stop) => stop.timingFunction !== undefined),
            ).toBe(declaresEasing);
        });

        it(`${fx.file} — the façade replays it and the round trip survives, read back through the seam (${fx.roundtrip})`, async () => {
            const css = readFileSync(join(CORPUS, fx.file), "utf8");
            const before = facadeBlocks(css)[0]!.rule.rules;

            // (a) REPLAY-EQUALITY AT THE SEAM — `roundTripScrollCSS`'s oracle
            // (`serialize(parse(s))` ≡ `s`) over the declaration pair.
            const emitted: string[] = [];
            for (const stop of before) {
                const once = serializeDeclarationBlock(stop.declarations);
                const reparsed = parseDeclarationBlock(once);
                // BITE: the pair refusing its own emission is the seam failing
                // to close — a refusal here is never "the fixture's fault".
                expect(
                    reparsed.ok,
                    `${fx.file}: the declaration pair refused its own emission: ${once}`,
                ).toBe(true);
                if (!reparsed.ok) return;
                const twice = serializeDeclarationBlock(reparsed.value.values());
                expectAtMode(
                    twice,
                    once,
                    fx.roundtrip,
                    `${fx.file} — declaration-pair replay`,
                );
                emitted.push(once);
            }
            // The authored tokens survive the SEAM verbatim (never resolved,
            // never re-spelled) — the engine arm's own clause, at the façade.
            for (const token of fx.verbatim ?? []) {
                expect(emitted.join("\n")).toContain(token);
            }

            // (b) THE ROUND TRIP READ BACK THROUGH THE SEAM: fixture → façade →
            // engine serialize → façade. BITE: a serializer that drops a
            // transform/filter channel changes the value this projection
            // carries, and the row reds at its own declared mode.
            const formatted = await CSSKeyframesToString(
                animation().fromString(css),
            );
            const after = facadeBlocks(kfBlock(formatted))[0]!.rule.rules;

            const project = (stops: readonly FacadeStop[]): Map<string, string> =>
                new Map(
                    stops.flatMap((stop) =>
                        stop.selectors.map(
                            (selector) =>
                                [
                                    stopKey(selector),
                                    animatedProjection(stop),
                                ] as const,
                        ),
                    ),
                );
            const seen = project(before);
            const replayed = project(after);
            // BITE: a dropped or re-keyed stop changes the key set.
            expect([...replayed.keys()].sort()).toEqual([...seen.keys()].sort());
            for (const [key, value] of seen) {
                expectAtMode(
                    replayed.get(key)!,
                    value,
                    fx.roundtrip,
                    `${fx.file} @ ${key}`,
                );
            }
        });
    }
});
