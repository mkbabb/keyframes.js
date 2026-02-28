import { computed, ref } from "vue";
import type { ComputedRef } from "vue";
import { useStorage } from "@vueuse/core";
import {
    createAssetId,
    defaultAssetManagerState,
    defaultTransform,
} from "./assetTypes";
import type {
    Asset,
    AssetKind,
    AssetManagerState,
    AssetTransform,
} from "./assetTypes";

const DEFAULT_NAMES: Record<AssetKind, string> = {
    rectangle: "Rectangle",
    circle: "Circle",
    text: "Text",
    image: "Image",
    svg: "SVG",
};

const DEFAULT_STYLES: Record<AssetKind, Partial<Asset>> = {
    rectangle: { backgroundColor: "#6366f1", borderRadius: 8 },
    circle: { backgroundColor: "#f43f5e", borderRadius: 9999 },
    text: {
        text: "Hello",
        fontSize: 32,
        fontFamily: "Fraunces",
        color: "#1e293b",
        backgroundColor: "transparent",
    },
    image: { backgroundColor: "#e2e8f0" },
    svg: { backgroundColor: "transparent" },
};

export function useAssetManager() {
    let state;
    try {
        state = useStorage<AssetManagerState>(
            "asset-manager-state",
            { ...defaultAssetManagerState },
        );
    } catch {
        state = ref<AssetManagerState>({ ...defaultAssetManagerState });
    }

    const sortedAssets: ComputedRef<Asset[]> = computed(() =>
        [...state.value.assets].sort((a, b) => a.zIndex - b.zIndex),
    );

    const selectedAssets: ComputedRef<Asset[]> = computed(() =>
        state.value.assets.filter((a) =>
            state.value.selectedAssetIds.includes(a.id),
        ),
    );

    const addAsset = (kind: AssetKind, overrides?: Partial<Asset>): Asset => {
        const existingCount = state.value.assets.filter(
            (a) => a.kind === kind,
        ).length;

        const asset: Asset = {
            id: createAssetId(),
            name: `${DEFAULT_NAMES[kind]} ${existingCount + 1}`,
            kind,
            transform: { ...defaultTransform },
            zIndex: state.value.assets.length,
            visible: true,
            locked: false,
            ...DEFAULT_STYLES[kind],
            ...overrides,
        };

        state.value.assets.push(asset);
        state.value.selectedAssetIds = [asset.id];
        return asset;
    };

    const removeAsset = (id: string) => {
        const idx = state.value.assets.findIndex((a) => a.id === id);
        if (idx !== -1) {
            state.value.assets.splice(idx, 1);
            state.value.selectedAssetIds = state.value.selectedAssetIds.filter(
                (sid) => sid !== id,
            );
        }
    };

    const updateAsset = (id: string, updates: Partial<Asset>) => {
        const asset = state.value.assets.find((a) => a.id === id);
        if (asset) {
            Object.assign(asset, updates);
        }
    };

    const updateTransform = (id: string, transform: Partial<AssetTransform>) => {
        const asset = state.value.assets.find((a) => a.id === id);
        if (!asset) return;

        const merged = { ...asset.transform, ...transform };

        if (state.value.gridSnap) {
            const gs = state.value.gridSize;
            merged.x = Math.round(merged.x / gs) * gs;
            merged.y = Math.round(merged.y / gs) * gs;
            merged.width = Math.max(gs, Math.round(merged.width / gs) * gs);
            merged.height = Math.max(gs, Math.round(merged.height / gs) * gs);
        }

        asset.transform = merged;
    };

    const selectAsset = (id: string, additive = false) => {
        if (additive) {
            const idx = state.value.selectedAssetIds.indexOf(id);
            if (idx === -1) {
                state.value.selectedAssetIds.push(id);
            } else {
                state.value.selectedAssetIds.splice(idx, 1);
            }
        } else {
            state.value.selectedAssetIds = [id];
        }
    };

    const deselectAll = () => {
        state.value.selectedAssetIds = [];
    };

    const moveLayer = (id: string, direction: "up" | "down") => {
        const sorted = [...state.value.assets].sort(
            (a, b) => a.zIndex - b.zIndex,
        );
        const idx = sorted.findIndex((a) => a.id === id);
        if (idx === -1) return;

        const swapIdx = direction === "up" ? idx + 1 : idx - 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const tmpZ = sorted[idx]!.zIndex;
        sorted[idx]!.zIndex = sorted[swapIdx]!.zIndex;
        sorted[swapIdx]!.zIndex = tmpZ;
    };

    const reorderAssets = (fromIndex: number, toIndex: number) => {
        const sorted = [...state.value.assets].sort(
            (a, b) => a.zIndex - b.zIndex,
        );
        const [moved] = sorted.splice(fromIndex, 1);
        if (!moved) return;
        sorted.splice(toIndex, 0, moved);
        sorted.forEach((a, i) => {
            a.zIndex = i;
        });
    };

    const duplicateAsset = (id: string): Asset | undefined => {
        const source = state.value.assets.find((a) => a.id === id);
        if (!source) return;

        const clone: Asset = {
            ...JSON.parse(JSON.stringify(source)),
            id: createAssetId(),
            name: `${source.name} copy`,
            transform: {
                ...source.transform,
                x: source.transform.x + 20,
                y: source.transform.y + 20,
            },
            zIndex: state.value.assets.length,
        };

        state.value.assets.push(clone);
        state.value.selectedAssetIds = [clone.id];
        return clone;
    };

    return {
        state,
        sortedAssets,
        selectedAssets,
        addAsset,
        removeAsset,
        updateAsset,
        updateTransform,
        selectAsset,
        deselectAll,
        moveLayer,
        reorderAssets,
        duplicateAsset,
    };
}
