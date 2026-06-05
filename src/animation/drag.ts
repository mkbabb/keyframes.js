import { SpringProgress } from "./spring";
import type { SpringProgressOptions } from "./spring";

/**
 * Drag / fling adapter — the INPUT layer over the already-SOTA spring
 * velocity core. It captures the pointer, tracks the drag as a live
 * `SpringProgress` target on every `pointermove`, samples the pointer
 * velocity over a short window, and on release hands that velocity to the
 * spring's re-seat (`SpringProgress` re-seats the closed-form solution from
 * `(x, v)` so the fling trajectory is continuous with the gesture).
 *
 * LIGHT module: zero static `@mkbabb/value.js` edge. The physics is
 * keyframes-local (the spring solver); this file is pure input plumbing.
 *
 * Framework-free by design — plain `addEventListener` + Pointer Capture
 * with explicit teardown. This is library code, not a Vue demo: a consumer
 * wires the returned `value`/`velocity`/`settled` reads (or `subscribe`)
 * into their own render layer. SSR-safe: construction does not touch the
 * DOM until `attach()`.
 */

/** A drag emission: the spring's current position + velocity. */
export type DragSubscriber = (value: number, velocity: number) => void;

/**
 * The single scalar axis a {@link Draggable} tracks. A 2-D drag composes
 * two `Draggable`s (one per axis) — the engine stays one-dimensional, the
 * caller owns the composition (KISS).
 */
export type DragAxis = "x" | "y";

export interface DragOptions {
    /**
     * Which pointer axis drives the spring target — `clientX` (`"x"`) or
     * `clientY` (`"y"`). Default `"x"`.
     */
    axis?: DragAxis;
    /**
     * Map a raw pointer coordinate (px, in client space) to the spring's
     * value domain. Default identity (track pointer pixels directly). Use
     * e.g. `(px) => px - originPx` to track an offset, or a scale factor
     * for a normalized [0, 1] domain.
     */
    transform?: (clientCoord: number) => number;
    /**
     * The spring the drag drives. Supplies the physics — the fling on
     * release re-seats THIS spring from `(currentValue, releaseVelocity)`.
     * Defaults to a fresh `SpringProgress` with the engine defaults.
     */
    spring?: SpringProgress;
    /**
     * Options for the default spring (ignored when `spring` is supplied).
     */
    springOptions?: Partial<SpringProgressOptions>;
    /**
     * Velocity-sampling window in milliseconds. The release velocity is the
     * average pointer velocity over the last `velocityWindow` ms of moves —
     * a short window tracks flicks, a longer one smooths jitter. Default
     * 100ms.
     */
    velocityWindow?: number;
}

/** One timestamped sample in the rolling velocity window. */
interface PointerSample {
    /** Mapped value-domain coordinate. */
    value: number;
    /** `event.timeStamp` in milliseconds. */
    t: number;
}

const DEFAULT_VELOCITY_WINDOW = 100;

/**
 * A one-axis draggable: pointer-capture follow + release-velocity fling
 * over a `SpringProgress`. The hard physics (a continuous analytic
 * trajectory seeded from the release velocity) is the spring's; this class
 * is the pointer-event plumbing that feeds it.
 *
 * Lifecycle: `attach(element)` binds `pointerdown`; a down captures the
 * pointer and binds `pointermove`/`pointerup` for the gesture's duration;
 * `up` re-seats the spring from `(value, releaseVelocity)` and lets it
 * fling. `detach()` removes every listener and releases capture. The
 * underlying spring is reachable via `.spring` for `.play()` /
 * `.subscribe()` / fling-loop ownership.
 */
export class Draggable {
    /** The spring the drag follows + flings — the physics core. */
    readonly spring: SpringProgress;

    private readonly axis: DragAxis;
    private readonly transform: (clientCoord: number) => number;
    private readonly velocityWindow: number;

    private element: HTMLElement | undefined;
    private capturedPointerId: number | undefined;

    /** Rolling pointer samples for release-velocity estimation. */
    private samples: PointerSample[] = [];

    private subscribers: Set<DragSubscriber> = new Set();
    private springUnsub: (() => void) | undefined;

    // Bound handlers, captured once so add/removeEventListener pair.
    private readonly onPointerDown = (e: PointerEvent): void =>
        this.handleDown(e);
    private readonly onPointerMove = (e: PointerEvent): void =>
        this.handleMove(e);
    private readonly onPointerUp = (e: PointerEvent): void => this.handleUp(e);

    constructor(options?: DragOptions) {
        this.axis = options?.axis ?? "x";
        this.transform = options?.transform ?? ((c) => c);
        this.velocityWindow = options?.velocityWindow ?? DEFAULT_VELOCITY_WINDOW;
        this.spring =
            options?.spring ?? new SpringProgress(options?.springOptions);
    }

    // ── Reads ────────────────────────────────────────────────────────

    /** True while a pointer gesture is in progress (down, not yet up). */
    get dragging(): boolean {
        return this.capturedPointerId !== undefined;
    }

    /** Current spring position. */
    get value(): number {
        return this.spring.value;
    }

    /** Current spring velocity (units/s). */
    get velocity(): number {
        return this.spring.velocity;
    }

    /** True once the post-release fling has settled. */
    get settled(): boolean {
        return this.spring.settled;
    }

    // ── Attach / detach ──────────────────────────────────────────────

    /**
     * Bind the drag to `element`. Adds the `pointerdown` listener; the
     * per-gesture `pointermove`/`pointerup` listeners are added on down and
     * removed on up. Idempotent re-attach detaches the previous element
     * first. Returns a detach handle (calling it is equivalent to
     * {@link detach}).
     */
    attach(element: HTMLElement): () => void {
        this.detach();
        this.element = element;
        element.addEventListener("pointerdown", this.onPointerDown);
        return () => this.detach();
    }

