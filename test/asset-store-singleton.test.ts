/**
 * proof:asset-store-singleton — G.W8 gate (clauses 1 + 3).
 *
 * The asset store was the cohort's lone non-singleton: a bare `useStorage`,
 * double-instantiated (playground/App.vue + AssetLayerPanel.vue) → two reactive
 * refs over one localStorage key, correctness load-bearing on an undocumented
 * vueuse same-document-sync internal. G.W8 wraps it in `createGlobalState`
 * (the cohort's own idiom), making the singleton the EXPLICIT contract, and
 * symmetrizes `resetAllStores` with a `_resetAssetManagerStore`.
 *
 * These assertions BITE the pre-G.W8 shape:
 *   - clause 1: `useAssetManager() === useAssetManager()` state-ref identity —
 *     reds on two `useStorage` calls (two distinct refs); a mutation through one
 *     handle is observed through the other WITHOUT a storage round-trip (the
 *     singleton guarantee, not the same-doc-sync accident).
 *   - clause 3: `resetAllStores()` returns the LIVE asset ref to defaults —
 *     reds pre-G.W8 (only the storage key was removed, the live ref stayed stale).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// jsdom under Node 22+ does not expose a usable `localStorage` (Node's
// experimental global shadows jsdom's, and is itself unavailable without
// `--localstorage-file`). The demo's stores read the global `localStorage` (the
// correct browser path); install a minimal in-memory shim so the test exercises
// the singleton/reset contract, not the harness's storage gap.
const memoryStorage = (() => {
    const map = new Map<string, string>();
    return {
        getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
        setItem: (k: string, v: string) => void map.set(k, String(v)),
        removeItem: (k: string) => void map.delete(k),
        clear: () => map.clear(),
        key: (i: number) => [...map.keys()][i] ?? null,
        get length() {
            return map.size;
        },
    } as Storage;
})();
Object.defineProperty(globalThis, "localStorage", {
    value: memoryStorage,
    configurable: true,
});
if (typeof window !== "undefined") {
    Object.defineProperty(window, "localStorage", {
        value: memoryStorage,
        configurable: true,
    });
}

import { useAssetManager } from "@components/custom/asset-manager/useAssetManager";
import { resetAllStores } from "@components/custom/animation-controls/stores/index";

describe("proof:asset-store-singleton — the asset store is a createGlobalState singleton", () => {
    beforeEach(() => {
        resetAllStores();
    });
    afterEach(() => {
        resetAllStores();
    });

    it("useAssetManager() === useAssetManager() — one state ref per key (clause 1)", () => {
        const a = useAssetManager();
        const b = useAssetManager();
        // The singleton guarantee: every caller shares ONE ref identity.
        expect(a.state).toBe(b.state);
        expect(a).toBe(b);
    });

    it("a mutation through one handle is observed through the other — no storage round-trip", () => {
        const a = useAssetManager();
        const b = useAssetManager();

        const before = b.state.value.assets.length;
        a.addAsset("rectangle");
        // Observed SYNCHRONOUSLY through the other handle (shared ref), not via a
        // localStorage write→read same-doc-sync hop.
        expect(b.state.value.assets.length).toBe(before + 1);
        // The derived computed on the other handle reflects it too.
        expect(b.sortedAssets.value.length).toBe(before + 1);
    });

    it("resetAllStores() returns the LIVE asset ref to defaults (clause 3)", () => {
        const a = useAssetManager();
        a.addAsset("circle");
        a.addAsset("text");
        expect(a.state.value.assets.length).toBeGreaterThan(0);

        resetAllStores();

        // The LIVE ref (not just the storage key) is back to defaults — the
        // symmetric `_resetAssetManagerStore` the singleton wrap made possible.
        expect(a.state.value.assets).toEqual([]);
        expect(a.state.value.selectedAssetIds).toEqual([]);
    });
});
