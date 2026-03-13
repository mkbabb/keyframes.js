import { Animation } from "@src/animation";

export const STORE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const STORE_KEYS = [
    "animation-groups-options-store",
    "animation-groups-control-options-store",
    "asset-manager-state",
] as const;

export const checkAndResetExpiredStore = <T extends { _storeTimestamp?: number }>(
    store: { value: T },
    defaultValue: T,
) => {
    const timestamp = store.value._storeTimestamp;
    if (timestamp && Date.now() - timestamp > STORE_TTL_MS) {
        store.value = { ...defaultValue, _storeTimestamp: Date.now() };
    } else if (!timestamp) {
        store.value._storeTimestamp = Date.now();
    }
};

export const touchTimestamp = <T extends { _storeTimestamp?: number }>(store: {
    value: T;
}) => {
    store.value._storeTimestamp = Date.now();
};

export const deepDefaultStore = (store: any, defaultStore: any) => {
    for (const key in defaultStore) {
        if (store[key] === undefined || store[key] === null) {
            store[key] = defaultStore[key];
        } else if (typeof store[key] === "object") {
            deepDefaultStore(store[key], defaultStore[key]);
        }
    }
};

export const getAnimationSuperKey = (
    superKey: Animation<any> | string | undefined,
    animation: Animation<any> | string | undefined = undefined,
): string => {
    if (superKey) {
        if (typeof superKey === "string") return superKey;
        return superKey.superKey ?? "default";
    }

    if (typeof animation === "string") return animation;
    return animation!.superKey ?? "default";
};
