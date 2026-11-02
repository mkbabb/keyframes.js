/**
 * X.KF.W3 G-KF3-4 — arm (B), totality at ingest (COHESION §0hd.1).
 *
 * kf owns no value serializer: every emit site reaches value.js's published
 * `serializeCssValue` through ONE seam, `compile/emit/serialize-value.ts`,
 * whose `!ok` arm raises ONE named invariant (`SerializeInvariantError`,
 * "ingest admitted a value the serializer refuses"). That is a broken
 * invariant, not a user refusal, and this file is the proof the invariant
 * needs:
 *
 *   1. INGEST ADMITS ⇒ SERIALIZE OK, over the fixture corpus
 *      (`test/fixtures/keyframes/` + `test/fixtures/compile/`, every `.css`,
 *      every `CssValue` node at every depth) and over a generated value set
 *      (a seeded grammar of numbers, colours in every space incl. out-of-range
 *      and `none` channels, calls, `if()` conditions and lists).
 *   2. A BYPASS MUTANT — a `CssValue` that never passed ingest — reaches the
 *      invariant, both at the seam and through a real emit path.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serializeCssValue } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { describe, expect, it } from "vitest";
import { serializeDeclaration, serializeStylesheetItem } from "../../src/animation/compile/emit/css-text";
import {
    SerializeInvariantError,
    serializeAdmittedValue,
} from "../../src/animation/compile/emit/serialize-value";
import { parseCssValues, parseStylesheet } from "../../src/animation/compile/parse-facade";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIRS = [
    join(HERE, "../fixtures/keyframes"),
    join(HERE, "../fixtures/compile"),
];

const isCssValue = (node: unknown): node is CssValue => {
    if (node === null || typeof node !== "object") return false;
    const kind = (node as { kind?: unknown }).kind;
    return (kind === "scalar" && "payload" in node)
        || (kind === "call" && "args" in node)
        || (kind === "list" && "items" in node);
};

/** Every `CssValue` node reachable from an ingest result, at every depth. */
const collectValues = (root: unknown, into: CssValue[] = []): CssValue[] => {
    if (root === null || typeof root !== "object") return into;
    if (isCssValue(root)) into.push(root);
    for (const child of Object.values(root)) collectValues(child, into);
    return into;
};

const expectSerializable = (value: CssValue): void => {
    expect(serializeCssValue(value).ok).toBe(true);
    expect(() => serializeAdmittedValue(value)).not.toThrow();
};

describe("ingest admits ⇒ serialize ok — the fixture corpus", () => {
    const files = FIXTURE_DIRS.flatMap((dir) =>
        readdirSync(dir).filter((name) => name.endsWith(".css")).map((name) => join(dir, name)),
    );

    it("the corpus is the one on disk (16 sheets: 14 keyframes + 2 compile)", () => {
        expect(files).toHaveLength(16);
    });

    it.each(files)("%s — every admitted value node serializes, and every item emits", (file) => {
        const parsed = parseStylesheet(readFileSync(file, "utf8"));
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) return;
        const values = collectValues(parsed.value);
        expect(values.length).toBeGreaterThan(0);
        for (const value of values) expectSerializable(value);
        for (const item of parsed.value) expect(() => serializeStylesheetItem(item)).not.toThrow();
    });
});

