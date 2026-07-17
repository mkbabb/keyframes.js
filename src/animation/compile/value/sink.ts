import type { Vars } from "../../constants";
import type { InterpSlot } from "../frame/interp-slot";
import type {
    AuthoredSink,
    CompiledValue,
    CompiledVarMap,
    FlatAuthoredValues,
    NestedAuthoredSink,
    ValueWriter,
} from "./ast";
import { serializeCompiledValue } from "./compile";

const isUnitlessNumeric = (value: CompiledValue): boolean =>
    value.template.kind === "slot" &&
    value.slots.length === 1 &&
    value.slots[0]?.kind === "number" &&
    value.slots[0].unit === "";

const descend = (
    root: Record<string, unknown>,
    flatKey: string,
): { parent: Record<string, unknown>; leaf: string } => {
    const parts = flatKey.split(".");
    let parent = root;
    for (let index = 0; index < parts.length - 1; index++) {
        const key = parts[index]!;
        const child = parent[key];
        if (child === null || typeof child !== "object") parent[key] = {};
        parent = parent[key] as Record<string, unknown>;
    }
    return { parent, leaf: parts.at(-1)! };
};

export function buildAuthoredSink<V extends Vars>(
    values: CompiledVarMap,
): AuthoredSink<V> {
    const root: Record<string, unknown> = {};
    const flat: FlatAuthoredValues = {};
    const writers: ValueWriter[] = [];
    for (const [key, value] of Object.entries(values)) {
        const { parent, leaf } = descend(root, key);
        const numeric = isUnitlessNumeric(value);
        const rendered = numeric
            ? (value.slots[0] as Extract<InterpSlot, { kind: "number" }>).current
            : serializeCompiledValue(value);
        parent[leaf] = rendered;
        flat[key] = rendered;
        writers.push({ key, parent, leaf, value, numeric });
    }
    return { root: root as V, flat, writers };
}

export function buildNestedAuthoredSink<V extends Vars>(
    flat: FlatAuthoredValues,
): NestedAuthoredSink<V> {
    const root: Record<string, unknown> = {};
    const writers = Object.keys(flat).map((key) => {
        const { parent, leaf } = descend(root, key);
        parent[leaf] = flat[key];
        return { key, parent, leaf };
    });
    return { root: root as V, flat, writers };
}

export function refreshNestedAuthoredSink<V extends Vars>(
    projection: NestedAuthoredSink<V>,
): void {
    for (const writer of projection.writers) {
        writer.parent[writer.leaf] = projection.flat[writer.key];
    }
}

export function refreshAuthoredSink<V extends Vars>(sink: AuthoredSink<V>): void {
    for (const writer of sink.writers) {
        const rendered = writer.numeric
            ? (writer.value.slots[0] as Extract<InterpSlot, { kind: "number" }>).current
            : serializeCompiledValue(writer.value);
        writer.parent[writer.leaf] = rendered;
        sink.flat[writer.key] = rendered;
    }
}
