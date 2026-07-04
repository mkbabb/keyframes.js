export type AssetKind = "rectangle" | "circle" | "text" | "image" | "svg";

export interface AssetTransform {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
}

export interface Asset {
    id: string;
    name: string;
    kind: AssetKind;
    transform: AssetTransform;
    zIndex: number;
    visible: boolean;
    locked: boolean;
    // Kind-specific properties
    backgroundColor?: string;
    borderRadius?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    imageSrc?: string;
    svgContent?: string;
    animationName?: string;
}

export interface AssetManagerState {
    assets: Asset[];
    selectedAssetIds: string[];
    gridSnap: boolean;
    gridSize: number;
}

export const defaultTransform: AssetTransform = {
    x: 100,
    y: 100,
    width: 120,
    height: 120,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
};

export const defaultAssetManagerState: AssetManagerState = {
    assets: [],
    selectedAssetIds: [],
    gridSnap: false,
    gridSize: 16,
};

let _assetId = 0;
export const createAssetId = (): string => `asset-${Date.now()}-${_assetId++}`;

export type HandleType = "tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l" | "rotate";
