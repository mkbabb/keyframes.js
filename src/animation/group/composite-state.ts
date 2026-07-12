import type { ValueUnit } from "@mkbabb/value.js";

type CloneableUnit = ValueUnit<unknown> & { clone(): ValueUnit<unknown> };

/** Stable, compositor-owned leaves. Foreign frame arrays are copied, never retained. */
export class CompositeState {
    readonly values: Record<string, unknown> = {};
    private keys: string[] = [];
    private readonly active = new Set<string>();

    configure(keys: string[]): void {
        const next = new Set(keys);
        for (const key of this.keys) {
            if (!next.has(key)) delete this.values[key];
        }
        this.keys = keys;
    }

    clear(): void {
        this.active.clear();
    }

    copy(key: string, incoming: unknown): unknown {
        this.active.add(key);
        if (!Array.isArray(incoming)) {
            this.values[key] = incoming;
            return incoming;
        }
        let owned = this.values[key];
        if (!Array.isArray(owned) || owned.length !== incoming.length) {
            owned = incoming.map((unit) =>
                unit && typeof unit.clone === "function"
                    ? (unit as CloneableUnit).clone()
                    : unit,
            );
            this.values[key] = owned;
            return owned;
        }
        for (let index = 0; index < incoming.length; index++) {
            const source = incoming[index];
            const target = owned[index];
            if (source && target && "value" in source && "value" in target) {
                target.value = source.value;
            } else {
                owned[index] = source;
            }
        }
        return owned;
    }

    pruneInactive(): void {
        for (const key of this.keys) {
            if (!this.active.has(key)) delete this.values[key];
        }
    }
}