// A seeded generator (mulberry32) — deterministic, so a RED names its input.
const rng = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const generate = (count: number, seed: number): string[] => {
    const next = rng(seed);
    const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]!;
    const num = (): string => pick([
        "0", "1", "-1", "0.5", "1e3", "-0.001", "360", "1000", "-250", "12.75", "100", "255", "300", "-5",
    ]);
    const channel = (): string => pick([num(), `${num()}%`, "none"]);
    const length = (): string => `${num()}${pick(["px", "em", "rem", "%", "vw", "deg", "turn", "ms", "s", ""])}`;
    const color = (): string => {
        const alpha = pick(["", ` / ${channel()}`]);
        switch (pick(["rgb", "hsl", "hwb", "lab", "lch", "oklab", "oklch", "color", "hex", "named"])) {
            case "rgb": return `rgb(${channel()} ${channel()} ${channel()}${alpha})`;
            case "hsl": return `hsl(${channel()} ${channel()} ${channel()}${alpha})`;
            case "hwb": return `hwb(${channel()} ${channel()} ${channel()}${alpha})`;
            case "lab": return `lab(${channel()} ${channel()} ${channel()}${alpha})`;
            case "lch": return `lch(${channel()} ${channel()} ${channel()}${alpha})`;
            case "oklab": return `oklab(${channel()} ${channel()} ${channel()}${alpha})`;
            case "oklch": return `oklch(${channel()} ${channel()} ${channel()}${alpha})`;
            case "color": return `color(${pick(["srgb", "display-p3", "rec2020", "xyz-d65", "a98-rgb"])} ${channel()} ${channel()} ${channel()}${alpha})`;
            case "hex": return pick(["#fff", "#000000", "#12345678", "#abcd", "#ff0000"]);
            default: return pick(["red", "transparent", "currentcolor", "rebeccapurple", "white"]);
        }
    };
    const leaf = (): string => pick([length, color, () => pick(["auto", "none", "inherit", "ease-in"])])();
    const value = (depth: number): string => {
        if (depth <= 0) return leaf();
        switch (pick(["leaf", "call", "calc", "var", "if", "space", "comma", "slash"])) {
            case "call": return `${pick(["translateX", "rotate", "scale", "blur", "drop-shadow"])}(${value(depth - 1)})`;
            case "calc": return `calc(${length()} + ${length()})`;
            case "var": return `var(--v, ${value(depth - 1)})`;
            case "if": return `if(${pick(["media", "supports", "style"])}(${pick(["min-width", "color", "--p"])}: ${leaf()}): ${value(depth - 1)}; else: ${leaf()})`;
            case "space": return `${value(depth - 1)} ${value(depth - 1)}`;
            case "comma": return `${value(depth - 1)}, ${value(depth - 1)}`;
            case "slash": return `${value(depth - 1)} / ${value(depth - 1)}`;
            default: return leaf();
        }
    };
    return Array.from({ length: count }, () => value(3));
};

describe("ingest admits ⇒ serialize ok — generated values", () => {
    const inputs = generate(800, 0x4b46_5733);

    it("every value the ingest admits serializes (and the set is not vacuous)", () => {
        let admitted = 0;
        for (const input of inputs) {
            const parsed = parseCssValues(input);
            if (!parsed.ok) continue;
            admitted += 1;
            for (const value of collectValues(parsed.value)) expectSerializable(value);
        }
        expect(admitted).toBeGreaterThanOrEqual(inputs.length / 2);
    });
});

describe("a bypass mutant reaches the invariant", () => {
    // Never parsed: a colour leaf with a non-finite channel, built by hand.
    const mutant: CssValue = {
        kind: "scalar",
        payload: { type: "color", value: { space: "rgb", channels: [Number.NaN, 0, 0], alpha: 1 } },
    } as CssValue;

    it("value.js refuses it, and the seam raises the ONE named invariant", () => {
        const refused = serializeCssValue(mutant);
        expect(refused.ok).toBe(false);
        let raised: unknown;
        try {
            serializeAdmittedValue(mutant);
        } catch (error) {
            raised = error;
        }
        expect(raised).toBeInstanceOf(SerializeInvariantError);
        expect((raised as SerializeInvariantError).code).toBe("SERIALIZE_INVARIANT");
        expect((raised as SerializeInvariantError).issue).toEqual({ code: "color_non_finite" });
        expect((raised as Error).message).toContain("ingest admitted a value the serializer refuses");
    });

    it("through a real emit path (the declaration emitter), nested inside a call", () => {
        const wrapped: CssValue = { kind: "call", name: "drop-shadow", args: [mutant] } as CssValue;
        expect(() => serializeDeclaration({ name: "filter", value: wrapped, important: false }))
            .toThrow(SerializeInvariantError);
    });
});
