// ─────────────────────────────────────────────────────────────────────────────
// KF-URL (owner, 15 Nov 2026: "Each page should have state defined in the
// URL") — a scene's view state lives in the hash route's query.
//
//   • SHORT, STABLE KEYS, one per fact, a value only when it differs from the
//     default (a default view's URL is the bare route).
//   • DISCRETE changes (a pick: the channel, the surface, a skin, an easing)
//     PUSH a history entry; CONTINUOUS ones (a parameter dragged, the die
//     turned, play/pause) REPLACE the current entry, coalesced to one write
//     after the value rests, so a drag never floods history or the router.
//   • Back / Forward and a copied link apply the URL back onto the state; a
//     key absent from a URL the app wrote means the default.
//   • A key binds only while its scene is the route's: a scene still mounted
//     through a swap neither reads nor writes the next scene's query.
//
// One writer for the whole query (`stage` → `flush`), so two bindings changing
// in one tick make one navigation that carries both.
// ─────────────────────────────────────────────────────────────────────────────

import { inject, onScopeDispose, watch } from "vue";
import type { LocationQuery, Router } from "vue-router";
import { routeLocationKey, routerKey } from "vue-router";

export interface UrlKey<T> {
    /** The query key (short and stable: it is the link's public spelling). */
    key: string;
    /** Read the live value (reactive). */
    get: () => T;
    /** Apply a value read from the URL. */
    set: (value: T) => void;
    /** The value an absent key means. */
    fallback: () => T;
    encode: (value: T) => string;
    /** `undefined` for a value the scene cannot take (the key is ignored). */
    decode: (raw: string) => T | undefined;
    /** `push` for a discrete pick, `replace` for a continuous value; a
     *  function decides per write (a state a press opened pushes, the same
     *  state changed as a side effect replaces). */
    history: "push" | "replace" | (() => "push" | "replace");
    /** When the state puts back the value this key's own push wrote, and that
     *  entry is still the current one, go Back to the entry before instead of
     *  writing over it (closing what a press opened, as Back would). */
    backOnUndo?: boolean;
}

/** How long a continuous value rests before the URL takes it. */
const REPLACE_REST_MS = 160;

let router: Router | null = null;
const pending = new Map<string, string | undefined>();
/** The route path the pending values belong to: a value staged on one scene
 *  is never written onto another's URL (a swap or Back landed first). */
let pendingPath: string | null = null;
let pushOwed = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let microtaskQueued = false;

const sameQuery = (a: LocationQuery, b: LocationQuery) => {
    const ka = Object.keys(a).filter((k) => a[k] != null);
    const kb = Object.keys(b).filter((k) => b[k] != null);
    return ka.length === kb.length && ka.every((k) => String(a[k]) === String(b[k]));
};

function flush(): void {
    clearTimeout(timer);
    timer = undefined;
    microtaskQueued = false;
    if (!router || pending.size === 0) return;
    const current = router.currentRoute.value;
    if (current.path !== pendingPath) {
        pending.clear();
        pushOwed = false;
        return;
    }
    const query: LocationQuery = { ...current.query };
    for (const [k, v] of pending) {
        if (v === undefined) delete query[k];
        else query[k] = v;
    }
    const push = pushOwed;
    pending.clear();
    pushOwed = false;
    if (sameQuery(query, current.query)) return;
    const to = { path: current.path, query };
    void (push ? router.push(to) : router.replace(to)).catch(() => {});
}

/** Stage a patch of the query; a push is written at once (with any pending
 *  replace folded in), a replace after the value rests. */
function stage(patch: Record<string, string | undefined>, history: "push" | "replace"): void {
    const path = router?.currentRoute.value.path ?? null;
    if (path !== pendingPath) {
        pending.clear();
        pushOwed = false;
        pendingPath = path;
    }
    for (const [k, v] of Object.entries(patch)) pending.set(k, v);
    if (history === "push") {
        pushOwed = true;
        if (!microtaskQueued) {
            microtaskQueued = true;
            queueMicrotask(flush);
        }
        return;
    }
    if (pushOwed) return;
    clearTimeout(timer);
    timer = setTimeout(flush, REPLACE_REST_MS);
}

// A replace still resting when the page goes away (a reload, a copied link
// opened elsewhere) is written first.
if (typeof window !== "undefined") window.addEventListener("pagehide", flush);

/** Write any value still resting now (Share copies the address: the link must
 *  be the view on screen, not the view 160 ms ago). */
export const flushUrlState = (): void => flush();

/**
 * Bind `keySet` to the route's query while `scene` is the route's scene (`null`:
 * whatever scene the route names). On bind the URL wins where it carries a
 * key; where it does not, the live value is written (so the address always
 * shows the view). After that, the state and the URL follow each other.
 */
