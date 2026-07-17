/**
 * Leaf rAF shims + the re-exported value.js math leaves, kept here so the light
 * engines (`SpringProgress`, `SmoothProgress`, `NumericAnimation`,
 * `RAFPlayback`) carry no value.js GRAMMAR edge.
 *
 * THE MATH LEAVES are NO LONGER DUPLICATED (Q.WE2 Arm A — the no-legacy
 * externalize). `clamp`/`scale`/`lerp`/`lerpArray` re-export from value.js's
 * tree-shakeable `@mkbabb/value.js/math` subpath — value.js's OWN canonical
 * copies, not a kf byte-copy. The subpath is `parse-that`-FREE (a 2-module /
 * ~1.4KB graph, 0 CSS-grammar / 0 parse-that / 0 engine modules — VERIFIED by
 * the `proof:boundary` W97 `math-subpath-clean` clause), so consuming it from a
 * LIGHT module pulls NO grammar into the spring-only bundle. The published
 * `dist/keyframes.js` carries `@mkbabb/value.js/math` as a BARE runtime edge
 * (resolved at the consumer, externalized by `vite.config.ts`'s
 * `/^@mkbabb\/value\.js(\/|$)/` predicate — H4 smoke-test: 113B externalized,
 * NOT inlined), and the boundary gate stays GREEN because the W97 allow-list
 * permits the verified-clean subpath on BOTH assertions. The drift guard
 * (`test/leaves-parity.test.ts`) now asserts the re-exported subpath values
 * match the value.js barrel.
 *
 * The rAF shim STAYS local (`requestAnimationFrame`/`cancelAnimationFrame`/
 * `FRAME_RATE`): it is an environment shim, not pure math, so it does not live
 * in `./math`.
 */

// The four math leaves — value.js's canonical copies via the verified-clean,
// grammar-free `@mkbabb/value.js/math` subpath (no kf byte-duplicate).
export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math";

/** 60 fps frame budget in milliseconds — the non-DOM rAF fallback delay. */
const FRAME_RATE = 1000 / 60;

/**
 * rAF shim with a `setTimeout` fallback for non-DOM environments
 * (jsdom / Node), where it returns a `NodeJS.Timeout` rather than a
 * numeric handle. Either suffices as an opaque cancel handle.
 */
export function requestAnimationFrame(callback: FrameRequestCallback) {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }

    let delay = FRAME_RATE;
    let prevT = Date.now();

    return setTimeout(() => {
        const t = Date.now();
        const delta = t - prevT;

        prevT = t;
        delay = Math.max(0, FRAME_RATE - delta);

        callback(t);
    }, delay);
}

/** Cancel a handle from the local `requestAnimationFrame` shim. */
export function cancelAnimationFrame(
    handle: number | ReturnType<typeof setTimeout> | undefined | null,
) {
    if (handle == null) return;

    // A numeric handle from `window.requestAnimationFrame` cancels through
    // the DOM API; a `setTimeout` fallback handle clears as a timer. The
    // shim's two return shapes pair with their two cancel paths.
    if (
        typeof handle === "number" &&
        typeof window !== "undefined" &&
        window.cancelAnimationFrame
    ) {
        return window.cancelAnimationFrame(handle);
    }

    clearTimeout(handle);
}
