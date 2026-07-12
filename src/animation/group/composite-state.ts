import type { ValueUnit } from "@mkbabb/value.js";

type CloneableUnit = ValueUnit<unknown> & { clone(): ValueUnit<unknown> };

/** Stable, compositor-owned leaves. Foreign frame arrays are copied, never retained. */
export class CompositeState {
    readonly values: Record<string, unknown> = {};
    private keys: string[] = [];
    private readonly epochs: Record<string, number> = Object.create(null) as Record<string, number>;
    private epoch = 0;

    configure(keys: string[]): void {
        const next = new Set(keys);
        for (const key of this.keys) {
            // Structural reconfiguration is outside the frame hot path; drop
            // keys that no longer belong to the declared union so serializers
            // never observe a stale field after layer removal.
            if (!next.has(key)) delete this.values[key];
        }
        this.keys = keys;
    }

    clear(): void {
        // Advance the contributed epoch instead of deleting properties. The
        // compositor's grouped object therefore keeps its fast-property shape
        // across disabled-layer toggles and other frame-local absences.
        this.epoch++;
    }

    copy(key: string, incoming: unknown): unknown {
        this.epochs[key] = this.epoch;
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
                // Unit identity is part of a leaf's meaning. A mismatched-unit
                // refusal may replace a px carrier with a % incoming value;
                // copying only `.value` would silently retain the old unit.
                if ("unit" in source && "unit" in target && source.unit !== target.unit) {
                    owned[index] =
                        source && typeof source.clone === "function"
                            ? (source as CloneableUnit).clone()
                            : source;
                } else {
                    target.value = source.value;
                }
            } else {
                owned[index] = source;
            }
        }
        return owned;
    }

    pruneInactive(): void {
        for (const key of this.keys) {
            if (this.epochs[key] !== this.epoch) this.values[key] = undefined;
        }
    }
}
