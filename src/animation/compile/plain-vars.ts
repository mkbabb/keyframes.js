/**
 * `compile/plain-vars.ts` (T.A6) — the PLAIN authored-shape projection over a
 * flat `ValueUnit[]` leaf map.
 *
 * The "animate any object" seam hands a custom `transform` the animation's
 * interpolated vars. Under value.js ≥ 2.0.1 a frame's `vars`
 * (`unflattenObject(flatVars)`) delivers **array-boxed internal leaves** — a
 * unitless number authored as `rotation.x: 1.5` arrives at the consumer as a
 * one-element `ValueUnit[]`, so `typeof vars.rotation.x === "object"`. A consumer
 * doing arithmetic (`+= v`, `SPHERE_HOME + (v - SPHERE_HOME) * s`) on the boxed
 * leaf yields `NaN` (the amiga mesh vanishes mid-boing, lane 03 F1).
 *
 * This module projects the flat leaf map onto a NESTED object of PLAIN
 * authored-shaped values — **numbers where the author wrote numbers, strings
 * where a unit/color demands one** — written by the SAME interp stride that fills
 * each leaf's `value.value`. The projection is built ONCE (structure is stable
 * across ticks — only `.value` changes), and each frame `refreshPlainProjection`
 * re-reads the live leaves: a numeric leaf writes a bare `number` (a property
 * write, zero-alloc), the units/color residual re-stringifies. The hot,
 * all-numeric transform shape (the amiga rotation/position channels) stays
 * zero-alloc.
 *
 * Both consumer paths use it: the per-animation apply (`engine/interpolate.ts`)
 * and the group SoA compositor output (`group/compositor.ts`) — the group's
 * grouped leaf map is the same `ValueUnit[]` shape, so one projection serves
 * both.
 */
import { isColorUnit, ValueUnit } from "@mkbabb/value.js/units";

export interface PlainLeafWriter {
    /** The nested parent object the leaf lives on. */
    obj: Record<string, unknown>;
    /** The leaf's own (last dot-segment) key on `obj`. */
    key: string;
    /** The live `ValueUnit[]` whose `.value`(s) the interp stride mutates in place. */
    units: ValueUnit[];
    /**
     * True iff the leaf is a single unitless numeric unit → write `.value` (a
     * bare `number`, zero-alloc). False → a units/color/multi-component leaf,
     * projected to its authored STRING each refresh (the units/color residual).
     */
    numeric: boolean;
}

export interface PlainProjection {
    /** The nested plain object a custom `transform` consumes (`plainVars`). */
    root: Record<string, unknown>;
    /** The per-leaf refresh writers, in flat-key order. */
    writers: PlainLeafWriter[];
}

/** A single unitless numeric leaf — projected to its bare `number`. */
const isPlainNumber = (u: unknown): u is ValueUnit<number> =>
    u instanceof ValueUnit &&
    typeof u.value === "number" &&
    (u.unit == null || u.unit === "") &&
    !isColorUnit(u);

/** The authored STRING for a units/color/multi-component leaf. */
const leafToString = (units: ValueUnit[]): string =>
    units.length === 1
        ? String(units[0])
        : units.map((u) => String(u)).join(" ");

/**
 * Descend `root` along a dot-flattened key, creating intermediate objects, and
 * return the leaf's parent object + its last-segment key. Mirrors value.js's
 * `unflattenObject` dot convention (the same shape `frame.vars` is built with),
 * so `rotation.x` nests to `{ rotation: { x } }` and a bare `d` stays top-level.
 */
const descend = (
    root: Record<string, unknown>,
    flatKey: string,
): { obj: Record<string, unknown>; key: string } => {
    if (flatKey.indexOf(".") === -1) return { obj: root, key: flatKey };
    const parts = flatKey.split(".");
    let obj = root;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i]!;
        let next = obj[p];
        if (next == null || typeof next !== "object") {
            next = {};
            obj[p] = next;
        }
        obj = next as Record<string, unknown>;
    }
    return { obj, key: parts[parts.length - 1]! };
};

/**
 * Build the nested plain object + the refresh-writer plan from a FLAT
 * `ValueUnit[]` leaf map (a frame's `flatVars`, or the group's `_grouped`
 * composite). An `undefined` leaf (an unset/uncontributed key) is skipped, so a
 * group projection captures only the keys a child actually contributed.
 */
export const buildPlainProjection = (
    flat: Record<string, ValueUnit[] | undefined>,
): PlainProjection => {
    const root: Record<string, unknown> = {};
    const writers: PlainLeafWriter[] = [];
    for (const flatKey in flat) {
        const units = flat[flatKey];
        if (units === undefined) continue;
        const { obj, key } = descend(root, flatKey);
        const numeric = units.length === 1 && isPlainNumber(units[0]);
        obj[key] = numeric
            ? (units[0] as ValueUnit<number>).value
            : leafToString(units);
        writers.push({ obj, key, units, numeric });
    }
    return { root, writers };
};

/**
 * Refresh every writer's leaf from its live `ValueUnit`(s) — the per-frame
 * stride. Numeric leaves write a bare `number` (zero-alloc); the units/color
 * residual restringifies. The `root` object identity is preserved (mutated in
 * place), so the transform consumer sees the same object every frame.
 */
export const refreshPlainProjection = (proj: PlainProjection): void => {
    const { writers } = proj;
    for (let i = 0; i < writers.length; i++) {
        const w = writers[i]!;
        w.obj[w.key] = w.numeric
            ? (w.units[0] as ValueUnit<number>).value
            : leafToString(w.units);
    }
};
