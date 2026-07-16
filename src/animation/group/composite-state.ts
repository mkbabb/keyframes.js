import type {
    AuthoredValue,
    FlatAuthoredValues,
} from "../compile/value-ast";

/** Stable, compositor-owned authored values. */
export class CompositeState {
    readonly values: FlatAuthoredValues = {};
    private keys: string[] = [];
    private readonly epochs: Record<string, number> = Object.create(null) as Record<string, number>;
    private epoch = 0;

    configure(keys: string[]): void {
        const next = new Set(keys);
        for (const key of this.keys) {
            if (!next.has(key)) delete this.values[key];
        }
        this.keys = keys;
    }

    clear(): void {
        this.epoch++;
    }

    copy(key: string, incoming: AuthoredValue): AuthoredValue {
        this.epochs[key] = this.epoch;
        this.values[key] = incoming;
        return incoming;
    }

    mark(key: string): void {
        this.epochs[key] = this.epoch;
    }

    pruneInactive(): void {
        for (const key of this.keys) {
            if (this.epochs[key] !== this.epoch) this.values[key] = undefined;
        }
    }
}
