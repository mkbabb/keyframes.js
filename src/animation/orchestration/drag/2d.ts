import { Draggable } from "./draggable";
import type { DragOptions } from "./draggable";

/**
 * The 2-D drag sugar — two one-axis {@link Draggable}s composed behind a
 * single `(x, y, vx, vy)` surface. Split out of `draggable.ts` (the 1-D engine)
 * as additive sugar: the engine stays one-dimensional (KISS); this module is
 * the front door that spares every 2-D consumer the two-`Draggable`
 * boilerplate. LIGHT — it imports only `Draggable` + `DragOptions` from
 * `./draggable`, so it carries only the same rootless Value `/math` leaf.
 *
 * The `drag/index.ts` barrel re-exports `drag2D` + `Drag2DHandle` (R.W1 — the
 * barrel owns the unified surface; no flat-sibling relay through `draggable.ts`).
 */

/**
 * The composite handle a {@link drag2D} returns — two one-axis `Draggable`s
 * wired behind a single `(x, y, vx, vy)` subscriber and a unified dispose.
 * Sugar only: the 1-D engine stays 1-D (KISS); this is the front door that
 * spares every 2-D consumer the two-Draggable boilerplate.
 */
export interface Drag2DHandle {
    /** The x-axis `Draggable` (tracks `clientX`). */
    readonly x: Draggable;
    /** The y-axis `Draggable` (tracks `clientY`). */
    readonly y: Draggable;
    /**
     * Current `(x, y)` position. While an axis is dragging this is the live
     * pointer-pinned target; otherwise the spring's settled / in-flight value.
     */
    readonly value: { x: number; y: number };
    /** Current `(vx, vy)` velocity (units/s). */
    readonly velocity: { x: number; y: number };
    /** True when BOTH axes have settled. */
    readonly settled: boolean;
    /**
     * Subscribe to `(x, y, vx, vy)` emissions — fires whenever EITHER axis
     * updates (live drag follow + post-release fling). Returns an unsubscribe
     * handle.
     */
    subscribe(
        fn: (x: number, y: number, vx: number, vy: number) => void,
    ): () => void;
    /** Remove all listeners and dispose both `Draggable`s. */
    dispose(): void;
}

/**
 * Construct a 2-D drag — two one-axis {@link Draggable}s (one per axis), a
 * shared subscriber that emits `(x, y, vx, vy)` whenever either axis updates,
 * and a unified `dispose()`. KISS: the 1-D engine stays 1-D; this is additive
 * sugar that wires the composition the caller would otherwise hand-roll.
 *
 * `options.x` / `options.y` are independent {@link DragOptions} — `bounds`,
 * `rubberBand`, and `snap` pass through PER AXIS (e.g. bound `x` to the
 * viewport width and `y` to its height separately). The `axis` field of each
 * is FORCED (`x` → `"x"`, `y` → `"y"`); any author `axis` is ignored.
 */
export function drag2D(
    element: HTMLElement,
    options?: { x?: DragOptions; y?: DragOptions },
): Drag2DHandle {
    const x = new Draggable({ ...options?.x, axis: "x" });
    const y = new Draggable({ ...options?.y, axis: "y" });
    x.attach(element);
    y.attach(element);

    const subscribers = new Set<
        (x: number, y: number, vx: number, vy: number) => void
    >();

    // Read the live 2-D position: while an axis is dragging the pointer pins
    // the value to the spring's target (the spring tracks it 1:1 under rAF);
    // otherwise the spring's own value (settled / in-flight fling) is the truth.
    const posOf = (d: Draggable): number =>
        d.dragging ? d.spring.target : d.spring.value;

    const emit = (): void => {
        const px = posOf(x);
        const py = posOf(y);
        const vx = x.velocity;
        const vy = y.velocity;
        for (const fn of subscribers) fn(px, py, vx, vy);
    };

    // Bridge both axes' spring emissions into the shared (x, y, vx, vy) fan-out
    // (kept alive for the handle's lifetime — disposed in `dispose`).
    const unsubX = x.subscribe(() => emit());
    const unsubY = y.subscribe(() => emit());

    return {
        x,
        y,
        get value() {
            return { x: posOf(x), y: posOf(y) };
        },
        get velocity() {
            return { x: x.velocity, y: y.velocity };
        },
        get settled() {
            return x.settled && y.settled;
        },
        subscribe(fn) {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
        dispose() {
            subscribers.clear();
            unsubX();
            unsubY();
            x.dispose();
            y.dispose();
        },
    };
}