export function useUrlState(
    keySet: UrlKey<any>[] | (() => UrlKey<any>[]),
    opts: { scene: () => string | null; ready?: () => boolean },
): void {
    // A set that follows the scene (a key per channel) is read afresh each time.
    const keyList = typeof keySet === "function" ? keySet : () => keySet;
    // A scene mounted without the app's router (a unit harness) binds nothing.
    const own = inject(routerKey, null);
    const route = inject(routeLocationKey, null);
    if (!own || !route) return;
    router = own;
    const active = () => {
        const scene = opts.scene();
        return scene !== null && route.name === scene && (opts.ready?.() ?? true);
    };

    const want = (k: UrlKey<any>): string | undefined => {
        const enc = k.encode(k.get());
        return enc === k.encode(k.fallback()) ? undefined : enc;
    };

    /** URL → state, for every key whose URL value differs from the live one. */
    const applyFromUrl = () => {
        const refused: Record<string, string | undefined> = {};
        for (const k of keyList()) {
            if (pending.has(k.key)) continue; // our own newer value is on its way
            const raw = route.query[k.key];
            const value = typeof raw === "string" ? k.decode(raw) : k.fallback();
            if (value === undefined) {
                // A value the scene cannot take is not applied; the address is
                // corrected to the view it shows (a replace: nothing was chosen).
                refused[k.key] = want(k);
                continue;
            }
            if (k.encode(value) !== k.encode(k.get())) k.set(value);
        }
        if (Object.keys(refused).length) stage(refused, "replace");
    };

    /** The entry a `backOnUndo` key's push made: its key, and the address it
     *  landed at. Back is taken only while that address is still the one
     *  shown (nothing pushed or replaced since). */
    let undoable: { key: string; at: string } | null = null;
    let undoableOwed: string | null = null;

    /** state → URL, for every key whose live value differs from the URL's. */
    const writeToUrl = () => {
        let push = false;
        const patch: Record<string, string | undefined> = {};
        const pushedKeys: string[] = [];
        for (const k of keyList()) {
            const w = want(k);
            const raw = route.query[k.key];
            const has = typeof raw === "string" ? raw : undefined;
            if (w === has) {
                // Back where the URL is (a tween that ended on it): a value
                // staged on the way is stale.
                pending.delete(k.key);
                continue;
            }
            patch[k.key] = w;
            const history = typeof k.history === "function" ? k.history() : k.history;
            if (history === "push") {
                push = true;
                pushedKeys.push(k.key);
            }
        }
        const keysChanged = Object.keys(patch);
        // Undoing what a press pushed: Back, when nothing else changed and the
        // pushed entry is still the one shown.
        if (
            undoable &&
            keysChanged.length === 1 &&
            keysChanged[0] === undoable.key &&
            !pushedKeys.length &&
            undoable.at === route.fullPath
        ) {
            undoable = null;
            pending.delete(keysChanged[0]!);
            router?.back();
            return;
        }
        const own = keyList().find((k) => k.backOnUndo && pushedKeys.includes(k.key) && patch[k.key] !== undefined);
        undoableOwed = own ? own.key : null;
        if (!own && keysChanged.some((key) => key === undoable?.key)) undoable = null;
        if (keysChanged.length) stage(patch, push ? "push" : "replace");
    };

    let bound = false;
    const bind = () => {
        bound = true;
        // The URL wins where it speaks; the rest of the view is written to it
        // (as a replace: binding is not a navigation).
        applyFromUrl();
        const patch: Record<string, string | undefined> = {};
        for (const k of keyList()) {
            if (typeof route.query[k.key] === "string") continue;
            const w = want(k);
            if (w !== undefined) patch[k.key] = w;
        }
        if (Object.keys(patch).length) stage(patch, "replace");
    };

    const stopActive = watch(
        active,
        (on) => {
            if (on) bind();
            else bound = false;
        },
        { immediate: true, flush: "post" },
    );

    // Back / Forward, a pasted link, or another binding's write.
    const stopRoute = watch(
        () => keyList().map((k) => route.query[k.key]),
        () => {
            // The push a `backOnUndo` key owed has landed: remember its entry.
            if (undoableOwed && typeof route.query[undoableOwed] === "string") {
                undoable = { key: undoableOwed, at: route.fullPath };
                undoableOwed = null;
            } else if (undoable && typeof route.query[undoable.key] !== "string") {
                undoable = null;
            }
            if (bound && active()) applyFromUrl();
        },
    );

    // The state moved: the URL follows.
    const stopState = watch(
        () => keyList().map((k) => k.encode(k.get())),
        () => {
            if (bound && active()) writeToUrl();
        },
    );

    onScopeDispose(() => {
        stopActive();
        stopRoute();
        stopState();
    });
}

// ── Codecs (the links' spellings) ────────────────────────────────────────────

/** A number rounded to `dp` places, spelled without trailing zeros. */
export const num = (dp: number) => ({
    encode: (v: number) => String(Number(v.toFixed(dp))),
    decode: (raw: string) => {
        const v = Number(raw);
        return Number.isFinite(v) ? Number(v.toFixed(dp)) : undefined;
    },
});

/** A list of numbers, comma separated, each rounded to `dp` places. */
export const nums = (dp: number, length?: number) => ({
    encode: (v: readonly number[]) => v.map((x) => String(Number(x.toFixed(dp)))).join(","),
    decode: (raw: string) => {
        const v = raw.split(",").map(Number);
        if (v.some((x) => !Number.isFinite(x))) return undefined;
        if (length !== undefined && v.length !== length) return undefined;
        return v.map((x) => Number(x.toFixed(dp)));
    },
});

/** One of a closed set of words. */
export const oneOf = <T extends string>(allowed: () => readonly T[]) => ({
    encode: (v: T) => v,
    decode: (raw: string) => (allowed().includes(raw as T) ? (raw as T) : undefined),
});

/** A flag: "1" / "0". */
export const flag = {
    encode: (v: boolean) => (v ? "1" : "0"),
    decode: (raw: string) => (raw === "1" ? true : raw === "0" ? false : undefined),
};
