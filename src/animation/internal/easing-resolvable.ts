import type { TimingFunction, TimingFunctionNames } from "../constants";

/** Identity easing — the value.js-free fallback used before a named easing resolves. */
const identity: TimingFunction = (t: number) => t;

/**
 * One shared resolver for the string-easing-name boundary seam.
 *
 * keyframes' light engines (`NumericAnimation`, `ElementMorph`, the
 * `Timeline` family) accept easing as EITHER a callable `TimingFunction`
 * (value.js-free, used directly) OR a string easing *name* from value.js's
 * registry. A name can only be resolved through the heavy engine — value.js
 * owns the easing registry — so resolution rides the dynamic
 * `import("../engine")` boundary: the ONLY value.js edge, taken once,
 * lazily, when a named easing is actually used.
 *
 * This collapses the formerly hand-rolled copies of that dance (one in
 * `numeric.ts`, one in `timeline.ts`; `morph.ts` delegates to `numeric`)
 * into a single contract:
 *
 *   - **callable easing** → resolved synchronously at construction; `.fn` is
 *     the callable, `.ready()` is a no-op, nothing is imported.
 *   - **string name** → `.fn` is the identity fallback until resolution lands.
 *     Resolution is kicked off EAGERLY in the constructor (fire-and-forget),
 *     so by the first `.play()` / the next frame it is almost always already
 *     resolved. `.ready()` awaits it for the rare consumer that needs the
 *     eased value on the very first synchronous `.at()`.
 *
 * Value.js-free: this module imports value.js NOWHERE statically — only the
 * dynamic `import("../engine")` inside `ready()` reaches it, so a light-only
 * consumer's static graph never pulls value.js. (`import type` above is
 * erased under `verbatimModuleSyntax`.)
 */
export class EasingResolvable {
    private _fn: TimingFunction;
    private _pendingName: TimingFunctionNames | null = null;
    private _ready: Promise<void> | null = null;
    private readonly _onResolved: ((fn: TimingFunction) => void) | undefined;
    private _warned = false;

    /**
     * @param easing      callable `TimingFunction`, string easing *name*, or omitted (identity).
     * @param onResolved  invoked once when a pending name resolves — for consumers
     *                    that cache the easing by value (e.g. `NumericAnimation`
     *                    rebuilds its segments). Consumers that read `.fn` live
     *                    each frame (e.g. `Timeline`) need no callback.
     */
    constructor(
        easing: TimingFunction | TimingFunctionNames | undefined,
        onResolved?: (fn: TimingFunction) => void,
    ) {
        this._onResolved = onResolved;

        if (typeof easing === "function") {
            // Callable — used directly. No engine load, value.js-free path.
            this._fn = easing;
        } else if (typeof easing === "string") {
            // String name — identity fallback until resolved through the
            // engine boundary. Eager-resolve now (fire-and-forget) so the
            // named curve lands by the first frame, shrinking the
            // silent-fallback window to a same-tick synchronous `.at()`.
            this._fn = identity;
            this._pendingName = easing;
            void this.ready();
        } else {
            this._fn = identity;
        }
    }

    /** The current easing — the resolved callable, or the identity fallback while a name is pending. */
    get fn(): TimingFunction {
        return this._fn;
    }

    /** True while a string easing name has not yet resolved through the engine. */
    get pending(): boolean {
        return this._pendingName !== null;
    }

    /**
     * Resolve a pending string easing name through the dynamic engine
     * boundary. Memoized — the `await import("../engine")` and
     * `getTimingFunction` lookup run at most once. A no-op (resolved promise)
     * for a callable / omitted easing.
     */
    ready(): Promise<void> {
        if (this._pendingName === null) return Promise.resolve();
        if (this._ready) return this._ready;

        const name = this._pendingName;
        // Direct dynamic import of the engine module — the ONLY value.js
        // edge, reached only when a named easing is actually used.
        this._ready = import("../engine").then((engine) => {
            const resolved = engine.getTimingFunction(name);
            if (resolved) {
                this._fn = resolved;
                this._onResolved?.(resolved);
            }
            this._pendingName = null;
        });
        return this._ready;
    }

    /**
     * Dev-only signal for the residual window: a synchronous read of the
     * easing (a stateless `.at()` / `tick()`) while a name is still pending
     * means the caller is interpolating with the identity fallback, not the
     * named curve. Warns ONCE per instance (every-frame noise is useless).
     *
     * Stripped from the published bundle by the production
     * `esbuild.drop: ["console"]`, so it is genuinely dev-only — a
     * browser-timing degradation hint, not a library-internal contract
     * violation (those throw). The primary remediation is the eager-resolve
     * above; this only surfaces the rare same-tick synchronous access.
     */
    warnIfPending(context: string): void {
        if (this._pendingName !== null && !this._warned) {
            this._warned = true;
            console.warn(
                `[keyframes] ${context}: easing "${this._pendingName}" is still ` +
                    `resolving — interpolating with the identity fallback until it ` +
                    `lands. \`await .ready()\` before the first synchronous \`.at()\` ` +
                    `to interpolate with the named curve from the first frame.`,
            );
        }
    }
}
