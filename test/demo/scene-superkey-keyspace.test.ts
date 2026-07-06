// T.B9 — the ONE keyspace. The store-bucket migration+gc that collapses the
// legacy PascalCase super-key keyspace ("Cube") onto the registry SceneId
// ("cube") and prunes orphaned pruned-scene buckets. Pure — operates on a
// `{ value }` wrapper, so it is unit-testable with no Vue/localStorage.
import { describe, expect, it } from "vitest";
import { gcAndMigrateStoreBuckets } from "../../demo/@/state/storeUtils";

const VALID = ["home", "cube", "amiga", "square", "easing", "spring", "sequence"];

describe("T.B9 — gcAndMigrateStoreBuckets (the one keyspace)", () => {
    it("migrates a legacy PascalCase bucket to the registry SceneId", () => {
        const store = {
            value: {
                _storeTimestamp: 123,
                Cube: { selectedControl: "controls" },
                Amiga: { selectedControl: "keyframes" },
            } as Record<string, unknown>,
        };
        gcAndMigrateStoreBuckets(store, VALID);
        expect(store.value.cube).toEqual({ selectedControl: "controls" });
        expect(store.value.amiga).toEqual({ selectedControl: "keyframes" });
        // The legacy PascalCase keys are gone (not duplicated).
        expect(store.value.Cube).toBeUndefined();
        expect(store.value.Amiga).toBeUndefined();
        // The timestamp survives the rewrite.
        expect(store.value._storeTimestamp).toBe(123);
    });

    it("drops an orphaned pruned-scene bucket (compose/morph/playground)", () => {
        const store = {
            value: {
                _storeTimestamp: 1,
                cube: { a: 1 },
                playground: { a: 2 }, // the old compose alias — no live scene
                Morph: { a: 3 }, // a pruned scene
            } as Record<string, unknown>,
        };
        gcAndMigrateStoreBuckets(store, VALID);
        expect(store.value.cube).toEqual({ a: 1 });
        expect(store.value.playground).toBeUndefined();
        expect(store.value.morph).toBeUndefined();
        expect(store.value.Morph).toBeUndefined();
    });

    it("prefers an existing live-id bucket over a legacy case-variant", () => {
        const store = {
            value: {
                _storeTimestamp: 1,
                cube: { winner: true },
                Cube: { winner: false },
            } as Record<string, unknown>,
        };
        gcAndMigrateStoreBuckets(store, VALID);
        expect(store.value.cube).toEqual({ winner: true });
        expect(store.value.Cube).toBeUndefined();
    });

    it("is a no-op (no rewrite) when every bucket is already a live SceneId", () => {
        const original = {
            _storeTimestamp: 5,
            cube: { a: 1 },
            spring: { a: 2 },
        } as Record<string, unknown>;
        const store = { value: original };
        gcAndMigrateStoreBuckets(store, VALID);
        // Same object identity — nothing changed, so no reactive write is triggered.
        expect(store.value).toBe(original);
    });
});