    /**
     * Remove every listener, release any active pointer capture, and end an
     * in-flight gesture. Leaves the spring's current state intact (a fling
     * already in progress continues unless the caller stops it).
     */
    detach(): void {
        const el = this.element;
        if (!el) return;
        el.removeEventListener("pointerdown", this.onPointerDown);
        this.endGesture(el);
        this.element = undefined;
    }

    // ── Subscribe ────────────────────────────────────────────────────

    /**
     * Subscribe to `(value, velocity)` emissions — both the live drag-
     * follow and the post-release fling. Returns an unsubscribe handle.
     * Lazily bridges to the spring's own subscription so the spring stays
     * the single source of truth.
     */
    subscribe(fn: DragSubscriber): () => void {
        this.subscribers.add(fn);
        if (!this.springUnsub) {
            this.springUnsub = this.spring.subscribe((v, vel) => this.emit(v, vel));
        }
        return () => {
            this.subscribers.delete(fn);
            if (this.subscribers.size === 0) {
                this.springUnsub?.();
                this.springUnsub = undefined;
            }
        };
    }

    private emit(value: number, velocity: number): void {
        for (const fn of this.subscribers) fn(value, velocity);
    }

    /**
     * Tear down: detach listeners + dispose the spring. After `dispose()`
     * the draggable is inert.
     */
    dispose(): void {
        this.detach();
        this.springUnsub?.();
        this.springUnsub = undefined;
        this.subscribers.clear();
        this.spring.dispose();
    }

    // ── Pointer handlers ─────────────────────────────────────────────

    private coordOf(e: PointerEvent): number {
        return this.transform(this.axis === "x" ? e.clientX : e.clientY);
    }

    private handleDown(e: PointerEvent): void {
        const el = this.element;
        if (!el || this.dragging) return;

        this.capturedPointerId = e.pointerId;
        // Capture so moves/up are delivered even outside the element.
        el.setPointerCapture?.(e.pointerId);
        el.addEventListener("pointermove", this.onPointerMove);
        el.addEventListener("pointerup", this.onPointerUp);
        el.addEventListener("pointercancel", this.onPointerUp);

        const value = this.coordOf(e);
        // Seat the spring AT the grab point with zero velocity — the drag
        // pins the value to the pointer; momentum starts at release.
        this.spring.reset(value, 0);

        this.samples = [{ value, t: e.timeStamp }];
    }

    private handleMove(e: PointerEvent): void {
        if (e.pointerId !== this.capturedPointerId) return;
        const value = this.coordOf(e);
        // Track the pointer directly: set the live target. (The spring's
        // re-seat keeps the follow continuous; a stiff spring tracks 1:1.)
        this.spring.target = value;
        this.pushSample(value, e.timeStamp);
    }

    private handleUp(e: PointerEvent): void {
        if (e.pointerId !== this.capturedPointerId) return;
        const el = this.element;

        const value = this.coordOf(e);
        this.pushSample(value, e.timeStamp);
        const releaseVelocity = this.estimateVelocity();

        if (el) this.endGesture(el);

        // Hand the release velocity to the spring's re-seat. `reset(x, v)`
        // re-seats the closed-form solution from `(value, releaseVelocity)`
        // (spring.ts) so the fling is C¹-continuous with the gesture — the
        // trajectory leaves the release point at exactly the flick speed.
        this.spring.reset(value, releaseVelocity);
    }

    /**
     * End the current gesture: release capture + remove the per-gesture
     * listeners. Idempotent — safe when no gesture is active.
     */
    private endGesture(el: HTMLElement): void {
        if (this.capturedPointerId !== undefined) {
            el.releasePointerCapture?.(this.capturedPointerId);
        }
        el.removeEventListener("pointermove", this.onPointerMove);
        el.removeEventListener("pointerup", this.onPointerUp);
        el.removeEventListener("pointercancel", this.onPointerUp);
        this.capturedPointerId = undefined;
    }

    // ── Velocity sampling ────────────────────────────────────────────

    private pushSample(value: number, t: number): void {
        this.samples.push({ value, t });
        // Evict samples older than the window so the estimate tracks the
        // RECENT motion (a flick), not the whole drag.
        const cutoff = t - this.velocityWindow;
        let firstFresh = 0;
        while (
            firstFresh < this.samples.length - 1 &&
            this.samples[firstFresh]!.t < cutoff
        ) {
            firstFresh++;
        }
        if (firstFresh > 0) this.samples.splice(0, firstFresh);
    }

    /**
     * Release velocity = average pointer velocity over the sample window,
     * in units PER SECOND (the spring's clock). Estimated as `Δvalue / Δt`
     * across the oldest and newest retained samples — robust to a single
     * jittery last frame, unlike a two-point last-pair difference. Returns
     * 0 when there is insufficient motion (a tap, or a held release).
     */
    private estimateVelocity(): number {
        const n = this.samples.length;
        if (n < 2) return 0;
        const first = this.samples[0]!;
        const last = this.samples[n - 1]!;
        const dtMs = last.t - first.t;
        if (dtMs <= 0) return 0;
        // px/ms → units/s.
        return ((last.value - first.value) / dtMs) * 1000;
    }
}

/**
 * Functional sugar over {@link Draggable}: construct, `attach(element)`,
 * and return the instance — the one-call front door for the common case.
 * The returned `Draggable` exposes `.spring` (for `.play()` / fling-loop
 * ownership), `.subscribe()`, `.value`/`.velocity`/`.settled`, and
 * `.detach()`/`.dispose()`.
 */
export function drag(
    element: HTMLElement,
    options?: DragOptions,
): Draggable {
    const draggable = new Draggable(options);
    draggable.attach(element);
    return draggable;
}
