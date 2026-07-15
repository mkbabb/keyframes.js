import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

// Internal-only (T.F23a un-export): consumed solely by isStale() below.
const STORE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const STORE_KEYS = [
    "animation-groups-options-store",
    "animation-groups-control-options-store",
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

export const getAnimationSuperKey = (
    superKey: KeyframesAnimation<any> | string | undefined,
    animation: KeyframesAnimation<any> | string | undefined = undefined,
): string => {
    if (superKey) {
        if (typeof superKey === "string") return superKey;
        return superKey.superKey ?? "default";
    }

    if (typeof animation === "string") return animation;
    return animation!.superKey ?? "default";
};

/**
 * Migrate legacy per-scene buckets to the ONE keyspace (T.B9) and GC orphans, in
 * one pass over an option store's bucket map. Before T.B9 the option stores keyed
 * by a divergent PascalCase super-key constant ("Cube") while the machine keyed by the
 * registry `SceneId` ("cube"); this collapses the two so the stores accept ONLY
 * registry SceneIds. A returning user's `"Cube"` bucket is MOVED to `"cube"` (its
 * lowercase IS a live scene id) rather than orphaned; a bucket whose id is neither
 * a live scene id nor a legacy case of one (a PRUNED scene — compose/morph/
 * motion-path, or the old compose→`"playground"` alias) is dropped. A live
 * `SceneId` bucket always wins over a legacy case-variant.
 */
export const gcAndMigrateStoreBuckets = <T extends { _storeTimestamp?: number }>(
    store: { value: T },
    validSceneIds: Iterable<string>,
): void => {
    const valid = new Set(validSceneIds);
    const src = store.value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    let changed = false;

    if (src._storeTimestamp !== undefined) out._storeTimestamp = src._storeTimestamp;

    // Pass 1 — copy the buckets already keyed by a live SceneId (they win).
    for (const [key, bucket] of Object.entries(src)) {
        if (key === "_storeTimestamp") continue;
        if (valid.has(key)) out[key] = bucket;
        else changed = true; // a non-live key is either migrated or dropped below
    }
    // Pass 2 — migrate a legacy case-variant ("Cube" → "cube") when the live
    // SceneId bucket is absent; drop everything else (an orphaned pruned scene).
    for (const [key, bucket] of Object.entries(src)) {
        if (key === "_storeTimestamp" || valid.has(key)) continue;
        const lower = key.toLowerCase();
        if (valid.has(lower) && out[lower] === undefined) out[lower] = bucket;
    }

    if (changed) store.value = out as T;
};
